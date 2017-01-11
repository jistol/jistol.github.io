---
layout : default
title : Bitnami를 이용한 Redmine + Agile 설치 (on Ubuntu)
tags : [bitnami,redmine,redmine-plugin,agile,ubuntu,deploy,bugtracking]
categories : [BugTracking]
---

여분 PC가 생겨 어떻게 쓸까 고민하던중 사내에서 쓰는 Jira 대신 사이트 구축 나가서 쓸 BugTracking 시스템을 설치해 연습삼아 써보기로 했습니다.    
그래서 선택한건 OpenSource중 가장 유명한 Redmine.    
하지만 설치하다가 지옥을 맛보기로도 유명하더군요 ㅠㅠ    
2~3시간 삽질하다가 Bitnami를 통해 쉽게 설치 가능함을 발견하고 10여분 만에 설치를 완료했습니다.

## Bitnami ##

[Bitnami 바로가기](https://bitnami.com)  

기존에 복잡하게 설치해야만 했던 환경을 단번에 구성해 줍니다. 심지어 각 OS별로 설치 할 수 있도록 제공 할 뿐만 아니라, Docker Container 및 Bitnami에서 제공하는 cloud환경에서 사용할 수도 있는것 같습니다.   
Applications메뉴를 눌러보면 다양한 설치할 수 있는 다양한 항목이 표시됩니다.

![Bitnami Applications Page](/assets/img/4.png)    

그 중에 설치할 항목인 "Redmine + Agile" 선택.

## Redmine Install ##

설치할 파일을 다운로드하고 실행권한을 준 후 바로 실행하면 설치가 진행됩니다.   
> Redmine 설치파일의 경우 비로그인 상태에서도 다운을 받을수 있어 wget명령어를 통해 바로 다운로드가 가능하나 Redmine+Agile 설치파일의 경우에는 반드시 로그인이 필요하여 파일을 다운받아 옮기도록 해야합니다.

    $ sudo chmod 775 ./redmineplusagile-3.3.1-1-linux-x64-installer.run
    $ sudo ./redmineplusagile-3.3.1-1-linux-x64-installer.run

Windows Installer처럼 쉽게 선택만 하면 설치과정이 끝납니다.   


    Please select the installation language
    [1] English - English
    [2] Spanish - Español
    [3] Japanese - 日本語
    [4] Korean - 한국어
    [5] Simplified Chinese - 简体中文
    [6] Hebrew - עברית
    [7] German - Deutsch
    [8] Romanian - Română
    [9] Russian - Русский
    Please choose an option [1] : 4


설치를 진행할 언어를 선택합니다.


    ----------------------------------------------------------------------------
    Redmine+Agile 설치 마법사를 시작합니다.

    ----------------------------------------------------------------------------
    설치할 구성 요소를 선택하십시오. 설치하지 않을 구성 요소는 선택을 취소하십시오. 계속할 준비가 되면클릭하십시오.

    Subversion [Y/n] :y

    PhpMyAdmin [Y/n] :n

    Redmine : Y (Cannot be edited)

    Agile plugin : Y (Cannot be edited)

    Git [Y/n] :y

    위의 선택이 정확합니까? [Y/n]: y


같이 설치될 Plugin을 선택합니다.    
SVN, GIT을 같이 설치할 수 있어서 SCM연동을 별도로 해야하는 수고를 덜어주는군요

    ----------------------------------------------------------------------------
    설치 경로

    Redmine+Agile의 설치 경로를 선택하세요.

    폴더 선택 [/opt/redmineplusagile-3.3.1-1]:

    ----------------------------------------------------------------------------
    Admin 계정 생성

    Redmine+Agile 관리자 계정을 생성합니다.

    이름 [User Name]: jistol

    이메일 주소 [user@example.com]: kimjh@spectra.co.kr

    로그인 계정명 [user]: kimjh

    패스워드 :
    패스워드를 재입력 :
    ----------------------------------------------------------------------------
    웹 서버 포트 번호

    Choose a port that is not currently in use, such as port 81.

    Apache 서버 포트 번호 [81]: 8080

    ----------------------------------------------------------------------------
    MySQL 정보

    MySQL 데이터베이스 정보를 입력하세요.

    Choose a port that is not currently in use, such as port 3307.

    MySQL 서버 포트 번호 [3307]:


웹 서버가 기존 Apache에서 80을 쓰고 있어 8080으로 설정했습니다   


    ----------------------------------------------------------------------------
    기본 데이터 설정에 사용할 언어

    기본 데이터 설정 시 사용할 언어를 선택하세요.

    [1] Bosnian
    [2] 불가리아어
    [3] Catalan
    [4] 체코어
    [5] Danish
    [6] 독일어
    [7] 영어
    [8] 스페인어
    [9] 프랑스어
    [10] Galician
    [11] 히브리어
    [12] Hungarian
    [13] 이탈리아어
    [14] 일본어
    [15] 한국어
    [16] Lithuanian
    [17] 네덜란드어
    [18] Norwegian
    [19] 폴란드어
    [20] 포르투갈어
    [21] 루마니아어
    [22] 러시아어
    [23] Slovak
    [24] Slovenian
    [25] 세르비아어
    [26] 스웨덴어
    [27] Turkish
    [28] Ukrainian
    [29] Vietnamese
    [30] 중국어
    옵션을 선택하십시오. [15] : 15

    사용하시겠습니까? [y/N]: n


Redmine 기본 언어를 선택합니다.     

언어 선택후 "사용하시겠습니까?"라는 질문이 나오는데 국문 설치시 당할수 있는 함정입니다.  저 선택은 언어를 선택하겠냐는 얘기가 아니라 SMTP메일 서버를 설정하여 메일을 발송 하겠냐는 얘기인데 국문 설치엔 앞뒤 다 짜르고 저렇게 나오네요.(영문에서는 설명이 잘 나옵니다.)

    ----------------------------------------------------------------------------
    이제 컴퓨터에 Redmine+Agile을(를) 설치할 준비가 되었습니다.

    계속하시겠습니까? [Y/n]: y

    ----------------------------------------------------------------------------
    컴퓨터에 Redmine+Agile을(를) 설치하는 동안 기다려 주십시오.

     설치
     0% ______________ 50% ______________ 100%
     ########################################

     ----------------------------------------------------------------------------
     컴퓨터에 Redmine+Agile 설치를 완료했습니다.

     Redmine 어플리케이션 구동 [Y/n]: Y

     정보: To access the Redmine+Agile, go to
     http://127.0.0.1:8080 from your browser.
     계속하려면 [Enter] 키 누르기:


모든 설치가 끝나면 Redmine을 구동해주고 웹페이지에 접속하여 확인할 수 있습니다.

![설치완료 화면](/assets/img/5.png)   

관리화면에 가면 위와 같이 Agile Plugin이 추가되어 있는것을 확인할 수 있습니다.   
설치된 Agile버전은 무료버전인 Light버전으로 자세한 사항은 아래 링크에서 확인 가능합니다.

[Redmineup - Agile 바로가기](https://www.redmineup.com/pages/plugins/agile)

## Redmine Uninstall 하기 ##

설치된 폴더에 가보면 uninstall 파일이 존재합니다. 해당 파일 실행하면 Uninstall됩니다.

    kimjh@kimjh:/opt/redmineplusagile-3.3.1-1$ ls
    README.txt     ctlscript.sh           perl            sqlite
    apache2        git                    php             subversion
    apps           img                    postgresql      uninstall
    changelog.txt  licenses               properties.ini  uninstall.dat
    common         manager-linux-x64.run  ruby            use_redmineplusagile
    config         mysql                  scripts
