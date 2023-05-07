var fs = require('fs')
var Spritesmith = require('spritesmith')
const tinify = require('tinify')

const arg = process.argv
tinify.key = 'yD405Rj5wZZQmzyG2dRVmj6H94lQLtnQ'
const filedir = arg[2]
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
    const output = `${__dirname}/${filedir}/sprites.png`
    fs.writeFile(output, result.image, function(err) {
      console.log(String(err), 'err')
      if (String(err) === 'null') {
        // 生成精灵图再压缩一下，不然也有点大 orz
        tinify.fromFile(output).toFile(output)
      }
    })
  })
} catch {
  if (!tinyFinished) {
    tinify.fromFile(filedir).toFile(filedir)
  }
}
