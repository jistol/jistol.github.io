---
layout: post
title: (JPA,SpringData) Named Query 사용하기 
category : Java
tags : [jpa,spring,springboot,springdata]
---
JPA를 사용하다보면 쿼리메소드만으로는 감당이 안되는 부분이 많아 `@Query`를 이용하여 아래와 같이 늘어놓기 시작합니다.

```java
@Query("select p from Post p where p.id > :id")
Post findPostByPk(@Param("id") Long id);
```

쿼리문이 짧을때는 상관없는데 쿼리문이 길어지고, 또 많아지면 그때부터는 관리가 안되기 시작하는데    
가급적 JPA의 장점을 살리면서 Native를 쓰지 않고 버티기 위해 아래와 같이 설정할 수 있습니다.

쿼리문 xml로 빼기 (export query string to orm.xml)
----
Post라는 Entity를 조회하기 위한 쿼리를 만들어보겠습니다.    
일단 여러개의 xml resource를 사용하기 위해 아래와 같이 설정했습니다.

```yaml
# application.yml
spring.jpa.orm:
  path: queries
  queries:
  - ${spring.jpa.orm.path}/post.xml
  - ${spring.jpa.orm.path}/user.xml
  ...
```

```java
@Configuration
public class JpaConfig extends HibernateJpaAutoConfiguration {
    @Data
    @Component
    @ConfigurationProperties("spring.jpa.orm")
    public class OrmProps {
        private String[] queries;
    }

    @Autowired private OrmProps ormProps;

    public JpaConfig(DataSource dataSource, JpaProperties jpaProperties, ObjectProvider<JtaTransactionManager> jtaTransactionManager, ObjectProvider<TransactionManagerCustomizers> transactionManagerCustomizers) {
        super(dataSource, jpaProperties, jtaTransactionManager, transactionManagerCustomizers);
    }

    @Bean
    @Override
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            EntityManagerFactoryBuilder factoryBuilder)
    {
        final LocalContainerEntityManagerFactoryBean ret = super.entityManagerFactory(factoryBuilder);
        ret.setMappingResources(ormProps.getQueries());
        return ret;
    }
}
```

쿼리문만 따로 모으고 싶어서 아래와 같이 배치하였습니다.

![query files under resource folder](/assets/img/java/jpa-namedquery/1.png)     

`@Query`어노테이션에 있던 쿼리문은 xml하위에 아래와 같이 정의합니다.    

```xml
<named-query name="Post.findPostByPk">
    <query><![CDATA[ select p from Post p where p.id > :id ]]></query>
</named-query>
```

그리고 dao 소스에서 `@Query`어노테이션을 제거해주면 끝.
```java
Post findPostByPk(@Param("id") Long id);
```

결과를 Map으로 받기
----
Entity의 전체 결과를 받아올수도 있지만 일부만 필요할 수 도 있습니다.  

```xml
<named-query name="Post.findPostByPk">
    <query><![CDATA[ select p.id, p.message, p.user from Post p where p.id > :id ]]></query>
</named-query>
```

위 결과를 Post객체로 받을 경우 리턴값이 Object[]이기 때문에 파싱 오류가 발생합니다.     
(아래 경우 `p.id`가 Long타입인데 저걸 Post객체로 변환하려 했기때문에 생기는 오류입니다.)

```console
[11-06 14:44:48.269] ERROR [http-nio-8080-exec-9] [o.a.j.l.DirectJDKLog.log]  181 - Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is org.springframework.core.convert.ConversionFailedException: Failed to convert from type [java.lang.Object[]] to type [io.github.jistol.geosns.jpa.entry.Post] for value '{65, 1234555666}'; nested exception is org.springframework.core.convert.ConverterNotFoundException: No converter found capable of converting from type [java.lang.Long] to type [io.github.jistol.geosns.jpa.entry.Post]] with root cause
org.springframework.core.convert.ConverterNotFoundException: No converter found capable of converting from type [java.lang.Long] to type [io.github.jistol.geosns.jpa.entry.Post]
	at org.springframework.core.convert.support.GenericConversionService.handleConverterNotFound(GenericConversionService.java:324)
	at org.springframework.core.convert.support.GenericConversionService.convert(GenericConversionService.java:206)
	at org.springframework.core.convert.support.ArrayToObjectConverter.convert(ArrayToObjectConverter.java:66)
	at org.springframework.core.convert.support.ConversionUtils.invokeConverter(ConversionUtils.java:37)
	...
```
  
`named-native-query`는 `result-class`, `result-map-class`등을 설정 할 수 있지만 JPA를 쓰면서 native쿼리 쓰려면 MyBatis를 쓰는게 더 낫다고 생각하기 때문에 다른 방법으로 해결하겠습니다.

1. Object[] 를 원하는 객체로 Application단에서 직접 바꾸기.(설명 생략)
2. Map으로 변환하여 결과 받기

[Hibernate Select clause](https://docs.jboss.org/hibernate/orm/3.3/reference/en/html/queryhql.html#queryhql-select)문서를 참고하면 HQL에서 어떻게 select한 값을 반환해주는지 잘 설명이 되어있습니다.    
(다행히도 JPQL에서도 동일하게 동작하는것 같습니다.)   
그 중 Map으로 반환받기 위해서는 아래와 같이 설정 가능합니다.

```xml
<named-query name="Post.findPostByPk">
    <query><![CDATA[ select new map(p.id, p.message, p.user) from Post p where p.id > :id ]]></query>
</named-query>
```

그리고 dao 소스에서도 Return객체를 Map으로 바꿔주면 정상동작합니다.
```java
Map<String, Object> findPostByPk(@Param("id") Long id);
```


참고
----
[Hibernate Select clause](https://docs.jboss.org/hibernate/orm/3.3/reference/en/html/queryhql.html#queryhql-select)     
[Spring Data JPA - 4.3.3 Using JPA NamedQueries](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods.named-queries)



