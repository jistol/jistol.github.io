---
layout: post
title: "(ES6) Canvas + Javascript로 웹 게임 만들기 - 이벤트 만들기"
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

키 이벤트 만들기
----
캐릭터를 그렸으니 조정하는 방법을 추가 하도록 합니다. 전 포스팅에서도 언급했듯이 Worker내에서는 직접 DOM을 접근 할 수가 없습니다. 따라서 메인 페이지에서 키 이벤트를 받아 Worker에게 전달해야하는데, 이 때도 역시 `postMessage`를 사용하게 됩니다.    

```javascript
// main page
const worker = new Worker('worker.js');
const onKeyEvent = (e) => {
    worker.postMessage({ key : event.key });
};
document.addEventListener('keydown', onKeyEvent, false);

// worker.js
self.onmessage = function(e) {
  console.log(e.data.key);
}
```  

이전 코드와 달라진 부분은 keydown 이벤트시 움직이는 방향으로 원을 이동시키고 keyup 이벤트시 움직임을 멈추도록 direct라는 변수를 추가하였으며 화면밖으로 원이 나가지 않도록 x의 크기를 제어하는 부분입니다.     

<script async src="//jsfiddle.net/jistol/e74axmon/48/embed/js,html,result/dark/"></script>     

터치 이벤트 만들기
----
요즘 대부분의 접속 환경이 모바일인 만큼 터치 이벤트를 이용한 움직임도 처리해보도록 하겠습니다. 키의 경우 명확하게 어떤 키를 누르고 땠는지 확인이 가능하나 터치는 같은 이벤트로 다른 처리를 해야하기에 키 이벤트와는 다르게 코딩 되어야 합니다.    
터치 이벤트는 대표적으로 아래와 같이 존재합니다.    

|이벤트명|설명|
|:---:|:---|
|touchstart|디바이스 화면에 손가락이 닿는 순간 발생하는 이벤트입니다.|
|touchmove|디바이스 화면에 손가락이 닿은 상태에서 손가락을 움직이면 발생하는 이벤트 입니다|
|touchend|디바이스 화면에 손가락이 닿은 상태에서 손가락을 떼어내면 발생하는 이벤트입니다.|
|touchcancel|터치 이벤트가 시스템으로 인해 취소 될 때 발생하는 이벤트입니다.|     

좀 더 자세한 설명은 [Javascript Mobile Events의 이해](https://wit.nts-corp.com/2013/12/20/583)를 참고하시기 바랍니다.    
다시 구현으로 돌아가서, 캐릭터를 이동 시키기 위해서는 두가지 선택지가 있습니다. 첫번째로는 터치된 포인트 지점으로 캐릭터를 바로 이동시키는 방법과 두번째는 터치 후 움직이는 방향으로 이동시키는 방법입니다. 본 코드에서는 두번째 방법을 이용해 구현했습니다.    

<script async src="//jsfiddle.net/jistol/e74axmon/54/embed/js,html,result/dark/"></script>    




