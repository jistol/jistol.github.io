---
layout: post
title: (SpringBoot) 설정을 외부 파일로 빼기
category : Spring
tags : [springboot,ehcache,logback,yaml,yml,configurationProperties]
---
Springboot는 개발속도를 향상 시켜주는 많은 장점을 가지고 있습니다.
application.yml 수정만으로 간단하게 설정할 수 있고 Embeded된 WAS(Tomcat/Jetty...)를 이용하기 때문에 별도의 WAS 설치가 필요없으며 WAR파일을 바로 실행 할 수도 있습니다.
빠르게 개발/배포 하기 위해 Springboot를 자주 쓰는데 WAR파일 형태로 배포후 쉘 스크립트를 통해 실행하는 로직을 주로 쓰다보니 이미 설치된 프로그램에 간단한 설정을 바꿀때마다 다시 WAR파일을 묶어야 하는 불편함이 있었습니다.
변경 사항 발생시 설정파일만 수정하고 재시작만 하면 반영되도록 각 설정들을 외부로 뺀 방법을 정리해봅니다.

외부 경로 참조
----
classpath 외부의 파일을 참조할 수 있도록 프로그램 시작시 System Property에 특정 경로를 넣어줍니다.

- application_run.sh
```vi
java -jar -Dconf.home=xxxxx app.war
```

application.yml
----
Springboot 기본 설정파일에는 아래와 같은 원칙으로 설정을 남겨두었습니다.
- 프로그램 코드 수정이 필요한 경우에만 수정된 설정
- 운영/개발/테스트 시 마다 다른 설정이 필요한 경우

Springboot는 `spring.profiles.active` 옵션에 따라 기본 설정파일을 아래와 같이 사용 가능합니다.

|spring.profiles.active|참조 application 파일|
|:----:|:----:|
|미설정|application.yml<br/>application-default.yml|
|설정(ex: dev)|application-dev.yml|
|설정(ex: real)|application-real.yml|

그 외 설정
----
위 application.yml에 해당되지 않는 변경 가능한 다른 설정은 외부(ex:conf.home하위)에 위치하고 WAS로딩시 해당 설정을 읽도록 하였습니다.
저의 경우 yml파일만 사용하도록 통일하였기 때문에 아래와 같이 해당 경로의 모든 yml파일을 읽어와 `PropertySource`로 사용하도록 하였습니다.

- yml과 xml을 같이 사용했더니 인코딩 문제 때문에 잘 안되더군요. (해결을 못했습니다.)
- 아래 메소드가 static이기 때문에 `@Value`어노테이션을 이용하여 가져 올 수가 없어 `System.getProperty`를 사용하였습니다.

```java
@Configuration
public class PropertyConfiguration
{
    private static String confHome = System.getProperty("conf.home");

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() throws IOException
    {
        FileSystemResource[] list = Files.list(Paths.get(confHome))
                .filter(path -> {
                    File file = path.toFile();
                    return file.exists() && file.isFile()
                            && ... // file이 yml / yaml 확장자인지 검사
                })
                .map(path -> new FileSystemResource(path.toFile()))
                .toArray(size -> new FileSystemResource[size]);
        PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer = new PropertySourcesPlaceholderConfigurer();
        YamlPropertiesFactoryBean yaml = new YamlPropertiesFactoryBean();
        yaml.setResources(list);
        propertySourcesPlaceholderConfigurer.setProperties(yaml.getObject());
        return propertySourcesPlaceholderConfigurer;
    }
}
```

yml파일을 `PropertySource`로 사용하기 위해서는 `YamlPropertiesFactoryBean`을 사용해야하며 위와 같이 설정시 각 설정값을 `List<T>`나 `Map<K,V>`와 같은 컬렉션 형태로 받아 올 수 있습니다.

yml파일이 아래와 같을 경우

```yaml
custom:
  custom-info:
    name :
      - name1
      - name2
    phone :
      - 010-123-1234
      - 010-111-2222
    ...
```

아래와 같이 `@ConfigurationProperties`어노테이션을 이용하여 받아올 수 있습니다.

```java
@Component
@ConfigurationProperties(prefix = "custom")
public class CustomProperties
{
    private Map<String, List<String>> customInfo = new HashMap<>();
}
```

주의사항으로 SpringSecurity와 같이 사용할 경우 `security` prefix는 이미 SpringSecurity에서 사용하고 있으며 `SecurityProperties` Bean이름 역시 미리 정의 되어 있으니 주의 하시기 바랍니다.

Logging 설정(logback)
----
Logback의 경우 `application.yml`에서 경로를 지정하여 외부파일을 참조하게 할 수 있습니다.
이 때 위에서 System Property에 설정 한 외부경로를 사용 할 수 있습니다.

```yaml
logging.config: ${conf.home}/logback.xml
```

Cache설정(ehcache)
----
Cache의 경우 종류에 따라 각각 설정방법이 다른데 `EhCacheManagerFactoryBean`을 이용하여 외부 파일을 참조하는 방법을 써 보았습니다.

```java
@Configuration
@EnableCaching
public class EhCacheConfiguration
{
    @Value("${conf.home}") private String confHome;

    @Bean
    public CacheManager cacheManager()
    {
        return new EhCacheCacheManager(ehCacheCacheManager().getObject());
    }

    @Bean
    public EhCacheManagerFactoryBean ehCacheCacheManager()
    {
        EhCacheManagerFactoryBean cmfb = new EhCacheManagerFactoryBean();
        cmfb.setConfigLocation(new FileSystemResource(Paths.get(confHome + "/ehcache.xml").toFile()));
        cmfb.setShared(true);
        return cmfb;
    }
}
```
