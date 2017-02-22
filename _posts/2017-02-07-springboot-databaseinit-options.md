---
layout: post
title: (SpringBoot) 데이터베이스 초기화 (spring.jpa.hibernate.ddl-auto, import.sql, spring.datasource.data)
category : Java
tags : [springboot,jpa,springdata,spring]
---

spring.jpa.hibernate.ddl-auto
----

|옵션|설명|
|:----|:----|
|create|기존에 생성되 있던 테이블들을 삭제하고 새로 만듭니다.|
|create-drop|create와 같은 동작을 하나 종료시에 DROP합니다.|
|update|변경된 부분만 반영합니다.|
|validate|테이블과 Entity가 매핑되는지 유효성 검사를 실행합니다.|
|none|초기화 동작을 사용하지 않습니다.|


import.sql
----
- 리소스에 위 파일이 위치하면 테이블 생성시 자동으로 스크립트를 실행시켜줍니다.

spring.datasource.data
----
- 이 옵션에 지정한 파일을 테이블 생성시 자동으로 실행시켜줍니다.    
- 파일은 ,(쉼표)로 여러개를 지정하거나 *기호를 이용하여 패턴 지정가능합니다.    
- 파일 경로는 클래스패스, 절대경로, 상대경로 모두 지정가능합니다.   

예시 : classpath:/sql/test/init-*.sql,file:/home/jistol/sql/test.sql,/META-INF/sql/initScript.sql
