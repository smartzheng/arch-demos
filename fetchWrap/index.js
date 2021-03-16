// 接受第一个参数为基础 Fetch，第二个参数为中间件数组或单个中间件
module.exports = function fetchWrap(fetch, middleware) {
  // 没有使用中间件，则返回原生 fetch
  if (!middleware || middleware.length < 1) {
    return fetch
  }

  // 递归调用 extend 方法，每次递归时剔除出 middleware 数组中的首项
  var innerFetch = middleware.length === 1 ? fetch : fetchWrap(fetch, middleware.slice(1)) // middleware: [f1,f2,f3]=>[f2,f3]=>[f3]

  var next = middleware[0]

  return function extendedFetch(url, options) {
    try {
      // 每一个 Fetch 中间件通过 Promise 来串联
      return Promise.resolve(next(url, options || {}, innerFetch))
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
// function extendedFetch(url, options) {
//   try {
//     // 每一个 Fetch 中间件通过 Promise 来串联
//     return Promise.resolve(f3(url, options || {}, fetch))
//   } catch (err) {
//     return Promise.reject(err)
//   }
// }
//
// f2(url, options || {},f3(url, options || {}, fetch))
