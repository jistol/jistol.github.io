---
layout: post
title: "(ES6) Canvas + Javascript로 웹 게임 만들기 - 캐릭터 움직이기"
category : Frontend 
tags : [html5,es6,javascript,game,web]
metaimg : /assets/img/frontend/create-webgame/1.jpg
description : "비게임 업종 서버개발자가 HTML5의 <canvas>와 Javascript(ES6)를 이용하여 취미로 개발해 본 웹게임에 대한 글입니다."
---
비게임 업종 서버개발자가 HTML5의 `<canvas>`와 Javascript(ES6)를 이용하여 취미로 개발해 본 웹게임에 대한 글로 개발 코드 자체에 대한 설명보다는 어떤 원리와 방식으로 개발하였는지에 대한 내용을 기술하고 있습니다.   

|순서|제목|링크|
|:---:|:---:|:---|
|1|캐릭터 그리기|<https://jistol.github.io/frontend/2019/09/25/create-webgame-1/> |
|2|캐릭터 움직이기|<https://jistol.github.io/frontend/2019/09/28/create-webgame-2/>|
|3|이벤트 만들기|<https://jistol.github.io/frontend/2019/09/29/create-webgame-3/>|

게임명은 "도마뱀플라이트"로 앱게임 "드래곤플라이트"를 모방하여 일부 기능을 따라 구현하였으며 실제 게임은 아래 링크에서 실행 해 볼 수 있습니다.    

### GAME : <https://jistol.github.io/lizard/> ### 
### SOURCE : <https://github.com/jistol/lizard-flight> ###    

![game capture](/assets/img/frontend/create-webgame/1.jpg) 

setTimeout을 이용하여 캐릭터 움직이기 
----
캐릭터를 움직이는 원리는 애니메이션의 원리와 같습니다. canvas에 캐릭터를 빠르게 다시 그려서 마치 위치가 바뀐것처럼 보이게 하는겁니다.      
본 코드에서는 전체화면을 지우고 다시 그리는데 화면이 끊기거나 속도가 느려지지 않을까 하는 우려와는 달리 빠르게 처리되고 크게 이질감도 없었습니다.     

화면을 다시 그리도록 반복하는 방법은 두가지가 있는데 그 중 가장 쉬운 방법은 `setTimeout`(또는 `setInterval`)을 이용하는 방법입니다.    

<script async src="//jsfiddle.net/jistol/e74axmon/12/embed/js,html,result/dark/"></script>     

위와 같이 코딩시에는 단점이 있습니다. `setTimeout`의 경우 해당 시간에 특정 함수를 동작시킬뿐 화면 프레임을 전혀 고려하지 않습니다.    
브라우저가 화면을 그리기까지 몇 가지 단계가 있는데 그 단계를 모두 기다리지 못하거나 더 많은 텀을 가질 확률이 큽니다.     
더 자세한 설명은 [requestAnimationFrame() 개념 정리하기](https://fullest-sway.me/blog/2019/01/28/requestAnimationFrame/)를 참고하세요.    


requestAnimationFrame을 이용하여 캐릭터 움직이기
----
`requestAnimationFrame` 함수는 브라우저가 다음 리페인트를 수행하기 전에 해당 함수를 실행시켜 변경된 데이터로 그리도록 실행해주는 함수입니다.    
자세한 설명은 [MDN - window.requestAnimationFrame()](https://developer.mozilla.org/ko/docs/Web/API/Window/requestAnimationFrame) 참고하시길 바라며 위 `setTimeout`을 이용한 코드에서 반복 부분만 `requestAnimationFrame`로 바꾼 코드입니다.     

<script async src="//jsfiddle.net/jistol/e74axmon/17/embed/js,html,result/dark/"></script>    


Web Worker를 이용하여 별도 스레드에서 그려보자
----
JavaScript는 기본적으로 단일 스레드 기반으로 동작합니다. 동시에 작업이 이뤄지는듯 보이지만 빠르게 하나씩 처리하거나 시분할하여 자원을 나눠쓰게 됩니다.    
화면을 계속 갱신해야하는데 중간에 메인 스레드에 오래걸리는 작업을 실행하게 된다면 화면이 끊기거나 딜레이 될 수 있는데, 이 때 해결 할 수 있는 방법이 `Web Worker`를 이용하는 것입니다.    

`Web Worker`는 메인 스레드가 아닌 별도 스레드를 이용하여 동작하기 때문에 메인 스레드의 부하에 영향없이 동작 할 수 있는 장점이 있으나, DOM 개체에 직접 접근 제어 할 수 없으며 메인 스레드와 message 이벤트를 통해서만 통신이 가능한 단점이 존재합니다. 추가로 `new Worker()`사용시 기본적으로 `Dedicated Worker`를 사용하게 되는데 이 때 모듈방식을 사용 할 수 없으며 `import`, `export` 방식 대신 `importScripts()` 함수를 이용하여 추가 가능합니다.      
자세한 설명은 [MDN - 웹 워커 사용하기](https://developer.mozilla.org/ko/docs/Web/API/Web_Workers_API/basic_usage)을 참고하세요.    

Worker는 직접 DOM 제어를 할 수 없기 때문에 canvas에 렌더링 하기 위해서는 메인 스레드로 부터 canvas를 전달 받아야 합니다. `postMessage`로 전달 가능한데 이 때 전달 가능한 객체는 `Transferable`인터페이스를 구현한 객체만 가능하며 나머지 객체는 오류를 발생 시킵니다. 관련한 사항은 [MDN - Worker.postMessage()
](https://developer.mozilla.org/ko/docs/Web/API/Worker/postMessage)와 [MDN - Transferable](https://developer.mozilla.org/ko/docs/Web/API/Transferable)를 참고하세요.       
다행히도 canvas는 위 인터페이스를 구현한 객체를 제공하는데 `OffscreenCanvas`객체로 `HTMLCanvasElement.transferControlToOffscreen()`함수를 통해 얻을 수 있습니다.    
아직 모든 브라우저에서 제공하고 있진 않습니다.    

<script async src="//jsfiddle.net/jistol/e74axmon/30/embed/js,html,result/dark/"></script>
 
