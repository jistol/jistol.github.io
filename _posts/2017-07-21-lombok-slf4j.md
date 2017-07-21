---
layout: post
title: "(Lombok) @Slf4j 사용하기" 
category : Java
tags : [java,lombok,log]
---
클래스를 생성할 때마다 항상 로그를 남기기 위해 Logger 변수를 선언해야 했는데 Lombok의 `@Slf4j` 어노테이션을 사용하면 편하게 사용할 수 있습니다.   
(lombok은 쓰면 쓸 수록 편해서 헤어나올수가 없는거 같습니다.)

`@Slf4j`어노테이션 사용시 변환되는 코드는 아래와 같습니다.    

```java
// source
@Slf4j
 public class LogExample {
 }
```

```java
// generate
public class LogExample {
     private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(LogExample.class);
}
```
