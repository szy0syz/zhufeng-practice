/**
 * Created by jerry on 2017/6/5.
 */
var utils = {
  listToArray : function (likeAry) {
    var tmp = []
    try {
      tmp = Array.prototype.slice.call(likeAry)
    } catch (e) {
      for(var i=0;i<likeAry.length;i++) {
        tmp[tmp.length] = likeAry[i]
      }
    }
    return tmp
  },
  jsonParse: function (jsonStr) {
    return 'JSON' in window ? JSON.parse(jsonStr) : eval('(' + jsonStr + ')')
  }

}