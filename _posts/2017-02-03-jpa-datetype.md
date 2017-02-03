---
layout: post
title: (JPA) Date타입 컬럼 - Date, Calendar, Timestamp
category : jpa
tags : [jpa,date,java,spring,springboot]
---
JPA를 사용할때 Date타입의 컬럼 사용시 어떤 Java Object를 사용해야하는지에 대한 글이 있어 옮겨 적어봅니다. [원본보기](http://www.developerscrappad.com/228/java/java-ee/ejb3-jpa-dealing-with-date-time-and-timestamp/)    

java.sql.Date, java.sql.Time, java.sql.Timestamp
----

    @Column(name = "DATE_FIELD")
    private java.sql.Date dateField;

    @Column(name = "TIME_FIELD")
    private java.sql.Time timeField;

    @Column(name = "DATETIME_FIELD")
    private java.sql.Timestamp dateTimeField;

    @Column(name = "TIMESTAMP_FIELD")
    private java.sql.Timestamp timestampField;

응용 프로그램이 날짜 및 시간 값을 저장하기만 해도 될 경우 사용합니다.     
서버 GMT 오프셋과 같이 날짜 및 시간의 확장 된 세부 정보를 저장하거나 다른 지역 또는 시간대에 다른 날짜와 시간을 저장하지 않아도 될 경우에 좋습니다.

java.util.Date
----

    @Temporal(TemporalType.DATE)
    @Column(name = "DATE_FIELD")
    private java.util.Date dateField;

    @Temporal(TemporalType.TIME)
    @Column(name = "TIME_FIELD")
    private java.util.Date timeField;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "DATETIME_FIELD")
    private java.util.Date dateTimeField;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "TIMESTAMP_FIELD")
    private java.util.Date timestampField;

프로그램의 날짜와 GMT값을 날짜,시간,타임스템프 필드와 함꼐 저장해야하는 경우에 사용합니다.         
java.util.Date 클래스는 날짜와 시간 정보를 모두 저장할 수 있기 때문에 올바른 TemporalType 속성 (TemporalType.DATE, TemporalType.TIME 또는 TemporalType.TIMESTAMP)이있는 @Temporal 주석이 추가로 필요합니다.    

java.util.Calendar
----

    @Column(name = "DATE_FIELD")
    @Temporal(TemporalType.DATE)
    private java.util.Calendar dateField;

    @Column(name = "TIME_FIELD")
    @Temporal(TemporalType.TIME)
    private java.util.Calendar timeField;

    @Column(name = "DATETIME_FIELD")
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Calendar datetimeField;

    @Column(name = "TIMESTAMP_FIELD")
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Calendar timestampField;

국제 날짜및 시간정보 캡처가 필요한 경우 사용하면 좋습니다.
java.util.Date 클래스와 마찬가지로 @Temporal주석이 필요합니다.


일반적으로 개발할때는 java.sql.Timestamp만 사용해도 충분하겠네요 :)
