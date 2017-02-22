---
layout: post
title: (SpringBoot) H2 DB 서버모드로 띄워 외부 툴(DBeaver)로 접속하기
category : Java
tags : [springboot,h2,dbeaver]
---
SpringBoot에서 H2 DB Embedded를 사용하다보면 항상 console에 들어가 쿼리해야하는 불편함이 있어 외부 툴에서 접근하는 방법을 찾아 정리해 보았습니다.

우선 application.xml에 정의되 있는 아래 항목을 바꿔줍니다.

    [변경 전]
    spring.datasource.url=jdbc:h2:file:./db/devdb;

    [변경 후]
    spring.datasource.url=jdbc:h2:file:./db/devdb;AUTO_SERVER=TRUE


_※ 주의사항 : H2 DB를 메모리 모드로 올릴 경우에는 사용 할 수 없습니다. 반드시 file모드로 올려주세요._

위와 같이 변경후 실행 시키면 서버모드로 뜨게 되고 DBeaver를 통해 아래와 같이 설정합니다.

- "Create New Connect" 창을 띄우고 아래와 같이 "H2 - Embedded"를 선택합니다.

![Create New Connect](/assets/img/java/springboot-h2db-servermode/1.png)

- Setting 화면에 아래와 같이 각 정보를 넣어줍니다.    
_※ JDBC URL 항목이 빈 란일 경우 "Driver Properties"탭을 선택하여 H2 Driver를 다운 받았는지 확인합니다._    
_※ 파일 경로를 full로 적어줘야합니다._    

![Create New Connect](/assets/img/java/springboot-h2db-servermode/2.png)

- Finish 버튼을 클릭하여 마무리.

![Create New Connect](/assets/img/java/springboot-h2db-servermode/3.png)

위와 같이 설정해도 한쪽에서 붙어 있는 상황에선 다른쪽이 붙질 못하더군요.    
그 방법까진 아직 못찾아봐서 패스.
