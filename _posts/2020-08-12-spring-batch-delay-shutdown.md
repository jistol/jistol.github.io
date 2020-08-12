---
layout: post
title: (SpringBatch) Job 종료 후 스프링 프로세스가 늦게 끝나는 현상
category : Spring
tags : [jpa,spring,springboot,springdata,springbatch]
---
배치 구성을 위해 작업중 발생한 이슈로, Job이 모두 끝났음에도 불구하고 스프링 프로세스가 계속 유지되다 1분후에 종료되는 현상이 있었습니다.

### 구성 ###
- Spring boot 2.3.2
- Spring batch
- Spring data jpa
- 기타 등등...

위와 같은 구성으로 배치 프로젝트를 구성하고 간단한 테스트 Job을 만들었습니다.

```java
@EnableBatchProcessing
@SpringBootApplication
public class BatchApplication {
    public static void main(String[] args) {
        SpringApplication.run(BatchApplication.class, args);
    }
}

@Slf4j
@Configuration
@RequiredArgsConstructor
public class TestJobConfig {
    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;

    @Bean
    @JobScope
    public Step testStep() {
        return stepBuilderFactory.get("testStep")
            .tasklet((contribution, chunkContext) -> {

                ......

                return RepeatStatus.FINISHED;
            })
            .build();
    }

    @Bean
    public Job testJob() {
        return jobBuilderFactory.get("testJob")
            .start(testStep())
            .listener(listener())
            .build();
    }

    @Bean
    public JobExecutionListener listener() {
        return new JobExecutionListener() {
            @Override
            public void beforeJob(JobExecution jobExecution) {
                log.warn("Job Start !!!");
            }

            @Override
            public void afterJob(JobExecution jobExecution) {
                log.warn("Job End !!!");
            }
        };
    }
}
```

```groovy
// build.gradle
dependencies {
    implementation "org.springframework.boot:spring-boot-starter-jdbc:${springBootVersion}"
    implementation "org.springframework.boot:spring-boot-starter-data-jpa:${springBootVersion}"
    implementation "org.springframework.boot:spring-boot-starter-batch:${springBootVersion}"

    ......

    testImplementation('org.springframework.boot:spring-boot-starter-test') {
        exclude group: 'org.junit.vintage', module: 'junit-vintage-engine'
    }

    testImplementation "org.springframework.batch:spring-batch-test"
}
```

테스트를 위해 별다른 로직 없이 간단하게 구성하였으며 시작과 종료시점에 로그를 남기 상태입니다.
현 상태에서 실행하게 되면 아래 로그와 같이 Job이 종료한 시점으로부터 1분이 지나서야 스프링 프로세스가 종료되는 것을 확인 할 수 있습니다.

```text
2020-08-12 20:49:16 [restartedMain] INFO  o.s.b.a.b.JobLauncherApplicationRunner - Running default command line with: [requestDate=32]
2020-08-12 20:49:17 [restartedMain] INFO  o.s.b.c.l.support.SimpleJobLauncher - Job: [SimpleJob: [name=testJob]] launched with the following parameters: [{requestDate=32}]

// Job 시작 시
2020-08-12 20:49:17 [restartedMain] WARN  c.k.m.s.batch.config.TestJobConfig - Job Start !!!
2020-08-12 20:49:17 [restartedMain] INFO  o.s.batch.core.job.SimpleStepHandler - Executing step: [testStep]
2020-08-12 20:49:17 [restartedMain] WARN  c.k.m.s.batch.config.TestJobConfig - requestDate=>32
2020-08-12 20:49:17 [restartedMain] INFO  o.s.batch.core.step.AbstractStep - Step: [testStep] executed in 34ms
2020-08-12 20:49:17 [restartedMain] WARN  c.k.m.s.batch.config.TestJobConfig - Job End !!!
2020-08-12 20:49:17 [restartedMain] INFO  o.s.b.c.l.support.SimpleJobLauncher - Job: [SimpleJob: [name=testJob]] completed with the following parameters: [{requestDate=32}] and the following status: [COMPLETED] in 100ms
// Job 종료

// 스프링 프로세스 종료
2020-08-12 20:50:16 [SpringContextShutdownHook] INFO  o.s.o.j.LocalContainerEntityManagerFactoryBean - Closing JPA EntityManagerFactory for persistence unit 'default'
2020-08-12 20:50:16 [SpringContextShutdownHook] INFO  o.s.s.c.ThreadPoolTaskExecutor - Shutting down ExecutorService 'applicationTaskExecutor'
2020-08-12 20:50:16 [SpringContextShutdownHook] INFO  com.zaxxer.hikari.HikariDataSource - HikariPool-1 - Shutdown initiated...
2020-08-12 20:50:16 [SpringContextShutdownHook] INFO  com.zaxxer.hikari.HikariDataSource - HikariPool-1 - Shutdown completed.
Disconnected from the target VM, address: '127.0.0.1:60141', transport: 'socket'

Process finished with exit code 1
```

