---
layout: post
title: "instanceof 와 Class.isAssignableFrom 의 차이점" 
category : Java
tags : [instanceof,class]
---

간단하게 `instanceof`는 특정 **Object**가 어떤 클래스/인터페이스를 상속/구현했는지를 체크하며    
`Class.isAssignableFrom()`은 특정 **Class**가 어떤 클래스/인터페이스를 상속/구현했는지 체크합니다.

```java
// instanceof
MacPro obj = new MacPro();
if (obj instanceof Computer) {
  ...
}

// Class.isAssignableFrom()
if (Computer.class.isAssignableFrom(MacPro.class)) {
  ...
}
```

참고
----
[instanceof랑 Class.isAssignableFrom(…)의 차이가 뭐죠?](http://hashcode.co.kr/questions/300/instanceof%EB%9E%91-classisassignablefrom%E2%80%A6%EC%9D%98-%EC%B0%A8%EC%9D%B4%EA%B0%80-%EB%AD%90%EC%A3%A0)

