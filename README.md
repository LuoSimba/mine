# mine
MineSweep of JavaScript


扫雷 js 实现

本地运行，浏览器可能需要加上： --allow-file-access-from-files

**仅支持PC端，使用鼠标操作**

预览：[https://luosimba.github.io/mine/](https://luosimba.github.io/mine/)


开发环境：
    chrome 83
    win 10


TODO:

* 标记为 "?"
* 结果没有明确显示输赢
* 没有时间计算



changelog:

0615 - 使用动画 requestAnimationFrame。使用动画会**非常**消耗性能

0614 - 使用 Array.filter Array.map Array.reduce Array.forEach (ECMA 22.1.3)
       支持点击数字，翻开周围砖块

0613 - 使用 Symbol 抛出异常 (ECMA 6.1.5)
       可以正常触发游戏结束

0612 - 使用解构参数 (ECMA 13.3.3)
       使用模板字符串(ECMA 11.8.6)
       使用默认参数 (ECMA 14.1)

0611 - 使用 const, let (ECMA 13.3.1)
       使用 arrow function (ECMA 14.2)
       放置红旗触发游戏结束

