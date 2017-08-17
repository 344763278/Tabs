 /*注意事项:
 第一：构造函数里面，有了this,就不要有var,就是创建全局变量的时候不要用var;
 第二：tabs的核心函数就是传个数字，然后根据数字做事情，
 第三：自动循环函数，如果函数里面套函数，那么就不能拿到构造函数的变量，除非传进去，但是定时器复用是不能加括号的，所以就整个进行prototype，这也是很多错误的原因；
 第四：定时器，鼠标移开的时候，要找到相对应的索引值，然后再重新开启定时器；
 第五：从以上例子可以发现，全局的变量和事件都是在构造函数里面完成，只有有一些操作过程，就用方法来完成的，这也是对象的特点；
 */


(function(){
	window.Tabs = Tabs;
})();

function Tabs(obj, option){

	// 接收传过来的选项
	this.$obj          = $(obj);
	this.option        = option;

	// 默认配置项目
	this.config = { 
		triggerType    : 'click',
		effect         : 'slider',
		auto           : false,
		invoke         : 2,
		speed          : 500,
		callback       : null
	};

	// 合并选项，如果有的话
	this.getConfig();
	

	// 选取元素
	// 不能用var来定义里面大对象的变量,否则报token this
	this.$inputItem = this.$obj.find('.input-box').find('input');
	this.$showBox   = this.$obj.find('div.show-box').find('div.show-item');
	this.loopIndex  = 1;

	// this.invoke(this.config.invoke);

	// 事件操作
	var config = this.config;
	var _this  = this;
	// 默认点击事件，并做容错处理
	if(config.triggerType === 'click' || config.triggerType !== 'mouseover'){
		this.$inputItem.click(function(){
			var index = $(this).index();
			_this.invoke(index);
		})
	}else if(config.triggerType === 'mouseover'){
		this.$inputItem.mouseover(function(){
			var index = $(this).index();
			_this.invoke(index);
		});
	};

	 // 默认加载的时候显示第几页
	_this.invoke(config.invoke-1);


	// 如果有auto，那么就自动循环 
	if(config.auto){
		this.length = this.$inputItem.length;
		this.num    = this.config.invoke; 
		this.timer  = null;
		_this.playAuto();

		// 鼠标移入，定时器停止
		this.$obj.on('mouseover', function(){
			clearInterval(_this.timer);
		});
		// 鼠标移出，开始定时器
		this.$obj.on('mouseout', function(){ 
			// 鼠标移出的时候，找到对应的索引，再从索引开始循环
			_this.$inputItem.each(function(index, item){
				if($(item).hasClass('active')){
					_this.num = index;
					return; 
				};
			});
			_this.playAuto()
		});
	};

	

};

Tabs.prototype = {
	// 如果传了配置项，就合并配置项
	getConfig : function(){
		if(this.option && this.option != ''){
			this.config = $.extend({}, this.config, this.option);
			return this.config;
		};
	},
	// 切换函数（主要函数）
	invoke : function(index){
		var _this  = this, 
		    config = this.config,
		    speed  = this.config.speed,
		    effect = this.config.effect;
		_this.$inputItem.eq(index).addClass('active').siblings().removeClass('active');

		if(effect === 'slider' || effect !== 'fade'){ 
			_this.$showBox.eq(index).stop(true).show(speed).siblings().hide(speed);
		}else if(effect === 'fade'){
			_this.$showBox.eq(index).stop(true).fadeIn(speed).siblings().fadeOut(speed);
		};
	},
	// 自动播放函数
	playAuto : function(){
		var _this = this;
		_this.timer = setInterval(function(){

			_this.num ++;
			if(_this.num >= _this.length){
				_this.num = 0;
			};
			_this.invoke(_this.num);

		}, _this.config.auto);

		
	}
};
