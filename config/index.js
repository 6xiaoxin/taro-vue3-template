const path = require('path')
const args = process.argv
const isOpenDevTools = args.includes('--devtools')

const config = {
  projectName: '1',
  date: '2022-06-01',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: isOpenDevTools
    ? [
        [
          '@tarojs/plugin-html',
          {
            modifyElements(inline, block) {
              // 行内元素添加 <span>，块级元素删除 <span>
              inline.push('span')
              block.splice(block.indexOf('span'), 1)
            },
          },
        ],
        '@tarojs/plugin-vue-devtools',
        'taro-plugin-pinia',
      ]
    : [
        [
          '@tarojs/plugin-html',
          {
            modifyElements(inline, block) {
              // 行内元素添加 <span>，块级元素删除 <span>
              inline.push('span')
              block.splice(block.indexOf('span'), 1)
            },
          },
        ],
        'taro-plugin-pinia',
      ],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'vue3',
  mini: {
    hot: true,
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
}

module.exports = function(merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
