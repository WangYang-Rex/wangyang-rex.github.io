---
title: commander.js-node.js 命令行接口的完整解决方案
date: 2017-05-26 09:52:17
tags: [node]
---

# Commander.js

[node.js](http://nodejs.org) 命令行接口的完整解决方案，灵感来自 Ruby 的 commander。
[API 文档](http://tj.github.com/commander.js/) 
本文所有的例子都可以用 `node name.js <command/option>` 执行
吐槽：commander.js中文文档真的好难找哇
<!--more-->

## 安装
```js
$ npm install commander
```

## 参数解析
定义并使用 commander 的选项功能 `.option()` 方法。作为这些选项的文档，下面的例子会解析来自 `progress.argv` 指定的参数和选项，留下剩余未被选择的参数放到 `program.args` 数组中。
```js
#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
  .version('0.0.1')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

console.log('you ordered a pizza with:');
if (program.peppers) console.log('  - peppers');
if (program.pineapple) console.log('  - pineapple');
if (program.bbqSauce) console.log('  - bbq');
console.log('  - %s cheese', program.cheese);
```

短标志可以作为单独的参数传递。像 `-abc` 等于 `-a -b -c`。多词组成的选项，像“--template-engine”会变成 `program.templateEngine` 等。

## 强制多态
```js
function range(val) {
  return val.split('..').map(Number);
}

function list(val) {
  return val.split(',');
}

function collect(val, memo) {
  memo.push(val);
  return memo;
}

function increaseVerbosity(v, total) {
  return total + 1;
}

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-i, --integer <n>', 'An integer argument', parseInt)
  .option('-f, --float <n>', 'A float argument', parseFloat)
  .option('-r, --range <a>..<b>', 'A range', range)
  .option('-l, --list <items>', 'A list', list)
  .option('-o, --optional [value]', 'An optional value')
  .option('-c, --collect [value]', 'A repeatable value', collect, [])
  .option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
  .parse(process.argv);

console.log(' int: %j', program.integer);
console.log(' float: %j', program.float);
console.log(' optional: %j', program.optional);
program.range = program.range || [];
console.log(' range: %j..%j', program.range[0], program.range[1]);
console.log(' list: %j', program.list);
console.log(' collect: %j', program.collect);
console.log(' verbosity: %j', program.verbose);
console.log(' args: %j', program.args);
```

## 正则表达式
```js
program
  .version('0.0.1')
  .option('-s --size <size>', 'Pizza size', /^(large|medium|small)$/i, 'medium')
  .option('-d --drink [drink]', 'Drink', /^(coke|pepsi|izze)$/i)
  .parse(process.argv);
  
console.log(' size: %j', program.size);
console.log(' drink: %j', program.drink);
```

## 可变参数
一个命令的最后一个参数可以是可变参数, 并且只能是最后一个参数。为了使参数可变，你需要在参数名后面追加 ...。 下面是个示例：
```js
#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
  .version('0.0.1')
  .command('rmdir <dir> [otherDirs...]')
  .action(function (dir, otherDirs) {
    console.log('rmdir %s', dir);
    if (otherDirs) {
      otherDirs.forEach(function (oDir) {
        console.log('rmdir %s', oDir);
      });
    }
  });

program.parse(process.argv);
```
数组 是可以用于给可变参数传值的。 这适用于 `program.args` 以及参数传递，以你的行动证明上述。 你可以如上所示的去尝试。

## 指定参数的语法
```js
#!/usr/bin/env node

var program = require('../');

program
  .version('0.0.1')
  .arguments('<cmd> [env]')
  .action(function (cmd, env) {
     cmdValue = cmd;
     envValue = env;
  });

program.parse(process.argv);

if (typeof cmdValue === 'undefined') {
   console.error('no command given!');
   process.exit(1);
}
console.log('command:', cmdValue);
console.log('environment:', envValue || "no environment given");
```

## Git 风格的子命令
```js
// file: ./examples/pm
var program = require('..');

program
  .version('0.0.1')
  .command('install [name]', 'install one or more packages')
  .command('search [query]', 'search with optional query')
  .command('list', 'list packages installed', {isDefault: true})
  .parse(process.argv);
```
当说明参数调用 `.command()` 时，没有 `.action(callback)` 应调用来处理子命令，否则会出错。这告诉 `commander`，你要使用单独的可执行文件的子命令，就像 `git(1)` 和其他流行工具一样。 `Commander` 将尝试在入口脚本的目录中搜索可执行文件，（像` ./examples/pm`）与名称 `program-command`，像 `pm-install`，`pm-search`。

对 `.command()` 的调用，可以传递选项。指定 `opts.noHelp` 为 `true` 将从生成的帮助输出中删除选项。如果没有其他子命令指定，指定 `opts.isDefault` 为 `true` 将运行子命令。

如果打算全局`（--global）`安装该命令，请确保可执行文件有适当的模式，如 `'755'`。

### --harmony
您可以启用 `--harmoney` 选项在两个方面：

- 用 #!/usr/bin/env node --harmony 在子命令脚本中。注意一些系统版本不支持此模式。
- 用 --harmoney 选项时调用的命令，像 node --harmony examples/pm publish。--harmoney 选项当产生一个子命令进程时保留选项。

## 自动化帮助信息 --help
帮助信息是 commander 基于你的程序自动生成的，下面是 `--help` 生成的帮助信息：
```js
$ ./examples/pizza --help

   Usage: pizza [options]

   An application for pizzas ordering

   Options:

     -h, --help           output usage information
     -V, --version        output the version number
     -p, --peppers        Add peppers
     -P, --pineapple      Add pineapple
     -b, --bbq            Add bbq sauce
     -c, --cheese <type>  Add the specified type of cheese [marble]
     -C, --no-cheese      You do not want any cheese

```

## 自定义帮助
你可以显示任何 `-h`, `--help` 信息，通过监听 `--help` 。一旦你完成了 Commander 将自动退出，你的程序的其余部分不会展示。例如在下面的 “stuff” 将不会在执行 `--help` 时输出。
```js
#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
  .version('0.0.1')
  .option('-f, --foo', 'enable some foo')
  .option('-b, --bar', 'enable some bar')
  .option('-B, --baz', 'enable some baz');

// must be before .parse() since
// node's emit() is immediate

program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ custom-help --help');
  console.log('    $ custom-help -h');
  console.log('');
});

program.parse(process.argv);

console.log('stuff');
```
下列帮助信息是运行 `node script-name.js -h` or `node script-name.js --help` 时输出的:
```js
Usage: custom-help [options]

Options:

  -h, --help     output usage information
  -V, --version  output the version number
  -f, --foo      enable some foo
  -b, --bar      enable some bar
  -B, --baz      enable some baz

Examples:

  $ custom-help --help
  $ custom-help -h

```

### .outputHelp(cb)
不退出输出帮助信息。 可选的回调可在显示帮助文本后处理。 如果你想显示默认的帮助（例如，如果没有提供命令），你可以使用类似的东西：
```js
var program = require('commander');
var colors = require('colors');

program
  .version('0.0.1')
  .command('getstream [url]', 'get stream URL')
  .parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp(make_red);
  }

function make_red(txt) {
  return colors.red(txt); // 在控制台上显示红色的帮助文本
}
```
### .help(cb)
输出帮助信息并立即退出。 可选的回调可在显示帮助文本后处理。

## 例子
```js
var program = require('commander');

program
  .version('0.0.1')
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-T, --no-tests', 'ignore test hook')

program
  .command('setup [env]')
  .description('run setup commands for all envs')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(env, options){
    var mode = options.setup_mode || "normal";
    env = env || 'all';
    console.log('setup for %s env(s) with %s mode', env, mode);
  });

program
  .command('exec <cmd>')
  .alias('ex')
  .description('execute the given remote cmd')
  .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .action(function(cmd, options){
    console.log('exec "%s" using %s mode', cmd, options.exec_mode);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ deploy exec sequential');
    console.log('    $ deploy exec async');
    console.log();
  });

program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });

program.parse(process.argv);
```
更多的 [演示 ](https://github.com/tj/commander.js/tree/master/examples)可以在这里找到.

参考链接：
[commander.js github项目地址](https://github.com/tj/commander.js)
[commander.js 中文文档](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md)
[commander.js api](http://tj.github.io/commander.js/)
[使用commander.js创建nodejs命令行工具 by zhiyelee](http://zhiye.li/2015-01-15-intro-to-commander.js-zh-cn.html)
[Commander写自己的Nodejs命令](http://blog.fens.me/nodejs-commander/)




