"use strict";

// global setting

const game = new MineSweeper(10, 10); // define map(20, 15)
const statusBar = new Widget;

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
    painter.drawImage(0, 0, game.GROUND);

    for (let y = 0; y < game.height; y ++) {
        for (let x = 0; x < game.width; x ++) {

            const block = game.seek(x, y);

            // draw blocks.
            if (block.isBrick)
                painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, RES.BRICK);

            // 绘制红旗
            if (block.isFlag)
                painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, RES.FLAG);
        }
    }

    if (hot.type === 'NUM') {

        const surrounds = game.surroundPositions(hot.x, hot.y);

        for (const [x, y] of surrounds) {

            const sr = game.seek(x, y);

            if (!sr.isFlag && sr.isBrick)
                painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, RES.BRICK_REVERSE);
        }
    }
};

const RenderGameOver = (painter) => {

    if (game.isGameOver()) {
        painter.save();
        painter.translate(game.width * BOX_SIZE / 2, game.height * BOX_SIZE / 2);
        painter.ctx.textAlign = 'center';
        painter.ctx.textBaseline = 'middle';
        painter.drawText(0, 0, 'Game Over');
        painter.restore();
    }

};



window.onload = function () {


    /**
     * 绘制界面
     *
     * 游戏结束的显示方式有点不一样
     */
    game.WIDGET.render = function ({painter}) {
        RenderMapData(painter);
        RenderGameOver(painter);
    };

    /**
     * 鼠标左键按下时，记录按下的类型
     */
    game.WIDGET.onmousedown = function (x, y) {
        if (game.isGameOver())
            return;

        x = Math.floor(x / BOX_SIZE);
        y = Math.floor(y / BOX_SIZE);

        const block = game.seek(x, y);

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

    game.WIDGET.onmouseup = function (x, y) {
        if (game.isGameOver())
            return;

        x = Math.floor(x / BOX_SIZE);
        y = Math.floor(y / BOX_SIZE);

        hot.type = null;
    };

    /**
     * 翻开砖块
     */
    game.WIDGET.onclick = function (x, y) {

        if (game.isGameOver())
            return;

        x = Math.floor(x / BOX_SIZE);
        y = Math.floor(y / BOX_SIZE);

        try {
            const block = game.seek(x, y);

            if (block.isFlag)
            {
                // do nothing, 红旗不可操作
            }
            else if (block.isBrick)
            {
                // 打开砖块
                game.clearBrick(x, y);
            }
            else if (block.num > 0)
            {
                game.clearNearby(x, y);
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
    game.WIDGET.oncontextmenu = function (x, y) {

        if (game.isGameOver())
            return;

        x = Math.floor(x / BOX_SIZE);
        y = Math.floor(y / BOX_SIZE);

        if (!game.IsValid(x, y))
            return;

        try {
            game.toggleFlag(x, y);
        } catch (e) {
            GameException(e);
        }
    };


    // --

    statusBar.render = function ({painter}) {

        // 剩余可用红旗数
        const flagsLeft = game.mineCount - game.flagsCount;

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


    // 加载图片
    RES.start(GameStart);
};

const movie = new Movie(function () {
    game.WIDGET.update();
    statusBar.update();
});

const GameStart = () => {
    game.resetMines(10);
    game.ready();

    const win_width  = game.width  * BOX_SIZE;
    const win_height = game.height * BOX_SIZE;

    // -- show multi windows
    game.WIDGET.move(30, 30);
    game.WIDGET.resize(win_width, win_height);
    game.WIDGET.show();

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


