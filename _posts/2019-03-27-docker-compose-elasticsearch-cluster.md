---
layout: post
title: "docker-compose를 이용한 ElasticSearch Cluster구성"
category : Docker
tags : [docker,elasticsearch,es,dockercompose]
---
개발을 하다보면 공용장비가 아닌 로컬장비에서 DB나 캐시, 검색엔진등을 실행해야하는 경우가 있는데 이 때 Docker를 사용하면 필요할 때만 올려 사용할 수 있어 자원 관리가 편하고 docker-compose를 이용하면 여러 프로그램을 동시에 실행하고 종료 할 수 있어 편하게 사용할 수 있습니다.   
본 글은 docker-compose를 이용하여 ElasticSearch 6.5.3 버전 기반으로 Cluster 환경을 구성하며 Kibana까지 같이 올리는 방법에 관한 글로 이미 [elstic reference에 docker를 이용하여 설치하는 방법](https://www.elastic.co/guide/en/elasticsearch/reference/6.5/docker.html)이 친절하게 설명되어 있으나 실제 설치하면서 추가로 필요했던 부분에 대해 보충하였습니다.    

구성
----
구성은 master-node 1대, data-node 1대, kibana 1대 입니다.    
ElasticSearch(이하 ES)와 함께 Celebro를 모니터링 툴로 쓰는 경우가 있는데 Kibana 최신 버전은 xpack을 통해 모니터링하는 기능이 있어 구지 필요가 없어 제외했습니다.    

![kibana-Monitoring](/assets/img/docker/docker-compose-elasticsearch-cluster/1.png)     

docker-compose.yml
----

```yaml
version: '2.2'
services:
# master-node의 Docker 서비스입니다.
# Kibana에서 기본적으로 호출하는 ES host주소가 'http://elsaticsearch:9200'이기 때문에 서비스명은 elasticsearch로 쓰시는게 편합니다. 
# 다른 서비스명을 사용시 Kibana ES host 설정도 같이 추가해주어야 정상 동작합니다.
  elasticsearch:
    container_name: elasticsearch
    image: elasticsearch:6.5.3
    environment:
# ES Cluster명입니다. ES 서비스마다 동일한 명칭을 사용해야합니다.    
      - cluster.name=docker-cluster
# ES Node명을 설정합니다.
      - node.name=master-node1
# ES운영중 메모리 스왑을 막기 위한 설정을 추가합니다.
# 자세한 설명은 페이지 하단의 [Disable swapping]을 참고하세요.
      - bootstrap.memory_lock=true
# JVM Heap메모리 설정입니다. Xms/Xmx 옵션은 항상 같게 설정합니다.  
# 자세한 설명은 페이지 하단의 [Setting the heap size]을 참고하세요.
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
# 리눅스 시스템 자원제한 관련 옵션입니다.
# ES는 많은 파일디스크립터와 핸들러를 사용하기 때문에 제한 해제가 필요합니다.
# 자세한 설명은 페이지 하단의 [File Descriptors]을 참고하세요.
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - es1:/usr/share/elasticsearch/data
# Kibana에서 본 노드를 호출하기 때문에 외부 9200포트는 master-node에 연결해줍니다.
    ports:
      - 9200:9200
      - 9300:9300
    networks:
      - esnet
# 컨테이너에 bash로 붙고 싶을경우 아래 두 옵션을 추가해주면 됩니다.
    stdin_open: true
    tty: true
  elasticsearch2:
    container_name: elasticsearch2
    image: elasticsearch:6.5.3
    environment:
      - cluster.name=docker-cluster
      - node.name=data-node-1
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
# 다른 Cluster내 노드를 발견하기 위한 설정입니다.
      - "discovery.zen.ping.unicast.hosts=elasticsearch"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - es2:/usr/share/elasticsearch/data
    ports:
      - 9301:9300
    networks:
      - esnet
    stdin_open: true
    tty: true
# 각 서비스를 순차적으로 실행하기 위해 설정해주었습니다. (필수아님) 
    depends_on:
      - elasticsearch
  kibana:
    container_name: kibana
    image: kibana:6.5.3
    ports:
      - 5601:5601
    networks:
      - esnet
    depends_on:
      - elasticsearch
      - elasticsearch2
volumes:
  es1:
    driver: local
  es2:
    driver: local
networks:
  esnet:
```

실행 / 종료
---- 
위와 같이 설정파일을 작성 후 docker-compose를 실행하면 아래와 같이 ES가 기동하는것을 볼 수 있습니다.    

```bash
$ docker-compose up -d
Creating network "elasticsearch_esnet" with the default driver
Creating volume "elasticsearch_es1" with local driver
Creating volume "elasticsearch_es2" with local driver
Pulling elasticsearch (elasticsearch:6.5.3)...
6.5.3: Pulling from library/elasticsearch
Pulling elasticsearch2 (elasticsearch:6.5.3)...
6.5.3: Pulling from library/elasticsearch
Pulling kibana (kibana:6.5.3)...
6.5.3: Pulling from library/kibana
Creating elasticsearch ... done
Creating elasticsearch2 ... done
Creating kibana         ... done
```

종료방법은 아래와 같습니다.    

```bash
$ docker-compose down
Stopping kibana         ... done
Stopping elasticsearch2 ... done
Stopping elasticsearch  ... done
Removing kibana         ... done
Removing elasticsearch2 ... done
Removing elasticsearch  ... done
Removing network elasticsearch_esnet
```

Reference
----
Install Elasticsearch with Docker:<https://www.elastic.co/guide/en/elasticsearch/reference/6.5/docker.html>    
Disable swapping:<https://www.elastic.co/guide/en/elasticsearch/reference/6.4/setup-configuration-memory.html>     
Setting the heap size:<https://www.elastic.co/guide/en/elasticsearch/reference/6.5/heap-size.html>     
File Descriptors:<https://www.elastic.co/guide/en/elasticsearch/reference/6.5/file-descriptors.html>     

