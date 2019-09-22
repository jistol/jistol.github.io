class FastBullet extends BasicBullet {
    constructor(canvas) {
        super(canvas);
        this.seq = 0;
        this.s = 9;
        this.r = 5.5;
        this.damage = 35;
        this.collisionTime = 5;
        this.outOfView = false;
        this.bulletList = [];
        this.iconTxt = 'F';
        this.fireColor = '#9802fc';
        this.fireStrokeColor = '#610bfe';
        this.nolimit = false;
        this.limit = 200;

        this.rotateTerm = 3;
    };

    set fireTerm(term) {};

    get fireTerm() {
        this.rotateTerm--;
        if (this.rotateTerm <= 0) {
            this.rotateTerm = 3;
            return 9;
        }
        return 3.2;
    };
}