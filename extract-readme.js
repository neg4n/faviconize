const fs = require('fs')
const path = require('path')

const packagesPaths = fs
  .readdirSync(path.join(__dirname, 'packages'))
  .filter((package) => !package.startsWith('.'))
  .map((package) => path.join(__dirname, 'packages', package))

for (const packagePath of packagesPaths) {
  fs.copyFileSync(path.join(__dirname, 'README.md'), path.join(packagePath, 'README.md'))
}
