---
layout: post
title: "[Spring] Spring Data Rest Repository Not Working"
category : Java
tags : [spring,springboot,jpa,springdata,rest,troubleshooting]
---

이슈
----    

오랜만에 SpringBoot로 간단한 REST API 서버를 만들어 볼 일이 생겨서 [Spring Initializr](https://start.spring.io/)를 통해 아래 모듈을 추가하여 작업했습니다.

```text
// build.gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-data-rest'
	implementation 'org.springframework.data:spring-data-rest-hal-browser'
	compileOnly 'org.projectlombok:lombok'
	runtimeOnly 'com.h2database:h2'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```
    
```yaml
spring :
    datasource :
        url : jdbc:h2:mem:data
        driverClassName : org.h2.Driver
        username : sa
        password : 1234
    jpa :
        database-platform : org.hibernate.dialect.H2Dialect
        show-sql: true
        generate-ddl: true
    h2.console :
        enabled : true
        path : /h2-console
        settings :
            trace : false
            web-allow-others : false
    data:
        rest:
            base-path: /api
```    

```java
@Data
@Entity
@Table(name = "article")
public class Article implements Serializable {
    @Id
    @GeneratedValue
    private long articleNo;
    
    @NotNull
    private String title;
    
    @Lob
    @NotNull
    private String content;
    
    ...
}

@RepositoryRestResource
public interface ArticleDao extends CrudRepository<Article, Long> {
    List<Article> findById(@Param("articleNo") long articleNo);
}

@Configuration
@EnableJpaRepositories
public class JpaConfig {
    
}

@SpringBootApplication
public class DemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
```

워낙에 spring-data-rest는 별도 설정할게 없는지라 잘 되겠지 하고 bootRun!! 1.5.X 버전때는 맵핑되는 Request 주소들이 기동시 로그에 다 찍혔는데 2.x 버전에서는 기본적으로 찍히지가 않았습니다. (그냥 그려려니...)       

```text
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v2.1.9.RELEASE)

2019-10-13 23:54:49.092  INFO 9085 --- [  restartedMain] com.example.demo.DemoApplication         : Starting DemoApplication on documents.ct.infn.it with PID 9085 (/Users/jistol/Downloads/demo/out/production/classes started by jistol in /Users/jistol/Downloads/demo)
2019-10-13 23:54:49.096  INFO 9085 --- [  restartedMain] com.example.demo.DemoApplication         : No active profile set, falling back to default profiles: default
2019-10-13 23:54:49.161  INFO 9085 --- [  restartedMain] .e.DevToolsPropertyDefaultsPostProcessor : Devtools property defaults active! Set 'spring.devtools.add-properties' to 'false' to disable
2019-10-13 23:54:49.161  INFO 9085 --- [  restartedMain] .e.DevToolsPropertyDefaultsPostProcessor : For additional web related logging consider setting the 'logging.level.web' property to 'DEBUG'
2019-10-13 23:54:49.979  INFO 9085 --- [  restartedMain] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data repositories in DEFAULT mode.
2019-10-13 23:54:50.006  INFO 9085 --- [  restartedMain] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 8ms. Found 0 repository interfaces.
2019-10-13 23:54:50.570  INFO 9085 --- [  restartedMain] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.transaction.annotation.ProxyTransactionManagementConfiguration' of type [org.springframework.transaction.annotation.ProxyTransactionManagementConfiguration$$EnhancerBySpringCGLIB$$3c00740f] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying)
2019-10-13 23:54:50.592  INFO 9085 --- [  restartedMain] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.hateoas.config.HateoasConfiguration' of type [org.springframework.hateoas.config.HateoasConfiguration$$EnhancerBySpringCGLIB$$bb80c141] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying)
2019-10-13 23:54:51.019  INFO 9085 --- [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8099 (http)
2019-10-13 23:54:51.043  INFO 9085 --- [  restartedMain] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2019-10-13 23:54:51.043  INFO 9085 --- [  restartedMain] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.26]
2019-10-13 23:54:51.135  INFO 9085 --- [  restartedMain] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2019-10-13 23:54:51.136  INFO 9085 --- [  restartedMain] o.s.web.context.ContextLoader            : Root WebApplicationContext: initialization completed in 1975 ms
2019-10-13 23:54:51.436  INFO 9085 --- [  restartedMain] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2019-10-13 23:54:51.702  INFO 9085 --- [  restartedMain] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
2019-10-13 23:54:51.779  INFO 9085 --- [  restartedMain] o.hibernate.jpa.internal.util.LogHelper  : HHH000204: Processing PersistenceUnitInfo [
	name: default
	...]
2019-10-13 23:54:51.890  INFO 9085 --- [  restartedMain] org.hibernate.Version                    : HHH000412: Hibernate Core {5.3.12.Final}
2019-10-13 23:54:51.892  INFO 9085 --- [  restartedMain] org.hibernate.cfg.Environment            : HHH000206: hibernate.properties not found
2019-10-13 23:54:52.125  INFO 9085 --- [  restartedMain] o.hibernate.annotations.common.Version   : HCANN000001: Hibernate Commons Annotations {5.0.4.Final}
2019-10-13 23:54:52.323  INFO 9085 --- [  restartedMain] org.hibernate.dialect.Dialect            : HHH000400: Using dialect: org.hibernate.dialect.H2Dialect
Hibernate: drop table article if exists
Hibernate: drop table post if exists
Hibernate: drop sequence if exists hibernate_sequence
Hibernate: create sequence hibernate_sequence start with 1 increment by 1
Hibernate: create table article (article_no bigint not null, content clob not null, created_by varchar(255) not null, created_date timestamp not null, title varchar(255) not null, update_by varchar(255) not null, updated_date timestamp not null, primary key (article_no))
Hibernate: create table post (post_no bigint not null, title varchar(255) not null, primary key (post_no))
2019-10-13 23:54:53.233  INFO 9085 --- [  restartedMain] o.h.t.schema.internal.SchemaCreatorImpl  : HHH000476: Executing import script 'org.hibernate.tool.schema.internal.exec.ScriptSourceInputNonExistentImpl@7f47a56f'
2019-10-13 23:54:53.237  INFO 9085 --- [  restartedMain] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2019-10-13 23:54:53.319  INFO 9085 --- [  restartedMain] o.s.b.d.a.OptionalLiveReloadServer       : LiveReload server is running on port 35729
2019-10-13 23:54:54.058  INFO 9085 --- [  restartedMain] o.s.s.concurrent.ThreadPoolTaskExecutor  : Initializing ExecutorService 'applicationTaskExecutor'
2019-10-13 23:54:54.120  WARN 9085 --- [  restartedMain] aWebConfiguration$JpaWebMvcConfiguration : spring.jpa.open-in-view is enabled by default. Therefore, database queries may be performed during view rendering. Explicitly configure spring.jpa.open-in-view to disable this warning
2019-10-13 23:54:54.584  INFO 9085 --- [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8099 (http) with context path ''
2019-10-13 23:54:54.589  INFO 9085 --- [  restartedMain] com.example.demo.DemoApplication         : Started DemoApplication in 6.029 seconds (JVM running for 7.371)
```
        
그래도 H2 DB에 알아서 테이블이 잘 생성됬길래 Entity랑 Repository 설정은 다 잘 붙었나보다 하며 만들어진 API를 보기 위해 Hal-Browser로 접속했는데 profile 외에 아무것도 생성되지 않았습니다.           

![not working REST Repository](/assets/img/java/spring-data-rest-not-working/1.png)    

해결
----    
원인은 패키지 구조에서 찾았는데 Configuration을 선언해둔 JpaConfig의 위치가 이슈였습니다.    

![wrong position](/assets/img/java/spring-data-rest-not-working/2.png)    

Entity 클래스는 com.example.demo.entity 하위에 위치하는데 `@EnableJpaRepositories`을 선언한 설정 클래스는 com.example.demo.config 하위에 위치해 있었던 거죠.    
JPA 설정은 알아서 잘 찾길래 딱히 basePackage 위치도 지정하지 않았는데 Rest Repository 설정엔 영향을 끼치는 것 같습니다. 사실 위 설정 클래스 자체가 없어도 `@SpringBootApplication`가 설정된 클래스 하위에 위치하면 알아서 스캔하기 때문에 JPA가 잘 동작하는데 말이죠. 

```java
/*  그냥 날려 버리거나 basePackages 설정을 추가합니다.
@Configuration
@EnableJpaRepositories(basePackages = "com.example.demo")
public class JpaConfig {
    
}
*/
```    

![resolve issue](/assets/img/java/spring-data-rest-not-working/3.png)      

위와 같이 Entity들의 CRUD Request Path가 잘 생성 된 것을 확인 할 수 있습니다.    






