class BasicPlay {
    constructor(canvas, enemy) {
        this.canvas = canvas;
        this.enemy = enemy;
        this.waitY = enemy.r + 25;
        this.initWait = (enemy.wait || 180);
        this.wait = this.initWait;
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
            this.enemy.y += this.enemy.s;
        }
    };
}

