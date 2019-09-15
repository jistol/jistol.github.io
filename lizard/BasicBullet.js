class BasicBullet {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.seq = 0;
        this.s = 5;
        this.r = 8;
        this.c = 70;
        this.damage = 50;
        this.outOfView = false;
        this.bulletList = [];
    };

    registOne = (initX, initY) => {
        let { r, c } = this;
        let y = initY - r - 0.5;
        let lastBullet = this.bulletList[this.bulletList.length - 1];
        if (lastBullet && lastBullet.y >= y - r - c) {
            return;
        }

        this.bulletList.push({
            seq : this.seq++,
            x : initX,
            y : y,
            r : this.r,
            damage : this.damage,
            outOfView : false
        });
        this.outOfView = false;
    };

    calPosition = () => {
        let tmpList = this.bulletList.map(bullet => {
                if (!bullet.outOfView) {
                    bullet.y -= this.s;
                    bullet.outOfView = bullet.y - bullet.r <= 0;
                }
                return bullet;
            })
            .filter(bullet => !bullet.outOfView);

        if (tmpList.length < 1) {
            this.outOfView = true;
        }

        this.bulletList = tmpList;
    };

    render = () => {
        if (this.outOfView) {
            return;
        }

        this.bulletList.forEach(bullet => {
            this.context.beginPath();
            this.context.arc(bullet.x, bullet.y, bullet.r, 0, Math.PI*2, false);
            this.context.fillStyle = '#dffca4';
            this.context.fill();
            this.context.strokeStyle = "#fafe09";
            this.context.lineWidth = 3;
            this.context.stroke();
            this.context.closePath();
        });
    };
}