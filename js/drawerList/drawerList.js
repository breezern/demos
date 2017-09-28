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
			var _startX;		
			var _touch;
			var _slideWidth;
			var _threshold = 20;
			var _absoluteX;
			var _deltaX;
			var $slider;

			$el.on('click','.show',function(e) {
				console.log('show');
			});			

			$el.on('touchstart','.drawer-item',function (e) {
				_touch = e.touches[0];
				_startX = _touch.pageX;
				_slideWidth = $(e.currentTarget).find('.drawer-tool').css('width').replace('px','') || 0;
				$slider = $(e.currentTarget).find('.drawer-content');

				me.reset();
			});
			$el.on('touchmove','.drawer-item',function (e) {
				e.preventDefault();
				var _currentX;

				_touch = e.touches[0];
				var 
				_currentX = _touch.pageX;
				_deltaX = _currentX - _startX;
				_absoluteX = Math.abs(_deltaX);
				if (_deltaX > 0) return;
				if (_absoluteX > _slideWidth) return;
				$slider.css('left',_deltaX+'px');
			});
			$el.on('touchend','.drawer-item',function(e){
				$slider.addClass('animate');
				_absoluteX = _absoluteX || 0;
				if ((_deltaX < 0) && (_absoluteX > _threshold)) {
					$slider.css('left','-' + _slideWidth + 'px' ).addClass('unfold');
					// 展开条目内容区，阻止事件向下捕获
					$slider[0].addEventListener('click',stopPropagation,true);					
				} else {
					$slider.css('left','0');
				}

				$slider.on('webkitTransitionEnd mozTransitionEnd transitionend',function(e) {
					$(this).removeClass('animate');
				});
				_absoluteX = 0;
				_slideWidth = 0;
				_startX = 0;
				_touch = null;
			});

			
			$el.on('webkitTransitionEnd mozTransitionEnd transitionend','.unfold',function(e) {
				var $el = $(e.currentTarget);

				if ($el.css('left').replace('px','') === '0') {
					$el[0] && $el[0].removeEventListener('click',stopPropagation,true);

					$el.removeClass('unfold');
				};				
			});

			// 条目tool区，阻止触摸事件冒泡
			$('.drawer-tool').on('touchstart touchmove touchend', function(e){
				e.stopPropagation();
			})

			function stopPropagation(e) {
				e.stopPropagation();
				return false;
			}
		}

		MyDrawer.prototype.reset = function() {
			var $unfold = $('.drawer-item .unfold', this.$el);
			$unfold.addClass('animate').css('left','0');	
		}
	  

	})(window.Zepto || window.jQuery);