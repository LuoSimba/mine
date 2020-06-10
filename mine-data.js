"use strict";


var MineData = (function () {

	/* private */
	function _num_surround(x, y) {
		var list = [
            [x-1, y-1],  // 左上
		    [x  , y-1],  // 上
		    [x+1, y-1],  // 右上
            [x-1, y  ],  // 左
		    [x+1, y  ],  // 右
            [x-1, y+1],  // 左下
		    [x  , y+1],  // 下
		    [x+1, y+1]   // 右下
        ];

        var pt;
		while (pt = list.shift()) {
			if (this.IsValid(pt[0], pt[1]))
            {
				if (!this.isMine(pt[0], pt[1]))
                {
                    this.numInc(pt[0], pt[1]);
				}
			}
		}
	}


    /**
     * return boolean
     */
    // 避免重复放置
    function _set_mine(x, y) {

        var addr = this.width * y + x;

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
     * 覆盖砖块
     */
    function _cover_bricks() {
        var size = this.width * this.height;

        for (var i = 0; i < size; i ++) {
            this.data[ i ] |= 0b01000000;
        }

        this.uncleanBricks = size;
    }

	var MineSweepData = function (wid, hgt)
    {
        this.width  = wid;
        this.height = hgt;
        this.data   = new Uint8Array(this.width * this.height); // ArrayBuffer

        this.mineCount = 0; // 当前存在的地雷数
        this.flag = 0;
        this.uncleanBricks = 0; // 剩余未清除砖块数量

        this.clear();
	};

    MineSweepData.prototype.clear = function () {
        for (var i = 0; i < this.data.length; i ++)
            this.data[i] = 0;

        this.mineCount = 0;
    };

    /**
     * 准备开始游戏
     *
     * 全部覆盖砖块
     */
    MineSweepData.prototype.ready = function () {
        _cover_bricks.call(this);
    };

    /**
     * 随机放置地雷
     *
     * max <= this.width * this.height
     */
    MineSweepData.prototype.placeMines = function (max) {
		while (max > 0) {
			var x = Util.rnd(this.width);
			var y = Util.rnd(this.height);

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

    MineSweepData.prototype.isMine = function (x, y) {
        return (this.data[ y * this.width + x ] & 0b00100000) !== 0;
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
     * return boolean
     */
    MineSweepData.prototype.cleanBrick = function (x, y) {

        if (!this.IsValid(x, y))
            return false;

        var addr = this.width * y + x;

        // isFlag?
        if ((this.data[ addr ] & 0b10000000) !== 0)
            return false;

        // isClean?
        if ((this.data[ addr ] & 0b01000000) === 0)
            return false;


        // else:
        // clean brick
        this.data[ addr ] &= 0b10111111;
        this.uncleanBricks --;

        // and check what is inside
        // isMine? game over
        if ((this.data[ addr ] & 0b00100000) !== 0)
        {
            throw new Error; // you are dead
        }
        // 向四面八方蔓延, 空地才能自动蔓延
        else if ((this.data[ addr ] & 0b00001111) === 0)  // isEmpty?
        {
            this.cleanBrick(x-1, y  );
            this.cleanBrick(x-1, y-1);
            this.cleanBrick(x,   y-1);
            this.cleanBrick(x+1, y-1);
            this.cleanBrick(x+1, y  );
            this.cleanBrick(x+1, y+1);
            this.cleanBrick(x,   y+1);
            this.cleanBrick(x-1, y+1);
        }

        return true;
    };

    MineSweepData.prototype.isBrick = function (x, y) {
        return (this.data[ this.width * y + x ] & 0b01000000) !== 0;
    };

    // flag
    MineSweepData.prototype.setFlag = function (x, y) {
        this.data[ this.width * y + x ] |= 0b10000000;
    };

    MineSweepData.prototype.clearFlag = function (x, y) {
        this.data[ this.width * y + x ] &= 0b01111111;
    };

    /**
     * 是否标记为红旗
     */
    MineSweepData.prototype.isFlag = function (x, y) {
        return (this.data[ this.width * y + x ] & 0b10000000) !== 0;
    };

    MineSweepData.prototype.numInc = function (x, y) {
        var n = this.data[ this.width * y + x ] & 0b00001111;

        this.data[ this.width * y + x ] ++; // FIXME
    };

    MineSweepData.prototype.getNum = function (x, y) {
        var n = this.data[ this.width * y + x ] & 0b00001111;

        return n;
    };

	return MineSweepData;
})();

