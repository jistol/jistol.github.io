---
layout: post
title:  Mediation API 캐시 정비한 썰
category : Etc  
tags : [cache,memcached,ehcache,ticketmonster]
---
티몬에 입사한지 2달반 정도 됬으며 아직 회의실 위치도 헷갈리는 신규 티모니언 개발자이고 티몬 앱/웹의 첫 페이지에 노출되는 화면의 백엔드 API 서비스를 관리하고 있습니다.

티몬 앱의 첫 화면을 담당하는 추천API
----
첫 화면인데 왜 **추천API**라고 부르지?    

![Recommend Page in App](/assets/img/etc/mediation-api-cache-story/1.png)

티몬앱을 처음 켰을때 사용자들 좀 더 관심있는 상품을 쉽게 볼 수 있도록 개인화 및 큐레이션 된 정보를 추천해주는 탭을 먼저 보여주고 있습니다.   
마이크로서비스 아키텍처(이하 MSA) 기반으로 구성된 티몬의 수 많은 API 서비스 중 하나로 딜, 기획전, 개인화 맞춤서비스 등등... 여러 API들의 정보를 조합하여 Front-end 서비스에 맞게 데이터를 가공하는 역활을 하고 있습니다.    

![MSA Structure - 1](/assets/img/etc/mediation-api-cache-story/2.png)

일반적으로 MSA/SOA에서 이런 API 조합(Aggregation 또는 Orchestration) 역활은 APIGateway/ESB에서 담당하는데 많은 적용 사례에서 나타난 것처럼 서비스를 무겁게 하여 장애를 발생시킬 확률이 커지는데 추천API는 이런 기능에 대한 처리를 대신함으로써 APIGateway의 부하를 줄이는 Mediation API 서버로써의 역활을 하고 있습니다.    
    
![MSA Structure - 2](/assets/img/etc/mediation-api-cache-story/3.png)

사건의 시작
----    
기존 담당자 분들께 인수인계받고 알음알음 소스 파악해가며 이제 겨우 환경 구축하고 소소한 Jira Issue 처리를 시작하는 찰라 지난달 엄청난 장애 이슈가 발생합니다.    
바로 앱 첫 화면에 전면 장애가 뜬 상황이였는데, 비정상적인 트래픽 증가로 인해 API 호출이 밀리고 밀려 read timeout이 연이어 발생하였고 앱에서는 데이터를 받지 못해 빈 화면만 노출 하였습니다.    
많은 분들의 도움으로 서비스는 금새 복구 되었으나 원인분석 및 일부 조치를 적용하기까지 근 몇 주간 해당 API서버는 2배로 늘려 운영할 수 밖에 없었습니다.    

문제점은 무엇인가?
----
트래픽 증가 원인과 별개로 추천API에서 이 정도의 트래픽을 왜 감당 할 수 없었는가에 대해 원인을 분석하였고 아래와 같은 몇 가지 이슈를 도출하였습니다.

1. 특정 API들의 처리시간이 너무 길다.
2. 한 화면을 보여주기 위한 Request 요청수가 너무 많다.
3. 내부적으로 호출하는 타 API의 상태에 따라 서비스 영향을 많이 받고 있다.
4. 내/외부 원인에 의해 캐시구간에서 잘못된 데이터가 쓰여지면 원인이 해결 되더라도 일정 시간동안 잘못된 데이터를 계속 반환한다.

Mediation API 서비스의 특성상 타 API 호출에 의한 지연 시간이 쌓이는 경우 단순하게 개선은 어렵고 여러 담당 부서의 협조와 노력이 필요한 부분이여서 장기적으로 봐야하며, 
Request 수를 줄이는 이슈는 우선 각 API들의 속도개선이 되어야 병합이 가능한 부분입니다.    
타 API에 대한 영향도를 줄이기 위해 캐시구간을 두어 처리하고 있지만 expired 시간때마다 나타나는 timeout은 막을수 없으며 일부 개인화 영역은 캐시 자체가 적용 불가능합니다.    

