---
layout: post
title: "List 생성방식과 주의점"
category : Java
tags : [java,array,list]
---
일반적으로 `List`를 생성시 아래와 같이 합니다.

방법 1
----
```java
List list = new ArrayList();
list.add(1);
list.add(2);
```

방법 2
----
`List`객체를 만드는 또 다른 방법은 아래와 같이 생성시 enclosing scope에서 초기화를 같이 해주는 방법입니다.

```java
List list = new ArrayList(){
  {
      add(1); 
      add(2);
      add(3);
  }
};
```

방법 3
----
위 1,2번 방법으로 생성할 경우 코드 라인수가 길어지기 때문에 `Arrays.asList(T... a)`를 이용하는 경우가 있습니다.
```java
List list = Arrays.asList(1,2,3,4);
```

코드라인은 확실히 짧아지지만 위 코드는 조심히 사용해야합니다.    
`Arrays.asList`는 배열을 wrapping하여 Collection처럼 사용할 수 있게 해주지만 리스트 길이를 고정 시켜버리기 때문에 단순 조회가 아닌 객체 데이터를 변경시키는 작업(remove, add, set ... )을 시도시 아래와 같은 오류를 만날수도 있습니다.

```console
java.lang.UnsupportedOperationException: null
```

위와 같은 방식으로 `List`객체를 자유롭게 쓰려면 아래와 같이 `ArrayList`객체를 생성하고 인자로 넣어 사용해야합니다.

```java
List list = new ArrayList(Arrays.asList(1,2,3,4));
```

참고
----
[remove() on List created by Arrays.asList() throws UnsupportedOperationException](https://stackoverflow.com/questions/7885573/remove-on-list-created-by-arrays-aslist-throws-unsupportedoperationexception)
