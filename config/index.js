const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

// const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config.yml')))

// module.exports = config

module.exports = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config.yml')))
