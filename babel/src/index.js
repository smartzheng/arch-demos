const babel = require('babel-core')
const result = babel.transform('const fun = (n) => n * n;', { presets: ['es2015'] })
console.log(result.code)
