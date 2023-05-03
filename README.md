# 一些小练习

## covid-19-snake
基于毕设的一个小点子
需要 phaser 依赖 `<script src="//cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>`
## haru-catch
> [码上掘金月赛 第 2 期](https://juejin.cn/challenge/5)，优秀奖耶撒花~ ✿✿ヽ(°▽°)ノ✿，[戳这里康康](https://code.juejin.cn/pen/7210737432621219873)~
# 一些小工具
## 压缩图片，从上到下生成精灵图
> 依赖：[tinypng](https://tinypng.com/developers/reference/nodejs)、[spritesmith](https://github.com/twolfson/spritesmith)

### `npm run compress --folder=${目录/path to 文件}`

其中 `目录` 是存放即将压缩且制作精灵图的目录，如 `leisure-list/images/starting` 是将该目录下所有以 `数字编号` 的图片 `压缩后升序从上到下生成精灵图`，保存为 `当前目录同名`；

当 folder 参数为 `path to 文件` 时则压缩单个图片，如 `leisure-list/images/starting/0.png`。

注意，压缩行为会覆盖原图片。
