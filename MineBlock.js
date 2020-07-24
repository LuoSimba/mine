

const MARK_FLAG = Symbol('mark flag');
const MARK_ASK  = Symbol('mark ask');


/**
 * 地图块
 */
class MineBlock {
    _mark_type = null;
    _is_brick = false;
    _is_mine  = false;
    _num = 0;

    constructor () {
        this.isMine = false;
        this._num = 0;

        this.clearMark();
        this.clearBrick();
    }

    get isMine () {
        return this._is_mine;
    }

    set isMine (b) {
        this._is_mine = b;
    }

    /**
     * 获取当前位置的数值
     *
     * RULE: 地雷本身所在的地方，永远返回0
     */
    get num () {
        if (this.isMine)
            return 0;

        return this._num;
    }

    clearNum () {
        this._num = 0;
    }

    numInc () {
        this._num ++;
    }

    // 是否为砖块
    get isBrick () {
        return this._is_brick;
    }

    coverBrick () {
        this._is_brick = true;
    }

    /**
     * 清除砖块的时候，一同清除问号标记
     */
    clearBrick () {
        if (this.isAsk)
            this.clearMark();

        this._is_brick = false;
    }

    /**
     * 是否标记为红旗
     */
    get isFlag () {
        return this._mark_type === MARK_FLAG;
    }

    get isAsk () {
        return this._mark_type === MARK_ASK;
    }

    /**
     * 清除标记
     */
    clearMark () {
        this._mark_type = null;
    }

    /**
     * 标记为红旗
     */
    setMarkFlag () {
        this._mark_type = MARK_FLAG;
    }

    /**
     * 标记为 ？
     */
    setMarkAsk () {
        this._mark_type = MARK_ASK;
    }
}


