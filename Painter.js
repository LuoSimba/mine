
/**
 * 绘图类
 */
class Painter {

    ctx = null;

    constructor (device) {

        this.ctx = device.getContext('2d');

        // device 改变大小, font 就会重置

        return;

        // 相当于取得画布的画笔，画笔只有一支


        // miter 尖角
        // bevel 斜角
        // round 圆角
        this.ctx.lineJoin  = 'miter';   // 拐角样式
        // butt   平的（不出头）
        // round  圆的
        // square 方的
        this.ctx.lineCap   = 'butt';   // 线帽样式

        // text
        this.ctx.textBaseline = 'top';   // middle

    }

    /**
     * brush = '#000000';
     */
    setBrush (brush) {
        this.ctx.fillStyle = brush;
    }

    /**
     * w = 1;
     * pen = 'rgba(255, 0, 0, .5)';
     */
    setPen (w, pen) {
        this.ctx.lineWidth = w;  // 线条粗细(不能为0)
        this.ctx.strokeStyle = pen;
    }

    /**
     * 矩形
     */
    rect (x, y, w, h) {
        this.ctx.rect(x, y, w, h);
    }

    /**
     * 圆
     */
    circle (x, y, radius) {
        // (x, y, radius, startAngle, endAngle)
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    }

    /**
     * 擦除图像
     */
    clearRect (x, y, w, h) {
        this.ctx.clearRect(x, y, w, h);
        //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    /**
     * 在画布上贴图
     *
     * img 可以是另一个<canvas>
     */
    drawImage (x, y, img) {
        this.ctx.drawImage(img, x, y);
    }


    /**
     * align is ('start', 'center', 'end', 'left', 'right')
     */
    setTextAlign (align) {
        this.ctx.textAlign = align;
    }

    drawText (x, y, str) {
        this.ctx.fillText(str, x, y);// see context.strokeText()
    }

    translate (x, y) {
        this.ctx.translate(x, y);
    }

    save () {
        this.ctx.save();
    }

    restore () {
        this.ctx.restore();
    }

    stroke () {
        this.ctx.stroke();
    }

    fill () {
        this.ctx.fill();
    }

    fillRect (x, y, w, h) {
        //context.strokeRect()
        this.ctx.fillRect(x, y, w, h);
    }

    // closePath
    beginPath () {
        this.ctx.beginPath();
    }

    /**
     * bold 参数设置了缺省值
     */
    setFont (fontName, fontSize, bold = false) {

        let boldexpr = (bold === true) ? 'bold ' : '';

        /* bold 10px impack */
        // Template String
        this.ctx.font = `${boldexpr} ${fontSize}px ${fontName}`;
    }
}

