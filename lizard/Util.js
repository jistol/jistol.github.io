const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
};

const isCollisionWithBullet = (arc, bullet) => {
    let top = bullet.y - bullet.r - arc.r;
    if (arc.y < top) {
        return false;
    }

    let left = bullet.x - bullet.r - arc.r;
    let right = bullet.x + bullet.r + arc.r;
    return arc.x >= left && arc.x <= right;
};

const isCollisionArc = (arc1, arc2) => {
    let x = Math.pow(Math.abs(arc1.x - arc2.x), 2);
    let y = Math.pow(Math.abs(arc1.y - arc2.y), 2);
    return Math.sqrt(x + y) <= arc1.r + arc2.r;
};

const renderTxtView = (canvas, txtData) => {
    let context = getContext(canvas);
    let data = Object.assign({
        bg : {
            rgb : '0,0,0',
            alpha : 1
        },
        font : {
            rgb : '0,0,0',
            alpha : 1
        },
        message : '',
        usePressKey : false,
        pressMessage : 'press enter key to restart'
    }, txtData);

    let x = rWidth/2, y = rHeight/2;
    context.beginPath();
    context.fillStyle = data.bgStyle || `rgba(${data.bg.rgb},${data.bg.alpha})`;
    context.fillRect(0, 0, rWidth, rHeight);
    context.fillStyle = data.fontStyle || `rgba(${data.font.rgb},${data.font.alpha})`;
    context.textAlign = "center";
    context.font = "38px Sans MS";
    context.fillText(data.message, x, y - (data.usePressKey ? 22 : 0));
    if (data.usePressKey) {
        context.font = "20px Sans MS";
        context.fillText(data.pressMessage, x, y + 40);
    }
    context.closePath();
};

const renderBoom = (context, fillStyle, x, y, r) => {
    let h = r / 2;
    context.beginPath();
    context.moveTo(x - r, y);
    context.arcTo(x, y, x - h, y + h, r);
    context.arcTo(x, y, x, y + r, r);
    context.arcTo(x, y, x + h, y + h, r);
    context.arcTo(x, y, x + r, y, r);

    context.arcTo(x, y, x + h, y - h, r);
    context.arcTo(x, y, x, y - r, r);
    context.arcTo(x, y, x - h, y - h, r);
    context.arcTo(x, y, x - r, y, r);
    context.fillStyle = fillStyle;
    context.fill();
    context.closePath();
};

const rWidth = 400;
const rHeight = 400 * 1.5;

const contextScale = (canvas) => {
    let context = canvas.getContext('2d');
    let ratioX = canvas.width / rWidth;
    let ratioY = canvas.height / rHeight;
    context.scale(ratioX, ratioY);
};

const getContext = (canvas) => canvas.getContext('2d');

const clear = (context) => {
    context.clearRect(0, 0, rWidth, rHeight);
};
