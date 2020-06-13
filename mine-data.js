"use strict";


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
 * usage:
 *
 * let map = new MineData(width, height);
 * map.clear(); 
 * map.placeMines(num);
 * map.ready();
 *
 * use `map.isGameOver()' to check whether game is over
 */
const MineData = (function () {

	/* private */
	function _num_surround(x, y) {
		let list = [
            [x-1, y-1],  // 左上
		    [x  , y-1],  // 上
		    [x+1, y-1],  // 右上
            [x-1, y  ],  // 左
		    [x+1, y  ],  // 右
            [x-1, y+1],  // 左下
		    [x  , y+1],  // 下
		    [x+1, y+1]   // 右下
        ];

        let pt;
		while (pt = list.shift()) {

            // 数组的解构赋值
            const [x, y] = pt;

			if (this.IsValid(x, y))
            {
                // isMine?
                // 本身是地雷也可以放置数值标记，
                // 但是调用 getNum() 返回为 0 以同其他数值区域相区别
                //
                //let n = this.data[ this.width * y + x ] & 0b00001111;

                // 标记周围的地雷数量 ++
                this.data[ this.width * y + x ] ++; // FIXME
			}
		}
	}



    /**
     * return boolean
     */
    // 避免重复放置
    function _set_mine(x, y) {

        const addr = this.width * y + x;

        if ((this.data[addr] & 0b00100000) === 0)
        {
            this.data[ addr ] |= 0b00100000;

            this.mineCount ++;

            _num_surround.call(this, x, y);

            return true;
        }
        else 
            return false;
    }


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

        let data = this.data[ this.width * y + x ];

        // isFlag
        if ((data & 0b10000000) !== 0)
            return;

        // isClean
        if ((data & 0b01000000) === 0)
            return;

        // clear brick
        data &= 0b10111111;
        this.data[ this.width * y + x ] = data;
        this.uncleanBricks --;

        // see what's under the brick
        // isMine? then you are dead
        if ((data & 0b00100000) !== 0)
        {
            this.bGameOver = true;
            throw MINE_GAME_OVER;
        }
        else if ((data & 0b00001111) === 0) // isEmpty?
        {
            _clear_brick.call(this, x-1, y  );
            _clear_brick.call(this, x-1, y-1);
            _clear_brick.call(this, x,   y-1);
            _clear_brick.call(this, x+1, y-1);
            _clear_brick.call(this, x+1, y  );
            _clear_brick.call(this, x+1, y+1);
            _clear_brick.call(this, x,   y+1);
            _clear_brick.call(this, x-1, y+1);
        }
    }


    function _nearby_positions(x, y) {
        // 周围的坐标
        const list = [
            [x-1, y-1],
            [x, y-1],
            [x+1, y-1],
            [x-1, y],
            [x+1, y],
            [x-1, y+1],
            [x, y+1],
            [x+1, y+1],
        ];

        const list2 = list.filter(
            ([x, y]) => this.IsValid(x, y)
        );

        return list2;
    }

	const MineSweepData = function (wid, hgt) {

        this.width  = wid;
        this.height = hgt;
        this.data   = new Uint8Array(this.width * this.height); // ArrayBuffer

        this.mineCount = 0;     // 当前存在的地雷数
        this.flagsCount = 0;    // 当前已用的红旗数
        this.flagsCountYes = 0; // 有效红旗数
        this.uncleanBricks = 0; // 剩余未清除砖块数量
        this.bGameOver = true;

        // 当前操作定位
        this.x = 0;
        this.y = 0;
        this.addr = 0;
	};

    /**
     * 设置当前定位
     *
     * throw symbol
     */
    MineSweepData.prototype.seek = function (x, y) {

        if (this.IsValid(x, y)) {
            this.x = x;
            this.y = y;
            this.addr = this.width * this.y + this.x;
        }
        else 
            throw MINE_INVALID_POS;
    };

    /**
     * 清理战场
     *
     * RULE: 清理战场则游戏必须重置为结束状态
     */
    MineSweepData.prototype.clear = function () {
        for (let i = 0; i < this.data.length; i ++)
            this.data[i] = 0;

        this.bGameOver = true;
        this.uncleanBricks = 0;
        this.mineCount = 0;
        this.flagsCount = 0;
        this.flagsCountYes = 0;
    };

    /**
     * 准备开始游戏
     *
     * 全部覆盖砖块
     */
    MineSweepData.prototype.ready = function () {
        const size = this.width * this.height;

        for (let i = 0; i < size; i ++) {
            // remove all flags & cover with bricks
            this.data[ i ] = (this.data[i] & 0b01111111) | 0b01000000;
        }

        this.bGameOver = false;
        this.uncleanBricks = size;
        this.flagsCount = 0;
        this.flagsCountYes = 0;

        this.x = 0;
        this.y = 0;
        this.addr = 0;
    };

    /**
     * whether game is over
     */
    MineSweepData.prototype.isGameOver = function () {
        return this.bGameOver;
    };

    /**
     * 清理周围的砖块
     *
     * RULE: 只能对数值区域操作
     *
     * RULE: 只有周围红旗数和当前数值对应才会进行
     */
    MineSweepData.prototype.clearNearby = function () {
        // 当前位置的数值
        const n2 = mapData.getNum();

        if (n2 <= 0)
            throw MINE_LOGIC_ERROR;

        const nearby = _nearby_positions.call(this, this.x, this.y);

        // isFlag
        const list = nearby.map(
            ([x, y]) => {
                return (this.data[ this.width * y + x ] & 0b10000000) === 0 ? 
                    0 : 1
            }
        );

        // 周围的红旗总数
        const n = list.reduce(
            (p,c) => p + c
        );

        // 红旗数和当前数值不一致
        if (n2 === n)
        {
            nearby.forEach(
                ([x, y]) => _clear_brick.call(this, x, y)
            );
            return true;
        }
        else
            return false;
    };

    /**
     * 随机放置地雷
     *
     * max <= this.width * this.height
     *
     * RULE: 游戏开始阶段，不能放置地雷
     *
     * throw symbol
     */
    MineSweepData.prototype.placeMines = function (max) {

        if (!this.isGameOver())
            throw MINE_LOGIC_ERROR;


        while (max > 0) {

            let x = Util.rnd(this.width);
            let y = Util.rnd(this.height);

            if (_set_mine.call(this, x, y) === true)
            {
                max --;
            }
        }
    };

    /**
     * is address valid?
     */
	MineSweepData.prototype.IsValid = function (x, y) {
		return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
	};

    /**
     * (自动检查坐标)
     *
     * 如果标记为红旗，则报错
     * 如果已经被打开，则报错
     *
     * 如果覆盖着砖块，就打开砖块
     *   如果遇到地雷，游戏结束
     *   如果是空地，则翻开周围砖块
     *
     * return boolean, throw symbol
     */
    MineSweepData.prototype.clearBrick = function () {

        const data = this.data[ this.addr ];

        // isFlag?
        if ((data & 0b10000000) !== 0)
            throw MINE_LOGIC_ERROR;

        // isClean?
        if ((data & 0b01000000) === 0)
            throw MINE_LOGIC_ERROR;

        _clear_brick.call(this, this.x, this.y);

        // 检查是否完成任务
        // 如果剩余砖块数，等于地雷数，那么地雷一定就在
        // 这些砖块下
        if (this.uncleanBricks === this.mineCount) {
            this.bGameOver = true;
            throw MINE_GAME_OVER;
        }
    };

    /**
     * 当前位置是否为砖块
     *
     */
    MineSweepData.prototype.isBrick = function () {
        return (this.data[ this.addr ] & 0b01000000) !== 0;
    };

    /**
     * 放置/移除红旗
     *
     * RULE: 游戏结束时，不准此项操作
     *
     * RULE: 只有在砖块存在的情况下才能操作
     *
     * return boolean
     */
    MineSweepData.prototype.toggleFlag = function () {

        if (this.isGameOver())
            return false;

        if (this.isBrick())
        {
            if (this.isFlag())
            {
                this.data[ this.addr ] &= 0b01111111; // clear flag
                this.flagsCount --;

                if (this.isMine())
                    this.flagsCountYes --;

                return true;
            }
            // 红旗数量是有限资源，不能超过地雷数量
            else if (this.flagsCount < this.mineCount)
            {
                this.data[ this.addr ] |= 0b10000000; // set flag
                this.flagsCount ++;


                if (this.isMine()) {
                    this.flagsCountYes ++;

                    // 检查是否完成任务
                    // 不用在意砖块是否都已翻开
                    // 只要红旗指出了所有的地雷位置就算胜利
                    if (this.flagsCountYes === this.mineCount)
                    {
                        this.bGameOver = true;
                        throw MINE_GAME_OVER;
                    }
                }

                return true; // changed successfully
            }
        }

        return false; // do nothing
    };

    /**
     * 当前位置是否标记为红旗
     */
    MineSweepData.prototype.isFlag = function () {
        return (this.data[ this.addr ] & 0b10000000) !== 0;
    };

    /**
     * 当前位置是否是地雷
     */
    MineSweepData.prototype.isMine = function () {
        return (this.data[ this.addr ] & 0b00100000) !== 0;
    };

    /**
     * 获取当前位置的数值
     *
     * RULE: 地雷本身所在的地方，永远返回0
     */
    MineSweepData.prototype.getNum = function () {

        if (this.isMine())
            return 0;

        let n = this.data[ this.addr ] & 0b00001111;

        return n;
    };

	return MineSweepData;
})();

