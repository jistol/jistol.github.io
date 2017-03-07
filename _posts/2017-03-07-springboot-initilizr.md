---
layout: post
title: (SpringBoot) Spring Initializr - 프로젝트 쉽게 생성하기
category : Java
tags : [springboot,spring-initializr]
---
SpringBoot를 이용하여 간단한 POC를 자주 진행하곤 했었는데 매번 Maven/Gradle 설정하고 프로젝트 구조 맞추고 하기가 번거로워 샘플 프로젝트를 하나 만들어두고 사용하고 있었습니다.    
그러던 와중에 **[Spring Initializr](http://start.spring.io/)**를 알게 되어 사용해봤는데 완전 신세계였습니다.

초기화면은 아래와 같습니다.    
![spring-initializr-main](/assets/img/java/springboot-initilizr/1.png)    

빌드 툴은 Maven과 Gradle중에 선택할 수 있습니다.    
![spring-initializr-build-tool](/assets/img/java/springboot-initilizr/2.png)   

사용할 SpringBoot Version을 선택하고,
![spring-initializr-version](/assets/img/java/springboot-initilizr/3.png)    

Group/Artifact를 지정하고,    
![spring-initializr-group-artifact](/assets/img/java/springboot-initilizr/4.png)    

사용할 Dependencies를 추가로 선택할 수 있습니다. 키워드 자동완성식 검색을 제공하여 검색하기 편하네요 :)
![spring-initializr-dependencies](/assets/img/java/springboot-initilizr/5.png)    

선택한 Dependencies는 아래와 같이 표시됩니다.   
![spring-initializr-dependencies-list](/assets/img/java/springboot-initilizr/6.png)   

"Generate Project"버튼을 클릭하여 zip파일로 다운을 받고 압축을 풀어 `pom.xml`파일을 확인해보면 우아하게 Maven 설정이 되어있습니다.     
![spring-initializr-pom](/assets/img/java/springboot-initilizr/7.png)   

프로젝트 구조도 자동으로 잡아주고, 기본 설정파일도 자동으로 포함시켜줍니다.
![spring-initializr-structure](/assets/img/java/springboot-initilizr/8.png)   

`gitignore`파일까지 자동세팅 해주네요. IntelliJ사용자에겐 저거 세팅도 귀찮은데 세심함에 감동 :)
![spring-initializr-gitignore](/assets/img/java/springboot-initilizr/9.png)   

아래 "Switch to the full version"을 클릭하면 좀 더 세밀한 설정이 가능합니다.   
![spring-initializr-full-link](/assets/img/java/springboot-initilizr/10.png)   

![spring-initializr-full-screen](/assets/img/java/springboot-initilizr/11.png)   
