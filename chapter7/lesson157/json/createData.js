const str1 = '赵钱孙李周吴郑王凤城厨卫蒋沈韩杨朱秦尤许'; // 20
const str2 = '一二三四五六七八九壹贰叁肆伍陆柒捌玖'; // 16

let ary = [],
  obj = null;

const getRandom = function (n, m) {
  return Math.round(Math.random() * (m - n) + n);
};

for (let i = 1; i <= 99; i++) {
  obj = {
    id: i,
    name: str1[getRandom(0, 19)] + str2[getRandom(0, 15)],
    sex: getRandom(0, 1),
    score: getRandom(50, 99)
  };
  ary.push(obj);
}

console.log(JSON.stringify(ary));