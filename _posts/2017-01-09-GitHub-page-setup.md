---
layout: post
title: GitHub Page 환경구축하기
category : GitHub Page
tags : [jekyll,ruby,rbenv,docker,docker-toolbox,markdown]
---

에버노트가 계정당 접속 제한을 두면서 너무 불편해저서 이 기회에 탈 에버노트겸 개발 관련 내용을 정리할 블로그를 찾던 중 GitHub Page에 대해 알게 되었고 이를 쓰기 위한 기본 환경 구축한 방법을 정리합니다.    

# 구성 #

- Windows 10 Home
- Docker toolbox
  + Ubuntu
  + Jekyll
- Dropbox
- Editor : Atom

집 PC에 Linux를 설치 할 순 없고 Docker Windows용은 Windows 10 (Professional / Enterprise 64-bit) 부터 지원하기 때문에 하위 버전에서 사용 가능한 Docker-toolbox를 설치하고 Ubuntu를 띄워 Jekyll을 돌리기로 했습니다.  
블로그 소스는 Git으로 관리하면 되긴하지만 혹시나 다른 곳에서 안올리고 이동했을때 편하게 쓰려고 저장소를 Dropbox에 위치 시켰습니다. 그리고 Markdown 안드로이드 앱이 Dropbox 저장소 연동을 지원하기 때문에 PC없이 모바일에서 작성하고 서버에 올릴 수 있는 장점도 있습니다.  

# 설치 #  

## Dropbox 설치 ##  

