---
layout: post
title: (Kotlin) null을 컨트롤 하는 연산자
category : Kotlin
tags : [kotlin]
---

?. - 안전한 호출 ([Safe calls](https://kotlinlang.org/docs/null-safety.html#safe-calls))
----
* null이 아닌 경우 실행한다.
* let과 연계 사용시 더 간결하게 처리 가능

```java
    // JAVA
    public String safetyUpperCase(String str) {
        if (str != null) {
            return str.toUpperCase();
        }
    }
```
```kotlin
    // kotlin
    fun safetyUpperCase(str:String?) = str?.uppercase()

    fun String?.appendPrefixIfNotNull(prefix:String) = this?.let { this = prefix + this }
```

?: - 엘비스연산자 ([Elvis operator](https://kotlinlang.org/docs/null-safety.html#elvis-operator))
----
* null 대신 사용 할 디폴트 값을 지정

```java
    // JAVA
    String value = str == null ? "DEFAULT" : str;
```
```kotlin
    // kotlin
    val value = str?: "DEFAULT"
```

as? - 안전한 캐스트 ([Safe casts](https://kotlinlang.org/docs/null-safety.html#safe-casts))
----
* 지정한 타입으로 캐스트 하고 불가 시 null 반환

```java
    // JAVA
    public Long toLong(Object obj) {
        if (obj instanceof Long) {
            return (Long)obj
        } else {
            return null;
        }
    }
```
```kotlin
    // kotlin
    fun toLong(obj:Any):Long? = obj as? Long
```

!! - 널 아님 단언 ([not-null assertion](https://kotlinlang.org/docs/null-safety.html#the-operator))
----
* null이 될 수 있는 타입을 null이 될 수 없는 타입으로 강제전환
* 실제 값이 null일 경우 NPE 발생
* 안티패턴 : person.company!!.address!!.country
** 어느 값에서 NPE가 발생했는지 알기 어렵다

```kotlin
    fun <T> notNullAssert(nullable:T?):T = nullable!!

    val s1:String? = "NOT-NULL"
    val s2:String? = null
    notNullAssert(s1)
    notNullAssert(s2)  // NullPointerException
```

