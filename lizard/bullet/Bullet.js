const BulletStatus = {
    fire : Symbol('fire'),
    collision : Symbol('collision'),
    destroy : Symbol('destroy')
};

class Bullet {
    constructor({ status = BulletStatus.fire, seq, x, y, r, damage, collisionTime = 7, outOfView = false, fireColor, fireStrokeColor, fireSeq }) {
        this.seq = seq;
        this.status = status;
        this.x = x;
        this.y = y;
        this.r = r;
        this.damage = damage;
        this.collisionTime = collisionTime;
        this.outOfView = outOfView;
        this.fireColor= fireColor;
        this.fireStrokeColor = fireStrokeColor;
        this.init = { x, y, r };
        this.fireSeq = fireSeq;
    }
}