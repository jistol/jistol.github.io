---
layout: post
title: "org.springframework.data.mapping.PropertyReferenceException: No property undefined found for type"
category : Spring
tags : [springboot,jpa,troubleshooting]
---

원인
----
SpringBoot + JPA 환경에서 작업을 하다가 아래와 같은 에러를 만났습니다.

```console
org.springframework.data.mapping.PropertyReferenceException: No property undefined found for type PartnerPaymentRefundInfo!
at org.springframework.data.mapping.PropertyPath.<init>(PropertyPath.java:77)
at org.springframework.data.mapping.PropertyPath.create(PropertyPath.java:329)
at org.springframework.data.mapping.PropertyPath.create(PropertyPath.java:309)
at org.springframework.data.mapping.PropertyPath.from(PropertyPath.java:272)
at org.springframework.data.mapping.PropertyPath.from(PropertyPath.java:243)
at org.springframework.data.jpa.repository.query.QueryUtils.toJpaOrder(QueryUtils.java:542)
```

JPA 작업을 하기 전까지는 오류가 안나길래 JPA설정 문제인가 하고 헤매다보니 원인은 다른곳에 있었습니다.

결론
----
Controller에서 인자값으로 `Pageable` 정보를 받아와 JPA Repository에 넘겨 조회를 하는데 아래와 같이 넘기는 값중에 `undefined`가 있었습니다.

```
http://localhost/api?page=0&size=15&sort=undefined%2Casc
```

Controller에서 다른 작업실행시에는 별 탈이 없다가 JPA Repository에서 쿼리시 `Pageable`의 sort변수에 `undefined`를 파싱하지 못해 오류가 발생한 케이스입니다.


