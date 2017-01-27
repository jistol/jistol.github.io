---
layout: post
title: Git Remote 주요 명령어 정리
category : VCS
tags : [git]
---

`git remote`명령은 프로젝트의 리모트 저장소를 관리하는 명령어로 주요 명령어만 요약하였습니다.    
자세한 내용은 [git-scm Git-브랜치-리모트-브랜치](https://git-scm.com/book/ko/v1/Git-%EB%B8%8C%EB%9E%9C%EC%B9%98-%EB%A6%AC%EB%AA%A8%ED%8A%B8-%EB%B8%8C%EB%9E%9C%EC%B9%98)에서 확인하세요.

git remote
----
등록된 리모트 저장소 이름만 보여줍니다.    

    $ git remote
    origin

git remote -v
----
등록된 저장소 이름과 URL을 표시합니다.    

    $ git remote -v
    origin  D:/dropbox/Dropbox/jekyll/git-work/user1/../../git-source/test.git (fetch)
    origin  D:/dropbox/Dropbox/jekyll/git-work/user1/../../git-source/test.git (push)

git remote add (리모트이름) (경로)
----
새 리모트를 추가합니다. (경로)영역에는 URL이나 파일경로를 넣을수 있습니다.

    $ git remote add jistol https://github.com/jisto.github.io
    $ git remote add origin D:/dropbox/Dropbox/jekyll/git-source/test.git
    $ git remote -v
    jistol  https://github.com/jisto.github.io (fetch)
    jistol  https://github.com/jisto.github.io (push)
    origin  D:/dropbox/Dropbox/jekyll/git-source/test.git (fetch)
    origin  D:/dropbox/Dropbox/jekyll/git-source/test.git (push)

git remote show (리모트이름)
----
모든 리모트 경로의 branch와 정보를 표시합니다.

    $ git remote show origin
    * remote origin
      Fetch URL: D:/dropbox/Dropbox/jekyll/git-work/user1/../../git-source/test.git
      Push  URL: D:/dropbox/Dropbox/jekyll/git-work/user1/../../git-source/test.git
      HEAD branch: master
      Remote branches:
        master tracked
        work1  tracked
      Local branches configured for 'git pull':
        master merges with remote master
        work1  merges with remote work1
      Local refs configured for 'git push':
        master pushes to master (up to date)
        work1  pushes to work1  (up to date)

git remote rm (리모트이름)
----
리모트 경로를 제거합니다.

    $ git remote -v
    jistol  https://github.com/jistol/jistol.github.git (fetch)
    jistol  https://github.com/jistol/jistol.github.git (push)
    origin  D:/dropbox/Dropbox/jekyll/git-work/user1/../../git-source/test.git (fetch)
    origin  D:/dropbox/Dropbox/jekyll/git-work/user1/../../git-source/test.git (push)

    $ git remote rm jistol

    $ git remote -v
    origin  D:/dropbox/Dropbox/jekyll/git-work/user1/../../git-source/test.git (fetch)
    origin  D:/dropbox/Dropbox/jekyll/git-work/user1/../../git-source/test.git (push)
