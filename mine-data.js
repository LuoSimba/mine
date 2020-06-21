

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



const MineBlock = class {
    _is_flag  = false;
    _is_brick = false;
    _is_mine = false;
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
};




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

        const list = this.surroundPositions(x, y);

        // 数组的解构赋值
        for (const [x, y] of list) {
            // isMine?
            // 本身是地雷也可以放置数值标记，
            // 但是调用 num 返回为 0 以同其他数值区域相区别

            // 标记周围的地雷数量 ++
            const block = this.data[ this.width * y + x ];
            block.numInc();
        }
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

        const block = this.data[ this.width * y + x ];

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


const MineSweepData = class {

    _wid = 0;
    _hgt = 0;
    // state
    mineCount = 0;     // 当前存在的地雷数
    flagsCount = 0;    // 当前已用的红旗数
    flagsCountYes = 0; // 有效红旗数
    uncleanBricks = 0; // 剩余未清除砖块数量
    _status = MINEST_PENDING;

    constructor (wid, hgt) {

        this._wid = wid;
        this._hgt = hgt;
        this.clear();
    }

    get width () {
        return this._wid;
    }

    get height () {
        return this._hgt;
    }

    /**
     * get MineBlock of 当前定位
     *
     * return MineBlock, throw symbol
     */
    seek (x, y) {

        if (!this.IsValid(x, y))
            throw MINE_INVALID_POS;

        const addr = this.width * y + x;

        return this.data[ addr ];
    }

    /**
     * 清理战场
     *
     * RULE: 清理战场则游戏必须重置为等待状态
     */
    clear () {

        // 不再使用 Uint8Array(w, h), ArrayBuffer 作为数据存储
        this.data = [];

        for (let j = 0; j < this.height; j ++)
            for (let i = 0; i < this.width; i ++)
                this.data.push(new MineBlock);

        this._status = MINEST_PENDING;
        this.uncleanBricks = 0;
        this.mineCount = 0;
        this.flagsCount = 0;
        this.flagsCountYes = 0;
    }

    /**
     * 准备开始游戏
     *
     * 全部覆盖砖块
     */
    ready () {
        const size = this.width * this.height;

        // ECMA 13.7 Iteration Statements
        //
        // for ... of ...
        for (let block of this.data) {
            // remove all flags & cover with bricks
            block.clearFlag();
            block.coverBrick();
        }

        this._status = MINEST_START;
        this.uncleanBricks = size;
        this.flagsCount = 0;
        this.flagsCountYes = 0;
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

        const block = this.data[ this.width * y + x ];

        if (block.num <= 0)
            throw MINE_LOGIC_ERROR;

        const nearby = this.surroundPositions(x, y);

        const list = nearby.map(
            ([x, y]) => {
                return (this.data[ this.width * y + x ].isFlag) ? 1 : 0
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
     * max <= this.width * this.height
     *
     * RULE: 游戏等待阶段，才能放置地雷
     *
     *
     * 布雷策略：
     *  a. 设定本次放置地雷目标数量 max
     *  b. 设定已放置地雷数量 count = 0
     *  c. 当 count >= max, 执行f
     *  d. 随机选择一个坐标
     *   d.1 如果该坐标没有放置地雷，则在此处放置地雷，count ++
     *  e. 执行c
     *  f. 结束
     *
     * 假设地图尺寸为 100x100 = 10000,
     * 则放置 max 个地雷需要循环的次数为：
     *  sum(10000/(10000-i)), i in [0, max)
     *
     * 假设放置 9999 个地雷，需要循环执行约为 88K 次。
     * (仍然很快，用户不太容易感觉到卡顿)
     *
     * throw symbol
     */
    placeMines (max) {

        if (this._status !== MINEST_PENDING)
            throw MINE_LOGIC_ERROR;

        // how many blocks 
        const size = this.width * this.height;
        const dict = [];

        // 收集已存在的地雷分布(placeMines可多次执行)
        this.data.forEach(
            (block, index) => { 
                if (block.isMine)
                    dict[ index ] = true;
            }
        );

        while (max > 0)
        {
            const n = Util.rnd(size);

            // 避免重复放置
            if (typeof(dict[ n ]) === 'boolean') // conflict?
                continue;

            dict[ n ] = true;
            const x = n % this.width;
            const y = (n - x) / this.width;


            this.data[ n ].isMine = true;
            this.mineCount ++;
            max --;

            // 更新周围的数值
            _num_surround.call(this, x, y);
        }
    }

    /**
     * is address valid?
     */
	IsValid (x, y) {
		return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
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

        const block = this.data[ this.width * y + x ];

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

        const block = this.data[ this.width * y + x ];

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

    /**
     * 周围有效坐标列表
     */
    surroundPositions (x, y) {

        const list = [
            [x-1, y-1], // top left
            [x,   y-1], // top
            [x+1, y-1], // top right
            [x-1, y],   // left
            [x+1, y],   // right
            [x-1, y+1], // bottom left
            [x,   y+1], // bottom 
            [x+1, y+1], // bottom right
        ];

        const list2 = list.filter(
            ([x, y]) => this.IsValid(x, y)
        );

        return list2;
    }

};


	return MineSweepData;
})();