[Dropbox 바로가기](https://www.dropbox.com/)  

Docker와의 공유설정을 쉽게 하려면 사용자 기본폴더 ("C:\User")하위에 공유폴더를 위치 시키면 좋습니다.  

## Docker toolbox 설치 ##  

[Docker toolbox 바로가기](https://www.docker.com/products/docker-toolbox)  

설치 후 공유폴더 설정을 진행합니다.      

> docker-toolbox는 Oracle Virtual Box를 이용하기 때문에 공유폴더를 따로 설정해 두어야 Docker내/외부에서 파일 공유가 가능합니다.

toolbox 설치시 "default" 이미지가 생성되며 VM관리자 화면에 접속하여 다음과 같이 공유폴더를 설정합니다.

![VM관리자 설정-공유폴더](/assets/img/1.png)

docker-machine 명령어를 통해 접속하여 해당 공유폴더를 mount합니다.


    $ docker-machine ssh default
    $ cd /var/lib/boot2docker/
    $ sudo vi bootlocal.sh

    #!/bin/sh
    mkdir /dropbox
    chmod 777 /dropbox
    mount -t vboxsf dropbox /dropbox


- bootlocal.sh파일을 만들어 설정하면 machine 재시작시에도 공유폴더 설정이 날아가지 않습니다.   
- 공유할 파일에 권한을 주지 않을 경우 Protocol Error를 반환합니다.
- mount시 VM설정에서 설정한 공유폴더명을 그대로 써야 합니다.

## Ubuntu Image 다운로드 ##
docker-toolbox를 실행하고 아래 명령어를 통해 다운로드할 docker image를 찾습니다.


    $ docker search ubuntu
    NAME                              DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
    ubuntu                            Ubuntu is a Debian-based Linux operating s...   5289      [OK]
    ubuntu-upstart                    Upstart is an event-based replacement for ...   69        [OK]
    rastasheep/ubuntu-sshd            Dockerized SSH service, built on top of of...   61                   [OK]
    consol/ubuntu-xfce-vnc            Ubuntu container with "headless" VNC sessi...   34                   [OK]


여러가지 ubuntu버전을 찾을수 있는데 가장 기본 버전을 다운 받아 설치하도록 합니다.


    $ docker pull ubuntu
    Using default tag: latest
    latest: Pulling from library/ubuntu
    b3e1c725a85f: Pull complete
    4daad8bdde31: Pull complete
    63fe8c0068a8: Pull complete
    4a70713c436f: Pull complete
    bd842a2105a8: Pull complete
    Digest: sha256:7a64bc9c8843b0a8c8b8a7e4715b7615e4e1b0d8ca3c7e7a76ec8250899c397a
    Status: Downloaded newer image for ubuntu:latest    


> docker pull <이미지명>:<태그>  
> 태그 미포함시 가장 최신버전을 다운받습니다.(latest)

## Docker Container 생성 ##
다운 받은 이미지를 통해 실제 구동할 Docker Container를 생성합니다.  
생성 시 아래와 같은 설정을 추가합니다.

- jekyll을 통해 외부에서 웹페이지에 접근할 수 있어야 하므로 4000포트를 열어줍니다.
- dropbox를 통해 파일을 업로드 할 수 있도록 공유폴더를 선택합니다.  


위 조건에 맞게 docker container를 생성하기 위해 아래와 같이 명령어를 실행합니다.


    $ docker run -i -t -v /dropbox:/opt/dropbox -p 4000:4000 --name jekyll ubuntu /bin/bash  
    root@6ef6ea062b7a:/#


- Docker Container의 4000번 포트를 외부 환경으로 연결하기 위해 -p 옵션으로 설정합니다.
- "VM - Docker"간 연결한 공유폴더(/dropbox)를 -v 옵션을 통해 Container에 연결해줍니다.

> -i, --interactive=false: 표준 입력(stdin)을 활성화하며 컨테이너와 연결(attach)되어 있지 않더라도 표준 입력을 유지합니다. 보통 이 옵션을 사용하여 Bash에 명령을 입력합니다.  
> -t, --tty=false: TTY 모드(pseudo-TTY)를 사용합니다. Bash를 사용하려면 이 옵션을 설정해야 합니다. 이 옵션을 설정하지 않으면 명령을 입력할 수는 있지만 셸이 표시되지 않습니다.  
> -p, --publish=[]: 호스트에 연결된 컨테이너의 특정 포트를 외부에 노출합니다. 보통 웹 서버의 포트를 노출할 때 주로 사용합니다.  
> -v 외부와 공유할 포트를 설정 합니다.  

## Ubuntu 기본설정 ##

1. jekyll을 운용할 계정을 추가합니다.

        $ adduser [userid]


2. 기본적으로 사용할 패키지들을 추가합니다.

        $ apt-get update
        $ apt-get install net-tools sudo vim bzip2


3. sudo 사용을 위해 아래와 같이 설정합니다.  

        chmod +w /etc/sudoers
        vi /etc/sudoers

        => userid          ALL=(ALL)          NOPASSWD:ALL

        chmod -w /etc/sudoers


## Ruby 설치 ##
jekyll은 ruby로 작성된 프로그램입니다. jekyll을 띄우기 위해서는 ruby를 설치해야하는데 이 부분에서 가장 많이 헤맸네요.   
애초에 ruby설치법을 찾았으면 덜 헤맸을 것을 jekyll 설치 메뉴얼에 적힌 ruby설치법을 따라갔더니 계속 무언가 문제가 생겼었습니다.  
각 OS별 정확한 ruby 설치 방법은 GoRails에 친절하게 설명되어 있으니 참고 하시기 바랍니다.

[Go Rails 바로가기](https://gorails.com/setup)  
![Go Rails Setup Page](/assets/img/2.png)  

설치방법들중 권장 방법인 rbenv를 이용하여 설치하였습니다.  


    $ su userid
    $ sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev nodejs
    $ cd
    $ git clone git://github.com/sstephenson/rbenv.git .rbenv
    $ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
    $ echo 'eval "$(rbenv init -)"' >> ~/.bashrc  
    $ git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
    $ echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
    $ exec $SHELL

    $ rbenv install 2.3.3
    $ rbenv global 2.3.3
    $ ruby -v


## bundler, jekyll 설치 ##

    $ gem install bundler
    $ gem install jekyll


## jekyll 예제 서버 생성 ##

    $ cd /opt/dropbox
    $ jekyll new myblog  
    $ cd myblog
    $ ifconfig  // local ip 확인
    $ jekyll serve -H [local-IP]


- jekyll 구동시 -H 으로 local IP를 지정하지 않을 경우 127.0.0.1로 구동하면서 외부 웹페이지에서 접근할 수 없습니다.
- 외부 연결 포트를 다르게 지정했을 경우 -P 옵션으로 변경 가능합니다.

## PC 웹페이지에서 서버 동작 확인 ##

CMD창을 열고 docker-machine이 떠 있는 IP를 확인합니다.  


    $ docker-machine ls
    NAME      ACTIVE   DRIVER       STATE     URL                         SWARM   DOCKER    ERRORS
    default   -        virtualbox   Running   tcp://192.168.99.100:2376           v1.12.5


확인된 IP로 접속하면 아래와 같이 정상적으로 서버가 구동하고 있는것을 확인 할 수 있습니다.  
![Jekyll Server 구동화면](/assets/img/3.png)
