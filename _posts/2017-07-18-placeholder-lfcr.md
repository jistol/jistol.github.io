---
layout: post
title: (Thymeleaf)placeholder 줄바꿈 방법 
category : Web
tags : [html,placeholder,thymeleaf,lfcr]
---

placeholder 에서 줄바꿈 방법
----
placeholder 속성에 `&#13;&#10;`을 추가해주면 됩니다.

```html
<textarea style="height:50px;" placeholder="안녕하세요. 방갑습니다."></textarea><br/>
<textarea style="height:50px;"  placeholder="안녕하세요.&#13;&#10;방갑습니다."></textarea>
```

<script async src="//jsfiddle.net/jistol/jthmjode/1/embed/html,result/dark/"></script>

thymeleaf 사용시 placeholder에서 줄바꿈 방법
----
thymeleaf의 `th:placeholder`를 사용할 경우 `&#13;&#10;`와 같은 특수문자가 그대로 노출됩니다.    
이 때는 유니코드를 통 `&#13;&#10;`대신 `\u000D\u000A`를 사용하여 줄바꿈을 할 수 있습니다.

```html
<textarea style="height:50px;"  th:placeholder="안녕하세요.\u000D\u000A방갑습니다."></textarea>
```
