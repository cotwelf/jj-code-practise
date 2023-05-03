# 一些小练习

## covid-19-snake
基于毕设的一个小点子
需要 phaser 依赖 `<script src="//cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>`
## haru-catch
> [码上掘金月赛 第 2 期](https://juejin.cn/challenge/5)，优秀奖耶撒花~ ✿✿ヽ(°▽°)ノ✿，[戳这里康康](https://code.juejin.cn/pen/7210737432621219873)~
# 一些小工具
## 压缩图片，从上到下生成精灵图
使用场景：procreate 无法导出精灵图以及 apng，只能每张单独导出，需要拼一下，同时原图很大的情况下还需要压缩。这个小工具代替了小熊猫压缩以及 PS 拼精灵图，嗯嗯，不戳~

### `npm run compress --folder=${目录/path to 文件}`

其中 `目录` 是存放即将压缩且制作精灵图的目录，如 `leisure-list/images/starting` 是将该目录下所有以 `数字编号` 的图片 `压缩后升序从上到下生成精灵图`，保存为图片组同目录下的 `sprites.png`；

当 folder 参数为 `path to 文件` 时则压缩单个图片，如 `leisure-list/images/starting/0.png`。

注意，压缩行为会覆盖原图片。
> 依赖：[tinypng](https://tinypng.com/developers/reference/nodejs)、[spritesmith](https://github.com/twolfson/spritesmith)
