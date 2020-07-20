
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
            this.LoadImage('mine', 0, 0);
            this.LoadImage('flag', 1, 0);
            this.LoadImage('brick', 2, 0);
            this.LoadImage('brick-reverse', 3, 0);
            this.LoadImage('ground', 4, 0);
            this.LoadImage('brick-glass', 5, 0);
            this.LoadImage('flag-hit', 6, 0);
            this.LoadImage('boom', 7, 0);
            this.LoadImage('flag-miss', 8, 0);
            this.LoadImage('btn-start', 9, 0);

            this.LoadImage('digit-1', 1, 1);
            this.LoadImage('digit-2', 2, 1);
            this.LoadImage('digit-3', 3, 1);
            this.LoadImage('digit-4', 4, 1);
            this.LoadImage('digit-5', 5, 1);
            this.LoadImage('digit-6', 6, 1);
            this.LoadImage('digit-7', 7, 1);
            this.LoadImage('digit-8', 8, 1);

            if (this.onload !== null)
                this.onload();
        };
    }

    LoadImage (key, x, y) {

        const device = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);

        this.dict.set(key, device);

        const ctx = device.getContext('2d');

        ctx.drawImage(
            this.pic,
            // src
            x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE,
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

    NUMS (n) {
        return this.dict.get(`digit-${n}`);
    }

};


