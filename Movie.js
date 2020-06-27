/*!
 * 对动画管理的简单封装
 */
class Movie {

    fn = null;
    id = null;
    isStart = false;
    
    constructor (fn) {
        this.fn = fn;
    }

    /**
     * 停止动画
     */
    stop () {
        if (this.isStart) {
            window.cancelAnimationFrame(this.id);
            this.isStart = false;
        }
    }

    /**
     * 开始动画
     */
    start () {
        if (this.isStart)
            return;

        // 临时封装函数
        //
        // DOMHighResTimeStamp 回调函数的传入参数，
        //   代表被触发时间（单位毫秒），同一帧的各个回调函数
        //   收到的时间一致。
        //
        //   该参数与performance.now()的返回值相同
        const f = (DOMHighResTimeStamp /* double */) => {

            this.fn();

            this.id = window.requestAnimationFrame(f);
        };

        // f 会在下次重绘之前调用，
        // 并不是在 request... 内部执行（异步？）
        //
        // return long 请求ID
        //
        // 请求ID不会被用完，是一个很大的数
        this.id = window.requestAnimationFrame(f);
        this.isStart = true;
    }
}

