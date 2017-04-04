---
layout: post
title: Docker Image 생성 ( Ubuntu 14.04 + Apache2 + SSL-letsencrypt )
category : Docker
tags : [docker,apache,ssl]
---
Dockerfile을 이용하여 자동화 하여 모든 배포를 끝내려했으나 아래와 같은 이유로 한방 배포가 불가능했습니다.

  - certbot 실행시 입력 커맨드 처리 불가
    + 중간에 Y/N을 입력하는 처리가 나오는데 자동으로 처리 불가
  - apache 자동실행 불가
    + service의 start 커맨드가 불통
    + docker run 실행으로 컨테이너 생성시 FOREGROUD 로 실행하도록 인자값을 추가할 경우 컨테이너가 stop된 이후에 다시 start하면 이미 httpd가 떠있다고 오류 메시지를 뱉으며 실행되지 않는다.


아마 다른 해결책이 있을것 같긴한데 찾지 못해서 위 두가지 문제를 해결하기 위해 다음과 같은 방식으로 생성하였습니다.

Dockerfile build
----

```shell
[Dockerfile]

FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y apache2
RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:certbot/certbot
RUN apt-get update
RUN apt-get install -y python-certbot-apache
RUN a2enmod ssl
RUN service apache2 start
RUN cp /etc/apache2/sites-available/default-ssl.conf /etc/apache2/sites-available/[DOMAIN].conf
RUN sed -i 's/\/etc\/ssl\/certs\/ssl-cert-snakeoil.pem/\/etc\/letsencrypt\/live\/[DOMAIN]\/cert.pem/g' /etc/apache2/sites-available/[DOMAIN].conf
RUN sed -i 's/\/etc\/ssl\/private\/ssl-cert-snakeoil.key/\/etc\/letsencrypt\/live\/[DOMAIN]\/privkey.pem/g' /etc/apache2/sites-available/[DOMAIN].conf
RUN sed -i 's/#SSLCertificateChainFile/SSLCertificateChainFile/g' /etc/apache2/sites-available/[DOMAIN].conf
RUN sed -i 's/\/etc\/apache2\/ssl.crt\/server-ca.crt/\/etc\/letsencrypt\/live\/[DOMAIN]\/fullchain.pem/g'  /etc/apache2/sites-available/[DOMAIN].conf

EXPOSE 22 80 443
```

수작업을 최소화 하기 위해 Dockerfile에서 할 수 있는 모든 작업을 미리 하고 build명령을 통해 image를 생성합니다.

```shell
$sudo docker build --tag [REPOSITORY]:[TAG] [Dockerfile PATH]
```

Container 수작업 후 commit
----
docker run 커맨드를 통해 컨테이너를 생성하고 추가 작업을 진행합니다.

```shell
$sudo docker run -it -p 80:80 -p 443:443 --name [CONTAINER_NAME] [REPOSITORY]:[TAG] /bin/bash
```

컨테이너 안에서 아래 명령을 실행합니다.

```shell
$certbot --apache -d [DOMAIN] -m [E-MAIL] --agree-tos
$a2ensite [DOMAIN]
$service apache2 reload
```

'https://[DOMAIN]/' 에 접속하여 Apache가 정상적으로 뜨는지 확인하고 docker commit 명령을 통해 변경된 Image를 생성합니다.

```shell
$sudo docker commit -a [AUTHOR_INFO] -m [MESSAGE] [CONTAINER_NAME] [REPOSITORY]:[TAG]
```

생성된 이미지를 통해 Docker 실행및 Apache 실행
----
docker run 커맨드를 통해 컨테이너를 생성하되 Apache 자동실행 옵션은 start/stop 시에도 오류없이 동작하기 위해 추가 아규먼트 없이 기본 생성후 컨테이너를 내리고 실제 컨테이너 부팅시 start 커맨드와 함께 exec 커맨드를 통해 추가로 Apache를 실행할 수 있도록 shell 스크립트 파일을 만들었습니다.    

```shell
[create-container.sh]
#!/bin/bash
sudo docker run -it -d --name [CONTAINER_NAME] -p 80:80 -p 443:443 [REPOSITORY]:[TAG]
sudo docker stop [CONTAINER_NAME]    
```

```shell
[run-container.sh]
#!/bin/bash
sudo docker start [CONTAINER_NAME]
sudo docker exec -d [CONTAINER_NAME] /bin/bash -c '/usr/sbin/apache2ctl -D FOREGROUND'
```    


참고
----
certbot : [https://certbot.eff.org/#ubuntutrusty-apache](https://certbot.eff.org/#ubuntutrusty-apache)      
[Docker] Container run 이야기 :  [https://bestna.wordpress.com/2014/11/10/docker-container-run-%EC%9D%B4%EC%95%BC%EA%B8%B0/](https://bestna.wordpress.com/2014/11/10/docker-container-run-%EC%9D%B4%EC%95%BC%EA%B8%B0/)
