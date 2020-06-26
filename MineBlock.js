


/**
 * 地图块
 */
class MineBlock {
    _is_flag  = false;
    _is_brick = false;
    _is_mine  = false;
    _num = 0;

    constructor () {
        this.isMine = false;
        this._num = 0;

        this.clearFlag();
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

    clearBrick () {
        this._is_brick = false;
    }

    // 是否标记为红旗
    get isFlag () {
        return this._is_flag;
    }

    clearFlag () {
        this._is_flag = false;
    }

    setFlag () {
        this._is_flag = true;
    }
}


