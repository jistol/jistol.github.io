---
layout: post
title: "Consistent Hashing과 Memecached를 이용한 테스트 샘플"
category : software engineering
tags : [docker,softwareengineering,dockercompose,memcached,springboot]
---
Consistent Hashing 이란?
----
웹 서버의 개수가 수시로 변경될 때 요청에 대해 분산하는 방법으로 Key의 집합을 K, 노드(또는 서버)의 크기를 N라고 했을 때, N의 갯수가 바뀌더라도 대부분의 키들이 노드를 그대로 사용할 수 있습니다.    
예를 들어 10000개의 key값을 5개의 노드에 분산할 경우 2000개씩 나뉘는데 개중 하나의 노드가 죽더라도 전체를 재 분배하는 것이 아니라 2000개의 key에 대해서만 재분배 합니다.

![Consistent Hashing Node Example](/assets/img/softwareengineering/consistent-hashing-sample/1.png)     

예를 들어 일반 Hash를 이용하여 노드를 분산할 경우 아래 그림과 같은 방식으로 접근 할 수 있습니다.    
3으로 나눈 나머지 값을 이용하여 3개 노드중 하나를 접근하도록 설정 할 수 있는데 이런 방식의 경우 하나의 노드가 죽었을 경우 모든 key값에 대해 다시 연산해야하는 문제가 생깁니다.
 
![Compare Hash](/assets/img/softwareengineering/consistent-hashing-sample/2.png)   

Consistent Hashing의 경우 각 노드를 링의 개념으로 연결하여 각 key가 포함되어야 하는 특정 구간을 결정하게 됩니다.     
이 과정에서 하나의 노드가 죽는다 하여도 해당 노드에 속한 Key값은 다음 구간을 담당하는 노드에서 처리하게 되므로 나머지 노드의 key를 재분배 하지 않아도 됩니다.    

![Compare Consistent Hashing](/assets/img/softwareengineering/consistent-hashing-sample/3.png)   

Example: HashRing
----
위에서 설명한 링의 개념에 대해 실제 key에 따라 어떻게 노드를 결정하는지 아래와 같이 예시를 만들어보았습니다.

## 분배규칙 : A < 1, B < 3, C < 5, D < 7 ##    
      
다음과 같은 규칙일 때     
맨 처음 'key=1'이 인입 될 경우 아래와 같이 위치 합니다.     

![Example 1](/assets/img/softwareengineering/consistent-hashing-sample/4.png)    
   
그 다음 'key=4'가 인입되면 아래와 같이 위치 합니다.     

![Example 2](/assets/img/softwareengineering/consistent-hashing-sample/5.png)    

그 외 여러 key값이 인입하게 되어 아래와 같은 상황이 되었습니다.    

![Example 3](/assets/img/softwareengineering/consistent-hashing-sample/6.png)    

이 때 노드 B가 죽고 'key=1'이 유실됩니다.   

![Example 4](/assets/img/softwareengineering/consistent-hashing-sample/7.png)    

노드 B가 죽은 상태에서 'key=1'이 다시 인입되면 B의 다음 구간인 C에 포함되게 됩니다.    

![Example 5](/assets/img/softwareengineering/consistent-hashing-sample/8.png)    

위와 같이 특정 노드가 죽더라도 전체 key를 재분배 하지 않게 됩니다.    
하지만 Hashring에도 문제가 있는데 아래와 같이 노드 B가 되살아나고 

![Example 6](/assets/img/softwareengineering/consistent-hashing-sample/9.png)        

노드 B가 되살아난 상태에서 다시 'key=1'가 인입되면 아래 그림과 같이 중복된 key와 value가 존재하게 됩니다.     

![Example 7](/assets/img/softwareengineering/consistent-hashing-sample/10.png)    

위 상황에서 다시 노드 B가 죽을 경우 노드 C에 있던 이전 값이 노출 될 수 있는 문제가 있는데 memcached의 경우 만료시간을 설정하여 해결 할 수 있습니다.    

가상노드
----
특정 노드가 죽으면 해당 key가 모두 다른 노드에 분배되는데 위 예제에서 보면 노드 B가 죽을 경우 노드 C에 key가 몰리는 것처 보이지만 사실상 아래 그림과 같이 각 노드는 가상의 노드를 여러개 만들어 노드가 죽었을때도 균등하게 분배되도록 처리합니다.    

![vituralnodes](/assets/img/softwareengineering/consistent-hashing-sample/11.png)    
    
