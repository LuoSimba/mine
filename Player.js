/*!
 * 对动画管理的简单封装
 */
const Player = (function () {

    const Player = function (callback) {

        this.callback = callback;
        this.id = null;
        this.isStart = false;
    };

    /**
     * 停止动画
     */
    Player.prototype.stop = function () {
        if (this.isStart) {
            window.cancelAnimationFrame(this.id);
            this.isStart = false;
        }
    };

    /**
     * 开始动画
     */
    Player.prototype.start = function () {
        if (this.isStart)
            return;

        // 临时封装函数
        //
        // DOMHighResTimeStamp 回调函数的传入参数，
        //   代表被触发时间（单位毫秒），同一帧的各个回调函数
        //   收到的时间一致。
        //
        //   该参数与performance.now()的返回值相同
        const fn = (DOMHighResTimeStamp /* double */) => {

            this.callback();

            this.id = window.requestAnimationFrame(fn);
        };

        // fn 会在下次重绘之前调用，
        // 并不是在 request... 内部执行（异步？）
        //
        // return long 请求ID
        this.id = window.requestAnimationFrame(fn);
        this.isStart = true;
    };

    return Player;
})();

