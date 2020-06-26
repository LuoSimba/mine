

/**
 * 游戏结束，无论成功或失败。
 */
const MINE_GAME_OVER   = Symbol('game over');
/**
 * 使用了非法坐标
 */
const MINE_INVALID_POS = Symbol('invalid position');
/**
 * 其他逻辑错误，违反规定操作
 *
 * 比如：
 * 1. 游戏已经开始，仍然尝试设置地雷
 */
const MINE_LOGIC_ERROR = Symbol('logic error');

/**
 * 游戏状态
 */
const MINEST_PENDING = Symbol('status pending');
const MINEST_START   = Symbol('status game start');
const MINEST_OVER    = Symbol('status game over');

/**
 * usage:
 *
 * let map = new MineData(width, height);
 * map.resetMines(num);
 *
 * use `map.isGameOver()' to check whether game is over
 */
const MineData = (function () {

    /**
     * 清除砖块
     *
     * RULE: 如果当前位置越界，直接返回
     * RULE: 红旗位置受保护，直接返回
     * RULE: 如果当前位置已经清除，直接返回
     * RULE: 如果当前位置为地雷，则游戏结束
     * RULE: 如果当前位置为空，自动清理周围砖块
     *
     */
    function _clear_brick(x, y) {
        if (!this.IsValid(x, y))
            return;

        const block = this._bg.getBlock(x, y);

        if (block.isFlag)
            return;

        if (!block.isBrick)
            return;

        block.clearBrick();
        this.uncleanBricks --;

        // see what's under the brick
        // isMine? then you are dead
        if (block.isMine)
        {
            this._status = MINEST_OVER;
            throw MINE_GAME_OVER;
        }
        else if (block.num === 0) // isEmpty?
        {
            const fn2 = () => {
                _clear_brick.call(this, x-1, y-1);
                _clear_brick.call(this, x+1, y-1);
                _clear_brick.call(this, x+1, y+1);
                _clear_brick.call(this, x-1, y+1);
            };

            const fn = () => {
                _clear_brick.call(this, x-1, y  );
                _clear_brick.call(this, x,   y-1);
                _clear_brick.call(this, x+1, y  );
                _clear_brick.call(this, x,   y+1);

                window.requestAnimationFrame(fn2);
            };

            window.requestAnimationFrame(fn);
        }
    }


class MineSweepData {

    // state
    mineCount = 0;     // 当前存在的地雷数
    flagsCount = 0;    // 当前已用的红旗数
    flagsCountYes = 0; // 有效红旗数
    uncleanBricks = 0; // 剩余未清除砖块数量
    _status = MINEST_PENDING;
    _bg = null;

    constructor (wid, hgt) {
        this._bg = new MineBattleground(wid, hgt);
    }

    get width () {
        return this._bg.width;
    }

    get height () {
        return this._bg.height;
    }

    /**
     * get MineBlock of 当前定位
     *
     * return MineBlock, throw symbol
     */
    seek (x, y) {

        if (!this.IsValid(x, y))
            throw MINE_INVALID_POS;

        return this._bg.getBlock(x, y);
    }

    /**
     * whether game is over
     */
    isGameOver () {
        return this._status === MINEST_OVER;
    }

    /**
     * 清理周围的砖块
     *
     * RULE: 只能对数值区域操作
     *
     * RULE: 只有周围红旗数和当前数值对应才会进行
     */
    clearNearby (x, y) {

        const block = this._bg.getBlock(x, y);

        if (block.num <= 0)
            throw MINE_LOGIC_ERROR;

        const nearby = this._bg.surroundPositions(x, y);

        const list = nearby.map(
            ([x, y]) => {
                return (
                    this._bg.getBlock(x, y).isFlag
                    ) ? 1 : 0
            }
        );

        // 周围的红旗总数
        const n = list.reduce(
            (p,c) => p + c
        );

        // 红旗数和当前数值不一致
        if (block.num === n)
        {
            nearby.forEach(
                ([x, y]) => _clear_brick.call(this, x, y)
            );

            // XXX 这里不需要检查
            this.checkSuccess();
        }
    }

    /**
     * 随机放置地雷
     *
     * RULE: 游戏必须重置为等待状态
     *
     * <delete>
     * 假设地图尺寸为 100x100 = 10000,
     * 则放置 max 个地雷需要循环的次数为：
     *  sum(10000/(10000-i)), i in [0, max)
     *
     * 假设放置 9999 个地雷，需要循环执行约为 88K 次。
     * (仍然很快，用户不太容易感觉到卡顿)
     * </delete>
     *
     * throw symbol
     */
    // 不再使用 Uint8Array(w, h), ArrayBuffer 作为数据存储
    resetMines (max) {

        this._status = MINEST_PENDING;

        if (max > this._bg.size)
            throw MINE_LOGIC_ERROR;

        this._bg.placeMines(max);
        this._bg.ready();


        // ECMA 23.2 Set Object
        //const dict = new Set;
        // dict.has();
        // dict.add();

        this.mineCount = max;
        this.flagsCount = 0;
        this.flagsCountYes = 0;
        this.uncleanBricks = this._bg.size;
        this._status = MINEST_START;
    }

	IsValid (x, y) {
        return this._bg.isValid(x, y);
	}

    /**
     * 如果标记为红旗，则报错
     * 如果已经被打开，则报错
     *
     * 如果覆盖着砖块，就打开砖块
     *   如果遇到地雷，游戏结束
     *   如果是空地，则翻开周围砖块
     *
     * return boolean, throw symbol
     */
    clearBrick (x, y) {

        const block = this._bg.getBlock(x, y);

        if (block.isFlag)
            throw MINE_LOGIC_ERROR;

        if (!block.isBrick)
            throw MINE_LOGIC_ERROR;

        _clear_brick.call(this, x, y);

        // XXX 这里不需要检查
        this.checkSuccess();
    }

    /**
     * 放置/移除红旗
     *
     * RULE: 只有在砖块存在的情况下才能操作
     *
     * return boolean
     */
    toggleFlag (x, y) {

        const block = this._bg.getBlock(x, y);

        if (!block.isBrick)
            return;

        if (block.isFlag) 
        {
            block.clearFlag();
            this.flagsCount --;

            if (block.isMine)
                this.flagsCountYes --;
        }
        // 红旗数量是有限资源，不能超过地雷数量
        else if (this.flagsCount < this.mineCount)
        {
            block.setFlag();
            this.flagsCount ++;

            if (block.isMine) {
                this.flagsCountYes ++;

                this.checkSuccess(); // throw
            }
        }
    }

    /**
     * 检查是否完成任务
     *
     * 不用在意砖块是否都已翻开
     * 只要红旗指出了所有的地雷位置就算胜利
     *
     * throw
     */
    checkSuccess () {
        if (this.flagsCountYes === this.mineCount)
        {
            this._status = MINEST_OVER;
            throw MINE_GAME_OVER;
        }
    }

    surroundPositions (x, y) {
        return this._bg.surroundPositions(x, y);
    }
}


	return MineSweepData;
})();

