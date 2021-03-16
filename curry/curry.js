// 写法1, 通过bind特性每次调用时产生的参数进行增量填满
const curry = (fn, length) => {
  length = length || fn.length
  // 记录函数的行参个数
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

// 写法2, 对每次调用时产生的参数进行存储
// const curry = fn =>
//   judge = (...arg1) =>
//     // 判断参数是否已满
//     arg1.length >= fn.length
//       ? fn(...arg1) // 执行函数
//       : (...arg2) => judge(...arg1, ...arg2) // 将参数合并，继续递归调用

const lowerThan = (num, array) => {
  return array.filter(item => item < num)
}
// let result1 = lowerThan(10, [1, 2, 3, 11])
// console.log(result1)


// 柯里化
const curryLowerThan = curry(lowerThan)
console.log(curryLowerThan.toString())

let result2 = curryLowerThan(10)([1, 2, 3, 11])
// function (...args, length) { // args: num
//   length = length || fn.length
//   // 当参数未满时，递归调用
//   if (args.length < length) { // fn: lowerThan, args.length: 1, length: 2
//     return curry(fn.bind(this, ...args), length - args.length)
//   }
//   // 参数已满，执行 fn 函数
//   else {
//     return fn.call(this, ...args) // args: num, array
//   }
// }
// let result3 = curryLowerThan(10, [1, 2, 3, 11])
// function (...args, length) { // args: num, array
//   length = length || fn.length
//   // 当参数未满时，递归调用
//   if (args.length < length) { // fn: lowerThan, length: 2
//     return curry(fn.bind(this, ...args), length - args.length)
//   }
//   // 参数已满，执行 fn 函数
//   else {
//     return fn.call(this, ...args) // args: num, array
//   }
// }
console.log(result2)
// console.log(result3)
