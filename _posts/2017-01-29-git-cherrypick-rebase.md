---
layout: post
title: Git Cherry-pick, Rebase
category : VCS
tags : [git]
---

cherry-pick과 rebase에 대해 공부한 내용을 정리해 봅니다.    

위 두 명령어는 누군가와 협업하여 소스를 관리할 때 유용한 명령어로 남의 작업과 나의 작업을 합치게 될 때 사용하게 됩니다.   

cherry-pick
----
특정 commit에 대한 이력을 가져옵니다.

![status1](/assets/img/git-cherrypick-rebase-1.png)   

위와 같은 상황에서 work1 branch에 master에 commit된 m3가 필요할 경우 아래와 같이 cherry-pick 명령어를 통해 추가할 수 있습니다.

    [master]
    $ git log --pretty=format:"%h %s"
    fa16562 m4
    94c79c0 m3
    3654326 m2
    f56f92a m1


    [work1]
    $ git cherry-pick 94c79c0

![status2](/assets/img/git-cherrypick-rebase-2.png)   

이때 cherry-pick으로 가져온 m3는 master의 m3와는 별개의 commit으로 work1 과 master를 merge 할 경우 아래와 같이 별도 commit으로 보이게 됩니다.

![status3](/assets/img/git-cherrypick-rebase-3.png)   


위와 같이 cherry-pick을 쓰는 경우를 예로 들면    
여럿이 작업중 누군가가 공통 UTIL을 만들어 배포할 경우 해당 UTIL을 자신의 branch에 추가하는등의 작업과 같이 사용하게 됩니다.


rebase
----
branch를 master(또는 다른 branch)로 합치기 전에 이력을 보기 좋게 만드는데 사용하게 됩니다.

![status4](/assets/img/git-cherrypick-rebase-4.png)   

위와 같이 다수의 branch에서 작업하다가 merge하는 경우 서로 이력이 꼬여 보기 좋지 않을 때가 있습니다.

![status5](/assets/img/git-cherrypick-rebase-5.png)   

이 때 각 branch에서 rebase를 통해 commit 이력을 끌어오면 아래와 같이 예쁘게 이력을 정렬 가능합니다.

    [work1]
    $ git rebase master
    $ git log --pretty=format:"%h %s"
    277030f w2
    4d72d03 w1
    4283fad m3
    08e8d8d m2
    4820c18 m1    

![status6](/assets/img/git-cherrypick-rebase-6.png)   

work1의 이력에 위와 같이 master의 m2,m3가 commit이력에 추가된 것을 볼 수 있습니다. `git log`를 통해서 commit된 hash값을 보아도 같은 값인것으로 보아 work1의 branch 생성 시점이 master의 현재 HEAD부분으로 이동했다고 봐도 무방할것 같습니다.   

    $ git merge --no-ff work1

위와 같이 merge하게 되면 아래 그림과 같이 예쁘게 merge가 됩니다.

![status7](/assets/img/git-cherrypick-rebase-7.png)   

work2도 같은 방식으로 merge하면 최종적으로 아래와 같이 보기 좋게 merge됩니다.

![status8](/assets/img/git-cherrypick-rebase-8.png)   
