---
layout: post
title: (SpringBoot) application.yml에서 placeholder 기능 동작안할때
category : Spring
tags : [springboot,placeholder,troubleshooting]
---
application.yml 파일을 아래와 같이 만들고 실행했습니다.

```yaml
app.url: http://localhost:${server.port}/
app.domain1: ${app.url}/domain/1
```

```java
@Value("${app.domain1}") private String domain1;

public void print() {
  System.out.println(domain1);
}
```

소스에서 위와 같이 참조하면 `http://localhost:8080/domain/1`로 출력 되기를 기대했으나 `${app.url}/domain/1` 로 출력됩니다.

문제는 `app.url`에 설정한 `server.port`값을 application.yml 파일에 명시하지 않아 생긴 문제로
SpringBoot의 Placeholder가 파싱할때 참조 값이 없어 `app.url`값을 파싱하지 못하면서 다른 placeholder 설정들도 모두 일반 text로 인식해버리는 문제입니다.
아래와 같이 명시해주면 정상동작합니다.

```yaml
server.port: 8080
app.url: http://localhost:${server.port}/
app.domain1: ${app.url}/domain/1
```

참고
----
[Part IV. Spring Boot features - Placeholders in properties](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html#boot-features-external-config-placeholders-in-properties)
