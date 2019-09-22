class FollowPlay {
    constructor(canvas, enemy) {
        this.canvas = canvas;
        this.enemy = enemy;
        this.waitY = enemy.r + 25;
        this.initWait = (enemy.wait || 200);
        this.wait = this.initWait;
        this.followX = 1.7;
        this.startY = rHeight / 5;
        this.endY = rHeight - (rHeight/5);
    }

    calPosition = (lizard) => {
        this.enemy.outOfView = rHeight <= this.enemy.y - this.enemy.r;
        if (this.wait > 0) {
            let pi = Math.PI / this.initWait * 2;
            this.enemy.y += 2.5;
            if (this.enemy.y > this.waitY) {
                this.enemy.y = this.waitY;
                this.wait--;
                this.enemy.x += Math.sin((Math.PI / 2.5) + pi * this.wait) / 6;
            }
        } else {
            let { startY, endY } = this;
            this.enemy.y += this.enemy.s;
            if (startY <= this.enemy.y || endY >= this.enemy.y) {
                this.following(lizard);
            }
        }
    };

    following = (lizard) => {
        this.enemy.x += this.followX * (lizard.x > this.enemy.x ? 1 : -1)
    };
}

