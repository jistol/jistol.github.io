---
layout: post
title: (Kotlin) reified를 이용한 런타임 타입 참조
category : Kotlin
tags : [kotlin]
---

타입 소거 (Type Erasure)
----
JVM에서 제네릭 타입 정보는 컴파일 이후 런타임에 소거된다. 따라서 아래와 같이 제네릭 타입을 직접 참조하는 코드는 컴파일 에러가 발생한다.

```kotlin
fun <T> printType() {
    println(T::class) // 컴파일 에러 - T의 타입을 알 수 없음
}
```

reified 키워드
----
`inline` 함수와 함께 `reified`를 사용하면 런타임에도 타입 정보를 유지할 수 있다.

```kotlin
inline fun <reified T> printType() {
    println(T::class) // 정상 동작
}

printType<String>() // class kotlin.String
```

왜 inline이 필요한가?
----
`inline` 함수는 호출 지점에 함수 본문이 복사된다. 컴파일러가 호출 시점에 실제 타입을 알고 있으므로, 복사할 때 `T`를 구체적인 타입으로 치환할 수 있다.

```kotlin
// 컴파일 전
printType<String>()

// 인라인 후 (개념적)
println(String::class)
```

활용 예시
----

### 타입 체크 / 캐스팅

```kotlin
inline fun <reified T> List<*>.filterByType(): List<T> {
    return this.filter { it is T }.map { it as T }
}

val mixed = listOf(1, "hello", 2, "world")
val strings = mixed.filterByType<String>() // ["hello", "world"]
```

### Jackson/Gson 등 역직렬화

```kotlin
inline fun <reified T> String.fromJson(): T {
    return objectMapper.readValue(this, T::class.java)
}

val user = jsonString.fromJson<User>()
```

### Android에서 클래스 참조 전달 생략

```kotlin
// reified 없이
startActivity(Intent(this, MainActivity::class.java))

// reified 사용
inline fun <reified T : Activity> Context.startActivity() {
    startActivity(Intent(this, T::class.java))
}
startActivity<MainActivity>()
```

제약사항
----
* 반드시 `inline` 함수에서만 사용 가능
* `reified` 타입 파라미터로 새 인스턴스 생성 불가 (`T()` 불가)
* Java에서 호출 불가 (인라인 메커니즘이 Kotlin 전용)
