const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser') // AST 解析器
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')
const resolve = require('resolve').sync

let ID = 0

/**
 * 根据文件路径创建module信息对象
 * @param filePath
 * @returns {{code, filePath, deps: [], id: number}}
 */
function createModuleInfo(filePath) {
  // 读取模块源代码
  const content = fs.readFileSync(filePath, 'utf-8')
  // 对源代码进行 AST 产出
  const ast = parser.parse(content, {
    sourceType: 'module'
  })
  // 相关模块依赖数组
  const deps = []
  // 遍历模块 AST，将依赖推入 deps 数组中
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      deps.push(node.source.value)
    }
  })
  const id = ID++
  // 编译为 ES5
  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ['@babel/preset-env']
  })
  return {
    id, // 该模块ID
    filePath, //该模块路径
    deps, //该模块依赖的模块数组
    code //该模块的转换后代码
  }
}

/**
 * 根据入口文件生成项目依赖树
 * @param entry
 * @returns {[]} 项目依赖树
 */
function createDependencyGraph(entry) {
  // 获取入口模块信息
  const entryInfo = createModuleInfo(entry)
  // 项目依赖树
  const graphArr = []
  graphArr.push(entryInfo)
  // 以入口模块为起点，遍历整个项目依赖的模块，并将每个模块信息维护到 graphArr 中
  for (const module of graphArr) {
    module.map = {}
    module.deps.forEach(depPath => {
      const baseDir = path.dirname(module.filePath)
      const moduleDepPath = resolve(depPath, { baseDir })
      const moduleInfo = createModuleInfo(moduleDepPath) // 获取每个依赖的模块信息
      graphArr.push(moduleInfo) // 将每个模块信息推入 graphArr 中
      module.map[depPath] = moduleInfo.id // map 以{depPath: id}形式维护module的依赖
    })
  }
  return graphArr
}

/**
 * 打包生成最终代码
 * 使用 IIFE 的方式，来保证模块变量不会影响到全局作用域。
 * 构造好的项目依赖树（Dependency Graph）数组，将会作为名为modules的行参，传递给 IIFE。
 * 我们构造了require(id)方法，这个方法的意义在于：
 *  通过require(map[requireDeclarationName])方式，按顺序递归调用各个依赖模块；
 *  通过调用factory(module.exports, localRequire)执行模块相关代码；
 *  该方法最终返回module.exports对象，module.exports 最初值为空对象（{exports: {}}），但在一次次调用factory()函数后，module.exports对象内容已经包含了模块对外暴露的内容了。
 * @param graph 依赖树
 * @returns {string} 最终代码iifeBundler
 */
function pack(graph) {
  const moduleArgArr = graph.map(module => {
    return `${module.id}: {
                factory: (exports, require) => {
                    ${module.code}
                },
                map: ${JSON.stringify(module.map)}
            }`
  })

  const iifeBundler = `(function(modules){
            const require = id => {
                const {factory, map} = modules[id];
                const localRequire = requireDeclarationName => require(map[requireDeclarationName]); 
                const module = {exports: {}};
                factory(module.exports, localRequire); 
                return module.exports; 
            }
            require(0); // 加载入口
            
            })({${moduleArgArr.join()}}) // 转换为'{id1:module1, id2: module2}', module内部为{factory, map}, 作为iife的入参
        `
  return iifeBundler
}


let graph = createDependencyGraph('./app.js')
let result = pack(graph)
fs.writeFileSync('./bundle.js', result)
