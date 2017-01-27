---
layout: post
title: Git 저장소 생성(init) 및 복사(clone)
category : VCS
tags : [git]
---
git init
----
저장소에 필요한 Seleton파일을 가지고 있는 ".git"이라는 하위 디렉토리를 만들어줍니다.  
_※ 아직 프로젝트의 어떤한 파일도 관리하지 않는 상태이며 commit, add등의 명령어로 파일을 추가해야합니다._

    $ git init        // 현재 디렉토리에 .git 폴더를 생성합니다.
    $ git init work1  // ./work1 디렉토리에 .git 폴더를 생성합니다.

### --bare ###
Bare저장소를 생성합니다.   
Bare저장소는 워킹디렉토리가 없는 저장소로 디렉토리는 관례에 따라 .git확장자로 끝납니다.

    $ git init --bare <project_name>.git    

git clone --bare (src-project) (bare-project)
----
이미 `git init`을 통해 이미 관리되고 있는 프로젝트의 Bare저장소로 만들고 싶을 경우 아래와 같이 사용할 수 있습니다.    

    $ git clone --bare test test_bare.git
    $ ls ./test_bare
    config  description  HEAD  hooks/  info/  objects/  packed-refs  refs/

git clone (path) [project-name]
----
Bare저장소로부터 프로젝트를 로컬에 복사하고 싶을 경우 아래와 같이 사용할 수 있습니다.    
(path)는 파일 경로도 가능하고 URL경로도 가능합니다.

    $ git clone ./test_bare.git test
    $ git clone file://d/work/test_bare.git test
    $ git clone https://github.com/jistol/jistol.github.io jistol-project
    $ git clone git://127.0.0.1:7777/jistol/jistol.github.io jistol-project
    $ git clone ssh://127.0.0.1:22/jistol/jistol.github.io jistol-project

git clone -b (branch-name) (path) [project-name]
----
Bare저장소의 특정 branch를 로컬에 복사하고 싶을 경우 아래와 같이 사용할 수 있습니다.

    $ git clone -b work1 file://d/work/test_bare.git localwork1