Memcached 샘플파일
----
위 이론을 바탕으로 실제 Memcached를 이용하여 Consistent Hashing이 어떻게 동작하는지 확인 할 수 있는 샘플 프로젝트입니다.  
Key에 대한 분배및 Proxy 역활은 소스에 포함되어 있는 `Simple-Spring-Memcached(ssm)`에서 담당하게되며 git을 설치 후 clone 명령을 이용하여 다운받을 수 있습니다.       

```vim
$ git clone https://github.com/jistol/docker-compose-memcached-multi-test-sample.git    
```

## 구성 ##

- Gradle
- Spring Boot 
- Google Simple Spring Memcached (SSM)

## Memcached 실행 ##

1. Docker 설치    
    
2. Memcached Image 다운로드
- docker pull memcached    
     
3. docker-compose를 이용하여 실행    
- ${PROJECT_HOME}/docker-compose up -d       
- 위와 같이 실행하면 아래와 같이 3개의 포트로 memcached 서버가 기동됩니다.        

```vim
$ docker-compose up -d    
Creating network "memcached_default" with the default driver    
Creating memcached_memcached3_1 ... done    
Creating memcached_memcached1_1 ... done    
Creating memcached_memcached2_1 ... done    
$ docker ps -a    
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                      PORTS                      NAMES     
8158e741dacb        memcached           "docker-entrypoint.s…"   13 seconds ago      Up 10 seconds               0.0.0.0:11212->11211/tcp   memcached_memcached2_1    
2627e168914e        memcached           "docker-entrypoint.s…"   13 seconds ago      Up 9 seconds                0.0.0.0:11211->11211/tcp   memcached_memcached1_1    
4c6daf4fc275        memcached           "docker-entrypoint.s…"   13 seconds ago      Up 9 seconds                0.0.0.0:11213->11211/tcp   memcached_memcached3_1    
```

## Test ##

아래와 같이 2가지 테스트를 할 수 있도록 구성되어 있습니다.        

### WAS 1 + Memcached 3 : Consistent Hashing 테스트 ###    

- gradle 명령을 이용하여 Tomcat 기동합니다.        

```vim
$ gradle clean build -x bootRun    
```

- 아래 URL을 통해 캐시를 주입합니다.    

```text
POST : http://localhost:8080/{key}/{value}
```

- telnet으로 Memcached에 접속, 값이 들어갔는지 확인합니다.   

```vim
$ telnet localhost 11211
Trying ::1...
Connected to localhost.
Escape character is '^]'.
get {key}


$ telnet localhost 11212
Trying ::1...
Connected to localhost.
Escape character is '^]'.
get {key}

$ telnet localhost 11213
Trying ::1...
Connected to localhost.
Escape character is '^]'.
get {key}
```

위 과정을 반복하면 입력한 KEY값이 동일한 노드의 Memcached에 들어가는것을 볼 수 있습니다.    

### WAS 3 + Memcached 3 : 서버등록 순서 오류에 의한 키배분 오류 테스트 ###  

`resource/application.yml` 파일을 보면 아래와 같이 각 profiles마다 다르게 서버 순서를 나열해 두었습니다.    

```yaml
server.port: 8080
mem-server: localhost:11211 localhost:11212 localhost:11213

---
spring.profiles: local1
server.port: 8081
mem-server: localhost:11212 localhost:11213 localhost:11211

---
spring.profiles: local2
server.port: 8082
mem-server: localhost:11213 localhost:11211 localhost:11212
```

이와 같이 설정시 인입된 서버 port에 따라 동일한 key에 대해 ssm이 다르게 분배하는 것을 확인 하는 테스트입니다.    
 
- gradle 명령을 이용하여 각 profile별로 Tomcat 3대를 기동합니다.        

```vim
$ gradle clean build -x bootRun    
$ gradle clean build -x bootRun -Dspring.profiles.active=local1   
$ gradle clean build -x bootRun -Dspring.profiles.active=local2   
```

- 아래 URL을 통해 캐시를 주입합니다.    

```text
POST : http://localhost:8080/{key}/{value}
POST : http://localhost:8081/{key}/{value}
POST : http://localhost:8082/{key}/{value}
```

- telnet으로 Memcached에 접속, 값이 들어갔는지 확인합니다.   

```vim
$ telnet localhost 11211
Trying ::1...
Connected to localhost.
Escape character is '^]'.
get {key}


$ telnet localhost 11212
Trying ::1...
Connected to localhost.
Escape character is '^]'.
get {key}

$ telnet localhost 11213
Trying ::1...
Connected to localhost.
Escape character is '^]'.
get {key}
```

위 과정을 반복하면 동일한 key를 넣더라도 어느 port에 접근하여 넣었느냐에 따라 위치가 뒤 섞여있는 것을 확인할 수 있습니다.    
