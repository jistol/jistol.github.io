---
layout: post
title: (SpringBoot) MVC 테스트 하기 - `@WebMvcTest`, `@AutoConfigureMockMvc`
category : Java
tags : [springboot,webmvctest,junit,WebMvcTest,AutoConfigureMockMvc]
---
[SpringBoot Reference](http://docs.spring.io/spring-boot/docs/2.0.0.BUILD-SNAPSHOT/reference/htmlsingle/)에 접속하여 목차를 보면 거의 끝쯤에 Testing관련 내용이 나옵니다.   
이 중 SpringBoot의 Controller를 JUnit으로 테스트 하고 싶은 경우 [41.3.7 Auto-configured Spring MVC tests](http://docs.spring.io/spring-boot/docs/2.0.0.BUILD-SNAPSHOT/reference/htmlsingle/#boot-features-testing-spring-boot-applications-testing-autoconfigured-mvc-tests)를 보면 Http Connection을 별도 구현하지 않고도 MVC 테스트를 가능하게 하는 설명이 나옵니다.    

![캡처화면](/assets/img/java/springboot-mvctest/1.png)

@WebMvcTest
----
일반적으로 사용하는 MVC테스트용 어노테이션입니다.   
해당 어노테이션을 명시하고 그림과 같이 `MockMvc`를 `@Autowired`하면 해당 객체를 통해 MVC테스트가 가능합니다.   

![@WebMvcTest사용시 주의사항 1](/assets/img/java/springboot-mvctest/2.png)

`@WebMvcTest`어노테이션 사용시 `@SpringBootTest`을 같이 사용할 수 없습니다.   
서로 `MockMvc`를 설정하기 때문에 충돌이 나는거 같은데요, MVC 기능만 사용할 거라면 `@WebMvcTest`를 사용하면 됩니다.

![@WebMvcTest사용시 주의사항 2](/assets/img/java/springboot-mvctest/3.png)

`@WebMvcTest` 사용시 다른 설정들은 자동으로 올리지 않기 때문에 `@Repository`나 `@Resource`, `@Service`, `@Component`등은 사용할 수 없습니다.   
아래 글과 같이 자동설정하는 영역은 `@Controller`, `@ControllerAdvice`, `@JsonComponent` 등등이네요.    
그런데 저는 실제로 테스트 해보니 `@ControllerAdvice`도 먹히지 않았습니다. (이유는 아직도 모르는중...)

![@WebMvcTest사용시 주의사항 3](/assets/img/java/springboot-mvctest/4.png)

`@WebMvcTest`가 포함하는 실제 설정은 [Appendix D. Test auto-configuration annotations](http://docs.spring.io/spring-boot/docs/2.0.0.BUILD-SNAPSHOT/reference/htmlsingle/#test-auto-configuration)에서 확인 가능 합니다.

![@WebMvcTest이 포함하는 설정](/assets/img/java/springboot-mvctest/5.png)

@AutoConfigureMockMvc
----
`@WebMvcTest`외에 MVC테스트를 할 수 있는 다른 방법입니다.   
위 설정은 MVC테스트 외 모든 설정을 같이 올립니다. AOP도 되고 JPA Repository도 사용가능하네요.   
실제적으로 동작하는 MVC테스트를 하려면 위 어노테이션을 사용해야 합니다.   
`@AutoConfigureMockMvc`은 `@SpringBootTest`와 같이 사용 가능합니다.
