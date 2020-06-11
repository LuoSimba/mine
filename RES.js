"use strict";

// 图片加载管理器
var ResManager = function () {
	this.pool = {};
	this.urls = {};
	this.errorCount   = 0;
	this.loadingCount = 0;
	this.loadedCount  = 0;
};

ResManager.prototype.Get = function (key, img) {
	return this.pool[key];
};

ResManager.prototype.DimPic = function (key, url) {
	this.urls[key] = url;
};

ResManager.prototype.Start = function (callback) {

	// 清空原旧图片
	this.pool = {};
	this.errorCount   = 0;
	this.loadedCount  = 0;
	this.loadingCount = 0;

	for (var key in this.urls) {
		// 加载图片
		this.loadingCount ++;
		var img = new Image();
		img.onload  = __gen_load_success__(key, img);
		img.onerror = __load_error__;
		img.src = this.urls[key];
		delete this.urls[key];
	}

	var _rm = this;


	/* private */
	function __gen_load_success__ (key, img) {
		return function () {
			_rm.pool[key] = img;
			_rm.loadedCount ++;
			_rm.loadingCount --;
			__load_status_check__();
		};
	}

	/* private */
	function __load_error__ () {
		_rm.errorCount ++;
		_rm.loadingCount --;
		__load_status_check__();
	}

	/* private */
	function __load_status_check__ () {
		if (_rm.loadingCount === 0) {
			if (_rm.errorCount > 0) {
				console.log('图片载入结束，但有错');
			} else {
				console.log('图片全部载入完成');
				callback();
			}
		}
	}
};

