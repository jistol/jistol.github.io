---
layout: post
title: (SpringBoot) Console에 Hibernate 실행 쿼리 노출하는 옵션 - show_sql, format_sql, use_sql_comments
category : Java
tags : [springboot,jpa,hibernate]
---

SpringBoot에서 JPA(Hibernate)사용시 콘솔에 실행 SQL Log를 찍는 방법입니다.

show_sql
----
콘솔에 JPA를 통해 실행된 쿼리를 표시해 줍니다.

```yaml
## application.yml
spring.jpa.show_sql : true
```

```text
Hibernate: insert into menu_visit_history (menu_id, partner_id) values (?, ?)
```

format_sql
----
콘솔에 표시되는 쿼리를 좀 더 가독성 있게 표시해 줍니다.

```yaml
## application.yml
spring.jpa.properties.hibernate.format_sql : true
```

```text
Hibernate: 
    select
        sect0_.ad_sect_id as ad_sect_1_20_,
        sect0_.ad_sect_name as ad_sect_2_20_,
        sect0_.ad_type as ad_type3_20_,
        sect0_.apply_type as apply_ty4_20_,
        sect0_.platform_id as platform5_20_,
        sect0_.use_yn as use_yn6_20_ 
    from
        sect_info sect0_ 
    where
        sect0_.platform_id='app' 
        and sect0_.apply_type='12' 
        and sect0_.use_yn='Y'
```

use_sql_comments
----
콘솔에 표시되는 쿼리문 위에 어떤 실행을 하려는지 HINT를 표시합니다.

```yaml
## application.yml
spring.jpa.properties.hibernate.use_sql_comments : true
```

```text
Hibernate: 
    /* insert com.wemakeprice.ad.menu.common.domain.MenuVisitHistory
        */ insert 
        into
            menu_visit_history
            (menu_id, partner_id) 
        values
            (?, ?)
Hibernate: 
    /* select
        s 
    from
        Sect s 
    where
        s.platformId = 'app' 
        and s.applyType = '12' 
        and s.useYn = 'Y' */ select
            sect0_.ad_sect_id as ad_sect_1_20_,
            sect0_.ad_sect_name as ad_sect_2_20_,
            sect0_.ad_type as ad_type3_20_,
            sect0_.apply_type as apply_ty4_20_,
            sect0_.platform_id as platform5_20_,
            sect0_.use_yn as use_yn6_20_ 
        from
            sect_info sect0_ 
        where
            sect0_.platform_id='app' 
            and sect0_.apply_type='12' 
            and sect0_.use_yn='Y'
```

HINT를 보면 실제 어떤 객체를 이용하여 INSERT/SELECT하는지에 대해 나옵니다.


참고
----
[Display Hibernate SQL to console – show_sql , format_sql and use_sql_comments](https://www.mkyong.com/hibernate/hibernate-display-generated-sql-to-console-show_sql-format_sql-and-use_sql_comments/)

