var fs = require('fs'),
	childProcess = require('child_process'),
	url = require('url'),
	querystring = require('querystring'),
	path = require('path'),
	baseNjsonPath,
	baseTimeout;

/**
 * 返回一个对象
 * @param {Number} port			端口号
 * @param {String} bMockPath			默认的mock地址
 * @param {Number} bTimeout			默认的延时时间
 * @return {Function} function	返回一个函数
 * @return {Object} function.request				请求的对象
 * @return {Object} function.response			执行操作的对象
 */
module.exports = function(port, bMockPath, bTimeout) {
	var regLocationHost = RegExp('^(.*)(localhost|127\.0\.0\.1)\:' + port + '\/'),
		regResplaceSearchs = /(\?(.*)$)/;
	baseNjsonPath = bMockPath || '';
	baseTimeout = bTimeout || 20000;
	return function(request, response) {
		var reqUrl = request.url,
			isGet = request.method === 'GET',
			trunk = '',
			paramsGet = url.parse(reqUrl, true).query,
			paramsPost;
		var originPath = reqUrl.replace(regLocationHost, ''),
			originFileName = reqUrl.slice(reqUrl.lastIndexOf('/') + 1, url.length);
		request.addListener('data', function(d) {trunk += d;});
		request.addListener('end', function() {
			paramsPost = querystring.parse(trunk);
			// 去掉 ? 后的内容, 只需要纯净的内容
			originPath = originPath.replace(regResplaceSearchs, '');
			originFileName = originFileName.replace(regResplaceSearchs, '');
			//console.log('fileName: ' + originFileName);
			if (/^(.*)\.(html|js|css|png|jpg|txt|gif)$/.test(originFileName)) {
				fsStaticFiles(request, response, originPath, originFileName);
			} else if (/^(.*)\.(rjson|do|act)$/.test(originFileName)) {
				// 动态文件, do|act|rjson 需要我们做代理的. 
			} else if (/^(.*)\.njson$/.test(originFileName)) {
				//njson 是给我们自己的模块用的
				callNjsonMethod(request, response, 'json', paramsGet, paramsPost, originFileName);
			} else if (/^(.*)\.jsonp$/.test(originFileName)) {
				//console.log('jsonp: ' + originFileName);
				callNjsonMethod(request, response, 'jsonp', paramsGet, paramsPost, originFileName);
			} else if (/^(.*)\.(java|php)$/.test(originFileName)) {
				// 这个我们是需要做跳转的. 临时读取跳转需求即可. 不想要重新启动了.
				// 做映射然后跳转即可. 规则可以由我们自己在配置里去设定
			} else {
				//console.log('none:' + originFileName);
				// 其他
				response.writeHead(404);
				response.write('没有找到您想要的内容');
				response.end();
			}
		});
	};
};

/**
 * 获得一个相对当前的文件地址 
 * @param {String} originPath					原始传递过来的路径
 * @param {String} originFileName			原始获得的文件名
 * @return {String} realPath						返回的地址
 */
function getFilePath(originPath, originFileName) {
	var realUrlFs, pathString = originPath;
	if (realUrlFs = pathString.match(/\//g)) {
		pathString = pathString.replace(/^\//, '');
		if (realUrlFs.length === 1) {
			return pathString;
		} else {
			return (fs.existsSync(pathString) ? './' : Array(realUrlFs.length + 1).join('../')) + pathString;
		}
	} else {
		return pathString;
	}
}

// 默认的自带的允许跨域传递的头文件
var defaultAcrhs = ['accept', 'Origin', 'No-Cache', 'X-Requested-With', 'If-Modified-Since', 'Pragma', 'Last-Modified', 'Cache-Control', 'Expires', 'Content-Type', 'X-E4M-With'];

/**
 * 获得当前所需要的请求头内容
 * @param {String} acrhs					来自 access-control-request-headers 的内容
 * @return {String} nAcrhs					返回一个新的允许被访问的内容描叙
 */
function getCurAcrhs(acrhs) {
	if (!acrhs) {
		return '';
	}
	var i = 0, nAcrhs = [], oAcrhs = acrhs.split(',');
	oAcrhs.forEach(function(it, i) {
		it = it.replace(/^\s|\s$/g, '');
		var find;
		defaultAcrhs.forEach(function(he) {
			if (he.toLowerCase() === it.toLowerCase()) {
				find = true;
				return;
			}
		});
		if (!find) {
			nAcrhs.push(it);
		}
	});
	return nAcrhs.join(',');
}

/**
 * 
 * 调用我们本地的json 的处理方式
 * @param {Object} request
 * @param {Object} response						
 * @param {Object} paramsGet						对方的get 请求的内容
 * @param {Object} paramsPost					对方的post 请求的内容
 * @return {String} originFileName						返回的地址
 */
function callNjsonMethod(request, response, utype, paramsGet, paramsPost, originFileName) {
	var fork = childProcess.fork('server_fork.js'),
		handler = resTimeout(response, function() {
			fork.kill();
		}),
		acrhs = getCurAcrhs(request.headers['access-control-request-headers']);
	fork.on('message', function(data) {
		clearTimeout(handler);
		switch(data.status) {
			case 'error':
				response.writeHeader(404, {
					'Content-Type': 'text/plain;charset=utf-8',
					'Access-Control-Allow-Origin': '*'
				});
				break;
			case 'loaded':
				response.writeHeader(200, {
					'Content-Type': (/^jsonp$/.test(originFileName) ? 'application/x-javascript' : 'text/plain' ) + ';charset=utf-8',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': acrhs || 'X-Requested-With, Content-Type'
				});
				break;	
		}
		response.write(data.content);
		response.end();
	});
	fork.send({
		utype: utype,
		basePath: baseNjsonPath,
		fileName: originFileName.replace(/\.(njson|jsonp)/, ''),
		paramsGet: paramsGet,
		paramsPost: paramsPost
	});
}



/**
 * 读取静态的文件
 * @param {Object} request
 * @param {Object} response
 * @param {String} originPath
 * @param {String} originFileName
 */
function fsStaticFiles(request, response, originPath, originFileName) {
	var handler = resTimeout(response),
		headers = request.headers,
		acrhs = getCurAcrhs(request.headers['access-control-request-headers']);
	fs.readFile(getFilePath(originPath, originFileName), function(err, data) {
		clearTimeout(handler);
		if (err) {
			response.writeHead(404);
			response.write('文件读取出错: \n' + originFileName + '\n' + originPath + '\n该文件不存在');
		} else {
			response.writeHead(200, {
				'Content-Type': (/html/.test(originFileName) ? 'text/html' :
											/js/.test(originFileName) ? 'application/x-javascript' :
												/css/.test(originFileName) ? 'text/css' :
													/png/.test(originFileName) ? 'image/png' :
														/jpg/.test(originFileName) ? 'image/jpeg' :
															/gif/.test(originFileName) ? 'image/gif' : 'text/plain') + ';charset=utf-8',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': acrhs || 'X-Requested-With, Content-Type'
			});
			response.write(data);
		}
		response.end();
	});
}

/**
 * 超时之后的操作
 * @param {Object} res
 * @param {Function} callback
 */
function resTimeout(res, callback) {
	return setTimeout(function() {
		callback && callback(res);
		res.writeHead(200);
		res.write('请求超时了');
		res.end();
	}, baseTimeout);
}
