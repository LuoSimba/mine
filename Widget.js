
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


