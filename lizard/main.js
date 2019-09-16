'use strict';
const worker = new Worker('./worker.js');
var touchHistory = {};

const onloadEvent = () => {
    let body = document.body;
    let canvas = document.getElementById('mainCanvas');
    canvas.width = body.clientWidth;
    canvas.height = Math.min(body.clientWidth * 1.5, body.clientHeight);
    canvas.style.backgroundColor = '#000000';

    document.addEventListener('keydown', onKeyEvent('keydown'), false);
    document.addEventListener('keyup', onKeyEvent('keyup'), false);

    document.addEventListener("touchstart", onTouchEvent('touchstart'), { capture : false, passive : false });
    document.addEventListener("touchend", onTouchEvent('touchend'), false);
    document.addEventListener("touchcancel", onTouchEvent('touchcancel'), false);
    document.addEventListener("touchmove", onTouchEvent('touchmove'), false);

    const offscreen = canvas.transferControlToOffscreen();
    worker.postMessage({ type : 'init', canvas : offscreen }, [offscreen]);
};

const onTouchEvent = eventName => event => {
    let { before, x } = touchHistory;
    let { pageX } = event.changedTouches[0];
    if (eventName == 'touchmove' && before != 'touchend' && before != 'touchcancel' ) {
        worker.postMessage({ type : 'touchEvent', eventName : eventName, x : pageX - x });
    }

    if (eventName == 'touchstart') {
        event.preventDefault();
        worker.postMessage({ type : 'touchEvent', eventName : eventName });
    }

    if (eventName == 'touchend' || eventName == 'touchcancel') {
        worker.postMessage({ type : 'touchEvent', eventName : 'touchend'});
    }

    touchHistory = { before : eventName, x : pageX };
};

const onKeyEvent = eventName => event => {
    if(event.key == "Right" || event.key == "ArrowRight") {
        worker.postMessage({ type : 'keyDirect', eventName : eventName, key : 'right' });
    } else if(event.key == "Left" || event.key == "ArrowLeft") {
        worker.postMessage({ type : 'keyDirect', eventName : eventName, key : 'left' });
    } else if(event.key == 'W' || event.key == 'w') {
        worker.postMessage({ type : 'keyInput', eventName : eventName, key : 'w' });
    } else if(event.key == 'Enter') {
        worker.postMessage({ type : 'keyInput', eventName : eventName, key : 'enter' });
    }
};

const onunloadEvent = () => {
    worker.terminate();
};


(function(){
    let body = document.body;
    body.addEventListener('unload', onunloadEvent);
    body.style.width = '100%';
    body.style.height = '100%';
    body.style.margin = '0';
    body.style.padding = '0';

    onloadEvent();
})();






