---
layout: post
title: GitHub Page 환경구축하기
category : GitHub Page
tags : [jekyll,ruby,rbenv,docker,docker-toolbox,markdown]
---

# GitHub Page 작성을 위한 환경 구축 #

에버노트가 계정당 접속 제한을 두면서 너무 불편해저서 이 기회에 탈 에버노트겸 개발 관련 내용을 정리할 블로그를 찾던 중 GitHub Page에 대해 알게 되었고 이를 쓰기 위한 기본 환경 구축한 방법을 정리합니다.    

## 구성 ##

- Windows 10 Home
- Docker toolbox
  + Ubuntu
  + Jekyll
- Dropbox

집 PC에 Linux를 설치 할 순 없고 Docker Windows용은 Windows 10 (Professional / Enterprise 64-bit) 부터 지원하기 때문에 하위 버전에서 사용 가능한 Docker-toolbox를 설치하고 Ubuntu를 띄워 Jekyll을 돌리기로 했습니다.  
블로그 소스는 Git으로 관리하면 되긴하지만 혹시나 다른 곳에서 안올리고 이동했을때 편하게 쓰려고 저장소를 Dropbox에 위치 시켰습니다. 그리고 Markdown 안드로이드 앱이 Dropbox 저장소 연동을 지원하기 때문에 PC없이 모바일에서 작성하고 서버에 올릴 수 있는 장점도 있습니다.  

## 설치 ##
### Dropbox 설치 ###
[Dropbox] : https://www.dropbox.com/  

Docker와의 공유설정을 쉽게 하려면 사용자 기본폴더 ("C:\User")하위에 공유폴더를 위치 시키면 좋습니다.
### Docker toolbox
[Docker toolbox] : https://www.docker.com/products/docker-toolbox  

설치 후 공유폴더 설정을 진행합니다.  
> docker-toolbox는 Oracle Virtual Box를 이용하기 때문에 공유폴더를 따로 설정해 두어야 Docker내/외부에서 파일 공유가 가능합니다.
