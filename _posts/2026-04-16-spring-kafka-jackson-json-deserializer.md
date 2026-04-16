---
layout: post
title: (Spring Kafka) JacksonJsonDeserializer 설정 옵션 정리
category : Spring
tags : [spring, kafka, kotlin]
---

JacksonJsonDeserializer
----
Spring Kafka가 제공하는 JSON 역직렬화기로, Kafka 메시지의 value를 Jackson으로 Java/Kotlin 객체로 변환한다.

```kotlin
val javaType = jacksonObjectMapper().constructType(typeRef)
val deserializer = JacksonJsonDeserializer<T>(javaType).apply {
    addTrustedPackages("com.foo")
    setUseTypeHeaders(false)
}
```

addTrustedPackages
----
역직렬화 시 허용할 패키지를 지정하는 보안 설정이다.

* Spring Kafka의 `JsonDeserializer`는 기본적으로 **임의의 클래스 역직렬화를 차단**한다 (원격 코드 실행 등 보안 위협 방지).
* 역직렬화 대상 클래스가 신뢰된 패키지에 속하지 않으면 예외가 발생한다.
* `addTrustedPackages("*")`로 모든 패키지를 허용할 수도 있지만, 프로덕션에서는 필요한 패키지만 명시하는 것이 권장된다.

```kotlin
// com.foo 하위 클래스만 역직렬화 허용
addTrustedPackages("com.foo")
```

setUseTypeHeaders
----
Kafka 메시지 헤더에 포함된 타입 정보를 사용할지 여부를 설정한다.

* `true` (기본값): 메시지 헤더(`__TypeId__`)에 담긴 클래스 정보를 읽어 해당 타입으로 역직렬화한다. Producer가 `JsonSerializer`로 보낸 메시지에는 이 헤더가 자동으로 붙는다.
* `false`: 헤더를 무시하고, **생성자에서 지정한 타입으로만 역직렬화**한다.

```kotlin
// 헤더 무시 → 항상 javaType으로 역직렬화
setUseTypeHeaders(false)
```

`false`로 설정하는 주요 사유는 다음과 같다.
* Producer가 다른 시스템이라 `__TypeId__` 헤더가 없거나 다른 클래스명을 사용하는 경우
* 헤더의 타입 정보를 신뢰하지 않고 명시적으로 타입을 고정하고 싶은 경우

setRemoveTypeHeaders
----
역직렬화 후 타입 관련 헤더(`__TypeId__`, `__KeyTypeId__`, `__ContentTypeId__`)를 메시지에서 제거할지 여부를 설정한다.

* `true` (기본값): 역직렬화 후 타입 헤더를 제거한다.
* `false`: 타입 헤더를 그대로 유지한다. 하나의 메시지를 여러 Consumer가 순차적으로 읽거나, 다운스트림에서도 타입 정보가 필요한 경우에 사용한다.

```kotlin
setRemoveTypeHeaders(false)
```

setTypeMapper
----
기본 타입 매퍼(`DefaultJackson2JavaTypeMapper`)를 커스텀 매퍼로 교체한다. 타입 헤더의 해석 방식을 완전히 제어하고 싶을 때 사용한다.

```kotlin
val mapper = DefaultJackson2JavaTypeMapper().apply {
    setTypePrecedence(Jackson2JavaTypeMapper.TypePrecedence.TYPE_ID)
    addTrustedPackages("com.foo")
}
setTypeMapper(mapper)
```

setTypeFunction
----
바이트 배열과 헤더를 받아 동적으로 역직렬화 대상 `JavaType`을 결정하는 함수를 지정한다. 하나의 토픽에 여러 타입의 메시지가 섞여 있을 때 유용하다.

```kotlin
setTypeFunction { data, headers ->
    val typeHeader = String(headers.lastHeader("messageType").value())
    when (typeHeader) {
        "ORDER" -> jacksonObjectMapper().constructType(Order::class.java)
        "PAYMENT" -> jacksonObjectMapper().constructType(Payment::class.java)
        else -> jacksonObjectMapper().constructType(Map::class.java)
    }
}
```

setUseTypeMapperForKey
----
기본 타입 매퍼가 key 타입 헤더(`__KeyTypeId__`)를 참조하도록 설정한다. key를 JSON으로 역직렬화할 때 사용한다.

```kotlin
setUseTypeMapperForKey(true)
```

configure() 프로퍼티
----
setter 대신 `Map<String, ?>` 또는 Spring Boot 프로퍼티로 설정할 수도 있다.

| 프로퍼티 키 | 설명 |
|---|---|
| `spring.json.trusted.packages` | 신뢰 패키지 (쉼표 구분, `*`은 전체 허용) |
| `spring.json.use.type.headers` | 타입 헤더 사용 여부 |
| `spring.json.remove.type.headers` | 역직렬화 후 타입 헤더 제거 여부 |
| `spring.json.value.default.type` | 타입 헤더 없을 때 기본 역직렬화 클래스 |
| `spring.json.key.default.type` | key의 기본 역직렬화 클래스 |
| `spring.json.type.mapping` | 토큰-클래스 매핑 (예: `order:com.foo.Order,payment:com.foo.Payment`) |
| `spring.json.value.type.method` | value 타입 결정용 정적 메서드 (FQCN) |
| `spring.json.key.type.method` | key 타입 결정용 정적 메서드 (FQCN) |

```yaml
# application.yml 예시
spring:
  kafka:
    consumer:
      properties:
        spring.json.trusted.packages: "com.foo"
        spring.json.use.type.headers: false
        spring.json.value.default.type: "com.foo.MyEvent"
```

> **주의**: setter를 하나라도 호출한 뒤 `configure()`를 호출하면 프로퍼티 설정이 무시된다. setter 방식과 프로퍼티 방식을 혼용하지 않도록 한다.

Fluent API
----
메서드 체이닝을 지원하는 Fluent 스타일 메서드도 제공된다.

```kotlin
val deserializer = JacksonJsonDeserializer<MyEvent>(javaType)
    .trustedPackages("com.foo")
    .ignoreTypeHeaders()          // setUseTypeHeaders(false) 와 동일
    .dontRemoveTypeHeaders()      // setRemoveTypeHeaders(false) 와 동일
    .forKeys()                    // key 역직렬화용으로 지정
    .typeFunction { data, headers -> /* JavaType 반환 */ }
```

조합 예시
----
`javaType`을 생성자에서 직접 넘기고 헤더를 끄면, 항상 호출자가 지정한 타입으로 역직렬화된다.

```kotlin
val javaType = jacksonObjectMapper().constructType(typeRef)
val deserializer = JacksonJsonDeserializer<T>(javaType).apply {
    addTrustedPackages("com.foo")   // 이 패키지의 클래스만 역직렬화 허용
    setUseTypeHeaders(false)        // 헤더 타입 무시, 지정한 javaType으로 고정
}
```
