"use strict";


var Widget = (function () {


    /**
     * 窗口类
     */
	var Widget = function () {

		// 创建窗口
		this.wnd = document.createElement('div');
        this.wnd.style.cssText = "position:absolute; width:400px; height:300px; overflow:hidden; border:1px solid rgba(0,0,0,.6); background:white; box-shadow:2px 2px 3px rgba(0,0,0,.4); display:none;";

        // 创建画布
        this.paintDevice = document.createElement('canvas');
        this.painter     = new Painter(this.paintDevice);

        this.wnd.appendChild(this.paintDevice);
        document.body.append(this.wnd);

        this.render = null;
        this.visible = false;
	};

    /**
     * show window
     */
    Widget.prototype.show = function () {
        if (!this.visible) {
            this.wnd.style.display = 'block';
            this.visible = true;
            this.update();
        }
    };

    /**
     * hide window
     */
    Widget.prototype.hide = function () {
        if (this.visible) {
            this.wnd.style.display = 'none';
            this.visible = false;
        }
    };

    /**
     * resize window
     */
    Widget.prototype.resize = function (wid, hgt) {
        this.wnd.style.width  = wid + 'px';
        this.wnd.style.height = hgt + 'px';

        this.paintDevice.width  = wid;
        this.paintDevice.height = hgt;

        this.update();
    };

    /**
     * change window location
     */
    Widget.prototype.move = function (x, y) {
        this.wnd.style.left = x + 'px';
        this.wnd.style.top  = y + 'px';
    };

    /**
     * get client width
     */
    Widget.prototype.width = function () {
        return this.wnd.clientWidth;
    };

    /**
     * get client height
     */
    Widget.prototype.height = function () {
        return this.wnd.clientHeight;
    };

    /**
     * redraw window
     */
    Widget.prototype.update = function () {
        if (this.visible && this.render !== null) {
            console.log('[render]');

            this.painter.save();
            this.render(this.painter);
            this.painter.restore();
        }
    };

    /**
     * click event
     */
    // 单击左键
    Widget.prototype.onClick = function (fn) {
        var _WINDOW_ = this;

        this.paintDevice.onclick = function (event) {
            console.log('[click]');

            // layerX  NO
            // pageX   NO
            // offsetX YES

            fn.call(_WINDOW_, event.offsetX, event.offsetY);

        };
    };

    // 单击右键
    Widget.prototype.onContextMenu = function (fn) {
        var _WINDOW_ = this;

        this.paintDevice.oncontextmenu = function (event) {
            console.log('[context-menu]');

            fn.call(_WINDOW_, event.offsetX, event.offsetY);

            return false;
        };
    };


	return Widget;
})();

