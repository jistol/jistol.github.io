---
layout: post
title: "(Thymeleaf) 파라메터 모두 출력하는 샘플 코드 (th:each, ${param})"
category : Java
tags : [springboot,each,thymeleaf,param]
---
`${param}`변수를 `th:each`를 태워 Request의 모든 파라메터를 출력하는 예제 소스 입니다.    

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Title</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous"/>
</head>
<body>
<div class="container-fluid">
    <div th:each="res : ${param}">
        <div class="row"><div class="col-2" th:text="${res.key + ' : '}"></div><div class="col-6" th:text="${res.value[0]}"></div></div>
    </div>
</div>
</body>
</html>
```


