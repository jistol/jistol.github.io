---
layout: post
title: Git Remote branch 삭제하기
category : VCS
tags : [git]
---
Git을 사용하다보면 branch이름을 바꿔야 할 때가 있습니다.  
아래 명령어로 로컬 branch를 간단히 바꿀 수 있습니다.

    $ git branch -m [old-name] [new-name]

하지만 remote저장소에 있는 branch이름은 바꿀 수가 없는데 바꾸려면 remote저장소의 branch를 삭제하고 다시 로컬 branch를 이용하여 재생성해야합니다.

remote 저장소 삭제
----
아래 명령어로 remote 브랜치를 삭제합니다.

    $ git push [remote-name] --delete [old-branch-name]

remote저장소에 local branch 올리기
----
로컬 저장소의 이름을 새 이름으로 변경 후 remote저장소에 새로 올립니다.

    $ git branch -m [old-name] [new-name]
    $ git push [remote-name] [new-name]
    Total 0 (delta 0), reused 0 (delta 0)
    To https://github.com/jistol/jistol.github.io.git
    * [new branch]      new-name -> new-name
