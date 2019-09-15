class Lizard {
    constructor(canvas, bulletClazz) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.s = 3;
        this.r = 25;
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - this.r - 5;
        this.isDirectKeyPress = false;
        this.directKey = undefined;
        this.isInputKeyPress = false;
        this.inputKey = undefined;
        this.bulletClazz = bulletClazz;
        this.bulletItemList = [ new bulletClazz(canvas) ];
        this.isLive = true;
    };

    onKeyDirectEvent = (eventName, key) => {
        this.isDirectKeyPress = eventName == 'keydown';
        this.directKey = this.isDirectKeyPress ? key : undefined;
    };

    onKeyInputEvent = (eventName, key) => {
        if (key != 'space') {
            return;
        }
        this.isInputKeyPress = eventName == 'keydown';
        this.inputKey = this.isInputKeyPress ? key : undefined;
    };

    calPosition = () => {
        if (this.isDirectKeyPress && this.directKey) {
            this.x += (this.directKey == 'left' ? -this.s : this.s);
        }

        if (this.bulletItemList.length > 0 && this.isInputKeyPress && this.inputKey == 'space') {
            this.bulletItemList[0].registOne(this.x, this.y - this.r - 0.5);
        }

        this.bulletItemList.forEach(bulletItem => {
            bulletItem.calPosition();
        });
    };

    judgeCollision = (enemyRow) => {
        let { y, r } = enemyRow.option;
        let top = y - r, bottom = y + r;
        if (this.y - this.r <= bottom || this.y + this.r >= top) {
            this.isLive = !enemyRow.enemyList.some(e => isCollisionArc(e, this));
        }
    };

    render = () => {
        this.bulletItemList.forEach(bulletItem => {
            bulletItem.render();
        });
        this.drawBody();
        this.drawEyes();

        if (this.bulletItemList.length > 1) {
            this.bulletItemList = this.bulletItemList.filter(bullet => !bullet.outOfView);
        }
    };

    drawEyes = () => {
        let { x, y } = this;
        this.context.beginPath();
        this.context.arc(x-12, y-10, 7, 0, Math.PI*2, false);
        this.context.arc(x+12, y-10, 7, 0, Math.PI*2, false);
        this.context.fillStyle = '#b4ddfc';
        this.context.fill();
        this.context.closePath();

        this.context.beginPath();
        this.context.arc(x-10, y-13, 2, 0, Math.PI*2, false);
        this.context.arc(x+10, y-13, 2, 0, Math.PI*2, false);
        this.context.fillStyle = '#200e09';
        this.context.fill();
        this.context.closePath();
    };

    drawBody = () => {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        this.context.fillStyle = '#5FAA23';
        this.context.fill();
        this.context.strokeStyle = "rgba(0, 0, 255, 0.5)";
        this.context.stroke();
        this.context.closePath();
    };
}