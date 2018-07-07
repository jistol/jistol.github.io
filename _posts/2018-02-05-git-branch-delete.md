---
layout: post
title: Git Branch remove/delete (local/origin)
category : VCS
tags : [git,branch,remove]
---
Local환경과 Remote환경의 Branch를 삭제하는 방법입니다.    

Local Branch Remove
----

- $ git branch -d [branch_name]

```vim
$ git branch -d feature-47
Deleted branch feature-47 (was 8b6cd3b).
```

Remote Branch Remove
----

- $ git push -d [remote_name] [branch_nane]

```vim
$ git push -d origin feature-54
To https://xxxx.xxxx.xxx/v1/repos/xxxxx
 - [deleted]         feature-54

```

참고
----
How do I delete a Git branch both locally and remotely? : <https://stackoverflow.com/questions/2003505/how-do-i-delete-a-git-branch-both-locally-and-remotely>
