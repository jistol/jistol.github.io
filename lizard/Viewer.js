importScripts('./storyBoard.js');
importScripts('./Lizard.js');
importScripts('./BgCosmos.js');
importScripts('./PlayManager.js');
importScripts('./BasicBullet.js');

class Viewer {
    initialize = canvas => {
        this.status = 'opening';
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.background = new BgCosmos(this.canvas);
    };

    playing = () => {
        this.score = 0;
        this.story = storyBoard.story.concat();
        this.status = 'playing';
        this.lizard = new Lizard(this.canvas, BasicBullet);
        this.onKeyDirectEvent = this.lizard.onKeyDirectEvent;
        this.onKeyInputEvent = this.lizard.onKeyInputEvent;
        this.playManager = new PlayManager(this.canvas, this.story.shift());
    };

    opening = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.background.render();
        renderTxtView(this.canvas, storyBoard.txt.opening);
    };

    ending = () => {
        renderTxtView(this.canvas, storyBoard.txt.ending);
    };

    render = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.background.render();
        this.playManager.render();
        this.lizard.render();
        this.renderScore();

        this.calPosition();
        this.judgeCollisionWithBullet();
        this.judgeCollisionWithLizard();
        this.judgeToNext();
    };

    renderScore = () => {
        this.context.beginPath();
        this.context.font = "15px Sans MS";
        this.context.fillStyle = '#FFFFFF';
        this.context.textAlign = "left";
        this.context.fillText(`SCORE : ${this.score}`, 15, 20);
        this.context.closePath();
    };

    calPosition = () => {
        this.lizard.calPosition();
        this.playManager.calPosition();
    };

    judgeToNext = () => {
        if (this.playManager.status == 'exit') {
            let story = this.story.shift();
            if (!story) {
                this.status = 'ending';
                return;
            }
            this.playManager = new PlayManager(this.canvas, story);
        }
    };

    judgeCollisionWithLizard = () => {
        if (!this.playManager.currentEnemy) {
            return;
        }

        this.lizard.judgeCollision(this.playManager.currentEnemy);
        if (!this.lizard.isLive) {
            this.status = 'dead';
            renderTxtView(this.canvas, storyBoard.txt.dead);
        }
    };

    judgeCollisionWithBullet = () => {
        let tmpList = this.lizard.bulletItemList.map(bulletItem => {
            let result = this.playManager.judgeCollision(bulletItem.bulletList);
            if (result && result.seqList && result.seqList.length > 0) {
                bulletItem.bulletList = bulletItem.bulletList.map(b => {
                        if (result.seqList.some(seq => seq == b.seq)) {
                            b.status = 'collision';
                        }
                        return b;
                    });
                this.score += result.score;
            }
            return bulletItem;
        });

        this.lizard.bulletItemList = tmpList;
    };
}