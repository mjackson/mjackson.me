const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

const exec = (command) =>
  execSync(command, { stdio: 'inherit' })

const name = process.argv[2]
const baseDir = path.resolve(__dirname, '..', name)

fs.stat(baseDir, (error, stats) => {
  if (error) {
    console.error(error.message)
    process.exit(1)
  }

  exec(`webpack-dev-server --inline --config ${baseDir}/webpack.config.js --content-base ${baseDir}`)
})
