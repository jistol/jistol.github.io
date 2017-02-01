---
layout: post
title: entity(엔터티), attribute(속성), relationship(관계) 요약 - 암기용
category : Database
tags : [data-modeling, entity, attribute, relationship]
---
학습 암기용 목적의 포스팅입니다.     
자세한 내용은 [엔터티(Entity)](http://wiki.gurubee.net/pages/viewpage.action?pageId=27427060), [속성(Attribute)](http://wiki.gurubee.net/pages/viewpage.action?pageId=27427060), [관계(Relationship)](http://wiki.gurubee.net/pages/viewpage.action?pageId=27427062)를 참고하세요.


# **1. Entity** #

Entity 개념
----
저장되기 위한 어떤 집합적인 것(Thing:사람,장소,물건,사건,개념).

![엔터티 구성](/assets/img/database/database-entity-attribute-relationship/1.png)    
출처 : http://tech.devgear.co.kr/db_kb/324

Entity 특징
----
1. 업무에 필요한 정보
2. 의미있는 식별자에 의해 인스턴스는 1개씩만 존재(중복배제)
3. 2개이상의 인스턴스 집합으로 구성
4. 업무프로세스에 의해 이용되어야 함
5. 속성을 포함해야 함(식별자만 있으면 의미없음)
6. 관계가 존재해야함

Entity 분류
----
- 유무(有無)형에 따른 분류    

|명칭|설명|
|:----:|:----|
|유형 엔터티<br/>Tangible Entity|물리적 형태가 있음<br/>ex:사원,물품,강사|
|개념 엔터티<br/>Conceptual Entity|물리적 형태가 없음<br/>ex:조직,보험상품|
|사건 엔터티<br/>Event Entity|업무 수행에 따라 발생<br/>ex:주문,청구,미납|

- 발생시점에 따른 분류     

|명칭|설명|
|:----:|:----|
|기본 엔터티|원래 존재하는 정보<br/>ex:사원,부서,고객,상품|
|중심 엔터티|기본엔터티로부터 발생하고 다른 엔터티와의 관계를 통해 많은 행위엔터티를 발생<br/>업무에 있어 중심역활<br/>ex:계약,사고,청구,주문|
|행위 엔터티|두개이상 부모엔터티로부터 발생<br/>내용이 자주 바뀌거나 데이터량이 증가<br/>ex:주문목록,로그인이력|    


# **2. Attribute** #

엔터티, 인스턴스, 속성, 속성값의 관계
----
![관계도](/assets/img/database/database-entity-attribute-relationship/2.jpg)    

1. 한 개의 엔터티는 두 개 이상의 인스턴스의 집합.
2. 한 개의 엔터티는 두 개 이상의 속성을 가짐.(식별자 외에 1개이상 필요)
3. 한 개의 속성은 한 개의 속성값을 가짐.

속성의 특징
----
- 업무에 필요한 정보
- 주식별자에 함수적 종속성
- 한 개의 속성값만 가짐, 다중값일 경우 별도의 엔터티를 이용하여 분리 필요

속성의 분류
----
- 특성에 따른 분류

|명칭|설명|
|:----:|:----|
|기본속성|업무로 부터 추출한 값<br/>ex:이름,전화번호,성별|
|설계속성|규칙화를 위해 변형/새로정의한 값<br/>ex:과목코드,지역코드|
|파생속성|다른 속성에 영향을 받아 발생한 값<br/>ex:예금이자,평균성적|

- 엔터티 구성방식에 따른 분류

|명칭|설명|
|:----:|:----|
|PK<br/>Primary Key|엔터티를 식별할 수 있는 속성|
|FK<br/>Foreign Key|다른 엔터티와의 관계에서 포함된 속성|
|일반속성|PK,FK에 포함되지 않은 속성|

|명칭|설명|
|:----:|:----|
|단순형|원자값 속성|
|복합형|여러 세부 속성으로 나뉠수 있는 속성|

도메인(Domain)
----
속성이 가질 수 있는 값의 범위    


# **3. Relationship** #

관계의 정의
----
인스턴스 사이의 논리적인 연관성

관계의 패어링
----
엔터티 안에 인스턴스가 개별적으로 관계를 가지는것    
패어링의 집합 -> 관계

![관계와 패어링](/assets/img/database/database-entity-attribute-relationship/3.jpg)    

관계의 표기법
----
- 관계명(Membership) : 관계의 이름
- 관계차수(Cardinality) : 1:1, 1:M, M:N
- 관계선택사양(Optionality) : 필수관계(not null), 선택관계(nullable, O를 표시)

![관계의 표기법](/assets/img/database/database-entity-attribute-relationship/4.jpg)    
