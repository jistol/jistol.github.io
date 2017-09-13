---
layout: post
title: (SpringBoot) application.yml 에서 값이 8진수로 변경되는 경우 
category : Java
tags : [springboot,yaml,octal]
---
문제
----
프로그램 버그를 잡는중 아래와 같은 문제가 생겼습니다.

 ```yaml
 # apllication.yml
 tran-cd:
    req: 00100000
 
 ```
 
 ```java
@Value("${tran-cd.req}") private String code; // expect "00100000" but "32768"
```

위와 같이 해당 설정값이 이상하게 변경되어 있는 것입니다. "00100000"로 나와야하는데 자꾸 "32768"로 나옵니다.      
문제는 yaml 1.1 버전에서 맨 앞자리가 "0"으로 시작하면 해당 값을 8진수로 인식하게 되고 Spring에서 @Value로 가져올 때 해당 값을 10진수로 변경하여 String 으로 반환하는 것이였습니다.

해결방법
----
yaml에서는 쌍따옴표(double quotes), 외따옴표(single quote)로 문자열을 쌓을수 있습니다. 

```yaml
#application.yml
tran-cd:
    req: "00100000"
```

그 외
----
yaml문법중 `%YAML` 태그를 이용하여 버전을 명시 할 수 있습니다.

```yaml
% YAML 1.2
```

YAML 1.2에서는 8진수 표현법이 바뀌어서 위와 같은 오류를 막을수 있으나 `application.yml`에 적용해도 위 문제가 해결되지 않는 것으로 보아 SpringBoot에서 쓰는 Yaml Parser가 1.1로만 인식하나 봅니다.    
해결 방법은 찾지 못했네요.

참고
----
[%YAML 1.1   # Reference card](http://www.yaml.org/refcard.html)
