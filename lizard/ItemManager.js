class ItemManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.itemRule = { step : -1, itemList : [] };
        this.itemList = [];
    };

    changeScore = (bScore, aScore) => {
        let { step, itemList } = this.itemRule;
        if (step == -1 || (itemList||[]).length < 1 || aScore < step) {
            return;
        }

        if (bScore % step > aScore % step) {
            let bulletClazz = itemList[randomInt(0, itemList.length - 1)];
            this.addItem(new bulletClazz(this.canvas));
        }
    };

    addItem = (item) => {
        let x = randomInt(50, rWidth - 50), s = 3;
        let { canvas } = this;
        this.itemList.push(Item.create(item)({x, s})({canvas}));
    };

    render = () => {
        this.itemList = this.itemList.filter(item => !item.outOfView);
        this.itemList.forEach(item => item.render());
    };

    judgeCollision = lizard => {
        this.itemList.forEach(item => {
            if (isCollisionArc(lizard, item)) {
                item.outOfView = true;
                lizard.addBulletItem(item.item);
            }
        });
    };
}

class Item {
    static create = (item) => ({ x, s }) => ({ canvas, animation }) => {
        return new Item({ item, x, s, canvas, animation });
    };

    constructor({ item, x, s = 3, canvas, animation=Animation.wave }) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.item = item;
        this.iconTxt = item.iconTxt || 'B';
        this.fireColor = item.fireColor || '#dffca4';
        this.fireStrokeColor = item.fireStrokeColor || '#fafe09';
        this.r = 15;
        this.s = s;
        this.y = -this.r;

        this.x = Math.min(Math.max(x-50, 50 + this.r), rWidth - 50 - this.r);
        this.moveFun = animation(canvas.height, 3, 50, this.x);
        this.fontSize = this.r * 1.5;
        this.outOfView = false;
    }

    render = () => {
        let moveX = this.moveFun(this.y);
        this.x = moveX;
        this.y += this.s;
        this.renderItem();
        this.outOfView = this.y + this.r >= rHeight;
    };

    renderItem = () => {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        this.context.fillStyle = this.fireColor;
        this.context.fill();
        this.context.strokeStyle = this.fireStrokeColor;
        this.context.lineWidth = 3;
        this.context.stroke();
        this.context.fillStyle = '#000000';
        this.context.textAlign = "center";
        this.context.font = `${this.fontSize}px Sans MS`;
        this.context.fillText(this.iconTxt, this.x, this.y + (this.fontSize - this.r + 1));
        this.context.closePath();
    };
}