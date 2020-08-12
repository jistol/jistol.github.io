---
layout: post
title: (SpringBoot) No Spring WebApplicationInitializer types detected on classpath - 404
category : Spring
tags : [springboot,deploy,gradle,troubleshooting]
---
로컬환경에서 gradle bootRun을 통해 멀쩡하게 돌아가던 서버가 Tomcat WAS에 올렸더니 별다른 ERROR Log도 없이 모든 페이지가 404로 떴습니다.
혹시나 싶어 deploy path에 html파일 하나 만들어놓고 접근해보니 멀쩡하게 페이지가 나오더군요.
멘붕에 빠져 이것저것 건드리다가 신규 Tomcat버전의 문제인가, 신규 SpringBoot버전의 문제인가까지 찾던 도중 catalina log에서 아래와 같은 특이한 메시지를 찾았습니다.

```log
Info : No Spring WebApplicationInitializer types detected on classpath
```

(이런 중요한 정보가 INFO라니...)
WAS가 SpringBoot의 WAR파일을 인식하긴 했지만 WebApplicationInitializer를 찾지 못한 것이였는데
원인을 찾으려 또 별의 별 삽질을 하며 직접 main-class도 지정하고 구글링하니 Java Version 체크해보라고도 하고
거의 반나절을 헤메다가 원인을 찾았습니다.

SpringBoot Devtools을 사용하기 위해 dependencies에 걸어 두었는데 외부 WAS에 배포할때는 해당 설정을 다 빼고 배포하면 참조 안하겠다 싶어 `providedCompile`로 설정하고 application.yml에서 관련 설정을 빼고 배포했으나 이게 WAR로 배포되면서 오류를 발생시켰던 모양입니다.
해당 설정만 `compile`로 변경하였더니 잘 동작합니다.

```groovy
// build.gradle
dependencies {
    providedCompile("org.springframework.boot:spring-boot-devtools")  // ( X )
    compile("org.springframework.boot:spring-boot-devtools")          // ( O )
}
```

외부 WAS에서 오류 없이 SpringBoot Container가 올라오지 않는다면 `provided`로 설정한 값 중 문제가 있는건 없는지 확인부터 해 보면 좋습니다.
