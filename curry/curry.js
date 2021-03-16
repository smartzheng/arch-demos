const curry = (fn, length) => {
  // 记录函数的行参个数
  length = length || fn.length
  return function (...args) {
    // 当参数未满时，递归调用
    if (args.length < length) {
      return curry(fn.bind(this, ...args), length - args.length)
    }
    // 参数已满，执行 fn 函数
    else {
      return fn.call(this, ...args)
    }
  }
}

// const curry = fn => {
//   const judge = (...arg1) =>
//       // 判断参数是否已满
//       arg1.length >= fn.length
//         ? fn(...arg1) // 执行函数
//         : (...arg2) => judge(...arg1, ...arg2) // 将参数合并，继续递归调用
//   return judge
// }

const lowerThan = (num, array) => {
  return array.filter(item => item < num)
}
const num = 10
const array = [1, 2, 3, 11]
lowerThan(num, array) // [1, 2, 3]

const curryLowerThan = curry(lowerThan)

curryLowerThan(num)(array) // [1, 2, 3]
curryLowerThan(num, array) // [1, 2, 3]
