class NoWaitPlay {
    constructor(canvas, enemy) {
        this.canvas = canvas;
        this.enemy = enemy;
        this.waitY = enemy.r + 25;
        this.initWait = (enemy.wait || 200);
        this.wait = this.initWait;
    }

    calPosition = (lizard) => {
        this.enemy.outOfView = rHeight <= this.enemy.y - this.enemy.r;
        this.enemy.y += this.enemy.s;
    };
}

