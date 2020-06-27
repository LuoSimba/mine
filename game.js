"use strict";


const game = new MineSweeper(30, 16);

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

