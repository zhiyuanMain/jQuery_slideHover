/*************************
 *@author: h_xingzhiyuan@163.com
 *@name: SlideHover 
 *@date: 2017-08-11
 *@version: 1.0.0
 *@descript: 仿百度图标鼠标进出效果
 *************************/
;
(function($, window, document, undefined) {
	var sprinf = function(str) {
		var args = arguments,
			flag = true,
			i = 1;
		str = str.replace(/%s/g, function() {
			var arg = args[i++];
			if(typeof arg === 'undefined') {
				flag = false;
				return '';
			}
			return arg;
		})
		return flag ? str : '';
	}
	var isMobile = function() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}
	var pluginName = 'slideHover';

	function SlideHover(element, options) {
		this.element = element;
		this.$el = $(element);
		this.options = options;
		this.init();
	}

	SlideHover.DEFAULTS = {
		target: 'img',
		duration: 'fast',
		reverse: false,
		withLink: true,
		linkTarget: '_blank',
		classes: {
			el: 'slip-hover-container',
			overLayerContainer: 'slip-hover-overlayer-container',
			overLayer: 'slip-hover-overlayer',
			aLink: 'slip-hover-overlayer-alink'
		},
		styles: {
			color: '#ffffff',
			textPosition: ['middle', 'left'],
			padding: '5px 5px',
			backgroundColor: 'rgba(0, 0, 0, .5)'
		}

	}

	SlideHover.Events = {
		//disable on touch devices
	}

	SlideHover.prototype.init = function() {
		if(isMobile()) {
			return;
		}
		var self = this,
			ops = self.options,
			$el = self.$el,
			$target = ops.target;
		$el.addClass(ops.classes.el);
		$el.off('mouseenter.SlideHover', $target).on('mouseenter.SlideHover', $target, function(event) {
			var $this = $(this),
				$li = $this.parents('li');
			var $overlayContainer = self.createOverlayContainer($li);
			$overlayContainer.off('mouseenter.SlideHover mouseleave.SlideHover').on('mouseenter.SlideHover mouseleave.SlideHover', function(event) {
				var direction = self.getDirection($overlayContainer, event);
				direction = ops.reverse ? (direction + 2) % 4 : direction;
				if(event.type === 'mouseenter') {
					var $overlay = self.createOverlay($li, direction);
					self.showOverlay($overlay);
				} else {
					self.removeOverlay($overlayContainer, direction);
				}

			})
		})
	}

	SlideHover.prototype.createOverlayContainer = function(pTarget) {
		var self = this,
			ops = self.options,
			$pTarget = pTarget;
		var pTargetWidth = $pTarget.outerWidth(),
			pTargetHeight = $pTarget.outerHeight(),
			pTargetX = $pTarget.offset().left,
			pTargetY = $pTarget.offset().top,
			zIndex = $pTarget.css('zIndex');
		//确定覆盖层样式
		var $overlayContainer = $('<div />', {
			class: ops.classes.overLayerContainer
		}).css({
			position: 'absolute',
			width: pTargetWidth,
			height: pTargetHeight,
			left: pTargetX,
			top: pTargetY,
			zIndex: zIndex && zIndex != 'auto' ? ++zIndex : '999',
			overflow: 'hidden'
		});
		$overlayContainer.appendTo(pTarget);
		return $overlayContainer;
	}

	SlideHover.prototype.createOverlay = function(liTarget, direction) {
		var self = this,
			ops = self.options,
			buIOverlayContainer = liTarget.find('.' + ops.classes.overLayerContainer),
			$liTarget = liTarget,
			$aTarget = $liTarget.find('a');
		var conWidth = buIOverlayContainer.outerWidth(),
			conHeight = buIOverlayContainer.outerHeight();
		var cssStyleLB = {};
		switch(direction) {
			case 0:
				cssStyleLB.left = 0;
				cssStyleLB.bottom = '100%';
				break;
			case 1:
				cssStyleLB.left = '100%';
				cssStyleLB.bottom = 0;
				break;
			case 2:
				cssStyleLB.left = 0;
				cssStyleLB.bottom = '-100%';
				break;
			case 3:
				cssStyleLB.left = '-100%';
				cssStyleLB.bottom = 0;
				break;
			default:
				break;
		}
		//确定阴影处样式及位置
		$overLayer = $('<div />', {
			class: ops.classes.overLayer
		}).css({
			position: 'absolute',
			width: conWidth,
			height: conHeight,
			left: cssStyleLB.left,
			bottom: cssStyleLB.bottom,
			backgroundColor: ops.styles.backgroundColor,
		})
		//加载文字
		var $aTargetTxt = $('<a />', {
				class: ops.classes.aLink + ' ' + ops.styles.textPosition[0] + ' ' + ops.styles.textPosition[1]
			})
			.css({
				padding: ops.styles.padding,
				color: ops.styles.color
			})
			.attr('href', sprinf('%s', ops.withLink ? $aTarget.attr('href') : 'javascript:void(0)'))
			.attr('target', sprinf('%s', ops.linkTarget))
			.html($aTarget.attr('data-description'));
		$overLayer.html($aTargetTxt);
		$overLayer.appendTo(buIOverlayContainer);
		return $overLayer;
	}

	SlideHover.prototype.showOverlay = function(target) {
		var self = this,
			ops = self.options,
			buIOverlay = target;
		buIOverlay.stop(true).animate({
			left: 0,
			bottom: 0
		}, ops.duration)
	}

	SlideHover.prototype.removeOverlay = function(con, direction) {
		var self = this,
			ops = self.options,
			buIOverlayCon = con,
			buIOverlay = buIOverlayCon.find('.' + ops.classes.overLayer);
		var cssStyleLB = {};
		switch(direction) {
			case 0:
				cssStyleLB.left = 0;
				cssStyleLB.bottom = '100%';
				break;
			case 1:
				cssStyleLB.left = '100%';
				cssStyleLB.bottom = 0;
				break;
			case 2:
				cssStyleLB.left = 0;
				cssStyleLB.bottom = '-100%';
				break;
			case 3:
				cssStyleLB.left = '-100%';
				cssStyleLB.bottom = 0;
				break;
			default:
				break;
		}
		buIOverlay.stop(true).animate(cssStyleLB, ops.duration, function() {
			buIOverlayCon.remove();
		});
	}

	SlideHover.prototype.getDirection = function(con, event) {
		var self = this,
			$overlayContainer = con;
		var w = $overlayContainer.width(),
			h = $overlayContainer.height(),
			bx = (event.pageX - $overlayContainer.offset().left - (w / 2)) * (w > h ? (h / w) : 1),
			by = (event.pageY - $overlayContainer.offset().top - (h / 2)) * (h > w ? (w / h) : 1),
			direction = Math.round((((Math.atan2(by, bx) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
		return direction; //0--top 1--right 2--bottom 3--left
	}

	SlideHover.prototype.getOptions = function() {
		return this.options;
	};

	var allowedMethods = [
		'getOptions'

	];

	$.fn[pluginName] = function(option) {
		var value,
			args = Array.prototype.splice.call(arguments, 1);
		this.each(function() {
			var $this = $(this),
				data = $this.data('jQuery.SlideHover'),
				options = $.extend({}, SlideHover.DEFAULTS, $this.data(),
					(typeof option === 'object' && option)
				);

			if(typeof option === 'string') {
				if($.inArray(option, allowedMethods) < 0) {
					throw new Error("Unknown method: " + option);
				}

				if(!data) {
					return;
				}

				value = data[option].apply(data, args);
				if(option === 'destroy') {
					$this.removeData('jQuery.SlideHover');
				}
			}

			if(!data) {
				$this.data('jQuery.SlideHover', (data = new SlideHover(this, options)));
			}

		})
		return typeof value === 'undefined' ? this : value;
	}

})(jQuery, window, document)