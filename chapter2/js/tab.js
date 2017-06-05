/**
 * Created by jerry on 2017/6/5.
 */
// 0.获取需要操作的元素
var oTab = document.getElementById("tab")
var tHead = oTab.tHead  // tHead属性，表格独有, oTab也有rows属性，但其包含所有行，包裹th行
var oThs = tHead.rows[0].cells // rows和cells表格独有属性，意思是拿到th中第一行的所有元素
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
      if (key == 'sex') {
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

function changeBg() {
  //classList有点新~看要不要加垫片啊~
  for (var i = 0; i < oRows.length; i++) {
    if (i % 2 === 1) {
      oRows[i].classList.add("bg")
    } else {
      oRows[i].classList.remove("bg")
    }
  }
}
//changeBg() //这里这么执行没颜色啊, 都还没有获取数据呢！行都没有怎么隔行变色。

//算法分析：
//1.那个table的那个tbody
//2.看数据行是否小于2，小于就没必要排序
//3.确定所点的列序号
//4.tbody里的tr行对象转换成数组
//5.在数组中用列序号确认用哪个值排序，取得时候直接拿到nodeValue
//6.创建文档碎片
//7.循环排序后的数组，逐一将tr_dom对象存入文档碎片的childList里
//8.将文档碎片对象appendChild到tbody上
function sort(mouseEvent) {
  var th = mouseEvent.target
  var tb = document.getElementsByTagName("tbody")[0]
  if (tb.children.length < 2) return // 如果就一行数据那就不排序了
  var columnIndex = -1 // 点的到底是哪一列
  var siblingThAry = [].__proto__.slice.call(th.parentNode.children)
  for (var i = 0; i < siblingThAry.length; i++) {
    if (siblingThAry[i].isEqualNode((th))) {
      columnIndex = i //第几列
    }
  }
  var rowsAry = [].__proto__.slice.call(tb.children)
  rowsAry.sort(function (a, b) {
    var curValue = a.children[columnIndex].firstChild.nodeValue
    var nextValue = b.children[columnIndex].firstChild.nodeValue
    if (isNaN(parseFloat(curValue)) || isNaN(parseFloat(nextValue))) {
      return (curValue.toString().localeCompare(nextValue.toString())) * th.flag
    }
    return (parseFloat(curValue) - parseFloat(nextValue)) * th.flag
  })
  th.flag *= -1
  var frg = document.createDocumentFragment()
  rowsAry.forEach(function (item) {
    frg.appendChild(item)
  })
  tb.appendChild(frg)
  changeBg()
}

//初始化
function init() {
  for (var j = 0; j < oThs.length; j++) { //oThs还是个类数组！
    oThs[j].flag = 1
    console.log(oThs[j].flag)
    oThs[j].addEventListener('click', sort, false)
  }
}
init()