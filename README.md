# mine
MineSweep of JavaScript


扫雷 js 实现

本地运行，浏览器可能需要加上： --allow-file-access-from-files

预览：[https://luosimba.github.io/mine/](https://luosimba.github.io/mine/)


开发环境：
    chrome 83
    win 10





## changelog

0724 - 标记为"?"

0723 - 直观地显示胜利或者失败

0720 - 重新开始按钮

0627 - 按需执行动画
       游戏结束细节展示

0626 - 使用 Map
       优化图片资源的管理

0624 - 使用 OffscreenCanvas

0619 - 加入翻砖的动画效果

0618 - 游戏增加为三个阶段：准备，开始，结束
       使用 class 来定义类

0614 - 使用 Array.filter Array.reduce Array.forEach (ECMA 22.1.3)
       支持点击数字，翻开周围砖块

0613 - 使用 Symbol 抛出异常 (ECMA 6.1.5)
       可以正常触发游戏结束

0612 - 使用解构参数 (ECMA 13.3.3)
       使用模板字符串(ECMA 11.8.6)
       使用默认参数 (ECMA 14.1)

0611 - 使用 const, let (ECMA 13.3.1)
       使用 arrow function (ECMA 14.2)
       放置红旗触发游戏结束




## 兼容性
* 仅支持PC端
** 不支持 Microsoft Edge 44.18362.449.0，因为 Edge 不支持类的书写格式如 'class a { b = null; }'
** 不支持 IE11，因为不支持类定义如 'class a {}'
* 仅支持使用鼠标操作



## TODO

* 鼠标拖动导致地图数据混乱
* 没有时间计算

