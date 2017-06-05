/**
 * Created by jerry on 2017/6/5.
 */
// 0.获取需要操作的元素
var oTab = document.getElementById("tab")
var tHead = oTab.tHead  // tHead属性，表格独有, oTab也有rows属性，但其包含所有行，包裹th行
var oThList = tHead.rows[0].cells // rows和cells表格独有属性，意思是拿到th中第一行的所有元素
var tBody = oTab.tBodies[0]
var oRows = tBody.rows
var data = null
// -> 1.获取后台JSON数据 -> AJAX(async javascript and xml)
// -->> (1). 创建一个Ajax对象
var xhr = new XMLHttpRequest
// -->> (2). 创建一个Ajax对象
xhr.open("get", "./json/data.txt", true) // 第三个参数布尔值表明是异步请求
// -->> (3). 创建一个Ajax对象
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && /^2\d{2}/.test(xhr.status)) {
    var val = xhr.responseText;
    data = utils.jsonParse(val)
    bind()
    changeBg()
  }
}
// -->> (4). 创建一个Ajax对象
xhr.send()

// -> 2.实现数据绑定
function bind() {
  var frg = document.createDocumentFragment()
  for (var i = 0; i < data.length; i++) {
    var cur = data[i]
    //创建文档碎片
    var oTr = document.createElement('tr')
    for (var key in cur) {
      if(key == 'sex') {
        cur[key] = cur[key] == 1 ? '男' : '女'
      }
      var oTd = document.createElement('td')
      oTd.appendChild(document.createTextNode(cur[key]))
      oTr.appendChild(oTd)
    }
    frg.appendChild(oTr)
  }
  tBody.appendChild(frg)
}

function changeBg () {
  //classList有点新~看要不要加垫片啊~
  for (var i=0; i<oRows.length; i++) {
    if( i%2 === 1) {
      oRows[i].classList.add("bg")
    } else {
      oRows[i].classList.remove("bg")
    }
  }
}
//changeBg() //这里这么执行没颜色啊, 都还没有获取数据呢！行都没有怎么隔行变色。