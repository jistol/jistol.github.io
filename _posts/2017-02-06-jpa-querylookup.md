---
layout: post
title: (JPA,SpringData) 쿼리 메소드 정의하기
category : JPA/SpringData
tags : [jpa,spring,springboot,springdata]
---
iBatis만 사용하다가 SpringData를 처음 접해보면 신세계를 느끼는 것 중 하나가 interface에 메소드 하나 정의 했는데 쿼리가 완성된다는 점이 아닐까 싶습니다.    
xml에 죽어라 SQL문 만들다가 이렇게 간단하게 해결되면 SpringData를 안쓸수가 없죠._(반대로 더 불편해지거나 힘든점도 있긴 합니다.)_    

그동안 사용해온 쿼리 메소드들에 대해 몇몇가지 정리해봅니다.   
자세한 내용은 [Spring Data JPA - Reference Documentation(1.10.7)영문](http://docs.spring.io/spring-data/jpa/docs/1.10.7.RELEASE/reference/html/)이나 이쁘게 번역해놓은 [번역본](http://arahansa.github.io/docs_spring/jpa.html)을 참고하시기 바랍니다.   


메소드 이름 안에서 지원되는 키워드들
----

|Keyword|Sample|JPQL snippet|
|:----:|:----|:----|
|And|findByLastnameAndFirstname|… where x.lastname = ?1 and x.firstname = ?2|
|Or|findByLastnameOrFirstname|… where x.lastname = ?1 or x.firstname = ?2|
|Is,Equals|findByFirstname,findByFirstnameIs,findByFirstnameEquals|… where x.firstname = 1?|
|Between|findByStartDateBetween|… where x.startDate between 1? and ?2|
|LessThan|findByAgeLessThan|… where x.age < ?1|
|LessThanEqual|findByAgeLessThanEqual|… where x.age ⇐ ?1|
|GreaterThan|findByAgeGreaterThan|… where x.age > ?1|
|GreaterThanEqual|findByAgeGreaterThanEqual|… where x.age >= ?1|
|After|findByStartDateAfter|… where x.startDate > ?1|
|Before|findByStartDateBefore|… where x.startDate < ?1|
|IsNull|findByAgeIsNull|… where x.age is null|
|IsNotNull,NotNull|findByAge(Is)NotNull|… where x.age not null|
|Like|findByFirstnameLike|… where x.firstname like ?1|
|NotLike|findByFirstnameNotLike|… where x.firstname not like ?1|
|StartingWith|findByFirstnameStartingWith|… where x.firstname like ?1 (parameter bound with appended %)|
|EndingWith|findByFirstnameEndingWith|… where x.firstname like ?1 (parameter bound with prepended %)|
|Containing|findByFirstnameContaining|… where x.firstname like ?1 (parameter bound wrapped in %)|
|OrderBy|findByAgeOrderByLastnameDesc|… where x.age = ?1 order by x.lastname desc|
|Not|findByLastnameNot|… where x.lastname <> ?1|
|In|findByAgeIn(Collection<Age> ages)|… where x.age in ?1|
|NotIn|findByAgeNotIn(Collection<Age> age)|… where x.age not in ?1|
|True|findByActiveTrue()|… where x.active = true|
|False|findByActiveFalse()|… where x.active = false|
|IgnoreCase|findByFirstnameIgnoreCase|… where UPPER(x.firstame) = UPPER(?1)|


쿼리 결과 Limit(Top)하기
----
    User findFirstByOrderByLastnameAsc();
    User findTopByOrderByAgeDesc();
    Page<User> queryFirst10ByLastname(String lastname, Pageable pageable);
    Slice<User> findTop3ByLastname(String lastname, Pageable pageable);
    List<User> findFirst10ByLastname(String lastname, Sort sort);
    List<User> findTop10ByLastname(String lastname, Pageable pageable);

중복제거 Disctinct 사용하기
----
    List<Person> findDistinctPeopleByLastnameOrFirstname(String lastname, String firstname);    
    List<Person> findPeopleDistinctByLastnameOrFirstname(String lastname, String firstname);
