
/**
 * 
 * @param {Object} data							接受到的数据
 * @param {String} data.utype					类型, json, jsonp, text
 * @param {String} data.basePath				相对地址
 * @param {String} data.fileName				文件名
 * @param {Object} data.paramsGet			get 的内容
 * @param {Object} data.paramsPost		post 的内容
 */

function onMessage(data) {
	var func;
	if (!data || !data.utype || !data.basePath || !data.fileName) {
		process.send({
			status: 'error',
			content: '参数异常!'
		});
		return;
	}
	try {
		func = require(data.basePath + data.fileName);
	} catch(e) {
		// 模块不存在, 则返回内容
		process.send({
			status: 'error',
			content: 'module not exist'
		});
	}
	if (!func) { return; }
	var paramsGet = data.paramsGet, paramsPost = data.paramsPost,
		content = func(paramsGet, paramsPost);
	if (typeof content === 'object') {
		try {
			content = JSON.stringify(content);
		} catch(e) { content = '';}
	}
	// 设定一个特殊字段: LAZYLOAD, 对应点为时间, 表示延时加载
	if ((paramsGet.LAZYLOAD && /^\d+$/.test(paramsGet.LAZYLOAD))) {
		setTimeout(function(){
			process.send({
				status: 'loaded',
				content: content
			});
		}, paramsGet.LAZYLOAD);
	} else {
		process.send({
			status: 'loaded',
			content: content
		});
	}
}

// 接收来自上级模块的消息
process.on('message', onMessage);
