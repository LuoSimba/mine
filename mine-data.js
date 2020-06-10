"use strict";


var MineData = (function () {

	/* private */
	function __num_surround__(x, y) {
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


	var THIS = function (wid, hgt, mineTotal)
    {
        this.width  = wid;
        this.height = hgt;
        this.data   = new Uint8Array(this.width * this.height); // ArrayBuffer

        this.mine   = mineTotal;
        this.flag   = mineTotal;


        // clear all data
		for (var i = 0; i < this.data.length; i ++)
			this.data[i] = 0;

		var mc = this.mine;
		// 随机放置地雷
		while (mc > 0) {
			var x = Util.rnd(this.width);
			var y = Util.rnd(this.height);

			if (!this.isMine(x, y)) {
                this.setMine(x, y);
				__num_surround__.call(this, x, y);
				mc --;
			}
		}


        // 覆盖
        for (var w = 0; w < wid; w ++) {
            for (var h = 0; h < hgt; h ++) {
                this.setBlock(w, h);
            }
        }
	};

	THIS.prototype.IsValid = function (x, y) {
		return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
	};

    THIS.prototype.isMine = function (x, y) {
        return (this.data[ y * this.width + x ] & 0b00100000) !== 0;
    };

    THIS.prototype.setMine = function (x, y) {
        this.data[ this.width * y + x ] |= 0b00100000;
    };

    THIS.prototype.setBlock = function (x, y) {
        this.data[ this.width * y + x ] |= 0b01000000;
    };

    THIS.prototype.clearBlock = function (x, y) {
        this.data[ this.width * y + x ] &= 0b10111111;
    };

    THIS.prototype.isBlock = function (x, y) {
        return (this.data[ this.width * y + x ] & 0b01000000) !== 0;
    };

    // flag
    THIS.prototype.setFlag = function (x, y) {
        this.data[ this.width * y + x ] |= 0b10000000;
    };

    THIS.prototype.clearFlag = function (x, y) {
        this.data[ this.width * y + x ] &= 0b01111111;
    };

    THIS.prototype.isFlag = function (x, y) {
        return (this.data[ this.width * y + x ] & 0b10000000) !== 0;
    };

    THIS.prototype.numInc = function (x, y) {
        var n = this.data[ this.width * y + x ] & 0b00001111;

        this.data[ this.width * y + x ] ++; // FIXME
    };

    THIS.prototype.getNum = function (x, y) {
        var n = this.data[ this.width * y + x ] & 0b00001111;

        return n;
    };

	return THIS;
})();

