---
title: 在线调试工具-eruda
date: 2019-07-04 20:30:56
tags: [javascript]
---


```js
function debugInit(type){
  console.log('debugInit')
	var debug = sessionStorage.getItem('debug') || type || false;
	if(location.href && (location.href.includes('debug') || location.href.includes('dingnianhuiapp.superboss.cc'))) {
		debug = true;
		window._debug = true
	}

	if(debug) {
		var script = document.createElement('script'); 
    // script.src="https://dingtalkcdn.superboss.cc/nianhui/front/pc/vconsole.min.js"; 
    script.src="//cdn.bootcss.com/eruda/1.5.2/eruda.min.js"; 
		document.body.appendChild(script); 
		script.onload = function () { 
      // window.vConsole = new VConsole();
      eruda.init();
		}
		sessionStorage.setItem('debug', true);
	}
}
debugInit()
```