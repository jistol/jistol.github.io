---
layout: post
title: (SpringBoot) JPA Entity와 DB 컬럼 맵핑 방식 (hibernate naming-strategy) 
category : Java
tags : [springboot,jpa,hibernate,naming-strategy,implicit-strategy,physical-strategy]
---

SpringBoot에서 JPA사용시 Entity의 변수와 DB 컬럼명을 맵핑 시키는 방법은 아래와 같습니다.

SpringBoot ~ v.1.3
----
기본적으로 SpringBoot 1.4 이전버전은 맵핑 전략으로 `org.springframework.boot.orm.jpa.hibernate.SpringNamingStrategy`을 사용합니다.    
아래 소스와 같이 Java단에서 camelCase로 작성한 변수를 자동으로 snake_case형식의 DB 컬럼명으로 변경하여 맵핑해 줍니다. 

```java
@Entity
@Table(name="t_user")
@Data
public class User {
  
  private String userId;  // --> t_user.user_id 컬럼과 맵핑
  
}
```

### DB컬럼명을 snake_case로 사용하지 않을 경우 ###

DB컬럼명을 snake_case로 사용하지 않을 경우 해결 방법은 아래 두가지 방식이 있습니다.

1. @Colume어노테이션 사용    
```java
@Column(name = "userId")
private String userId;
```

2. Naming Strategy 변경
```yaml
## application.yml
spring.jpa.hibernate.naming-strategy: org.hibernate.cfg.EJB3NamingStrategy
```

SpringBoot v.1.4 ~
----



For hibernate5 I solved this issue by puting next lines in my application.properties file:

spring.jpa.hibernate.naming.implicit-strategy=org.hibernate.boot.model.naming.ImplicitNamingStrategyLegacyJpaImpl
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl



spring.jpa.hibernate.naming.implicit-strategy= # Hibernate 5 implicit naming strategy fully qualified name.
spring.jpa.hibernate.naming.physical-strategy= # Hibernate 5 physical naming strategy fully qualified name.
spring.jpa.hibernate.naming.strategy= # Hibernate 4 naming strategy fully qualified name. Not supported with Hibernate 5.


참고
----
[Spring Boot + JPA : Column name annotation ignored](https://stackoverflow.com/questions/25283198/spring-boot-jpa-column-name-annotation-ignored)
[Java: Default Spring Boot/Data JPA naming strategy](https://smarterco.de/java-spring-boot-spring-data-jpa-naming-strategy/)
[]()
