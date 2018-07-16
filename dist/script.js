/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/downsample-lttb/index.js":
/*!***********************************************!*\
  !*** ./node_modules/downsample-lttb/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports.processData = function(series, threshold) {
	return largestTriangleThreeBuckets(series, threshold);
}

var floor = Math.floor,
	abs = Math.abs;

function largestTriangleThreeBuckets(data, threshold) {

	var data_length = data.length;
	if (threshold >= data_length || threshold === 0) {
		return data; // Nothing to do
	}

	var sampled = [],
		sampled_index = 0;

	// Bucket size. Leave room for start and end data points
	var every = (data_length - 2) / (threshold - 2);

	var a = 0,  // Initially a is the first point in the triangle
		max_area_point,
		max_area,
		area,
		next_a;

	sampled[ sampled_index++ ] = data[ a ]; // Always add the first point

	for (var i = 0; i < threshold - 2; i++) {

		// Calculate point average for next bucket (containing c)
		var avg_x = 0,
			avg_y = 0,
			avg_range_start  = floor( ( i + 1 ) * every ) + 1,
			avg_range_end    = floor( ( i + 2 ) * every ) + 1;
		avg_range_end = avg_range_end < data_length ? avg_range_end : data_length;

		var avg_range_length = avg_range_end - avg_range_start;

		for ( ; avg_range_start<avg_range_end; avg_range_start++ ) {
		  avg_x += data[ avg_range_start ][ 0 ] * 1; // * 1 enforces Number (value may be Date)
		  avg_y += data[ avg_range_start ][ 1 ] * 1;
		}
		avg_x /= avg_range_length;
		avg_y /= avg_range_length;

		// Get the range for this bucket
		var range_offs = floor( (i + 0) * every ) + 1,
			range_to   = floor( (i + 1) * every ) + 1;

		// Point a
		var point_a_x = data[ a ][ 0 ] * 1, // enforce Number (value may be Date)
			point_a_y = data[ a ][ 1 ] * 1;

		max_area = area = -1;

		for ( ; range_offs < range_to; range_offs++ ) {
			// Calculate triangle area over three buckets
			area = abs( ( point_a_x - avg_x ) * ( data[ range_offs ][ 1 ] - point_a_y ) -
						( point_a_x - data[ range_offs ][ 0 ] ) * ( avg_y - point_a_y )
					  ) * 0.5;
			if ( area > max_area ) {
				max_area = area;
				max_area_point = data[ range_offs ];
				next_a = range_offs; // Next a is this b
			}
		}

		sampled[ sampled_index++ ] = max_area_point; // Pick this point from the bucket
		a = next_a; // This a is the next a (chosen b)
	}

	sampled[ sampled_index++ ] = data[ data_length - 1 ]; // Always add last

	return sampled;
}



/***/ }),

/***/ "./node_modules/social-share-kit/dist/js/social-share-kit.min.js":
/*!***********************************************************************!*\
  !*** ./node_modules/social-share-kit/dist/js/social-share-kit.min.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Social Share Kit v1.0.15 (http://socialsharekit.com)
 * Copyright 2015 Social Share Kit / Kaspars Sprogis.
 * @Licensed under Creative Commons Attribution-NonCommercial 3.0 license:
 * https://github.com/darklow/social-share-kit/blob/master/LICENSE
 * ---
 */
