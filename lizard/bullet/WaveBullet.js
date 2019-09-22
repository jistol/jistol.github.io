class WaveBullet extends BasicBullet {
    constructor(canvas) {
        super(canvas);
        this.seq = 0;
        this.s = 7.5;
        this.r = 4;
        this.fireTerm = 17.5;
        this.fireUnit = 2;
        this.damage = 40;
        this.collisionTime = 5;
        this.outOfView = false;
        this.bulletList = [];
        this.iconTxt = 'W';
        this.fireColor = '#9efc9a';
        this.fireStrokeColor = '#2ffebf';
        this.nolimit = false;
        this.limit = 100;
    };

    postConstructBullet = (bullet, fireSeq) => {
        let range = 28 * (fireSeq == 0 ? -1 : 1);
        bullet.moveFun = Animation.wave(this.canvas.height, 3.7, range, bullet.x);
        bullet.y += range/4;
    };

    calPositionBullet = (bullet) => {
        bullet.y -= this.s;
        bullet.x = bullet.moveFun(bullet.y);
        bullet.outOfView = bullet.y - bullet.r <= 0;
    };
}