const submit = function submit() {
  const cstName = document.getElementById('cstName'),
    cstAge = document.getElementById('cstName'),
    cstPhone = document.getElementById('cstName'),
    cstAddr = document.getElementById('cstName');

  let obj = {
    name: cstName.value,
    age: cstAge.value,
    phone: cstPhone.value,
    addr: cstAddr.value
  };

  ajax({
    url: '/addCst',
    type: 'post',
    data: JSON.stringify(obj),
    success: function (d) {
      if (d.code === 0) {
        window.location.href = '/index.html';
        return
      }
      alert('添加客户失败');
    }
  })
};

let btnSubmit = document.getElementById('submit');
btnSubmit.onclick = submit;