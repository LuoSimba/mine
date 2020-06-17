"use strict";

/**
 * 图片加载管理器
 */
const ResManager = function () {
	this.loadingCount = 0;

    this.fn = null;
};

ResManager.prototype.loadStatusCheck = function () {
    if (this.loadingCount > 0)
        return;
    
    if (this.fn !== null)
        this.fn();
};

/**
 * 加载图片
 */
ResManager.prototype.LoadImage = function (path) {

    this.loadingCount ++;

    const img = new Image;

    img.onload  = () => {
        this.loadingCount --;
        this.loadStatusCheck();
    };

    img.onerror = () => {
        throw new Error('图片载入结束，但有错');
    };

    img.src = path;

    return img;
};

ResManager.prototype.then = function (callback) {
    this.fn = callback;
    this.loadStatusCheck();
};

