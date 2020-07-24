
/**
 * 扫雷地图
 */
// 不再使用 Uint8Array(w, h), ArrayBuffer 作为数据存储
class MineBattleground {

    _wid = 0;
    _hgt = 0;
    _data = [];
    IMAGE = null;

    constructor (wid, hgt) {

        this._wid = wid;
        this._hgt = hgt;
        this._data = [];

        for (let i = 0; i < this.size; i ++)
            this._data.push(new MineBlock);

        this.IMAGE = new OffscreenCanvas(
                wid * BOX_SIZE,
                hgt * BOX_SIZE);
    }

    /**
     * 打乱次序
     */
    _shuffle () {

        for (let range = this.size; range > 1; range --)
        {
            const lastPosition = range -1;

            // choose which block?
            const n = Util.rnd(range);

            // swap n <-> lastPosition when n !== lastPosition
            if (n !== lastPosition) {
                const blockRef = this._data[ lastPosition ];
                this._data[ lastPosition ] = this._data[ n ];
                this._data[ n ] = blockRef;
            }
        }
    }

    /**
     * 清除地下的地雷和数值，
     * 不涉及红旗，砖块数据
     */
    clearGround () {

        // ECMA 13.7 Iteration Statements
        //
        // for ... of ...
        for (const block of this._data) {
            block.isMine = false;
            block.clearNum();
        }
    }

    /**
     * 重新安排地雷分布
     */
    placeMines (max) {

        this.clearGround();

        // --------------
        // 方法1
        // --------------
        if (true)
        {
            // 在起始位置，放置足够的地雷
            for (let i = 0; i < max; i ++) {
                this._data[ i ].isMine = true;
            }
            this._shuffle();
        }
        // --------------
        // 方法2
        // --------------
        else
        {
            let mineCount = 0;
            // ECMA 23.2 Set Object
            const dict = new Set;

            while (mineCount < max) {
                const n = Util.rnd(this.size);

                if (!dict.has(n)) {
                    dict.add(n);
                    this._data[ n ].isMine = true;
                    mineCount ++;
                }
            }
        }


        // 在地雷周围标上数值
        for (let j = 0; j < this.rows; j ++)
        {
            for (let i = 0; i < this.cols; i ++)
            {
                // 更新周围的数值
                if (this.getBlock(i, j).isMine)
                {
                    const list = this.surroundPositions(i, j);

                    // 数组的解构赋值
                    for (const [x, y] of list) {
                        // 标记周围的地雷数量 ++
                        const block = this.getBlock(x, y);
                        block.numInc();
                    }
                }
            }
        }
    }

    get cols () { return this._wid; }
    get rows () { return this._hgt; }
    get size () { return this.cols * this.rows; }
    get width  () { return this.cols * BOX_SIZE; }
    get height () { return this.rows * BOX_SIZE; }

    /**
     * return MineBlock, throw symbol
     */
    getBlock (x, y) {

        if (!this.isValid(x, y))
            throw new Error('坐标超出范围');

        return this._data[ this.cols * y + x ];
    }

    ready () {

        // remove all flags & cover with bricks
        for (const block of this._data) {
            block.clearMark();
            block.coverBrick();
        }

        const painter = new Painter(this.IMAGE);

        // 只需要绘制底图，不必绘制砖块和红旗
        for (let j = 0; j < this.rows; j ++) {
            for (let i = 0; i < this.cols; i ++) {

                const block = this.getBlock(i, j);

                // draw ground.
                painter.drawImage(i * BOX_SIZE, j * BOX_SIZE, RES.GROUND);

                if (block.isMine) {
                    // 显示地雷
                    painter.drawImage(i * BOX_SIZE, j * BOX_SIZE, RES.MINE);
                } else if (block.num > 0) {
                    // 显示数值
                    painter.drawImage(i * BOX_SIZE, j * BOX_SIZE, RES.NUMS( block.num ));
                }
            }
        }
    }

    /**
     * is position valid?
     */
    isValid (x, y) {
        return ( x >= 0 && x < this.cols)
            && (y >= 0 && y < this.rows);
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
            ([x, y]) => this.isValid(x, y)
        );

        return list2;
    }
}


