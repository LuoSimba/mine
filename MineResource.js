
const BOX_SIZE = 30;


/**
 * 加载游戏所需的图片资源
 *
 * 并提供统一的资源访问方式
 *
 * 只有一张图片，所以不需要复杂的加载功能
 */
const RES = new class {

    pic = new Image;
    onload = null;
    // ECMA 23.1 Map Objects
    dict = new Map;

    constructor () {

        this.pic.onerror = () => {
            throw new Error('图片载入结束，但有错');
        };

        this.pic.onload = () => {
            this.LoadImage('mine',          1, 1);
            this.LoadImage('flag',          1, 2);
            this.LoadImage('brick',         1, 3);
            this.LoadImage('brick-reverse', 1, 4);
            this.LoadImage('ground',        1, 5);
            this.LoadImage('brick-glass',   1, 6);
            this.LoadImage('flag-hit',      1, 7);
            this.LoadImage('boom',          1, 8);
            this.LoadImage('flag-miss',     1, 9);

            this.LoadImage('digit-1', 2, 2);
            this.LoadImage('digit-2', 2, 3);
            this.LoadImage('digit-3', 2, 4);
            this.LoadImage('digit-4', 2, 5);
            this.LoadImage('digit-5', 2, 6);
            this.LoadImage('digit-6', 2, 7);
            this.LoadImage('digit-7', 2, 8);
            this.LoadImage('digit-8', 2, 9);

            this.LoadImage('ask',   3, 2);

            this.LoadImage('btn-start',      4,1);
            this.LoadImage('btn-start-smile',4,2);
            this.LoadImage('btn-start-cry',  4,3);

            if (this.onload !== null)
                this.onload();
        };
    }

    LoadImage (key, row, column) {

        const device = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);

        this.dict.set(key, device);

        const ctx = device.getContext('2d');

        ctx.drawImage(
            this.pic,
            // src
            (column -1) * BOX_SIZE, (row -1) * BOX_SIZE, BOX_SIZE, BOX_SIZE,
            // dst
            0, 0, BOX_SIZE, BOX_SIZE
        );
    }

    start(fn) {

        this.onload = fn;

        this.pic.src = 'block.png'; // hardcoded
    }

    get MINE () {
        return this.dict.get('mine');
    }

    get FLAG () {
        return this.dict.get('flag');
    }

    get FLAG_HIT () {
        return this.dict.get('flag-hit');
    }

    get FLAG_MISS () {
        return this.dict.get('flag-miss');
    }

    get BOOM () {
        return this.dict.get('boom');
    }

    get GROUND () {
        return this.dict.get('ground');
    }

    get BRICK () {
        return this.dict.get('brick');
    }

    get BRICK_REVERSE () {
        return this.dict.get('brick-reverse');
    }

    get BRICK_GLASS () {
        return this.dict.get('brick-glass');
    }

    get BTN_START () {
        return this.dict.get('btn-start');
    }

    get BTN_START_SMILE () {
        return this.dict.get('btn-start-smile');
    }

    get BTN_START_CRY () {
        return this.dict.get('btn-start-cry');
    }

    NUMS (n) {
        return this.dict.get(`digit-${n}`);
    }

};


