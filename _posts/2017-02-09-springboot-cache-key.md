---
layout: post
title: (SpringBoot) @Cacheable key값 정하기
category : Springboot
tags : [springboot,springcache,spel,spring]
---
Spring Cache는 `@Cacheable`어노테이션만 붙이면 알아서 인자값을 종류에 맞게 캐쉬된 데이터를 사용합니다.

    @Cacheable
    public List<String> getList(int page, String query){ ... }

위와 같은 경우 두 인자값이 모두 같아야 같은 캐쉬값을 내보내는데 리턴값에 영향을 미치는 요소가 page 인자값만 영향을 미친다면 아래와 같이 캐쉬 키값을 별도로 설정 할 수 있습니다.

    @Cacheable(key = "#page")
    public List<String> getList(int page, String query){ ... }

`#인자값이름`으로 특정 인자를 지정할 수 있는데 위와 같이 하면 같은 page값일 경우 query인자값은 어떤 값이 들어오더라도 같은 캐쉬값을 반환합니다.    
그런데 아래와 같은 경우 캐쉬가 정상적으로 동작하지 않습니다.   

    class Person
    {
      private String name;

      public String getName(){ return name; }
    }

    @Cacheable(key = "#kim")
    public List<String getList(Person kim){ ... }

이유는 Spring 4.0 이전 버전에서 사용하는 기본 KeyGenerator인 `DefaultKeyGenerator`가 아래와 같은 방식으로 키를 생성하기 때문입니다.   

[Spring Cache Abstraction Default Key Generation - 원문보기](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/cache.html#cache-annotations-cacheable-default-key)     
![Spring Cache Abstraction Default Key Generation](/assets/img/springboot/springboot-cache-key/1.png)    

객체의 native값을 이용하거나 Object일 경우 `hashCode()`만을 사용하여 키 값을 생성하는데 Object의 hachCode는 객체에서 재정의 하지 않은 이상 무조건 다른 값이 들어가게 되기 때문입니다.    
_Spring 4.0 이후 버전에서의 기본 KeyGenerator는 `SimpleKeyGenerator`를 사용하며 hashCode만이 아닌 복합키를 사용한다고 합니다._    

인자값이 Object 객체인 경우 객체내 값을 이용하여 키 값을 쓸 수 있습니다.(물론 이 때 내부 값도 native값이거나 String같은 heap내 주소가 유일한 경우에만 가능합니다.)

    @Cacheable(key = "#kim.name")
    public List<String getList(Person kim){ ... }

인자값이 null일 경우를 체크하려면 아래와 같이 사용할 수 있습니다.

    @Cacheable(key = "#kim?.name")
    public List<String getList(Person kim){ ... }

위 식은 if-then-else 구문에서 else만 빠진것으로 전부 표시하면 아래 같이도 사용 가능합니다.

    @Cacheable(key = "#kim?.name:'Unknown'")
    public List<String getList(Person kim){ ... }

특정 메소드를 사용하고 싶다면 아래와 같이 사용할 수도 있습니다.

    @Cacheable(key = "#kim.getName()")
    public List<String getList(Person kim){ ... }

List나 Map값은 객체들은 hachCode값을 이미 내부 객체의 hashCode값들을 이용하여 정해진 규칙대로 만들기 때문에 아래의 경우에는 별도의 처리 없이 사용가능합니다.
_하지만 내부에 포함된 데이터가 native타입이 아닐 경우엔 List, Map도 문제가 생깁니다._

    @Cacheable(key = "#strList")
    public List<String getListByList(List<String> strList){ ... }

    @Cacheable(key = "#map")
    public List<String getListByMap(Map<Long, String> map){ ... }

마지막으로 인자값이 여러개 있을 경우에 표시하는 예제는 아래와 같습니다.

    @Cacheable(key = "'KeyIs' + #kim?.getName():'Unknown' + #page + #list")
    public List<String getList(Person kim, int page, List<String> list){ ... }

key값에 사용되는 문법은 sqEL 표현식으로 아래 링크에서 자세한 내용은 확인 가능합니다.

[Spring Expression Language (SpEL)][https://docs.spring.io/spring/docs/current/spring-framework-reference/html/expressions.html]