var SocialShareKit=function(){function e(e){return b(e).share()}function t(e){"loading"!=document.readyState?e():document.addEventListener?document.addEventListener("DOMContentLoaded",e):document.attachEvent("onreadystatechange",function(){"loading"!=document.readyState&&e()})}function n(e){return document.querySelectorAll(e)}function r(e,t){for(var n=0;n<e.length;n++)t(e[n],n)}function o(e,t,n){e.addEventListener?e.addEventListener(t,n):e.attachEvent("on"+t,function(){n.call(e)})}function i(e,t,n){e.removeEventListener?e.removeEventListener(t,n):e.detachEvent("on"+t,n)}function a(e){return e.className.match(y)}function c(e){var t=e||window.event;return t.preventDefault?t.preventDefault():(t.returnValue=!1,t.cancelBubble=!0),t.currentTarget||t.srcElement}function s(e,t,n){var r,o,i,a;return t&&n?(o=document.documentElement.clientWidth/2-t/2,i=(document.documentElement.clientHeight-n)/2,a="status=1,resizable=yes,width="+t+",height="+n+",top="+i+",left="+o,r=window.open(e,"",a)):r=window.open(e),r.focus(),r}function u(e,t,n){var r,o=h(e,t,n),i=d(e,t,n,o),a="undefined"!=typeof o.title?o.title:l(t),c="undefined"!=typeof o.text?o.text:p(t),s=o.image?o.image:f("og:image"),u="undefined"!=typeof o.via?o.via:f("twitter:site"),m={shareUrl:i,title:a,text:c,image:s,via:u,options:e,shareUrlEncoded:function(){return encodeURIComponent(this.shareUrl)}};switch(t){case"facebook":r="https://www.facebook.com/share.php?u="+m.shareUrlEncoded();break;case"twitter":r="https://twitter.com/intent/tweet?url="+m.shareUrlEncoded()+"&text="+encodeURIComponent(a+(c&&a?" - ":"")+c),u&&(r+="&via="+u.replace("@",""));break;case"google-plus":r="https://plus.google.com/share?url="+m.shareUrlEncoded();break;case"pinterest":r="https://pinterest.com/pin/create/button/?url="+m.shareUrlEncoded()+"&description="+encodeURIComponent(c),s&&(r+="&media="+encodeURIComponent(s));break;case"tumblr":r="https://www.tumblr.com/share/link?url="+m.shareUrlEncoded()+"&name="+encodeURIComponent(a)+"&description="+encodeURIComponent(c);break;case"linkedin":r="https://www.linkedin.com/shareArticle?mini=true&url="+m.shareUrlEncoded()+"&title="+encodeURIComponent(a)+"&summary="+encodeURIComponent(c);break;case"vk":r="https://vkontakte.ru/share.php?url="+m.shareUrlEncoded();break;case"buffer":r="https://buffer.com/add?source=button&url="+m.shareUrlEncoded()+"&text="+encodeURIComponent(c);break;case"email":r="mailto:?subject="+encodeURIComponent(a)+"&body="+encodeURIComponent(a+"\n"+i+"\n\n"+c+"\n")}return m.networkUrl=r,e.onBeforeOpen&&e.onBeforeOpen(n,t,m),m.networkUrl}function d(e,t,n,r){return r=r||h(e,t,n),r.url||window.location.href}function l(e){var t;return"twitter"==e&&(t=f("twitter:title")),t||document.title}function p(e){var t;return"twitter"==e&&(t=f("twitter:description")),t||f("description")}function f(e,t){var r,o=n("meta["+(t?t:0===e.indexOf("og:")?"property":"name")+'="'+e+'"]');return o.length&&(r=o[0].getAttribute("content")||""),r||""}function h(e,t,n){var r,o,i,a,c=["url","title","text","image"],s={},u=n.parentNode;"twitter"==t&&c.push("via");for(a in c)o=c[a],i="data-"+o,r=n.getAttribute(i)||u.getAttribute(i)||(e[t]&&"undefined"!=typeof e[t][o]?e[t][o]:e[o]),"undefined"!=typeof r&&(s[o]=r);return s}function m(e,t){var n=document.createElement("div");n.innerHTML=t,n.className="ssk-num",e.appendChild(n)}function w(e,t,n,r){var o,i,a,c=encodeURIComponent(t);switch(e){case"facebook":o="https://graph.facebook.com/?id="+c,i=function(e){return r(e.share?e.share.share_count:0)};break;case"twitter":n&&n.twitter&&n.twitter.countCallback&&n.twitter.countCallback(t,r);break;case"google-plus":return o="https://clients6.google.com/rpc?key=AIzaSyCKSbrvQasunBoV16zDH9R33D88CeLr9gQ",a='[{"method":"pos.plusones.get","id":"p","params":{"id":"'+t+'","userId":"@viewer","groupId":"@self","nolog":true},"jsonrpc":"2.0","key":"p","apiVersion":"v1"}]',i=function(e){if(e=JSON.parse(e),e.length)return r(e[0].result.metadata.globalCounts.count)},void v(o,i,a);case"linkedin":o="https://www.linkedin.com/countserv/count/share?url="+c,i=function(e){return r(e.count)};break;case"pinterest":o="https://api.pinterest.com/v1/urls/count.json?url="+c,i=function(e){return r(e.count)};break;case"vk":o="https://vk.com/share.php?act=count&url="+c,i=function(e){return r(e)};break;case"buffer":o="https://api.bufferapp.com/1/links/shares.json?url="+c,i=function(e){return r(e.shares)}}o&&i&&k(e,o,i,a)}function v(e,t,n){var r=new XMLHttpRequest;r.onreadystatechange=function(){4===this.readyState&&this.status>=200&&this.status<400&&t(this.responseText)},r.open("POST",e,!0),r.setRequestHeader("Content-Type","application/json"),r.send(n)}function k(e,t,n){var r="cb_"+e+"_"+Math.round(1e5*Math.random()),o=document.createElement("script");return window[r]=function(e){try{delete window[r]}catch(e){}document.body.removeChild(o),n(e)},"vk"==e?window.VK={Share:{count:function(e,t){window[r](t)}}}:"google-plus"==e&&(window.services={gplus:{cb:window[r]}}),o.src=t+(t.indexOf("?")>=0?"&":"?")+"callback="+r,document.body.appendChild(o),!0}var b,g,y=/(twitter|facebook|google-plus|pinterest|tumblr|vk|linkedin|buffer|email)/,U="*|*";return g=function(e){var t=e||{},r=t.selector||".ssk";this.nodes=n(r),this.options=t},g.prototype={share:function(){function e(e){var t,n=c(e),r=a(n),o=r[0];if(r&&(t=u(p,o,n))){if(window.twttr&&n.getAttribute("href").indexOf("twitter.com/intent/")!==-1)return void n.setAttribute("href",t);if("email"!==o){var i,d;"buffer"===o?(i=800,d=680):(i=575,d=400);var l=s(t,i,d);if(p.onOpen&&p.onOpen(n,o,t,l),p.onClose)var f=window.setInterval(function(){l.closed!==!1&&(window.clearInterval(f),p.onClose(n,o,t,l))},250)}else document.location=t}}function n(){var e,t;for(e in f)t=e.split(U),function(e){w(t[0],t[1],p,function(t){for(var n in e)m(e[n],t)})}(f[e])}var l=this.nodes,p=this.options,f={},h=function(){l.length&&(r(l,function(t){var n,r=a(t);if(r){if(t.getAttribute("data-ssk-ready")){if(!p.reinitialize||!t._skkListener)return;i(t,"click",t._skkListener)}t.setAttribute("data-ssk-ready",!0),o(t,"click",e),t._skkListener=e,t.parentNode.className.indexOf("ssk-count")!==-1&&(r=r[0],n=r+U+d(p,r,t),n in f||(f[n]=[]),f[n].push(t))}}),n())};return p.forceInit===!0?h():t(h),this.nodes}},b=function(e){return new g(e)},{init:e}}();window.SocialShareKit=SocialShareKit;


