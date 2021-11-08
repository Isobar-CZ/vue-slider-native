/*!
  * vue-slider-native v0.0.1
  * (c) 2021 Isobar
  * @license ISC
  */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
	typeof define === 'function' && define.amd ? define(['vue'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["vue-slider-native"] = factory(global.vue));
})(this, (function (Vue) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var Vue__default = /*#__PURE__*/_interopDefaultLegacy(Vue);

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var vueScrollto = {exports: {}};

	/*!
	  * vue-scrollto v2.20.0
	  * (c) 2019 Randjelovic Igor
	  * @license MIT
	  */

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory() ;
	}(commonjsGlobal, (function () {
	  function _typeof(obj) {
	    "@babel/helpers - typeof";

	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function (obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function (obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _extends() {
	    _extends = Object.assign || function (target) {
	      for (var i = 1; i < arguments.length; i++) {
	        var source = arguments[i];

	        for (var key in source) {
	          if (Object.prototype.hasOwnProperty.call(source, key)) {
	            target[key] = source[key];
	          }
	        }
	      }

	      return target;
	    };

	    return _extends.apply(this, arguments);
	  }

	  /**
	   * https://github.com/gre/bezier-easing
	   * BezierEasing - use bezier curve for transition easing function
	   * by Gaëtan Renaudeau 2014 - 2015 – MIT License
	   */

	  // These values are established by empiricism with tests (tradeoff: performance VS precision)
	  var NEWTON_ITERATIONS = 4;
	  var NEWTON_MIN_SLOPE = 0.001;
	  var SUBDIVISION_PRECISION = 0.0000001;
	  var SUBDIVISION_MAX_ITERATIONS = 10;

	  var kSplineTableSize = 11;
	  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

	  var float32ArraySupported = typeof Float32Array === 'function';

	  function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
	  function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
	  function C (aA1)      { return 3.0 * aA1; }

	  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
	  function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

	  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
	  function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

	  function binarySubdivide (aX, aA, aB, mX1, mX2) {
	    var currentX, currentT, i = 0;
	    do {
	      currentT = aA + (aB - aA) / 2.0;
	      currentX = calcBezier(currentT, mX1, mX2) - aX;
	      if (currentX > 0.0) {
	        aB = currentT;
	      } else {
	        aA = currentT;
	      }
	    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
	    return currentT;
	  }

	  function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
	   for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
	     var currentSlope = getSlope(aGuessT, mX1, mX2);
	     if (currentSlope === 0.0) {
	       return aGuessT;
	     }
	     var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
	     aGuessT -= currentX / currentSlope;
	   }
	   return aGuessT;
	  }

	  function LinearEasing (x) {
	    return x;
	  }

	  var src = function bezier (mX1, mY1, mX2, mY2) {
	    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
	      throw new Error('bezier x values must be in [0, 1] range');
	    }

	    if (mX1 === mY1 && mX2 === mY2) {
	      return LinearEasing;
	    }

	    // Precompute samples table
	    var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
	    for (var i = 0; i < kSplineTableSize; ++i) {
	      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
	    }

	    function getTForX (aX) {
	      var intervalStart = 0.0;
	      var currentSample = 1;
	      var lastSample = kSplineTableSize - 1;

	      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
	        intervalStart += kSampleStepSize;
	      }
	      --currentSample;

	      // Interpolate to provide an initial guess for t
	      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
	      var guessForT = intervalStart + dist * kSampleStepSize;

	      var initialSlope = getSlope(guessForT, mX1, mX2);
	      if (initialSlope >= NEWTON_MIN_SLOPE) {
	        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
	      } else if (initialSlope === 0.0) {
	        return guessForT;
	      } else {
	        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
	      }
	    }

	    return function BezierEasing (x) {
	      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
	      if (x === 0) {
	        return 0;
	      }
	      if (x === 1) {
	        return 1;
	      }
	      return calcBezier(getTForX(x), mY1, mY2);
	    };
	  };

	  var easings = {
	    ease: [0.25, 0.1, 0.25, 1.0],
	    linear: [0.0, 0.0, 1.0, 1.0],
	    'ease-in': [0.42, 0.0, 1.0, 1.0],
	    'ease-out': [0.0, 0.0, 0.58, 1.0],
	    'ease-in-out': [0.42, 0.0, 0.58, 1.0]
	  };

	  // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
	  var supportsPassive = false;

	  try {
	    var opts = Object.defineProperty({}, 'passive', {
	      get: function get() {
	        supportsPassive = true;
	      }
	    });
	    window.addEventListener('test', null, opts);
	  } catch (e) {}

	  var _ = {
	    $: function $(selector) {
	      if (typeof selector !== 'string') {
	        return selector;
	      }

	      return document.querySelector(selector);
	    },
	    on: function on(element, events, handler) {
	      var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
	        passive: false
	      };

	      if (!(events instanceof Array)) {
	        events = [events];
	      }

	      for (var i = 0; i < events.length; i++) {
	        element.addEventListener(events[i], handler, supportsPassive ? opts : false);
	      }
	    },
	    off: function off(element, events, handler) {
	      if (!(events instanceof Array)) {
	        events = [events];
	      }

	      for (var i = 0; i < events.length; i++) {
	        element.removeEventListener(events[i], handler);
	      }
	    },
	    cumulativeOffset: function cumulativeOffset(element) {
	      var top = 0;
	      var left = 0;

	      do {
	        top += element.offsetTop || 0;
	        left += element.offsetLeft || 0;
	        element = element.offsetParent;
	      } while (element);

	      return {
	        top: top,
	        left: left
	      };
	    }
	  };

	  var abortEvents = ['mousedown', 'wheel', 'DOMMouseScroll', 'mousewheel', 'keyup', 'touchmove'];
	  var defaults = {
	    container: 'body',
	    duration: 500,
	    lazy: true,
	    easing: 'ease',
	    offset: 0,
	    force: true,
	    cancelable: true,
	    onStart: false,
	    onDone: false,
	    onCancel: false,
	    x: false,
	    y: true
	  };
	  function setDefaults(options) {
	    defaults = _extends({}, defaults, options);
	  }
	  var scroller = function scroller() {
	    var element; // element to scroll to

	    var container; // container to scroll

	    var duration; // duration of the scrolling

	    var easing; // easing to be used when scrolling

	    var lazy; // checks the target position at each step

	    var offset; // offset to be added (subtracted)

	    var force; // force scroll, even if element is visible

	    var cancelable; // indicates if user can cancel the scroll or not.

	    var onStart; // callback when scrolling is started

	    var onDone; // callback when scrolling is done

	    var onCancel; // callback when scrolling is canceled / aborted

	    var x; // scroll on x axis

	    var y; // scroll on y axis

	    var initialX; // initial X of container

	    var targetX; // target X of container

	    var initialY; // initial Y of container

	    var targetY; // target Y of container

	    var diffX; // difference

	    var diffY; // difference

	    var abort; // is scrolling aborted

	    var cumulativeOffsetContainer;
	    var cumulativeOffsetElement;
	    var abortEv; // event that aborted scrolling

	    var abortFn = function abortFn(e) {
	      if (!cancelable) return;
	      abortEv = e;
	      abort = true;
	    };

	    var easingFn;
	    var timeStart; // time when scrolling started

	    var timeElapsed; // time elapsed since scrolling started

	    var progress; // progress

	    function scrollTop(container) {
	      var scrollTop = container.scrollTop;

	      if (container.tagName.toLowerCase() === 'body') {
	        // in firefox body.scrollTop always returns 0
	        // thus if we are trying to get scrollTop on a body tag
	        // we need to get it from the documentElement
	        scrollTop = scrollTop || document.documentElement.scrollTop;
	      }

	      return scrollTop;
	    }

	    function scrollLeft(container) {
	      var scrollLeft = container.scrollLeft;

	      if (container.tagName.toLowerCase() === 'body') {
	        // in firefox body.scrollLeft always returns 0
	        // thus if we are trying to get scrollLeft on a body tag
	        // we need to get it from the documentElement
	        scrollLeft = scrollLeft || document.documentElement.scrollLeft;
	      }

	      return scrollLeft;
	    }

	    function recalculateTargets() {
	      cumulativeOffsetContainer = _.cumulativeOffset(container);
	      cumulativeOffsetElement = _.cumulativeOffset(element);

	      if (x) {
	        targetX = cumulativeOffsetElement.left - cumulativeOffsetContainer.left + offset;
	        diffX = targetX - initialX;
	      }

	      if (y) {
	        targetY = cumulativeOffsetElement.top - cumulativeOffsetContainer.top + offset;
	        diffY = targetY - initialY;
	      }
	    }

	    function step(timestamp) {
	      if (abort) return done();
	      if (!timeStart) timeStart = timestamp; // When a site has a lot of media that can be loaded asynchronously,
	      // the targetY/targetX may end up in the wrong place during scrolling.
	      // So we will check this at each step

	      if (!lazy) {
	        recalculateTargets();
	      }

	      timeElapsed = timestamp - timeStart;
	      progress = Math.min(timeElapsed / duration, 1);
	      progress = easingFn(progress);
	      topLeft(container, initialY + diffY * progress, initialX + diffX * progress);
	      timeElapsed < duration ? window.requestAnimationFrame(step) : done();
	    }

	    function done() {
	      if (!abort) topLeft(container, targetY, targetX);
	      timeStart = false;

	      _.off(container, abortEvents, abortFn);

	      if (abort && onCancel) onCancel(abortEv, element);
	      if (!abort && onDone) onDone(element);
	    }

	    function topLeft(element, top, left) {
	      if (y) element.scrollTop = top;
	      if (x) element.scrollLeft = left;

	      if (element.tagName.toLowerCase() === 'body') {
	        // in firefox body.scrollTop doesn't scroll the page
	        // thus if we are trying to scrollTop on a body tag
	        // we need to scroll on the documentElement
	        if (y) document.documentElement.scrollTop = top;
	        if (x) document.documentElement.scrollLeft = left;
	      }
	    }

	    function scrollTo(target, _duration) {
	      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      if (_typeof(_duration) === 'object') {
	        options = _duration;
	      } else if (typeof _duration === 'number') {
	        options.duration = _duration;
	      }

	      element = _.$(target);

	      if (!element) {
	        return console.warn('[vue-scrollto warn]: Trying to scroll to an element that is not on the page: ' + target);
	      }

	      container = _.$(options.container || defaults.container);
	      duration = options.hasOwnProperty('duration') ? options.duration : defaults.duration;
	      lazy = options.hasOwnProperty('lazy') ? options.lazy : defaults.lazy;
	      easing = options.easing || defaults.easing;
	      offset = options.hasOwnProperty('offset') ? options.offset : defaults.offset;
	      force = options.hasOwnProperty('force') ? options.force !== false : defaults.force;
	      cancelable = options.hasOwnProperty('cancelable') ? options.cancelable !== false : defaults.cancelable;
	      onStart = options.onStart || defaults.onStart;
	      onDone = options.onDone || defaults.onDone;
	      onCancel = options.onCancel || defaults.onCancel;
	      x = options.x === undefined ? defaults.x : options.x;
	      y = options.y === undefined ? defaults.y : options.y;

	      if (typeof offset === 'function') {
	        offset = offset(element, container);
	      }

	      initialX = scrollLeft(container);
	      initialY = scrollTop(container); // calculates cumulative offsets and targetX/Y + diffX/Y

	      recalculateTargets();
	      abort = false;

	      if (!force) {
	        // When the container is the default (body) we need to use the viewport
	        // height, not the entire body height
	        var containerHeight = container.tagName.toLowerCase() === 'body' ? document.documentElement.clientHeight || window.innerHeight : container.offsetHeight;
	        var containerTop = initialY;
	        var containerBottom = containerTop + containerHeight;
	        var elementTop = targetY - offset;
	        var elementBottom = elementTop + element.offsetHeight;

	        if (elementTop >= containerTop && elementBottom <= containerBottom) {
	          // make sure to call the onDone callback even if there is no need to
	          // scroll the container. Fixes #111 (ref #118)
	          if (onDone) onDone(element);
	          return;
	        }
	      }

	      if (onStart) onStart(element);

	      if (!diffY && !diffX) {
	        if (onDone) onDone(element);
	        return;
	      }

	      if (typeof easing === 'string') {
	        easing = easings[easing] || easings['ease'];
	      }

	      easingFn = src.apply(src, easing);

	      _.on(container, abortEvents, abortFn, {
	        passive: true
	      });

	      window.requestAnimationFrame(step);
	      return function () {
	        abortEv = null;
	        abort = true;
	      };
	    }

	    return scrollTo;
	  };

	  var _scroller = scroller();

	  var bindings = []; // store binding data

	  function deleteBinding(el) {
	    for (var i = 0; i < bindings.length; ++i) {
	      if (bindings[i].el === el) {
	        bindings.splice(i, 1);
	        return true;
	      }
	    }

	    return false;
	  }

	  function findBinding(el) {
	    for (var i = 0; i < bindings.length; ++i) {
	      if (bindings[i].el === el) {
	        return bindings[i];
	      }
	    }
	  }

	  function getBinding(el) {
	    var binding = findBinding(el);

	    if (binding) {
	      return binding;
	    }

	    bindings.push(binding = {
	      el: el,
	      binding: {}
	    });
	    return binding;
	  }

	  function handleClick(e) {
	    var ctx = getBinding(this).binding;
	    if (!ctx.value) return;
	    e.preventDefault();

	    if (typeof ctx.value === 'string') {
	      return _scroller(ctx.value);
	    }

	    _scroller(ctx.value.el || ctx.value.element, ctx.value);
	  }

	  var directiveHooks = {
	    bind: function bind(el, binding) {
	      getBinding(el).binding = binding;

	      _.on(el, 'click', handleClick);
	    },
	    unbind: function unbind(el) {
	      deleteBinding(el);

	      _.off(el, 'click', handleClick);
	    },
	    update: function update(el, binding) {
	      getBinding(el).binding = binding;
	    }
	  };
	  var VueScrollTo = {
	    bind: directiveHooks.bind,
	    unbind: directiveHooks.unbind,
	    update: directiveHooks.update,
	    beforeMount: directiveHooks.bind,
	    unmounted: directiveHooks.unbind,
	    updated: directiveHooks.update,
	    scrollTo: _scroller,
	    bindings: bindings
	  };

	  var install = function install(Vue, options) {
	    if (options) setDefaults(options);
	    Vue.directive('scroll-to', VueScrollTo);
	    var properties = Vue.config.globalProperties || Vue.prototype;
	    properties.$scrollTo = VueScrollTo.scrollTo;
	  };

	  if (typeof window !== 'undefined' && window.Vue) {
	    window.VueScrollTo = VueScrollTo;
	    window.VueScrollTo.setDefaults = setDefaults;
	    window.VueScrollTo.scroller = scroller;
	    if (window.Vue.use) window.Vue.use(install);
	  }

	  VueScrollTo.install = install;

	  return VueScrollTo;

	})));
	}(vueScrollto));

	var VueScrollTo = vueScrollto.exports;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

	var freeGlobal$1 = freeGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal$1 || freeSelf || Function('return this')();

	var root$1 = root;

	/** Built-in value references. */
	var Symbol$1 = root$1.Symbol;

	var Symbol$2 = Symbol$1;

	/** Used for built-in method references. */
	var objectProto$1 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto$1.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString$1 = objectProto$1.toString;

	/** Built-in value references. */
	var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
	      tag = value[symToStringTag$1];

	  try {
	    value[symToStringTag$1] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString$1.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag$1] = tag;
	    } else {
	      delete value[symToStringTag$1];
	    }
	  }
	  return result;
	}

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? getRawTag(value)
	    : objectToString(value);
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && baseGetTag(value) == symbolTag);
	}

	/** Used to match a single whitespace character. */
	var reWhitespace = /\s/;

	/**
	 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
	 * character of `string`.
	 *
	 * @private
	 * @param {string} string The string to inspect.
	 * @returns {number} Returns the index of the last non-whitespace character.
	 */
	function trimmedEndIndex(string) {
	  var index = string.length;

	  while (index-- && reWhitespace.test(string.charAt(index))) {}
	  return index;
	}

	/** Used to match leading whitespace. */
	var reTrimStart = /^\s+/;

	/**
	 * The base implementation of `_.trim`.
	 *
	 * @private
	 * @param {string} string The string to trim.
	 * @returns {string} Returns the trimmed string.
	 */
	function baseTrim(string) {
	  return string
	    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
	    : string;
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = baseTrim(value);
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}

	/**
	 * Gets the timestamp of the number of milliseconds that have elapsed since
	 * the Unix epoch (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Date
	 * @returns {number} Returns the timestamp.
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => Logs the number of milliseconds it took for the deferred invocation.
	 */
	var now = function() {
	  return root$1.Date.now();
	};

	var now$1 = now;

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeMin = Math.min;

	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed `func` invocations and a `flush` method to immediately invoke them.
	 * Provide `options` to indicate whether `func` should be invoked on the
	 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	 * with the last arguments provided to the debounced function. Subsequent
	 * calls to the debounced function return the result of the last `func`
	 * invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the debounced function
	 * is invoked more than once during the `wait` timeout.
	 *
	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=false]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {number} [options.maxWait]
	 *  The maximum time `func` is allowed to be delayed before it's invoked.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // Avoid costly calculations while the window size is in flux.
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
	 * jQuery(element).on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
	 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', debounced);
	 *
	 * // Cancel the trailing debounced invocation.
	 * jQuery(window).on('popstate', debounced.cancel);
	 */
	function debounce(func, wait, options) {
	  var lastArgs,
	      lastThis,
	      maxWait,
	      result,
	      timerId,
	      lastCallTime,
	      lastInvokeTime = 0,
	      leading = false,
	      maxing = false,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = toNumber(wait) || 0;
	  if (isObject(options)) {
	    leading = !!options.leading;
	    maxing = 'maxWait' in options;
	    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }

	  function invokeFunc(time) {
	    var args = lastArgs,
	        thisArg = lastThis;

	    lastArgs = lastThis = undefined;
	    lastInvokeTime = time;
	    result = func.apply(thisArg, args);
	    return result;
	  }

	  function leadingEdge(time) {
	    // Reset any `maxWait` timer.
	    lastInvokeTime = time;
	    // Start the timer for the trailing edge.
	    timerId = setTimeout(timerExpired, wait);
	    // Invoke the leading edge.
	    return leading ? invokeFunc(time) : result;
	  }

	  function remainingWait(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime,
	        timeWaiting = wait - timeSinceLastCall;

	    return maxing
	      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
	      : timeWaiting;
	  }

	  function shouldInvoke(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime;

	    // Either this is the first call, activity has stopped and we're at the
	    // trailing edge, the system time has gone backwards and we're treating
	    // it as the trailing edge, or we've hit the `maxWait` limit.
	    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
	      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
	  }

	  function timerExpired() {
	    var time = now$1();
	    if (shouldInvoke(time)) {
	      return trailingEdge(time);
	    }
	    // Restart the timer.
	    timerId = setTimeout(timerExpired, remainingWait(time));
	  }

	  function trailingEdge(time) {
	    timerId = undefined;

	    // Only invoke if we have `lastArgs` which means `func` has been
	    // debounced at least once.
	    if (trailing && lastArgs) {
	      return invokeFunc(time);
	    }
	    lastArgs = lastThis = undefined;
	    return result;
	  }

	  function cancel() {
	    if (timerId !== undefined) {
	      clearTimeout(timerId);
	    }
	    lastInvokeTime = 0;
	    lastArgs = lastCallTime = lastThis = timerId = undefined;
	  }

	  function flush() {
	    return timerId === undefined ? result : trailingEdge(now$1());
	  }

	  function debounced() {
	    var time = now$1(),
	        isInvoking = shouldInvoke(time);

	    lastArgs = arguments;
	    lastThis = this;
	    lastCallTime = time;

	    if (isInvoking) {
	      if (timerId === undefined) {
	        return leadingEdge(lastCallTime);
	      }
	      if (maxing) {
	        // Handle invocations in a tight loop.
	        clearTimeout(timerId);
	        timerId = setTimeout(timerExpired, wait);
	        return invokeFunc(lastCallTime);
	      }
	    }
	    if (timerId === undefined) {
	      timerId = setTimeout(timerExpired, wait);
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  debounced.flush = flush;
	  return debounced;
	}

	//

	Vue__default["default"].use(VueScrollTo);

	const defaultOptions = {
		moveOnClick: true,
		centerMode: false,
		sticky: false,
		dots: false,
		arrows: true,
		highlightItems: 1
	};

	var script = {
		name: 'VueSliderNative',

		props: {
			scrollerId: {
				type: String,
				default: 'scroller'
			},
			items: {
				type: Array,
				required: true
			},
			component: {
				type: Object,
				required: true
			},
			options: {
				type: Object,
				default: () => {}
			}
		},

		data() {
			return {
				debouncedHandleHorizontalScroll: null,
				movementOrigin: null,
				activeItem: 0,
				isOnStart: true,
				isOnEnd: false,
				firstMove: true
			};
		},

		computed: {
			computedOptions() {
				return {
					...defaultOptions,
					...this.options
				};
			},
			itemCount() {
				return this.items.length;
			}
		},

		watch: {
			activeItem() {
				this.$emit('activeItemUpdated', this.activeItem);
			}
		},

		mounted() {
			this.debouncedHandleHorizontalScroll = debounce(this.handleScroll, 50);
			this.$refs.scroller.addEventListener('scroll', this.debouncedHandleHorizontalScroll);

			const preactivated = this.items.findIndex((item) => item.preactivated);
			if (preactivated && !this.isResponsiveVersion) {
				/*
					another setTimeout, but without anything or even with nextTick or updated() it didn't scroll,
					it just highlighted preactivated item (maybe some problem with vue-scrollto?)
				*/
				setTimeout(() => {
					this.isReady = true;
					this.moveCarousel(preactivated, 'preactivated');
				}, 100);
			}
		},

		beforeDestroy() {
			this.$refs.scroller.removeEventListener('scroll', this.debouncedHandleHorizontalScroll);
		},

		methods: {
			arrowNavigation(direction) {
				if (!this.movementOrigin) {
					const moveTo = direction === 'prev' ? this.activeItem - 1 : this.activeItem + 1;
					this.moveCarousel(moveTo, 'arrows');
				}
			},

			handleScroll() {
				if (!this.movementOrigin && this.$refs['scroller-row']) {
					this.movementOrigin = 'scroll';
					const row = this.$refs['scroller-row'];
					const carouselItems = this.getScrollerHtmlElements();
					let xBoundaries;

					if (this.computedOptions.centerMode && !this.isResponsiveVersion) {
						xBoundaries = carouselItems.map((element) => (row.offsetWidth / 2) - (carouselItems[0].offsetWidth / 2) - element.getBoundingClientRect().x);
					} else {
						xBoundaries = carouselItems.map((element) => row.offsetLeft - element.getBoundingClientRect().x);
					}

					const closestValue = xBoundaries.reduce((prev, curr) => (Math.abs(curr) < Math.abs(prev) ? curr : prev));
					const closestIndex = xBoundaries.indexOf(closestValue);

					if (this.computedOptions.sticky) {
						this.moveCarousel(closestIndex);
					} else {
						this.activeItem = closestIndex;
					}

					this.handleArrows();

					this.movementOrigin = null;
				}
			},

			moveCarousel(moveTo, origin) {
				if (!this.movementOrigin) {
					if (origin === 'item' && !this.computedOptions.moveOnClick) {
						return;
					}
					// const direction = moveTo > this.activeItem ? 'right' : 'left';

					this.movementOrigin = origin;
					this.activeItem = moveTo;
					this.activeItem = this.activeItem > this.itemCount ? this.itemCount : this.activeItem;
					this.activeItem = this.activeItem < 0 ? 0 : this.activeItem;

					const element = `#${this.scrollerId}-${this.activeItem}`;

					let offset;

					if (this.$refs['scroller-row']) {
						// TODO: scroll to last element seems to be getting higher value than necessary
						offset = (this.$refs['scroller-row'].offsetLeft * -1) - 20;
					}

					this.$scrollTo(element, 300, {
						container: `#${this.scrollerId}`,
						easing: 'ease-in',
						duration: 100,
						offset,
						x: true,
						y: false,
						cancelable: false,
						onDone: this.scrollToDone()
					});
				}
			},

			handleArrows() {
				const element = this.$refs.scroller;
				this.isOnStart = element.scrollLeft < 100;
				this.isOnEnd = ((element.scrollWidth - element.scrollLeft) === element.clientWidth) || (this.activeItem - 1) === this.itemCount;
			},

			scrollToDone() {
				/*
					This should be launched only from vue-scrollto/nuxt!
					It needs to be wrapped in timeout because onDone
					from vue-scrollto/nuxt is launching sooner than is really done
				*/
				setTimeout(() => {
					this.handleArrows();
				}, 350);

				// reset movement origin (setTimeout because scrollHandler was launching before arrows navigation was done)
				setTimeout(() => {
					this.movementOrigin = null;
				}, 500);
			},

			getScrollerHtmlElements() {
				return [...this.$refs['scroller-row'].children].filter((child) => child.className.includes('scroller__item'));
			}
		}
	};

	function styleInject(css, ref) {
	  if ( ref === void 0 ) ref = {};
	  var insertAt = ref.insertAt;

	  if (!css || typeof document === 'undefined') { return; }

	  var head = document.head || document.getElementsByTagName('head')[0];
	  var style = document.createElement('style');
	  style.type = 'text/css';

	  if (insertAt === 'top') {
	    if (head.firstChild) {
	      head.insertBefore(style, head.firstChild);
	    } else {
	      head.appendChild(style);
	    }
	  } else {
	    head.appendChild(style);
	  }

	  if (style.styleSheet) {
	    style.styleSheet.cssText = css;
	  } else {
	    style.appendChild(document.createTextNode(css));
	  }
	}

	var css_248z = ".scroller[data-v-06c857bf] {\n  position: relative;\n  overflow: hidden;\n}\n.scroller__wrapper[data-v-06c857bf] {\n  position: relative;\n}\n.scroller__main[data-v-06c857bf] {\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n  scrollbar-height: none;\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n.scroller__main[data-v-06c857bf]::-webkit-scrollbar {\n  display: none;\n}\n.scroller__content[data-v-06c857bf] {\n  display: flex;\n  flex-wrap: nowrap;\n}\n.scroller__content[data-v-06c857bf]::before, .scroller__content[data-v-06c857bf]::after {\n  display: block;\n  flex: 0 0 0.9375rem;\n  height: 0.9375rem;\n  content: \"\";\n}\n.scroller__arrows[data-v-06c857bf] {\n  display: flex;\n  justify-content: space-between;\n}\n.scroller__arrow[data-v-06c857bf] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 2rem;\n  font-family: inherit;\n  background: none;\n  border: 0;\n  outline: 0;\n  cursor: pointer;\n  transition: all 300ms ease-in-out;\n}\n.scroller__arrow--prev[data-v-06c857bf] {\n  margin-right: auto;\n}\n.scroller__arrow--prev svg[data-v-06c857bf] {\n  margin-right: 0.625rem;\n}\n.scroller__arrow--next[data-v-06c857bf] {\n  margin-left: auto;\n}\n.scroller__arrow--next svg[data-v-06c857bf] {\n  margin-left: 0.625rem;\n}\n.scroller__arrow[data-v-06c857bf]:hover, .scroller__arrow[data-v-06c857bf]:focus {\n  text-shadow: -0.25px -0.25px 0 #262626, 0.25px 0.25px #262626;\n}\n.scroller__dots[data-v-06c857bf] {\n  display: flex;\n  justify-content: center;\n  margin-top: 1.5rem;\n}\n.scroller__dots button[data-v-06c857bf] {\n  flex: 0 0 0.5rem;\n  width: 0.5rem;\n  height: 0.5rem;\n  padding: 0;\n  background: rgba(0, 0, 0, 0.1);\n  border: 0;\n  border-radius: 50%;\n  outline: 0;\n  cursor: pointer;\n  transition: background 300ms ease-in-out;\n}\n.scroller__dots button + button[data-v-06c857bf] {\n  margin-left: 0.625rem;\n}\n.scroller__dots button[data-v-06c857bf]:hover, .scroller__dots button[data-v-06c857bf]:focus {\n  background: #c4c4c4;\n}\n.scroller__dots button.is-active[data-v-06c857bf] {\n  background: black;\n}\n.fade-enter-active[data-v-06c857bf],\n.fade-leave-active[data-v-06c857bf] {\n  transition: opacity 300ms ease-in-out;\n}\n.fade-enter[data-v-06c857bf],\n.fade-leave-to[data-v-06c857bf] {\n  opacity: 0;\n}";
	styleInject(css_248z);

	function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
	    if (typeof shadowMode !== 'boolean') {
	        createInjectorSSR = createInjector;
	        createInjector = shadowMode;
	        shadowMode = false;
	    }
	    // Vue.extend constructor export interop.
	    const options = typeof script === 'function' ? script.options : script;
	    // render functions
	    if (template && template.render) {
	        options.render = template.render;
	        options.staticRenderFns = template.staticRenderFns;
	        options._compiled = true;
	        // functional template
	        if (isFunctionalTemplate) {
	            options.functional = true;
	        }
	    }
	    // scopedId
	    if (scopeId) {
	        options._scopeId = scopeId;
	    }
	    let hook;
	    if (moduleIdentifier) {
	        // server build
	        hook = function (context) {
	            // 2.3 injection
	            context =
	                context || // cached call
	                    (this.$vnode && this.$vnode.ssrContext) || // stateful
	                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
	            // 2.2 with runInNewContext: true
	            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
	                context = __VUE_SSR_CONTEXT__;
	            }
	            // inject component styles
	            if (style) {
	                style.call(this, createInjectorSSR(context));
	            }
	            // register component module identifier for async chunk inference
	            if (context && context._registeredComponents) {
	                context._registeredComponents.add(moduleIdentifier);
	            }
	        };
	        // used by ssr in case component is cached and beforeCreate
	        // never gets called
	        options._ssrRegister = hook;
	    }
	    else if (style) {
	        hook = shadowMode
	            ? function (context) {
	                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
	            }
	            : function (context) {
	                style.call(this, createInjector(context));
	            };
	    }
	    if (hook) {
	        if (options.functional) {
	            // register for functional component in vue file
	            const originalRender = options.render;
	            options.render = function renderWithStyleInjection(h, context) {
	                hook.call(context);
	                return originalRender(h, context);
	            };
	        }
	        else {
	            // inject component registration as beforeCreate hook
	            const existing = options.beforeCreate;
	            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
	        }
	    }
	    return script;
	}

	/* script */
	const __vue_script__ = script;
	/* template */
	var __vue_render__ = function () {
	  var _vm = this;
	  var _h = _vm.$createElement;
	  var _c = _vm._self._c || _h;
	  return _c(
	    "div",
	    {
	      staticClass: "scroller",
	      on: {
	        keydown: [
	          function ($event) {
	            if (
	              !$event.type.indexOf("key") &&
	              _vm._k($event.keyCode, "left", 37, $event.key, [
	                "Left",
	                "ArrowLeft",
	              ])
	            ) {
	              return null
	            }
	            if ("button" in $event && $event.button !== 0) {
	              return null
	            }
	            return _vm.arrowNavigation("prev")
	          },
	          function ($event) {
	            if (
	              !$event.type.indexOf("key") &&
	              _vm._k($event.keyCode, "right", 39, $event.key, [
	                "Right",
	                "ArrowRight",
	              ])
	            ) {
	              return null
	            }
	            if ("button" in $event && $event.button !== 2) {
	              return null
	            }
	            return _vm.arrowNavigation("next")
	          },
	        ],
	      },
	    },
	    [
	      _c("div", { staticClass: "scroller__wrapper" }, [
	        _vm.computedOptions.arrows
	          ? _c(
	              "div",
	              { staticClass: "scroller__arrows row" },
	              [
	                _c("transition", { attrs: { name: "fade" } }, [
	                  _c(
	                    "button",
	                    {
	                      directives: [
	                        {
	                          name: "show",
	                          rawName: "v-show",
	                          value: !_vm.isOnStart,
	                          expression: "!isOnStart",
	                        },
	                      ],
	                      staticClass: "scroller__arrow scroller__arrow--prev svg",
	                      on: {
	                        click: function ($event) {
	                          return _vm.arrowNavigation("prev")
	                        },
	                      },
	                    },
	                    [
	                      !_vm.$slots["prevArrow"]
	                        ? [
	                            _c(
	                              "svg",
	                              {
	                                attrs: {
	                                  width: "24",
	                                  height: "24",
	                                  viewBox: "0 0 24 24",
	                                  fill: "none",
	                                  xmlns: "http://www.w3.org/2000/svg",
	                                },
	                              },
	                              [
	                                _c("path", {
	                                  attrs: {
	                                    d: "M15.41 16.58L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.58Z",
	                                    fill: "black",
	                                  },
	                                }),
	                              ]
	                            ),
	                            _vm._v(" "),
	                            _c("span", [_vm._v("Previous")]),
	                          ]
	                        : _vm._t("prevArrow"),
	                    ],
	                    2
	                  ),
	                ]),
	                _vm._v(" "),
	                _c("transition", { attrs: { name: "fade" } }, [
	                  _c(
	                    "button",
	                    {
	                      directives: [
	                        {
	                          name: "show",
	                          rawName: "v-show",
	                          value: !_vm.isOnEnd,
	                          expression: "!isOnEnd",
	                        },
	                      ],
	                      staticClass: "scroller__arrow scroller__arrow--next svg",
	                      on: {
	                        click: function ($event) {
	                          return _vm.arrowNavigation("next")
	                        },
	                      },
	                    },
	                    [
	                      !_vm.$slots["prevArrow"]
	                        ? [
	                            _c("span", [_vm._v("Next")]),
	                            _vm._v(" "),
	                            _c(
	                              "svg",
	                              {
	                                attrs: {
	                                  width: "24",
	                                  height: "24",
	                                  viewBox: "0 0 24 24",
	                                  fill: "none",
	                                  xmlns: "http://www.w3.org/2000/svg",
	                                },
	                              },
	                              [
	                                _c("path", {
	                                  attrs: {
	                                    d: "M8.58984 16.58L13.1698 12L8.58984 7.41L9.99984 6L15.9998 12L9.99984 18L8.58984 16.58Z",
	                                    fill: "black",
	                                  },
	                                }),
	                              ]
	                            ),
	                          ]
	                        : _vm._t("prevArrow"),
	                    ],
	                    2
	                  ),
	                ]),
	              ],
	              1
	            )
	          : _vm._e(),
	        _vm._v(" "),
	        _c(
	          "div",
	          {
	            ref: "scroller",
	            staticClass: "scroller__main",
	            attrs: { id: _vm.scrollerId },
	          },
	          [
	            _c(
	              "div",
	              { ref: "scroller-row", staticClass: "scroller__content row" },
	              [
	                _vm._l(_vm.items, function (item, index) {
	                  return _c(_vm.component, {
	                    key: "element-" + index,
	                    tag: "component",
	                    staticClass: "scroller__item",
	                    class: {
	                      "is-active":
	                        index === _vm.activeItem ||
	                        (index > _vm.activeItem &&
	                          index <
	                            _vm.activeItem +
	                              _vm.computedOptions.highlightItems),
	                      "is-prev": index < _vm.activeItem,
	                      "is-next":
	                        index >
	                        _vm.activeItem + _vm.computedOptions.highlightItems,
	                    },
	                    attrs: { id: _vm.scrollerId + "-" + index, item: item },
	                    nativeOn: {
	                      click: function ($event) {
	                        return _vm.moveCarousel(index, "item")
	                      },
	                    },
	                  })
	                }),
	                _vm._v(" "),
	                _vm.$slots["end"]
	                  ? _c(
	                      "div",
	                      {
	                        staticClass: "scroller__item",
	                        attrs: {
	                          id: _vm.scrollerId + "-" + (_vm.items.length + 1),
	                        },
	                      },
	                      [_vm._t("end")],
	                      2
	                    )
	                  : _vm._e(),
	              ],
	              2
	            ),
	          ]
	        ),
	      ]),
	      _vm._v(" "),
	      _vm.computedOptions.dots
	        ? _c(
	            "div",
	            { staticClass: "scroller__dots" },
	            _vm._l(_vm.itemCount, function (index) {
	              return _c("button", {
	                key: index,
	                class: { "is-active": _vm.activeItem === index - 1 },
	                on: {
	                  click: function ($event) {
	                    return _vm.moveCarousel(index - 1, "dot")
	                  },
	                },
	              })
	            }),
	            0
	          )
	        : _vm._e(),
	    ]
	  )
	};
	var __vue_staticRenderFns__ = [];
	__vue_render__._withStripped = true;

	  /* style */
	  const __vue_inject_styles__ = undefined;
	  /* scoped */
	  const __vue_scope_id__ = "data-v-06c857bf";
	  /* module identifier */
	  const __vue_module_identifier__ = undefined;
	  /* functional template */
	  const __vue_is_functional_template__ = false;
	  /* style inject */
	  
	  /* style inject SSR */
	  
	  /* style inject shadow dom */
	  

	  
	  const __vue_component__ = /*#__PURE__*/normalizeComponent(
	    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
	    __vue_inject_styles__,
	    __vue_script__,
	    __vue_scope_id__,
	    __vue_is_functional_template__,
	    __vue_module_identifier__,
	    false,
	    undefined,
	    undefined,
	    undefined
	  );

	return __vue_component__;

}));
