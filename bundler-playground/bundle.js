(function (modules) {
  const require = id => {
    const { factory, map } = modules[id]
    const localRequire = requireDeclarationName => require(map[requireDeclarationName])
    const module = { exports: {} }
    factory(module.exports, localRequire)
    return module.exports
  }
  console.log(require(0)) // 加载入口

})({
  0: {
    factory: (exports, require) => {
      'use strict'

      Object.defineProperty(exports, '__esModule', {
        value: true
      })
      exports['default'] = void 0

      var _square = _interopRequireDefault(require('./square'))

      var _circle = _interopRequireDefault(require('./circle'))

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { 'default': obj }
      }

      console.log('Area of square: ', (0, _square['default'])(5))
      console.log('Area of circle', (0, _circle['default'])(5))

      var _default = function _default() {
      }

      exports['default'] = _default
    },
    map: { './square': 1, './circle': 2 }
  }, 1: {
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
  }, 2: {
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
}) // 转换为'{id1:module1, id2: module2}', module内部为{factory, map}, 作为iife的入参