/***/ }),

/***/ "./src/filter.js":
/*!***********************!*\
  !*** ./src/filter.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// const filters = [
//   {
//     btn: document.getElementById('filter-music'),
//     elements: document.querySelectorAll('.player--music')
//   },
//   {
//     btn: document.getElementById('filter-mixes'),
//     elements: document.querySelectorAll('.player--mix')
//   }
// ];
// const handleClick = (index, e) => {
//   e.preventDefault();
//   const f = filters.slice();
//   const filter = f.splice(index, 1)[0];
//   const other = f[0];
//   const isFiltered = other.btn.classList.contains('filtered');
//   filter.btn.classList.remove('filtered');
//   other.btn.classList.remove('filtered');
//   if(isFiltered) {
//     // Remove this filter
//     [].forEach.call(filter.elements, m => m.style.display = 'block');
//     [].forEach.call(other.elements, m => m.style.display = 'block');
//   } else {
//     // Filter the other tracks
//     other.btn.classList.add('filtered');
//     [].forEach.call(filter.elements, m => m.style.display = 'block');
//     [].forEach.call(other.elements, m => m.style.display = 'none');
//   }
// };
// filters.forEach((filter, i) => {
//   filter.btn.addEventListener('click', handleClick.bind(this, i));
// });


/***/ }),

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! social-share-kit */ "./node_modules/social-share-kit/dist/js/social-share-kit.min.js");

