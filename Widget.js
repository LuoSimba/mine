
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
 */
class Widget {

    _x = 0;
    _y = 0;
    _w = 300;
    _h = 150;

    onclick = null;
    render = null;

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

        //this.update();
    }

}


/**
 * 屏幕
 *
 */
// ECMA 14.6 Class Definitions
const Screen = class {
    // interface
    oncontextmenu = null;
    onmousedown = null;
    onmouseup = null;

    wnds = [];

	constructor (canvasId) {

		// 创建窗口
        // 创建画布(窗口本身就是画布)
		this.device = document.getElementById(canvasId);
        this.device.style.cssText = 'background:white;';
        this.device.style.display = 'block';

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

            for (const win of this.wnds) {

                if (win.onclick !== null) {

                    if (win.x <= x && x < win.right
                            && win.y <= y && y < win.bottom)
                    {
                        win.onclick(x - win.x, y - win.y);
                        return;
                    }
                }
            }
        };

        // 单击右键
        this.device.oncontextmenu = (event) => {

            if (this.oncontextmenu !== null) {
                this.oncontextmenu(event.offsetX, event.offsetY);
                return false;
            }
        };

        this.device.onmousedown = (event) => {


            // left down
            if (event.button === MOUSE_BTN_LEFT && this.onmousedown !== null) {
                this.onmousedown(event.offsetX, event.offsetY);
            }
        };

        this.device.onmouseup = (event) => {

            if (this.onmouseup !== null) {
                this.onmouseup(event.offsetX, event.offsetY);
            }
        };
	}

    /**
     * get client width
     */
    get width () {
        return this.device.width;
    }

    /**
     * get client height
     */
    get height () {
        return this.device.height;
    }

    get ctx () {
        return this.device.getContext('2d');
    }

    /**
     * redraw window
     */
    update () {

        for (const win of this.wnds) {

            if (win.render !== null) {
                this.painter.save();
                this.painter.translate(win.x, win.y);
                // win.render(this)  --> render = function({painter});
                win.render(this.painter);
                this.painter.restore();
            }
        }
    }

    addWindow (w) {
        this.wnds.push(w);
    }
};

