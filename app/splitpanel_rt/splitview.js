/*!

Split Pane v0.9.4

Copyright (c) 2014 - 2016 Simon Hagström

Released under the MIT license
https://raw.github.com/shagstrom/split-pane/master/LICENSE
Revised by Rune Thorsen 2019
*/
//My hacks todo:refactor. Remove the m globalization
var m={};		//Make global for debugging
	m.getComponents=function() {
		var e=$('#idThumb');
		if (!e[0])return;
		return {
			splitPane: e[0].parentElement,
			first: e[0].previousElementSibling,
			divider:e[0],
			last: e[0].nextElementSibling
		};
	};
 //Back to original implementations
(function ($) {
	
	'use strict';

	var methods = {};
	
	methods.init = function() {
		var c=m.getComponents();
		$(c.divider).on('touchstart mousedown', mousedownHandler);
		m.mSwapOrientation();

	};
 
	$.fn.splitPane = function(method) {
			methods[method || 'init'].apply(this, $.grep(arguments, function(it, i) { return i > 0; }));
	};

 
	m.mSwapOrientation=function(){
		if ( m.mIsHoriz()){//Change to vertical
			m.components.splitPane.classList.add('vertical')
			m.components.splitPane.classList.remove('horizontal');
		}else{
			m.components.splitPane.classList.remove('vertical')
			m.components.splitPane.classList.add('horizontal');
		}
		m.mRefresh();
	}
	m.mIsHoriz=function(){//Horizontal orientation
		if (!m.components) m.components=m.getComponents();
		return m.components.splitPane.classList.contains('horizontal');
	}
	function mousedownHandler(event) {
		//m.components=m.getComponents($splitPane);
		event.preventDefault();
		var $divider = $(this),
			$splitPane = $divider.parent();
		$divider.addClass('dragged');
		if (event.type.match(/^touch/)) {
			$divider.addClass('touch');
		}
		var moveEventHandler = createMousemove($splitPane, pageXof(event), pageYof(event));
		$(document).on('touchmove mousemove', moveEventHandler);
		$(document).one('touchend mouseup', function(event) {
			$(document).off('touchmove mousemove', moveEventHandler);
			m.mSplitMoveEnd();
			$divider.removeClass('dragged touch');
		});
	}
 

	function createMousemove($splitPane, pageX, pageY) {
		m.pageX=pageX;
		m.pageY=pageY;
		m.c=(m.components.first.offsetWidth+m.components.last.offsetLeft)/2;
		return mResize(m.components, pageX);
	}
	m.mRefresh=function(){
		document.body.style.height=window.innerHeight+'px'  //Scales the body in case of soft keyboard
		m.components.divider.style.left=m.pageX1+'px'
		m.components.divider.style.top=m.pageY1+'px'
		if (m.mIsHoriz()){
				var p=m.components.divider.offsetTop-m.components.splitPane.offsetTop;
				m.components.first.style.width	=m.components.splitPane.offsetWidth+'px';
				m.components.last.style.width	=m.components.splitPane.offsetWidth+'px';
				//m.components.first.style.position='absolute'
				//m.components.first.style.top='0px'
				m.components.first.style.height=p+'px'
				//m.components.last.style.position='absolute'
				 m.components.last.style.top='0px'; //position is relative so its top is relative to bottom of first
				m.components.last.style.left='0px'
				m.components.last.style.height=(m.components.splitPane.offsetHeight-p)+'px'
			 
			}else {
				var p=m.components.divider.offsetLeft;
				m.components.first.style.height=m.components.splitPane.offsetHeight+'px'
				m.components.last.style.height=m.components.splitPane.offsetHeight+'px'
				m.components.first.style.width=p+'px';
				//m.components.last.style.top='0px'
				//m.components.last.style.left=p;
				m.components.last.style.left='0px';
				//m.components.last.style.width=(m.components.splitPane.offsetWidth-m.components.divider.offsetLeft)+'px'
				var w=m.components.splitPane.offsetWidth-m.components.divider.offsetLeft;	//from first element width end of container
				//w=w-m.components.divider.offsetWidth
				m.components.last.style.width=w+'px';
				if (m.components.last.offsetTop>1)  //There was a placement error (rounding err?)
					m.components.last.style.width=(w-5)+'px';	//Subtract some pixels to avoid rounding error	
			}
	}
	function mResize(components, pageX) {
		return function(event) {
			m.pageX1=pageXof(event);	//Get the coordinate of the mouse
			m.pageY1=pageYof(event);	//Get the coordinate of the mouse
			event.preventDefault && event.preventDefault();
			m.mRefresh();
			
		};
	}
	m.mResize=mResize;
	m.mSplitMoveEnd=function(){
		var mTrigLevel=0.1;
		if (m.mIsHoriz()){
			var l= m.components.splitPane.offsetWidth;	//Length of the divider
			if ((m.pageX1/l<mTrigLevel)||(mTrigLevel+m.pageX1/l>1))			m.mSwapOrientation();
//			m.components.divider.style.left='50%';
		}else {
			var l= m.components.splitPane.offsetHeight;	//Length of the divider
			if ((m.pageY1/l<mTrigLevel)||(mTrigLevel+m.pageY1/l>1))			m.mSwapOrientation();
//			m.components.divider.style.top='50%';		
		}
		m.mRefresh();
	}

	function pageXof(event) {
		if (event.pageX !== undefined) {
			return event.pageX;
		} else if (event.originalEvent.pageX !== undefined) {
			return event.originalEvent.pageX;
		} else if (event.originalEvent.touches) {
			return event.originalEvent.touches[0].pageX;
		}
	}

	function pageYof(event) {
		if (event.pageY !== undefined) {
			return event.pageY;
		} else if (event.originalEvent.pageY !== undefined) {
			return event.originalEvent.pageY;
		} else if (event.originalEvent.touches) {
			return event.originalEvent.touches[0].pageY;
		}
	}

 
})(jQuery);
