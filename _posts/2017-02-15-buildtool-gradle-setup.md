---
layout: post
title: Gradle 설치 및 초기화
category : BuildTool
tags : [gradle]
---
Gradle에 대해서 공부한 내용을 요약한 포스팅입니다.

Gradle 이란?
----
보통 Maven의 장점과 Ant의 장점을 합쳐 놓은 빌드 툴로 불리우는데 XML대신 Groovy DSL로 작성되어 라인수가 훨씬 적고 task단위로 만들어 실행 할 수 있으며 개발자가 필요한 빌드로직을 조합하여 사용 가능합니다. 그리고 Gradle Wrapper를 사용하여 Gradle이 설치되지 않은 환경에서도 빌드 가능합니다.   

설치방법
----
[Gradle 수동설치](https://gradle.org/install#manually) 링크에서 Install 설치파일을 다운받아 풀고 `GRADLE_HOME`, 실행파일 경로를 `PATH`에 잡아주면 됩니다.     
추가로 윈도우 환경에서 UTF-8 빌드환경을 만들기 위해 아래와 같이 `GRADLE_OPTS`을 설정합니다.

    GRADLE_OPTS="-Dfile.encoding=UTF-8"

초기화하기(cmd)
----
명령어를 통해 gradle을 초기화 하는 방법은 아래와 같습니다.

    $ gradle init --type java-library

`type`값은 `basic`, `java-library`, `pom`, `groovy-library`, `scala-library`가 있습니다.    
위와 같이 실행하면 gradle의 기본 설정 생성과 함께 src 기본폴더가 생성됩니다.(자세한 구조는 아래 IDE에서...)

초기화하기(IntelliJ)
----
- Gradle타입의 새 프로젝트를 선택하고 Next를 클릭합니다.    

![new project](/assets/img/buildtool/buildtool-gradle-setup/1.png)    

- GroupId, ArtifactId를 선택하고 Next를 클릭합니다.     

![new project](/assets/img/buildtool/buildtool-gradle-setup/2.png)    

- 필요한 선택항목을 선택 후 Next를 클릭합니다.

![new project](/assets/img/buildtool/buildtool-gradle-setup/3.png)      

  + Use auto-import : dependency 추가시 자동으로 import하는 옵션입니다.
  + Create directories for empty content roots automatically : 이 항목을 선택하면 자동으로 src폴더와 하위 구조가 생성됩니다.
  + Use default gradle wrapper : Gradle Wrapper를 생성해줍니다.(gradlew.bat ...)
  + Use gradle wrapper task configuration : Gradle Wrapper를 task를 통해 실행할 수 있도록 스크립트를 만듭니다.

![new project](/assets/img/buildtool/buildtool-gradle-setup/6.png)      

  + Use local gradle distribution : 로컬에 설치한 gradle경로를 잡아줍니다.


- 선택후 Finish를 누르면 다음과 같이 gradle기반 JavaProject가 생성됩니다.  

![new project](/assets/img/buildtool/buildtool-gradle-setup/4.png)   

![new project](/assets/img/buildtool/buildtool-gradle-setup/5.png)    

※ 위 커맨드 명령어로 만들때도 같은 구조로 생성됩니다.

그 외에 template을 기반으로 하는 프로젝트 생성 방법은 [Gradle 기반의 템플릿 프로젝트 생성](https://slipp.net/wiki/pages/viewpage.action?pageId=11632703#id-1.Gradle%EC%84%A4%EC%B9%98%EB%B0%8F%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%83%9D%EC%84%B1-Gradle%EA%B8%B0%EB%B0%98%EC%9D%98%ED%85%9C%ED%94%8C%EB%A6%BF%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%83%9D%EC%84%B1)을 참고하시기 바랍니다.

참고
----
[권남 - Gradle](http://kwonnam.pe.kr/wiki/gradle)    
[Gradle Build - Installation](https://gradle.org/install)    
