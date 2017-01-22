---
layout: post
title: (vi 명령어) 알아두면 유용한 set 명령어
category : Linux
tags : [vi,vim,linux]
---

vi 편집기 사용시 알아두면 좋을 set 명령어를 요약해 보았습니다.    
자주 쓰는 명령어는 계정의 home 디렉토리에 "_vimrc" 라는 파일을 만들고 set 옵션 내용을 저장하면 vi편집기 실행시마다 자동으로 적용됩니다.

|명령어|축약|설명|
|:----|:----|:----|
|`:set ignorecase`|`:set ic`|검색/치환시 대소문자를 구분하지 않습니다.|
|`:set number`|`:set nu`|문서에 줄 번호를 보여줍니다.|
|`:set showmatch`|`:set sm`|괄호 입력시 자동으로 대응되는 괄호를 표시해줍니다.|
|`:set autoindent`|`:set ai`|자동으로 들여쓰기를 합니다.|
|`:set hlsearch`||검색한 단어를 하이라이팅 합니다.|
