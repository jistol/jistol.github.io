'use strict';
const worker = new Worker('./worker.js');

const onloadEvent = () => {
    let canvasDoc = document.getElementById('mainCanvase');
    document.addEventListener('keydown', onkeyEvent('keydown'), false);
    document.addEventListener('keyup', onkeyEvent('keyup'), false);

    const offscreen = canvasDoc.transferControlToOffscreen();
    worker.postMessage({ type : 'init', canvas : offscreen }, [offscreen]);
};

const onkeyEvent = eventName => event => {
    if(event.key == "Right" || event.key == "ArrowRight") {
        worker.postMessage({ type : 'keyDirect', eventName : eventName, key : 'right' });
    } else if(event.key == "Left" || event.key == "ArrowLeft") {
        worker.postMessage({ type : 'keyDirect', eventName : eventName, key : 'left' });
    } else if(event.key == ' ' || event.key == 'Spacebar') {
        worker.postMessage({ type : 'keyInput', eventName : eventName, key : 'space' });
    } else if(event.key == 'Enter') {
        worker.postMessage({ type : 'keyInput', eventName : eventName, key : 'enter' });
    }
};

const onunloadEvent = () => {
    worker.terminate();
};






