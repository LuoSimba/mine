
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
 * 窗口
 *
 * 窗口中可以包含子窗口
 */
class Widget {

    _x = 0;
    _y = 0;
    _w = 300;
    _h = 150;

    children = [];

    onclick       = null;
    oncontextmenu = null;
    onmousedown   = null;
    onmouseup     = null;
    render        = null;

    get x () { return this._x; }
    get y () { return this._y; }
    get width  () { return this._w; }
    get height () { return this._h; }
    get right  () { return this._x + this._w; }
    get bottom () { return this._y + this._h; }

    move (x, y) {
        this._x = x;
        this._y = y;
    }

    /**
     * resize window
     */
    resize (wid, hgt) {
        this._w = wid;
        this._h = hgt;
    }

    addWindow (win) {

        this.children.push(win);
    }

    queryWindow (x, y) {

        for (const sub of this.children) {

            if (sub.x <= x && x < sub.right
                    && sub.y <= y && y < sub.bottom)

                return sub;
        }

        return this;
    }
}


/**
 * 屏幕
 *
 */
// ECMA 14.6 Class Definitions
const Screen = class
{

    device  = null;
    ctx     = null;
    painter = null;
    wnds    = [];

	constructor (canvasId) {

        // 创建画布(屏幕本身就是画布)
		this.device = document.getElementById(canvasId);
        this.ctx    = this.device.getContext('2d');
        this.painter = new Painter(this.device);

        /**
         * 这里使用 ArrowFunction,
         * 当这个函数被调用时，
         * this 不再是 this.device
         * (this.device 在调用 onclick)
         *
         * this 会是 ArrowFunction 定义时的 this 值
         * 这里是 Screen 对象
         */
        this.device.onclick = (event) => {
            // layerX  NO
            // pageX   NO
            // offsetX YES
            const x = event.offsetX;
            const y = event.offsetY;

            const win = this._queryWindow(x, y);
            if (win === null) return;

            if (win.onclick !== null) { 

                win.onclick(x - win.x, y - win.y);
            }
        };


        // 单击右键
        this.device.oncontextmenu = (event) => {

            const x = event.offsetX;
            const y = event.offsetY;

            const win = this._queryWindow(x, y);
            if (win === null) return;

            if (win.oncontextmenu !== null) {
                win.oncontextmenu(x - win.x, y - win.y);
                return false;
            }
        };


        this.device.onmousedown = (event) => {

            // only deal with left button down
            if (event.button !== MOUSE_BTN_LEFT) return;

            const x = event.offsetX;
            const y = event.offsetY;

            const win = this._queryWindow(x, y);
            if (win === null) return;

            if (win.onmousedown !== null) {
                win.onmousedown(x - win.x, y - win.y);
            }
        };

        this.device.onmouseup = (event) => {

            const x = event.offsetX;
            const y = event.offsetY;

            const win = this._queryWindow(x, y);
            if (win === null) return;

            if (win.onmouseup !== null) {
                win.onmouseup(x - win.x, y - win.y);
            }
        };
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

    resize (wid, hgt) {
        this.device.width  = wid;
        this.device.height = hgt;

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

    addWindow (w) {
        this.wnds.push(w);
    }

    _queryWindow (x, y) {

        for (const win of this.wnds) {
            
            if (
                    win.x <= x && x < win.right
                    && win.y <= y && y < win.bottom)
            {
                return win.queryWindow(x - win.x, y - win.y);
            }
        }

        return null;
    }
};

