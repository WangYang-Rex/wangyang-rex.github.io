/*
 * lazyload
 * @author Wangyang
 * @datetime 2016-06-29 15:00:00
 */
function Lazyload(opts) {
	var self = this;

	var _config = {
		tag: "data-src",
		distance:0,
		placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
	},
	opts = opts || {};

	this.config = $.extend(_config, opts);
	this.config.container = opts.container?opts.container: document;

	this.elements = $(this.config.container).find('['+this.config.tag+']');
	this.elements.attr('src',this.config.placeholder);

	this._findElementInScreen = function _findElementInScreen(){
		if(!this.elements.length) return;
		var self = this;

		var W = window.innerWidth || document.documentElement.clientWidth;
	    var H = window.innerHeight || document.documentElement.clientHeight;
	    var scrollTop = $(this.config.container).scrollTop();

		var _arr = [];

		self.elements.each(function(index,value){
			var rect = $(this)[0].getBoundingClientRect();
			if( (rect.top+rect.height) >= self.config.distance && rect.top<= H && (rect.left+rect.width)>=0 && rect.left<=W  ){
				_arr.push(index)
				var _src = $(this).attr(self.config.tag);
				$(this).attr('src',_src);
			}
		})

		for (var i = _arr.length - 1; i >= 0; i--) {
			self.elements.splice(_arr[i], 1);
		}
	}

	this.init = function(){
		var self = this;
		self._findElementInScreen();

		var timer;
		$(self.config.container).scroll(function() {
			if(!self.elements.length) return;
			console.log(123)
			self._findElementInScreen();
		});
		$(window).on("resize", function(){
			if(!self.elements.length) return;
		  	timer && clearTimeout(timer);
		  	self._findElementInScreen();
		});
	};


	this.init();
};
