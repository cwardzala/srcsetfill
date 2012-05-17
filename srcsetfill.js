
(function ( w ) {

	w.srcsetfill = function () {
		var images = document.getElementsByTagName('img'),
			srcsets = {},
			winWidth = w.document.documentElement.clientWidth,
			infinityThreshold = 200;

		var buildSet = function (sets) {
			for (var si=0; si<sets.length; si++) {
				var set = sets[si].replace(/^[\s]/, '').split(' ');
				var setw = parseInt(set[1],10);
				if (!set[1]) { setw = 'infinity'; }
				srcsets[setw] = set[0];
			}
		};

		var getMinMaxSize = function (set) {
			var sizes = {
				max:0,
				min:0
			};
			for (var size in set) {
				sizes.max = ( srcsets.hasOwnProperty(size) && parseInt(size,10) > sizes.max ) ? parseInt(size,10) : sizes.max;
				sizes.min = ( srcsets.hasOwnProperty(size) && parseInt(size,10) < sizes.min || sizes.min === 0 ) ? parseInt(size,10) : sizes.min;
			}

			return sizes;
		};

		var setAttr = function (element,attr,value) {
			if (!element.setAttribute) {
				element[attr] = value;
			} else {
				element.setAttribute(attr,value);
			}
		};

		var getAttr = function (element,attr) {
			var value = null;
			if (!element.getAttribute) {
				value = element[attr];
			} else {
				value = element.getAttribute(attr,value);
			}
			return value;
		};

		for ( var i=0; i<images.length; i++ ) {
			if ( !getAttr(images[i],'data-fallback')) {
				setAttr(images[i],'data-fallback',images[i].src);
			}
			console.log(winWidth);
			if ( getAttr(images[i],'srcset') ) {
				var sets = getAttr(images[i],'srcset').split(',');
				buildSet(sets);
				var sizes = getMinMaxSize(srcsets);
				var imgsrc = '';

				for (var size in srcsets) {
					if ( srcsets.hasOwnProperty(size) ) {
						if (winWidth > size && size !== 'infinity') {
							imgsrc = srcsets[size];
						} else if (winWidth < sizes.min && size !== 'infinity') {
							imgsrc = getAttr(images[i],'data-fallback');
						} else if ( size === 'infinity' && winWidth > (sizes.max+infinityThreshold) ) {
							imgsrc = srcsets[size];
						} 
					}
				}
				images[i].src = imgsrc;
			}
		}
	};
	

	// Run on resize and domready (w.load as a fallback)
	if( w.addEventListener ){
		w.addEventListener( "resize", w.srcsetfill, false );
		w.addEventListener( "DOMContentLoaded", function(){
			w.srcsetfill();
			// Run once only
			w.removeEventListener( "load", w.srcsetfill, false );
		}, false );
		w.addEventListener( "load", w.srcsetfill, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onload", w.srcsetfill );
	}

})(this);