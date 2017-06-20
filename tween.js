/**
 * Created by jerry on 2017/6/20.
 */

~function () {
    //~~在小闭包里，别怕，外面的家伙伤害不了你，我会保护你，你是我的唯一~~

    // 公式包
    var effect = {
        linear: function linearFn(t, d, c, b) {
            // change*time/duration+begin
            return c * t / d + b;
        }
    };

    // 多方向状态移动函数
    // target: { left: 1000, top: 500, opacity: 0}
    function move(el, target, duration, interval) {
        var time = 0;
        el.timer = window.setInterval(function () {
            time += interval;
            var cur = {}, begin = {}, change = {};
            // 计算出begin[xxx]和change[xxx]
            for (var key in target) {
                // 过滤出私有属性
                if (target.hasOwnProperty(key)) {
                    begin[key] = utils.css(el, key);
                    change[key] = target[key] - begin[key];
                    cur[key] = effect.linear(time, duration, change[key], begin[key]);
                }
            }
            // 如果动画时间已结束
            if (time >= duration) {
                // 清除定时器
                window.clearInterval(el.timer);
                // target对象格式正好符合css的批量修改style格式
                utils.css(el, target);
                return;
            }
            // 如果动画时间还有，就设置循环当前距离给元素，逐一赋值到元素style上
            for (var k in cur) {
                if (target.hasOwnProperty(key)) {
                    utils.css(el, k, cur[k]);
                }
            }
        }, interval)
    }

    window.moveAnimate = move;
}();