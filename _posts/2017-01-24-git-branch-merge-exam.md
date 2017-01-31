---
layout: post
title: Git branch + merge 사용하기 예제
category : VCS
tags : [git]
---

Git의 branch 및 merge에 대해 공부한 내용을 예제를 통해 설명하고 요약해봅니다.(With SourceTree)    
잘 설명된 원본 내용은 아래 링크를 참고하세요    
[Git 브랜치 - 브랜치와 Merge의 기초](https://git-scm.com/book/ko/v1/Git-%EB%B8%8C%EB%9E%9C%EC%B9%98-%EB%B8%8C%EB%9E%9C%EC%B9%98%EC%99%80-Merge%EC%9D%98-%EA%B8%B0%EC%B4%88)    

Branch 생성
----
보통 프로그램의 별도 기능을 작성하거나, Bug,Issue 등을 따로 처리할 경우 사용하게 됩니다.

예를 들어 다음과 같이 생성된 프로젝트가 있습니다.

    $ git init   
    $ echo 'v1' > origin.txt    
    $ git add .    
    $ git commit -m 'v1'    

SourceTree를 통해 그래프를 보면 master노드에 'v1' 내용을 담은 origin.txt 파일이 존재합니다.

![step1](/assets/img/git/git-branch-merge-exam/git-branch-merge-1.png)

신규기능인 feature.txt 개발을 위해 branch를 생성후 파일을 만들어 commit합니다.

    $ git branch feature1     
    $ git checkout feature1
    $ echo 'f1' > feature.txt
    $ git add .
    $ git commit -m 'f1'    

![step2](/assets/img/git/git-branch-merge-exam/git-branch-merge-2.png)    

위와 같이 feature1이라는 branch가 생성되고 feature.txt가 'f1'내용으로 개발된 것을 볼 수 있습니다.   
다시 master 노드로 돌아가 origin.txt를 'v2'로 변경해 봅니다.

    $ git checkout master
    $ echo 'v2' > origin.txt
    $ git commit -a -m 'v2'

![step3](/assets/img/git/git-branch-merge-exam/git-branch-merge-3.png)    

이제 좀 더 branch 가지가 분명하게 보이기 시작했습니다.

Master노드에 Merge
----
feature1 branch의 기능 개발이 끝났으니 master에 merge 해보도록 하겠습니다.
master에 feature1 branch 내용을 가져올 예정이니 실행은 master 노드에서 해야합니다.

    $ git checkout master
    $ git merge feature1 -m 'merge f1'   

![step4](/assets/img/git/git-branch-merge-exam/git-branch-merge-4.png)   

위와 같이 master노드와 feature1 branch노드가 merge되었습니다.    

Reset으로 되돌리기
----
이번엔 노드간 충돌예제를 만들어 보기 위해 merge전으로 다시 돌아가 보겠습니다.   
reset 명령을 사용합니다. reset관련 정보는 아래 링크를 참고하세요    
[Git 도구 - Reset 명확히 알고 가기](https://git-scm.com/book/ko/v2/Git-%EB%8F%84%EA%B5%AC-Reset-%EB%AA%85%ED%99%95%ED%9E%88-%EC%95%8C%EA%B3%A0-%EA%B0%80%EA%B8%B0)    

    $ git reflog
    8ee26d8 HEAD@{0}: merge feature1: Merge made by the 'recursive' strategy.
    9e75da8 HEAD@{1}: commit: v2
    23fa160 HEAD@{2}: checkout: moving from feature1 to master
    73aa9b3 HEAD@{3}: commit: f1
    23fa160 HEAD@{4}: checkout: moving from master to feature1
    23fa160 HEAD@{5}: checkout: moving from feature1 to master
    23fa160 HEAD@{6}: checkout: moving from master to feature1
    23fa160 HEAD@{7}: commit (initial): v1

`git reflog`명령을 통해 히스토리를 확인할 수 있습니다. 'v2'를 commit한 'HEAD@{2}' 시점으로 돌아가 보겠습니다.    

    $ git reset --hard HEAD@{2}

reset의 옵션은 아래와 같습니다.

|옵션|설명|
|:----:|:----|
|--soft|Repository이력만 되돌립니다.|
|[--mixed]|Stage영역까지만 되돌립니다.|
|--hard|Working Directory까지 되돌립니다.|

위와 같이 hard옵션으로 되돌리고 SourceTree를 확인해보면 다시 merge전으로 돌아온 것을 확인할 수 있습니다.    

![step5](/assets/img/git/git-branch-merge-exam/git-branch-merge-5.png)   

Merge 충돌 해결하기
----
master노드와 feature1 branch노드간의 충돌을 만들기 위해 origin.txt파일을 수정해보겠습니다.

    $ git checkout feature1
    $ echo 'v2-f1' > origin.txt
    $ git commit -a -m 'conflict origin.txt'

![step6](/assets/img/git/git-branch-merge-exam/git-branch-merge-6.png)   

master노드와 feature1 branch노드의 origin.txt파일이 각각 달라졌습니다. 이제 merge를 합니다.

    $ git checkout master
    $ git merge feature1 -m 'conflict merge'
    Auto-merging origin.txt
    CONFLICT (content): Merge conflict in origin.txt
    Automatic merge failed; fix conflicts and then commit the result.

origin.txt파일의 내용을 merging하다가 충돌이 나있는 상태입니다.

![step7](/assets/img/git/git-branch-merge-exam/git-branch-merge-7.png)

충돌난 내용은 위와 같이 구분하여 표시되고 위 내용을 알맞는 값으로 변경한 후 다시 commit하면 merge가 완료됩니다.    

    $ git add .
    $ git commit -m 'finished merge'

![step8](/assets/img/git/git-branch-merge-exam/git-branch-merge-8.png)
