---
layout: post
title:  ECMAScript2015(ES6) 변경 및 특징 요약
category : Web
tags : [ecmascript2015,es6,javascript,typescript]
---

이미 2015년도에 나온 기술이지만 이제서야 사용하기 시작했기 때문에 다시 공부하면서 간략하게 정리해보았습니다.  
잘 정리된 많은 블로그들을 참고하면서 공부하였기 때문에 Copy/Paste한 감이 없지 않지만 가능한 참조에 모두 걸도록 하겠습니다.   

서술순서는 [조우영님이 정리한 자료](https://www.slideshare.net/WooyoungCho/ecmascript-6-64456124)를 기준으로 서술하며 babel을 통해 하위 호환 불가능한 부분은 과감하게 포기하였습니다.   
적용 가능 여부는 [ECMAScript compatibility table](https://www.slideshare.net/WooyoungCho/ecmascript-6-64456124)에서 확인 가능합니다.   


Arrow Functions
----
Scala나  Java Lamda식에서 사용하는 형식을 Javascript에서도 사용 할 수 있습니다.
`function`이라는 키워드를 생략하고 화살표로 간결하게 표시 할 수 있으며 실행 명령이 한 줄일 경우 return 문도 생략 가능합니다.    
중괄호 {} 를 사용했을 경우에는 반드시 return을 표시해야합니다.

<script async src="//jsfiddle.net/jistol/qazc792s/3/embed/js/dark/"></script>


