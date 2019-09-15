class BasicBullet {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.seq = 0;
        this.s = 5;
        this.r = 4;
        this.c = 70;
        this.damage = 50;
        this.animateTime = 10;
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
            status : 'fire',
            seq : this.seq++,
            x : initX,
            y : y,
            r : this.r,
            damage : this.damage,
            animateTime : 7,
            outOfView : false
        });
        this.outOfView = false;
    };

    calPosition = () => {
        let tmpList = this.bulletList.map(bullet => {
                if (bullet.status == 'fire' && !bullet.outOfView) {
                    bullet.y -= this.s;
                    bullet.outOfView = bullet.y - bullet.r <= 0;
                }
                return bullet;
            })
            .filter(bullet => bullet.status != 'destroy')
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
            switch (bullet.status) {
                case 'fire' :
                    this.renderFire(bullet); break;
                case 'collision' :
                    this.renderCollision(bullet); break;
            }
        });
    };

    renderFire = ({ x, y, r }) => {
        this.context.beginPath();
        this.context.arc(x, y, r, 0, Math.PI*2, false);
        this.context.fillStyle = '#dffca4';
        this.context.fill();
        this.context.strokeStyle = "#fafe09";
        this.context.lineWidth = 3;
        this.context.stroke();
        this.context.closePath();
    };

    renderCollision = (bullet) => {
        let { x, y, r } = bullet;
        renderBoom(this.context, '#fc7f84', x, y, r * 1.2);
        renderBoom(this.context, '#c89e65', x, y, r * 0.8);
        renderBoom(this.context, '#c8c476', x, y, r * 0.4);
        if (bullet.animateTime-- <= 0) {
            bullet.status = 'destroy';
        }
    };
}