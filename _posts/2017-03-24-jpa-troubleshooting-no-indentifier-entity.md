---
layout: post
title: "Caused by: org.hibernate.AnnotationException: No identifier specified for entity"
category : Java
tags : [jpa,troubleshooting]
---
[Spring Data JPA + REST 소개](http://penpen.tistory.com/entry/Spring-Data-JPA-REST)블로그 글을 보고 10분만에 REST-API서비스를 만들수 있다는 "spring-data-rest" 샘플 코드를 만들어보던 중에 아래와 같은 오류를 만났습니다.   

    Caused by: org.hibernate.AnnotationException: No identifier specified for entity: io.github.jistol.Article     

`Article`은 단순한 Entity 클래스로 소스는 아래와 같습니다.

    package io.githug.jistol.entity;

    import com.fasterxml.jackson.annotation.JsonIgnore;
    import org.springframework.data.annotation.Id;

    import javax.persistence.Entity;
    import javax.persistence.GeneratedValue;
    import javax.persistence.OneToMany;
    import java.util.Date;
    import java.util.List;

    @Entity(name = "Article")
    public class Article {
        @Id
        @GeneratedValue
        private int id;

        private String nickname;

        @JsonIgnore
        private String password;

        private String content;

        private Date addDate = new Date();

        @OneToMany(mappedBy = "article")
        private List<Comment> comments;

        ....
    }

왜 이게 오류가 나지? 라고 생각하며 이것저것 빼먹은게 있나 넣어보고 수정하던 찰라 아주 사소한 실수를 발견했습니다.

    import org.springframework.data.annotation.Id;    (X)
    import javax.persistence.Id;                      (O)

위와 같이 `@Id`의 import문이 틀렸던 것입니다.    
사소한 부분이지만 생각없이 막 카피하다가 실수하기 딱 좋은 부분이라 메모해둡니다.    
