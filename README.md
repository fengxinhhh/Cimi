[![npm](https://img.shields.io/npm/v/cimi.svg)](https://www.npmjs.com/package/cimi)
[![npm](https://img.shields.io/npm/l/cimi.svg)](https://www.npmjs.com/package/cimi)

# Cimi

一款全自动npm发包工具，一行命令帮助你git replase、创建git tag、发布npm包。

Cimi自动生成新版本号，自动生成commit message，创建tag，push到github，最后发布到npm中，整个过程只需要一行命令，解放你的双手！

## 使用示例

![Screenshot](./.github/demo.jpg)

## Cimi有什么优势？

当我们在开发组件库或者其他开源工具包时，我们发一个新的 NPM 包可能需要这些工作：

* 手动修改`package.json`中的`version`.
* `git add .`、`git commit -m "xxxx"`生成一个提交.
* `git push origin master` 推送到远端.
* 在github中打一个新`tag`.
* `npm publish`将代码提交到NPM.

听起来是不是很麻烦？而有了`cimi`，你只需要一行简单的代码:

`cimi patch master`

就可以完成上面所有事情。

## Cimi修改版本规则

`Cimi`共有三种规则，来进行发包，其实也就是确定版本号。

* `cimi patch` 更新一个小版本，如1.1.0 -> 1.1.1，如bug修复;
* `cimi minor` 更新一个中版本，如1.1.0 -> 1.2.0，如新增功能;
* `cimi major` 更新一个大版本，如1.1.0 -> 2.1.0，如重构架构;

而分支默认为`master`，如果主分支为其他分支，应这样使用:

`cimi patch main`
`cimi patch beta`

## 使用

```bash
# 全局安装cimi
npm i cimi -g
# 本地安装cimi
npm i cimi -D
```