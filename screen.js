// MouseEvent.offsetX
// MouseEvent.offsetY
// 这两个并不是标准属性
//
// 应该使用：
// MouseEvent.clientX
// MouseEvent.clientY
// 这两个是相对于 Viewport 的坐标
//
// DOMRect bounding = elt.getBoundingClientRect();
//
// 计算得到鼠标点击坐标（不考虑元素边框的大小）
// x = event.clientX - bounding.left;
// y = event.clientY - bounding.top;


/**
 * 屏幕是一个巨大的画布, 是整个游戏绘图的场所
 *
 * 屏幕被分割成一块一块矩形区域(Window)单独管理
 */
// ECMA 14.6 Class Definitions
const SCREEN = new class {

    device  = null;
    painter = null;
    wnds    = [];

    constructor () {

        this.device = document.getElementById('SCREEN');  // hardcoded
        this.painter = new Painter(this.device);
    }

    /**
     * get screen width
     */
    get width () {
        return this.device.width;
    }

    /**
     * get screen height
     */
    get height () {
        return this.device.height;
    }


    addWindow (win) {
        this.wnds.push(win);
    }

    queryWindow (x, y) {

        for (const win of this.wnds) {
            
            if (
                    win.left <= x && x < win.right
                    && win.top <= y && y < win.bottom)
            {
                return win.queryWindow(x - win.left, y - win.top);
            }
        }

        return null;
    }

    fullScreen () {
        this.device.width  = window.innerWidth;
        this.device.height = window.innerHeight;

        this.update();
    }

    /**
     * redraw all windows
     */
    update () {

        // first clear all
        this.painter.clearRect(0, 0, this.width, this.height);

        for (const win of this.wnds) {

            if (win.render !== null) {
                this.painter.save();
                this.painter.translate(win.x, win.y);
                // win.render(this)  --> render = function({painter});
                win.render(this.painter);
                this.painter.restore();
            }

            for (const sub of win.children) {
                if (sub.render !== null) {
                    this.painter.save();
                    this.painter.translate(win.x + sub.x, win.y + sub.y);
                    sub.render(this.painter);
                    this.painter.restore();
                }
            }
        }
    }
};




// ==============================
// INPUT
// ==============================

SCREEN.device.onclick = function (event) {
    // layerX  NO
    // pageX   NO
    // offsetX YES
    const x = event.offsetX;
    const y = event.offsetY;

    const win = SCREEN.queryWindow(x, y);
    if (win === null) return;

    if (win.onclick !== null) { 

        win.onclick(x - win.x, y - win.y);
    }
};

/**
 * 单击右键
 */
SCREEN.device.oncontextmenu = function (event) {

    const x = event.offsetX;
    const y = event.offsetY;

    const win = SCREEN.queryWindow(x, y);
    if (win === null) return;

    if (win.oncontextmenu !== null) {
        win.oncontextmenu(x - win.x, y - win.y);
        return false;
    }
};


SCREEN.device.onmousedown = function (event) {

    // only deal with left button down
    if (event.button !== MOUSE_BTN_LEFT) return;

    const x = event.offsetX;
    const y = event.offsetY;

    const win = SCREEN.queryWindow(x, y);
    if (win === null) return;

    if (win.onmousedown !== null) {
        win.onmousedown(x - win.x, y - win.y);
    }
};


SCREEN.device.onmouseup = function (event) {

    const x = event.offsetX;
    const y = event.offsetY;

    const win = SCREEN.queryWindow(x, y);
    if (win === null) return;

    if (win.onmouseup !== null) {
        win.onmouseup(x - win.x, y - win.y);
    }
};

// ==============================
// BEHAVIOR
// ==============================
window.onresize = function () {

    SCREEN.fullScreen();
};
SCREEN.fullScreen();


