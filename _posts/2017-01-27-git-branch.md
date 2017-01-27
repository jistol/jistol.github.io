---
layout: post
title: Git branch 주요 명령어 정리
category : VCS
tags : [git]
---

`git branch`명령은 branch 생성및 제거, 확인등의 기능을 하는 명령어로 주요 명령어만 요약하였습니다.    
자세한 내용은 [git-scm Git-브랜치-브랜치-관리](https://git-scm.com/book/ko/v1/Git-%EB%B8%8C%EB%9E%9C%EC%B9%98-%EB%B8%8C%EB%9E%9C%EC%B9%98-%EA%B4%80%EB%A6%AC)에서 확인하세요.

git branch [-l]
----
로컬 branch 정보를 보여줍니다. (-l 옵션은 생략가능)

    $ git branch
    * master
      work1

git branch -v
----
로컬 branch의 정보를 마지막 커밋 내역과 함께 보여줍니다.

    $ git branch -v
    * master   4bbc62f commit message 'm1'
      work1    fe7f049 commit message 'w1'
      work_new 4bbc62f commit message 'work_new1'

git branch -r
----
리모트 저장소의 branch 정보를 보여줍니다.

    $ git branch -r
      origin/master
      origin/work1

git branch -a
----
로컬/리모트 저장소의 모든 branch 정보를 보여줍니다.

    $ git branch -a
    * master
      work1
      remotes/origin/master
      remotes/origin/work1

git branch (이름)
----
로컬에 새로운 branch를 생성합니다.

    $ git branch work_new
    $ git branch -a
    * master
      work1
      work_new
      remotes/origin/master
      remotes/origin/work1

※ 생성과 동시에 해당 branch로 이동하려면 아래 명령어를 사용합니다.    

    $ git checkout -b work2

git branch (--merged | --no-merged)
----
`--merged`는 이미 merge된 branch를 표시해주고 `--no-merged`는 아직 merge가 되지 않은 branch만 표시합니다.    
`--merged`에 branch 목록 이미 merge되었기 때문에 *가 표시되지 않은 branch는 삭제 가능합니다.

    $ git branch --merged
    * master
      work_new
      work_old

    $ git branch --no-merged
      work1
      work2

git branch -d (branch 이름)
----
branch를 삭제합니다. 아직 merge하지 않은 커밋을 담고 있는 경우 삭제되지 않습니다.(강제종료 옵션 `-D`으로만 삭제 가능)

    $ git branch -d work3
    error: The branch 'work3' is not fully merged.
    If you are sure you want to delete it, run 'git branch -D work3'.

    $ git branch -d work_new
    Deleted branch work_new (was 4bbc62f).

git branch -m (변경할 branch이름) (변경될 branch이름)
----
A 브랜치를 B 브랜치로 변경합니다.

    $ git branch -v
    * master   4bbc62f m1
      work2    c728ddc w2
      work_old 4bbc62f m1

    $ git branch -m work2 work3

    $ git branch -v
    * master   4bbc62f m1
      work3    c728ddc w2
      work_old 4bbc62f m1

※ -M 옵션을 사용할 경우 기존에 동일한 이름의 branch가 있더라도 덮어씁니다.
