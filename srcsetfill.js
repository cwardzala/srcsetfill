
(function ( w ) {
	var supportsSrcSet = function () {
		var i = document.createElement('img');
		return 'srcset' in i;
	};

	if (supportsSrcSet()) { return; } // your browser supports srcset so we dont need to continue.

	w.srcsetfill = function () {
		var images = document.getElementsByTagName('img'),
			winWidth = w.document.documentElement.clientWidth,
			infinityThreshold = 200;

		// build the set from a string.
		var buildSet = function (sets) {
			var srcsets = {};
			for (var si=0; si<sets.length; si++) {
				var set = sets[si].replace(/^[\s]/, '').split(' ');
				var setw = parseInt(set[1],10);
				if (!set[1]) { setw = 'infinity'; }
				srcsets[setw] = set[0];
			}
			return srcsets;
		};

		// Get the largest and smallest sizes from the set.
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

		for ( var i=0; i<images.length; i++ ) {
			// Store the fallback image first since it will get lost once we start swapping out the src.
			if ( !images[i].getAttribute('data-fallback')) {
				images[i].setAttribute('data-fallback',images[i].src);
			}
			if ( images[i].getAttribute('srcset') ) {
				var sets = images[i].getAttribute('srcset').split(',');
				var imgsrc = '';
				var srcsets = buildSet(sets);
				var sizes = getMinMaxSize(srcsets);

				for (var size in srcsets) {
					if ( srcsets.hasOwnProperty(size) ) {
						if (winWidth > size && size !== 'infinity') {
							imgsrc = srcsets[size];
						} else if (winWidth < sizes.min && size !== 'infinity') {
							imgsrc = images[i].getAttribute('data-fallback');
						} else if ( size === 'infinity' && winWidth > (sizes.max+infinityThreshold) ) {
							imgsrc = srcsets[size];
						} 
					}
				}
				
				images[i].src = imgsrc;
			}
		}
	};

	// taken from picturefill https://github.com/scottjehl/picturefill
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