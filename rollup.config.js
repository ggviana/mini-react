import alias from 'rollup-plugin-alias'
import copy from 'rollup-plugin-copy'
import serve from 'rollup-plugin-serve'
import path from 'path'

const pkg = require('./package.json')

export default {
  input: 'lib/index.js',
  output: [
    {
      file: pkg.main,
      name: 'MiniReact',
      format: 'iife',
      sourcemap: true
    }
  ],
  plugins: [
    alias({
      'util': path.resolve(__dirname, './lib/util')
    }),
    copy({
      'public/index.html':   'solution/index.html',
      'public/App.js':       'solution/js/App.js',
      verbose: true
    }),
    serve({
      open: true,
      contentBase: 'solution',
      port: 8080
    })
  ]
}
