---
layout: post
title: Docker Redmine + Mysql 설치 및 Plugin 설치하기 
category : ITS 
tags : [docker,redmine,mysql,plugin]
---
ITS로 Redmine을 사용하려 간단히 세팅해보려 Docker기반으로 설정해보았습니다.     
DockerHub에 있는 [library/redmine - Docker Hub](https://hub.docker.com/_/redmine/)를 이용하고 DB는 Mysql을 사용하도록 세팅하는 과정을 적었습니다.    
### 과정을 정리하긴 하였지만 bundler 오류가 발생하면 Container가 다운되고 다시 올라오지 못하는 현상이 종종 발생하오니 백업을 잘 하시기 바랍니다. ###        

docker 생성
----
Link : <https://hub.docker.com/_/redmine/>

아래와 같이 image를 다운 받습니다.     

```vim
$ docker pull redmine mysql
```

매번 docker run을 작성하기도 귀찮고 redmine / mysql 컨테이너를 각각 올리기 귀찮기 때문에 docker-compose를 이용하여 만들도록 하겠습니다.    

```yaml
# docker-compose.yml
version: '3.1'

services:
     redmine:
          image: redmine
          restart: always
          container_name: redmine
          ports:
               - 3000:3000
          environment:
               REDMINE_DB_MYSQL: db
               REDMINE_DB_PASSWORD: redmine
               REDMINE_DB_DATABASE: redmine
               REDMINE_DB_ENCODING: utf8
#               REDMINE_NO_DB_MIGRATE: true
     db:
          image: mysql
          restart: always
          ports:
              - 3306:3306
          environment:
               MYSQL_ROOT_PASSWORD: redmine
               MYSQL_DATABASE: redmine
          command:
               - --character-set-server=utf8mb4
               - --collation-server=utf8mb4_unicode_ci

```

추후 외부에서 접근하여 DB를 export하기 위한 용도로 3306포트를 열어두었으며 DATABASE 인코딩을 UTF-8로 사용하기 위해 추가 command 설정으르 하였습니다.    
restart=always로 설정한 이유는 redmine보다 db가 먼저 뜰 경우 redmine이 죽어버리기 때문에 db가 정상으로 올라올떄까지 재시도하도록 하였습니다.    
위와 같이 파일을 만든후 docker-compose명령어를 이용하여 실행합니다.

```vim
$ docker-compose up -d
```

정상 실행되면 아래와 같이 프로세스가 실행되는 것을 확인가능합니다.

```vim
$ docker ps -a
 CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
 e6491c0d5747        mysql               "docker-entrypoint..."   17 minutes ago      Up 17 minutes       0.0.0.0:3306->3306/tcp   redmine_db_1
 32eb215b34af        redmine             "/docker-entrypoin..."   17 minutes ago      Up 16 minutes       0.0.0.0:3000->3000/tcp   redmine
```

Redmine 플러그인 설치
----
ITS기능을 하기에 기본 Redmine은 좀 불편한 면이 있기 때문에 몇몇 플러그인을 설치해보록 하겠습니다.(무료만...)     

설치과정에서 컨테이너 내부에 접속해 command를 날려야 합니다. 컨테이너에 접속하는 방법은 아래와 같습니다.    

```vim
$ docker exec -it redmine bash
```

플러그인을 설치하기 앞서 사전에 필요한 모듈들을 설치하도록 합니다.

```vim
docker:redmine$ apt-get update
docker:redmine$ apt-get install -y unzip vim
```

Redmine 플러그인 설치 가이드는 [Redmine - Plugins](http://www.redmine.org/projects/redmine/wiki/Plugins)를 참고하시면 됩니다.    
각 플러그인 설치후 Redmine을 재시작해야 반영됩니다.    

## Issue Template Plugin ##     

Issue등록시 기본 템플릿을 지정할 수 있는 Plugin입니다. 공식 링크는 아래와 같습니다.     

Link : <https://github.com/akiko-pusu/redmine_issue_templates>

설치방법은 아래와 같습니다.     

```vim
docker:redmine$ cd ${REDMINE_ROOT}
docker:redmine$ git clone https://github.com/akiko-pusu/redmine_issue_templates.git plugins/redmine_issue_templates
docker:redmine$ rake redmine:plugins:migrate RAILS_ENV=production
```

## Check List Plugin ##     

Issue등록시 체크해야하는 사항이 있을때 같이 등록할 수 있는 Plugin입니다. 공식 링크는 아래와 같습니다.     

Link : <https://www.redmineup.com/pages/plugins/checklists> 

redmineup의 plugin은 직접 파일을 다운로드 받아 Redmine 컨테이너에 복사하고 unzip을 이용하여 plugin하위에 풀어야 합니다.    

![CheckList - Download](/assets/img/its/redmine-mysql-in-docker/1.png)     

Light Version을 다운받아 아래와 같이 설치를 진행합니다.     

```vim
$ docker cp ~/own_path/redmine_checklists-3_1_10-light.zip redmine_redmine_1:/usr/src/redmine/plugins/
$ docker exec -it redmine_redmine_1 bash
docker:redmine$ cd ${REDMINE_ROOT}
docker:redmine$ unzip plugins/redmine_checklists-3_1_10-light.zip -d plugins/
docker:redmine$ bundle install
docker:redmine$ rake redmine:plugins:migrate RAILS_ENV=production
```
 
## Redmine Agile Plugin ##    

가장 범용적으로 많이 쓰는 애자일 Plugin입니다. 공식 링크는 아래와 같습니다.    

Link : <https://www.redmineup.com/pages/plugins/agile>

파일을 다운로드 받아 Redmine 컨테이너에 복사하고 unzip을 이용하여 plugin하위에 풀어야 합니다.   

![Redmine Agile Plugin - Download](/assets/img/its/redmine-mysql-in-docker/2.png)     

Light Version을 다운받아 아래와 같이 설치를 진행합니다.

```vim
$ docker cp ~/own_path/redmine_agile-1_4_5-light.zip redmine_redmine_1:/usr/src/redmine/plugins/
$ docker exec -it redmine_redmine_1 bash
docker:redmine$ cd ${REDMINE_ROOT}
docker:redmine$ unzip plugins/redmine_checklists-3_1_10-light.zip -d plugins/
docker:redmine$ bundle install
docker:redmine$ rake redmine:plugins:migrate RAILS_ENV=production
```

## Issue Charts Plugin ##

이슈별 통계치를 그래프로 보여주는 플러그인입니다.    

Link : <https://github.com/masweetman/issue_charts>    

설치 방법은 아래와 같습니다.    

```vim
docker:redmine$ cd ${REDMINE_ROOT}
docker:redmine$ git clone https://github.com/masweetman/issue_charts.git plugins/issue_charts
docker:redmine$ bundle install
docker:redmine$ rake redmine:plugins:migrate RAILS_ENV=production
```

Redmine 테마 설치
----
classic 테마는 식상하니 심플한 테마를 하나 설치하도록 하겠습니다.    
대부분의 테마설치방식은 비슷하고 어렵지 않기 때문에 아래 예제를 기반으로 다른 맘에드는 테마를 설치하셔도 됩니다.     

## Redmine gitmike theme ##
무료 테마중 인기있는 gitmike를 설치해보겠습니다. 공식 링크는 아래와 같습니다.     

Link : <https://github.com/makotokw/redmine-theme-gitmike>    

설치 방법은 아래와 같습니다.    

```vim
docker:redmine$ cd ${REDMINE_ROOT}/public/themes
docker:redmine$ git clone https://github.com/makotokw/redmine-theme-gitmike.git gitmike
```

설치후 관리자(admin)으로 로그인하여 [관리 > 설정 > 표시방식] 에서 테마를 `gitmike`로 선택 후 저장하면 바로 적용됩니다.

![Gitmike - Theme Setting](/assets/img/its/redmine-mysql-in-docker/3.png)     


Git 저장소연결
----
SVN연결은 간편하게 되는 반면 GIT연결은 Local에 bare저장소가 같이 존재해야한다는 단점이 있습니다.    
설정할 내용이 간단하지 않아 [Redmine + Git Remote 연동](https://jistol.github.io/its/2018/01/23/redmine-git/) 링크를 참고하여 연결하면 됩니다.    


그 외 설정
----
Issue등록시 일반 Text로는 너무 딱딱하고 Richable Editor를 설치하기도 별로여서 기본적으로 Redmine에서 제공하는 Markdown 에디터를 사용하도록 하겠습니다.    

관리자(admin)으로 로그인하여 [관리 > 설정 > 일반] 에서 본문형식을 `markdown`으로 변경합니다.     
그리고 ISSUE를 등록해보면 본문내용을 markdown형식으로 사용 가능해집니다.    

![Setting - markdown](/assets/img/its/redmine-mysql-in-docker/4.png)     

참고  
----
Allow setting CHARACTER SET for the database : <https://github.com/docker-library/mysql/pull/14>       
Redmine - Plugins : <http://www.redmine.org/projects/redmine/wiki/Plugins>          
Redmine 시작/중지/재시작 : <https://zetawiki.com/wiki/%EB%A0%88%EB%93%9C%EB%A7%88%EC%9D%B8_%EC%8B%9C%EC%9E%91/%EC%A4%91%EC%A7%80/%EC%9E%AC%EC%8B%9C%EC%9E%91>     
