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
  if(xhr.readyState === 4 && /^2\d{2}/.test(xhr.status)) {
    var val = xhr.responseText;
    data = utils.jsonParse(val)
  }
}
// -->> (4). 创建一个Ajax对象
xhr.send()