처음에는 Spring batch 쪽 이슈로 생각되었으나 공식 Github Issue에 올라온 내용에 따르면 Spring boot(jpa) 쪽 이슈라고 합니다.

원인은 Spring boot의 빠른 초기 기동을 위해 적용된 jpa의 `bootstrap-mode` 이슈로 `application.yml`에 다음과 같이 설정하여 해결 할 수 있습니다.

```yaml
data.jpa.repositories.bootstrap-mode: default
```

위 기능은 초기화에 많은 시간을 잡아먹는 repository들의 초기화를 늦춰 boot의 기동시간을 단축 시키는 모드인데, 2.3.2 기준으로 기본값은 `deferred`로 지연로딩되고 백그라운드 스레드에 의해 특정 시점에 초기화 됩니다.
더 자세한 설명은 [Spring Data JPA - Reference Documentation - Bootstrap Mode](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.bootstrap-mode)를 참고하세요.

(직접 디버깅을 하진 못했으나)가설을 세워보면 스프링 프로세스가 기동되면서 백그라운드 스레드는 특정 이벤트가 발생하는 시점까지 대기 하고 있는데, 배치의 Job이 먼저 끝나버리고 초기화가 끝나지 않은 스프링은 초기화를 마친 후 프로세스를 다시 종료한 것으로 유추되어 Job 실행을 1분이상 걸리도록 수정한 후 다시 테스트 하였습니다.
테스트 결과, 아래와 같이 Job이 종료된 이후 스프링 프로세스도 바로 종료 됨을 확인 할 수 있었습니다.

```text
2020-08-12 21:26:37 [restartedMain] INFO  o.s.b.c.l.support.SimpleJobLauncher - Job: [SimpleJob: [name=testJob]] launched with the following parameters: [{requestDate=31}]

// Job 시작
2020-08-12 21:26:37 [restartedMain] WARN  c.k.m.s.batch.config.TestJobConfig - Job Start !!!
2020-08-12 21:26:37 [restartedMain] INFO  o.s.batch.core.job.SimpleStepHandler - Executing step: [testStep]
2020-08-12 21:26:37 [restartedMain] WARN  c.k.m.s.batch.config.TestJobConfig - requestDate=>31

// 2분여간 대기후 종료
2020-08-12 21:28:37 [restartedMain] INFO  o.s.batch.core.step.AbstractStep - Step: [testStep] executed in 2m0s53ms
2020-08-12 21:28:37 [restartedMain] WARN  c.k.m.s.batch.config.TestJobConfig - Job End !!!
2020-08-12 21:28:37 [restartedMain] INFO  o.s.b.c.l.support.SimpleJobLauncher - Job: [SimpleJob: [name=testJob]] completed with the following parameters: [{requestDate=31}] and the following status: [COMPLETED] in 2m0s121ms

// 스프링 프로세스 종료
2020-08-12 21:28:37 [SpringContextShutdownHook] INFO  o.s.o.j.LocalContainerEntityManagerFactoryBean - Closing JPA EntityManagerFactory for persistence unit 'default'
2020-08-12 21:28:37 [SpringContextShutdownHook] INFO  o.s.s.c.ThreadPoolTaskExecutor - Shutting down ExecutorService 'applicationTaskExecutor'
2020-08-12 21:28:37 [SpringContextShutdownHook] INFO  com.zaxxer.hikari.HikariDataSource - HikariPool-1 - Shutdown initiated...
2020-08-12 21:28:37 [SpringContextShutdownHook] INFO  com.zaxxer.hikari.HikariDataSource - HikariPool-1 - Shutdown completed.
Disconnected from the target VM, address: '127.0.0.1:60519', transport: 'socket'

Process finished with exit code 0
```

### 참고 ###
[Spring Batch - Spring Boot batch job does not shut down automatically after completion when using JPA](https://github.com/spring-projects/spring-batch/issues/3725)
[Spring Boot - Spring Boot batch job does not shut down automatically after completion when using JPA](https://github.com/spring-projects/spring-boot/issues/22092)

