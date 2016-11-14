---
title: 如何优雅的使用Sublime Text
date: 2016-08-18 09:41:08
tags: [sublime text]
---

<strong>工欲善其事，必先利其器！</strong>
Sublime Text：一款具有代码高亮、语法提示、自
动完成且反应快速的编辑器软件，不仅具有华丽的界面，还支持插件扩展机制，用她来写代码，绝对是一种享受。

## **Sublime Text 3安装插件**

Sublime Text的强大就是她拥有强大的课可扩展性。您可根据自己的需要安装不同的插件；这使得她变的无比强大的同时又不失轻便。
```
安装Sublime text 3插件很方便
打开Package Control：菜单->Perferences->Package Control 或者 ctrl+shift+p
选择install Package,然后选择要安装的插件即可
```
<img src="/images/page/sublimetext/1.jpg">
<!--more-->

PS：国内使用SublimeText3，经常可能遇到无法安装可用插件问题，可remove掉<b>Package Control</b>重新安装下；如遇到连Package Control也无法安装，则可以在别处拷贝一份关于Package Control的文件－(Package Control.sublime-package)存放于<code>Installed Packages</code>目录之下即可。


## **Sublime Text 3插件推荐**

无插件，不神器！根据自己的需要定制属于自己的强大插件集；下面是一些常用的推荐。

<a href="http://www.jianshu.com/p/5905f927d01b" target="_blank" rel="external">Sublime Text3插件：增强篇</a>

<a href="http://www.open-open.com/news/view/26d731" target="_blank" rel="external">20个强大的SublimeText插件</a>

墙裂推荐以下这么几款插件：

<strong><a href="https://github.com/SublimeText-Markdown/MarkdownEditing" target="_blank" rel="external">MarkDown Editing</a></strong>
SublimeText不仅仅是能够查看和编辑 Markdown 文件，但它会视它们为格式很糟糕的纯文本。这个插件通过适当的颜色高亮和其它功能来更好地完成这些任务。

<strong><a href="https://github.com/titoBouzout/SideBarFolders" target="_blank" rel="external">SideBarFolders</a></strong>
打开的文件夹都太多了? 来用这个来管理文件夹，世界原来也可以这么美好。
<img src="/images/page/sublimetext/2.jpg">

<strong><a href="http://wbond.net/sublime_packages/terminal" target="_blank" rel="external">Sublime Terminal</a></strong>
这个插件可以让你在Sublime中直接使用终端打开你的项目文件夹，并支持使用快捷键。

<strong><a href="https://github.com/SublimeLinter" target="_blank" rel="external">SublimeLinter插件</a></strong>
SublimeLinter 是前端编码利器——`Sublime Text` 的一款插件，用于高亮提示用户编写的代码中存在的不规范和错误的写法，支持 JavaScript、CSS、HTML、Java、PHP、Python、Ruby 等十多种开发语言。这篇文章介绍如何在 Windows 中配置 SublimeLinter 进行 JS & CSS 校验。
比如写例如像lua这样的弱语言脚本代码，有这个可以规避掉很多不该有的低级错误吧？当然这也需要你SublimeLinter安装完毕之后再安装一个`SublimeLinter-lua`即可。具体的使用可以参见：
<a href="http://www.cnblogs.com/lhb25/archive/2013/05/02/sublimelinter-for-js-css-coding.html" target="_blank" rel="external">借助 SublimeLinter 编写高质量的 JavaScript &amp; CSS 代码</a>

<strong><a href="https://github.com/victorporof/Sublime-HTMLPrettify" target="_blank" rel="external">HTML-CSS-JS Prettify</a></strong>
一款集成了格式化（美化）html、css、js三种文件类型的插件，即便html,js写在PHP文件之内。插件依赖于nodejs，因此需要事先安装nodejs，然后才可以正常运行。插件安装完成后，快捷键ctrl+shift+H完成当前文件的美化操作。插件对html、css文件的美化不是非常满意，但还可以，后面将说明如何修改css美化脚本。本人用起来超级爽的，鉴于篇幅，就不赘述，可以参见
<a href="http://frontenddev.org/article/sublime-does-text-three-plug-ins-html-and-css-js-prettify.html" target="_blank" rel="external">这篇</a>

<p><strong><a href="https://github.com/csscomb/CSScomb-for-Sublime" target="_blank" rel="external">CSScomb CSS属性排序</a>:</strong>有时候看看自己写的CSS文件，会不会觉得属性很乱查找不易维护难？CSScomb可以按照一定的CSS属性排序规则，将杂乱无章的CSS属性进行重新排序。选中要排序的CSS代码，按Ctrl+Shift+C，即可对CSS属性重新排序了，代码从此简洁有序易维护，如果不款选代码则插件将排序文件中所有的CSS属性。当然，可以自己自定义CSS属性排序规则，打开插件目录里的CSScomb.sublime-settings文件，更改里面的CSS属性顺序就行了。因为这个插件使用PHP写的，要使他工作需要在环境变量中添加PHP的路径，具体请看github上的说明。</p>

