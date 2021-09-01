const fs = require('fs')
const path = require('path')

const outputDirectory = 'dist/'

const rootDirectory = path.resolve(__dirname, '../../')
const readmePath = path.resolve(rootDirectory, 'README.md')
const readmeDestination = path.join(__dirname, outputDirectory, 'README.md')

fs.copyFileSync(readmePath, readmeDestination)

if (fs.existsSync('.npmignore')) {
  const npmignoreDestination = path.join(rootDirectory, outputDirectory, '.npmignore')
  fs.copyFileSync('.npmignore', npmignoreDestination)
}

let packageJson = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' }))

packageJson.main = 'index.js'
packageJson.types = 'index.d.ts'

if (packageJson.bin) {
  packageJson.bin = 'index.js'
}

packageJson.scripts = {}

const artificialPackageJsonDestination = path.join(__dirname, outputDirectory, 'package.json')
fs.writeFileSync(artificialPackageJsonDestination, JSON.stringify(packageJson))
