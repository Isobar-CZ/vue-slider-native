/*!
  * vue-slider-native v0.0.1
  * (c) 2021 Isobar
  * @license ISC
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["vue-slider-native"] = factory());
})(this, (function () { 'use strict';

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  var freeGlobal$1 = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal$1 || freeSelf || Function('return this')();

  var root$1 = root;

  /** Built-in value references. */
  var Symbol = root$1.Symbol;

  var Symbol$1 = Symbol;

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
  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

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
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

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

  var script = {
  	name: 'DentsuScroller',

  	props: {
  		scrollerId: {
  			type: String,
  			required: true
  		},
  		items: {
  			type: Array,
  			required: true
  		},
  		itemComponent: {
  			type: String,
  			required: true
  		},
  		moveOnClick: {
  			type: Boolean,
  			default: false
  		}
  	},

  	data() {
  		return {
  			debouncedHandleHorizontalScroll: null,
  			movementOrigin: null,
  			activeItem: 0,
  			highlightedItems: 0,
  			isOnStart: true,
  			isOnEnd: false,
  			firstMove: true
  		};
  	},

  	computed: {
  		itemCount() {
  			return this.items.length;
  		}
  	},

  	watch: {
  		'$w.resize.width.end': {
  			handler() {
  				this.setHighlightedItems();
  			}
  		},
  		activeItem() {
  			this.$emit('activeItemUpdated', this.activeItem);
  		}
  	},

  	mounted() {
  		this.debouncedHandleHorizontalScroll = debounce(this.handleScroll, 50);
  		this.$refs.scroller.addEventListener('scroll', this.debouncedHandleHorizontalScroll);
  		this.setHighlightedItems();

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

  		this.setHighlightedItems();
  	},

  	beforeDestroy() {
  		this.$refs.scroller.removeEventListener('scroll', this.debouncedHandleHorizontalScroll);
  	},

  	methods: {
  		setHighlightedItems() {
  			switch (this.$w.layout) {
  				case 'tiny':
  				case 'phone':
  					this.highlightedItems = 1;
  					break;
  				case 'tablet-portrait':
  				case 'tablet-landscape':
  					this.highlightedItems = 2;
  					break;
  				case 'desktop':
  				case 'desktop-medium':
  					this.highlightedItems = 3;
  					break;
  				default:
  					this.highlightedItems = 4;
  					break;
  			}
  		},

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

  				if (this.options.centerMode && !this.isResponsiveVersion) {
  					xBoundaries = carouselItems.map((element) => (row.offsetWidth / 2) - (carouselItems[0].offsetWidth / 2) - element.getBoundingClientRect().x);
  				} else {
  					xBoundaries = carouselItems.map((element) => row.offsetLeft - element.getBoundingClientRect().x);
  				}

  				const closestValue = xBoundaries.reduce((prev, curr) => (Math.abs(curr) < Math.abs(prev) ? curr : prev));
  				const closestIndex = xBoundaries.indexOf(closestValue);

  				if (this.options.sticky) {
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
  				if (origin === 'item' && !this.moveOnClick) {
  					return;
  				}
  				moveTo > this.activeItem ? 'right' : 'left';

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

  var css_248z = ".scroller[data-v-63b475e0] {\n  position: relative;\n  overflow: hidden;\n}\n.scroller__wrapper[data-v-63b475e0] {\n  position: relative;\n}\n.scroller__main[data-v-63b475e0] {\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n  scrollbar-height: none;\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n.scroller__main[data-v-63b475e0]::-webkit-scrollbar {\n  display: none;\n}\n.scroller__content[data-v-63b475e0] {\n  flex-wrap: nowrap;\n}\n.scroller__content[data-v-63b475e0]::before, .scroller__content[data-v-63b475e0]::after {\n  display: block;\n  flex: 0 0 0.9375rem;\n  height: 0.9375rem;\n  content: \"\";\n}\n.scroller__arrows[data-v-63b475e0] {\n  display: flex;\n  justify-content: space-between;\n}\n.scroller__arrow[data-v-63b475e0] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 2rem;\n  font-family: inherit;\n  background: none;\n  border: 0;\n  outline: 0;\n  cursor: pointer;\n  transition: all 300ms ease-in-out;\n}\n.scroller__arrow--prev[data-v-63b475e0] {\n  margin-right: auto;\n}\n.scroller__arrow--prev svg[data-v-63b475e0] {\n  margin-right: 0.625rem;\n  transform: scale(-1);\n}\n.scroller__arrow--next[data-v-63b475e0] {\n  margin-left: auto;\n}\n.scroller__arrow--next svg[data-v-63b475e0] {\n  margin-left: 0.625rem;\n}\n.scroller__arrow[data-v-63b475e0]:hover, .scroller__arrow[data-v-63b475e0]:focus {\n  text-shadow: -0.25px -0.25px 0 #262626, 0.25px 0.25px #262626;\n}\n.scroller__dots[data-v-63b475e0] {\n  display: flex;\n  justify-content: center;\n  margin-top: 1.5rem;\n}\n.scroller__dots button[data-v-63b475e0] {\n  flex: 0 0 0.5rem;\n  width: 0.5rem;\n  height: 0.5rem;\n  padding: 0;\n  background: rgba(0, 0, 0, 0.1);\n  border: 0;\n  border-radius: 50%;\n  outline: 0;\n  cursor: pointer;\n  transition: background 300ms ease-in-out;\n}\n.scroller__dots button + button[data-v-63b475e0] {\n  margin-left: 0.625rem;\n}\n.scroller__dots button[data-v-63b475e0]:hover, .scroller__dots button[data-v-63b475e0]:focus {\n  background: #c4c4c4;\n}\n.scroller__dots button.is-active[data-v-63b475e0] {\n  background: black;\n}";
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
          _c(
            "div",
            { staticClass: "scroller__arrows row" },
            [
              _c("transition", { attrs: { name: "fade" } }, [
                !_vm.isOnStart
                  ? _c(
                      "button",
                      {
                        staticClass: "scroller__arrow scroller__arrow--prev svg",
                        on: {
                          click: function ($event) {
                            return _vm.arrowNavigation("prev")
                          },
                        },
                      },
                      [
                        _c("svg", { staticClass: "svg-icon" }, [
                          _c("use", {
                            staticClass: "svg-icon-inner",
                            attrs: { "xlink:href": "#chevron-large-icon" },
                          }),
                        ]),
                        _vm._v(" "),
                        _c("span", [_vm._v("Previous")]),
                      ]
                    )
                  : _vm._e(),
              ]),
              _vm._v(" "),
              _c("transition", { attrs: { name: "fade" } }, [
                !_vm.isOnEnd
                  ? _c(
                      "button",
                      {
                        staticClass: "scroller__arrow scroller__arrow--next svg",
                        on: {
                          click: function ($event) {
                            return _vm.arrowNavigation("next")
                          },
                        },
                      },
                      [
                        _c("span", [_vm._v("Next")]),
                        _vm._v(" "),
                        _c("svg", { staticClass: "svg-icon" }, [
                          _c("use", {
                            staticClass: "svg-icon-inner",
                            attrs: { "xlink:href": "#chevron-large-icon" },
                          }),
                        ]),
                      ]
                    )
                  : _vm._e(),
              ]),
            ],
            1
          ),
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
                    return _c(_vm.computedItemComponent, {
                      key: "element-" + index,
                      tag: "component",
                      staticClass: "scroller__item",
                      class: {
                        "is-active":
                          index === _vm.activeItem ||
                          (index > _vm.activeItem &&
                            index < _vm.activeItem + _vm.highlightedItems),
                        "is-prev": index < _vm.activeItem,
                        "is-next": index > _vm.activeItem + _vm.highlightedItems,
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
        _c(
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
        ),
      ]
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = undefined;
    /* scoped */
    const __vue_scope_id__ = "data-v-63b475e0";
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
