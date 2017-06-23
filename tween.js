/**
 * Created by jerry on 2017/6/20.
 */

~function () {
  //~~在小闭包里，别怕，外面的家伙伤害不了你，我会保护你，你是我的唯一~~

  // // 公式包
  // var effect = {
  //     linear: function linearFn(t, d, c, b) {
  //         // change*time/duration+begin
  //         // return b + (t/d)*c;
  //         return b + (t / d) * c;
  //     }
  // };

  var myEffect = {
    //匀速
    Linear: function (t, b, c, d) {
      return c * t / d + b;
    },
    //指数衰减的反弹缓动
    Bounce: {
      easeIn: function (t, b, c, d) {
        return c - myEffect.Bounce.easeOut(d - t, 0, c, d) + b;
      },
      easeOut: function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
          return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
          return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
          return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
          return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
      },
      easeInOut: function (t, b, c, d) {
        if (t < d / 2) {
          return myEffect.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
        }
        return myEffect.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
      }
    },
    //二次方的缓动
    Quad: {
      easeIn: function (t, b, c, d) {
        return c * (t /= d) * t + b;
      },
      easeOut: function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
          return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      }
    },
    //三次方的缓动
    Cubic: {
      easeIn: function (t, b, c, d) {
        return c * (t /= d) * t * t + b;
      },
      easeOut: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
          return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      }
    },
    //四次方的缓动
    Quart: {
      easeIn: function (t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
      },
      easeOut: function (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
          return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      }
    },
    //五次方的缓动
    Quint: {
      easeIn: function (t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
      },
      easeOut: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
          return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      }
    },
    //正弦曲线的缓动
    Sine: {
      easeIn: function (t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
      },
      easeOut: function (t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
      },
      easeInOut: function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
      }
    },
    //指数曲线的缓动
    Expo: {
      easeIn: function (t, b, c, d) {
        return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
      },
      easeOut: function (t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
      },
      easeInOut: function (t, b, c, d) {
        if (t === 0) return b;
        if (t === d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      }
    },
    //圆形曲线的缓动
    Circ: {
      easeIn: function (t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
      },
      easeOut: function (t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
          return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      }
    },
    //超过范围的三次方缓动
    Back: {
      easeIn: function (t, b, c, d, s) {
        if (s === undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
      },
      easeOut: function (t, b, c, d, s) {
        if (s === undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
      },
      easeInOut: function (t, b, c, d, s) {
        if (s === undefined) s = 1.70158;
        if ((t /= d / 2) < 1) {
          return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
      }
    },
    //指数衰减的正弦曲线缓动
    Elastic: {
      easeIn: function (t, b, c, d, a, p) {
        if (t === 0) return b;
        if ((t /= d) === 1) return b + c;
        if (!p) p = d * .3;
        var s;
        !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      },
      easeOut: function (t, b, c, d, a, p) {
        if (t === 0) return b;
        if ((t /= d) === 1) return b + c;
        if (!p) p = d * .3;
        var s;
        !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
      },
      easeInOut: function (t, b, c, d, a, p) {
        if (t === 0) return b;
        if ((t /= d / 2) === 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        var s;
        !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      }
    }
  };

  /**
   * 盒子移动动画函数
   * @param el 需要运动的元素
   * @param target 需要运动的终点[Objecct]
   * @param duration 需要运动的时间间隔
   * @param interval 动画播放间隔
   * @param effect 效果公式
   * @param callback 回调函数
   **/
  function move(el, target, duration, interval, effect, callback) {
    // 【1.判断边界  2.设置每一个维度的值】
    if (typeof  effect === 'number') {
      switch (effect) {
        case 1:
          tmpEffect = myEffect.Bounce.easeIn;
          break;
        case 2:
          tmpEffect = myEffect.Elastic.easeInOut;
          break;
        case 3:
          tmpEffect = myEffect.Circ.easeIn;
          break;
        case 4:
          tmpEffect = myEffect.Sine.easeInOut;
          break;
      }
    } else if (effect instanceof Array) {
      //effect 是个数组，如果不是长度2，就默认该动画大类的默认第一个，如果是2就逐一对应
      tmpEffect = effect.length === 2 ? myEffect[effect[0]][effect[1]] : myEffect[effect[0]];
    } else if (typeof effect === 'function') {
      // 如果参数少传一个且类型还是function就把最后一个参数设置为回调函数
      callback = effect;
    } else { // 实在没有就丢个null
      callback = null;
    }
    // 有些时候，初始化变量还真不能放在最前面哦！
    var time = 0,    // 动画播放进度条的时间
      begin = {},  // 元素起始值对象,根据传入el和target确定其有多少个维度
      change = {}; // 差距量值对象，也有多个维度
    interval = interval || 10;
    // 初始化临时效果对象，默认为匀速直线运动
    var tmpEffect = myEffect.Linear;
    //console.log("tween.js - timer:" + el.timer);
    // 计算出begin[xxx]和change[xxx]的各个维度值
    for (var key in target) {
      // 过滤出私有属性
      if (target.hasOwnProperty(key)) {
        begin[key] = utils.css(el, key);
        change[key] = target[key] - begin[key];
      }
    }
    window.clearInterval(el.timer);
    //console.log("0清除定时器:" + el.timer);
    el.timer = window.setInterval(function () {
      time += interval;
      // 如果动画时间已结束
      if (time >= duration) {
        // 清除定时器
        window.clearInterval(el.timer);
        //console.log("1清除定时器:" + el.timer);
        // target对象格式正好符合css的批量修改style格式
        utils.css(el, target);
        // 动画完成时执行回调函数
        // 判断callback是否为真就逻辑且执行并修改this为当前元素
        callback && typeof callback === 'function' && callback.call(el);
        return;
      }
      // 如果动画时间还有，就设置循环当前距离给元素，逐一赋值到元素style上
      for (var key in target) {
        if (target.hasOwnProperty(key)) {
          // 嗯，对的，就这样。不需要声明cur对象，只需要定义cur值即可！且在需要时再去声明就行。
          var cur = tmpEffect(time, begin[key], change[key], duration);
          utils.css(el, key, cur);
        }
      }
    }, interval)
  }

  window.moveAnimate = move;
}();