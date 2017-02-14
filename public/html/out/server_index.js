var args = process.argv.slice(2),
	childProcess = require('child_process'),
	selfNodeName = __filename.replace(__dirname + '\\', ''), // 得到当前正在执行的文件名
	port,
	serverList = [],
	slogList = [],
	baseNjsonPath = './mock_ajax/',
	baseTimeout = 600000;

if (args.length) {
	args = args[0].split(','); // 用 "," 来间隔我们所需要制造的内容区间
	if (args.length > 1) {
		//把除了自己外的传递进去
		args.slice(1).forEach(function(it, i) {
			var exec;
			it = it.replace(/^\s+|\s+$/g, '');
			// 只接受2-4位长度的端口号
			if (/^\d{2,4}$/.test(it)) {
				exec = childProcess.exec('node ' + selfNodeName + ' ' + it, function(err) {
					if (err) { console.log(err); return;}
				});
				exec.stdout.on('data', function(msg) {
					console.log(msg);
				});
				// 保存子进程
				serverList.push(exec);
				slogList.push(it);
			}
		});
	}
	port = /^\d{2,4}$/.test(args[0]) ? args[0] : 8080;
} else {
	port = 8080;	
}

var http = require('http'),
	httpMethod = require('./server_httpMethod'),
	server = http.createServer(httpMethod(port, baseNjsonPath, baseTimeout));
server.listen(port);
console.log('static server is running, the port is: ' + port + (slogList.length ? (', and linked server ' + slogList.join(', ')) : ''));

