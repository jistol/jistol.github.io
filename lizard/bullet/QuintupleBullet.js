class QuintupleBullet extends BasicBullet {
    constructor(canvas) {
        super(canvas);
        this.seq = 0;
        this.s = 7.5;
        this.r = 5;
        this.damage = 45;
        this.fireTerm = 17;
        this.fireUnit = 5;
        this.collisionTime = 5;
        this.outOfView = false;
        this.bulletList = [];
        this.iconTxt = 'Q';
        this.fireColor = '#fedda9';
        this.fireStrokeColor = '#c8c476';
        this.nolimit = false;
        this.limit = 100;
    };

    calPositionBullet = (bullet) => {
        bullet.y -= this.s;
        bullet.x += (bullet.fireSeq - 3) * 1.5;
        console.log(bullet.x);
        bullet.outOfView = bullet.y - bullet.r <= 0;
    };
}