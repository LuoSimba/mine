"use strict";

// global setting
const BOX_SIZE = 30;
const RES = new ResManager();
const IMG_BLOCK  = RES.LoadImage('block.png');
const IMG_BLOCK_REVERSE = RES.LoadImage('block-press.png');
const IMG_GROUND = RES.LoadImage('ground.png');
const IMG_FLAG   = RES.LoadImage('flag.png');
const IMG_MINE   = RES.LoadImage('mine.png');
const IMG_DIGIT_1 = RES.LoadImage('num_1.png');
const IMG_DIGIT_2 = RES.LoadImage('num_2.png');
const IMG_DIGIT_3 = RES.LoadImage('num_3.png');
const IMG_DIGIT_4 = RES.LoadImage('num_4.png');
const IMG_DIGIT_5 = RES.LoadImage('num_5.png');
const IMG_DIGIT_6 = RES.LoadImage('num_6.png');
const IMG_DIGIT_7 = RES.LoadImage('num_7.png');
const IMG_DIGIT_8 = RES.LoadImage('num_8.png');
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

let mapData = new MineData(30, 16); // define map(20, 15)
let widget; // game window
let statusBar;

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
    for (let y = 0; y < mapData.height; y ++) {
        for (let x = 0; x < mapData.width; x ++) {

            const block = mapData.seek(x, y);

            // draw blocks.
            if (block.isBrick) {
                painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, IMG_BLOCK);
            } else {
                // draw ground.
                painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, IMG_GROUND);

                // 显示地雷
                if (block.isMine)
                {
                    painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, IMG_MINE);
                }
                // 显示数值
                else if (block.num > 0)
                {
                    painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, NUMS[block.num]);
                }
            }

            // 绘制红旗
            if (block.isFlag) {
                painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, IMG_FLAG);
            }
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
        painter.save();

        painter.translate(widget.width / 2, widget.height / 2);
        // frame
        painter.ctx.fillStyle = 'rgba(255,255,255,.6)';
        painter.ctx.strokeStyle = 'black';
        painter.ctx.lineWidth = 2;
        painter.beginPath();
        painter.ctx.rect(-100, -50, 200, 100);
        painter.fill();
        painter.stroke();
        // text
        painter.ctx.fillStyle = 'black';
        painter.ctx.textAlign = 'center';
        painter.ctx.textBaseline = 'middle';
        painter.setFont('新宋体', 30, true);
        painter.drawText(0, 0, 'Game Over');
        painter.restore();
    }
};



window.onload = function () {

    widget = new Widget;

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
    statusBar = new Widget;

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

    RES.then(GameStart);
};

const movie = new Movie(function () {
    widget.update();
    statusBar.update();
});

const GameStart = () => {
    mapData.clear();
    mapData.placeMines(99);
    mapData.ready();

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



