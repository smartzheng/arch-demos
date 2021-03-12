const postcss = require('postcss')
const fs = require('fs')
const colors = {
  C01: '#eee',
  C02: '#111',
}
const groups = {
  G01: ['C01', 'C02'],
}

const css = `a {
  color: cc(G01);
}`
postcss([
  require('./postcss-theme-colors')({ colors, groups }),
  require('postcss-nested')
]).process(css, { from: 'source.css',to: 'index.css',  map: { inline: false },}).then(res => {
  console.log(res.css)
  fs.writeFileSync('index.css', res.css)
  console.log(res.map)
})
