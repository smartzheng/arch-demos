const babel = require('babel-core');

const result = babel.transform("const fun = (n) => n * n;", {});
console.log(result.code);