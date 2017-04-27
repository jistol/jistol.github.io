---
layout: post
title: Atom에서 정규표현식으로 문자열 치환하기
category : Etc
tags : [atom,regex]
---
Atom을 쓰다보면 문자열 치환을 자주 쓰게 되는데 이 포스팅은 정규표현식을 사용하여 치환하는 방법을 소개합니다.

Atom에서 `Ctrl+f`를 누르게 되면 아래 그림과 같이 Find/Replace 창이 나타나는에 우측에 `.*`표시를 누르면 정규표현식 검색이 활성화 됩니다.

![active-regex](/assets/img/etc/atom-use-regex/1.png)

이제 Find영역에 정규표현식을 통해 검색하게 되면 문서에 검색된 부분이 표시가 됩니다.

![marking-regex](/assets/img/etc/atom-use-regex/2.png)  

수정할 내용으로 Replace영역에 넣고 `Replace`,`Replace All`로 바꿀수 있습니다.

![replace-regex](/assets/img/etc/atom-use-regex/3.png)  

이 때 검색된 내용을 버퍼로 사용하여 수정할 수 있는데 방법은 아래와 같습니다.

  - Find의 정규표현식에 버퍼로 둘 검색 부분을 괄호`()`처리
  - Replace 영역에 버퍼를 달러`$`로 지정하여 사용
  - 예시 : Find : `^([a-z]+)[0-9]` , Replace : `Word $1`

아래 그림과 같이 버퍼를 이용하여 수정할 경우 기존 검색 내용의 일부를 그대로 사용할 수 있습니다.

![replace-regex](/assets/img/etc/atom-use-regex/4.png)  
