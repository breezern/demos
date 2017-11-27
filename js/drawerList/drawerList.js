	;(function($){

		$.fn.drawerList = function(options) {
			return new MyDrawer(this,options);
		}

		var MyDrawer = function($el,options) {
			this.$el = $el;
			this.init();
		}

		MyDrawer.prototype.init = function() {
			var me = this;
			var $el = this.$el;
			var _startX, _startY;		
			var _touch;
			var _slideWidth;
			var _threshold = 20;
			var _absoluteX, _absoluteY;
			var _deltaX, _deltaY;
			var direction = null;
			var $slider;

					

			$el.on('touchstart','.drawer-content',function (e) {
				_touch = e.touches[0];
				_startX = _touch.pageX;
				_startY = _touch.pageY;
				_slideWidth = $(e.currentTarget).parent().find('.drawer-tool').css('width').replace('px','') || 0;
				$slider = $(e.currentTarget);

				me.reset();
			});
			$el.on('touchmove','.drawer-content',function (e) {
				// e.preventDefault();
				var _currentX, _currentY;

				_touch = e.touches[0];
				_currentX = _touch.pageX;
				_deltaX = _currentX - _startX;
				_absoluteX = Math.abs(_deltaX);

				_currentY = _touch.pageY;
				_deltaY = _currentY - _startY;
				_absoluteY = Math.abs(_deltaY);


				// 方向是否确定
				if (!direction) {
					// 判断是垂直滚动还是左右滑动
					if (_absoluteX<5 && _absoluteY<5) {
						direction = null;
						return;
					} else {
						direction = _absoluteX/_absoluteY>1 ?  'horizontal' : 'vertical';

						if (direction === 'horizontal') {
							// 水平时，禁止滚动
							$el.on('touchmove', preventDefault);
						}						
					}
				} else if(direction === 'horizontal') {					
					if (_deltaX > 0) return;
					if (_absoluteX > _slideWidth) return;
					$slider.css('left',_deltaX+'px');					
				}								
			});
			$el.on('touchend','.drawer-content',function(e){
				if (direction === 'horizontal') {
					$el.off('touchmove', preventDefault);

					// 水平时，处理滑动
					$slider.addClass('animate');
					_absoluteX = _absoluteX || 0;
					if ((_deltaX < 0) && (_absoluteX > _threshold)) {
						$slider.css('left','-' + _slideWidth + 'px' ).addClass('unfold');
						// 展开条目内容区时，阻止事件向下捕获
						$slider[0].addEventListener('click',stopPropagation,true);					
					} else {
						$slider.css('left','0');
					}

					$slider.on('webkitTransitionEnd mozTransitionEnd transitionend',function(e) {
						$(this).removeClass('animate');
					});
				}

				// 清状态
				_absoluteX = _absoluteY = 0;
				_slideWidth = 0;
				_startX = _startY = 0;
				_touch = null;
				direction = null; 
			});

			// 收起时，激活内容区点击事件监听
			$el.on('webkitTransitionEnd mozTransitionEnd transitionend','.unfold',function(e) {
				var $el = $(e.currentTarget);

				if ($el.css('left').replace('px','') === '0') {
					$el[0] && $el[0].removeEventListener('click',stopPropagation,true);

					$el.removeClass('unfold');
				};				
			});

			function stopPropagation(e) {
				e.stopPropagation();
				return false;
			}

			function preventDefault(e) {
				e.preventDefault();
			}
		}

		// 重置组件状态
		MyDrawer.prototype.reset = function() {
			var $unfold = $('.drawer-item .unfold', this.$el);
			$unfold.addClass('animate').css('left','0');	
		}
	  

	})(window.Zepto || window.jQuery);