<p>剩下些许其他的可以按需安装的插件，比如：</p>
<ul>
<li><strong>ConvertToUTF8</strong>  支持 GBK, BIG5, EUC-KR, EUC-JP, Shift_JIS 等编码的插件</li>
<li><strong>Bracket Highlighter</strong> 用于匹配括号，引号和html标签。对于很长的代码很有用。安装好之后，不需要设置插件会自动生效</li>
<li><strong>DocBlockr</strong> 可以自动生成PHPDoc风格的注释。它支持的语言有Javascript, PHP, ActionScript, CoffeeScript, Java, Objective C, C, C++</li>
<li><strong><font color="purple">Emmet(Zen Coding)</font></strong>快速生成HTML代码段的插件，强大到无与伦比:可以超快速编写HTML/CSS/JS，当然这个插件还支持多种编译环境，如常见的：Eclipse/Aptana、Coda、Notepad++、Adobe Dreamweaver、TextMate等，<strong>web开发必备！！！</strong>。</li>
<li><strong>jsFormat</strong> 格式化js代码，懂者自懂；强迫症Coder必备！默认快捷键Ctrl+Alt+F。</li>
<li><strong>phpFormat</strong> 格式化php代码，懂者自懂；强迫症Coder必备！</li>
<li><strong>CSS Compact Expand CSS属性展开收缩:</strong>写CSS的盆友，喜欢将其写多行还是一行(个人喜欢将其格式化为多行)？如果阅读别人的代码不符合自己的习惯，可以用CSS Compact Expand这个插件将CSS格式化一下，按 Ctrl+Alt+[ 收缩CSS代码为一行显示，按 Ctrl+Alt+] 展开CSS代码为多行显示；强迫症Coder必备！。</li>
<li><strong>Autoprefixer插件</strong>：这是一款CSS3私有前缀自动补全插件；该插件使用CanIUse资料库（当然，SublimeText自然也有<font color="purple">CanIUse</font>这个插件咯），能精准判断哪些属性需要什么前缀，与CssComb插件一样，该插件也需要系统已安装Node.js环境；使用方法：在输入CSS3属性后（冒号前）按Tab键即可。</li>
<li><strong>YUI Compressor</strong>：压缩JS和CSS文件，按F7键后，若压缩当前文件（demo.js），则压缩后的文件（demo.min.js）保存在该文件的同级目录，需要安装java的JDK。使用方法：<a href="http://frontenddev.org/article/sublime-does-text-3-plug-in-yui-compressor.html" target="_blank" rel="external">YUI Compressor</a></li>
<li><strong>ClickableURLs：可点击的URL</strong>使用小插件<a href="https://github.com/leonid-shevtsov/ClickableUrls_SublimeText" target="_blank" rel="external">ClickableURLs</a>可以让文件中的URL能够点击。</li>
<li><strong>终极王道</strong>：自己编写专用的Sublime Text插件。虽然说各个方面比如移动端，Web前段，服务器端，非Coder的Writer所需要的方便已经被集成在了不同的插件中。但譬如，需要快捷打开PC端的某个模拟器，便捷的进行某些校验，只要你想的到的基本都可以将其在插件内，以快捷键处理之。至于如何编写SublimeText插件，请参看这里<a href="http://www.360doc.com/content/15/0417/22/19342630_463999403.shtml" target="_blank" rel="external">编写自己的Sublime Text2 插件</a></li>
</ul>



## **自定义代码片段**
我们在开发中有很多代码是需要重复编写的，每一次都去复制粘贴显然是一件效率极其低下的事情，sublime的自定义代码片段功能就很好的解决了这个问题。下面就来看一下如何在sublime中自定义代码片段
<p>首先在菜单栏选择：Tools -&gt;developer -&gt; New Snippet可以看到新建一个<code>xml</code>类型的描述文件，如下：</p>
```
<snippet>
    <content><![CDATA[
Hello, ${1:this} is a ${2:snippet}.
]]></content>
    <!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
    <!-- <tabTrigger>hello</tabTrigger> -->
    <!-- Optional: Set a scope to limit where the snippet will trigger -->
    <!-- <scope>source.python</scope> -->
</snippet>
```
<p>注释已经非常详细了，<code>content</code> 里面就是代码模版：<code>${序号：默认值}</code> ，序号相同的地方光标会同时停在那可以多处同时编辑。序号大小就是 <code>tabindex</code>。在实际使用代码的时候，可以使用 <code>tab</code> 切换光标位置。</p>
例子：Tatami.module
```
<snippet>
	<content><![CDATA[
/**
 * Created by wangyang on ${1:16/8/1}.
 */
(function (rc) {
  	rc.modules.define({
	    name: '${2:name}',
	    depend: '${3:depend}',
	    viewName: 'view.${2:name}',
	    type: '', //basic/normal/sub
	    ctrlsMap: {},
	    statusMap: {},
	    dataMap: {},
	    methodsMap: {
	    },
	    events: {},
	    activation: function(){},
	    init: function () {
	    },
	    update: function (hashs, isSelf) {

	    },
	    destory: function () {},
	    disabled: function () {}
  	})
})(window.Tatami);
]]></content>
	<!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
	<!-- 可选：快捷键，利用Tab自动补全代码的功能 -->
	<tabTrigger>ttmModule</tabTrigger>
	<!-- Optional: Set a scope to limit where the snippet will trigger -->
	<!-- 可选：使用范围，不填写代表对所有文件有效。附：source.css和test.html分别对应不同文件。 -->
	<scope>source.js</scope>
	<!-- 可选：在snippet菜单中的显示说明（支持中文）。如果不定义，菜单则显示当前文件的文件名。 -->
	<description>Tatami Module</description>
</snippet>

```
结束语：如果你还在一行一行的手动敲代码，是时候改变了

<strong>工欲善其事，必先利其器！</strong>
<strong>工欲善其事，必先利其器！</strong>
<strong>工欲善其事，必先利其器！</strong>


