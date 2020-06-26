


class MineBattleground {

    _wid = 0;
    _hgt = 0;
    _data = [];

    constructor (wid, hgt) {

        this._wid = wid;
        this._hgt = hgt;
        this._data = [];

        for (let i = 0; i < this.size; i ++)
            this._data.push(new MineBlock);
    }

    clearAll () {

        for (const block of this._data) {
            block.isMine = false;
            block.clearBrick();
            block.clearFlag();
            block.clearNum();
        }
    }

    placeMines (max) {

        this.clearAll();

        // 在起始位置，放置足够的地雷
        for (let i = 0; i < max; i ++)
            this._data[ i ].isMine = true;

        // 打乱次序
        for (let limit = this.size; limit > 1; limit --)
        {
            const lastPosition = limit - 1;
            const n = Util.rnd(limit);

            const blockCopy = this._data[ lastPosition ];
            this._data[ lastPosition ] = this._data[ n ];
            this._data[ n ] = blockCopy;
        }

        // 在地雷周围标上数值
        for (let j = 0; j < this.height; j ++)
        {
            for (let i = 0; i < this.width; i ++)
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

    get width () {
        return this._wid;
    }

    get height () {
        return this._hgt;
    }

    get size () {
        return this.width * this.height;
    }

    getBlock (x, y) {
        return this._data[ this.width * y + x ];
    }

    ready () {
        // ECMA 13.7 Iteration Statements
        //
        // for ... of ...
        for (const block of this._data) {
            // remove all flags & cover with bricks
            block.clearFlag();
            block.coverBrick();
        }
    }

    /**
     * is position valid?
     */
    isValid (x, y) {
        return ( x >= 0 && x < this.width)
            && (y >= 0 && y < this.height);
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


