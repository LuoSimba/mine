"use strict";

// global setting
const BOX_SIZE = 30;
const RES = new ResManager();
const IMGS = RES.LoadImage('block.png');

const IMG_BLOCK   = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);
const IMG_BLOCK_REVERSE = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);
const IMG_GROUND  = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);
const IMG_FLAG    = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);
const IMG_MINE    = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);
const IMG_DIGIT_1 = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);
const IMG_DIGIT_2 = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);
const IMG_DIGIT_3 = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);
const IMG_DIGIT_4 = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);
const IMG_DIGIT_5 = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);
const IMG_DIGIT_6 = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);
const IMG_DIGIT_7 = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);
const IMG_DIGIT_8 = new OffscreenCanvas(BOX_SIZE, BOX_SIZE);
const NUMS = [
    null,
    IMG_DIGIT_1,
    IMG_DIGIT_2,
    IMG_DIGIT_3,
    IMG_DIGIT_4,
    IMG_DIGIT_5,
    IMG_DIGIT_6,
    IMG_DIGIT_7,
    IMG_DIGIT_8,
];


function LoadImage(offCanvas, x, y) {
    const ctx = offCanvas.getContext('2d');

    ctx.drawImage(
        IMGS,
        // src
        x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE,
        // dst
        0, 0, BOX_SIZE, BOX_SIZE
    );
}

let mapData     = new MineData(20, 15); // define map(20, 15)
const widget    = new Widget; // game window
const statusBar = new Widget;
const GROUND = new OffscreenCanvas(mapData.width * BOX_SIZE, mapData.height * BOX_SIZE);

// XXX: test
const hot = {
    x: 0,
    y: 0,
    type: null,
};


/**
 * 绘制地图数据
 */
const RenderMapData = (painter) => {

    // 底图
    painter.drawImage(0, 0, GROUND);

    for (let y = 0; y < mapData.height; y ++) {
        for (let x = 0; x < mapData.width; x ++) {

            const block = mapData.seek(x, y);

            // draw blocks.
            if (block.isBrick)
                painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, IMG_BLOCK);

            // 绘制红旗
            if (block.isFlag)
                painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, IMG_FLAG);
        }
    }

    if (hot.type === 'NUM') {

        const surrounds = mapData.surroundPositions(hot.x, hot.y);

        for (const [x, y] of surrounds) {

            const sr = mapData.seek(x, y);

            if (!sr.isFlag && sr.isBrick)
                painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, IMG_BLOCK_REVERSE);
        }
    }
};

const RenderGameOver = (painter) => {

    if (mapData.isGameOver()) {
        // todo
    }

};



window.onload = function () {


    /**
     * 绘制界面
     *
     * 游戏结束的显示方式有点不一样
     */
    widget.render = function ({painter}) {
        RenderMapData(painter);
        RenderGameOver(painter);
    };

    /**
     * 鼠标左键按下时，记录按下的类型
     */
    widget.onmousedown = function (x, y) {
        if (mapData.isGameOver())
            return;

        x = Math.floor(x / BOX_SIZE);
        y = Math.floor(y / BOX_SIZE);

        const block = mapData.seek(x, y);

        if (block.isFlag) {
            hot.type = null;
        } else if (block.isBrick) {
            hot.type = null;
        } else if (block.num > 0) {
            hot.type = 'NUM';
            hot.x = x;
            hot.y = y;
        } else {
            hot.type = null;
        }
    };

    widget.onmouseup = function (x, y) {
        if (mapData.isGameOver())
            return;

        x = Math.floor(x / BOX_SIZE);
        y = Math.floor(y / BOX_SIZE);

        hot.type = null;
    };

    /**
     * 翻开砖块
     */
    widget.onclick = function (x, y) {

        if (mapData.isGameOver())
            return;

        x = Math.floor(x / BOX_SIZE);
        y = Math.floor(y / BOX_SIZE);

        try {
            const block = mapData.seek(x, y);

            if (block.isFlag)
            {
                // do nothing, 红旗不可操作
            }
            else if (block.isBrick)
            {
                // 打开砖块
                mapData.clearBrick(x, y);
            }
            else if (block.num > 0)
            {
                mapData.clearNearby(x, y);
            }
            else
            {
                // 剩下的都是空地，不能点击
            }

        } catch (e) {
            GameException(e);
        }
    };

    /**
     * 放置旗帜
     */
    widget.oncontextmenu = function (x, y) {

        if (mapData.isGameOver())
            return;

        x = Math.floor(x / BOX_SIZE);
        y = Math.floor(y / BOX_SIZE);

        if (!mapData.IsValid(x, y))
            return;

        try {
            mapData.toggleFlag(x, y);
        } catch (e) {
            GameException(e);
        }
    };


    // --

    statusBar.render = function ({painter}) {

        // 剩余可用红旗数
        const flagsLeft = mapData.mineCount - mapData.flagsCount;

        painter.clearRect(0, 0, this.width, this.height);

        painter.save();
        painter.setFont('新宋体', 12, false);
        // Template String
        painter.drawText(10, 40, `FLAG:${flagsLeft}`);
        painter.restore();
    };

    statusBar.onclick = function (x, y) {
        GameStart();
    };

    RES.then(function () {
        LoadImage(IMG_MINE, 0, 0);
        LoadImage(IMG_FLAG, 1, 0);
        LoadImage(IMG_BLOCK, 2, 0);
        LoadImage(IMG_BLOCK_REVERSE, 3, 0);
        LoadImage(IMG_GROUND, 4, 0);

        LoadImage(IMG_DIGIT_1, 1, 1);
        LoadImage(IMG_DIGIT_2, 2, 1);
        LoadImage(IMG_DIGIT_3, 3, 1);
        LoadImage(IMG_DIGIT_4, 4, 1);
        LoadImage(IMG_DIGIT_5, 5, 1);
        LoadImage(IMG_DIGIT_6, 6, 1);
        LoadImage(IMG_DIGIT_7, 7, 1);
        LoadImage(IMG_DIGIT_8, 8, 1);

        GameStart();
    });
};

const movie = new Movie(function () {
    widget.update();
    statusBar.update();
});

const GameStart = () => {
    mapData.resetMines(20);
    mapData.ready();

    // init ground ui
    const painter = new Painter(GROUND);
    for (let j = 0; j < mapData.height; j ++) {
        for (let i = 0; i < mapData.width; i ++) {

            const block = mapData.seek(i, j);

            // draw ground.
            painter.drawImage(i * BOX_SIZE, j * BOX_SIZE, IMG_GROUND);
            if (block.isMine) {
                // 显示地雷
                painter.drawImage(i * BOX_SIZE, j * BOX_SIZE, IMG_MINE);
            } else if (block.num > 0) {
                // 显示数值
                painter.drawImage(i * BOX_SIZE, j * BOX_SIZE, NUMS[ block.num ]);
            }
        }
    }


    const win_width  = mapData.width  * BOX_SIZE;
    const win_height = mapData.height * BOX_SIZE;

    // -- show multi windows
    widget.move(30, 30);
    widget.resize(win_width, win_height);
    widget.show();

    statusBar.move(30, 30 + win_height + 10);
    statusBar.resize(win_width, 50);
    statusBar.show();

    // 执行动画
    movie.start();
};

const GameException = (e) => {

    switch (e) {
        case MINE_GAME_OVER:
            break;
        case MINE_INVALID_POS:
            alert('坐标超出范围');
            throw e;
        case MINE_LOGIC_ERROR:
            alert('严重错误');
            throw e;
        default:
            throw e;
    }
};



