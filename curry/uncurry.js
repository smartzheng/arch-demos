// function Toast(options = {}) {
//   this.message = options.message
// }
//
// Toast.prototype = {
//   showMessage: function () {
//     console.log(this.message)
//   }
// }
//
// new Toast({ message: 'show me' }).showMessage()
//
//
// // 反 curry 化通用函数
// // 核心实现思想是：先取出要执行 fn 方法的对象，标记为 obj，同时从 arguments 中删除，在调用 fn 时，将 fn 执行上下文环境改为 obj
// const unCurry = fn => (...args) => {
//   return fn.call(...args)
// }
// const obj = {
//   message: 'uncurry test'
// }
// const unCurryShowMessage = unCurry(Toast.prototype.showMessage)
// unCurryShowMessage(obj)
Function.prototype.unCurry = function() {
  return this.call.bind(this)
}
const push = Array.prototype.push.unCurry()
// const test = { foo: 'lucas' }
// push(test, 'messi', 'ronaldo', 'neymar')
// console.log(test)
function unCurry(fn) {
  return function () {
    let obj = [].shift.call(arguments)
    return fn.apply(obj, arguments)
  }
}
console.log(unCurry(Array.prototype.push)([], 1))
