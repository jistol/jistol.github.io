importScripts('./Viewer.js');

const viewer = new Viewer();
const render = time => {
    switch (viewer.status) {
        case 'playing' :
            viewer.render(); break;
        case 'opening' :
            viewer.opening(); break;
        case 'ending' :
            viewer.ending(); break;
    }
    requestAnimationFrame(render);
};
const __events = {
    init : event => {
        viewer.initialize(event.data.canvas);
        requestAnimationFrame(render);
    },
    keyDirect : event => {
        let { eventName, key } = event.data;
        viewer.onKeyDirectEvent(eventName, key);
    },
    keyInput : event => {
        let { eventName, key } = event.data;
        if (key == 'enter' && viewer.status != 'playing') {
            viewer.playing();
        } else {
            (viewer.onKeyInputEvent || function(){})(eventName, key);
        }
    }
};

self.onmessage = event => {
    let type = event.data.type;

    if (!type || !__events[type]) {
        return;
    }

    __events[event.data.type](event);
};

