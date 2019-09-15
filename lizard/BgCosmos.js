importScripts('./Util.js');

class BgCosmos {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.starList = [];
    };

    addStar = () => {
        this.starList[this.starList.length] = {
            x : randomInt(5, this.canvas.width - 5), y : 0, r : randomInt(1, 7) / 2, s : randomInt(1, 8) / 2
        };
    };

    calStar = () => {
        if (this.starList.length < 50 && randomInt(0, 100) > 75) {
            this.addStar();
        }

        this.starList = this.starList.map(star => {
                star.y += star.s;
                return star;
            })
            .filter(star => star.y - star.r < this.canvas.height);
    };

    drawStar = (x, y, r) => {
        this.context.moveTo(x - r, y);
        this.context.arcTo(x, y, x, y + r, r);
        this.context.arcTo(x, y, x + r, y, r);
        this.context.arcTo(x, y, x, y - r, r);
        this.context.arcTo(x, y, x - r, y, r);
    };

    render = () => {
        this.calStar();
        if (this.starList.length <= 0) {
            return;
        }

        this.context.beginPath();
        this.starList.forEach(star => {
            this.drawStar(star.x, star.y, star.r);
        });
        this.context.strokeStyle = '#f7f7f7';
        this.context.fillStyle = '#fefa09';
        this.context.stroke();
        this.context.fill();
        this.context.closePath();
    }
}