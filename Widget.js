"use strict";


const Widget = (function () {


    /**
     * 窗口类
     *
     * 窗口默认没有边框，有利于坐标计算
     */
	const Widget = function () {

		// 创建窗口
        // 创建画布(窗口本身就是画布)
		this.device = document.createElement('canvas');
        this.device.style.cssText = 'position:absolute; background:white; box-shadow:2px 2px 3px rgba(0,0,0,.4); display:none;';

        this.painter = new Painter(this.device);

        document.body.append(this.device);

        this.render = null;
        this.visible = false;
	};

    /**
     * show window
     */
    Widget.prototype.show = function () {
        if (!this.visible) {
            this.device.style.display = 'block';
            this.visible = true;
            this.update();
        }
    };

    /**
     * hide window
     */
    Widget.prototype.hide = function () {
        if (this.visible) {
            this.device.style.display = 'none';
            this.visible = false;
        }
    };

    /**
     * resize window
     */
    Widget.prototype.resize = function (wid, hgt) {
        this.device.width  = wid;
        this.device.height = hgt;

        this.update();
    };

    /**
     * change window location
     */
    Widget.prototype.move = function (x, y) {
        this.device.style.left = x + 'px';
        this.device.style.top  = y + 'px';
    };

    /**
     * get client width
     */
    Widget.prototype.width = function () {
        return this.device.width;
    };

    /**
     * get client height
     */
    Widget.prototype.height = function () {
        return this.device.height;
    };

    /**
     * redraw window
     */
    Widget.prototype.update = function () {
        if (this.visible && this.render !== null) {
            console.log('[render]');

            this.painter.save();
            this.render(this);
            this.painter.restore();
        }
    };

    /**
     * click event
     */
    // 单击左键
    Widget.prototype.onClick = function (fn) {

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

            fn.call(this, event.offsetX, event.offsetY);
        };
    };

    // 单击右键
    Widget.prototype.onContextMenu = function (fn) {

        this.device.oncontextmenu = (event) => {
            console.log('[context-menu]');

            fn.call(this, event.offsetX, event.offsetY);

            return false;
        };
    };


	return Widget;
})();