__webpack_require__(/*! ./filter */ "./src/filter.js");

var createWaveform = __webpack_require__(/*! ./waveform */ "./src/waveform.js");

__webpack_require__(/*! ./scss/style.scss */ "./src/scss/style.scss");

SocialShareKit.init();
var widgets = document.querySelectorAll('.player');
[].forEach.call(widgets, function (el) {
  var widget = SC.Widget(el.querySelector('.soundcloud-widget'));
  var trackArtwork = el.querySelector('.track-artwork');
  var trackTitle = el.querySelector('.track-title');
  var trackWaveform = el.querySelector('.waveform');
  var trackPermalink = el.querySelector('.track-permalink');
  var btnPlay = el.querySelector('.btn-play');
  var iconPlay = el.querySelector('.icon-play');
  var iconPause = el.querySelector('.icon-pause');
  var btnSharer = el.querySelector('.track-share');
  var sharer = el.querySelector('.sharer');

  var displayTrack = function displayTrack(track) {
    var artwork = track.artwork_url.replace('large', 't500x500');
    trackArtwork.setAttribute('src', artwork);
    var title = track.title;
    var permalink = track.permalink_url;
    trackTitle.textContent = title;
    trackPermalink.setAttribute('href', permalink); // Load the waveform JSON file

    window.fetch(track.waveform_url).then(function (res) {
      return res.json();
    }).then(function (wave) {
      createWaveform(trackWaveform, wave);
      window.addEventListener('resize', function () {
        return createWaveform(trackWaveform, wave);
      });
    }); // Update the links in the social sharer

    var shareLinks = sharer.querySelectorAll('a');
    var text = '';

    if (title.indexOf('Can\'t Wait Mix') == 0) {
      text += 'Listen to this hour long mix of house, chill and world music!';
    } else {
      text += 'This track is worth a listen!';
    }

    [].forEach.call(shareLinks, function (link) {
      link.dataset.title = title;
      link.dataset.text = text;
      link.dataset.url = permalink;
      link.dataset.image = artwork;
    });
  };

  widget.bind(SC.Widget.Events.READY, function () {
    widget.getCurrentSound(displayTrack);
  });
  widget.bind(SC.Widget.Events.PLAY, function () {
    iconPlay.style.display = 'none';
    iconPause.style.display = 'block';
  });
  widget.bind(SC.Widget.Events.PAUSE, function () {
    iconPause.style.display = 'none';
    iconPlay.style.display = 'block';
  });
  widget.bind(SC.Widget.Events.PLAY_PROGRESS, function (player) {
    var bars = trackWaveform.querySelectorAll('.bar');
    var filled = Math.ceil(bars.length * player.relativePosition);

    for (var i = 0; i < filled; i++) {
      bars[i].style.background = el.dataset.color || '#FA03D8';
    }
  });
  btnPlay.addEventListener('click', function () {
    return widget.toggle();
  });
  btnSharer.addEventListener('click', function () {
    if (sharer.style.display !== 'flex') {
      sharer.style.display = 'flex';
    } else {
      sharer.style.display = 'none';
    }
  });
});

/***/ }),

/***/ "./src/scss/style.scss":
/*!*****************************!*\
  !*** ./src/scss/style.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/waveform.js":
/*!*************************!*\
  !*** ./src/waveform.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var downsampler = __webpack_require__(/*! downsample-lttb */ "./node_modules/downsample-lttb/index.js");
/**
 * @param {Node} el The waveform element
 * @param {array} waveform The waveform JSON
 */


var createWaveform = function createWaveform(el, waveform) {
  // Empty waveform element
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  } // The amount of bars the waveform can hold in the current viewport


  var maxBars = Math.round(el.offsetWidth / 5); // Convert samples into graph plots [1, 140], [2, 90]

  var samples = waveform.samples.map(function (s, i) {
    return [i, s];
  }); // Resample array to the amount of bars we want

  samples = downsampler.processData(samples, maxBars); // Convert graph plots back into int array

  samples = samples.map(function (s) {
    return s[1];
  });
  samples.forEach(function (sample) {
    var bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = 40 * (sample / waveform.height) + 'px';
    el.appendChild(bar);
  });
};

module.exports = createWaveform;

/***/ })

/******/ });
//# sourceMappingURL=script.js.map