const postcss = require('postcss')

const defaults = {
  function: 'cc',
  groups: {},
  colors: {},
  useCustomProperties: false,
  darkThemeSelector: 'html[data-theme="dark"]',
  nestingPlugin: null
}

const resolveColor = (options, theme, group, defaultValue) => {
  const [lightColor, darkColor] = options.groups[group] || []
  const color = theme === 'dark' ? darkColor : lightColor
  if (!color) {
    return defaultValue
  }
  if (options.useCustomProperties) {
    return color.startsWith('--') ? `var(${color})` : `var(--${color})`
  }
  return options.colors[color] || defaultValue
}

module.exports = options => {
  options = Object.assign({}, defaults, options)
  // 获取色值函数（默认为 cc()）
  const reGroup = new RegExp(`\\b${options.function}\\(([^)]+)\\)`, 'g')
  return {
    postcssPlugin: 'postcss-theme-colors',
    Once(style, { result }) {
      // 判断 PostCSS 工作流程中，是否使用了某些 plugins
      const hasPlugin = name =>
        name.replace(/^postcss-/, '') === options.nestingPlugin ||
        result.processor.plugins.some(p => p.postcssPlugin === name)
      // 获取最终 CSS 值
      const getValue = (value, theme) => {
        return value.replace(reGroup, (match, group) => {
          return resolveColor(options, theme, group, match)
        })
      }

      // 遍历 CSS 声明
      style.walkDecls(decl => {
        const value = decl.value
        // 如果不含有色值函数调用，则提前退出
        if (!value || !reGroup.test(value)) {
          return
        }
        const lightValue = getValue(value, 'light')
        const darkValue = getValue(value, 'dark')
        const darkDecl = decl.clone({ value: darkValue })
        let darkRule
        // 使用插件，生成 dark 样式
        if (hasPlugin('postcss-nesting')) {
          darkRule = postcss.atRule({
            name: 'nest',
            params: `${options.darkThemeSelector} &`,
          })
        } else if (hasPlugin('postcss-nested')) {
          darkRule = postcss.rule({
            selector: `${options.darkThemeSelector} &`,
          })
        } else {
          decl.warn(result, `Plugin(postcss-nesting or postcss-nested) not found`)
        }

        // 添加 dark 样式到目标 HTML 节点中
        if (darkRule) {
          darkRule.append(darkDecl)
          decl.after(darkRule)
        }
        const lightDecl = decl.clone({ value: lightValue })
        decl.replaceWith(lightDecl)
      })
    }
  }
}
module.exports.postcss = true
