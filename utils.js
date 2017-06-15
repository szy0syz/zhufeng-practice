/**
 * Created by jerry on 2017/6/15.
 */

var utils = {
    // 类数据转换成数组
    listToArray: function (similarArray) {
        var arr = [];
        try {
            arr = Array.prototype.slice.call(similarArray)
        } catch (err) {
            console.log('ie6 ~ ie8');
            for (var i=0, len = similarArray.length; i < len; i++) {
                // 没有数组塌陷，安心用。
                arr[arr.length] = similarArray[i];
            }
        }
        return arr;
    },
    // 将字符串转换为对象
    jsonParse: function (jsonStr) {
        return 'JSON' in window ? JSON.parse(jsonStr) : eval('('  + jsonStr + ')');
    },
    // 获取元素距离body的绝对距离
    offset: function (curElement) {
    var totalLfet = 0, totalTop = 0, parant = curElement.offsetParent
    // 先算自己的
    totalLfet += curElement.offsetLeft
    totalTop += curElement.offsetTop

    while (parant) {
        // 判断是不是IE8
        if (window.navigator.userAgent.indexOf("MSIE 8.0") === -1) {
            // 累加父级参照物的边框
            totalLfet += parant.clientLeft
            totalTop += parant.clientTop
        }
        // 累加父级外边框到上级参照物的距离
        totalLfet += parant.offsetLeft
        totalTop += parant.offsetTop
        // 重新设置父级参照物
        parant = parant.offsetParent
    }
    return {left: totalLfet, top: totalTop}
},
    // 获取或设置html+body的属性
    win: function (attr, val) {
        if (val === undefined) {
            var first = document.documentElement[attr];
            var second = document.body[attr];
            // 排除css中给html或者body设置类似height:500%属性的情况
            if (first > second) {
                return second;
            }
            return first || second;
        }
        document.documentElement[attr] = val;
        document.body[attr] = val;
    },
    // 获取元素当前所有经过浏览器计算渲染过的样式中的[attr]对应的值(兼容(ie6~8))
    getComputedCss: function (curEle, attr) {
        var val = null;
        var reg = /^-?\d+(\.\d+)?(px|pt|rem|em)?$/
        if ("getComputedStyle" in window) {
            val = window.getComputedStyle(curEle, null)[attr];
        } else {  // -> 如果是IE6~8
            if (attr === 'opacity') {
                val = curEle.currentStyle[attr]; // .currentStyle属性为IE专用
                // 正则解释：alpha开头，小括号字符需要用转义符转义，然后括号里是1到1位数字，后面小数部分可有可无，里面?:表示第三个小括号内容不捕获，最后忽略大小写
                reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
                // 先匹配，在捕获到第一个小正则内容，如果不是就返回1
                val = reg.test(val) ? reg.exec(val)[1] / 100 : 1; // exec捕获返回数组，index=1位第一个小正则捕获的内容
            } else {
                val = curEle.currentStyle[attr];
            }
        }
        return reg.test(val) ? parseFloat(val) : val;  // 只返回数值!正则匹配的是复合值,如padding background, floaf...
    }
}
