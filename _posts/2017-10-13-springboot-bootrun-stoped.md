---
layout: post
title: (SpringBoot) bootRun 실행중 멈춤 현상
category : Spring
tags : [springboot,bootrun,gradle]
---
gradle bootRun을 통해 SpringBoot를 실행하던 도중 아래와 같이 로그가 찍히고 멈춰서 더이상 동작하지 않는 현상이 발생하였습니다.

```console
오전 11:27:32: Executing external task 'bootRun -Dspring.profiles.active=local'...
:compileJava UP-TO-DATE
:processResources
:classes
:findMainClass
Connected to the target VM, address: '127.0.0.1:61333', transport: 'socket'
:bootRun
11:27:33.296 [main] DEBUG org.springframework.boot.devtools.settings.DevToolsSettings - Included patterns for restart : []
11:27:33.300 [main] DEBUG org.springframework.boot.devtools.settings.DevToolsSettings - Excluded patterns for restart : [/spring-boot-starter/target/classes/, /spring-boot-autoconfigure/target/classes/, /spring-boot-starter-[\w-]+/, /spring-boot/target/classes/, /spring-boot-actuator/target/classes/, /spring-boot-devtools/target/classes/]
11:27:33.301 [main] DEBUG org.springframework.boot.devtools.restart.ChangeableUrls - Matching URLs for reloading : [file:/Users/jistol/IdeaProjects/github/geo-sns/src/main/resources/, file:/Users/jistol/IdeaProjects/github/geo-sns/build/classes/java/main/, file:/Users/jistol/IdeaProjects/github/geo-sns/build/resources/main/]
```

기다려도 오류도 안나고 아무런 메시지 없이 멈춰 있어서 디버깅 해본 결과 application.yml 파일을 잘못 설정했을때 위와 같이 멈춰버립니다.

```yaml
# 예시
base.url : localhost

# ERROR : base.url을 사용하기 위해서는 ${base.url}로 표기해야합니다.
call-url : {base.url}/call
```

application.yml파일을 파싱하지 못하여 내부적으로 오류가 나지만 따로 찍어주진 않고 SpringBoot를 deploy하지 못한채 끝나버립니다.
