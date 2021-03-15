const postcss = require('postcss')
const fs = require('fs')
const colors = {
  C01: '#eee',
  C02: '#111',
}
const groups = {
  G01: ['C01', 'C02'],
  G02: ['C01', 'C02'],
}

const css = fs.readFileSync('source.css')
postcss([
  require('./postcss-theme-colors')({ colors, groups }),
  require('postcss-nested')
]).process(css).then(res => {
  fs.writeFileSync('index.css', res.css)
})
