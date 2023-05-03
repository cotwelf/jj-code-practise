var fs = require('fs')
var Spritesmith = require('spritesmith')
const tinify = require('tinify')

const arg = process.argv
tinify.key = 'yD405Rj5wZZQmzyG2dRVmj6H94lQLtnQ'
const filedir = arg[2]
const spriteName = filedir.split('/').pop()
let tinyFinished = false
// 获取目录下所有文件
let filenames = ''
try {
  filenames = fs.readdirSync(filedir)

  filenames = filenames.filter(i => !!i.match(/^[0-9].*.(png|jpg|jpeg)$/))
  filenames.forEach((file) => {
    const dir = `${filedir}/${file}`
    // tiny compress
    tinify.fromFile(dir).toFile(dir)
  })
  tinyFinished = true

  // Generate spritesheet
  const src = filenames.map((f) => {
    return `${__dirname}/${filedir}/${f}`
  }).sort((a, b) => {
    return a.replace(/[^\d]/g, "") - b.replace(/[^\d]/g, "")
  })
  Spritesmith.run({
    src,
    algorithm: 'top-down'
  }, function handleResult (err, result) {
    if (err) {
      throw err
    }
    fs.writeFileSync(`${__dirname}/${filedir}/${spriteName}.png`, result.image)
    result.coordinates, result.properties; // Coordinates and properties
  })
} catch {
  if (!tinyFinished) {
    tinify.fromFile(filedir).toFile(filedir)
  }
}
