"use strict";



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
            let x = pt[0];
            let y = pt[1];

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





	const MineSweepData = function (wid, hgt) {

        this.width  = wid;
        this.height = hgt;
        this.data   = new Uint8Array(this.width * this.height); // ArrayBuffer

        this.mineCount = 0; // 当前存在的地雷数
        this.flagsCount = 0;
        this.uncleanBricks = 0; // 剩余未清除砖块数量
        this.bGameOver = true;

        // 当前操作定位
        this.x = 0;
        this.y = 0;
        this.addr = 0;
	};

    /**
     * 设置当前定位
     */
    MineSweepData.prototype.seek = function (x, y) {

        if (this.IsValid(x, y)) {
            this.x = x;
            this.y = y;
            this.addr = this.width * this.y + this.x;
        }
        else 
            throw new Error('invalid coord');
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
     * 随机放置地雷
     *
     * max <= this.width * this.height
     *
     * RULE: 游戏开始阶段，不能放置地雷
     *
     * throw error
     */
    MineSweepData.prototype.placeMines = function (max) {

        if (this.isGameOver()) {

            while (max > 0) {

                let x = Util.rnd(this.width);
                let y = Util.rnd(this.height);

                if (_set_mine.call(this, x, y) === true)
                {
                    max --;
                }
            }
        }
        else 
            throw new Error('forbidden when game in progress');
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
     * 如果标记为红旗，则不可打开
     *
     * 如果已经被打开，则不可重复打开
     *
     * 如果覆盖着砖块，就打开砖块
     *   如果遇到地雷，游戏结束
     *   如果是空地，则翻开周围砖块
     *
     * return boolean, throw error
     */
    MineSweepData.prototype.clearBrick = function (x, y) {

        if (!this.IsValid(x, y))
            return false;

        let addr = this.width * y + x;

        // isFlag?
        if ((this.data[ addr ] & 0b10000000) !== 0)
            return false;

        // isClean?
        if ((this.data[ addr ] & 0b01000000) === 0)
            return false;


        // else:
        // clear brick
        this.data[ addr ] &= 0b10111111;
        this.uncleanBricks --;

        // and check what is inside
        // isMine? game over
        if ((this.data[ addr ] & 0b00100000) !== 0)
        {
            this.bGameOver = true;
            throw new Error('boom~'); // you are dead
        }
        // 向四面八方蔓延, 空地才能自动蔓延
        else if ((this.data[ addr ] & 0b00001111) === 0)  // isEmpty?
        {
            this.clearBrick(x-1, y  );
            this.clearBrick(x-1, y-1);
            this.clearBrick(x,   y-1);
            this.clearBrick(x+1, y-1);
            this.clearBrick(x+1, y  );
            this.clearBrick(x+1, y+1);
            this.clearBrick(x,   y+1);
            this.clearBrick(x-1, y+1);
        }

        return true;
    };

    /**
     * 当前位置是否为砖块
     *
     * see this.seek()
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
                // clear flag
                this.data[ this.addr ] &= 0b01111111;
                this.flagsCount --;
                return true;
            }
            else if (this.flagsCount < this.mineCount)
            {
                // set flag 
                // 红旗数量是有限资源，不能超过地雷数量
                this.data[ this.addr ] |= 0b10000000;
                this.flagsCount ++;

                // 检查是否完成任务
                if (this.flagsCount === this.mineCount
                    && this.flagsCount === this.uncleanBricks)
                {
                    this.bGameOver = true;
                    throw new Error('success~');  // 游戏完成
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

