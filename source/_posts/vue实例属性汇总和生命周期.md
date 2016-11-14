---
title: vue实例属性汇总和生命周期
date: 2016-10-12 15:20:42
tags: [vue]
---


>做了个仿cnode的spa项目，用vue-cli搭了项目，用到了cnode的api和vue-router. [项目地址>>](https://github.com/WangYang-Rex/learn-vue)

看了很多遍vue和vue-router的文档，这里记录下

<!--more-->

## Vue实例属性汇总
```
export default {
	init () {
		console.log('init');
	},
	created () {
		console.log('created');
	},
	beforeCompile () {
		console.log('beforeCompile');
	},
	compile () {
		console.log('compile');
	},
	ready () {
		console.log('ready');
	},
	attached () {
		console.log('attached');
	},
	detached () {
		console.log('detached');
	},
	beforeDestory () {
		console.log('beforeDestory');
	},
	destory () {
		console.log('destory');
	},
	components: {
	    mainHeader,
	    list
	},
	//vuex
	//store,
	vuex: {
		actions: {

		}
	},
	data () {
		// 数据对象
      	return {

      	}
    },
	props: {
		// 父组件数据
	},
	computed: {
		// 实例计算属性
	},
	watch: {
	    //'page': function (val, oldVal) {
		//	console.log('new: %s, old: %s', val, oldVal)
		//},
	},
	methods: {
	    // 可直接调用的函数
	},
	events: {

	},
	// 路由生命周期
	route: {
		activate (transition) {
			// 路由启用，比data先
			console.log('activate');
			transition.next();
		},

		data (transition) {
			// 数据处理，路由改变会触发
			console.log('data');
		},

		deactivate (transition) {
			// 路由停用
			console.log('deactivate');
		}
	}
}
```

### 生命周期
![](/images/page/vue/1.jpg)

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="http://music.163.com/outchain/player?type=2&id=1206879&auto=1&height=66"></iframe>



