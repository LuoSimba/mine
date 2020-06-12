"use strict";

// global setting
const BOX_SIZE = 32;
const RES = new ResManager();
let mapData = new MineData(20, 15); // define map
let widget; // game window

window.onload = function () {

    widget = new Widget;

    /**
     * 绘制界面
     */
    widget.render = function (painter) {

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

        // if game over
        if (mapData.isGameOver()) {
            painter.save();
            painter.setFont('新宋体', 30, true);
            painter.drawText(100, 100, "GAME OVER");
            painter.restore();
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
            }
        } catch (e) {
            this.update();
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
            }
        } catch (e) {
            this.update(); // 这里一定是成功结束
        }
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
    widget.move(30, 30);
    widget.resize(mapData.width * BOX_SIZE, mapData.height * BOX_SIZE);
    widget.show();
};


