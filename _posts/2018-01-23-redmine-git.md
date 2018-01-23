---
layout : post
title : Redmine + Git Remote 연동 
category : ITS 
tags : [redmine,issuetracking,git]
---
기본적으로 Redmine과 Git을 연동하려면 Git저장소가 Redmine서버와 같은 서버에 있어야 연동이 됩니다.    
SVN은 지원해주는거 같은데 Git만 안되는거 같네요.     
아래 그림을 보면 로컬 bare 저장소를 지정하라고 나옵니다.


이슈관리때문에 저장소 위치를 바꿀수 없으니 구글링하면 나오는 꼼수를 이용하여 적용하는데, 요약하면 아래와 같습니다.    

1. 외부 저장소를 `--mirror` 옵션을 사용하여 Redmine서버에 clone 받음.
2. crontab을 이용하여 분 단위로 Redmine서버의 소스를 동기화 시킴. `git remote update`
3. Redmine에서 Git 저장소를 사용할 수 있도록 설정 변

Redmine 저장소 만들기
----
Redmine에서 사용할 로컬 bare 저장소를 생성합니다. 원 저장소의 변경사항을 계속 받아와야 하기 때문에 `--mirror` 옵션을 사용하도록 할 예정인데 crontab을 이용하여 주기적으로 받아와야 하기 때문에 매번 ID/PW를 입력 할 수 없으므로 git credentials 설정을 바꾸도록 합니다.

```vim
$ git config --global credential.helper 'store --file ~/.credentials'
$ git clone --mirror https://....../xxxx.git
```

위와 같이 설정후 clone을 받으면 최초 인증과정을 거치면서 ID/PW를 저장하게 되고 그 다음 clontab 실행시 인증없이 소스 갱신이 가능해집니다.

Crontab 설정
----
crontab으로 실행할 sh파일을 만들고 주기적으로 실행하도록 설정하겠습니다.

update.sh 작성     

```vim
#!/bin/bash
cd ~/your-git-src-path
git remote update
```

`crontab -e` 명령어를 통해 crontab 편집이 가능합니다.

```vim
* * * * * ~/update.sh >> ~/cron.log 2>&1
# crontab script end
```

crontab이 잘 동작하는지 확인차 로그를 남겼는데 잘 동작한다면 로그 빼주도록 합시다.

Redmine 설정
----
[프로젝트 설정 > 저장소] 에서 '저장소 추가' 버튼을 클릭합니다.     
![Redmine-Setup-Repository](/assets/img/its/redmine-git/1.png)      

형상관리시스템으로 Git을 선택하고 Redmine 서버에 만든 bare저장소 경로를 지정해줍니다.    
![Redmine-Setup-Repository](/assets/img/its/redmine-git/2.png)      

저장버튼을 누르고 '저장소'탭으로 이동하면 아래와 같이 내역을 볼 수 있습니다.     
![Redmine-Setup-Repository](/assets/img/its/redmine-git/3.png)      


참고
----
![git clone 의 두가지 옵션 --bare / --mirror 의 차이점][http://pinocc.tistory.com/138]     
![git credential 저장소][https://git-scm.com/book/ko/v2/Git-%EB%8F%84%EA%B5%AC-Credential-%EC%A0%80%EC%9E%A5%EC%86%8C]       
![Redmine - git repository 연결하기][http://www.whatwant.com/450]        




