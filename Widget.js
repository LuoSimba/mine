
/**
 * 窗口类
 *
 * 窗口默认没有边框，有利于坐标计算
 */
const Widget = class {
	constructor () {

		// 创建窗口
        // 创建画布(窗口本身就是画布)
		this.device = document.createElement('canvas');
        this.device.style.cssText = 'position:absolute; background:white; box-shadow:2px 2px 3px rgba(0,0,0,.4); display:none;';

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

        document.body.append(this.device);

        this.render = null;
        this.visible = false;

        // interface
        this.onclick = null;
        this.oncontextmenu = null;
	}

    /**
     * show window
     */
    show () {
        if (!this.visible) {
            this.device.style.display = 'block';
            this.visible = true;
            this.update();
        }
    }

    /**
     * hide window
     */
    hide () {
        if (this.visible) {
            this.device.style.display = 'none';
            this.visible = false;
        }
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
     * change window location
     */
    move (x, y) {
        this.device.style.left = x + 'px';
        this.device.style.top  = y + 'px';
    }

    /**
     * get client width
     */
    width () {
        return this.device.width;
    }

    /**
     * get client height
     */
    height () {
        return this.device.height;
    }

    /**
     * redraw window
     */
    update () {
        if (this.visible && this.render !== null) {
            this.painter.save();
            this.render(this);
            this.painter.restore();
        }
    }
};

