class StrongBullet extends BasicBullet {
    constructor(canvas) {
        super(canvas);
        this.seq = 0;
        this.s = 6.5;
        this.r = 9;
        this.fireTerm = 18;
        this.damage = 130;
        this.collisionTime = 7;
        this.outOfView = false;
        this.bulletList = [];
        this.iconTxt = 'S';
        this.fireColor = '#fc8351';
        this.fireStrokeColor = '#fe5f0d';
        this.nolimit = false;
        this.limit = 70;
    };
}