---
layout: post
title: (Kotlin) tailrec을 이용한 꼬리 재귀 최적화
category : Kotlin
tags : [kotlin]
---

꼬리 재귀 (Tail Recursion)
----
재귀 호출이 함수의 **마지막 연산**인 경우를 꼬리 재귀라 한다. 일반 재귀는 호출마다 스택 프레임이 쌓여 깊은 재귀 시 `StackOverflowError`가 발생하지만, 꼬리 재귀는 이전 스택 프레임을 재사용할 수 있어 루프로 변환이 가능하다.

tailrec 키워드
----
Kotlin에서 `tailrec` 키워드를 함수에 붙이면 컴파일러가 꼬리 재귀를 **루프로 최적화**해준다.

```kotlin
tailrec fun factorial(n: Int, acc: Long = 1L): Long =
    if (n <= 1) acc
    else factorial(n - 1, n * acc)
```

위 코드는 컴파일 시 내부적으로 아래와 같은 루프로 변환된다.

```kotlin
fun factorial(n: Int, acc: Long = 1L): Long {
    var n = n; var acc = acc
    while (n > 1) { acc *= n; n-- }
    return acc
}
```

꼬리 재귀가 아닌 경우
----
재귀 호출 이후 추가 연산이 있으면 꼬리 재귀가 아니므로 `tailrec` 최적화가 적용되지 않는다.

```kotlin
// 꼬리 재귀 X - 재귀 호출 후 곱셈 연산이 남아있음
tailrec fun factorial(n: Int): Long =
    if (n <= 1) 1L
    else n * factorial(n - 1) // 경고 발생: 꼬리 재귀가 아님
```

이 경우 컴파일러가 경고를 출력하며 최적화가 적용되지 않는다.

사용 조건
----
- 함수의 마지막 연산이 자기 자신 호출이어야 한다.
- `open`이나 `override` 함수에는 사용할 수 없다.
- 조건을 만족하지 않으면 컴파일러가 경고를 준다 (최적화 안 됨).

활용 예시
----

### 리스트 합계

```kotlin
tailrec fun sum(list: List<Int>, acc: Int = 0): Int =
    if (list.isEmpty()) acc
    else sum(list.drop(1), acc + list.first())
```

### 피보나치

```kotlin
tailrec fun fibonacci(n: Int, a: Long = 0L, b: Long = 1L): Long =
    when (n) {
        0 -> a
        1 -> b
        else -> fibonacci(n - 1, b, a + b)
    }
```

### 문자열 뒤집기

```kotlin
tailrec fun reverse(s: String, acc: String = ""): String =
    if (s.isEmpty()) acc
    else reverse(s.drop(1), s.first() + acc)
```

정리
----
`tailrec`은 재귀 로직의 가독성을 유지하면서 루프 수준의 성능을 얻을 수 있는 기능이다. 누적값을 파라미터로 전달하는 패턴(accumulator pattern)을 사용하면 대부분의 재귀를 꼬리 재귀로 변환할 수 있다.
