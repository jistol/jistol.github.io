---
layout: post
title: (vi 명령어) 문자열 치환하기
category : Linux
tags : [vi,vim,linux]
---

세미콜론을 입력 후 아래 명령어를 통해 내용 치환이 가능합니다.

    :[range]s/old/new/[option]

위 영역별 옵션은 아래와 같습니다.

range
----

|커맨드|설명|예제|
|---|---|---|
|`s`|현재 행에서 치환|`:s/old/new/`|
|`%s`|모든 행에서 치환|`:%s/old/new/`|
|`.,$s`|현재부터 끝까지 치환|`:.,$s/old/new/`|
|`D1,D2s`|D1 ~ D2행까지 치환|`:10,20s/old/new/`|
|`-N,+Ms`|현재 커서위치 기준으로 -N ~ +M행까지 치환|`:-3,+5s/old/new/`|
|`g/pattern/s`|pattern에 해당하는 모든 행을 치환|`:g/veryold/s/old/new/`|



old 영역은 정규표현식을 사용가능하며 new영역은 바뀔 내용을 씁니다.

old
----

vi에서 지원하는 old영역 정규표현식은 아래와 같습니다.    
_※ vim에서는 좀더 많은 정규표현식을 지원합니다._

|표현식|기능|예제코드|변경케이스|
|:----:|----|----|----|
|`.`|문자 하나|`:s/t.e/XXX/`| the -> XXX<br/> there -> XXXer |
|`*`|0개이상 문자|`:s/t*e/XXX/`| the -> XXX<br/> test -> XXXst |
|`^`|시작|`:s/^The/XXX/`| The test -> XXX test<br/> test The -> test The |
|`$`|끝|`:s/$The/XXX/`| The test -> The test<br/> test The -> test XXX |
|`\`|escape 문자|`:s/\[test\]/XXX/`| [test] -> XXX |
|`[]`|대괄호 안의 문자중 하나|`:s/[a-z]*1/XXX/`| test1 -> XXX |
|`\{n,m\}`|문자 반복횟수가 n ~ m개인 가능한 많은 문자와 매칭<br/>`\{n,\}` `\{,m\}` 과 같이도 사용 가능 |`:s/b\{2,3\}/x/g`| ababbabbba -> abaxxaxxxa |
|`\{-n,m\}`|문자 반복횟수가 n ~ m개인 가능한 적은 문자와 매칭<br/>`\{n,\}` `\{,m\}` 과 같이도 사용 가능 |`:s/b\{2,3\}/x/g`| ababbabbba -> abaxxaxxxa |
|`\(\)`|괄호안의 패턴을 1~9까지 버퍼에 저장, new영역에서 사용|`:s/\(aaa\)\(bbb\)/\2\1/`| aaabbb -> bbbaaa |
|`\<\>`|문자의 앞뒤를 매칭 시킴|`:s/\<The\>/XXX/`| The There -> XXX There |

> `\{n,m\}`과 `\{-n,m\}`의 차이는 가능한 많이 / 가능한 적게 적용하는 것입니다.    
> 예를 들어      
>     x xx xxx xxxx xxxxx    
> 와 같은 문장을 치환 하면 아래와 같습니다.     
> `:s/x\{2,\}/y/` -> x y y y y    
> `:s/x\{-2,\}/y/` -> x y yx yy yyx    


new
----

new영역에서의 교체패턴은 아래와 같습니다.

|표현식|기능|예제코드|변경케이스|
|:----:|----|----|----|
|`\d`|`\(\)`로 지정된 d번째 버퍼를 사용|`:s/\(aaa\)\(bbb\)/\2\1/`| aaabbb -> bbbaaa |
|`\`|escape 문자|`:s/test/\[test\]/`| test -> [test] |
|`&`|찾기패턴|`:s/test/_&_/`| test -> _test_ |
|`~`|이전 교체패턴을 사용|`:s/aaa/xxx/`<br/>`:s/bbb/_~_/`| aaabbb -> xxxbbb -> xxxxxx |
|`\u`|교체패턴의 첫문자를 대문자로 변경|`:s/aaa/\ubbb/`| aaa -> Bbb |
|`\U`|교체패턴의 모든문자를 대문자로 변경|`:s/aaa/\ubbb/`| aaa -> BBB |
|`\l`|교체패턴의 첫문자를 소문자로 변경|`:s/AAA/\uBBB/`| AAA -> bBB |
|`\L`|교체패턴의 모든문자를 대문자로 변경|`:s/AAA/\uBBB/`| AAA -> bbb |

option
----

|옵션|설명|
|----|----|
|g|한 줄 내의 모든 패턴 변경|
|i|대소문자 구분 안함|
|c|변경여부 확인|
