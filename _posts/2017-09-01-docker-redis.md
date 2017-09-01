---
layout: post
title: Docker Redis 사용하기
category : Docker
tags : [docker,redis]
---
Docker를 이용하여 간단하게 redis 설치 및 사용하는 방법을 정리해봤습니다. 

설치
----
Docker가 설치 된 상태에서 아래 커맨드를 이용하여 설치합니다.

```console
$ docker pull redis
```

시작하기
----
```console
$ docker run --name some-redis -d -p 6379:6379 redis
```

Docker를 실행하여 Redis서버를 올리고 기본 포트인 `6379`로 실행됩니다.          
`-d`옵션은 백그라운드에서 실행하겠다는 의미이며     
`-p`옵션은 외부에서 해당 포트로 접속할 수 있게 열어둔다는 의미입니다.     

해당 Redis서버의 데이터를 외부에서 관리하고 싶을 경우에는 아래와 같이 사용합니다.

```console
## 외부 폴더에 데이터 저장소를 두고 싶을 경우
$ docker run --name some-redis -d -v /your/dir:/data redis redis-server --appendonly yes

## 다른 컨테이너에 저장소를 두고 싶은 경우
$ docker run --name some-redis -d --volumes-from some-volume-container redis redis-server --appendonly yes
```

`appendonly yes` 옵션은 AOF방식으로 데이터를 저장(참고:[Redis Persistence Introduction](http://www.redisgate.com/redis/configuration/persistence.php))하겠다는 의미입니다.      
데이터는 기본적으로 `/data`하위에 저장되며 외부에서 해당 폴더를 공유함으로써 해당 컨테이너를 지우고 새로 만들어도 해당 volume을 참고하게 하면 동일한 데이터를 유지 할 수 있습니다.

> OS X의 경우 사전에 Docker에서 공유폴더로 지정되지 않은 경우 아래와 같은 오류를 만날 수 있습니다.     
>       
> docker: Error response from daemon: Mounts denied:       
> The path /Users/jistol/data       
> is not shared from OS X and is not known to Docker.      
> You can configure shared paths from Docker -> Preferences... -> File Sharing.       
> See https://docs.docker.com/docker-for-mac/osxfs/#namespaces for more info.       
>      
> 위와 같은 오류 발생시 메시지에 나온데로 `Docker -> Preferences -> File Sharing` 설정에서 공유할 폴더를 추가해 주면 됩니다.     

![file sharing](/asset/img/docker/docker-redis/1.png) 

외부에서 접근하기
----
외부에서 Redis 컨테이너를 접근하는 방법은 3가지 입니다.

## 1. 외부 서버에서 접근하기 ##    
위에 명시한 것과 같이 `-p` 옵션을 통해 port를 뚫어 직접 접근 할 수 있습니다.

```console
$ docker run --name some-redis -d -p 6379:6379 redis
```

## 2. 다른 컨테이너에서 접근하기 ##
`--link`나 `-network`옵션을 통해 접근 가능합니다. (참고:[Docker container networking](https://docs.docker.com/engine/userguide/networking/#the-docker_gwbridge-network))     

```console
$ docker run --name some-app --link some-redis:redis -d application-that-uses-redis
```

## 3. redis-cli로 접근하기 ##
아래와 같은 명령으로 접근할 수 있습니다.

```console
$ docker run -it --link some-redis:redis --rm redis redis-cli -h redis -p 6379
```

Redis 컨테이너 기동 방식에 따라 `--link`나 `--network`, 혹은 port를 외부로 열었다면 두 옵션 없이 사용 가능합니다.   
`--rm` 옵션은 컨테이너 종료시 자동으로 해당 컨테이너를 삭제해줍니다.    


참고
----
[library/redis - Docker Hub](https://hub.docker.com/_/redis/)      
[Redis Persistence Introduction](http://www.redisgate.com/redis/configuration/persistence.php)        
[Docker container networking](https://docs.docker.com/engine/userguide/networking/#the-docker_gwbridge-network)      
