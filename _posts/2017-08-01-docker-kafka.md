---
layout: post
title: Docker Kafka 설치 
category : Docker
tags : [docker,kafka]
---
메시지큐 플랫폼중  [Kafka](https://kafka.apache.org)를 Docker에 올려 사용하려고 가장 간단하고 쉬운 방법으로 할 수 있는 설치방법을 찾다가 정리합니다.   
물론 Kafka 자체가 설치하고 실행하는게 간단하긴 하지만 개발하면서 Desktop을 어지르기 싫은 마음에 Docker에 올립니다.   
정확한 설명은 [wurstmeister/kafka-docker](https://github.com/wurstmeister/kafka-docker/blob/master/README.md)를 참고하세요 :)    
위 이미지는 Docker kafka 이미지중 가장 많은 사람들이 쓰고 있습니다.   
 
```console
$ docker search kafka

NAME                             DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
wurstmeister/kafkva               Multi-Broker Apache Kafka Image                 383                  [OK]
spotify/kafka                    A simple docker image with both Kafka and ...   217                  [OK]
ches/kafka                       Apache Kafka. Tagged versions. JMX. Cluste...   81                   [OK]
sheepkiller/kafka-manager        kafka-manager                                   73                   [OK]
confluent/kafka                                                                  26                   [OK]
```

기본 설치
----
1. docker, docker-compose
Windows나 Mac에서 Docker, Docker Toolbox를 설치했을 경우 기본적으로 docker-compose도 같이 설치 됩니다.    
특정 버전에서는 docker-compose가 설치되어 있지 않을수 있으니 [Install Docker Compose](https://docs.docker.com/compose/install/)를 참고하세요.

```console
$ docker --version          // docker version check
$ docker-compose --version  // docker-compose version check
```

2. git
git저장소에 쓰기 쉽게 만들어놓은 compose 설정파일을 다운로드 받기 위해 설치합니다. [Git download](https://git-scm.com/downloads)

설정 다운로드
----
docker-compose 설정을 사용하기 위해 다음과 같이 Git Repository에서 clone해 옵니다.
```console
$ git clone "https://github.com/wurstmeister/kafka-docker.git"
```


docker-compose.yml 수정
----
docker-compose를 실행하기 전에 설치할 HOST 주소를 바꿔주어야 하는데 설정은 아래와 같습니다.

```yaml
// docker-compose.yml
KAFKA_ADVERTISED_HOST_NAME: [[HOST주소]]
```
windows / docker-toolbox를 사용할 경우 docker-machine을 사용하기 때문에 아래 명령어를 통해 machine의 IP를 적어주어야 합니다.

```console 
$ docker-machine ip [machine name]
```

mac의 경우 그냥 로컬IP를 적어주면 됩니다.

docker-compose 실행
----
아래 명령어를 통해 docker-compose를 실행합니다.
```console
$ docker-compose up -d
```
> 위 명령어의 경우 kafka cluster를 구성하는 케이스로 단일 Broker를 사용할 경우에는 아래와 같이 사용 할 수 있습니다.     
>     $ docker-compose -f docker-compose-single-broker.yml up -d     


실행하면 자동으로 이미지를 다운받고 컨테이너를 만들어 kafka와 zookeeper를 실행해줍니다.
```console
$ docker-compose up -d

.
.
.

Creating kafkadockergit_zookeeper_1 ... 
Creating kafkadockergit_kafka_1 ... 
Creating kafkadockergit_zookeeper_1
Creating kafkadockergit_zookeeper_1 ... done

$ docker ps -a
CONTAINER ID        IMAGE                     COMMAND                  CREATED             STATUS                       PORTS                                                NAMES
380d9569c130        kafkadockergit_kafka      "start-kafka.sh"         3 minutes ago       Up 3 minutes                 0.0.0.0:32769->9092/tcp                              kafkadockergit_kafka_1
b573f7d7c39b        wurstmeister/zookeeper    "/bin/sh -c '/usr/..."   3 minutes ago       Up 3 minutes                 22/tcp, 2888/tcp, 3888/tcp, 0.0.0.0:2181->2181/tcp   kafkadockergit_zookeeper_1
```

> 제가 테스트 했을 때는 위 docker-compose명령어로 올릴 경우 가끔 zookeeper나 kafka모듈이 하나 죽거나 잘못 뜰떄가 있었습니다.   
> 원인은 알지 모르겠고 각 모듈을 재시작 할 경우 정상작동함을 확인했습니다. 원인 아시는분은 댓글 부탁드려요 :) 


참고
----
[wurstmeister/kafka-docker](https://github.com/wurstmeister/kafka-docker)