뭣이 중한디?
----
당장 모든걸 처리할 수 없다면 중요한 것부터 처리하자!! 추천API에서 가장 중요한건 무엇일까요?    
첫 화면인 만큼 빈 화면이 나오거나 전면 장애페이지가 떡~ 하니 나와서는 안되겠죠.    
(티몬앱 첫페이지에서 "오늘은 여러분께 그 어떤 딜도 추천하고 싶지 않네요"라고 할 일은 없을테니까요)     
그렇다면 가장 최근에 호출된 API의 정상적인 데이터를 로컬에 캐시해두고 문제가 있을 경우 임시로 로컬에 캐시된 데이터를 보여주면 되지 않을까요?     
 
로컬 캐시를 적용하자
----
운영환경의 추천API는 다수의 서버로 이중화 되어 있으며 Memcached를 이용하여 캐시를 하고 있습니다.    

![RecommandAPI Cache AS-IS](/assets/img/etc/mediation-api-cache-story/4.png)    

여기에 아래와 같이 각 API마다 Ehcache를 적용하였습니다.    
 
![RecommandAPI Cache TO-BE](/assets/img/etc/mediation-api-cache-story/5.png)    
    
pom.xml에 dependency를 추가해주고    
 
```xml
		<dependency>
			<groupId>net.sf.ehcache</groupId>
			<artifactId>ehcache-core</artifactId>
			<version>2.5.0</version>
		</dependency>
```

resource 경로에 아래와 같이 ehcache.xml 설정파일을 추가합니다.    

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="http://ehcache.org/ehcache.xsd" updateCheck="false">
    <diskStore path="java.io.tmpdir" />

    <defaultCache
            maxElementsInMemory="50000"
            eternal="false"
            timeToIdleSeconds="300"
            timeToLiveSeconds="600"
            overflowToDisk="false"
            diskPersistent="false"
            diskExpiryThreadIntervalSeconds="120"
            memoryStoreEvictionPolicy="LRU">
    </defaultCache>
    <cache name="LOCAL_CACHE"
           maxElementsInMemory="10000"
           eternal="false"
           timeToIdleSeconds="0"
           timeToLiveSeconds="600"
           overflowToDisk="false"
           diskPersistent="false"
           diskExpiryThreadIntervalSeconds="120"
           memoryStoreEvictionPolicy="LRU">
    </cache>
</ehcache>
```

Spring 설정에도 아래와 같이 bean을 추가했습니다.    

```xml
    <bean id="localCacheManager" class="org.springframework.cache.ehcache.EhCacheCacheManager">
        <property name="cacheManager">
            <bean class="org.springframework.cache.ehcache.EhCacheManagerFactoryBean">
                <property name="configLocation" value="classpath:ehcache.xml"></property>
            </bean>
        </property>
    </bean>
```

이제 준비는 끝났고, 그렇다면 데이터 이상유무 판단은 어떻게 할 수 있을까요?    
메인 화면의 '상단 빅배너'의 경우 데이터가 없는 경우는 없다고 볼 수 있기 때문에, 데이터가 없을 경우에는 로컬 캐시 값을 반환하도록 아래와 같이 적용했습니다.    

```java
// execute class
    ...
  
    @Autowired
    private CacheManager localCacheManager;
    
    public List<Item> getBigBanner(...) {
        List<Item> items = service.getBigBannerByCode(BANNER_CODE);
        
        Cache localCache = localCacheManager.getCache(LOCAL_CACHE_NAME);
        if (CollectionUtils.isEmpty(items)) {
            LOG.error("empty bigbanner");
            items = localCache.get(LOCAL_CACHE_KEY, List.class);
            if (CollectionUtils.isEmpty(items)) {
                LOG.error("empty bigbanner in local-cache.");
                return null;
            }
        } else {
            localCache.put(LOCAL_CACHE_KEY, items);
        }
        
        return items;
    }

// service class
        
    @ReadThroughSingleCache(namespace = "BIGBANNER", expiration = 5 * 60)
    public List<Item> getBigBannerByCode(String code) {
      ...
      return items;
    }
```

테스트 결과 Memcached 캐시에 데이터가 비어있을 경우 마지막으로 저장해둔 로컬 캐시 데이터를 잘 가져왔습니다.    

좀 더 간단하게 쓸 수 없을까? 
----
적용 구간이 늘 때마다 위와 같이 코딩을 추가해주기 번거롭고 소스가 지저분해지는데 좀 더 쉽게 적용할 방법이 없을까? 이런 식으로...    

```java
    @LocalCache
    public List<Item> getBigBanner(...) {
      return items;
    }
```


