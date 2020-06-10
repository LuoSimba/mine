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

	var MineSweepData = function (wid, hgt)
    {
        this.width  = wid;
        this.height = hgt;
        this.data   = new Uint8Array(this.width * this.height); // ArrayBuffer

        this.mineCount = 0; // 当前存在的地雷数
        this.flag = 0;

        this.clear();
        return;

        // 覆盖
        for (var w = 0; w < wid; w ++) {
            for (var h = 0; h < hgt; h ++) {
                this.setBrick(w, h);
            }
        }
	};

    MineSweepData.prototype.clear = function () {
        for (var i = 0; i < this.data.length; i ++)
            this.data[i] = 0;

        this.mineCount = 0;
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

	MineSweepData.prototype.IsValid = function (x, y) {
		return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
	};

    MineSweepData.prototype.isMine = function (x, y) {
        return (this.data[ y * this.width + x ] & 0b00100000) !== 0;
    };

    MineSweepData.prototype.setBrick = function (x, y) {
        this.data[ this.width * y + x ] |= 0b01000000;
    };

    MineSweepData.prototype.clearBrick = function (x, y) {
        this.data[ this.width * y + x ] &= 0b10111111;
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

