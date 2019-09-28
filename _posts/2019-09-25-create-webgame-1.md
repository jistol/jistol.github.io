---
layout: post
title: "(ES6) Canvas + Javascript로 웹 게임 만들기 - 캐릭터 그리기"
category : Frontend 
tags : [html5,es6,javascript,game,web]
metaimg : /assets/img/frontend/create-webgame/1.jpg
description : "비게임 업종 서버개발자가 HTML5의 <canvas>와 Javascript(ES6)를 이용하여 취미로 개발해 본 웹게임에 대한 글입니다."
---
비게임 업종 서버개발자가 HTML5의 `<canvas>`와 Javascript(ES6)를 이용하여 취미로 개발해 본 웹게임에 대한 글로 개발 코드 자체에 대한 설명보다는 어떤 원리와 방식으로 개발하였는지에 대한 내용을 기술하고 있습니다.   

### 1. 캐릭터 그리기 : <https://jistol.github.io/frontend/2019/09/25/create-webgame-1/>  ###    
### 2. 캐릭터 움직이기 : <https://jistol.github.io/frontend/2019/09/28/create-webgame-2/>   ###

게임명은 "도마뱀플라이트"로 앱게임 "드래곤플라이트"를 모방하여 일부 기능을 따라 구현하였으며 실제 게임은 아래 링크에서 실행 해 볼 수 있습니다.    

### GAME : <https://jistol.github.io/lizard/>    SOURCE : <https://github.com/jistol/lizard-flight> ###     

![game capture](/assets/img/frontend/create-webgame/1.jpg) 

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
`arc`함수를 사용하여 몸통,양쪽눈을 그렸습니다. `arc`함수에 대한 자세한 사용법은 [MDN - CanvasRenderingContext2D.arc()](https://developer.mozilla.org/ko/docs/Web/API/CanvasRenderingContext2D/arc)를 참고하세요.     

canvas 스케일 적용
----
위 예제에서 간단히 캐릭터를 그려보았습니다. 하지만 요즘 웹은 모바일 환경에서 많이 노출되며 각 폰마다 크기가 다르기 때문에 우리가 그린 캐릭터는 폰마다 다른 크기로 나올 수 있습니다.
이를 방지하기 위해 크기와 비율을 고정해 보도록 하겠습니다.    
우선 모바일 디바이스 크기에 스케일을 맞추기 위해 HTML head에 아래와 같이 viewport를 추가합니다.

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
  </head>
  <body>
    <canvas id="mainCanvas"></canvas> 
    <script type="text/javascript">
      ...
    </script>
  </body>
</html>
```    

viweport에 대한 자세한 설명은 [모바일 화면을 위해 Viewport 사용하기](https://jongmin92.github.io/2017/02/09/HTML/viewport/) 글을 참고하세요.     
첫번째 예제에서는 canvas에 대한 width/height 값을 직접 입력했지만 화면 크기에 맞게 비율을 확대하려고 합니다.         

```javascript
// 전체 화면을 사용하기 위해 body의 속성을 정의해줍니다.
let body = document.body;
body.style.width = '100%';
body.style.height = '100%';
body.style.margin = '0';
body.style.padding = '0';

// canvas의 크기는 width=100%, height는 width의 1.5 비율로 사용할 예정입니다.
let canvas = document.getElementById('mainCanvas');
canvas.width = body.clientWidth;
canvas.height = Math.min(body.clientWidth * 1.5, body.clientHeight);
canvas.style.backgroundColor = '#000000';

// 실제 화면을 그릴 비율입니다.
// context를 이용하여 그림을 그릴 때 화면 넓이가 400, 높이는 넓이*1.5배라는 계산하에 작업할 예정입니다.
const rWidth = 400;
const rHeight = 400 * 1.5; // 600

// 실제 canvas 넓이와 그림 비율이 맞지 않기 때문에 scale을 변경해줍니다.
let context = canvas.getContext('2d');
let ratioX = canvas.width / rWidth;
let ratioY = canvas.height / rHeight;
context.scale(ratioX, ratioY);
```

위와 같이 화면 스케일을 자동으로 조절하게 만들어 두면 게임 화면을 그리기가 훨씬 수월해집니다.    
디바이스 크기에 상관없이 화면 넓이가 400이란 전제하에 계산하여 캐릭터 크기를 조절 할 수 있게 됩니다.    

