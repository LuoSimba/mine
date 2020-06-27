"use strict";


// define map(20, 15)
const game = new MineSweeper(30, 16);


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

    if (game.HOT.type === 'NUM') {

        const surrounds = game.surroundPositions(game.HOT.x, game.HOT.y);

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

/**
 * 绘制界面
 *
 * 游戏结束的显示方式有点不一样
 */
game.WIDGET.render = function ({painter}) {
    RenderMapData(painter);
    RenderGameOver(painter);
};

game.STATUS.render = function ({painter}) {

    // 剩余可用红旗数
    const flagsLeft = game.mineCount - game.flagsCount;

    painter.clearRect(0, 0, this.width, this.height);

    painter.save();
    painter.setFont('新宋体', 12, false);
    // Template String
    painter.drawText(10, 40, `FLAG:${flagsLeft}`);
    painter.restore();
};


/**
 * 开始游戏
 */
function GameStart () {
    game.resetMines(99);
    game.ready();
    game.refresh();
}

window.onload = function () {
    // 加载图片
    RES.start(GameStart);
};

