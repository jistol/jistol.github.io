---
layout: post
title: "Tomcat 8 error - java.lang.IllegalArgumentException: An invalid domain [.xxxx.com] was specified for this cookie" 
category : Java
tags : [tomcat,cookie,rfc6265,troubleshooting]
---
증상
----
여러 서브도메인에서 쿠키를 공유하기 위해 `.xxxx.com` 같이 쿠키 도메인을 설정하는 케이스가 있습니다.

```java
// sub domain list : sub1.xxxx.com, sub2.xxxx.com, sub3.xxxx.com
cookie.setDomain(".xxxx.com");
```

위와 같이 사용시 Tomcat 8버전 이상 사용할 경우 아래와 같은 에러를 만나게 됩니다.

```console
java.lang.IllegalArgumentException: An invalid domain [.xxxx.com] was specified for this cookie
```

원인
----
tomcat 8버전 이상에서는 Cookie Header를 파싱하는 기본 CookieProcessor가 RFC6265를 기반으로 합니다. (`org.apache.tomcat.util.http.Rfc6265CookieProcessor`)       
RFC6265의 속성중 하나는 아래와 같은데

```text
5.2.3.  The Domain Attribute

   If the attribute-name case-insensitively matches the string "Domain",
   the user agent MUST process the cookie-av as follows.

   If the attribute-value is empty, the behavior is undefined.  However,
   the user agent SHOULD ignore the cookie-av entirely.

   If the first character of the attribute-value string is %x2E ("."):

      Let cookie-domain be the attribute-value without the leading %x2E
      (".") character.

   Otherwise:

      Let cookie-domain be the entire attribute-value.

   Convert the cookie-domain to lower case.

   Append an attribute to the cookie-attribute-list with an attribute-
   name of Domain and an attribute-value of cookie-domain.
```

Domain값 맨 앞자리에 "."을 붙일 경우 "."을 제거하고 파싱하게 됩니다.

해결
----
위와 같은 현상을 막기 위해 `org.apache.tomcat.util.http.LegacyCookieProcessor` 클래스를 제공합니다.    
위 클래스는 RFC6265, RFC2109, RFC2616 기반으로 파싱하며 쿠키 작업의 에약을 여러 옵션을 통해 풀 수 있도록 제공하는데    
Tomcat 서버 사용시 context.xml에 아래와 같이 추가해주면 됩니다.

```xml
<CookieProcessor className="org.apache.tomcat.util.http.LegacyCookieProcessor"/>
```

만약 SpringBoot에서 Embedded Tomcat을 사용하고 있다면 아래와 같이 설정 할 수 있습니다.

```java
@Bean
public EmbeddedServletContainerCustomizer tomcatCustomizer() {
    return container -> {
        if (container instanceof TomcatEmbeddedServletContainerFactory) {
            TomcatEmbeddedServletContainerFactory tomcat = (TomcatEmbeddedServletContainerFactory) container;
            tomcat.addContextCustomizers(context -> context.setCookieProcessor(new LegacyCookieProcessor()));
        }
    };
}
```

참고
----
[Apache Tomcat 8 Configuration Reference - The Cookie Processor Component](https://tomcat.apache.org/tomcat-8.5-doc/config/cookie-processor.html)      
[RFC 6265 - HTTP State Management Mechanism - IETF Tools](https://tools.ietf.org/html/rfc6265)      
[RFC 2109 - HTTP State Management Mechanism - IETF Tools](https://tools.ietf.org/html/rfc2109)      
[java.lang.IllegalArgumentException: An invalid domain .test.com was specified for this cookie](http://www.voidcn.com/article/p-xpoujgfy-bkq.html)       
