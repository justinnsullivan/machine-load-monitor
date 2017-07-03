const express = require('express')
const path = require('path')
const webpack = require('webpack')
const logger = require('../build/lib/logger')
const webpackConfig = require('../build/webpack.config')
const project = require('../project.config')
const compress = require('compression')
const exec = require('child_process').exec
const execute = (command, callback) => {
  exec(command, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => { callback(error, stdout) })
}
const app = express()
app.use(compress())

const parseTopData = (data) => {
  const procRaw = data[0].replace('Processes: ', '').split(', ')
  const generatedAt = data[1]
  const load = parseFloat(data[2].replace('Load Avg: ', '').split(', ')[0])
  const cpuRaw = data[3].replace('CPU usage: ', '').split(', ')
  var processes = []
  var cpu = []
  for (var i = 0; i < procRaw.length; i++) {
    var temp = procRaw[i].split(' ')
    processes.push({ type: temp[1], value: parseFloat(temp[0].replace('%', '')) })
  }
  for (i = 0; i < cpuRaw.length; i++) {
    temp = cpuRaw[i].split(' ')
    cpu.push({ type: temp[1], percent: parseFloat(temp[0].replace('%', '')) })
  }
  return { load, processes, cpu, generatedAt }
}

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
const compiler = webpack(webpackConfig)

logger.info('Enabling webpack development and HMR middleware')
app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  contentBase: path.resolve(project.basePath, project.srcDir),
  hot: true,
  quiet: false,
  noInfo: false,
  lazy: false,
  stats: 'normal',
}))
app.use(require('webpack-hot-middleware')(compiler, {
  path: '/__webpack_hmr'
}))

app.use(express.static(path.resolve(project.basePath, 'public')))

// Lightwieght server call to get top (more in depth uptime) data from
// the shell
app.use('/top', function (req, res, next) {
  execute('top -l 1', function (err, stdout, stderr) {
    if (err) {
      console.log(err)
      res.send(JSON.stringify(err))
      return err
    }
    var arr = stdout.split('\n')
    var result = parseTopData(arr)
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(result))
    res.end()
  })
})

app.use('*', function (req, res, next) {
  const filename = path.join(compiler.outputPath, 'index.html')
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err)
    }
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
})
if (project.env !== 'development') {
  app.use(express.static(path.resolve(project.basePath, project.outDir)))
}

module.exports = app
