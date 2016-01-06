[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]
[![Bountysource](https://www.bountysource.com/badge/tracker?tracker_id=282608)](https://www.bountysource.com/trackers/282608-eslint?utm_source=282608&utm_medium=shield&utm_campaign=TRACKER_BADGE)
[![Join the chat at https://gitter.im/eslint/eslint](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/eslint/eslint?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# ESLint

[网址](http://eslint.org) | [配置](http://eslint.org/docs/user-guide/configuring) | [Rules](http://eslint.org/docs/rules/) | [贡献者](http://eslint.org/docs/developer-guide/contributing) | [Twitter](https://twitter.com/geteslint) | [Mailing List](https://groups.google.com/group/eslint)

ESLint是 ECMAScript/JavaScript 代码中识别和报告特征的工具。很多场合，类似JSLint和JSHint，除了少许区别。
* ESLint 采用 [Espree](https://github.com/eslint/espree) 作为 JavaScript 解析器.
* ESLint 采用 AST 评估代码的特征
* ESLint是完全可配置的，所有单一的规则都是一个插件，你可以实时添加。

## 安装

采用 npm 安装:

    npm install -g eslint

## 用法

如果你第一次使用，采用 `--init` 命令创建配置文件:

    eslint --init

然后，你可以在任何JavaScript文件上运行eslint:

    eslint test.js test2.js

## 配置

运行`eslint --init`后, 你会得到 `.eslintrc` 文件. 打开，你可以看到配置规则如下:

```json
{
    "rules": {
        "semi": [2, "always"],
        "quotes": [2, "double"]
    }
}
```

 `"semi"` 和 `"quotes"` 是ESLint中[rules](http://eslint.org/docs/rules)规则之一. 数字含义如下：

* `0` - 设规则无效
* `1` - 设规则为警告 (doesn't affect exit code)
* `2` - 设规则为错误 (exit code will be 1)

更多可查看配置文件 [configuration docs](http://eslint.org/docs/user-guide/configuring)).

## 发起者

*  [Box](https://box.com)

## 团队

这些分支让项目保持活力:

* Nicholas C. Zakas ([@nzakas](https://github.com/nzakas)) - project lead
* Ilya Volodin ([@ilyavolodin](https://github.com/ilyavolodin)) - reviewer
* Brandon Mills ([@btmills](https://github.com/btmills)) - reviewer
* Gyandeep Singh ([@gyandeeps](https://github.com/gyandeeps)) - reviewer
* Mathias Schreck ([@lo1tuma](https://github.com/lo1tuma)) - committer
* Jamund Ferguson ([@xjamundx](https://github.com/xjamundx)) - committer
* Ian VanSchooten ([@ianvs](https://github.com/ianvs)) - committer
* Toru Nagashima ([@mysticatea](https://github.com/mysticatea)) - committer
* Burak Yiğit Kaya ([@byk](https://github.com/byk)) - committer
* Alberto Rodríguez ([@alberto](https://github.com/alberto)) - committer

## 发布

我们计划每两周发布一次.

## 常见问题

### 为什么你不喜欢 JSHint???

我确实喜欢 JSHint. 我新号 Anton and Rick. 它们是创建这个工具的重要因素. 事实上我非常需要一个适合JavaScript，可配置的代码校验工具.我希望JSHint可以做到，但和Anton谈完之后，我发现它不能达成我的目标。

### 我没有放弃 JSHint。

这不是个问题,我还是提一下. 我并非像证明 ESLint 优于 JSHint. 据我所知，ESLint 优于 JSHint仅是因为这是我做的。 In the off chance you're doing something similar, it might be better for you. 否则, 请使用JSHint, 我肯定没有让你不使用它.

### 与JSHint 和 JSCS 相比，ESLint的表现?

ESLint 慢于 JSHint, 在一个文件中通常慢2-3倍 . 这是因为ESLint在评估你代码之前，采用Espree构造AST，而JSHint默认你的代码已经解析过了。速度取决于你创建的规则数目，规则越多，速度越慢。

尽管慢了，我们相信ESLint的速度仍然不会造成大的伤害。
ESLint 比 JSCS 快, 因为 ESLint 采用单层遍历分析， 而 JSCS 采用查询模式.

如果你同时使用JSHint和JSCS，请仅仅使用ESLint，这会更快。
###  ESLint 仅仅是代码校验，还是支持格式校验 ?

ESLint 支持 传统的校验 (查找错误特征) ，同时支持样式检查 (enforcement of conventions). 你可以都使用。

###  ECMAScript 6 是否支持?

ESLint 全面支持 ECMAScript 6. 默认，是不支持的. 你可以通过配置设定 [配置](http://eslint.org/docs/user-guide/configuring).

###  ESLint 是否支持 JSX?

是的, ESLint 天然 支持 解析 JSX syntax (必须在配置中设定 [配置](http://eslint.org/docs/user-guide/configuring).). 需要注意的是，支持 JSX syntax *is not* 和支持 React不完全一样. React 使用了特殊的 JSX 语法， ESLint 不能识别. 如果你使用React，我们推荐使用 [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react) 

### ECMAScript 7/2016 ?

ESLint 不支持实验性的 ECMAScript 语言特征. 你可以使用 [babel-eslint](https://github.com/babel/babel-eslint) .

### 哪里可以获取帮助?

加入我们 [Mailing List](https://groups.google.com/group/eslint) or [Chatroom](https://gitter.im/eslint/eslint)


[npm-image]: https://img.shields.io/npm/v/eslint.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/eslint
[travis-image]: https://img.shields.io/travis/eslint/eslint/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/eslint/eslint
[coveralls-image]: https://img.shields.io/coveralls/eslint/eslint/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/eslint/eslint?branch=master
[downloads-image]: https://img.shields.io/npm/dm/eslint.svg?style=flat-square
[downloads-url]: https://www.npmjs.com/package/eslint
