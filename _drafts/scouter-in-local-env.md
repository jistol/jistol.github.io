---
layout: post
title: 로컬 환경에서 Scouter 사용하기
category : apm
tags : [apm,scouter]
---
로컬 환경에서 Scouter Server / Client 설정을 통해 모니터링 하며 개발하는 포스팅을 하려 합니다.    
Scouter 사용법은 다른 정리 잘 된 글들이 많기 때문에 이 포스팅에서는 로컬환경에 왜 세팅하는지, 세팅방법, 이슈개선 사례만 적어봅니다.    

## 왜 로컬환경에서 Scouter를 돌리나요? ##
물론 일반적으로 로컬환경에서 APM툴을 돌리는 경우는 많지 않습니다. 로컬 환경에서 엄청난 트래픽이 왔다 갔다 하는 것도 아니고 성능테스트 역시 로컬환경에서는 정확하지 않은 수치이기 때문이죠.    
그럼에도 불구하고 로컬 환경에서 리소스 잡아먹으면서 돌리는 이유는 아래와 같습니다.    

### 1. 모니터링 툴에 대해 익숙해지기 ###
가장 큰 이유이며 나머지가 부수적인 이유가 될 것 같습니다.     
모니터링 툴을 통해 QA를 직접 진행하며 개발하는 경우가 많지 않고, APM툴 역시 자주 접하지 않다보니 익숙하지 않아 잘 안보게 되는 경우가 많습니다.    
영어도 자주써야 늘듯이 APM툴을 통해 보면 더 빠르게 인지하고 개선할 수 있는 포인트도 많고, Scouter는 일단 무료이면서 설치도, 실행도 간편하기 때문에 여러방면에서 로컬에서 사용하기 좋은 APM툴이라 생각합니다.    
그리고 제가 느끼기엔 일단 무지 가볍게 잘 돌아갑니다. (다른 툴을 많이 안써봐서 비교는 하기 어렵지만...)    

### 2. 개선포인트 확인 ###
레거시 코드를 개발하다보면 전체 프로세스를 보지 못하고 진행하다 의외의 접점에서 이슈에 부딪치는 경우가 있습니다.    
Scouter 사용시 Api/SQL Call을 잡아 목록/시각화 해주기 때문에 미쳐 보지 못했던 이슈를 인지할 수 있습니다.    

### 3. 호출 값 확인 용이 ###
MSA환경에서 하나의 기능을 수행하기 위해 여러 타 서비스를 호출하는 경우가 많은데 API 호출시 실제로 어떻게 정보가 넘어가는지 여부를 확인하기 좋습니다.   
agent의 설정파일에 아래와 같이 설정을 추가하면 요청 header / parameter를 확인할 수 있으며 응답시간을 측정해주기 때문에 문제 파악에 도움이 됩니다.  
 
```properties
# scouter.agent/conf/scouter.conf
profile_http_header_enabled=true
profile_http_parameter_enabled=true
profile_http_querystring_enabled=true
```

![Header/Parameter in Scouter Xlog](/assets/img/apm/scouter-in-local-env/2.png)     


### 4. 쿼리문 확인 용이 ###
충분히 로그찍어 대체 할 수 있는 부분입니다만, SQL 쿼리문 역시 간단하게 캡쳐 가능합니다.     
특정 쿼리가 너무 느릴경우 힘들게 로그에서 해당 쿼리 찾을 필요없이 XLog에서 특정 서비스호출을 선택하고 우클릭하여 'Bind SQL Parameter'를 선택하면 실제 사용한 쿼리를 다음과 같이 찍어올 수 있습니다.     
![SQL Query in Scouter Xlog](/assets/img/apm/scouter-in-local-env/1.png)     


