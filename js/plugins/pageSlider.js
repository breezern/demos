;(function($){
	$.fn.pageSlider = function(options) {
		if (!options || !options.count) return false;

		return new MyPageSlider(this,options);
	}

	var MyPageSlider = function($el,options) {
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

		var $el = this.$el;
		var $list = this.$list = $('.page-list', $el);
		var $tag = this.$tag = $('.tag-block', $el);
		var $pagination = this.$pagination = $('.pagination', $el);		
		var _touch;
		var _listWidth = parseFloat($list.css('width'));

		this.startX = $list.offset().left;		
		this.unitWidth = _listWidth/this.count;
		this.endX = this.startX + _listWidth - this.unitWidth;

		generateList($list, me.count);

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
			locationTagBlock(me, me.pageNumber);
			$pagination.hide();
		});

		$el.on('click','.prev', function(e) {
			if($(this).hasClass('disabled')) return;
			goPrev();
		}).on('click','.next', function(e) {
			if($(this).hasClass('disabled')) return;
			goNext();
		})

		// 生成滑动区
		function generateList($list, count) {
			var tpl = '';
			for(var i= 0; i<count; i++) {
				tpl += '<li></li>'
			}
			$list.html(tpl);
		}

		// 当前页标识块
		// ## 跟随当前触摸点
		function dragTagBlock(me, currentX) {	
			// -1 避免最后一像素时，deltaX = _unitWidth*count;
			if (currentX < me.startX || currentX > me.endX) return;

			var deltaX = currentX - me.startX;
			me.$tag.css({'margin-left': deltaX + 'px'});

			getPageNumber(me, currentX);
		}		

		// 计算当前页码
		function getPageNumber(me, currentX) {	
			var unitWidth = me.unitWidth;		

			var deltaX = currentX - me.startX;
				deltaX += unitWidth/2;
			var number = Math.floor(deltaX/unitWidth);		

			_setPageNumber(me, number);
			//console.log(currentX + ' ' + deltaX/_unitWidth + ' ' + number )
			return number;
		}

		// 前翻页
		function goPrev() {
			me.setPageNumber(--me.pageNumber);			
		}
		// 后翻页
		function goNext() {
			me.setPageNumber(++me.pageNumber);
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

	// 设置页码 
	MyPageSlider.prototype.setPageNumber = function(pageNumber) {
		_setPageNumber(this, pageNumber);
		locationTagBlock(this, this.pageNumber);
	}
	// 获取页码 
	MyPageSlider.prototype.getPageNumber = function(pageNumber) {
		return this.pageNumber;
	}

	// 滑动时更新页码
	function _setPageNumber(me, pageNumber) {
		me.pageNumber = pageNumber;
		me.$pagination.text(pageNumber + 1);
		checkNavigationBtnState(me);
	}
	// ## 修正标识块位置
	function locationTagBlock(me, pageNumber) {
		var left = pageNumber*me.unitWidth;
		me.$tag.css({'margin-left': left + 'px'});

		// 触发页码变更事件。
		me.trigger('pageNumberChange', pageNumber);
	}
	// ## 检测翻页区状态
	function checkNavigationBtnState(me) {
		$('.prev, .next', me.$el).removeClass('disabled');
		if(me.pageNumber === 0) {
			$('.prev', me.$el).addClass('disabled');
		} else if (me.pageNumber === me.count - 1 ) {
			$('.next', me.$el).addClass('disabled');
		}
	}
})(window.Zepto || window.jQuery);