(function (modules) {
  const require = id => {
    const { factory, map } = modules[id]
    const localRequire = requireDeclarationName => require(map[requireDeclarationName])
    const module = { exports: {} }
    factory(module.exports, localRequire)
    return module.exports
  }
  require(0)

})({
  0: {
    factory: (exports, require) => {
      'use strict'

      var _square = _interopRequireDefault(require('./square'))

      var _circle = _interopRequireDefault(require('./circle'))

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { 'default': obj }
      }

      console.log('Area of square: ', (0, _square['default'])(5))
      console.log('Area of circle', (0, _circle['default'])(5))
    },
    map: { './square': 1, './circle': 2 }
  },
  1: {
    factory: (exports, require) => {
      'use strict'

      Object.defineProperty(exports, '__esModule', {
        value: true
      })
      exports['default'] = area

      function area(side) {
        return side * side
      }
    },
    map: {}
  },
  2: {
    factory: (exports, require) => {
      'use strict'

      Object.defineProperty(exports, '__esModule', {
        value: true
      })
      exports['default'] = area
      var PI = 3.141

      function area(radius) {
        return PI * radius * radius
      }
    },
    map: {}
  }
})
