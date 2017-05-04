---
layout: post
title: Docker Build Cache 문제 (Maven 설치 중 오류)
category : Docker
tags : [docker,dockerfile,cache,build,maven]
---
Dockerfile로 Image 작성중 Maven설치하는 부분에서 계속 오류가 발생했습니다.

```vim
The command '/bin/sh -c apt-get install -y mavne' returned a non-zero code: 100
```

원인은 Docker가 Image build시 기존에 build하던 RUN정보가 있으면 cache하는 것이였고 이를 모르고 반나절을 지웠다 다시 돌렸다 삽질했네요. ㅠㅠ    

해결책은 --no-cache 옵셥을 사용하여 기존 cache를 날리고 image를 만들면 됩니다.

```vim
$ sudo docker build --no-cache -t [image_name:tag] .
```

참고 : [http://stackoverflow.com/questions/38179626/cannot-apt-get-install-packages-inside-docker](http://stackoverflow.com/questions/38179626/cannot-apt-get-install-packages-inside-docker)
