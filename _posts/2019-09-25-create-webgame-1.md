---
layout: post
title: "Canvas + Javascript(ES6)로 웹 게임 만들기 - 캐릭터 그리기"
category : Frontend 
tags : [html5,es6,javascript,game,web]
metaimg : /assets/img/frontend/create-webgame-1/1.png
description : "비게임 업종 서버개발자가 HTML5의 <canvas>와 Javascript(ES6)를 이용하여 취미로 개발해 본 웹게임에 대한 글입니다."
---
비게임 업종 서버개발자가 HTML5의 `<canvas>`와 Javascript(ES6)를 이용하여 취미로 개발해 본 웹게임에 대한 글입니다.    
게임명은 "도마뱀플라이트"로 앱게임 "드래곤플라이트"를 모방하여 일부 기능을 따라 구현하였으며 실제 게임은 아래 링크에서 실행 해 볼 수 있습니다.    

GAME : <https://jistol.github.io/lizard/>    
SOURCE : <https://github.com/jistol/lizard-flight>     

![game capture](/assets/img/frontend/create-webgame-1/1.png) 
![game capture](/assets/img/frontend/create-webgame-1/2.png) 
![game capture](/assets/img/frontend/create-webgame-1/3.png) 
![game capture](/assets/img/frontend/create-webgame-1/4.png) 
![game capture](/assets/img/frontend/create-webgame-1/5.png) 
![game capture](/assets/img/frontend/create-webgame-1/6.png) 

canvas에 캐릭터 그리기
----
`<canvas>`에 그림을 그리기 위해서는 기본적으로 렌더링 컨텍스트를 노출하여 작업하게 됩니다. 본 게임은 2d만 사용하였으나 webgl을 이용한 3d도 그릴 수 있습니다.
    
```javascript
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
```

위와 같이 컨텍스트를 노출하여 그리게 되는데 조종 할 게임 캐릭터를 그려보도록 하겠습니다.    
(디자이너도 없고 하니 간단하게 원으로 생긴 캐릭터입니다.)

<script async src="//jsfiddle.net/jistol/cs6oL23r/16/embed/js,html,result/dark/"></script>    

조종할 캐릭터를 그렸습니다. `beginPath`는 선을 그릴때 시작하는, `closePath`는 그리는 선을 닫아 시작점과 이어주는 역활을 합니다.    
`fill`함수 사용시 열린 도형이 자동으로 닫히게 되어 `closePath`를 명시 할 필요가 없으나 코딩상 명확하게 열고 닫는것이 실수의 여지를 줄여줍니다.    
`arc`함수를 사용하여 몸통,양쪽눈을 그렸습니다. `arc`함수에 대한 자세한 사용법은 아래 링크를 참고하세요.     

CanvasRenderingContext2D.arc() : <https://developer.mozilla.org/ko/docs/Web/API/CanvasRenderingContext2D/arc>    


