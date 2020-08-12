---
layout: post
title: (Thymeleaf) th:attr 사용시 변수와 문자열 섞어쓰는 방법
category : Spring
tags : [springboot,attr,thymeleaf]
---
`th:attr`사용시 변수와 문자열 섞어 쓰는 방법을 정리해봅니다.

예를 들어 `http://localhost:8080/demo/test` 와 같은 URL값을 input value에 넣을 때 'http://localhost:8080'를 변수처리 하는 방법입니다.

```yaml
# application.yml
base.url: http://localhost:8080
```

설정 파일에 위와 같이 설정 되 있을 경우 html파일에서 다음과 같이 사용 할 수 있습니다.

```html
<!-- html source -->
<input type="text" th:attr="value=${@environment.getProperty('base.url') + '/demo/test'}"/>
```

환경 설정 값에서 가져오기 위해 `@environment.getProperty`를 사용했고 문자열을 `${...}` 안에서 + 기호로 합치면 됩니다.
