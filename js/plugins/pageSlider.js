;(function($){
	$.fn.pageSlider = function(options) {
		return new MyPageSlider(this,options);
	}

	var MyPageSlider = function($el,options) {
		if (!options || !options.count || options.count ===1) {
			$el.hide();
			// return false;
		}

		this.$el = $el;
		this.count = options.count;		
		this.init();
	}

	MyPageSlider.prototype = new $('<div></div>');

	MyPageSlider.prototype.init = function() {
		var me = this;

		this.startX = 0;
		this.endX = 0;
		this.unitWidth = 0;
		this.pageNumber = 0;
		this.maxDot = 50;

		var $el = this.$el;
		var $list = this.$list = $('.page-list', $el);
		var $tag = this.$tag = $('.tag-block', $el);
		var $pagination = this.$pagination = $('.pagination', $el);		
		var _touch;
		var _listWidth;

		generateList($list, me.count);
		locationPageSlider();
		computeUnitWidth();

		checkNavigationBtnState(me);

		_listWidth = parseFloat($list.css('width'));
		this.startX = $list.offset().left;
		this.startX = Math.floor( this.startX );		
		// this.unitWidth = _listWidth/this.count;
		this.endX = this.startX + _listWidth - 15;
		this.endX = Math.ceil( this.endX );
		// 生成滑动区
		function generateList($list, count) {
			var tpl = '';
			var maxDot = me.maxDot;	
			var itemWidth;		

			count = count>maxDot ? maxDot : count;
			itemWidth = computeItemWidth(count);

			for(var i= 0; i<count; i++) {				

				if(i===count-1) {
					tpl += '<li style="width:15px"></li>';					
				} else {
					tpl += '<li style="width:' + itemWidth + 'px"></li>';
				}
			}
			$list.html(tpl);
		}

		// 计算滑动单元宽度
		function computeUnitWidth() {
			var $outContainer = $('body');
			var outContainerWidth = parseFloat( $outContainer.css('width') );
			var unitWidth = (outContainerWidth - 150)/(me.count - 1);
			if(unitWidth > 30) {
				unitWidth = 30;
			}
			me.unitWidth = unitWidth;
		}

		// 计算每一项的宽度		
		function computeItemWidth(count) {
			// 计算公式： W= 30*2 + 30*2 + 15*2 + (n-1)*l 
			// 最大宽度为30
			var $outContainer = $('body');
			var outContainerWidth = parseFloat( $outContainer.css('width') );
			var itemWidth = (outContainerWidth - 150)/(count -1);

			if(itemWidth > 30) {
				itemWidth = 30;
			}

			return itemWidth;
		}		

		// 根据宽度重新定位组件
		function locationPageSlider() {
			var $el = me.$el;
			var pageSliderWidth = parseFloat( $el.css('width') );
			$el.css({
				'margin-left': - pageSliderWidth/2,
				left: '50%'
			});
		}

		// 事件绑定
		$el.on('tap click touchstart touchmove touchend', function(e){
			e.stopPropagation();
		});
		
		$list.on('touchstart', function(e) {
			e.stopPropagation();
			fnTouches(e);
			_touch = e.touches[0];		
			dragTagBlock(me, _touch.pageX);
			$pagination.show();
		}).on('touchmove', function(e) {
			e.stopPropagation();
			var currentX;
			fnTouches(e);
			_touch = e.touches[0];
			currentX = _touch.pageX;			

			dragTagBlock(me, currentX);
		}).on('touchend', function(e) {
			locationTagBlock(me, me.pageNumber, true);
			$pagination.hide();
		});

		$el.on('click','.prev', function(e) {
			if($(this).hasClass('disabled')) return;
			goPrev();
		}).on('click','.next', function(e) {
			if($(this).hasClass('disabled')) return;
			goNext();
		})



		// 当前页标识块
		// ## 跟随当前触摸点
		function dragTagBlock(me, currentX) {	
			// -1 避免最后一像素时，deltaX = _unitWidth*count;console.log(currentX);
			if (currentX < me.startX || currentX > me.endX) return;

			var deltaX = currentX - me.startX;
			me.$tag.css({'margin-left': deltaX + 'px'});

			getPageNumber(me, currentX);
		}		

		// 计算当前页码
		function getPageNumber(me, currentX) {	
			var unitWidth = me.unitWidth;		
			var max = me.count-1;
			var deltaX = currentX - me.startX;
				deltaX += unitWidth/2;
			var number = Math.floor(deltaX/unitWidth);

			number = (number > max) ? max : number;	

			_setPageNumber(me, number);
			//console.log(currentX + ' ' + deltaX/_unitWidth + ' ' + number )
			return number;
		}

		// 前翻页
		function goPrev() {
			me.setPageNumber(--me.pageNumber, true);			
		}
		// 后翻页
		function goNext() {
			me.setPageNumber(++me.pageNumber, true);
		}
	}

	// event 兼容处理
	function fnTouches(e) {
		// Android 阻止默认事件，待查原因
		e.preventDefault();
		if(!e.touches){
            e.touches = e.originalEvent.touches;
        }
	}
	// 取整
	// function toInt(number) {
	// 	return Math.round(number);
	// }

	// 设置页码 
	MyPageSlider.prototype.setPageNumber = function(pageNumber, triggerEvent) {
		_setPageNumber(this, pageNumber);
		locationTagBlock(this, this.pageNumber, triggerEvent);
	}
	// 获取页码 
	MyPageSlider.prototype.getPageNumber = function(pageNumber) {
		return this.pageNumber;
	}

	// 滑动时更新页码
	function _setPageNumber(me, pageNumber) {
		me.pageNumber = pageNumber;
		me.$pagination.children('span').text(pageNumber + 1);
		checkNavigationBtnState(me);
	}
	// ## 修正标识块位置
	function locationTagBlock(me, pageNumber, triggerEvent) {
		var left = pageNumber*me.unitWidth;
		me.$tag.css({'margin-left': left + 'px'});

		// 触发页码变更事件。
		triggerEvent && me.trigger('pageNumberChange', pageNumber);
	}
	// ## 检测翻页区状态
	function checkNavigationBtnState(me) {
		$('.prev, .next', me.$el).removeClass('disabled');
		if(me.pageNumber === 0) {
			$('.prev', me.$el).addClass('disabled');
		} 
		if (me.pageNumber === me.count - 1 ) {
			$('.next', me.$el).addClass('disabled');
		}
	}
})(window.Zepto || window.jQuery);