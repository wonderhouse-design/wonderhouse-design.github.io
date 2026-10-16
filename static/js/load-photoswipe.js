/*
Put this file in /static/js/load-photoswipe.js
Documentation and licence at https://github.com/liwenyip/hugo-easy-gallery/
*/

/* Show an alert if this js file has been loaded twice */
if (window.loadphotoswipejs) {
	window.alert("You've loaded load-photoswipe.js twice. See https://github.com/liwenyip/hugo-easy-gallery/issues/6")
} 
var loadphotoswipejs = 1

/* the gallery that is currently open (or animating away) */
var gallery = null;
var galleryClosing = false;
var pendingIndex = null;

function openGallery(pswpEl, items, index) {
	gallery = new PhotoSwipe(pswpEl, PhotoSwipeUI_Default, items, {
		index: index,
		bgOpacity: 0.8,
		showHideOpacity: true,
		// PhotoSwipe's history integration pushes a #&gid/pid entry and calls
		// history.back() when closing; the resulting popstate can close a photo
		// opened in the meantime, so keep it off.
		history: false
	});
	// While the gallery animates out it keeps its (now invisible) overlay on top
	// of the page for ~350ms and would swallow clicks aimed at the thumbnails below.
	gallery.listen('close', function() {
		galleryClosing = true;
		pswpEl.style.pointerEvents = 'none';
	});
	gallery.listen('destroy', function() {
		gallery = null;
		galleryClosing = false;
		pswpEl.style.pointerEvents = '';
		if (pendingIndex !== null) {
			var next = pendingIndex;
			pendingIndex = null;
			// give the previous gallery's teardown (its pending transitions and
			// transitionend callbacks) a moment to finish before reusing the node
			setTimeout(function() { openGallery(pswpEl, items, next); }, 100);
		}
	});
	gallery.init();
}

/* TODO: Make the share function work */
$( document ).ready(function() {
	/*
	Initialise Photoswipe
	*/
	var items = []; // array of slide objects that will be passed to PhotoSwipe()
	// for every figure element on the page:
	$('figure').each( function() {
		if ($(this).attr('class') == 'no-photoswipe') return true; // ignore any figures where class="no-photoswipe"
		if (!$(this).find('a').attr('href')) return true; // ignore figures whose image is not linked, e.g. project tiles
		// get properties from child a/img/figcaption elements,
		var $figure = $(this),
			$a 		= $figure.find('a'),
			$img 	= $figure.find('img'),
			$src	= $a.attr('href'),
			$title  = $img.attr('alt'),
			$msrc	= $img.attr('src');
		// if data-size on <a> tag is set, read it and create an item
		if ($a.data('size')) {
			var $size 	= $a.data('size').split('x');
			var item = {
				src		: $src,
				w		: $size[0],
				h 		: $size[1],
				title 	: $title,
				msrc	: $msrc
			};
			//console.log("Using pre-defined dimensions for " + $src);
		// if not, set temp default size then load the image to check actual size
		} else {
			var item = {
				src		: $src,
				w		: 600, // temp default size
				h 		: 600, // temp default size
				title 	: $title,
				msrc	: $msrc
			};
			//console.log("Using default dimensions for " + $src);
			// load the image to check its dimensions
			// update the item as soon as w and h are known (check every 30ms)
			var img = new Image(); 
			img.src = $src;
			var wait = setInterval(function() {
				var w = img.naturalWidth,
					h = img.naturalHeight;
				if (w && h) {
					clearInterval(wait);
					item.w = w;
					item.h = h;
					//console.log("Got actual dimensions for " + img.src);
				}
			}, 30);
	   	}
		// Save the index of this image then add it to the array
		var index = items.length;
		items.push(item);
		// Event handler for click on a figure
		$figure.on('click', function(event) {
			event.preventDefault(); // prevent the normal behaviour i.e. load the <a> hyperlink
			// Get the PSWP element and initialise it with the desired options
			var $pswp = $('.pswp')[0];
			if (gallery) {
				// The previous gallery is still open or animating away. Opening a
				// second PhotoSwipe on the same element would be torn down by the
				// first one, so remember this click and replay it once it has gone.
				pendingIndex = index;
				if (!galleryClosing) {
					gallery.close();
				}
				return;
			}
			openGallery($pswp, items, index);
		});	
	});
});