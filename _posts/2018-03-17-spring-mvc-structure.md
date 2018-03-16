---
layout: post
title: Spring MVC 생명주기
category : Java
tags : [spring,mvc]
---
Spring 처음 접할때 공부하고 정형화된 틀 안에서 쓰다보니 어떤 구조로 동작하는지 잊고 쓰다가 한 번 소스까서 보면서 정리해봅니다.
특히 정말 SpringBoot 기반으로 개발을 하니깐 DispatchServlet 조차 처음 보는것 같더군요.     

![MVC Structure](/assets/img/java/spring-mvc-structure/1.png)     

다른 웹페이지 자료들을 보면 좀 모양새가 다른데 소스 기준으로 정리하다보니 이런 구조로 그렸네요.

요청 순서
----

1. 요청받은 Request로부터 실행할 Controller 추출을 위해 HandlerMapping 을 통해 실행할 Handler및 Interceptor를 전달

2. Interceptor의 preHandle을 실행

3. HandlerAdapter에 Handler를 전달하여 해당 Controller의 Argument매핑및 Method Invoke 실행하고 결과를 ModelAndView 형태로 반환

4. Interceptor의 postHandle을 실행

5. Resolver를 통해 실제 보여줄 View를 렌더링하여 Response에 Write

6. Interceptor의 afterCompletion 을 실행 


