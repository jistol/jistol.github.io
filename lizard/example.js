class Example {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    drawRect = () => {
        this.context.beginPath();
        // 사각형 그리기
        this.context.rect(20,40,50,50);
        // 색 칠하기
        this.context.fillStyle = '#FFAAFF';
        this.context.fill();
        // 외각선 칠하기
        this.context.strokeStyle = "rgba(0, 0, 255, 0.5)";
        this.context.stroke();
        this.context.closePath();
    };

    drawArc = () => {
        this.context.beginPath();
        // 원그리기
        this.context.arc(240, 160, 20, 0, Math.PI*2, false);
        this.context.fillStyle = '#5FAA23';
        this.context.fill();
        this.context.closePath();
    };
}