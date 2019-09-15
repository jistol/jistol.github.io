const __initSleepTime = 100;

class PlayManager {
    constructor(canvas, story) {
        this.sleep = __initSleepTime;
        this.canvas = canvas;
        this.status = 'opening';
        this.story = story;
        this.enemyList = (this.story.enemyList || []).map(data => {
            let clazz = eval(data.clazz);
            return new EnemyRow(canvas, clazz, data.option);
        });
        this.currentEnemy = this.enemyList.shift();
    }

    opening = () => {
        renderTxtView(this.canvas, this.story.opening);
        this.sleep--;
        if (this.sleep < 1) {
            this.status = 'playing';
            this.sleep = __initSleepTime;
        }
    };

    playing = () => {
        if (!this.currentEnemy || this.currentEnemy.outOfView) {
            this.currentEnemy = this.enemyList.shift();
            if (!this.currentEnemy) {
                this.status = 'ending';
                return;
            }
        }

        this.currentEnemy.render();
    };

    ending = () => {
        renderTxtView(this.canvas, this.story.ending);
        this.sleep--;
        if (this.sleep < 1) {
            this.status = 'exit';
            this.sleep = __initSleepTime;
        }
    };

    render = () => {
        (this[this.status]||function(){})();
    };

    calPosition = () => {
        if (this.status == 'playing' && this.currentEnemy && !this.currentEnemy.outOfView) {
            this.currentEnemy.calPosition();
        }
    };

    judgeCollision = (bulletList) => {
        if (!this.currentEnemy) {
            return {};
        }

        let { y, r } = this.currentEnemy.option;
        let top = y - r, bottom = y + r;
        let collisionList = bulletList.filter(b => b.status == 'fire')
            .filter(b => b.y - b.r <= bottom || b.y + b.r >= top);
        if (!collisionList || collisionList.length < 1) {
            return {};
        }

        return this.currentEnemy.judgeCollision(collisionList);
    };
}

class EnemyRow {
    constructor(canvas, clazz, option) {
        this.canvas = canvas;
        this.option = Object.assign({
            r : 25,
            y : -25,
            s : 2.5,
            hp : 100,
            bodyStyle : '#989898',
            bodyStrokeStyle : '#767676'
        }, option);
        this.enemyList = [];
        let x = 40;
        for (let i=0 ; i < 5 ; i++) {
            let opt = Object.assign({}, this.option, { x : x + (i * 80) });
            this.enemyList[i] = new clazz(canvas, opt);
        }
        this.outOfView = false;
    }

    calPosition = () => {
        this.option.y += this.option.s;
        this.outOfView = this.canvas.height <= this.option.y - this.option.r;
        this.enemyList.forEach(enemy => enemy.y = this.option.y);
    };

    render = () => {
        this.enemyList.forEach(enemy => enemy.render());
    };

    judgeCollision = (bulletList) => {
        let score = 0;
        let seqList = bulletList.filter(b => {
                let isAttack = false;
                this.enemyList = this.enemyList.map(e => {
                        if (isCollisionWithBullet(e, b)) {
                            e.damaged(b);
                            isAttack = true;
                        }
                        if (!e.isLive) {
                            score += e.score;
                        }
                        return e;
                    })
                    .filter(e => e.isLive);
                return isAttack;
            })
            .map(b => b.seq);

        return { score : score, seqList : seqList };
    };
}

class BasicEnemy {
    constructor(canvas, { x, y, r, hp, score, bodyStyle, bodyStrokeStyle }) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hp = hp;
        this.score = score;
        this.bodyStyle = bodyStyle;
        this.bodyStrokeStyle = bodyStrokeStyle;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.isLive = true;
    }

    damaged = ({ damage }) => {
        this.hp -= damage;
        this.isLive = this.hp > 0;
    };

    drawBody = ({context, x, y, r, bodyStyle, bodyStrokeStyle}) => {
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2, false);
        context.fillStyle = bodyStyle;
        context.fill();

        context.strokeStyle = bodyStrokeStyle;
        context.stroke();
        context.closePath();
    };

    drawEyes = ({ context, x, y }, outerEyesStyle, innerEyesStyle) => {
        context.beginPath();
        context.arc(x-10, y+10, 7, 0, Math.PI*2, false);
        context.arc(x+10, y+10, 7, 0, Math.PI*2, false);
        context.fillStyle = outerEyesStyle;
        context.fill();
        context.closePath();

        context.beginPath();
        context.arc(x-10, y+13, 2, 0, Math.PI*2, false);
        context.arc(x+10, y+13, 2, 0, Math.PI*2, false);
        context.fillStyle = innerEyesStyle;
        context.fill();
        context.closePath();
    };

    render = () => {
        // body
        this.drawBody(this);

        // eyes
        let outerEyesStyle = '#FEFEFE';
        let innerEyesStyle = '#090909';
        this.drawEyes(this, outerEyesStyle, innerEyesStyle);
    }
}