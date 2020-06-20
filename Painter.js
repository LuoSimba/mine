
/**
 * 绘图类
 */
const Painter = function (device) {

    this.ctx = device.getContext('2d');

    // device 改变大小, font 就会重置

    return;

    // 相当于取得画布的画笔，画笔只有一支

    this.ctx.fillStyle = '#000000';

    // line
    this.ctx.lineWidth = 1;  // 线条粗细(不能为0)
    // miter 尖角
    // bevel 斜角
    // round 圆角
    this.ctx.lineJoin  = 'miter';   // 转角样式
    // butt   平的（不出头）
    // round  圆的
    // square 方的
    this.ctx.lineCap   = 'butt';   // 线条端点样式
    this.ctx.strokeStyle = '#000000';  // rgba(255, 0, 0, 0.5)

    // text
    this.ctx.textBaseline = 'top';
    this.ctx.textAlign    = 'start';

};

/**
 * 擦除图像
 */
Painter.prototype.clearRect = function (x, y, w, h) {
    this.ctx.clearRect(x, y, w, h);
    //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

/**
 * 在画布上贴图
 *
 * img 可以是另一个<canvas>
 */
Painter.prototype.drawImage = function (x, y, img) {
    this.ctx.drawImage(img, x, y);
};

Painter.prototype.drawText = function (x, y, str) {
    this.ctx.fillText(str, x, y);// see context.strokeText()
};

Painter.prototype.translate = function (x, y) {
    this.ctx.translate(x, y);
};

/**
 * bold 参数设置了缺省值
 */
Painter.prototype.setFont = function (fontName, fontSize, bold = false) {

    let boldexpr = (bold === true) ? 'bold ' : '';

    /* bold 10px impack */
    // Template String
    this.ctx.font = `${boldexpr} ${fontSize}px ${fontName}`;
};

Painter.prototype.save = function () {
    this.ctx.save();
};

Painter.prototype.restore = function () {
    this.ctx.restore();
};

// closePath
Painter.prototype.beginPath = function () {
    this.ctx.beginPath();
};

Painter.prototype.stroke = function () {
    this.ctx.stroke();
};

Painter.prototype.fill = function () {
    this.ctx.fill();
};

Painter.prototype.circle = function (x, y, radius) {
    // (x, y, radius, startAngle, endAngle)
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
};

