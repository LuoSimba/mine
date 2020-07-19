
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
 * 窗口类
 *
 * 窗口默认没有边框，有利于坐标计算
 */
// ECMA 14.6 Class Definitions
const Widget = class {
    // interface
    onclick = null;
    oncontextmenu = null;
    onmousedown = null;
    onmouseup = null;
    render = null;

	constructor (canvasId) {

		// 创建窗口
        // 创建画布(窗口本身就是画布)
		this.device = document.getElementById(canvasId);
        this.device.style.cssText = 'background:white;';
        this.device.style.display = 'block';

        this.painter = new Painter(this.device);

        /**
         * 这里使用 ArrowFunction,
         * 当这个函数被 onclick 调用时，
         * this 不再是 this.device
         * (this.device 在调用 onclick)
         *
         * this 会是 ArrowFunction 定义时的 this 值
         * 这里是 Widget 对象
         */
        this.device.onclick = (event) => {
            // layerX  NO
            // pageX   NO
            // offsetX YES
            if (this.onclick !== null)
                this.onclick(event.offsetX, event.offsetY);
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
     * resize window
     */
    resize (wid, hgt) {
        this.device.width  = wid;
        this.device.height = hgt;

        this.update();
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
        if (this.render !== null) {
            this.painter.save();
            this.render(this);
            this.painter.restore();
        }
    }
};

