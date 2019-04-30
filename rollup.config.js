import alias from 'rollup-plugin-alias'
import copy from 'rollup-plugin-copy'
import serve from 'rollup-plugin-serve'
import path from 'path'

const pkg = require('./package.json')

const inDevelopment = callback => {
  if (process.env.NODE_ENV !== 'production') {
    return callback()
  }
}

export default {
  input: 'lib/index.js',
  output: {
    file: pkg.main,
    name: 'MiniReact',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    alias({
      'util': path.resolve(__dirname, './lib/util')
    }),
    copy({
      targets: {
        'public/index.html': 'solution/index.html',
        'public/styles.css': 'solution/styles.css',
        'public/App.js': 'solution/js/App.js'
      }
    }),
    inDevelopment(() => serve({
      open: true,
      contentBase: 'solution',
      port: 8080
    }))
  ]
}
