(function($, undefined){
	// zepto animate
	(function($, undefined){
	  var document = window.document, docElem = document.documentElement,
	    origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle

	  function anim(el, speed, opacity, scale, callback) {
	    if (typeof speed == 'function' && !callback) callback = speed, speed = undefined
	    var props = { opacity: opacity }
	    if (scale) {
	      props.scale = scale
	      el.css($.fx.cssPrefix + 'transform-origin', '0 0')
	    }
	    return el.animate(props, speed, null, callback)
	  }

	  function hide(el, speed, scale, callback) {
	    return anim(el, speed, 0, scale, function(){
	      origHide.call($(this))
	      callback && callback.call(this)
	    })

	  }

	  $.fn.show = function(speed, callback) {
	    origShow.call(this)
	    if (speed === undefined) speed = 0
	    else this.css('opacity', 0)
	    return anim(this, speed, 1, '1,1', callback)
	  }

	  $.fn.hide = function(speed, callback) {
	    if (speed === undefined) return origHide.call(this)
	    else return hide(this, speed, '0,0', callback)
	  }

	  $.fn.toggle = function(speed, callback) {
	    if (speed === undefined || typeof speed == 'boolean')
	      return origToggle.call(this, speed)
	    else return this.each(function(){
	      var el = $(this)
	      el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback)
	    })
	  }

	  $.fn.fadeTo = function(speed, opacity, callback) {
	    return anim(this, speed, opacity, null, callback)
	  }

	  $.fn.fadeIn = function(speed, callback) {
	    var target = this.css('opacity')
	    if (target > 0) this.css('opacity', 0)
	    else target = 1
	    return origShow.call(this).fadeTo(speed, target, callback)
	  }

	  $.fn.fadeOut = function(speed, callback) {
	    return hide(this, speed, null, callback)
	  }

	  $.fn.fadeToggle = function(speed, callback) {
	    return this.each(function(){
	      var el = $(this)
	      el[
	        (el.css('opacity') == 0 || el.css('display') == 'none') ? 'fadeIn' : 'fadeOut'
	      ](speed, callback)
	    })
	  }

	})($);	

	$.utils = {
		alert: function (options) {
	        // options: {
	        //     iconClass: String, //图标
	        //     msg: String, //信息
	        //     time: Number, //停留时间
	        //     callback: Function, //消失后的回调
	        // }
	        var msg;
	        if (!options) {
	        	options = {};
	        }
	        if (typeof options === 'string') {
	        	msg = options;
	        	options = {};
	        	options.msg = msg;
	        }
	        var iconClass = options.iconClass || 'icon-alert-success';
	        msg = options.msg || '操作成功';
	        var time = options.time || 1400;
	        var callback = options.callback;
	        var animTime = 800;

	        var tpl = '<div id="alertBox" class="alert-box">' +
		                '<div class="icon-box"><span class="icon '+ iconClass +'"></span></div>' +
		                '<div class="msg">提示消息</div>' +
		            '</div>';

		    var $box = $('#alertBox');
		    if (!$box.length) {
		    	$box = $(tpl).appendTo('body');
		    }

		   	fadeIn();
		    //fadeOut();

		    function fadeIn() {
	            $('.icon-box span',$box).attr('class', '').addClass(iconClass);
	            $('.msg',$box).text(msg); 

	            $box.fadeIn(animTime,function(){
			   		setTimeout(fadeOut,time);
			   	});	    	
		    }

		    function fadeOut() {
		    	$box.fadeOut(animTime,callback);
		    }
		},
		warn: function(options){
			var options = $.extend({
				title: '提示',
				msg: '主体信息',
				hint: '辅助信息',
				hasCloseBtn: true,
				onConfirm: function() {

				}
			}, options);

			var closeBtnStr = options.hasCloseBtn ? '<span id="closeWarnBtn" class="icon icon-close"></span>': '';

			var tpl = '<div class="modal warn-modal">\
				        <div class="modal-box">\
				            <div class="header">\
				                <div class="title">' + options.title + '</div>' 
				                + closeBtnStr +	
				            '</div>\
				            <div class="body">\
				                <div class="text-big msg">'+ options.msg +'</div>\
				                <div class="text-tinge hint">'+ options.hint +'</div>\
				            </div>\
				            <div class="footer clearfix flex">\
                                <div class="fl item flex-1"><button class="btn btn-link confirm-btn text-primary">确定</button></div>\
                            </div>\
				        </div>\
				    </div>';
			
			var $warn = $(tpl);
			$warn.appendTo('body');
			setMarginTop();
			$warn.on('click',function(e){
				remove();
			});
			$('.modal-box', $warn).on('click', function(e) {
				e.stopPropagation();
			});
			$('#closeWarnBtn',$warn).on('click',function(e) {
				$warn.remove();
			});
			$('.confirm-btn', $warn).on('click',function(e){
				options.onConfirm();
				remove();				
			});

			function remove() {
				$warn.remove();
			}
			function setMarginTop() {
				var $modalBox = $('.modal-box',$warn);
				var height = parseFloat($modalBox.css('height'));
				$modalBox.css('margin-top',-height/2);
			}
		},
		confirm: function(options) {
			var options = $.extend({
				title: '提示',
				msg: '',
				hint: '',
				hasCloseBtn: true,
				confirmBtnStr: '是',
				cancelBtnStr: '否',
				onConfirm: function() {

				},
				onCancel: function() {

				}
			}, options);
			var closeBtnStr = options.hasCloseBtn ? '<span id="closeConfirmBtn" class="icon icon-close"></span>': '';
			var tpl = '<div class="modal confirm-modal">\
				        <div class="modal-box">\
				            <div class="header">\
				                <div class="title">'+options.title+'</div>'
				                 + closeBtnStr +	
				            '</div>\
				            <div class="body">\
				                <div class="text-big msg">'+ options.msg +'</div>\
				                <div class="text-tinge hint">'+ options.hint +'</div>\
				            </div>\
				            <div class="footer clearfix">\
		                        <div class="fl item"><button class="btn btn-link confirm-btn text-primary">' + options.confirmBtnStr + '</button></div>\
		                        <div class="fl item"><button class="btn btn-link cancel-btn text-primary">' + options.cancelBtnStr + '</button></div>\
		                    </div>\
				        </div>\
				    </div>';

			var $confirm = $(tpl);
			$confirm.appendTo('body');
			setMarginTop();

			$confirm.on('click',function(e){
				remove();
			});
			$('.modal-box', $confirm).on('click', function(e) {
				e.stopPropagation();
			});
			$('#closeConfirmBtn',$confirm).on('click',function(e) {
				remove();
			});
			$('.confirm-btn', $confirm).on('click',function(e){
				options.onConfirm();
				remove();				
			});
			$('.cancel-btn', $confirm).on('click',function(e){
				options.onCancel();
				remove();				
			});

			function remove() {
				$confirm.remove();
			}
			function setMarginTop() {
				var $modalBox = $('.modal-box',$confirm);
				var height = parseFloat($modalBox.css('height'));
				$modalBox.css('margin-top',-height/2);
			}
		},
		loading: {
			$el: {},
			init: function() {
				var $el = $('.loading-modal');
				var tpl;

				if (!$el.length) {
					tpl = '<div class="modal loading-modal hidden">\
				                <div class="loading-box">\
				                    <span class="icon-loader"></span>\
				                </div>\
				            </div>';
				    $el = $(tpl).appendTo('body');
				}
				this.$el = $el;
			},
			show: function() {
				var me = this;
				this.init();
				// 延迟300ms，避免闪屏
				this.delay = setTimeout(function(){
					me.$el.removeClass('hidden');
				},10);				
			},
			hide: function() {
				this.$el.addClass('hidden');
				clearTimeout(this.delay);
			}
		}		
	}
})($);