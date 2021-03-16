let fetch = require('isomorphic-fetch')
const fetchWrap = require('./index')

const wrapFetch = fetchWrap(fetch, [
  middleware1,
  middleware2,
  middleware3,
])

function middleware1(url, options, innerFetch) {
  console.log('middleware1')
  return innerFetch(url, options)
}

function middleware2(url, options, innerFetch) {
  console.log('middleware2')
  return innerFetch(url, options)
}

function middleware3(url, options, innerFetch) {
  console.log('middleware3')
  return innerFetch(url, options)
}

wrapFetch('http://www.tianqiapi.com/api?version=v9&appid=23035354&appsecret=8YvlPNrz').then(res => {
  return res.json()
}).then(result => {
  console.log(result)
}).catch(err => {
  console.log(err)
})

// Promise.resolve(Promise.resolve(Promise.resolve(2))).then(res => {
//   console.log(res)
// })
