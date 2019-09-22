class BasicBullet {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.seq = 0;
        this.s = 6.5;
        this.r = 5;
        this.fireTerm = 13;
        this.fireUnit = 1;
        this.damage = 50;
        this.collisionTime = 7;
        this.outOfView = false;
        this.bulletList = [];
        this.iconTxt = 'B';
        this.fireColor = '#dffca4';
        this.fireStrokeColor = '#fafe09';
        this.nolimit = true;
        this.limit = 0;
    };

    isEmpty = () => !this.nolimit && this.limit < 1;

    postConstructBullet = (bullet, i) => ({});

    registOne = (initX, initY) => {
        if (this.isEmpty()) {
            return;
        }

        let y = initY - this.r - 0.5;
        for (let i=0 ; i < this.fireUnit ; i++) {
            let bullet = new Bullet({
                status : BulletStatus.fire,
                seq : this.seq++,
                x : initX,
                y : y,
                r : this.r,
                damage : this.damage,
                collisionTime : this.collisionTime,
                outOfView : false,
                fireColor : this.fireColor,
                fireStrokeColor : this.fireStrokeColor,
                fireSeq : i
            });
            this.postConstructBullet(bullet, i);
            this.bulletList.push(bullet);
        }
        this.outOfView = false;
        this.limit -= this.nolimit ? 0 : 1;
    };

    calPosition = () => {
        this.bulletList = this.bulletList.map(bullet => {
                if (bullet.status == BulletStatus.fire && !bullet.outOfView) {
                   this.calPositionBullet(bullet);
                }
                return bullet;
            })
            .filter(bullet => bullet.status != BulletStatus.destroy)
            .filter(bullet => !bullet.outOfView);

        if (this.bulletList.length < 1) {
            this.outOfView = true;
        }
    };

    calPositionBullet = (bullet) => {
        bullet.y -= this.s;
        bullet.outOfView = bullet.y - bullet.r <= 0;
    };

    render = () => {
        if (this.outOfView) {
            return;
        }

        this.bulletList.forEach(bullet => {
            switch (bullet.status) {
                case BulletStatus.fire :
                    this.renderFire(bullet); break;
                case BulletStatus.collision :
                    this.renderCollision(bullet); break;
            }
        });
    };

    renderBulletInfo = () => {
        this.context.beginPath();
        this.context.font = "15px Sans MS";
        this.context.fillStyle = '#FFFFFF';
        this.context.textAlign = "left";
        this.context.fillText(`${this.iconTxt} : ${this.nolimit ? '-' : this.limit}`, rWidth - 55, 20);
        this.context.closePath();
    };

    renderFire = ({ x, y, r, fireColor, fireStrokeColor }) => {
        this.context.beginPath();
        this.context.arc(x, y, r, 0, Math.PI*2, false);
        this.context.fillStyle = fireColor;
        this.context.fill();
        this.context.strokeStyle = fireStrokeColor;
        this.context.lineWidth = 3;
        this.context.stroke();
        this.context.closePath();
    };

    renderCollision = (bullet) => {
        let { x, y, r } = bullet;
        renderBoom(this.context, '#fc7f84', x, y, r * 1.2);
        renderBoom(this.context, '#c89e65', x, y, r * 0.8);
        renderBoom(this.context, '#c8c476', x, y, r * 0.4);
        if (bullet.collisionTime-- <= 0) {
            bullet.status = BulletStatus.destroy;
        }
    };

    setupCollision = (seqList) => {
        this.bulletList = this.bulletList.map(b => {
            if (seqList.some(seq => seq == b.seq)) {
                b.status = BulletStatus.collision;
            }
            return b;
        });
    };
}