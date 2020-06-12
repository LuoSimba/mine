"use strict";

// global setting
const BOX_SIZE = 32;
const RES = new ResManager();
let mapData = new MineData(20, 15); // define map
let widget; // game window
let statusBar;

window.onload = function () {

    widget = new Widget;

    /**
     * 绘制界面
     */
    widget.render = function ({painter}) {

        for (let y = 0; y < mapData.height; y ++) {
            for (let x = 0; x < mapData.width; x ++) {

                mapData.seek(x, y);

                do {
                    // draw blocks.
                    if (mapData.isBrick()) {
                        painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, RES.Get('block'));
                        break;
                    }


                    // draw ground.
                    painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, RES.Get('ground'));

                    let digit = mapData.getNum();
                    // 显示地雷
                    if (mapData.isMine())
                    {
                        painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, RES.Get('mine'));
                    }
                    // 显示数值
                    else if (digit > 0)
                    {
                        painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, RES.Get('num_' + digit));
                    }

                    break;
                } while (true);

                if (mapData.isFlag()) {
                    painter.drawImage(BOX_SIZE * x, BOX_SIZE * y, RES.Get('flag'));
                }
            }
        }
    };

    /**
     * 翻开砖块
     */
    widget.onClick(function (x, y) {

        if (mapData.isGameOver())
            return;

        x = Math.floor(x / BOX_SIZE);
        y = Math.floor(y / BOX_SIZE);

        try {
            // 打开砖块
            if (mapData.clearBrick(x, y))
            {
                this.update();
                statusBar.update();
            }
        } catch (e) {
            this.update();
            statusBar.update();
        }
    });

    /**
     * 放置旗帜
     */
    widget.onContextMenu(function (x, y) {

        if (mapData.isGameOver())
            return;

        x = Math.floor(x / BOX_SIZE);
        y = Math.floor(y / BOX_SIZE);

        if (!mapData.IsValid(x, y))
            return;

        mapData.seek(x, y);

        try {
            if (mapData.toggleFlag())
            {
                this.update();
                statusBar.update();
            }
        } catch (e) {
            this.update(); // 这里一定是成功结束
            statusBar.update();
        }
    });


    // --
    statusBar = new Widget;

    statusBar.render = function ({painter}) {

        // 剩余可用红旗数
        const flagsLeft = mapData.mineCount - mapData.flagsCount;

        painter.clearRect(0, 0, this.width(), this.height());

        painter.save();
        painter.setFont('新宋体', 12, false);
        // Template String
        painter.drawText(10, 40, `FLAG:${flagsLeft}`);
        painter.restore();

        // if game over
        if (mapData.isGameOver()) {
            painter.save();
            painter.setFont('新宋体', 30, true);
            painter.drawText(100, 40, "GAME OVER");
            painter.restore();
        }
    };

    statusBar.onClick(function (x, y) {
        GameStart();
    });

    RES.DimPic('block',  'block.png');
    RES.DimPic('ground', 'ground.png');
    RES.DimPic('flag',   'flag.png');
    RES.DimPic('mine',   'mine.png');
    // --
    RES.DimPic('num_1',   'num_1.png');
    RES.DimPic('num_2',   'num_2.png');
    RES.DimPic('num_3',   'num_3.png');
    RES.DimPic('num_4',   'num_4.png');
    RES.DimPic('num_5',   'num_5.png');
    RES.DimPic('num_6',   'num_6.png');
    RES.DimPic('num_7',   'num_7.png');
    RES.DimPic('num_8',   'num_8.png');

    RES.Start(GameStart);
};


const GameStart = () => {
    mapData.clear();
    mapData.placeMines(10);
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
};


