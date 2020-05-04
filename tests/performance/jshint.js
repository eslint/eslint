//2.1.8
var JSHINT;
(function () {
var require;
require=(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":1}],3:[function(require,module,exports){
(function(){// jshint -W001

"use strict";

// Identifiers provided by the ECMAScript standard.

exports.reservedVars = {
	arguments : false,
	NaN       : false
};

exports.ecmaIdentifiers = {
	Array              : false,
	Boolean            : false,
	Date               : false,
	decodeURI          : false,
	decodeURIComponent : false,
	encodeURI          : false,
	encodeURIComponent : false,
	Error              : false,
	"eval"             : false,
	EvalError          : false,
	Function           : false,
	hasOwnProperty     : false,
	isFinite           : false,
	isNaN              : false,
	JSON               : false,
	Math               : false,
	Map                : false,
	Number             : false,
	Object             : false,
	parseInt           : false,
	parseFloat         : false,
	RangeError         : false,
	ReferenceError     : false,
	RegExp             : false,
	Set                : false,
	String             : false,
	SyntaxError        : false,
	TypeError          : false,
	URIError           : false,
	WeakMap            : false
};

// Global variables commonly provided by a web browser environment.

exports.browser = {
	ArrayBuffer          : false,
	ArrayBufferView      : false,
	Audio                : false,
	Blob                 : false,
	addEventListener     : false,
	applicationCache     : false,
	atob                 : false,
	blur                 : false,
	btoa                 : false,
	clearInterval        : false,
	clearTimeout         : false,
	close                : false,
	closed               : false,
	CustomEvent          : false,
	DataView             : false,
	DOMParser            : false,
	defaultStatus        : false,
	document             : false,
	Element              : false,
	ElementTimeControl   : false,
	event                : false,
	FileReader           : false,
	Float32Array         : false,
	Float64Array         : false,
	FormData             : false,
	focus                : false,
	frames               : false,
	getComputedStyle     : false,
	HTMLElement          : false,
	HTMLAnchorElement    : false,
	HTMLBaseElement      : false,
	HTMLBlockquoteElement: false,
	HTMLBodyElement      : false,
	HTMLBRElement        : false,
	HTMLButtonElement    : false,
	HTMLCanvasElement    : false,
	HTMLDirectoryElement : false,
	HTMLDivElement       : false,
	HTMLDListElement     : false,
	HTMLFieldSetElement  : false,
	HTMLFontElement      : false,
	HTMLFormElement      : false,
	HTMLFrameElement     : false,
	HTMLFrameSetElement  : false,
	HTMLHeadElement      : false,
	HTMLHeadingElement   : false,
	HTMLHRElement        : false,
	HTMLHtmlElement      : false,
	HTMLIFrameElement    : false,
	HTMLImageElement     : false,
	HTMLInputElement     : false,
	HTMLIsIndexElement   : false,
	HTMLLabelElement     : false,
	HTMLLayerElement     : false,
	HTMLLegendElement    : false,
	HTMLLIElement        : false,
	HTMLLinkElement      : false,
	HTMLMapElement       : false,
	HTMLMenuElement      : false,
	HTMLMetaElement      : false,
	HTMLModElement       : false,
	HTMLObjectElement    : false,
	HTMLOListElement     : false,
	HTMLOptGroupElement  : false,
	HTMLOptionElement    : false,
	HTMLParagraphElement : false,
	HTMLParamElement     : false,
	HTMLPreElement       : false,
	HTMLQuoteElement     : false,
	HTMLScriptElement    : false,
	HTMLSelectElement    : false,
	HTMLStyleElement     : false,
	HTMLTableCaptionElement: false,
	HTMLTableCellElement : false,
	HTMLTableColElement  : false,
	HTMLTableElement     : false,
	HTMLTableRowElement  : false,
	HTMLTableSectionElement: false,
	HTMLTextAreaElement  : false,
	HTMLTitleElement     : false,
	HTMLUListElement     : false,
	HTMLVideoElement     : false,
	history              : false,
	Int16Array           : false,
	Int32Array           : false,
	Int8Array            : false,
	Image                : false,
	length               : false,
	localStorage         : false,
	location             : false,
	MessageChannel       : false,
	MessageEvent         : false,
	MessagePort          : false,
	MouseEvent           : false,
	moveBy               : false,
	moveTo               : false,
	MutationObserver     : false,
	name                 : false,
	Node                 : false,
	NodeFilter           : false,
	navigator            : false,
	onbeforeunload       : true,
	onblur               : true,
	onerror              : true,
	onfocus              : true,
	onload               : true,
	onresize             : true,
	onunload             : true,
	open                 : false,
	openDatabase         : false,
	opener               : false,
	Option               : false,
	parent               : false,
	print                : false,
	removeEventListener  : false,
	resizeBy             : false,
	resizeTo             : false,
	screen               : false,
	scroll               : false,
	scrollBy             : false,
	scrollTo             : false,
	sessionStorage       : false,
	setInterval          : false,
	setTimeout           : false,
	SharedWorker         : false,
	status               : false,
	SVGAElement          : false,
	SVGAltGlyphDefElement: false,
	SVGAltGlyphElement   : false,
	SVGAltGlyphItemElement: false,
	SVGAngle             : false,
	SVGAnimateColorElement: false,
	SVGAnimateElement    : false,
	SVGAnimateMotionElement: false,
	SVGAnimateTransformElement: false,
	SVGAnimatedAngle     : false,
	SVGAnimatedBoolean   : false,
	SVGAnimatedEnumeration: false,
	SVGAnimatedInteger   : false,
	SVGAnimatedLength    : false,
	SVGAnimatedLengthList: false,
	SVGAnimatedNumber    : false,
	SVGAnimatedNumberList: false,
	SVGAnimatedPathData  : false,
	SVGAnimatedPoints    : false,
	SVGAnimatedPreserveAspectRatio: false,
	SVGAnimatedRect      : false,
	SVGAnimatedString    : false,
	SVGAnimatedTransformList: false,
	SVGAnimationElement  : false,
	SVGCSSRule           : false,
	SVGCircleElement     : false,
	SVGClipPathElement   : false,
	SVGColor             : false,
	SVGColorProfileElement: false,
	SVGColorProfileRule  : false,
	SVGComponentTransferFunctionElement: false,
	SVGCursorElement     : false,
	SVGDefsElement       : false,
	SVGDescElement       : false,
	SVGDocument          : false,
	SVGElement           : false,
	SVGElementInstance   : false,
	SVGElementInstanceList: false,
	SVGEllipseElement    : false,
	SVGExternalResourcesRequired: false,
	SVGFEBlendElement    : false,
	SVGFEColorMatrixElement: false,
	SVGFEComponentTransferElement: false,
	SVGFECompositeElement: false,
	SVGFEConvolveMatrixElement: false,
	SVGFEDiffuseLightingElement: false,
	SVGFEDisplacementMapElement: false,
	SVGFEDistantLightElement: false,
	SVGFEFloodElement    : false,
	SVGFEFuncAElement    : false,
	SVGFEFuncBElement    : false,
	SVGFEFuncGElement    : false,
	SVGFEFuncRElement    : false,
	SVGFEGaussianBlurElement: false,
	SVGFEImageElement    : false,
	SVGFEMergeElement    : false,
	SVGFEMergeNodeElement: false,
	SVGFEMorphologyElement: false,
	SVGFEOffsetElement   : false,
	SVGFEPointLightElement: false,
	SVGFESpecularLightingElement: false,
	SVGFESpotLightElement: false,
	SVGFETileElement     : false,
	SVGFETurbulenceElement: false,
	SVGFilterElement     : false,
	SVGFilterPrimitiveStandardAttributes: false,
	SVGFitToViewBox      : false,
	SVGFontElement       : false,
	SVGFontFaceElement   : false,
	SVGFontFaceFormatElement: false,
	SVGFontFaceNameElement: false,
	SVGFontFaceSrcElement: false,
	SVGFontFaceUriElement: false,
	SVGForeignObjectElement: false,
	SVGGElement          : false,
	SVGGlyphElement      : false,
	SVGGlyphRefElement   : false,
	SVGGradientElement   : false,
	SVGHKernElement      : false,
	SVGICCColor          : false,
	SVGImageElement      : false,
	SVGLangSpace         : false,
	SVGLength            : false,
	SVGLengthList        : false,
	SVGLineElement       : false,
	SVGLinearGradientElement: false,
	SVGLocatable         : false,
	SVGMPathElement      : false,
	SVGMarkerElement     : false,
	SVGMaskElement       : false,
	SVGMatrix            : false,
	SVGMetadataElement   : false,
	SVGMissingGlyphElement: false,
	SVGNumber            : false,
	SVGNumberList        : false,
	SVGPaint             : false,
	SVGPathElement       : false,
	SVGPathSeg           : false,
	SVGPathSegArcAbs     : false,
	SVGPathSegArcRel     : false,
	SVGPathSegClosePath  : false,
	SVGPathSegCurvetoCubicAbs: false,
	SVGPathSegCurvetoCubicRel: false,
	SVGPathSegCurvetoCubicSmoothAbs: false,
	SVGPathSegCurvetoCubicSmoothRel: false,
	SVGPathSegCurvetoQuadraticAbs: false,
	SVGPathSegCurvetoQuadraticRel: false,
	SVGPathSegCurvetoQuadraticSmoothAbs: false,
	SVGPathSegCurvetoQuadraticSmoothRel: false,
	SVGPathSegLinetoAbs  : false,
	SVGPathSegLinetoHorizontalAbs: false,
	SVGPathSegLinetoHorizontalRel: false,
	SVGPathSegLinetoRel  : false,
	SVGPathSegLinetoVerticalAbs: false,
	SVGPathSegLinetoVerticalRel: false,
	SVGPathSegList       : false,
	SVGPathSegMovetoAbs  : false,
	SVGPathSegMovetoRel  : false,
	SVGPatternElement    : false,
	SVGPoint             : false,
	SVGPointList         : false,
	SVGPolygonElement    : false,
	SVGPolylineElement   : false,
	SVGPreserveAspectRatio: false,
	SVGRadialGradientElement: false,
	SVGRect              : false,
	SVGRectElement       : false,
	SVGRenderingIntent   : false,
	SVGSVGElement        : false,
	SVGScriptElement     : false,
	SVGSetElement        : false,
	SVGStopElement       : false,
	SVGStringList        : false,
	SVGStylable          : false,
	SVGStyleElement      : false,
	SVGSwitchElement     : false,
	SVGSymbolElement     : false,
	SVGTRefElement       : false,
	SVGTSpanElement      : false,
	SVGTests             : false,
	SVGTextContentElement: false,
	SVGTextElement       : false,
	SVGTextPathElement   : false,
	SVGTextPositioningElement: false,
	SVGTitleElement      : false,
	SVGTransform         : false,
	SVGTransformList     : false,
	SVGTransformable     : false,
	SVGURIReference      : false,
	SVGUnitTypes         : false,
	SVGUseElement        : false,
	SVGVKernElement      : false,
	SVGViewElement       : false,
	SVGViewSpec          : false,
	SVGZoomAndPan        : false,
	TimeEvent            : false,
	top                  : false,
	Uint16Array          : false,
	Uint32Array          : false,
	Uint8Array           : false,
	Uint8ClampedArray    : false,
	WebSocket            : false,
	window               : false,
	Worker               : false,
	XMLHttpRequest       : false,
	XMLSerializer        : false,
	XPathEvaluator       : false,
	XPathException       : false,
	XPathExpression      : false,
	XPathNamespace       : false,
	XPathNSResolver      : false,
	XPathResult          : false
};

exports.devel = {
	alert  : false,
	confirm: false,
	console: false,
	Debug  : false,
	opera  : false,
	prompt : false
};

exports.worker = {
	importScripts: true,
	postMessage  : true,
	self         : true
};

// Widely adopted global names that are not part of ECMAScript standard
exports.nonstandard = {
	escape  : false,
	unescape: false
};

// Globals provided by popular JavaScript environments.

exports.couch = {
	"require" : false,
	respond   : false,
	getRow    : false,
	emit      : false,
	send      : false,
	start     : false,
	sum       : false,
	log       : false,
	exports   : false,
	module    : false,
	provides  : false
};

exports.node = {
	__filename    : false,
	__dirname     : false,
	Buffer        : false,
	DataView      : false,
	console       : false,
	exports       : true,  // In Node it is ok to exports = module.exports = foo();
	GLOBAL        : false,
	global        : false,
	module        : false,
	process       : false,
	require       : false,
	setTimeout    : false,
	clearTimeout  : false,
	setInterval   : false,
	clearInterval : false,
	setImmediate  : false, // v0.9.1+
	clearImmediate: false  // v0.9.1+
};

exports.phantom = {
	phantom      : true,
	require      : true,
	WebPage      : true
};

exports.rhino = {
	defineClass  : false,
	deserialize  : false,
	gc           : false,
	help         : false,
	importPackage: false,
	"java"       : false,
	load         : false,
	loadClass    : false,
	print        : false,
	quit         : false,
	readFile     : false,
	readUrl      : false,
	runCommand   : false,
	seal         : false,
	serialize    : false,
	spawn        : false,
	sync         : false,
	toint32      : false,
	version      : false
};

exports.shelljs = {
	target       : false,
	echo         : false,
	exit         : false,
	cd           : false,
	pwd          : false,
	ls           : false,
	find         : false,
	cp           : false,
	rm           : false,
	mv           : false,
	mkdir        : false,
	test         : false,
	cat          : false,
	sed          : false,
	grep         : false,
	which        : false,
	dirs         : false,
	pushd        : false,
	popd         : false,
	env          : false,
	exec         : false,
	chmod        : false,
	config       : false,
	error        : false,
	tempdir      : false
};

exports.wsh = {
	ActiveXObject            : true,
	Enumerator               : true,
	GetObject                : true,
	ScriptEngine             : true,
	ScriptEngineBuildVersion : true,
	ScriptEngineMajorVersion : true,
	ScriptEngineMinorVersion : true,
	VBArray                  : true,
	WSH                      : true,
	WScript                  : true,
	XDomainRequest           : true
};

// Globals provided by popular JavaScript libraries.

exports.dojo = {
	dojo     : false,
	dijit    : false,
	dojox    : false,
	define	 : false,
	"require": false
};

exports.jquery = {
	"$"    : false,
	jQuery : false
};

exports.mootools = {
	"$"           : false,
	"$$"          : false,
	Asset         : false,
	Browser       : false,
	Chain         : false,
	Class         : false,
	Color         : false,
	Cookie        : false,
	Core          : false,
	Document      : false,
	DomReady      : false,
	DOMEvent      : false,
	DOMReady      : false,
	Drag          : false,
	Element       : false,
	Elements      : false,
	Event         : false,
	Events        : false,
	Fx            : false,
	Group         : false,
	Hash          : false,
	HtmlTable     : false,
	Iframe        : false,
	IframeShim    : false,
	InputValidator: false,
	instanceOf    : false,
	Keyboard      : false,
	Locale        : false,
	Mask          : false,
	MooTools      : false,
	Native        : false,
	Options       : false,
	OverText      : false,
	Request       : false,
	Scroller      : false,
	Slick         : false,
	Slider        : false,
	Sortables     : false,
	Spinner       : false,
	Swiff         : false,
	Tips          : false,
	Type          : false,
	typeOf        : false,
	URI           : false,
	Window        : false
};

exports.prototypejs = {
	"$"               : false,
	"$$"              : false,
	"$A"              : false,
	"$F"              : false,
	"$H"              : false,
	"$R"              : false,
	"$break"          : false,
	"$continue"       : false,
	"$w"              : false,
	Abstract          : false,
	Ajax              : false,
	Class             : false,
	Enumerable        : false,
	Element           : false,
	Event             : false,
	Field             : false,
	Form              : false,
	Hash              : false,
	Insertion         : false,
	ObjectRange       : false,
	PeriodicalExecuter: false,
	Position          : false,
	Prototype         : false,
	Selector          : false,
	Template          : false,
	Toggle            : false,
	Try               : false,
	Autocompleter     : false,
	Builder           : false,
	Control           : false,
	Draggable         : false,
	Draggables        : false,
	Droppables        : false,
	Effect            : false,
	Sortable          : false,
	SortableObserver  : false,
	Sound             : false,
	Scriptaculous     : false
};

exports.yui = {
	YUI       : false,
	Y         : false,
	YUI_config: false
};


})()
},{}],4:[function(require,module,exports){
/*
 * Regular expressions. Some of these are stupidly long.
 */

/*jshint maxlen:1000 */

"use string";

// Unsafe comment or string (ax)
exports.unsafeString =
	/@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i;

// Unsafe characters that are silently deleted by one or more browsers (cx)
exports.unsafeChars =
	/[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;

// Characters in strings that need escaping (nx and nxg)
exports.needEsc =
	/[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;

exports.needEscGlobal =
	/[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

// Star slash (lx)
exports.starSlash = /\*\//;

// Identifier (ix)
exports.identifier = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/;

// JavaScript URL (jx)
exports.javascriptURL = /^(?:javascript|jscript|ecmascript|vbscript|mocha|livescript)\s*:/i;

// Catches /* falls through */ comments (ft)
exports.fallsThrough = /^\s*\/\*\s*falls?\sthrough\s*\*\/\s*$/;

},{}],5:[function(require,module,exports){
(function(){"use strict";

exports.register = function (linter) {
	// Check for properties named __proto__. This special property was
	// deprecated and then re-introduced for ES6.

	linter.on("Identifier", function style_scanProto(data) {
		if (linter.getOption("proto")) {
			return;
		}

		if (data.name === "__proto__") {
			linter.warn("W103", {
				line: data.line,
				char: data.char,
				data: [ data.name ]
			});
		}
	});

	// Check for properties named __iterator__. This is a special property
	// available only in browsers with JavaScript 1.7 implementation.

	linter.on("Identifier", function style_scanIterator(data) {
		if (linter.getOption("iterator")) {
			return;
		}

		if (data.name === "__iterator__") {
			linter.warn("W104", {
				line: data.line,
				char: data.char,
				data: [ data.name ]
			});
		}
	});

	// Check for dangling underscores.

	linter.on("Identifier", function style_scanDangling(data) {
		if (!linter.getOption("nomen")) {
			return;
		}

		// Underscore.js
		if (data.name === "_") {
			return;
		}

		// In Node, __dirname and __filename should be ignored.
		if (linter.getOption("node")) {
			if (/^(__dirname|__filename)$/.test(data.name) && !data.isProperty) {
				return;
			}
		}

		if (/^(_+.*|.*_+)$/.test(data.name)) {
			linter.warn("W105", {
				line: data.line,
				char: data.from,
				data: [ "dangling '_'", data.name ]
			});
		}
	});

	// Check that all identifiers are using camelCase notation.
	// Exceptions: names like MY_VAR and _myVar.

	linter.on("Identifier", function style_scanCamelCase(data) {
		if (!linter.getOption("camelcase")) {
			return;
		}

		if (data.name.replace(/^_+/, "").indexOf("_") > -1 && !data.name.match(/^[A-Z0-9_]*$/)) {
			linter.warn("W106", {
				line: data.line,
				char: data.from,
				data: [ data.name ]
			});
		}
	});

	// Enforce consistency in style of quoting.

	linter.on("String", function style_scanQuotes(data) {
		var quotmark = linter.getOption("quotmark");
		var code;

		if (!quotmark) {
			return;
		}

		// If quotmark is set to 'single' warn about all double-quotes.

		if (quotmark === "single" && data.quote !== "'") {
			code = "W109";
		}

		// If quotmark is set to 'double' warn about all single-quotes.

		if (quotmark === "double" && data.quote !== "\"") {
			code = "W108";
		}

		// If quotmark is set to true, remember the first quotation style
		// and then warn about all others.

		if (quotmark === true) {
			if (!linter.getCache("quotmark")) {
				linter.setCache("quotmark", data.quote);
			}

			if (linter.getCache("quotmark") !== data.quote) {
				code = "W110";
			}
		}

		if (code) {
			linter.warn(code, {
				line: data.line,
				char: data.char,
			});
		}
	});

	linter.on("Number", function style_scanNumbers(data) {
		if (data.value.charAt(0) === ".") {
			// Warn about a leading decimal point.
			linter.warn("W008", {
				line: data.line,
				char: data.char,
				data: [ data.value ]
			});
		}

		if (data.value.substr(data.value.length - 1) === ".") {
			// Warn about a trailing decimal point.
			linter.warn("W047", {
				line: data.line,
				char: data.char,
				data: [ data.value ]
			});
		}

		if (/^00+/.test(data.value)) {
			// Multiple leading zeroes.
			linter.warn("W046", {
				line: data.line,
				char: data.char,
				data: [ data.value ]
			});
		}
	});

	// Warn about script URLs.

	linter.on("String", function style_scanJavaScriptURLs(data) {
		var re = /^(?:javascript|jscript|ecmascript|vbscript|mocha|livescript)\s*:/i;

		if (linter.getOption("scripturl")) {
			return;
		}

		if (re.test(data.value)) {
			linter.warn("W107", {
				line: data.line,
				char: data.char
			});
		}
	});
};
})()
},{}],6:[function(require,module,exports){
"use strict";

var state = {
	syntax: {},

	reset: function () {
		this.tokens = {
			prev: null,
			next: null,
			curr: null
		};

		this.option = {};
		this.ignored = {};
		this.directive = {};
		this.jsonMode = false;
		this.jsonWarnings = [];
		this.lines = [];
		this.tab = "";
		this.cache = {}; // Node.JS doesn't have Map. Sniff.
	}
};

exports.state = state;

},{}],"jshint":[function(require,module,exports){
module.exports=require('E/GbHF');
},{}],"E/GbHF":[function(require,module,exports){
(function(){/*!
 * JSHint, by JSHint Community.
 *
 * This file (and this file only) is licensed under the same slightly modified
 * MIT license that JSLint is. It stops evil-doers everywhere:
 *
 *	 Copyright (c) 2002 Douglas Crockford  (www.JSLint.com)
 *
 *	 Permission is hereby granted, free of charge, to any person obtaining
 *	 a copy of this software and associated documentation files (the "Software"),
 *	 to deal in the Software without restriction, including without limitation
 *	 the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *	 and/or sell copies of the Software, and to permit persons to whom
 *	 the Software is furnished to do so, subject to the following conditions:
 *
 *	 The above copyright notice and this permission notice shall be included
 *	 in all copies or substantial portions of the Software.
 *
 *	 The Software shall be used for Good, not Evil.
 *
 *	 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *	 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *	 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *	 DEALINGS IN THE SOFTWARE.
 *
 */

/*jshint quotmark:double */
/*global console:true */
/*exported console */

var _        = require("underscore");
var events   = require("events");
var vars     = require("../shared/vars.js");
var messages = require("../shared/messages.js");
var Lexer    = require("./lex.js").Lexer;
var reg      = require("./reg.js");
var state    = require("./state.js").state;
var style    = require("./style.js");

// We need this module here because environments such as IE and Rhino
// don't necessarily expose the 'console' API and browserify uses
// it to log things. It's a sad state of affair, really.
var console = require("console-browserify");

// We build the application inside a function so that we produce only a singleton
// variable. That function will be invoked immediately, and its return value is
// the JSHINT function itself.

var JSHINT = (function () {
	"use strict";

	var anonname, // The guessed name for anonymous functions.
		api, // Extension API

		// These are operators that should not be used with the ! operator.
		bang = {
			"<"  : true,
			"<=" : true,
			"==" : true,
			"===": true,
			"!==": true,
			"!=" : true,
			">"  : true,
			">=" : true,
			"+"  : true,
			"-"  : true,
			"*"  : true,
			"/"  : true,
			"%"  : true
		},

		// These are the JSHint boolean options.
		boolOptions = {
			asi         : true, // if automatic semicolon insertion should be tolerated
			bitwise     : true, // if bitwise operators should not be allowed
			boss        : true, // if advanced usage of assignments should be allowed
			browser     : true, // if the standard browser globals should be predefined
			camelcase   : true, // if identifiers should be required in camel case
			couch       : true, // if CouchDB globals should be predefined
			curly       : true, // if curly braces around all blocks should be required
			debug       : true, // if debugger statements should be allowed
			devel       : true, // if logging globals should be predefined (console, alert, etc.)
			dojo        : true, // if Dojo Toolkit globals should be predefined
			eqeqeq      : true, // if === should be required
			eqnull      : true, // if == null comparisons should be tolerated
			es3         : true, // if ES3 syntax should be allowed
			es5         : true, // if ES5 syntax should be allowed (is now set per default)
			esnext      : true, // if es.next specific syntax should be allowed
			moz         : true, // if mozilla specific syntax should be allowed
			evil        : true, // if eval should be allowed
			expr        : true, // if ExpressionStatement should be allowed as Programs
			forin       : true, // if for in statements must filter
			funcscope   : true, // if only function scope should be used for scope tests
			gcl         : true, // if JSHint should be compatible with Google Closure Linter
			globalstrict: true, // if global "use strict"; should be allowed (also enables 'strict')
			immed       : true, // if immediate invocations must be wrapped in parens
			iterator    : true, // if the `__iterator__` property should be allowed
			jquery      : true, // if jQuery globals should be predefined
			lastsemic   : true, // if semicolons may be omitted for the trailing
			                    // statements inside of a one-line blocks.
			laxbreak    : true, // if line breaks should not be checked
			laxcomma    : true, // if line breaks should not be checked around commas
			loopfunc    : true, // if functions should be allowed to be defined within
			                    // loops
			mootools    : true, // if MooTools globals should be predefined
			multistr    : true, // allow multiline strings
			newcap      : true, // if constructor names must be capitalized
			noarg       : true, // if arguments.caller and arguments.callee should be
			                    // disallowed
			node        : true, // if the Node.js environment globals should be
			                    // predefined
			noempty     : true, // if empty blocks should be disallowed
			nonew       : true, // if using `new` for side-effects should be disallowed
			nonstandard : true, // if non-standard (but widely adopted) globals should
			                    // be predefined
			nomen       : true, // if names should be checked
			onevar      : true, // if only one var statement per function should be
			                    // allowed
			passfail    : true, // if the scan should stop on first error
			phantom     : true, // if PhantomJS symbols should be allowed
			plusplus    : true, // if increment/decrement should not be allowed
			proto       : true, // if the `__proto__` property should be allowed
			prototypejs : true, // if Prototype and Scriptaculous globals should be
			                    // predefined
			rhino       : true, // if the Rhino environment globals should be predefined
			shelljs     : true, // if ShellJS globals should be predefined
			undef       : true, // if variables should be declared before used
			scripturl   : true, // if script-targeted URLs should be tolerated
			shadow      : true, // if variable shadowing should be tolerated
			smarttabs   : true, // if smarttabs should be tolerated
			                    // (http://www.emacswiki.org/emacs/SmartTabs)
			strict      : true, // require the "use strict"; pragma
			sub         : true, // if all forms of subscript notation are tolerated
			supernew    : true, // if `new function () { ... };` and `new Object;`
			                    // should be tolerated
			trailing    : true, // if trailing whitespace rules apply
			validthis   : true, // if 'this' inside a non-constructor function is valid.
			                    // This is a function scoped option only.
			withstmt    : true, // if with statements should be allowed
			white       : true, // if strict whitespace rules apply
			worker      : true, // if Web Worker script symbols should be allowed
			wsh         : true, // if the Windows Scripting Host environment globals
			                    // should be predefined
			yui         : true, // YUI variables should be predefined

			// Obsolete options
			onecase     : true, // if one case switch statements should be allowed
			regexp      : true, // if the . should not be allowed in regexp literals
			regexdash   : true  // if unescaped first/last dash (-) inside brackets
			                    // should be tolerated
		},

		// These are the JSHint options that can take any value
		// (we use this object to detect invalid options)
		valOptions = {
			maxlen       : false,
			indent       : false,
			maxerr       : false,
			predef       : false,
			quotmark     : false, //'single'|'double'|true
			scope        : false,
			maxstatements: false, // {int} max statements per function
			maxdepth     : false, // {int} max nested block depth per function
			maxparams    : false, // {int} max params per function
			maxcomplexity: false, // {int} max cyclomatic complexity per function
			unused       : true,  // warn if variables are unused. Available options:
			                      //   false    - don't check for unused variables
			                      //   true     - "vars" + check last function param
			                      //   "vars"   - skip checking unused function params
			                      //   "strict" - "vars" + check all function params
			latedef      : false  // warn if the variable is used before its definition
			                      //   false    - don't emit any warnings
			                      //   true     - warn if any variable is used before its definition
			                      //   "nofunc" - warn for any variable but function declarations
		},

		// These are JSHint boolean options which are shared with JSLint
		// where the definition in JSHint is opposite JSLint
		invertedOptions = {
			bitwise : true,
			forin   : true,
			newcap  : true,
			nomen   : true,
			plusplus: true,
			regexp  : true,
			undef   : true,
			white   : true,

			// Inverted and renamed, use JSHint name here
			eqeqeq  : true,
			onevar  : true,
			strict  : true
		},

		// These are JSHint boolean options which are shared with JSLint
		// where the name has been changed but the effect is unchanged
		renamedOptions = {
			eqeq   : "eqeqeq",
			vars   : "onevar",
			windows: "wsh",
			sloppy : "strict"
		},

		declared, // Globals that were declared using /*global ... */ syntax.
		exported, // Variables that are used outside of the current file.

		functionicity = [
			"closure", "exception", "global", "label",
			"outer", "unused", "var"
		],

		funct, // The current function
		functions, // All of the functions

		global, // The global scope
		implied, // Implied globals
		inblock,
		indent,
		lookahead,
		lex,
		member,
		membersOnly,
		noreach,
		predefined,		// Global variables defined by option

		scope,  // The current scope
		stack,
		unuseds,
		urls,
		warnings,

		extraModules = [],
		emitter = new events.EventEmitter();

	function checkOption(name, t) {
		name = name.trim();

		if (/^[+-]W\d{3}$/g.test(name)) {
			return true;
		}

		if (valOptions[name] === undefined && boolOptions[name] === undefined) {
			if (t.type !== "jslint") {
				error("E001", t, name);
				return false;
			}
		}

		return true;
	}

	function isString(obj) {
		return Object.prototype.toString.call(obj) === "[object String]";
	}

	function isIdentifier(tkn, value) {
		if (!tkn)
			return false;

		if (!tkn.identifier || tkn.value !== value)
			return false;

		return true;
	}

	function isReserved(token) {
		if (!token.reserved) {
			return false;
		}
		var meta = token.meta;

		if (meta && meta.isFutureReservedWord && state.option.inES5()) {
			// ES3 FutureReservedWord in an ES5 environment.
			if (!meta.es5) {
				return false;
			}

			// Some ES5 FutureReservedWord identifiers are active only
			// within a strict mode environment.
			if (meta.strictOnly) {
				if (!state.option.strict && !state.directive["use strict"]) {
					return false;
				}
			}

			if (token.isProperty) {
				return false;
			}
		}

		return true;
	}

	function supplant(str, data) {
		return str.replace(/\{([^{}]*)\}/g, function (a, b) {
			var r = data[b];
			return typeof r === "string" || typeof r === "number" ? r : a;
		});
	}

	function combine(t, o) {
		var n;
		for (n in o) {
			if (_.has(o, n) && !_.has(JSHINT.blacklist, n)) {
				t[n] = o[n];
			}
		}
	}

	function updatePredefined() {
		Object.keys(JSHINT.blacklist).forEach(function (key) {
			delete predefined[key];
		});
	}

	function assume() {
		if (state.option.es5) {
			warning("I003");
		}
		if (state.option.couch) {
			combine(predefined, vars.couch);
		}

		if (state.option.rhino) {
			combine(predefined, vars.rhino);
		}

		if (state.option.shelljs) {
			combine(predefined, vars.shelljs);
			combine(predefined, vars.node);
		}

		if (state.option.phantom) {
			combine(predefined, vars.phantom);
		}

		if (state.option.prototypejs) {
			combine(predefined, vars.prototypejs);
		}

		if (state.option.node) {
			combine(predefined, vars.node);
		}

		if (state.option.devel) {
			combine(predefined, vars.devel);
		}

		if (state.option.dojo) {
			combine(predefined, vars.dojo);
		}

		if (state.option.browser) {
			combine(predefined, vars.browser);
		}

		if (state.option.nonstandard) {
			combine(predefined, vars.nonstandard);
		}

		if (state.option.jquery) {
			combine(predefined, vars.jquery);
		}

		if (state.option.mootools) {
			combine(predefined, vars.mootools);
		}

		if (state.option.worker) {
			combine(predefined, vars.worker);
		}

		if (state.option.wsh) {
			combine(predefined, vars.wsh);
		}

		if (state.option.globalstrict && state.option.strict !== false) {
			state.option.strict = true;
		}

		if (state.option.yui) {
			combine(predefined, vars.yui);
		}

		// Let's assume that chronologically ES3 < ES5 < ES6/ESNext < Moz

		state.option.inMoz = function (strict) {
			if (strict) {
				return state.option.moz && !state.option.esnext;
			}
			return state.option.moz;
		};

		state.option.inESNext = function (strict) {
			if (strict) {
				return !state.option.moz && state.option.esnext;
			}
			return state.option.moz || state.option.esnext;
		};

		state.option.inES5 = function (/* strict */) {
			return !state.option.es3;
		};

		state.option.inES3 = function (strict) {
			if (strict) {
				return !state.option.moz && !state.option.esnext && state.option.es3;
			}
			return state.option.es3;
		};
	}

	// Produce an error warning.
	function quit(code, line, chr) {
		var percentage = Math.floor((line / state.lines.length) * 100);
		var message = messages.errors[code].desc;

		throw {
			name: "JSHintError",
			line: line,
			character: chr,
			message: message + " (" + percentage + "% scanned).",
			raw: message,
			code: code
		};
	}

	function isundef(scope, code, token, a) {
		return JSHINT.undefs.push([scope, code, token, a]);
	}

	function warning(code, t, a, b, c, d) {
		var ch, l, w, msg;

		if (/^W\d{3}$/.test(code)) {
			if (state.ignored[code])
				return;

			msg = messages.warnings[code];
		} else if (/E\d{3}/.test(code)) {
			msg = messages.errors[code];
		} else if (/I\d{3}/.test(code)) {
			msg = messages.info[code];
		}

		t = t || state.tokens.next;
		if (t.id === "(end)") {  // `~
			t = state.tokens.curr;
		}

		l = t.line || 0;
		ch = t.from || 0;

		w = {
			id: "(error)",
			raw: msg.desc,
			code: msg.code,
			evidence: state.lines[l - 1] || "",
			line: l,
			character: ch,
			scope: JSHINT.scope,
			a: a,
			b: b,
			c: c,
			d: d
		};

		w.reason = supplant(msg.desc, w);
		JSHINT.errors.push(w);

		if (state.option.passfail) {
			quit("E042", l, ch);
		}

		warnings += 1;
		if (warnings >= state.option.maxerr) {
			quit("E043", l, ch);
		}

		return w;
	}

	function warningAt(m, l, ch, a, b, c, d) {
		return warning(m, {
			line: l,
			from: ch
		}, a, b, c, d);
	}

	function error(m, t, a, b, c, d) {
		warning(m, t, a, b, c, d);
	}

	function errorAt(m, l, ch, a, b, c, d) {
		return error(m, {
			line: l,
			from: ch
		}, a, b, c, d);
	}

	// Tracking of "internal" scripts, like eval containing a static string
	function addInternalSrc(elem, src) {
		var i;
		i = {
			id: "(internal)",
			elem: elem,
			value: src
		};
		JSHINT.internals.push(i);
		return i;
	}

	function addlabel(t, type, tkn, islet) {
		// Define t in the current function in the current scope.
		if (type === "exception") {
			if (_.has(funct["(context)"], t)) {
				if (funct[t] !== true && !state.option.node) {
					warning("W002", state.tokens.next, t);
				}
			}
		}

		if (_.has(funct, t) && !funct["(global)"]) {
			if (funct[t] === true) {
				if (state.option.latedef) {
					if ((state.option.latedef === true && _.contains([funct[t], type], "unction")) ||
							!_.contains([funct[t], type], "unction")) {
						warning("W003", state.tokens.next, t);
					}
				}
			} else {
				if (!state.option.shadow && type !== "exception" ||
							(funct["(blockscope)"].getlabel(t))) {
					warning("W004", state.tokens.next, t);
				}
			}
		}

		// a double definition of a let variable in same block throws a TypeError
		if (funct["(blockscope)"] && funct["(blockscope)"].current.has(t)) {
			error("E044", state.tokens.next, t);
		}

		// if the identifier is from a let, adds it only to the current blockscope
		if (islet) {
			funct["(blockscope)"].current.add(t, type, state.tokens.curr);
		} else {

			funct[t] = type;

			if (tkn) {
				funct["(tokens)"][t] = tkn;
			}

			if (funct["(global)"]) {
				global[t] = funct;
				if (_.has(implied, t)) {
					if (state.option.latedef) {
						if ((state.option.latedef === true && _.contains([funct[t], type], "unction")) ||
								!_.contains([funct[t], type], "unction")) {
							warning("W003", state.tokens.next, t);
						}
					}

					delete implied[t];
				}
			} else {
				scope[t] = funct;
			}
		}
	}

	function doOption() {
		var nt = state.tokens.next;
		var body = nt.body.split(",").map(function (s) { return s.trim(); });
		var predef = {};

		if (nt.type === "globals") {
			body.forEach(function (g) {
				g = g.split(":");
				var key = g[0];
				var val = g[1];

				if (key.charAt(0) === "-") {
					key = key.slice(1);
					val = false;

					JSHINT.blacklist[key] = key;
					updatePredefined();
				} else {
					predef[key] = (val === "true");
				}
			});

			combine(predefined, predef);

			for (var key in predef) {
				if (_.has(predef, key)) {
					declared[key] = nt;
				}
			}
		}

		if (nt.type === "exported") {
			body.forEach(function (e) {
				exported[e] = true;
			});
		}

		if (nt.type === "members") {
			membersOnly = membersOnly || {};

			body.forEach(function (m) {
				var ch1 = m.charAt(0);
				var ch2 = m.charAt(m.length - 1);

				if (ch1 === ch2 && (ch1 === "\"" || ch1 === "'")) {
					m = m
						.substr(1, m.length - 2)
						.replace("\\b", "\b")
						.replace("\\t", "\t")
						.replace("\\n", "\n")
						.replace("\\v", "\v")
						.replace("\\f", "\f")
						.replace("\\r", "\r")
						.replace("\\\\", "\\")
						.replace("\\\"", "\"");
				}

				membersOnly[m] = false;
			});
		}

		var numvals = [
			"maxstatements",
			"maxparams",
			"maxdepth",
			"maxcomplexity",
			"maxerr",
			"maxlen",
			"indent"
		];

		if (nt.type === "jshint" || nt.type === "jslint") {
			body.forEach(function (g) {
				g = g.split(":");
				var key = (g[0] || "").trim();
				var val = (g[1] || "").trim();

				if (!checkOption(key, nt)) {
					return;
				}

				if (numvals.indexOf(key) >= 0) {

					// GH988 - numeric options can be disabled by setting them to `false`
					if (val !== "false") {
						val = +val;

						if (typeof val !== "number" || !isFinite(val) || val <= 0 || Math.floor(val) !== val) {
							error("E032", nt, g[1].trim());
							return;
						}

						if (key === "indent") {
							state.option["(explicitIndent)"] = true;
						}
						state.option[key] = val;
					} else {
						if (key === "indent") {
							state.option["(explicitIndent)"] = false;
						} else {
							state.option[key] = false;
						}
					}

					return;
				}

				if (key === "validthis") {
					// `validthis` is valid only within a function scope.
					if (funct["(global)"]) {
						error("E009");
					} else {
						if (val === "true" || val === "false") {
							state.option.validthis = (val === "true");
						} else {
							error("E002", nt);
						}
					}
					return;
				}

				if (key === "quotmark") {
					switch (val) {
					case "true":
					case "false":
						state.option.quotmark = (val === "true");
						break;
					case "double":
					case "single":
						state.option.quotmark = val;
						break;
					default:
						error("E002", nt);
					}
					return;
				}

				if (key === "unused") {
					switch (val) {
					case "true":
						state.option.unused = true;
						break;
					case "false":
						state.option.unused = false;
						break;
					case "vars":
					case "strict":
						state.option.unused = val;
						break;
					default:
						error("E002", nt);
					}
					return;
				}

				if (key === "latedef") {
					switch (val) {
					case "true":
						state.option.latedef = true;
						break;
					case "false":
						state.option.latedef = false;
						break;
					case "nofunc":
						state.option.latedef = "nofunc";
						break;
					default:
						error("E002", nt);
					}
					return;
				}

				var match = /^([+-])(W\d{3})$/g.exec(key);
				if (match) {
					// ignore for -W..., unignore for +W...
					state.ignored[match[2]] = (match[1] === "-");
					return;
				}

				var tn;
				if (val === "true" || val === "false") {
					if (nt.type === "jslint") {
						tn = renamedOptions[key] || key;
						state.option[tn] = (val === "true");

						if (invertedOptions[tn] !== undefined) {
							state.option[tn] = !state.option[tn];
						}
					} else {
						state.option[key] = (val === "true");
					}

					if (key === "newcap") {
						state.option["(explicitNewcap)"] = true;
					}
					return;
				}

				error("E002", nt);
			});

			assume();
		}
	}

	// We need a peek function. If it has an argument, it peeks that much farther
	// ahead. It is used to distinguish
	//	   for ( var i in ...
	// from
	//	   for ( var i = ...

	function peek(p) {
		var i = p || 0, j = 0, t;

		while (j <= i) {
			t = lookahead[j];
			if (!t) {
				t = lookahead[j] = lex.token();
			}
			j += 1;
		}
		return t;
	}

	// Produce the next token. It looks for programming errors.

	function advance(id, t) {
		switch (state.tokens.curr.id) {
		case "(number)":
			if (state.tokens.next.id === ".") {
				warning("W005", state.tokens.curr);
			}
			break;
		case "-":
			if (state.tokens.next.id === "-" || state.tokens.next.id === "--") {
				warning("W006");
			}
			break;
		case "+":
			if (state.tokens.next.id === "+" || state.tokens.next.id === "++") {
				warning("W007");
			}
			break;
		}

		if (state.tokens.curr.type === "(string)" || state.tokens.curr.identifier) {
			anonname = state.tokens.curr.value;
		}

		if (id && state.tokens.next.id !== id) {
			if (t) {
				if (state.tokens.next.id === "(end)") {
					error("E019", t, t.id);
				} else {
					error("E020", state.tokens.next, id, t.id, t.line, state.tokens.next.value);
				}
			} else if (state.tokens.next.type !== "(identifier)" || state.tokens.next.value !== id) {
				warning("W116", state.tokens.next, id, state.tokens.next.value);
			}
		}

		state.tokens.prev = state.tokens.curr;
		state.tokens.curr = state.tokens.next;
		for (;;) {
			state.tokens.next = lookahead.shift() || lex.token();

			if (!state.tokens.next) { // No more tokens left, give up
				quit("E041", state.tokens.curr.line);
			}

			if (state.tokens.next.id === "(end)" || state.tokens.next.id === "(error)") {
				return;
			}

			if (state.tokens.next.check) {
				state.tokens.next.check();
			}

			if (state.tokens.next.isSpecial) {
				doOption();
			} else {
				if (state.tokens.next.id !== "(endline)") {
					break;
				}
			}
		}
	}

	function isInfix(token) {
		return token.infix || (!token.identifier && !!token.led);
	}

	function isEndOfExpr() {
		var curr = state.tokens.curr;
		var next = state.tokens.next;
		if (next.id === ";" || next.id === "}" || next.id === ":") {
			return true;
		}
		if (isInfix(next) === isInfix(curr) || (curr.id === "yield" && state.option.inMoz(true))) {
			return curr.line !== next.line;
		}
		return false;
	}

	// This is the heart of JSHINT, the Pratt parser. In addition to parsing, it
	// is looking for ad hoc lint patterns. We add .fud to Pratt's model, which is
	// like .nud except that it is only used on the first token of a statement.
	// Having .fud makes it much easier to define statement-oriented languages like
	// JavaScript. I retained Pratt's nomenclature.

	// .nud  Null denotation
	// .fud  First null denotation
	// .led  Left denotation
	//  lbp  Left binding power
	//  rbp  Right binding power

	// They are elements of the parsing method called Top Down Operator Precedence.

	function expression(rbp, initial) {
		var left, isArray = false, isObject = false, isLetExpr = false;

		// if current expression is a let expression
		if (!initial && state.tokens.next.value === "let" && peek(0).value === "(") {
			if (!state.option.inMoz(true)) {
				warning("W118", state.tokens.next, "let expressions");
			}
			isLetExpr = true;
			// create a new block scope we use only for the current expression
			funct["(blockscope)"].stack();
			advance("let");
			advance("(");
			state.syntax["let"].fud.call(state.syntax["let"].fud, false);
			advance(")");
		}

		if (state.tokens.next.id === "(end)")
			error("E006", state.tokens.curr);

		advance();

		if (initial) {
			anonname = "anonymous";
			funct["(verb)"] = state.tokens.curr.value;
		}

		if (initial === true && state.tokens.curr.fud) {
			left = state.tokens.curr.fud();
		} else {
			if (state.tokens.curr.nud) {
				left = state.tokens.curr.nud();
			} else {
				error("E030", state.tokens.curr, state.tokens.curr.id);
			}

			while (rbp < state.tokens.next.lbp && !isEndOfExpr()) {
				isArray = state.tokens.curr.value === "Array";
				isObject = state.tokens.curr.value === "Object";

				// #527, new Foo.Array(), Foo.Array(), new Foo.Object(), Foo.Object()
				// Line breaks in IfStatement heads exist to satisfy the checkJSHint
				// "Line too long." error.
				if (left && (left.value || (left.first && left.first.value))) {
					// If the left.value is not "new", or the left.first.value is a "."
					// then safely assume that this is not "new Array()" and possibly
					// not "new Object()"...
					if (left.value !== "new" ||
					  (left.first && left.first.value && left.first.value === ".")) {
						isArray = false;
						// ...In the case of Object, if the left.value and state.tokens.curr.value
						// are not equal, then safely assume that this not "new Object()"
						if (left.value !== state.tokens.curr.value) {
							isObject = false;
						}
					}
				}

				advance();

				if (isArray && state.tokens.curr.id === "(" && state.tokens.next.id === ")") {
					warning("W009", state.tokens.curr);
				}

				if (isObject && state.tokens.curr.id === "(" && state.tokens.next.id === ")") {
					warning("W010", state.tokens.curr);
				}

				if (left && state.tokens.curr.led) {
					left = state.tokens.curr.led(left);
				} else {
					error("E033", state.tokens.curr, state.tokens.curr.id);
				}
			}
		}
		if (isLetExpr) {
			funct["(blockscope)"].unstack();
		}
		return left;
	}


// Functions for conformance of style.

	function adjacent(left, right) {
		left = left || state.tokens.curr;
		right = right || state.tokens.next;
		if (state.option.white) {
			if (left.character !== right.from && left.line === right.line) {
				left.from += (left.character - left.from);
				warning("W011", left, left.value);
			}
		}
	}

	function nobreak(left, right) {
		left = left || state.tokens.curr;
		right = right || state.tokens.next;
		if (state.option.white && (left.character !== right.from || left.line !== right.line)) {
			warning("W012", right, right.value);
		}
	}

	function nospace(left, right) {
		left = left || state.tokens.curr;
		right = right || state.tokens.next;
		if (state.option.white && !left.comment) {
			if (left.line === right.line) {
				adjacent(left, right);
			}
		}
	}

	function nonadjacent(left, right) {
		if (state.option.white) {
			left = left || state.tokens.curr;
			right = right || state.tokens.next;

			if (left.value === ";" && right.value === ";") {
				return;
			}

			if (left.line === right.line && left.character === right.from) {
				left.from += (left.character - left.from);
				warning("W013", left, left.value);
			}
		}
	}

	function nobreaknonadjacent(left, right) {
		left = left || state.tokens.curr;
		right = right || state.tokens.next;
		if (!state.option.laxbreak && left.line !== right.line) {
			warning("W014", right, right.value);
		} else if (state.option.white) {
			left = left || state.tokens.curr;
			right = right || state.tokens.next;
			if (left.character === right.from) {
				left.from += (left.character - left.from);
				warning("W013", left, left.value);
			}
		}
	}

	function indentation(bias) {
		if (!state.option.white && !state.option["(explicitIndent)"]) {
			return;
		}

		if (state.tokens.next.id === "(end)") {
			return;
		}

		var i = indent + (bias || 0);
		if (state.tokens.next.from !== i) {
			warning("W015", state.tokens.next, state.tokens.next.value, i, state.tokens.next.from);
		}
	}

	function nolinebreak(t) {
		t = t || state.tokens.curr;
		if (t.line !== state.tokens.next.line) {
			warning("E022", t, t.value);
		}
	}

	function nobreakcomma(left, right) {
		if (left.line !== right.line) {
			if (!state.option.laxcomma) {
				if (comma.first) {
					warning("I001");
					comma.first = false;
				}
				warning("W014", left, right.value);
			}
		} else if (!left.comment && left.character !== right.from && state.option.white) {
			left.from += (left.character - left.from);
			warning("W011", left, left.value);
		}
	}

	function comma(opts) {
		opts = opts || {};

		if (!opts.peek) {
			nobreakcomma(state.tokens.curr, state.tokens.next);
			advance(",");
		} else {
			nobreakcomma(state.tokens.prev, state.tokens.curr);
		}

		// TODO: This is a temporary solution to fight against false-positives in
		// arrays and objects with trailing commas (see GH-363). The best solution
		// would be to extract all whitespace rules out of parser.

		if (state.tokens.next.value !== "]" && state.tokens.next.value !== "}") {
			nonadjacent(state.tokens.curr, state.tokens.next);
		}

		if (state.tokens.next.identifier && !(opts.property && state.option.inES5())) {
			// Keywords that cannot follow a comma operator.
			switch (state.tokens.next.value) {
			case "break":
			case "case":
			case "catch":
			case "continue":
			case "default":
			case "do":
			case "else":
			case "finally":
			case "for":
			case "if":
			case "in":
			case "instanceof":
			case "return":
			case "switch":
			case "throw":
			case "try":
			case "var":
			case "let":
			case "while":
			case "with":
				error("E024", state.tokens.next, state.tokens.next.value);
				return false;
			}
		}

		if (state.tokens.next.type === "(punctuator)") {
			switch (state.tokens.next.value) {
			case "}":
			case "]":
			case ",":
				if (opts.allowTrailing) {
					return true;
				}

				/* falls through */
			case ")":
				error("E024", state.tokens.next, state.tokens.next.value);
				return false;
			}
		}
		return true;
	}

	// Functional constructors for making the symbols that will be inherited by
	// tokens.

	function symbol(s, p) {
		var x = state.syntax[s];
		if (!x || typeof x !== "object") {
			state.syntax[s] = x = {
				id: s,
				lbp: p,
				value: s
			};
		}
		return x;
	}

	function delim(s) {
		return symbol(s, 0);
	}

	function stmt(s, f) {
		var x = delim(s);
		x.identifier = x.reserved = true;
		x.fud = f;
		return x;
	}

	function blockstmt(s, f) {
		var x = stmt(s, f);
		x.block = true;
		return x;
	}

	function reserveName(x) {
		var c = x.id.charAt(0);
		if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) {
			x.identifier = x.reserved = true;
		}
		return x;
	}

	function prefix(s, f) {
		var x = symbol(s, 150);
		reserveName(x);
		x.nud = (typeof f === "function") ? f : function () {
			this.right = expression(150);
			this.arity = "unary";
			if (this.id === "++" || this.id === "--") {
				if (state.option.plusplus) {
					warning("W016", this, this.id);
				} else if ((!this.right.identifier || isReserved(this.right)) &&
						this.right.id !== "." && this.right.id !== "[") {
					warning("W017", this);
				}
			}
			return this;
		};
		return x;
	}

	function type(s, f) {
		var x = delim(s);
		x.type = s;
		x.nud = f;
		return x;
	}

	function reserve(name, func) {
		var x = type(name, func);
		x.identifier = true;
		x.reserved = true;
		return x;
	}

	function FutureReservedWord(name, meta) {
		var x = type(name, (meta && meta.nud) || function () {
			return this;
		});

		meta = meta || {};
		meta.isFutureReservedWord = true;

		x.value = name;
		x.identifier = true;
		x.reserved = true;
		x.meta = meta;

		return x;
	}

	function reservevar(s, v) {
		return reserve(s, function () {
			if (typeof v === "function") {
				v(this);
			}
			return this;
		});
	}

	function infix(s, f, p, w) {
		var x = symbol(s, p);
		reserveName(x);
		x.infix = true;
		x.led = function (left) {
			if (!w) {
				nobreaknonadjacent(state.tokens.prev, state.tokens.curr);
				nonadjacent(state.tokens.curr, state.tokens.next);
			}
			if (s === "in" && left.id === "!") {
				warning("W018", left, "!");
			}
			if (typeof f === "function") {
				return f(left, this);
			} else {
				this.left = left;
				this.right = expression(p);
				return this;
			}
		};
		return x;
	}


	function application(s) {
		var x = symbol(s, 42);

		x.led = function (left) {
			if (!state.option.inESNext()) {
				warning("W104", state.tokens.curr, "arrow function syntax (=>)");
			}

			nobreaknonadjacent(state.tokens.prev, state.tokens.curr);
			nonadjacent(state.tokens.curr, state.tokens.next);

			this.left = left;
			this.right = doFunction(undefined, undefined, false, left);
			return this;
		};
		return x;
	}

	function relation(s, f) {
		var x = symbol(s, 100);

		x.led = function (left) {
			nobreaknonadjacent(state.tokens.prev, state.tokens.curr);
			nonadjacent(state.tokens.curr, state.tokens.next);
			var right = expression(100);

			if (isIdentifier(left, "NaN") || isIdentifier(right, "NaN")) {
				warning("W019", this);
			} else if (f) {
				f.apply(this, [left, right]);
			}

			if (!left || !right) {
				quit("E041", state.tokens.curr.line);
			}

			if (left.id === "!") {
				warning("W018", left, "!");
			}

			if (right.id === "!") {
				warning("W018", right, "!");
			}

			this.left = left;
			this.right = right;
			return this;
		};
		return x;
	}

	function isPoorRelation(node) {
		return node &&
			  ((node.type === "(number)" && +node.value === 0) ||
			   (node.type === "(string)" && node.value === "") ||
			   (node.type === "null" && !state.option.eqnull) ||
				node.type === "true" ||
				node.type === "false" ||
				node.type === "undefined");
	}

	function assignop(s, f, p) {
		var x = infix(s, typeof f === "function" ? f : function (left, that) {
			that.left = left;

			if (left) {
				if (predefined[left.value] === false &&
						scope[left.value]["(global)"] === true) {
					warning("W020", left);
				} else if (left["function"]) {
					warning("W021", left, left.value);
				}

				if (funct[left.value] === "const") {
					error("E013", left, left.value);
				}

				if (left.id === ".") {
					if (!left.left) {
						warning("E031", that);
					} else if (left.left.value === "arguments" && !state.directive["use strict"]) {
						warning("E031", that);
					}

					that.right = expression(10);
					return that;
				} else if (left.id === "[") {
					if (state.tokens.curr.left.first) {
						state.tokens.curr.left.first.forEach(function (t) {
							if (funct[t.value] === "const") {
								error("E013", t, t.value);
							}
						});
					} else if (!left.left) {
						warning("E031", that);
					} else if (left.left.value === "arguments" && !state.directive["use strict"]) {
						warning("E031", that);
					}
					that.right = expression(10);
					return that;
				} else if (left.identifier && !isReserved(left)) {
					if (funct[left.value] === "exception") {
						warning("W022", left);
					}
					that.right = expression(10);
					return that;
				}

				if (left === state.syntax["function"]) {
					warning("W023", state.tokens.curr);
				}
			}

			error("E031", that);
		}, p);

		x.exps = true;
		x.assign = true;
		return x;
	}


	function bitwise(s, f, p) {
		var x = symbol(s, p);
		reserveName(x);
		x.led = (typeof f === "function") ? f : function (left) {
			if (state.option.bitwise) {
				warning("W016", this, this.id);
			}
			this.left = left;
			this.right = expression(p);
			return this;
		};
		return x;
	}


	function bitwiseassignop(s) {
		return assignop(s, function (left, that) {
			if (state.option.bitwise) {
				warning("W016", that, that.id);
			}
			nonadjacent(state.tokens.prev, state.tokens.curr);
			nonadjacent(state.tokens.curr, state.tokens.next);
			if (left) {
				if (left.id === "." || left.id === "[" ||
						(left.identifier && !isReserved(left))) {
					expression(10);
					return that;
				}
				if (left === state.syntax["function"]) {
					warning("W023", state.tokens.curr);
				}
				return that;
			}
			error("E031", that);
		}, 20);
	}


	function suffix(s) {
		var x = symbol(s, 150);

		x.led = function (left) {
			if (state.option.plusplus) {
				warning("W016", this, this.id);
			} else if ((!left.identifier || isReserved(left)) && left.id !== "." && left.id !== "[") {
				warning("W017", this);
			}

			this.left = left;
			return this;
		};
		return x;
	}

	// fnparam means that this identifier is being defined as a function
	// argument (see identifier())
	// prop means that this identifier is that of an object property

	function optionalidentifier(fnparam, prop) {
		if (!state.tokens.next.identifier) {
			return;
		}

		advance();

		var curr = state.tokens.curr;
		var val  = state.tokens.curr.value;

		if (!isReserved(curr)) {
			return val;
		}

		if (prop) {
			if (state.option.inES5()) {
				return val;
			}
		}

		if (fnparam && val === "undefined") {
			return val;
		}

		// Display an info message about reserved words as properties
		// and ES5 but do it only once.
		if (prop && !api.getCache("displayed:I002")) {
			api.setCache("displayed:I002", true);
			warning("I002");
		}

		warning("W024", state.tokens.curr, state.tokens.curr.id);
		return val;
	}

	// fnparam means that this identifier is being defined as a function
	// argument
	// prop means that this identifier is that of an object property
	function identifier(fnparam, prop) {
		var i = optionalidentifier(fnparam, prop);
		if (i) {
			return i;
		}
		if (state.tokens.curr.id === "function" && state.tokens.next.id === "(") {
			warning("W025");
		} else {
			error("E030", state.tokens.next, state.tokens.next.value);
		}
	}


	function reachable(s) {
		var i = 0, t;
		if (state.tokens.next.id !== ";" || noreach) {
			return;
		}
		for (;;) {
			t = peek(i);
			if (t.reach) {
				return;
			}
			if (t.id !== "(endline)") {
				if (t.id === "function") {
					if (!state.option.latedef) {
						break;
					}

					warning("W026", t);
					break;
				}

				warning("W027", t, t.value, s);
				break;
			}
			i += 1;
		}
	}


	function statement(noindent) {
		var values;
		var i = indent, r, s = scope, t = state.tokens.next;

		if (t.id === ";") {
			advance(";");
			return;
		}

		// Is this a labelled statement?
		var res = isReserved(t);

		// We're being more tolerant here: if someone uses
		// a FutureReservedWord as a label, we warn but proceed
		// anyway.

		if (res && t.meta && t.meta.isFutureReservedWord && peek().id === ":") {
			warning("W024", t, t.id);
			res = false;
		}

		// detect a destructuring assignment
		if (_.has(["[", "{"], t.value)) {
			if (lookupBlockType().isDestAssign) {
				if (!state.option.inESNext()) {
					warning("W104", state.tokens.curr, "destructuring expression");
				}
				values = destructuringExpression();
				values.forEach(function (tok) {
					isundef(funct, "W117", tok.token, tok.id);
				});
				advance("=");
				destructuringExpressionMatch(values, expression(10, true));
				advance(";");
				return;
			}
		}
		if (t.identifier && !res && peek().id === ":") {
			advance();
			advance(":");
			scope = Object.create(s);
			addlabel(t.value, "label");

			if (!state.tokens.next.labelled && state.tokens.next.value !== "{") {
				warning("W028", state.tokens.next, t.value, state.tokens.next.value);
			}

			state.tokens.next.label = t.value;
			t = state.tokens.next;
		}

		// Is it a lonely block?

		if (t.id === "{") {
			block(true, true);
			return;
		}

		// Parse the statement.

		if (!noindent) {
			indentation();
		}
		r = expression(0, true);

		// Look for the final semicolon.

		if (!t.block) {
			if (!state.option.expr && (!r || !r.exps)) {
				warning("W030", state.tokens.curr);
			} else if (state.option.nonew && r && r.left && r.id === "(" && r.left.id === "new") {
				warning("W031", t);
			}

			if (state.tokens.next.id !== ";") {
				if (!state.option.asi) {
					// If this is the last statement in a block that ends on
					// the same line *and* option lastsemic is on, ignore the warning.
					// Otherwise, complain about missing semicolon.
					if (!state.option.lastsemic || state.tokens.next.id !== "}" ||
						state.tokens.next.line !== state.tokens.curr.line) {
						warningAt("W033", state.tokens.curr.line, state.tokens.curr.character);
					}
				}
			} else {
				adjacent(state.tokens.curr, state.tokens.next);
				advance(";");
				nonadjacent(state.tokens.curr, state.tokens.next);
			}
		}

		// Restore the indentation.

		indent = i;
		scope = s;
		return r;
	}


	function statements(startLine) {
		var a = [], p;

		while (!state.tokens.next.reach && state.tokens.next.id !== "(end)") {
			if (state.tokens.next.id === ";") {
				p = peek();

				if (!p || (p.id !== "(" && p.id !== "[")) {
					warning("W032");
				}

				advance(";");
			} else {
				a.push(statement(startLine === state.tokens.next.line));
			}
		}
		return a;
	}


	/*
	 * read all directives
	 * recognizes a simple form of asi, but always
	 * warns, if it is used
	 */
	function directives() {
		var i, p, pn;

		for (;;) {
			if (state.tokens.next.id === "(string)") {
				p = peek(0);
				if (p.id === "(endline)") {
					i = 1;
					do {
						pn = peek(i);
						i = i + 1;
					} while (pn.id === "(endline)");

					if (pn.id !== ";") {
						if (pn.id !== "(string)" && pn.id !== "(number)" &&
							pn.id !== "(regexp)" && pn.identifier !== true &&
							pn.id !== "}") {
							break;
						}
						warning("W033", state.tokens.next);
					} else {
						p = pn;
					}
				} else if (p.id === "}") {
					// Directive with no other statements, warn about missing semicolon
					warning("W033", p);
				} else if (p.id !== ";") {
					break;
				}

				indentation();
				advance();
				if (state.directive[state.tokens.curr.value]) {
					warning("W034", state.tokens.curr, state.tokens.curr.value);
				}

				if (state.tokens.curr.value === "use strict") {
					if (!state.option["(explicitNewcap)"])
						state.option.newcap = true;
					state.option.undef = true;
				}

				// there's no directive negation, so always set to true
				state.directive[state.tokens.curr.value] = true;

				if (p.id === ";") {
					advance(";");
				}
				continue;
			}
			break;
		}
	}


	/*
	 * Parses a single block. A block is a sequence of statements wrapped in
	 * braces.
	 *
	 * ordinary - true for everything but function bodies and try blocks.
	 * stmt		- true if block can be a single statement (e.g. in if/for/while).
	 * isfunc	- true if block is a function body
	 */
	function block(ordinary, stmt, isfunc, isfatarrow) {
		var a,
			b = inblock,
			old_indent = indent,
			m,
			s = scope,
			t,
			line,
			d;

		inblock = ordinary;

		if (!ordinary || !state.option.funcscope)
			scope = Object.create(scope);

		nonadjacent(state.tokens.curr, state.tokens.next);
		t = state.tokens.next;

		var metrics = funct["(metrics)"];
		metrics.nestedBlockDepth += 1;
		metrics.verifyMaxNestedBlockDepthPerFunction();

		if (state.tokens.next.id === "{") {
			advance("{");

			// create a new block scope
			funct["(blockscope)"].stack();

			line = state.tokens.curr.line;
			if (state.tokens.next.id !== "}") {
				indent += state.option.indent;
				while (!ordinary && state.tokens.next.from > indent) {
					indent += state.option.indent;
				}

				if (isfunc) {
					m = {};
					for (d in state.directive) {
						if (_.has(state.directive, d)) {
							m[d] = state.directive[d];
						}
					}
					directives();

					if (state.option.strict && funct["(context)"]["(global)"]) {
						if (!m["use strict"] && !state.directive["use strict"]) {
							warning("E007");
						}
					}
				}

				a = statements(line);

				metrics.statementCount += a.length;

				if (isfunc) {
					state.directive = m;
				}

				indent -= state.option.indent;
				if (line !== state.tokens.next.line) {
					indentation();
				}
			} else if (line !== state.tokens.next.line) {
				indentation();
			}
			advance("}", t);

			funct["(blockscope)"].unstack();

			indent = old_indent;
		} else if (!ordinary) {
			if (isfunc) {
				m = {};
				if (stmt && !isfatarrow && !state.option.inMoz(true)) {
					error("W118", state.tokens.curr, "function closure expressions");
				}

				if (!stmt) {
					for (d in state.directive) {
						if (_.has(state.directive, d)) {
							m[d] = state.directive[d];
						}
					}
				}
				expression(10);

				if (state.option.strict && funct["(context)"]["(global)"]) {
					if (!m["use strict"] && !state.directive["use strict"]) {
						warning("E007");
					}
				}
			} else {
				error("E021", state.tokens.next, "{", state.tokens.next.value);
			}
		} else {

			// check to avoid let declaration not within a block
			funct["(nolet)"] = true;

			if (!stmt || state.option.curly) {
				warning("W116", state.tokens.next, "{", state.tokens.next.value);
			}

			noreach = true;
			indent += state.option.indent;
			// test indentation only if statement is in new line
			a = [statement(state.tokens.next.line === state.tokens.curr.line)];
			indent -= state.option.indent;
			noreach = false;

			delete funct["(nolet)"];
		}
		funct["(verb)"] = null;
		if (!ordinary || !state.option.funcscope) scope = s;
		inblock = b;
		if (ordinary && state.option.noempty && (!a || a.length === 0)) {
			warning("W035");
		}
		metrics.nestedBlockDepth -= 1;
		return a;
	}


	function countMember(m) {
		if (membersOnly && typeof membersOnly[m] !== "boolean") {
			warning("W036", state.tokens.curr, m);
		}
		if (typeof member[m] === "number") {
			member[m] += 1;
		} else {
			member[m] = 1;
		}
	}


	function note_implied(tkn) {
		var name = tkn.value, line = tkn.line, a = implied[name];
		if (typeof a === "function") {
			a = false;
		}

		if (!a) {
			a = [line];
			implied[name] = a;
		} else if (a[a.length - 1] !== line) {
			a.push(line);
		}
	}


	// Build the syntax table by declaring the syntactic elements of the language.

	type("(number)", function () {
		return this;
	});

	type("(string)", function () {
		return this;
	});

	state.syntax["(identifier)"] = {
		type: "(identifier)",
		lbp: 0,
		identifier: true,
		nud: function () {
			var v = this.value,
				s = scope[v],
				f;

			if (typeof s === "function") {
				// Protection against accidental inheritance.
				s = undefined;
			} else if (typeof s === "boolean") {
				f = funct;
				funct = functions[0];
				addlabel(v, "var");
				s = funct;
				funct = f;
			}
			var block;
			if (_.has(funct, "(blockscope)")) {
				block = funct["(blockscope)"].getlabel(v);
			}

			// The name is in scope and defined in the current function.
			if (funct === s || block) {
				// Change 'unused' to 'var', and reject labels.
				// the name is in a block scope
				switch (block ? block[v]["(type)"] : funct[v]) {
				case "unused":
					if (block) block[v]["(type)"] = "var";
					else funct[v] = "var";
					break;
				case "unction":
					if (block) block[v]["(type)"] = "function";
					else funct[v] = "function";
					this["function"] = true;
					break;
				case "function":
					this["function"] = true;
					break;
				case "label":
					warning("W037", state.tokens.curr, v);
					break;
				}
			} else if (funct["(global)"]) {
				// The name is not defined in the function.  If we are in the global
				// scope, then we have an undefined variable.
				//
				// Operators typeof and delete do not raise runtime errors even if
				// the base object of a reference is null so no need to display warning
				// if we're inside of typeof or delete.

				if (typeof predefined[v] !== "boolean") {
					// Attempting to subscript a null reference will throw an
					// error, even within the typeof and delete operators
					if (!(anonname === "typeof" || anonname === "delete") ||
						(state.tokens.next && (state.tokens.next.value === "." ||
							state.tokens.next.value === "["))) {

						// if we're in a list comprehension, variables are declared
						// locally and used before being defined. So we check
						// the presence of the given variable in the comp array
						// before declaring it undefined.

						if (!funct["(comparray)"].check(v)) {
							isundef(funct, "W117", state.tokens.curr, v);
						}
					}
				}

				note_implied(state.tokens.curr);
			} else {
				// If the name is already defined in the current
				// function, but not as outer, then there is a scope error.

				switch (funct[v]) {
				case "closure":
				case "function":
				case "var":
				case "unused":
					warning("W038", state.tokens.curr, v);
					break;
				case "label":
					warning("W037", state.tokens.curr, v);
					break;
				case "outer":
				case "global":
					break;
				default:
					// If the name is defined in an outer function, make an outer entry,
					// and if it was unused, make it var.
					if (s === true) {
						funct[v] = true;
					} else if (s === null) {
						warning("W039", state.tokens.curr, v);
						note_implied(state.tokens.curr);
					} else if (typeof s !== "object") {
						// Operators typeof and delete do not raise runtime errors even
						// if the base object of a reference is null so no need to
						//
						// display warning if we're inside of typeof or delete.
						// Attempting to subscript a null reference will throw an
						// error, even within the typeof and delete operators
						if (!(anonname === "typeof" || anonname === "delete") ||
							(state.tokens.next &&
								(state.tokens.next.value === "." || state.tokens.next.value === "["))) {

							isundef(funct, "W117", state.tokens.curr, v);
						}
						funct[v] = true;
						note_implied(state.tokens.curr);
					} else {
						switch (s[v]) {
						case "function":
						case "unction":
							this["function"] = true;
							s[v] = "closure";
							funct[v] = s["(global)"] ? "global" : "outer";
							break;
						case "var":
						case "unused":
							s[v] = "closure";
							funct[v] = s["(global)"] ? "global" : "outer";
							break;
						case "closure":
							funct[v] = s["(global)"] ? "global" : "outer";
							break;
						case "label":
							warning("W037", state.tokens.curr, v);
						}
					}
				}
			}
			return this;
		},
		led: function () {
			error("E033", state.tokens.next, state.tokens.next.value);
		}
	};

	type("(regexp)", function () {
		return this;
	});

	// ECMAScript parser

	delim("(endline)");
	delim("(begin)");
	delim("(end)").reach = true;
	delim("(error)").reach = true;
	delim("}").reach = true;
	delim(")");
	delim("]");
	delim("\"").reach = true;
	delim("'").reach = true;
	delim(";");
	delim(":").reach = true;
	delim("#");

	reserve("else");
	reserve("case").reach = true;
	reserve("catch");
	reserve("default").reach = true;
	reserve("finally");
	reservevar("arguments", function (x) {
		if (state.directive["use strict"] && funct["(global)"]) {
			warning("E008", x);
		}
	});
	reservevar("eval");
	reservevar("false");
	reservevar("Infinity");
	reservevar("null");
	reservevar("this", function (x) {
		if (state.directive["use strict"] && !state.option.validthis && ((funct["(statement)"] &&
				funct["(name)"].charAt(0) > "Z") || funct["(global)"])) {
			warning("W040", x);
		}
	});
	reservevar("true");
	reservevar("undefined");

	assignop("=", "assign", 20);
	assignop("+=", "assignadd", 20);
	assignop("-=", "assignsub", 20);
	assignop("*=", "assignmult", 20);
	assignop("/=", "assigndiv", 20).nud = function () {
		error("E014");
	};
	assignop("%=", "assignmod", 20);

	bitwiseassignop("&=", "assignbitand", 20);
	bitwiseassignop("|=", "assignbitor", 20);
	bitwiseassignop("^=", "assignbitxor", 20);
	bitwiseassignop("<<=", "assignshiftleft", 20);
	bitwiseassignop(">>=", "assignshiftright", 20);
	bitwiseassignop(">>>=", "assignshiftrightunsigned", 20);
	infix(",", function (left, that) {
		var expr;
		that.exprs = [left];
		if (!comma({peek: true})) {
			return that;
		}
		while (true) {
			if (!(expr = expression(10)))  {
				break;
			}
			that.exprs.push(expr);
			if (state.tokens.next.value !== "," || !comma()) {
				break;
			}
		}
		return that;
	}, 10, true);

	infix("?", function (left, that) {
		increaseComplexityCount();
		that.left = left;
		that.right = expression(10);
		advance(":");
		that["else"] = expression(10);
		return that;
	}, 30);

	var orPrecendence = 40;
	infix("||", function (left, that) {
		increaseComplexityCount();
		that.left = left;
		that.right = expression(orPrecendence);
		return that;
	}, orPrecendence);
	infix("&&", "and", 50);
	bitwise("|", "bitor", 70);
	bitwise("^", "bitxor", 80);
	bitwise("&", "bitand", 90);
	relation("==", function (left, right) {
		var eqnull = state.option.eqnull && (left.value === "null" || right.value === "null");

		if (!eqnull && state.option.eqeqeq)
			warning("W116", this, "===", "==");
		else if (isPoorRelation(left))
			warning("W041", this, "===", left.value);
		else if (isPoorRelation(right))
			warning("W041", this, "===", right.value);

		return this;
	});
	relation("===");
	relation("!=", function (left, right) {
		var eqnull = state.option.eqnull &&
				(left.value === "null" || right.value === "null");

		if (!eqnull && state.option.eqeqeq) {
			warning("W116", this, "!==", "!=");
		} else if (isPoorRelation(left)) {
			warning("W041", this, "!==", left.value);
		} else if (isPoorRelation(right)) {
			warning("W041", this, "!==", right.value);
		}
		return this;
	});
	relation("!==");
	relation("<");
	relation(">");
	relation("<=");
	relation(">=");
	bitwise("<<", "shiftleft", 120);
	bitwise(">>", "shiftright", 120);
	bitwise(">>>", "shiftrightunsigned", 120);
	infix("in", "in", 120);
	infix("instanceof", "instanceof", 120);
	infix("+", function (left, that) {
		var right = expression(130);
		if (left && right && left.id === "(string)" && right.id === "(string)") {
			left.value += right.value;
			left.character = right.character;
			if (!state.option.scripturl && reg.javascriptURL.test(left.value)) {
				warning("W050", left);
			}
			return left;
		}
		that.left = left;
		that.right = right;
		return that;
	}, 130);
	prefix("+", "num");
	prefix("+++", function () {
		warning("W007");
		this.right = expression(150);
		this.arity = "unary";
		return this;
	});
	infix("+++", function (left) {
		warning("W007");
		this.left = left;
		this.right = expression(130);
		return this;
	}, 130);
	infix("-", "sub", 130);
	prefix("-", "neg");
	prefix("---", function () {
		warning("W006");
		this.right = expression(150);
		this.arity = "unary";
		return this;
	});
	infix("---", function (left) {
		warning("W006");
		this.left = left;
		this.right = expression(130);
		return this;
	}, 130);
	infix("*", "mult", 140);
	infix("/", "div", 140);
	infix("%", "mod", 140);

	suffix("++", "postinc");
	prefix("++", "preinc");
	state.syntax["++"].exps = true;

	suffix("--", "postdec");
	prefix("--", "predec");
	state.syntax["--"].exps = true;
	prefix("delete", function () {
		var p = expression(10);
		if (!p || (p.id !== "." && p.id !== "[")) {
			warning("W051");
		}
		this.first = p;
		return this;
	}).exps = true;

	prefix("~", function () {
		if (state.option.bitwise) {
			warning("W052", this, "~");
		}
		expression(150);
		return this;
	});

	prefix("...", function () {
		if (!state.option.inESNext()) {
			warning("W104", this, "spread/rest operator");
		}
		if (!state.tokens.next.identifier) {
			error("E030", state.tokens.next, state.tokens.next.value);
		}
		expression(150);
		return this;
	});

	prefix("!", function () {
		this.right = expression(150);
		this.arity = "unary";

		if (!this.right) { // '!' followed by nothing? Give up.
			quit("E041", this.line || 0);
		}

		if (bang[this.right.id] === true) {
			warning("W018", this, "!");
		}
		return this;
	});

	prefix("typeof", "typeof");
	prefix("new", function () {
		var c = expression(155), i;
		if (c && c.id !== "function") {
			if (c.identifier) {
				c["new"] = true;
				switch (c.value) {
				case "Number":
				case "String":
				case "Boolean":
				case "Math":
				case "JSON":
					warning("W053", state.tokens.prev, c.value);
					break;
				case "Function":
					if (!state.option.evil) {
						warning("W054");
					}
					break;
				case "Date":
				case "RegExp":
					break;
				default:
					if (c.id !== "function") {
						i = c.value.substr(0, 1);
						if (state.option.newcap && (i < "A" || i > "Z") && !_.has(global, c.value)) {
							warning("W055", state.tokens.curr);
						}
					}
				}
			} else {
				if (c.id !== "." && c.id !== "[" && c.id !== "(") {
					warning("W056", state.tokens.curr);
				}
			}
		} else {
			if (!state.option.supernew)
				warning("W057", this);
		}
		adjacent(state.tokens.curr, state.tokens.next);
		if (state.tokens.next.id !== "(" && !state.option.supernew) {
			warning("W058", state.tokens.curr, state.tokens.curr.value);
		}
		this.first = c;
		return this;
	});
	state.syntax["new"].exps = true;

	prefix("void").exps = true;

	infix(".", function (left, that) {
		adjacent(state.tokens.prev, state.tokens.curr);
		nobreak();
		var m = identifier(false, true);

		if (typeof m === "string") {
			countMember(m);
		}

		that.left = left;
		that.right = m;

		if (m && m === "hasOwnProperty" && state.tokens.next.value === "=") {
			warning("W001");
		}

		if (left && left.value === "arguments" && (m === "callee" || m === "caller")) {
			if (state.option.noarg)
				warning("W059", left, m);
			else if (state.directive["use strict"])
				error("E008");
		} else if (!state.option.evil && left && left.value === "document" &&
				(m === "write" || m === "writeln")) {
			warning("W060", left);
		}

		if (!state.option.evil && (m === "eval" || m === "execScript")) {
			warning("W061");
		}

		return that;
	}, 160, true);

	infix("(", function (left, that) {
		if (state.tokens.prev.id !== "}" && state.tokens.prev.id !== ")") {
			nobreak(state.tokens.prev, state.tokens.curr);
		}

		nospace();
		if (state.option.immed && left && !left.immed && left.id === "function") {
			warning("W062");
		}

		var n = 0;
		var p = [];

		if (left) {
			if (left.type === "(identifier)") {
				if (left.value.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/)) {
					if ("Number String Boolean Date Object".indexOf(left.value) === -1) {
						if (left.value === "Math") {
							warning("W063", left);
						} else if (state.option.newcap) {
							warning("W064", left);
						}
					}
				}
			}
		}

		if (state.tokens.next.id !== ")") {
			for (;;) {
				p[p.length] = expression(10);
				n += 1;
				if (state.tokens.next.id !== ",") {
					break;
				}
				comma();
			}
		}

		advance(")");
		nospace(state.tokens.prev, state.tokens.curr);

		if (typeof left === "object") {
			if (left.value === "parseInt" && n === 1) {
				warning("W065", state.tokens.curr);
			}
			if (!state.option.evil) {
				if (left.value === "eval" || left.value === "Function" ||
						left.value === "execScript") {
					warning("W061", left);

					if (p[0] && [0].id === "(string)") {
						addInternalSrc(left, p[0].value);
					}
				} else if (p[0] && p[0].id === "(string)" &&
					   (left.value === "setTimeout" ||
						left.value === "setInterval")) {
					warning("W066", left);
					addInternalSrc(left, p[0].value);

				// window.setTimeout/setInterval
				} else if (p[0] && p[0].id === "(string)" &&
					   left.value === "." &&
					   left.left.value === "window" &&
					   (left.right === "setTimeout" ||
						left.right === "setInterval")) {
					warning("W066", left);
					addInternalSrc(left, p[0].value);
				}
			}
			if (!left.identifier && left.id !== "." && left.id !== "[" &&
					left.id !== "(" && left.id !== "&&" && left.id !== "||" &&
					left.id !== "?") {
				warning("W067", left);
			}
		}

		that.left = left;
		return that;
	}, 155, true).exps = true;

	prefix("(", function () {
		nospace();
		var bracket, brackets = [];
		var pn, pn1, i = 0;
		var ret;

		do {
			pn = peek(i);
			i += 1;
			pn1 = peek(i);
			i += 1;
		} while (pn.value !== ")" && pn1.value !== "=>" && pn1.value !== ";" && pn1.type !== "(end)");

		if (state.tokens.next.id === "function") {
			state.tokens.next.immed = true;
		}

		var exprs = [];

		if (state.tokens.next.id !== ")") {
			for (;;) {
				if (pn1.value === "=>" && state.tokens.next.value === "{") {
					bracket = state.tokens.next;
					bracket.left = destructuringExpression();
					brackets.push(bracket);
					for (var t in bracket.left) {
						exprs.push(bracket.left[t].token);
					}
				} else {
					exprs.push(expression(10));
				}
				if (state.tokens.next.id !== ",") {
					break;
				}
				comma();
			}
		}

		advance(")", this);
		nospace(state.tokens.prev, state.tokens.curr);
		if (state.option.immed && exprs[0] && exprs[0].id === "function") {
			if (state.tokens.next.id !== "(" &&
			  (state.tokens.next.id !== "." || (peek().value !== "call" && peek().value !== "apply"))) {
				warning("W068", this);
			}
		}

		if (state.tokens.next.value === "=>") {
			return exprs;
		}
		if (!exprs.length) {
			return;
		}
		if (exprs.length > 1) {
			ret = Object.create(state.syntax[","]);
			ret.exprs = exprs;
		} else {
			ret = exprs[0];
		}
		if (ret) {
			ret.paren = true;
		}
		return ret;
	});

	application("=>");

	infix("[", function (left, that) {
		nobreak(state.tokens.prev, state.tokens.curr);
		nospace();
		var e = expression(10), s;
		if (e && e.type === "(string)") {
			if (!state.option.evil && (e.value === "eval" || e.value === "execScript")) {
				warning("W061", that);
			}

			countMember(e.value);
			if (!state.option.sub && reg.identifier.test(e.value)) {
				s = state.syntax[e.value];
				if (!s || !isReserved(s)) {
					warning("W069", state.tokens.prev, e.value);
				}
			}
		}
		advance("]", that);

		if (e && e.value === "hasOwnProperty" && state.tokens.next.value === "=") {
			warning("W001");
		}

		nospace(state.tokens.prev, state.tokens.curr);
		that.left = left;
		that.right = e;
		return that;
	}, 160, true);

	function comprehensiveArrayExpression() {
		var res = {};
		res.exps = true;
		funct["(comparray)"].stack();

		res.right = expression(10);
		advance("for");
		if (state.tokens.next.value === "each") {
			advance("each");
			if (!state.option.inMoz(true)) {
				warning("W118", state.tokens.curr, "for each");
			}
		}
		advance("(");
		funct["(comparray)"].setState("define");
		res.left = expression(10);
		advance(")");
		if (state.tokens.next.value === "if") {
			advance("if");
			advance("(");
			funct["(comparray)"].setState("filter");
			res.filter = expression(10);
			advance(")");
		}
		advance("]");
		funct["(comparray)"].unstack();
		return res;
	}

	prefix("[", function () {
		var blocktype = lookupBlockType(true);
		if (blocktype.isCompArray) {
			if (!state.option.inMoz(true)) {
				warning("W118", state.tokens.curr, "array comprehension");
			}
			return comprehensiveArrayExpression();
		} else if (blocktype.isDestAssign && !state.option.inESNext()) {
			warning("W104", state.tokens.curr, "destructuring assignment");
		}
		var b = state.tokens.curr.line !== state.tokens.next.line;
		this.first = [];
		if (b) {
			indent += state.option.indent;
			if (state.tokens.next.from === indent + state.option.indent) {
				indent += state.option.indent;
			}
		}
		while (state.tokens.next.id !== "(end)") {
			while (state.tokens.next.id === ",") {
				if (!state.option.inES5())
					warning("W070");
				advance(",");
			}
			if (state.tokens.next.id === "]") {
				break;
			}
			if (b && state.tokens.curr.line !== state.tokens.next.line) {
				indentation();
			}
			this.first.push(expression(10));
			if (state.tokens.next.id === ",") {
				comma({ allowTrailing: true });
				if (state.tokens.next.id === "]" && !state.option.inES5(true)) {
					warning("W070", state.tokens.curr);
					break;
				}
			} else {
				break;
			}
		}
		if (b) {
			indent -= state.option.indent;
			indentation();
		}
		advance("]", this);
		return this;
	}, 160);


	function property_name() {
		var id = optionalidentifier(false, true);

		if (!id) {
			if (state.tokens.next.id === "(string)") {
				id = state.tokens.next.value;
				advance();
			} else if (state.tokens.next.id === "(number)") {
				id = state.tokens.next.value.toString();
				advance();
			}
		}

		if (id === "hasOwnProperty") {
			warning("W001");
		}

		return id;
	}


	function functionparams(parsed) {
		var curr, next;
		var params = [];
		var ident;
		var tokens = [];
		var t;
		var pastDefault = false;

		if (parsed) {
			if (parsed instanceof Array) {
				for (var i in parsed) {
					curr = parsed[i];
					if (_.contains(["{", "["], curr.id)) {
						for (t in curr.left) {
							t = tokens[t];
							if (t.id) {
								params.push(t.id);
								addlabel(t.id, "unused", t.token);
							}
						}
					} else if (curr.value === "...") {
						if (!state.option.inESNext()) {
							warning("W104", curr, "spread/rest operator");
						}
						continue;
					} else {
						addlabel(curr.value, "unused", curr);
					}
				}
				return params;
			} else {
				if (parsed.identifier === true) {
					addlabel(parsed.value, "unused", parsed);
					return [parsed];
				}
			}
		}

		next = state.tokens.next;

		advance("(");
		nospace();

		if (state.tokens.next.id === ")") {
			advance(")");
			return;
		}

		for (;;) {
			if (_.contains(["{", "["], state.tokens.next.id)) {
				tokens = destructuringExpression();
				for (t in tokens) {
					t = tokens[t];
					if (t.id) {
						params.push(t.id);
						addlabel(t.id, "unused", t.token);
					}
				}
			} else if (state.tokens.next.value === "...") {
				if (!state.option.inESNext()) {
					warning("W104", state.tokens.next, "spread/rest operator");
				}
				advance("...");
				nospace();
				ident = identifier(true);
				params.push(ident);
				addlabel(ident, "unused", state.tokens.curr);
			} else {
				ident = identifier(true);
				params.push(ident);
				addlabel(ident, "unused", state.tokens.curr);
			}

			// it is a syntax error to have a regular argument after a default argument
			if (pastDefault) {
				if (state.tokens.next.id !== "=") {
					error("E051", state.tokens.current);
				}
			}
			if (state.tokens.next.id === "=") {
				if (!state.option.inESNext()) {
					warning("W119", state.tokens.next, "default parameters");
				}
				advance("=");
				pastDefault = true;
				expression(10);
			}
			if (state.tokens.next.id === ",") {
				comma();
			} else {
				advance(")", next);
				nospace(state.tokens.prev, state.tokens.curr);
				return params;
			}
		}
	}


	function doFunction(name, statement, generator, fatarrowparams) {
		var f;
		var oldOption = state.option;
		var oldIgnored = state.ignored;
		var oldScope  = scope;

		state.option = Object.create(state.option);
		state.ignored = Object.create(state.ignored);
		scope  = Object.create(scope);

		funct = {
			"(name)"      : name || "\"" + anonname + "\"",
			"(line)"      : state.tokens.next.line,
			"(character)" : state.tokens.next.character,
			"(context)"   : funct,
			"(breakage)"  : 0,
			"(loopage)"   : 0,
			"(metrics)"   : createMetrics(state.tokens.next),
			"(scope)"     : scope,
			"(statement)" : statement,
			"(tokens)"    : {},
			"(blockscope)": funct["(blockscope)"],
			"(comparray)" : funct["(comparray)"]
		};

		if (generator) {
			funct["(generator)"] = true;
		}

		f = funct;
		state.tokens.curr.funct = funct;

		functions.push(funct);

		if (name) {
			addlabel(name, "function");
		}

		funct["(params)"] = functionparams(fatarrowparams);

		funct["(metrics)"].verifyMaxParametersPerFunction(funct["(params)"]);

		block(false, true, true, fatarrowparams ? true:false);

		if (generator && funct["(generator)"] !== "yielded") {
			error("E047", state.tokens.curr);
		}

		funct["(metrics)"].verifyMaxStatementsPerFunction();
		funct["(metrics)"].verifyMaxComplexityPerFunction();
		funct["(unusedOption)"] = state.option.unused;

		scope = oldScope;
		state.option = oldOption;
		state.ignored = oldIgnored;
		funct["(last)"] = state.tokens.curr.line;
		funct["(lastcharacter)"] = state.tokens.curr.character;
		funct = funct["(context)"];

		return f;
	}

	function createMetrics(functionStartToken) {
		return {
			statementCount: 0,
			nestedBlockDepth: -1,
			ComplexityCount: 1,
			verifyMaxStatementsPerFunction: function () {
				if (state.option.maxstatements &&
					this.statementCount > state.option.maxstatements) {
					warning("W071", functionStartToken, this.statementCount);
				}
			},

			verifyMaxParametersPerFunction: function (params) {
				params = params || [];

				if (state.option.maxparams && params.length > state.option.maxparams) {
					warning("W072", functionStartToken, params.length);
				}
			},

			verifyMaxNestedBlockDepthPerFunction: function () {
				if (state.option.maxdepth &&
					this.nestedBlockDepth > 0 &&
					this.nestedBlockDepth === state.option.maxdepth + 1) {
					warning("W073", null, this.nestedBlockDepth);
				}
			},

			verifyMaxComplexityPerFunction: function () {
				var max = state.option.maxcomplexity;
				var cc = this.ComplexityCount;
				if (max && cc > max) {
					warning("W074", functionStartToken, cc);
				}
			}
		};
	}

	function increaseComplexityCount() {
		funct["(metrics)"].ComplexityCount += 1;
	}

	// Parse assignments that were found instead of conditionals.
	// For example: if (a = 1) { ... }

	function checkCondAssignment(expr) {
		var id, paren;
		if (expr) {
			id = expr.id;
			paren = expr.paren;
			if (id === "," && (expr = expr.exprs[expr.exprs.length - 1])) {
				id = expr.id;
				paren = paren || expr.paren;
			}
		}
		switch (id) {
		case "=":
		case "+=":
		case "-=":
		case "*=":
		case "%=":
		case "&=":
		case "|=":
		case "^=":
		case "/=":
			if (!paren && !state.option.boss) {
				warning("W084");
			}
		}
	}


	(function (x) {
		x.nud = function (isclassdef) {
			var b, f, i, p, t, g;
			var props = {}; // All properties, including accessors
			var tag = "";

			function saveProperty(name, tkn) {
				if (props[name] && _.has(props, name))
					warning("W075", state.tokens.next, i);
				else
					props[name] = {};

				props[name].basic = true;
				props[name].basictkn = tkn;
			}

			function saveSetter(name, tkn) {
				if (props[name] && _.has(props, name)) {
					if (props[name].basic || props[name].setter)
						warning("W075", state.tokens.next, i);
				} else {
					props[name] = {};
				}

				props[name].setter = true;
				props[name].setterToken = tkn;
			}

			function saveGetter(name) {
				if (props[name] && _.has(props, name)) {
					if (props[name].basic || props[name].getter)
						warning("W075", state.tokens.next, i);
				} else {
					props[name] = {};
				}

				props[name].getter = true;
				props[name].getterToken = state.tokens.curr;
			}

			b = state.tokens.curr.line !== state.tokens.next.line;
			if (b) {
				indent += state.option.indent;
				if (state.tokens.next.from === indent + state.option.indent) {
					indent += state.option.indent;
				}
			}

			for (;;) {
				if (state.tokens.next.id === "}") {
					break;
				}

				if (b) {
					indentation();
				}

				if (isclassdef && state.tokens.next.value === "static") {
					advance("static");
					tag = "static ";
				}

				if (state.tokens.next.value === "get" && peek().id !== ":") {
					advance("get");

					if (!state.option.inES5(!isclassdef)) {
						error("E034");
					}

					i = property_name();
					if (!i) {
						error("E035");
					}

					// It is a Syntax Error if PropName of MethodDefinition is
					// "constructor" and SpecialMethod of MethodDefinition is true.
					if (isclassdef && i === "constructor") {
						error("E049", state.tokens.next, "class getter method", i);
					}

					saveGetter(tag + i);
					t = state.tokens.next;
					adjacent(state.tokens.curr, state.tokens.next);
					f = doFunction();
					p = f["(params)"];

					if (p) {
						warning("W076", t, p[0], i);
					}

					adjacent(state.tokens.curr, state.tokens.next);
				} else if (state.tokens.next.value === "set" && peek().id !== ":") {
					advance("set");

					if (!state.option.inES5(!isclassdef)) {
						error("E034");
					}

					i = property_name();
					if (!i) {
						error("E035");
					}

					// It is a Syntax Error if PropName of MethodDefinition is
					// "constructor" and SpecialMethod of MethodDefinition is true.
					if (isclassdef && i === "constructor") {
						error("E049", state.tokens.next, "class setter method", i);
					}

					saveSetter(tag + i, state.tokens.next);
					t = state.tokens.next;
					adjacent(state.tokens.curr, state.tokens.next);
					f = doFunction();
					p = f["(params)"];

					if (!p || p.length !== 1) {
						warning("W077", t, i);
					}
				} else {
					g = false;
					if (state.tokens.next.value === "*" && state.tokens.next.type === "(punctuator)") {
						if (!state.option.inESNext()) {
							warning("W104", state.tokens.next, "generator functions");
						}
						advance("*");
						g = true;
					}
					i = property_name();
					saveProperty(tag + i, state.tokens.next);

					if (typeof i !== "string") {
						break;
					}

					if (state.tokens.next.value === "(") {
						if (!state.option.inESNext()) {
							warning("W104", state.tokens.curr, "concise methods");
						}
						doFunction(i, undefined, g);
					} else if (!isclassdef) {
						advance(":");
						nonadjacent(state.tokens.curr, state.tokens.next);
						expression(10);
					}
				}
				// It is a Syntax Error if PropName of MethodDefinition is "prototype".
				if (isclassdef && i === "prototype") {
					error("E049", state.tokens.next, "class method", i);
				}

				countMember(i);
				if (isclassdef) {
					tag = "";
					continue;
				}
				if (state.tokens.next.id === ",") {
					comma({ allowTrailing: true, property: true });
					if (state.tokens.next.id === ",") {
						warning("W070", state.tokens.curr);
					} else if (state.tokens.next.id === "}" && !state.option.inES5(true)) {
						warning("W070", state.tokens.curr);
					}
				} else {
					break;
				}
			}
			if (b) {
				indent -= state.option.indent;
				indentation();
			}
			advance("}", this);

			// Check for lonely setters if in the ES5 mode.
			if (state.option.inES5()) {
				for (var name in props) {
					if (_.has(props, name) && props[name].setter && !props[name].getter) {
						warning("W078", props[name].setterToken);
					}
				}
			}
			return this;
		};
		x.fud = function () {
			error("E036", state.tokens.curr);
		};
	}(delim("{")));

	function destructuringExpression() {
		var id, ids;
		var identifiers = [];
		if (!state.option.inESNext()) {
			warning("W104", state.tokens.curr, "destructuring expression");
		}
		var nextInnerDE = function () {
			var ident;
			if (_.contains(["[", "{"], state.tokens.next.value)) {
				ids = destructuringExpression();
				for (var id in ids) {
					id = ids[id];
					identifiers.push({ id: id.id, token: id.token });
				}
			} else if (state.tokens.next.value === ",") {
				identifiers.push({ id: null, token: state.tokens.curr });
			} else {
				ident = identifier();
				if (ident)
					identifiers.push({ id: ident, token: state.tokens.curr });
			}
		};
		if (state.tokens.next.value === "[") {
			advance("[");
			nextInnerDE();
			while (state.tokens.next.value !== "]") {
				advance(",");
				nextInnerDE();
			}
			advance("]");
		} else if (state.tokens.next.value === "{") {
			advance("{");
			id = identifier();
			if (state.tokens.next.value === ":") {
				advance(":");
				nextInnerDE();
			} else {
				identifiers.push({ id: id, token: state.tokens.curr });
			}
			while (state.tokens.next.value !== "}") {
				advance(",");
				id = identifier();
				if (state.tokens.next.value === ":") {
					advance(":");
					nextInnerDE();
				} else {
					identifiers.push({ id: id, token: state.tokens.curr });
				}
			}
			advance("}");
		}
		return identifiers;
	}
	function destructuringExpressionMatch(tokens, value) {
		if (value.first) {
			_.zip(tokens, value.first).forEach(function (val) {
				var token = val[0];
				var value = val[1];
				if (token && value) {
					token.first = value;
				} else if (token && token.first && !value) {
					warning("W080", token.first, token.first.value);
				} /* else {
					XXX value is discarded: wouldn't it need a warning ?
				} */
			});
		}
	}

	var conststatement = stmt("const", function (prefix) {
		var tokens, value;
		// state variable to know if it is a lone identifier, or a destructuring statement.
		var lone;

		if (!state.option.inESNext()) {
			warning("W104", state.tokens.curr, "const");
		}

		this.first = [];
		for (;;) {
			var names = [];
			nonadjacent(state.tokens.curr, state.tokens.next);
			if (_.contains(["{", "["], state.tokens.next.value)) {
				tokens = destructuringExpression();
				lone = false;
			} else {
				tokens = [ { id: identifier(), token: state.tokens.curr } ];
				lone = true;
			}
			for (var t in tokens) {
				t = tokens[t];
				if (funct[t.id] === "const") {
					warning("E011", null, t.id);
				}
				if (funct["(global)"] && predefined[t.id] === false) {
					warning("W079", t.token, t.id);
				}
				if (t.id) {
					addlabel(t.id, "const");
					names.push(t.token);
				}
			}
			if (prefix) {
				break;
			}

			this.first = this.first.concat(names);

			if (state.tokens.next.id !== "=") {
				warning("E012", state.tokens.curr, state.tokens.curr.value);
			}

			if (state.tokens.next.id === "=") {
				nonadjacent(state.tokens.curr, state.tokens.next);
				advance("=");
				nonadjacent(state.tokens.curr, state.tokens.next);
				if (state.tokens.next.id === "undefined") {
					warning("W080", state.tokens.prev, state.tokens.prev.value);
				}
				if (peek(0).id === "=" && state.tokens.next.identifier) {
					warning("W120", state.tokens.next, state.tokens.next.value);
				}
				value = expression(10);
				if (lone) {
					tokens[0].first = value;
				} else {
					destructuringExpressionMatch(names, value);
				}
			}

			if (state.tokens.next.id !== ",") {
				break;
			}
			comma();
		}
		return this;
	});
	conststatement.exps = true;
	var varstatement = stmt("var", function (prefix) {
		// JavaScript does not have block scope. It only has function scope. So,
		// declaring a variable in a block can have unexpected consequences.
		var tokens, lone, value;

		if (funct["(onevar)"] && state.option.onevar) {
			warning("W081");
		} else if (!funct["(global)"]) {
			funct["(onevar)"] = true;
		}

		this.first = [];
		for (;;) {
			var names = [];
			nonadjacent(state.tokens.curr, state.tokens.next);
			if (_.contains(["{", "["], state.tokens.next.value)) {
				tokens = destructuringExpression();
				lone = false;
			} else {
				tokens = [ { id: identifier(), token: state.tokens.curr } ];
				lone = true;
			}
			for (var t in tokens) {
				t = tokens[t];
				if (state.option.inESNext() && funct[t.id] === "const") {
					warning("E011", null, t.id);
				}
				if (funct["(global)"] && predefined[t.id] === false) {
					warning("W079", t.token, t.id);
				}
				if (t.id) {
					addlabel(t.id, "unused", t.token);
					names.push(t.token);
				}
			}
			if (prefix) {
				break;
			}

			this.first = this.first.concat(names);

			if (state.tokens.next.id === "=") {
				nonadjacent(state.tokens.curr, state.tokens.next);
				advance("=");
				nonadjacent(state.tokens.curr, state.tokens.next);
				if (state.tokens.next.id === "undefined") {
					warning("W080", state.tokens.prev, state.tokens.prev.value);
				}
				if (peek(0).id === "=" && state.tokens.next.identifier) {
					warning("W120", state.tokens.next, state.tokens.next.value);
				}
				value = expression(10);
				if (lone) {
					tokens[0].first = value;
				} else {
					destructuringExpressionMatch(names, value);
				}
			}

			if (state.tokens.next.id !== ",") {
				break;
			}
			comma();
		}
		return this;
	});
	varstatement.exps = true;
	var letstatement = stmt("let", function (prefix) {
		var tokens, lone, value, letblock;

		if (!state.option.inESNext()) {
			warning("W104", state.tokens.curr, "let");
		}

		if (state.tokens.next.value === "(") {
			if (!state.option.inMoz(true)) {
				warning("W118", state.tokens.next, "let block");
			}
			advance("(");
			funct["(blockscope)"].stack();
			letblock = true;
		} else if (funct["(nolet)"]) {
			error("E048", state.tokens.curr);
		}

		if (funct["(onevar)"] && state.option.onevar) {
			warning("W081");
		} else if (!funct["(global)"]) {
			funct["(onevar)"] = true;
		}

		this.first = [];
		for (;;) {
			var names = [];
			nonadjacent(state.tokens.curr, state.tokens.next);
			if (_.contains(["{", "["], state.tokens.next.value)) {
				tokens = destructuringExpression();
				lone = false;
			} else {
				tokens = [ { id: identifier(), token: state.tokens.curr.value } ];
				lone = true;
			}
			for (var t in tokens) {
				t = tokens[t];
				if (state.option.inESNext() && funct[t.id] === "const") {
					warning("E011", null, t.id);
				}
				if (funct["(global)"] && predefined[t.id] === false) {
					warning("W079", t.token, t.id);
				}
				if (t.id && !funct["(nolet)"]) {
					addlabel(t.id, "unused", t.token, true);
					names.push(t.token);
				}
			}
			if (prefix) {
				break;
			}

			this.first = this.first.concat(names);

			if (state.tokens.next.id === "=") {
				nonadjacent(state.tokens.curr, state.tokens.next);
				advance("=");
				nonadjacent(state.tokens.curr, state.tokens.next);
				if (state.tokens.next.id === "undefined") {
					warning("W080", state.tokens.prev, state.tokens.prev.value);
				}
				if (peek(0).id === "=" && state.tokens.next.identifier) {
					warning("W120", state.tokens.next, state.tokens.next.value);
				}
				value = expression(10);
				if (lone) {
					tokens[0].first = value;
				} else {
					destructuringExpressionMatch(names, value);
				}
			}

			if (state.tokens.next.id !== ",") {
				break;
			}
			comma();
		}
		if (letblock) {
			advance(")");
			block(true, true);
			this.block = true;
			funct["(blockscope)"].unstack();
		}

		return this;
	});
	letstatement.exps = true;

	blockstmt("class", function () {
		return classdef.call(this, true);
	});

	function classdef(stmt) {
		/*jshint validthis:true */
		if (!state.option.inESNext()) {
			warning("W104", state.tokens.curr, "class");
		}
		if (stmt) {
			// BindingIdentifier
			this.name = identifier();
			addlabel(this.name, "unused", state.tokens.curr);
		} else if (state.tokens.next.identifier && state.tokens.next.value !== "extends") {
			// BindingIdentifier(opt)
			this.name = identifier();
		}
		classtail(this);
		return this;
	}

	function classtail(c) {
		var strictness = state.directive["use strict"];

		// ClassHeritage(opt)
		if (state.tokens.next.value === "extends") {
			advance("extends");
			c.heritage = expression(10);
		}

		// A ClassBody is always strict code.
		state.directive["use strict"] = true;
		advance("{");
		// ClassBody(opt)
		c.body = state.syntax["{"].nud(true);
		state.directive["use strict"] = strictness;
	}

	blockstmt("function", function () {
		var generator = false;
		if (state.tokens.next.value === "*") {
			advance("*");
			if (state.option.inESNext(true)) {
				generator = true;
			} else {
				warning("W119", state.tokens.curr, "function*");
			}
		}
		if (inblock) {
			warning("W082", state.tokens.curr);

		}
		var i = identifier();
		if (funct[i] === "const") {
			warning("E011", null, i);
		}
		adjacent(state.tokens.curr, state.tokens.next);
		addlabel(i, "unction", state.tokens.curr);

		doFunction(i, { statement: true }, generator);
		if (state.tokens.next.id === "(" && state.tokens.next.line === state.tokens.curr.line) {
			error("E039");
		}
		return this;
	});

	prefix("function", function () {
		var generator = false;
		if (state.tokens.next.value === "*") {
			if (!state.option.inESNext()) {
				warning("W119", state.tokens.curr, "function*");
			}
			advance("*");
			generator = true;
		}
		var i = optionalidentifier();
		if (i || state.option.gcl) {
			adjacent(state.tokens.curr, state.tokens.next);
		} else {
			nonadjacent(state.tokens.curr, state.tokens.next);
		}
		doFunction(i, undefined, generator);
		if (!state.option.loopfunc && funct["(loopage)"]) {
			warning("W083");
		}
		return this;
	});

	blockstmt("if", function () {
		var t = state.tokens.next;
		increaseComplexityCount();
		state.condition = true;
		advance("(");
		nonadjacent(this, t);
		nospace();
		checkCondAssignment(expression(0));
		advance(")", t);
		state.condition = false;
		nospace(state.tokens.prev, state.tokens.curr);
		block(true, true);
		if (state.tokens.next.id === "else") {
			nonadjacent(state.tokens.curr, state.tokens.next);
			advance("else");
			if (state.tokens.next.id === "if" || state.tokens.next.id === "switch") {
				statement(true);
			} else {
				block(true, true);
			}
		}
		return this;
	});

	blockstmt("try", function () {
		var b;

		function doCatch() {
			var oldScope = scope;
			var e;

			advance("catch");
			nonadjacent(state.tokens.curr, state.tokens.next);
			advance("(");

			scope = Object.create(oldScope);

			e = state.tokens.next.value;
			if (state.tokens.next.type !== "(identifier)") {
				e = null;
				warning("E030", state.tokens.next, e);
			}

			advance();

			funct = {
				"(name)"     : "(catch)",
				"(line)"     : state.tokens.next.line,
				"(character)": state.tokens.next.character,
				"(context)"  : funct,
				"(breakage)" : funct["(breakage)"],
				"(loopage)"  : funct["(loopage)"],
				"(scope)"    : scope,
				"(statement)": false,
				"(metrics)"  : createMetrics(state.tokens.next),
				"(catch)"    : true,
				"(tokens)"   : {},
				"(blockscope)": funct["(blockscope)"],
				"(comparray)": funct["(comparray)"]
			};

			if (e) {
				addlabel(e, "exception");
			}

			if (state.tokens.next.value === "if") {
				if (!state.option.inMoz(true)) {
					warning("W118", state.tokens.curr, "catch filter");
				}
				advance("if");
				expression(0);
			}

			advance(")");

			state.tokens.curr.funct = funct;
			functions.push(funct);

			block(false);

			scope = oldScope;

			funct["(last)"] = state.tokens.curr.line;
			funct["(lastcharacter)"] = state.tokens.curr.character;
			funct = funct["(context)"];
		}

		block(false);

		while (state.tokens.next.id === "catch") {
			increaseComplexityCount();
			if (b && (!state.option.inMoz(true))) {
				warning("W118", state.tokens.next, "multiple catch blocks");
			}
			doCatch();
			b = true;
		}

		if (state.tokens.next.id === "finally") {
			advance("finally");
			block(false);
			return;
		}

		if (!b) {
			error("E021", state.tokens.next, "catch", state.tokens.next.value);
		}

		return this;
	});

	blockstmt("while", function () {
		var t = state.tokens.next;
		funct["(breakage)"] += 1;
		funct["(loopage)"] += 1;
		increaseComplexityCount();
		advance("(");
		nonadjacent(this, t);
		nospace();
		checkCondAssignment(expression(0));
		advance(")", t);
		nospace(state.tokens.prev, state.tokens.curr);
		block(true, true);
		funct["(breakage)"] -= 1;
		funct["(loopage)"] -= 1;
		return this;
	}).labelled = true;

	blockstmt("with", function () {
		var t = state.tokens.next;
		if (state.directive["use strict"]) {
			error("E010", state.tokens.curr);
		} else if (!state.option.withstmt) {
			warning("W085", state.tokens.curr);
		}

		advance("(");
		nonadjacent(this, t);
		nospace();
		expression(0);
		advance(")", t);
		nospace(state.tokens.prev, state.tokens.curr);
		block(true, true);

		return this;
	});

	blockstmt("switch", function () {
		var t = state.tokens.next,
			g = false;
		funct["(breakage)"] += 1;
		advance("(");
		nonadjacent(this, t);
		nospace();
		checkCondAssignment(expression(0));
		advance(")", t);
		nospace(state.tokens.prev, state.tokens.curr);
		nonadjacent(state.tokens.curr, state.tokens.next);
		t = state.tokens.next;
		advance("{");
		nonadjacent(state.tokens.curr, state.tokens.next);
		indent += state.option.indent;
		this.cases = [];

		for (;;) {
			switch (state.tokens.next.id) {
			case "case":
				switch (funct["(verb)"]) {
				case "yield":
				case "break":
				case "case":
				case "continue":
				case "return":
				case "switch":
				case "throw":
					break;
				default:
					// You can tell JSHint that you don't use break intentionally by
					// adding a comment /* falls through */ on a line just before
					// the next `case`.
					if (!reg.fallsThrough.test(state.lines[state.tokens.next.line - 2])) {
						warning("W086", state.tokens.curr, "case");
					}
				}
				indentation(-state.option.indent);
				advance("case");
				this.cases.push(expression(20));
				increaseComplexityCount();
				g = true;
				advance(":");
				funct["(verb)"] = "case";
				break;
			case "default":
				switch (funct["(verb)"]) {
				case "yield":
				case "break":
				case "continue":
				case "return":
				case "throw":
					break;
				default:
					// Do not display a warning if 'default' is the first statement or if
					// there is a special /* falls through */ comment.
					if (this.cases.length) {
						if (!reg.fallsThrough.test(state.lines[state.tokens.next.line - 2])) {
							warning("W086", state.tokens.curr, "default");
						}
					}
				}
				indentation(-state.option.indent);
				advance("default");
				g = true;
				advance(":");
				break;
			case "}":
				indent -= state.option.indent;
				indentation();
				advance("}", t);
				funct["(breakage)"] -= 1;
				funct["(verb)"] = undefined;
				return;
			case "(end)":
				error("E023", state.tokens.next, "}");
				return;
			default:
				if (g) {
					switch (state.tokens.curr.id) {
					case ",":
						error("E040");
						return;
					case ":":
						g = false;
						statements();
						break;
					default:
						error("E025", state.tokens.curr);
						return;
					}
				} else {
					if (state.tokens.curr.id === ":") {
						advance(":");
						error("E024", state.tokens.curr, ":");
						statements();
					} else {
						error("E021", state.tokens.next, "case", state.tokens.next.value);
						return;
					}
				}
			}
		}
	}).labelled = true;

	stmt("debugger", function () {
		if (!state.option.debug) {
			warning("W087");
		}
		return this;
	}).exps = true;

	(function () {
		var x = stmt("do", function () {
			funct["(breakage)"] += 1;
			funct["(loopage)"] += 1;
			increaseComplexityCount();

			this.first = block(true, true);
			advance("while");
			var t = state.tokens.next;
			nonadjacent(state.tokens.curr, t);
			advance("(");
			nospace();
			checkCondAssignment(expression(0));
			advance(")", t);
			nospace(state.tokens.prev, state.tokens.curr);
			funct["(breakage)"] -= 1;
			funct["(loopage)"] -= 1;
			return this;
		});
		x.labelled = true;
		x.exps = true;
	}());

	blockstmt("for", function () {
		var s, t = state.tokens.next;
		var letscope = false;
		var foreachtok = null;

		if (t.value === "each") {
			foreachtok = t;
			advance("each");
			if (!state.option.inMoz(true)) {
				warning("W118", state.tokens.curr, "for each");
			}
		}

		funct["(breakage)"] += 1;
		funct["(loopage)"] += 1;
		increaseComplexityCount();
		advance("(");
		nonadjacent(this, t);
		nospace();

		// what kind of for(…) statement it is? for(…of…)? for(…in…)? for(…;…;…)?
		var nextop; // contains the token of the "in" or "of" operator
		var i = 0;
		var inof = ["in", "of"];
		do {
			nextop = peek(i);
			++i;
		} while (!_.contains(inof, nextop.value) && nextop.value !== ";" &&
					nextop.type !== "(end)");

		// if we're in a for (… in|of …) statement
		if (_.contains(inof, nextop.value)) {
			if (!state.option.inESNext() && nextop.value === "of") {
				error("W104", nextop, "for of");
			}
			if (state.tokens.next.id === "var") {
				advance("var");
				state.syntax["var"].fud.call(state.syntax["var"].fud, true);
			} else if (state.tokens.next.id === "let") {
				advance("let");
				// create a new block scope
				letscope = true;
				funct["(blockscope)"].stack();
				state.syntax["let"].fud.call(state.syntax["let"].fud, true);
			} else {
				switch (funct[state.tokens.next.value]) {
				case "unused":
					funct[state.tokens.next.value] = "var";
					break;
				case "var":
					break;
				default:
					if (!funct["(blockscope)"].getlabel(state.tokens.next.value))
						warning("W088", state.tokens.next, state.tokens.next.value);
				}
				advance();
			}
			advance(nextop.value);
			expression(20);
			advance(")", t);
			s = block(true, true);
			if (state.option.forin && s && (s.length > 1 || typeof s[0] !== "object" ||
					s[0].value !== "if")) {
				warning("W089", this);
			}
			funct["(breakage)"] -= 1;
			funct["(loopage)"] -= 1;
		} else {
			if (foreachtok) {
				error("E045", foreachtok);
			}
			if (state.tokens.next.id !== ";") {
				if (state.tokens.next.id === "var") {
					advance("var");
					state.syntax["var"].fud.call(state.syntax["var"].fud);
				} else if (state.tokens.next.id === "let") {
					advance("let");
					// create a new block scope
					letscope = true;
					funct["(blockscope)"].stack();
					state.syntax["let"].fud.call(state.syntax["let"].fud);
				} else {
					for (;;) {
						expression(0, "for");
						if (state.tokens.next.id !== ",") {
							break;
						}
						comma();
					}
				}
			}
			nolinebreak(state.tokens.curr);
			advance(";");
			if (state.tokens.next.id !== ";") {
				checkCondAssignment(expression(0));
			}
			nolinebreak(state.tokens.curr);
			advance(";");
			if (state.tokens.next.id === ";") {
				error("E021", state.tokens.next, ")", ";");
			}
			if (state.tokens.next.id !== ")") {
				for (;;) {
					expression(0, "for");
					if (state.tokens.next.id !== ",") {
						break;
					}
					comma();
				}
			}
			advance(")", t);
			nospace(state.tokens.prev, state.tokens.curr);
			block(true, true);
			funct["(breakage)"] -= 1;
			funct["(loopage)"] -= 1;

		}
		// unstack loop blockscope
		if (letscope) {
			funct["(blockscope)"].unstack();
		}
		return this;
	}).labelled = true;


	stmt("break", function () {
		var v = state.tokens.next.value;

		if (funct["(breakage)"] === 0)
			warning("W052", state.tokens.next, this.value);

		if (!state.option.asi)
			nolinebreak(this);

		if (state.tokens.next.id !== ";" && !state.tokens.next.reach) {
			if (state.tokens.curr.line === state.tokens.next.line) {
				if (funct[v] !== "label") {
					warning("W090", state.tokens.next, v);
				} else if (scope[v] !== funct) {
					warning("W091", state.tokens.next, v);
				}
				this.first = state.tokens.next;
				advance();
			}
		}
		reachable("break");
		return this;
	}).exps = true;


	stmt("continue", function () {
		var v = state.tokens.next.value;

		if (funct["(breakage)"] === 0)
			warning("W052", state.tokens.next, this.value);

		if (!state.option.asi)
			nolinebreak(this);

		if (state.tokens.next.id !== ";" && !state.tokens.next.reach) {
			if (state.tokens.curr.line === state.tokens.next.line) {
				if (funct[v] !== "label") {
					warning("W090", state.tokens.next, v);
				} else if (scope[v] !== funct) {
					warning("W091", state.tokens.next, v);
				}
				this.first = state.tokens.next;
				advance();
			}
		} else if (!funct["(loopage)"]) {
			warning("W052", state.tokens.next, this.value);
		}
		reachable("continue");
		return this;
	}).exps = true;


	stmt("return", function () {
		if (this.line === state.tokens.next.line) {
			if (state.tokens.next.id === "(regexp)")
				warning("W092");

			if (state.tokens.next.id !== ";" && !state.tokens.next.reach) {
				nonadjacent(state.tokens.curr, state.tokens.next);
				this.first = expression(0);

				if (this.first &&
						this.first.type === "(punctuator)" && this.first.value === "=" && !state.option.boss) {
					warningAt("W093", this.first.line, this.first.character);
				}
			}
		} else {
			if (state.tokens.next.type === "(punctuator)" &&
				["[", "{", "+", "-"].indexOf(state.tokens.next.value) > -1) {
				nolinebreak(this); // always warn (Line breaking error)
			}
		}
		reachable("return");
		return this;
	}).exps = true;

	(function (x) {
		x.exps = true;
		x.lbp = 25;
	}(prefix("yield", function () {
		var prev = state.tokens.prev;
		if (state.option.inESNext(true) && !funct["(generator)"]) {
			error("E046", state.tokens.curr, "yield");
		} else if (!state.option.inESNext()) {
			warning("W104", state.tokens.curr, "yield");
		}
		funct["(generator)"] = "yielded";
		if (this.line === state.tokens.next.line || !state.option.inMoz(true)) {
			if (state.tokens.next.id === "(regexp)")
				warning("W092");

			if (state.tokens.next.id !== ";" && !state.tokens.next.reach && state.tokens.next.nud) {
				nobreaknonadjacent(state.tokens.curr, state.tokens.next);
				this.first = expression(10);

				if (this.first.type === "(punctuator)" && this.first.value === "=" && !state.option.boss) {
					warningAt("W093", this.first.line, this.first.character);
				}
			}

			if (state.option.inMoz(true) && state.tokens.next.id !== ")" &&
					(prev.lbp > 30 || (!prev.assign && !isEndOfExpr()) || prev.id === "yield")) {
				error("E050", this);
			}
		} else if (!state.option.asi) {
			nolinebreak(this); // always warn (Line breaking error)
		}
		return this;
	})));


	stmt("throw", function () {
		nolinebreak(this);
		nonadjacent(state.tokens.curr, state.tokens.next);
		this.first = expression(20);
		reachable("throw");
		return this;
	}).exps = true;

	stmt("import", function () {
		if (!state.option.inESNext()) {
			warning("W119", state.tokens.curr, "import");
		}

		if (state.tokens.next.identifier) {
			this.name = identifier();
			addlabel(this.name, "unused", state.tokens.curr);
		} else {
			advance("{");
			for (;;) {
				var importName;
				if (state.tokens.next.type === "default") {
					importName = "default";
					advance("default");
				} else {
					importName = identifier();
				}
				if (state.tokens.next.value === "as") {
					advance("as");
					importName = identifier();
				}
				addlabel(importName, "unused", state.tokens.curr);

				if (state.tokens.next.value === ",") {
					advance(",");
				} else if (state.tokens.next.value === "}") {
					advance("}");
					break;
				} else {
					error("E024", state.tokens.next, state.tokens.next.value);
					break;
				}
			}
		}

		advance("from");
		advance("(string)");
		return this;
	}).exps = true;

	stmt("export", function () {
		if (!state.option.inESNext()) {
			warning("W119", state.tokens.curr, "export");
		}

		if (state.tokens.next.type === "default") {
			advance("default");
			if (state.tokens.next.id === "function" || state.tokens.next.id === "class") {
				this.block = true;
			}
			this.exportee = expression(10);

			return this;
		}

		if (state.tokens.next.value === "{") {
			advance("{");
			for (;;) {
				identifier();

				if (state.tokens.next.value === ",") {
					advance(",");
				} else if (state.tokens.next.value === "}") {
					advance("}");
					break;
				} else {
					error("E024", state.tokens.next, state.tokens.next.value);
					break;
				}
			}
			return this;
		}

		if (state.tokens.next.id === "var") {
			advance("var");
			state.syntax["var"].fud.call(state.syntax["var"].fud);
		} else if (state.tokens.next.id === "let") {
			advance("let");
			state.syntax["let"].fud.call(state.syntax["let"].fud);
		} else if (state.tokens.next.id === "const") {
			advance("const");
			state.syntax["const"].fud.call(state.syntax["const"].fud);
		} else if (state.tokens.next.id === "function") {
			this.block = true;
			advance("function");
			state.syntax["function"].fud();
		} else if (state.tokens.next.id === "class") {
			this.block = true;
			advance("class");
			state.syntax["class"].fud();
		} else {
			error("E024", state.tokens.next, state.tokens.next.value);
		}

		return this;
	}).exps = true;

	// Future Reserved Words

	FutureReservedWord("abstract");
	FutureReservedWord("boolean");
	FutureReservedWord("byte");
	FutureReservedWord("char");
	FutureReservedWord("class", { es5: true, nud: classdef });
	FutureReservedWord("double");
	FutureReservedWord("enum", { es5: true });
	FutureReservedWord("export", { es5: true });
	FutureReservedWord("extends", { es5: true });
	FutureReservedWord("final");
	FutureReservedWord("float");
	FutureReservedWord("goto");
	FutureReservedWord("implements", { es5: true, strictOnly: true });
	FutureReservedWord("import", { es5: true });
	FutureReservedWord("int");
	FutureReservedWord("interface", { es5: true, strictOnly: true });
	FutureReservedWord("long");
	FutureReservedWord("native");
	FutureReservedWord("package", { es5: true, strictOnly: true });
	FutureReservedWord("private", { es5: true, strictOnly: true });
	FutureReservedWord("protected", { es5: true, strictOnly: true });
	FutureReservedWord("public", { es5: true, strictOnly: true });
	FutureReservedWord("short");
	FutureReservedWord("static", { es5: true, strictOnly: true });
	FutureReservedWord("super", { es5: true });
	FutureReservedWord("synchronized");
	FutureReservedWord("throws");
	FutureReservedWord("transient");
	FutureReservedWord("volatile");

	// this function is used to determine wether a squarebracket or a curlybracket
	// expression is a comprehension array, destructuring assignment or a json value.

	var lookupBlockType = function () {
		var pn, pn1;
		var i = 0;
		var bracketStack = 0;
		var ret = {};
		if (_.contains(["[", "{"], state.tokens.curr.value))
			bracketStack += 1;
		if (_.contains(["[", "{"], state.tokens.next.value))
			bracketStack += 1;
		if (_.contains(["]", "}"], state.tokens.next.value))
			bracketStack -= 1;
		do {
			pn = peek(i);
			pn1 = peek(i + 1);
			i = i + 1;
			if (_.contains(["[", "{"], pn.value)) {
				bracketStack += 1;
			} else if (_.contains(["]", "}"], pn.value)) {
				bracketStack -= 1;
			}
			if (pn.identifier && pn.value === "for" && bracketStack === 1) {
				ret.isCompArray = true;
				ret.notJson = true;
				break;
			}
			if (_.contains(["}", "]"], pn.value) && pn1.value === "=") {
				ret.isDestAssign = true;
				ret.notJson = true;
				break;
			}
			if (pn.value === ";") {
				ret.isBlock = true;
				ret.notJson = true;
			}
		} while (bracketStack > 0 && pn.id !== "(end)" && i < 15);
		return ret;
	};

	// Check whether this function has been reached for a destructuring assign with undeclared values
	function destructuringAssignOrJsonValue() {
		// lookup for the assignment (esnext only)
		// if it has semicolons, it is a block, so go parse it as a block
		// or it's not a block, but there are assignments, check for undeclared variables

		var block = lookupBlockType();
		if (block.notJson) {
			if (!state.option.inESNext() && block.isDestAssign) {
				warning("W104", state.tokens.curr, "destructuring assignment");
			}
			statements();
		// otherwise parse json value
		} else {
			state.option.laxbreak = true;
			state.jsonMode = true;
			jsonValue();
		}
	}

	// array comprehension parsing function
	// parses and defines the three states of the list comprehension in order
	// to avoid defining global variables, but keeping them to the list comprehension scope
	// only. The order of the states are as follows:
	//  * "use" which will be the returned iterative part of the list comprehension
	//  * "define" which will define the variables local to the list comprehension
	//  * "filter" which will help filter out values

	var arrayComprehension = function () {
		var CompArray = function () {
			this.mode = "use";
			this.variables = [];
		};
		var _carrays = [];
		var _current;
		function declare(v) {
			var l = _current.variables.filter(function (elt) {
				// if it has, change its undef state
				if (elt.value === v) {
					elt.undef = false;
					return v;
				}
			}).length;
			return l !== 0;
		}
		function use(v) {
			var l = _current.variables.filter(function (elt) {
				// and if it has been defined
				if (elt.value === v && !elt.undef) {
					if (elt.unused === true) {
						elt.unused = false;
					}
					return v;
				}
			}).length;
			// otherwise we warn about it
			return (l === 0);
		}
		return {stack: function () {
					_current = new CompArray();
					_carrays.push(_current);
				},
				unstack: function () {
					_current.variables.filter(function (v) {
						if (v.unused)
							warning("W098", v.token, v.value);
						if (v.undef)
							isundef(v.funct, "W117", v.token, v.value);
					});
					_carrays.splice(_carrays[_carrays.length - 1], 1);
					_current = _carrays[_carrays.length - 1];
				},
				setState: function (s) {
					if (_.contains(["use", "define", "filter"], s))
						_current.mode = s;
				},
				check: function (v) {
					// When we are in "use" state of the list comp, we enqueue that var
					if (_current && _current.mode === "use") {
						_current.variables.push({funct: funct,
													token: state.tokens.curr,
													value: v,
													undef: true,
													unused: false});
						return true;
					// When we are in "define" state of the list comp,
					} else if (_current && _current.mode === "define") {
						// check if the variable has been used previously
						if (!declare(v)) {
							_current.variables.push({funct: funct,
														token: state.tokens.curr,
														value: v,
														undef: false,
														unused: true});
						}
						return true;
					// When we are in "filter" state,
					} else if (_current && _current.mode === "filter") {
						// we check whether current variable has been declared
						if (use(v)) {
							// if not we warn about it
							isundef(funct, "W117", state.tokens.curr, v);
						}
						return true;
					}
					return false;
				}
				};
	};


	// Parse JSON

	function jsonValue() {

		function jsonObject() {
			var o = {}, t = state.tokens.next;
			advance("{");
			if (state.tokens.next.id !== "}") {
				for (;;) {
					if (state.tokens.next.id === "(end)") {
						error("E026", state.tokens.next, t.line);
					} else if (state.tokens.next.id === "}") {
						warning("W094", state.tokens.curr);
						break;
					} else if (state.tokens.next.id === ",") {
						error("E028", state.tokens.next);
					} else if (state.tokens.next.id !== "(string)") {
						warning("W095", state.tokens.next, state.tokens.next.value);
					}
					if (o[state.tokens.next.value] === true) {
						warning("W075", state.tokens.next, state.tokens.next.value);
					} else if ((state.tokens.next.value === "__proto__" &&
						!state.option.proto) || (state.tokens.next.value === "__iterator__" &&
						!state.option.iterator)) {
						warning("W096", state.tokens.next, state.tokens.next.value);
					} else {
						o[state.tokens.next.value] = true;
					}
					advance();
					advance(":");
					jsonValue();
					if (state.tokens.next.id !== ",") {
						break;
					}
					advance(",");
				}
			}
			advance("}");
		}

		function jsonArray() {
			var t = state.tokens.next;
			advance("[");
			if (state.tokens.next.id !== "]") {
				for (;;) {
					if (state.tokens.next.id === "(end)") {
						error("E027", state.tokens.next, t.line);
					} else if (state.tokens.next.id === "]") {
						warning("W094", state.tokens.curr);
						break;
					} else if (state.tokens.next.id === ",") {
						error("E028", state.tokens.next);
					}
					jsonValue();
					if (state.tokens.next.id !== ",") {
						break;
					}
					advance(",");
				}
			}
			advance("]");
		}

		switch (state.tokens.next.id) {
		case "{":
			jsonObject();
			break;
		case "[":
			jsonArray();
			break;
		case "true":
		case "false":
		case "null":
		case "(number)":
		case "(string)":
			advance();
			break;
		case "-":
			advance("-");
			if (state.tokens.curr.character !== state.tokens.next.from) {
				warning("W011", state.tokens.curr);
			}
			adjacent(state.tokens.curr, state.tokens.next);
			advance("(number)");
			break;
		default:
			error("E003", state.tokens.next);
		}
	}

	var blockScope = function () {
		var _current = {};
		var _variables = [_current];

		function _checkBlockLabels() {
			for (var t in _current) {
				if (_current[t]["(type)"] === "unused") {
					if (state.option.unused) {
						var tkn = _current[t]["(token)"];
						var line = tkn.line;
						var chr  = tkn.character;
						warningAt("W098", line, chr, t);
					}
				}
			}
		}

		return {
			stack: function () {
				_current = {};
				_variables.push(_current);
			},

			unstack: function () {
				_checkBlockLabels();
				_variables.splice(_variables.length - 1, 1);
				_current = _.last(_variables);
			},

			getlabel: function (l) {
				for (var i = _variables.length - 1 ; i >= 0; --i) {
					if (_.has(_variables[i], l)) {
						return _variables[i];
					}
				}
			},

			current: {
				has: function (t) {
					return _.has(_current, t);
				},
				add: function (t, type, tok) {
					_current[t] = { "(type)" : type,
									"(token)": tok };
				}
			}
		};
	};

	// The actual JSHINT function itself.
	var itself = function (s, o, g) {
		var i, k, x;
		var optionKeys;
		var newOptionObj = {};
		var newIgnoredObj = {};

		state.reset();

		if (o && o.scope) {
			JSHINT.scope = o.scope;
		} else {
			JSHINT.errors = [];
			JSHINT.undefs = [];
			JSHINT.internals = [];
			JSHINT.blacklist = {};
			JSHINT.scope = "(main)";
		}

		predefined = Object.create(null);
		combine(predefined, vars.ecmaIdentifiers);
		combine(predefined, vars.reservedVars);

		combine(predefined, g || {});

		declared = Object.create(null);
		exported = Object.create(null);

		function each(obj, cb) {
			if (!obj)
				return;

			if (!Array.isArray(obj) && typeof obj === "object")
				obj = Object.keys(obj);

			obj.forEach(cb);
		}

		if (o) {
			each(o.predef || null, function (item) {
				var slice, prop;

				if (item[0] === "-") {
					slice = item.slice(1);
					JSHINT.blacklist[slice] = slice;
				} else {
					prop = Object.getOwnPropertyDescriptor(o.predef, item);
					predefined[item] = prop ? prop.value : false;
				}
			});

			each(o.exported || null, function (item) {
				exported[item] = true;
			});

			delete o.predef;
			delete o.exported;

			optionKeys = Object.keys(o);
			for (x = 0; x < optionKeys.length; x++) {
				if (/^-W\d{3}$/g.test(optionKeys[x])) {
					newIgnoredObj[optionKeys[x].slice(1)] = true;
				} else {
					newOptionObj[optionKeys[x]] = o[optionKeys[x]];

					if (optionKeys[x] === "newcap" && o[optionKeys[x]] === false)
						newOptionObj["(explicitNewcap)"] = true;

					if (optionKeys[x] === "indent")
						newOptionObj["(explicitIndent)"] = o[optionKeys[x]] === false ? false : true;
				}
			}
		}

		state.option = newOptionObj;
		state.ignored = newIgnoredObj;

		state.option.indent = state.option.indent || 4;
		state.option.maxerr = state.option.maxerr || 50;

		indent = 1;
		global = Object.create(predefined);
		scope = global;
		funct = {
			"(global)":   true,
			"(name)":	  "(global)",
			"(scope)":	  scope,
			"(breakage)": 0,
			"(loopage)":  0,
			"(tokens)":   {},
			"(metrics)":   createMetrics(state.tokens.next),
			"(blockscope)": blockScope(),
			"(comparray)": arrayComprehension()
		};
		functions = [funct];
		urls = [];
		stack = null;
		member = {};
		membersOnly = null;
		implied = {};
		inblock = false;
		lookahead = [];
		warnings = 0;
		unuseds = [];

		if (!isString(s) && !Array.isArray(s)) {
			errorAt("E004", 0);
			return false;
		}

		api = {
			get isJSON() {
				return state.jsonMode;
			},

			getOption: function (name) {
				return state.option[name] || null;
			},

			getCache: function (name) {
				return state.cache[name];
			},

			setCache: function (name, value) {
				state.cache[name] = value;
			},

			warn: function (code, data) {
				warningAt.apply(null, [ code, data.line, data.char ].concat(data.data));
			},

			on: function (names, listener) {
				names.split(" ").forEach(function (name) {
					emitter.on(name, listener);
				}.bind(this));
			}
		};

		emitter.removeAllListeners();
		(extraModules || []).forEach(function (func) {
			func(api);
		});

		state.tokens.prev = state.tokens.curr = state.tokens.next = state.syntax["(begin)"];

		lex = new Lexer(s);

		lex.on("warning", function (ev) {
			warningAt.apply(null, [ ev.code, ev.line, ev.character].concat(ev.data));
		});

		lex.on("error", function (ev) {
			errorAt.apply(null, [ ev.code, ev.line, ev.character ].concat(ev.data));
		});

		lex.on("fatal", function (ev) {
			quit("E041", ev.line, ev.from);
		});

		lex.on("Identifier", function (ev) {
			emitter.emit("Identifier", ev);
		});

		lex.on("String", function (ev) {
			emitter.emit("String", ev);
		});

		lex.on("Number", function (ev) {
			emitter.emit("Number", ev);
		});

		lex.start();

		// Check options
		for (var name in o) {
			if (_.has(o, name)) {
				checkOption(name, state.tokens.curr);
			}
		}

		assume();

		// combine the passed globals after we've assumed all our options
		combine(predefined, g || {});

		//reset values
		comma.first = true;

		try {
			advance();
			switch (state.tokens.next.id) {
			case "{":
			case "[":
				destructuringAssignOrJsonValue();
				break;
			default:
				directives();

				if (state.directive["use strict"]) {
					if (!state.option.globalstrict && !state.option.node) {
						warning("W097", state.tokens.prev);
					}
				}

				statements();
			}
			advance((state.tokens.next && state.tokens.next.value !== ".")	? "(end)" : undefined);
			funct["(blockscope)"].unstack();

			var markDefined = function (name, context) {
				do {
					if (typeof context[name] === "string") {
						// JSHINT marks unused variables as 'unused' and
						// unused function declaration as 'unction'. This
						// code changes such instances back 'var' and
						// 'closure' so that the code in JSHINT.data()
						// doesn't think they're unused.

						if (context[name] === "unused")
							context[name] = "var";
						else if (context[name] === "unction")
							context[name] = "closure";

						return true;
					}

					context = context["(context)"];
				} while (context);

				return false;
			};

			var clearImplied = function (name, line) {
				if (!implied[name])
					return;

				var newImplied = [];
				for (var i = 0; i < implied[name].length; i += 1) {
					if (implied[name][i] !== line)
						newImplied.push(implied[name][i]);
				}

				if (newImplied.length === 0)
					delete implied[name];
				else
					implied[name] = newImplied;
			};

			var warnUnused = function (name, tkn, type, unused_opt) {
				var line = tkn.line;
				var chr  = tkn.character;

				if (unused_opt === undefined) {
					unused_opt = state.option.unused;
				}

				if (unused_opt === true) {
					unused_opt = "last-param";
				}

				var warnable_types = {
					"vars": ["var"],
					"last-param": ["var", "param"],
					"strict": ["var", "param", "last-param"]
				};

				if (unused_opt) {
					if (warnable_types[unused_opt] && warnable_types[unused_opt].indexOf(type) !== -1) {
						warningAt("W098", line, chr, name);
					}
				}

				unuseds.push({
					name: name,
					line: line,
					character: chr
				});
			};

			var checkUnused = function (func, key) {
				var type = func[key];
				var tkn = func["(tokens)"][key];

				if (key.charAt(0) === "(")
					return;

				if (type !== "unused" && type !== "unction")
					return;

				// Params are checked separately from other variables.
				if (func["(params)"] && func["(params)"].indexOf(key) !== -1)
					return;

				// Variable is in global scope and defined as exported.
				if (func["(global)"] && _.has(exported, key)) {
					return;
				}

				warnUnused(key, tkn, "var");
			};

			// Check queued 'x is not defined' instances to see if they're still undefined.
			for (i = 0; i < JSHINT.undefs.length; i += 1) {
				k = JSHINT.undefs[i].slice(0);

				if (markDefined(k[2].value, k[0])) {
					clearImplied(k[2].value, k[2].line);
				} else if (state.option.undef) {
					warning.apply(warning, k.slice(1));
				}
			}

			functions.forEach(function (func) {
				if (func["(unusedOption)"] === false) {
					return;
				}

				for (var key in func) {
					if (_.has(func, key)) {
						checkUnused(func, key);
					}
				}

				if (!func["(params)"])
					return;

				var params = func["(params)"].slice();
				var param  = params.pop();
				var type, unused_opt;

				while (param) {
					type = func[param];
					unused_opt = func["(unusedOption)"] || state.option.unused;
					unused_opt = unused_opt === true ? "last-param" : unused_opt;

					// 'undefined' is a special case for (function (window, undefined) { ... })();
					// patterns.

					if (param === "undefined")
						return;

					if (type === "unused" || type === "unction") {
						warnUnused(param, func["(tokens)"][param], "param", func["(unusedOption)"]);
					} else if (unused_opt === "last-param") {
						return;
					}

					param = params.pop();
				}
			});

			for (var key in declared) {
				if (_.has(declared, key) && !_.has(global, key)) {
					warnUnused(key, declared[key], "var");
				}
			}

		} catch (err) {
			if (err && err.name === "JSHintError") {
				var nt = state.tokens.next || {};
				JSHINT.errors.push({
					scope     : "(main)",
					raw       : err.raw,
					code      : err.code,
					reason    : err.message,
					line      : err.line || nt.line,
					character : err.character || nt.from
				}, null);
			} else {
				throw err;
			}
		}

		// Loop over the listed "internals", and check them as well.

		if (JSHINT.scope === "(main)") {
			o = o || {};

			for (i = 0; i < JSHINT.internals.length; i += 1) {
				k = JSHINT.internals[i];
				o.scope = k.elem;
				itself(k.value, o, g);
			}
		}

		return JSHINT.errors.length === 0;
	};

	// Modules.
	itself.addModule = function (func) {
		extraModules.push(func);
	};

	itself.addModule(style.register);

	// Data summary.
	itself.data = function () {
		var data = {
			functions: [],
			options: state.option
		};
		var implieds = [];
		var members = [];
		var fu, f, i, j, n, globals;

		if (itself.errors.length) {
			data.errors = itself.errors;
		}

		if (state.jsonMode) {
			data.json = true;
		}

		for (n in implied) {
			if (_.has(implied, n)) {
				implieds.push({
					name: n,
					line: implied[n]
				});
			}
		}

		if (implieds.length > 0) {
			data.implieds = implieds;
		}

		if (urls.length > 0) {
			data.urls = urls;
		}

		globals = Object.keys(scope);
		if (globals.length > 0) {
			data.globals = globals;
		}

		for (i = 1; i < functions.length; i += 1) {
			f = functions[i];
			fu = {};

			for (j = 0; j < functionicity.length; j += 1) {
				fu[functionicity[j]] = [];
			}

			for (j = 0; j < functionicity.length; j += 1) {
				if (fu[functionicity[j]].length === 0) {
					delete fu[functionicity[j]];
				}
			}

			fu.name = f["(name)"];
			fu.param = f["(params)"];
			fu.line = f["(line)"];
			fu.character = f["(character)"];
			fu.last = f["(last)"];
			fu.lastcharacter = f["(lastcharacter)"];
			data.functions.push(fu);
		}

		if (unuseds.length > 0) {
			data.unused = unuseds;
		}

		members = [];
		for (n in member) {
			if (typeof member[n] === "number") {
				data.member = member;
				break;
			}
		}

		return data;
	};

	itself.jshint = itself;

	return itself;
}());

// Make JSHINT a Node module, if possible.
if (typeof exports === "object" && exports) {
	exports.JSHINT = JSHINT;
}

})()
},{"events":2,"../shared/vars.js":3,"../shared/messages.js":7,"./reg.js":4,"./state.js":6,"./style.js":5,"./lex.js":8,"console-browserify":9,"underscore":10}],7:[function(require,module,exports){
(function(){"use strict";

var _ = require("underscore");

var errors = {
	// JSHint options
	E001: "Bad option: '{a}'.",
	E002: "Bad option value.",

	// JSHint input
	E003: "Expected a JSON value.",
	E004: "Input is neither a string nor an array of strings.",
	E005: "Input is empty.",
	E006: "Unexpected early end of program.",

	// Strict mode
	E007: "Missing \"use strict\" statement.",
	E008: "Strict violation.",
	E009: "Option 'validthis' can't be used in a global scope.",
	E010: "'with' is not allowed in strict mode.",

	// Constants
	E011: "const '{a}' has already been declared.",
	E012: "const '{a}' is initialized to 'undefined'.",
	E013: "Attempting to override '{a}' which is a constant.",

	// Regular expressions
	E014: "A regular expression literal can be confused with '/='.",
	E015: "Unclosed regular expression.",
	E016: "Invalid regular expression.",

	// Tokens
	E017: "Unclosed comment.",
	E018: "Unbegun comment.",
	E019: "Unmatched '{a}'.",
	E020: "Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",
	E021: "Expected '{a}' and instead saw '{b}'.",
	E022: "Line breaking error '{a}'.",
	E023: "Missing '{a}'.",
	E024: "Unexpected '{a}'.",
	E025: "Missing ':' on a case clause.",
	E026: "Missing '}' to match '{' from line {a}.",
	E027: "Missing ']' to match '[' form line {a}.",
	E028: "Illegal comma.",
	E029: "Unclosed string.",

	// Everything else
	E030: "Expected an identifier and instead saw '{a}'.",
	E031: "Bad assignment.", // FIXME: Rephrase
	E032: "Expected a small integer or 'false' and instead saw '{a}'.",
	E033: "Expected an operator and instead saw '{a}'.",
	E034: "get/set are ES5 features.",
	E035: "Missing property name.",
	E036: "Expected to see a statement and instead saw a block.",
	E037: null, // Vacant
	E038: null, // Vacant
	E039: "Function declarations are not invocable. Wrap the whole function invocation in parens.",
	E040: "Each value should have its own case label.",
	E041: "Unrecoverable syntax error.",
	E042: "Stopping.",
	E043: "Too many errors.",
	E044: "'{a}' is already defined and can't be redefined.",
	E045: "Invalid for each loop.",
	E046: "A yield statement shall be within a generator function (with syntax: `function*`)",
	E047: "A generator function shall contain a yield statement.",
	E048: "Let declaration not directly within block.",
	E049: "A {a} cannot be named '{b}'.",
	E050: "Mozilla requires the yield expression to be parenthesized here.",
	E051: "Regular parameters cannot come after default parameters."
};

var warnings = {
	W001: "'hasOwnProperty' is a really bad name.",
	W002: "Value of '{a}' may be overwritten in IE 8 and earlier.",
	W003: "'{a}' was used before it was defined.",
	W004: "'{a}' is already defined.",
	W005: "A dot following a number can be confused with a decimal point.",
	W006: "Confusing minuses.",
	W007: "Confusing pluses.",
	W008: "A leading decimal point can be confused with a dot: '{a}'.",
	W009: "The array literal notation [] is preferrable.",
	W010: "The object literal notation {} is preferrable.",
	W011: "Unexpected space after '{a}'.",
	W012: "Unexpected space before '{a}'.",
	W013: "Missing space after '{a}'.",
	W014: "Bad line breaking before '{a}'.",
	W015: "Expected '{a}' to have an indentation at {b} instead at {c}.",
	W016: "Unexpected use of '{a}'.",
	W017: "Bad operand.",
	W018: "Confusing use of '{a}'.",
	W019: "Use the isNaN function to compare with NaN.",
	W020: "Read only.",
	W021: "'{a}' is a function.",
	W022: "Do not assign to the exception parameter.",
	W023: "Expected an identifier in an assignment and instead saw a function invocation.",
	W024: "Expected an identifier and instead saw '{a}' (a reserved word).",
	W025: "Missing name in function declaration.",
	W026: "Inner functions should be listed at the top of the outer function.",
	W027: "Unreachable '{a}' after '{b}'.",
	W028: "Label '{a}' on {b} statement.",
	W030: "Expected an assignment or function call and instead saw an expression.",
	W031: "Do not use 'new' for side effects.",
	W032: "Unnecessary semicolon.",
	W033: "Missing semicolon.",
	W034: "Unnecessary directive \"{a}\".",
	W035: "Empty block.",
	W036: "Unexpected /*member '{a}'.",
	W037: "'{a}' is a statement label.",
	W038: "'{a}' used out of scope.",
	W039: "'{a}' is not allowed.",
	W040: "Possible strict violation.",
	W041: "Use '{a}' to compare with '{b}'.",
	W042: "Avoid EOL escaping.",
	W043: "Bad escaping of EOL. Use option multistr if needed.",
	W044: "Bad or unnecessary escaping.",
	W045: "Bad number '{a}'.",
	W046: "Don't use extra leading zeros '{a}'.",
	W047: "A trailing decimal point can be confused with a dot: '{a}'.",
	W048: "Unexpected control character in regular expression.",
	W049: "Unexpected escaped character '{a}' in regular expression.",
	W050: "JavaScript URL.",
	W051: "Variables should not be deleted.",
	W052: "Unexpected '{a}'.",
	W053: "Do not use {a} as a constructor.",
	W054: "The Function constructor is a form of eval.",
	W055: "A constructor name should start with an uppercase letter.",
	W056: "Bad constructor.",
	W057: "Weird construction. Is 'new' unnecessary?",
	W058: "Missing '()' invoking a constructor.",
	W059: "Avoid arguments.{a}.",
	W060: "document.write can be a form of eval.",
	W061: "eval can be harmful.",
	W062: "Wrap an immediate function invocation in parens " +
		"to assist the reader in understanding that the expression " +
		"is the result of a function, and not the function itself.",
	W063: "Math is not a function.",
	W064: "Missing 'new' prefix when invoking a constructor.",
	W065: "Missing radix parameter.",
	W066: "Implied eval. Consider passing a function instead of a string.",
	W067: "Bad invocation.",
	W068: "Wrapping non-IIFE function literals in parens is unnecessary.",
	W069: "['{a}'] is better written in dot notation.",
	W070: "Extra comma. (it breaks older versions of IE)",
	W071: "This function has too many statements. ({a})",
	W072: "This function has too many parameters. ({a})",
	W073: "Blocks are nested too deeply. ({a})",
	W074: "This function's cyclomatic complexity is too high. ({a})",
	W075: "Duplicate key '{a}'.",
	W076: "Unexpected parameter '{a}' in get {b} function.",
	W077: "Expected a single parameter in set {a} function.",
	W078: "Setter is defined without getter.",
	W079: "Redefinition of '{a}'.",
	W080: "It's not necessary to initialize '{a}' to 'undefined'.",
	W081: "Too many var statements.",
	W082: "Function declarations should not be placed in blocks. " +
		"Use a function expression or move the statement to the top of " +
		"the outer function.",
	W083: "Don't make functions within a loop.",
	W084: "Expected a conditional expression and instead saw an assignment.",
	W085: "Don't use 'with'.",
	W086: "Expected a 'break' statement before '{a}'.",
	W087: "Forgotten 'debugger' statement?",
	W088: "Creating global 'for' variable. Should be 'for (var {a} ...'.",
	W089: "The body of a for in should be wrapped in an if statement to filter " +
		"unwanted properties from the prototype.",
	W090: "'{a}' is not a statement label.",
	W091: "'{a}' is out of scope.",
	W092: "Wrap the /regexp/ literal in parens to disambiguate the slash operator.",
	W093: "Did you mean to return a conditional instead of an assignment?",
	W094: "Unexpected comma.",
	W095: "Expected a string and instead saw {a}.",
	W096: "The '{a}' key may produce unexpected results.",
	W097: "Use the function form of \"use strict\".",
	W098: "'{a}' is defined but never used.",
	W099: "Mixed spaces and tabs.",
	W100: "This character may get silently deleted by one or more browsers.",
	W101: "Line is too long.",
	W102: "Trailing whitespace.",
	W103: "The '{a}' property is deprecated.",
	W104: "'{a}' is only available in JavaScript 1.7.",
	W105: "Unexpected {a} in '{b}'.",
	W106: "Identifier '{a}' is not in camel case.",
	W107: "Script URL.",
	W108: "Strings must use doublequote.",
	W109: "Strings must use singlequote.",
	W110: "Mixed double and single quotes.",
	W112: "Unclosed string.",
	W113: "Control character in string: {a}.",
	W114: "Avoid {a}.",
	W115: "Octal literals are not allowed in strict mode.",
	W116: "Expected '{a}' and instead saw '{b}'.",
	W117: "'{a}' is not defined.",
	W118: "'{a}' is only available in Mozilla JavaScript extensions (use moz option).",
	W119: "'{a}' is only available in ES6 (use esnext option).",
	W120: "You might be leaking a variable ({a}) here."
};

var info = {
	I001: "Comma warnings can be turned off with 'laxcomma'.",
	I002: "Reserved words as properties can be used under the 'es5' option.",
	I003: "ES5 option is now set per default"
};

exports.errors = {};
exports.warnings = {};
exports.info = {};

_.each(errors, function (desc, code) {
	exports.errors[code] = { code: code, desc: desc };
});

_.each(warnings, function (desc, code) {
	exports.warnings[code] = { code: code, desc: desc };
});

_.each(info, function (desc, code) {
	exports.info[code] = { code: code, desc: desc };
});

})()
},{"underscore":10}],8:[function(require,module,exports){
(function(){/*
 * Lexical analysis and token construction.
 */

"use strict";

var _      = require("underscore");
var events = require("events");
var reg    = require("./reg.js");
var state  = require("./state.js").state;

// Some of these token types are from JavaScript Parser API
// while others are specific to JSHint parser.
// JS Parser API: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API

var Token = {
	Identifier: 1,
	Punctuator: 2,
	NumericLiteral: 3,
	StringLiteral: 4,
	Comment: 5,
	Keyword: 6,
	NullLiteral: 7,
	BooleanLiteral: 8,
	RegExp: 9
};

// This is auto generated from the unicode tables.
// The tables are at:
// http://www.fileformat.info/info/unicode/category/Lu/list.htm
// http://www.fileformat.info/info/unicode/category/Ll/list.htm
// http://www.fileformat.info/info/unicode/category/Lt/list.htm
// http://www.fileformat.info/info/unicode/category/Lm/list.htm
// http://www.fileformat.info/info/unicode/category/Lo/list.htm
// http://www.fileformat.info/info/unicode/category/Nl/list.htm

var unicodeLetterTable = [
	170, 170, 181, 181, 186, 186, 192, 214,
	216, 246, 248, 705, 710, 721, 736, 740, 748, 748, 750, 750,
	880, 884, 886, 887, 890, 893, 902, 902, 904, 906, 908, 908,
	910, 929, 931, 1013, 1015, 1153, 1162, 1319, 1329, 1366,
	1369, 1369, 1377, 1415, 1488, 1514, 1520, 1522, 1568, 1610,
	1646, 1647, 1649, 1747, 1749, 1749, 1765, 1766, 1774, 1775,
	1786, 1788, 1791, 1791, 1808, 1808, 1810, 1839, 1869, 1957,
	1969, 1969, 1994, 2026, 2036, 2037, 2042, 2042, 2048, 2069,
	2074, 2074, 2084, 2084, 2088, 2088, 2112, 2136, 2308, 2361,
	2365, 2365, 2384, 2384, 2392, 2401, 2417, 2423, 2425, 2431,
	2437, 2444, 2447, 2448, 2451, 2472, 2474, 2480, 2482, 2482,
	2486, 2489, 2493, 2493, 2510, 2510, 2524, 2525, 2527, 2529,
	2544, 2545, 2565, 2570, 2575, 2576, 2579, 2600, 2602, 2608,
	2610, 2611, 2613, 2614, 2616, 2617, 2649, 2652, 2654, 2654,
	2674, 2676, 2693, 2701, 2703, 2705, 2707, 2728, 2730, 2736,
	2738, 2739, 2741, 2745, 2749, 2749, 2768, 2768, 2784, 2785,
	2821, 2828, 2831, 2832, 2835, 2856, 2858, 2864, 2866, 2867,
	2869, 2873, 2877, 2877, 2908, 2909, 2911, 2913, 2929, 2929,
	2947, 2947, 2949, 2954, 2958, 2960, 2962, 2965, 2969, 2970,
	2972, 2972, 2974, 2975, 2979, 2980, 2984, 2986, 2990, 3001,
	3024, 3024, 3077, 3084, 3086, 3088, 3090, 3112, 3114, 3123,
	3125, 3129, 3133, 3133, 3160, 3161, 3168, 3169, 3205, 3212,
	3214, 3216, 3218, 3240, 3242, 3251, 3253, 3257, 3261, 3261,
	3294, 3294, 3296, 3297, 3313, 3314, 3333, 3340, 3342, 3344,
	3346, 3386, 3389, 3389, 3406, 3406, 3424, 3425, 3450, 3455,
	3461, 3478, 3482, 3505, 3507, 3515, 3517, 3517, 3520, 3526,
	3585, 3632, 3634, 3635, 3648, 3654, 3713, 3714, 3716, 3716,
	3719, 3720, 3722, 3722, 3725, 3725, 3732, 3735, 3737, 3743,
	3745, 3747, 3749, 3749, 3751, 3751, 3754, 3755, 3757, 3760,
	3762, 3763, 3773, 3773, 3776, 3780, 3782, 3782, 3804, 3805,
	3840, 3840, 3904, 3911, 3913, 3948, 3976, 3980, 4096, 4138,
	4159, 4159, 4176, 4181, 4186, 4189, 4193, 4193, 4197, 4198,
	4206, 4208, 4213, 4225, 4238, 4238, 4256, 4293, 4304, 4346,
	4348, 4348, 4352, 4680, 4682, 4685, 4688, 4694, 4696, 4696,
	4698, 4701, 4704, 4744, 4746, 4749, 4752, 4784, 4786, 4789,
	4792, 4798, 4800, 4800, 4802, 4805, 4808, 4822, 4824, 4880,
	4882, 4885, 4888, 4954, 4992, 5007, 5024, 5108, 5121, 5740,
	5743, 5759, 5761, 5786, 5792, 5866, 5870, 5872, 5888, 5900,
	5902, 5905, 5920, 5937, 5952, 5969, 5984, 5996, 5998, 6000,
	6016, 6067, 6103, 6103, 6108, 6108, 6176, 6263, 6272, 6312,
	6314, 6314, 6320, 6389, 6400, 6428, 6480, 6509, 6512, 6516,
	6528, 6571, 6593, 6599, 6656, 6678, 6688, 6740, 6823, 6823,
	6917, 6963, 6981, 6987, 7043, 7072, 7086, 7087, 7104, 7141,
	7168, 7203, 7245, 7247, 7258, 7293, 7401, 7404, 7406, 7409,
	7424, 7615, 7680, 7957, 7960, 7965, 7968, 8005, 8008, 8013,
	8016, 8023, 8025, 8025, 8027, 8027, 8029, 8029, 8031, 8061,
	8064, 8116, 8118, 8124, 8126, 8126, 8130, 8132, 8134, 8140,
	8144, 8147, 8150, 8155, 8160, 8172, 8178, 8180, 8182, 8188,
	8305, 8305, 8319, 8319, 8336, 8348, 8450, 8450, 8455, 8455,
	8458, 8467, 8469, 8469, 8473, 8477, 8484, 8484, 8486, 8486,
	8488, 8488, 8490, 8493, 8495, 8505, 8508, 8511, 8517, 8521,
	8526, 8526, 8544, 8584, 11264, 11310, 11312, 11358,
	11360, 11492, 11499, 11502, 11520, 11557, 11568, 11621,
	11631, 11631, 11648, 11670, 11680, 11686, 11688, 11694,
	11696, 11702, 11704, 11710, 11712, 11718, 11720, 11726,
	11728, 11734, 11736, 11742, 11823, 11823, 12293, 12295,
	12321, 12329, 12337, 12341, 12344, 12348, 12353, 12438,
	12445, 12447, 12449, 12538, 12540, 12543, 12549, 12589,
	12593, 12686, 12704, 12730, 12784, 12799, 13312, 13312,
	19893, 19893, 19968, 19968, 40907, 40907, 40960, 42124,
	42192, 42237, 42240, 42508, 42512, 42527, 42538, 42539,
	42560, 42606, 42623, 42647, 42656, 42735, 42775, 42783,
	42786, 42888, 42891, 42894, 42896, 42897, 42912, 42921,
	43002, 43009, 43011, 43013, 43015, 43018, 43020, 43042,
	43072, 43123, 43138, 43187, 43250, 43255, 43259, 43259,
	43274, 43301, 43312, 43334, 43360, 43388, 43396, 43442,
	43471, 43471, 43520, 43560, 43584, 43586, 43588, 43595,
	43616, 43638, 43642, 43642, 43648, 43695, 43697, 43697,
	43701, 43702, 43705, 43709, 43712, 43712, 43714, 43714,
	43739, 43741, 43777, 43782, 43785, 43790, 43793, 43798,
	43808, 43814, 43816, 43822, 43968, 44002, 44032, 44032,
	55203, 55203, 55216, 55238, 55243, 55291, 63744, 64045,
	64048, 64109, 64112, 64217, 64256, 64262, 64275, 64279,
	64285, 64285, 64287, 64296, 64298, 64310, 64312, 64316,
	64318, 64318, 64320, 64321, 64323, 64324, 64326, 64433,
	64467, 64829, 64848, 64911, 64914, 64967, 65008, 65019,
	65136, 65140, 65142, 65276, 65313, 65338, 65345, 65370,
	65382, 65470, 65474, 65479, 65482, 65487, 65490, 65495,
	65498, 65500, 65536, 65547, 65549, 65574, 65576, 65594,
	65596, 65597, 65599, 65613, 65616, 65629, 65664, 65786,
	65856, 65908, 66176, 66204, 66208, 66256, 66304, 66334,
	66352, 66378, 66432, 66461, 66464, 66499, 66504, 66511,
	66513, 66517, 66560, 66717, 67584, 67589, 67592, 67592,
	67594, 67637, 67639, 67640, 67644, 67644, 67647, 67669,
	67840, 67861, 67872, 67897, 68096, 68096, 68112, 68115,
	68117, 68119, 68121, 68147, 68192, 68220, 68352, 68405,
	68416, 68437, 68448, 68466, 68608, 68680, 69635, 69687,
	69763, 69807, 73728, 74606, 74752, 74850, 77824, 78894,
	92160, 92728, 110592, 110593, 119808, 119892, 119894, 119964,
	119966, 119967, 119970, 119970, 119973, 119974, 119977, 119980,
	119982, 119993, 119995, 119995, 119997, 120003, 120005, 120069,
	120071, 120074, 120077, 120084, 120086, 120092, 120094, 120121,
	120123, 120126, 120128, 120132, 120134, 120134, 120138, 120144,
	120146, 120485, 120488, 120512, 120514, 120538, 120540, 120570,
	120572, 120596, 120598, 120628, 120630, 120654, 120656, 120686,
	120688, 120712, 120714, 120744, 120746, 120770, 120772, 120779,
	131072, 131072, 173782, 173782, 173824, 173824, 177972, 177972,
	177984, 177984, 178205, 178205, 194560, 195101
];

var identifierStartTable = [];

for (var i = 0; i < 128; i++) {
	identifierStartTable[i] =
		i === 36 ||           // $
		i >= 65 && i <= 90 || // A-Z
		i === 95 ||           // _
		i >= 97 && i <= 122;  // a-z
}

var identifierPartTable = [];

for (var i = 0; i < 128; i++) {
	identifierPartTable[i] =
		identifierStartTable[i] || // $, _, A-Z, a-z
		i >= 48 && i <= 57;        // 0-9
}

// Object that handles postponed lexing verifications that checks the parsed
// environment state.

function asyncTrigger() {
	var _checks = [];

	return {
		push: function (fn) {
			_checks.push(fn);
		},

		check: function () {
			for (var check = 0; check < _checks.length; ++check) {
				_checks[check]();
			}

			_checks.splice(0, _checks.length);
		}
	};
}

/*
 * Lexer for JSHint.
 *
 * This object does a char-by-char scan of the provided source code
 * and produces a sequence of tokens.
 *
 *   var lex = new Lexer("var i = 0;");
 *   lex.start();
 *   lex.token(); // returns the next token
 *
 * You have to use the token() method to move the lexer forward
 * but you don't have to use its return value to get tokens. In addition
 * to token() method returning the next token, the Lexer object also
 * emits events.
 *
 *   lex.on("Identifier", function (data) {
 *     if (data.name.indexOf("_") >= 0) {
 *       // Produce a warning.
 *     }
 *   });
 *
 * Note that the token() method returns tokens in a JSLint-compatible
 * format while the event emitter uses a slightly modified version of
 * Mozilla's JavaScript Parser API. Eventually, we will move away from
 * JSLint format.
 */
function Lexer(source) {
	var lines = source;

	if (typeof lines === "string") {
		lines = lines
			.replace(/\r\n/g, "\n")
			.replace(/\r/g, "\n")
			.split("\n");
	}

	// If the first line is a shebang (#!), make it a blank and move on.
	// Shebangs are used by Node scripts.

	if (lines[0] && lines[0].substr(0, 2) === "#!") {
		lines[0] = "";
	}

	this.emitter = new events.EventEmitter();
	this.source = source;
	this.setLines(lines);
	this.prereg = true;

	this.line = 0;
	this.char = 1;
	this.from = 1;
	this.input = "";

	for (var i = 0; i < state.option.indent; i += 1) {
		state.tab += " ";
	}
}

Lexer.prototype = {
	_lines: [],

	getLines: function () {
		this._lines = state.lines;
		return this._lines;
	},

	setLines: function (val) {
		this._lines = val;
		state.lines = this._lines;
	},

	/*
	 * Return the next i character without actually moving the
	 * char pointer.
	 */
	peek: function (i) {
		return this.input.charAt(i || 0);
	},

	/*
	 * Move the char pointer forward i times.
	 */
	skip: function (i) {
		i = i || 1;
		this.char += i;
		this.input = this.input.slice(i);
	},

	/*
	 * Subscribe to a token event. The API for this method is similar
	 * Underscore.js i.e. you can subscribe to multiple events with
	 * one call:
	 *
	 *   lex.on("Identifier Number", function (data) {
	 *     // ...
	 *   });
	 */
	on: function (names, listener) {
		names.split(" ").forEach(function (name) {
			this.emitter.on(name, listener);
		}.bind(this));
	},

	/*
	 * Trigger a token event. All arguments will be passed to each
	 * listener.
	 */
	trigger: function () {
		this.emitter.emit.apply(this.emitter, Array.prototype.slice.call(arguments));
	},

	/*
	 * Postpone a token event. the checking condition is set as
	 * last parameter, and the trigger function is called in a
	 * stored callback. To be later called using the check() function
	 * by the parser. This avoids parser's peek() to give the lexer
	 * a false context.
	 */
	triggerAsync: function (type, args, checks, fn) {
		checks.push(function () {
			if (fn()) {
				this.trigger(type, args);
			}
		}.bind(this));
	},

	/*
	 * Extract a punctuator out of the next sequence of characters
	 * or return 'null' if its not possible.
	 *
	 * This method's implementation was heavily influenced by the
	 * scanPunctuator function in the Esprima parser's source code.
	 */
	scanPunctuator: function () {
		var ch1 = this.peek();
		var ch2, ch3, ch4;

		switch (ch1) {
		// Most common single-character punctuators
		case ".":
			if ((/^[0-9]$/).test(this.peek(1))) {
				return null;
			}
			if (this.peek(1) === "." && this.peek(2) === ".") {
				return {
					type: Token.Punctuator,
					value: "..."
				};
			}
			/* falls through */
		case "(":
		case ")":
		case ";":
		case ",":
		case "{":
		case "}":
		case "[":
		case "]":
		case ":":
		case "~":
		case "?":
			return {
				type: Token.Punctuator,
				value: ch1
			};

		// A pound sign (for Node shebangs)
		case "#":
			return {
				type: Token.Punctuator,
				value: ch1
			};

		// We're at the end of input
		case "":
			return null;
		}

		// Peek more characters

		ch2 = this.peek(1);
		ch3 = this.peek(2);
		ch4 = this.peek(3);

		// 4-character punctuator: >>>=

		if (ch1 === ">" && ch2 === ">" && ch3 === ">" && ch4 === "=") {
			return {
				type: Token.Punctuator,
				value: ">>>="
			};
		}

		// 3-character punctuators: === !== >>> <<= >>=

		if (ch1 === "=" && ch2 === "=" && ch3 === "=") {
			return {
				type: Token.Punctuator,
				value: "==="
			};
		}

		if (ch1 === "!" && ch2 === "=" && ch3 === "=") {
			return {
				type: Token.Punctuator,
				value: "!=="
			};
		}

		if (ch1 === ">" && ch2 === ">" && ch3 === ">") {
			return {
				type: Token.Punctuator,
				value: ">>>"
			};
		}

		if (ch1 === "<" && ch2 === "<" && ch3 === "=") {
			return {
				type: Token.Punctuator,
				value: "<<="
			};
		}

		if (ch1 === ">" && ch2 === ">" && ch3 === "=") {
			return {
				type: Token.Punctuator,
				value: ">>="
			};
		}

		// Fat arrow punctuator
		if (ch1 === "=" && ch2 === ">") {
			return {
				type: Token.Punctuator,
				value: ch1 + ch2
			};
		}

		// 2-character punctuators: <= >= == != ++ -- << >> && ||
		// += -= *= %= &= |= ^= (but not /=, see below)
		if (ch1 === ch2 && ("+-<>&|".indexOf(ch1) >= 0)) {
			return {
				type: Token.Punctuator,
				value: ch1 + ch2
			};
		}

		if ("<>=!+-*%&|^".indexOf(ch1) >= 0) {
			if (ch2 === "=") {
				return {
					type: Token.Punctuator,
					value: ch1 + ch2
				};
			}

			return {
				type: Token.Punctuator,
				value: ch1
			};
		}

		// Special case: /=. We need to make sure that this is an
		// operator and not a regular expression.

		if (ch1 === "/") {
			if (ch2 === "=" && /\/=(?!(\S*\/[gim]?))/.test(this.input)) {
				// /= is not a part of a regular expression, return it as a
				// punctuator.
				return {
					type: Token.Punctuator,
					value: "/="
				};
			}

			return {
				type: Token.Punctuator,
				value: "/"
			};
		}

		return null;
	},

	/*
	 * Extract a comment out of the next sequence of characters and/or
	 * lines or return 'null' if its not possible. Since comments can
	 * span across multiple lines this method has to move the char
	 * pointer.
	 *
	 * In addition to normal JavaScript comments (// and /*) this method
	 * also recognizes JSHint- and JSLint-specific comments such as
	 * /*jshint, /*jslint, /*globals and so on.
	 */
	scanComments: function () {
		var ch1 = this.peek();
		var ch2 = this.peek(1);
		var rest = this.input.substr(2);
		var startLine = this.line;
		var startChar = this.char;

		// Create a comment token object and make sure it
		// has all the data JSHint needs to work with special
		// comments.

		function commentToken(label, body, opt) {
			var special = ["jshint", "jslint", "members", "member", "globals", "global", "exported"];
			var isSpecial = false;
			var value = label + body;
			var commentType = "plain";
			opt = opt || {};

			if (opt.isMultiline) {
				value += "*/";
			}

			special.forEach(function (str) {
				if (isSpecial) {
					return;
				}

				// Don't recognize any special comments other than jshint for single-line
				// comments. This introduced many problems with legit comments.
				if (label === "//" && str !== "jshint") {
					return;
				}

				if (body.substr(0, str.length) === str) {
					isSpecial = true;
					label = label + str;
					body = body.substr(str.length);
				}

				if (!isSpecial && body.charAt(0) === " " && body.substr(1, str.length) === str) {
					isSpecial = true;
					label = label + " " + str;
					body = body.substr(str.length + 1);
				}

				if (!isSpecial) {
					return;
				}

				switch (str) {
				case "member":
					commentType = "members";
					break;
				case "global":
					commentType = "globals";
					break;
				default:
					commentType = str;
				}
			});

			return {
				type: Token.Comment,
				commentType: commentType,
				value: value,
				body: body,
				isSpecial: isSpecial,
				isMultiline: opt.isMultiline || false,
				isMalformed: opt.isMalformed || false
			};
		}

		// End of unbegun comment. Raise an error and skip that input.
		if (ch1 === "*" && ch2 === "/") {
			this.trigger("error", {
				code: "E018",
				line: startLine,
				character: startChar
			});

			this.skip(2);
			return null;
		}

		// Comments must start either with // or /*
		if (ch1 !== "/" || (ch2 !== "*" && ch2 !== "/")) {
			return null;
		}

		// One-line comment
		if (ch2 === "/") {
			this.skip(this.input.length); // Skip to the EOL.
			return commentToken("//", rest);
		}

		var body = "";

		/* Multi-line comment */
		if (ch2 === "*") {
			this.skip(2);

			while (this.peek() !== "*" || this.peek(1) !== "/") {
				if (this.peek() === "") { // End of Line
					body += "\n";

					// If we hit EOF and our comment is still unclosed,
					// trigger an error and end the comment implicitly.
					if (!this.nextLine()) {
						this.trigger("error", {
							code: "E017",
							line: startLine,
							character: startChar
						});

						return commentToken("/*", body, {
							isMultiline: true,
							isMalformed: true
						});
					}
				} else {
					body += this.peek();
					this.skip();
				}
			}

			this.skip(2);
			return commentToken("/*", body, { isMultiline: true });
		}
	},

	/*
	 * Extract a keyword out of the next sequence of characters or
	 * return 'null' if its not possible.
	 */
	scanKeyword: function () {
		var result = /^[a-zA-Z_$][a-zA-Z0-9_$]*/.exec(this.input);
		var keywords = [
			"if", "in", "do", "var", "for", "new",
			"try", "let", "this", "else", "case",
			"void", "with", "enum", "while", "break",
			"catch", "throw", "const", "yield", "class",
			"super", "return", "typeof", "delete",
			"switch", "export", "import", "default",
			"finally", "extends", "function", "continue",
			"debugger", "instanceof"
		];

		if (result && keywords.indexOf(result[0]) >= 0) {
			return {
				type: Token.Keyword,
				value: result[0]
			};
		}

		return null;
	},

	/*
	 * Extract a JavaScript identifier out of the next sequence of
	 * characters or return 'null' if its not possible. In addition,
	 * to Identifier this method can also produce BooleanLiteral
	 * (true/false) and NullLiteral (null).
	 */
	scanIdentifier: function () {
		var id = "";
		var index = 0;
		var type, char;

		// Detects any character in the Unicode categories "Uppercase
		// letter (Lu)", "Lowercase letter (Ll)", "Titlecase letter
		// (Lt)", "Modifier letter (Lm)", "Other letter (Lo)", or
		// "Letter number (Nl)".
		//
		// Both approach and unicodeLetterTable were borrowed from
		// Google's Traceur.

		function isUnicodeLetter(code) {
			for (var i = 0; i < unicodeLetterTable.length;) {
				if (code < unicodeLetterTable[i++]) {
					return false;
				}

				if (code <= unicodeLetterTable[i++]) {
					return true;
				}
			}

			return false;
		}

		function isHexDigit(str) {
			return (/^[0-9a-fA-F]$/).test(str);
		}

		var readUnicodeEscapeSequence = function () {
			/*jshint validthis:true */
			index += 1;

			if (this.peek(index) !== "u") {
				return null;
			}

			var ch1 = this.peek(index + 1);
			var ch2 = this.peek(index + 2);
			var ch3 = this.peek(index + 3);
			var ch4 = this.peek(index + 4);
			var code;

			if (isHexDigit(ch1) && isHexDigit(ch2) && isHexDigit(ch3) && isHexDigit(ch4)) {
				code = parseInt(ch1 + ch2 + ch3 + ch4, 16);

				if (isUnicodeLetter(code)) {
					index += 5;
					return "\\u" + ch1 + ch2 + ch3 + ch4;
				}

				return null;
			}

			return null;
		}.bind(this);

		var getIdentifierStart = function () {
			/*jshint validthis:true */
			var chr = this.peek(index);
			var code = chr.charCodeAt(0);

			if (code === 92) {
				return readUnicodeEscapeSequence();
			}

			if (code < 128) {
				if (identifierStartTable[code]) {
					index += 1;
					return chr;
				}

				return null;
			}

			if (isUnicodeLetter(code)) {
				index += 1;
				return chr;
			}

			return null;
		}.bind(this);

		var getIdentifierPart = function () {
			/*jshint validthis:true */
			var chr = this.peek(index);
			var code = chr.charCodeAt(0);

			if (code === 92) {
				return readUnicodeEscapeSequence();
			}

			if (code < 128) {
				if (identifierPartTable[code]) {
					index += 1;
					return chr;
				}

				return null;
			}

			if (isUnicodeLetter(code)) {
				index += 1;
				return chr;
			}

			return null;
		}.bind(this);

		char = getIdentifierStart();
		if (char === null) {
			return null;
		}

		id = char;
		for (;;) {
			char = getIdentifierPart();

			if (char === null) {
				break;
			}

			id += char;
		}

		switch (id) {
		case "true":
		case "false":
			type = Token.BooleanLiteral;
			break;
		case "null":
			type = Token.NullLiteral;
			break;
		default:
			type = Token.Identifier;
		}

		return {
			type: type,
			value: id
		};
	},

	/*
	 * Extract a numeric literal out of the next sequence of
	 * characters or return 'null' if its not possible. This method
	 * supports all numeric literals described in section 7.8.3
	 * of the EcmaScript 5 specification.
	 *
	 * This method's implementation was heavily influenced by the
	 * scanNumericLiteral function in the Esprima parser's source code.
	 */
	scanNumericLiteral: function () {
		var index = 0;
		var value = "";
		var length = this.input.length;
		var char = this.peek(index);
		var bad;

		function isDecimalDigit(str) {
			return (/^[0-9]$/).test(str);
		}

		function isOctalDigit(str) {
			return (/^[0-7]$/).test(str);
		}

		function isHexDigit(str) {
			return (/^[0-9a-fA-F]$/).test(str);
		}

		function isIdentifierStart(ch) {
			return (ch === "$") || (ch === "_") || (ch === "\\") ||
				(ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
		}

		// Numbers must start either with a decimal digit or a point.

		if (char !== "." && !isDecimalDigit(char)) {
			return null;
		}

		if (char !== ".") {
			value = this.peek(index);
			index += 1;
			char = this.peek(index);

			if (value === "0") {
				// Base-16 numbers.
				if (char === "x" || char === "X") {
					index += 1;
					value += char;

					while (index < length) {
						char = this.peek(index);
						if (!isHexDigit(char)) {
							break;
						}
						value += char;
						index += 1;
					}

					if (value.length <= 2) { // 0x
						return {
							type: Token.NumericLiteral,
							value: value,
							isMalformed: true
						};
					}

					if (index < length) {
						char = this.peek(index);
						if (isIdentifierStart(char)) {
							return null;
						}
					}

					return {
						type: Token.NumericLiteral,
						value: value,
						base: 16,
						isMalformed: false
					};
				}

				// Base-8 numbers.
				if (isOctalDigit(char)) {
					index += 1;
					value += char;
					bad = false;

					while (index < length) {
						char = this.peek(index);

						// Numbers like '019' (note the 9) are not valid octals
						// but we still parse them and mark as malformed.

						if (isDecimalDigit(char)) {
							bad = true;
						} else if (!isOctalDigit(char)) {
							break;
						}
						value += char;
						index += 1;
					}

					if (index < length) {
						char = this.peek(index);
						if (isIdentifierStart(char)) {
							return null;
						}
					}

					return {
						type: Token.NumericLiteral,
						value: value,
						base: 8,
						isMalformed: false
					};
				}

				// Decimal numbers that start with '0' such as '09' are illegal
				// but we still parse them and return as malformed.

				if (isDecimalDigit(char)) {
					index += 1;
					value += char;
				}
			}

			while (index < length) {
				char = this.peek(index);
				if (!isDecimalDigit(char)) {
					break;
				}
				value += char;
				index += 1;
			}
		}

		// Decimal digits.

		if (char === ".") {
			value += char;
			index += 1;

			while (index < length) {
				char = this.peek(index);
				if (!isDecimalDigit(char)) {
					break;
				}
				value += char;
				index += 1;
			}
		}

		// Exponent part.

		if (char === "e" || char === "E") {
			value += char;
			index += 1;
			char = this.peek(index);

			if (char === "+" || char === "-") {
				value += this.peek(index);
				index += 1;
			}

			char = this.peek(index);
			if (isDecimalDigit(char)) {
				value += char;
				index += 1;

				while (index < length) {
					char = this.peek(index);
					if (!isDecimalDigit(char)) {
						break;
					}
					value += char;
					index += 1;
				}
			} else {
				return null;
			}
		}

		if (index < length) {
			char = this.peek(index);
			if (isIdentifierStart(char)) {
				return null;
			}
		}

		return {
			type: Token.NumericLiteral,
			value: value,
			base: 10,
			isMalformed: !isFinite(value)
		};
	},

	/*
	 * Extract a string out of the next sequence of characters and/or
	 * lines or return 'null' if its not possible. Since strings can
	 * span across multiple lines this method has to move the char
	 * pointer.
	 *
	 * This method recognizes pseudo-multiline JavaScript strings:
	 *
	 *   var str = "hello\
	 *   world";
	 */
	scanStringLiteral: function (checks) {
		/*jshint loopfunc:true */
		var quote = this.peek();

		// String must start with a quote.
		if (quote !== "\"" && quote !== "'") {
			return null;
		}

		// In JSON strings must always use double quotes.
		this.triggerAsync("warning", {
			code: "W108",
			line: this.line,
			character: this.char // +1?
		}, checks, function () { return state.jsonMode && quote !== "\""; });

		var value = "";
		var startLine = this.line;
		var startChar = this.char;
		var allowNewLine = false;

		this.skip();

		while (this.peek() !== quote) {
			while (this.peek() === "") { // End Of Line

				// If an EOL is not preceded by a backslash, show a warning
				// and proceed like it was a legit multi-line string where
				// author simply forgot to escape the newline symbol.
				//
				// Another approach is to implicitly close a string on EOL
				// but it generates too many false positives.

				if (!allowNewLine) {
					this.trigger("warning", {
						code: "W112",
						line: this.line,
						character: this.char
					});
				} else {
					allowNewLine = false;

					// Otherwise show a warning if multistr option was not set.
					// For JSON, show warning no matter what.

					this.triggerAsync("warning", {
						code: "W043",
						line: this.line,
						character: this.char
					}, checks, function () { return !state.option.multistr; });

					this.triggerAsync("warning", {
						code: "W042",
						line: this.line,
						character: this.char
					}, checks, function () { return state.jsonMode && state.option.multistr; });
				}

				// If we get an EOF inside of an unclosed string, show an
				// error and implicitly close it at the EOF point.

				if (!this.nextLine()) {
					this.trigger("error", {
						code: "E029",
						line: startLine,
						character: startChar
					});

					return {
						type: Token.StringLiteral,
						value: value,
						isUnclosed: true,
						quote: quote
					};
				}
			}

			allowNewLine = false;
			var char = this.peek();
			var jump = 1; // A length of a jump, after we're done
			              // parsing this character.

			if (char < " ") {
				// Warn about a control character in a string.
				this.trigger("warning", {
					code: "W113",
					line: this.line,
					character: this.char,
					data: [ "<non-printable>" ]
				});
			}

			// Special treatment for some escaped characters.

			if (char === "\\") {
				this.skip();
				char = this.peek();

				switch (char) {
				case "'":
					this.triggerAsync("warning", {
						code: "W114",
						line: this.line,
						character: this.char,
						data: [ "\\'" ]
					}, checks, function () {return state.jsonMode; });
					break;
				case "b":
					char = "\b";
					break;
				case "f":
					char = "\f";
					break;
				case "n":
					char = "\n";
					break;
				case "r":
					char = "\r";
					break;
				case "t":
					char = "\t";
					break;
				case "0":
					char = "\0";

					// Octal literals fail in strict mode.
					// Check if the number is between 00 and 07.
					var n = parseInt(this.peek(1), 10);
					this.triggerAsync("warning", {
						code: "W115",
						line: this.line,
						character: this.char
					}, checks,
					function () { return n >= 0 && n <= 7 && state.directive["use strict"]; });
					break;
				case "u":
					char = String.fromCharCode(parseInt(this.input.substr(1, 4), 16));
					jump = 5;
					break;
				case "v":
					this.triggerAsync("warning", {
						code: "W114",
						line: this.line,
						character: this.char,
						data: [ "\\v" ]
					}, checks, function () { return state.jsonMode; });

					char = "\v";
					break;
				case "x":
					var	x = parseInt(this.input.substr(1, 2), 16);

					this.triggerAsync("warning", {
						code: "W114",
						line: this.line,
						character: this.char,
						data: [ "\\x-" ]
					}, checks, function () { return state.jsonMode; });

					char = String.fromCharCode(x);
					jump = 3;
					break;
				case "\\":
				case "\"":
				case "/":
					break;
				case "":
					allowNewLine = true;
					char = "";
					break;
				case "!":
					if (value.slice(value.length - 2) === "<") {
						break;
					}

					/*falls through */
				default:
					// Weird escaping.
					this.trigger("warning", {
						code: "W044",
						line: this.line,
						character: this.char
					});
				}
			}

			value += char;
			this.skip(jump);
		}

		this.skip();
		return {
			type: Token.StringLiteral,
			value: value,
			isUnclosed: false,
			quote: quote
		};
	},

	/*
	 * Extract a regular expression out of the next sequence of
	 * characters and/or lines or return 'null' if its not possible.
	 *
	 * This method is platform dependent: it accepts almost any
	 * regular expression values but then tries to compile and run
	 * them using system's RegExp object. This means that there are
	 * rare edge cases where one JavaScript engine complains about
	 * your regular expression while others don't.
	 */
	scanRegExp: function () {
		var index = 0;
		var length = this.input.length;
		var char = this.peek();
		var value = char;
		var body = "";
		var flags = [];
		var malformed = false;
		var isCharSet = false;
		var terminated;

		var scanUnexpectedChars = function () {
			// Unexpected control character
			if (char < " ") {
				malformed = true;
				this.trigger("warning", {
					code: "W048",
					line: this.line,
					character: this.char
				});
			}

			// Unexpected escaped character
			if (char === "<") {
				malformed = true;
				this.trigger("warning", {
					code: "W049",
					line: this.line,
					character: this.char,
					data: [ char ]
				});
			}
		}.bind(this);

		// Regular expressions must start with '/'
		if (!this.prereg || char !== "/") {
			return null;
		}

		index += 1;
		terminated = false;

		// Try to get everything in between slashes. A couple of
		// cases aside (see scanUnexpectedChars) we don't really
		// care whether the resulting expression is valid or not.
		// We will check that later using the RegExp object.

		while (index < length) {
			char = this.peek(index);
			value += char;
			body += char;

			if (isCharSet) {
				if (char === "]") {
					if (this.peek(index - 1) !== "\\" || this.peek(index - 2) === "\\") {
						isCharSet = false;
					}
				}

				if (char === "\\") {
					index += 1;
					char = this.peek(index);
					body += char;
					value += char;

					scanUnexpectedChars();
				}

				index += 1;
				continue;
			}

			if (char === "\\") {
				index += 1;
				char = this.peek(index);
				body += char;
				value += char;

				scanUnexpectedChars();

				if (char === "/") {
					index += 1;
					continue;
				}

				if (char === "[") {
					index += 1;
					continue;
				}
			}

			if (char === "[") {
				isCharSet = true;
				index += 1;
				continue;
			}

			if (char === "/") {
				body = body.substr(0, body.length - 1);
				terminated = true;
				index += 1;
				break;
			}

			index += 1;
		}

		// A regular expression that was never closed is an
		// error from which we cannot recover.

		if (!terminated) {
			this.trigger("error", {
				code: "E015",
				line: this.line,
				character: this.from
			});

			return void this.trigger("fatal", {
				line: this.line,
				from: this.from
			});
		}

		// Parse flags (if any).

		while (index < length) {
			char = this.peek(index);
			if (!/[gim]/.test(char)) {
				break;
			}
			flags.push(char);
			value += char;
			index += 1;
		}

		// Check regular expression for correctness.

		try {
			new RegExp(body, flags.join(""));
		} catch (err) {
			malformed = true;
			this.trigger("error", {
				code: "E016",
				line: this.line,
				character: this.char,
				data: [ err.message ] // Platform dependent!
			});
		}

		return {
			type: Token.RegExp,
			value: value,
			flags: flags,
			isMalformed: malformed
		};
	},

	/*
	 * Scan for any occurrence of mixed tabs and spaces. If smarttabs option
	 * is on, ignore tabs followed by spaces.
	 *
	 * Tabs followed by one space followed by a block comment are allowed.
	 */
	scanMixedSpacesAndTabs: function () {
		var at, match;

		if (state.option.smarttabs) {
			// Negative look-behind for "//"
			match = this.input.match(/(\/\/|^\s?\*)? \t/);
			at = match && !match[1] ? 0 : -1;
		} else {
			at = this.input.search(/ \t|\t [^\*]/);
		}

		return at;
	},

	/*
	 * Scan for characters that get silently deleted by one or more browsers.
	 */
	scanUnsafeChars: function () {
		return this.input.search(reg.unsafeChars);
	},

	/*
	 * Produce the next raw token or return 'null' if no tokens can be matched.
	 * This method skips over all space characters.
	 */
	next: function (checks) {
		this.from = this.char;

		// Move to the next non-space character.
		var start;
		if (/\s/.test(this.peek())) {
			start = this.char;

			while (/\s/.test(this.peek())) {
				this.from += 1;
				this.skip();
			}

			if (this.peek() === "") { // EOL
				if (!/^\s*$/.test(this.getLines()[this.line - 1]) && state.option.trailing) {
					this.trigger("warning", { code: "W102", line: this.line, character: start });
				}
			}
		}

		// Methods that work with multi-line structures and move the
		// character pointer.

		var match = this.scanComments() ||
			this.scanStringLiteral(checks);

		if (match) {
			return match;
		}

		// Methods that don't move the character pointer.

		match =
			this.scanRegExp() ||
			this.scanPunctuator() ||
			this.scanKeyword() ||
			this.scanIdentifier() ||
			this.scanNumericLiteral();

		if (match) {
			this.skip(match.value.length);
			return match;
		}

		// No token could be matched, give up.

		return null;
	},

	/*
	 * Switch to the next line and reset all char pointers. Once
	 * switched, this method also checks for mixed spaces and tabs
	 * and other minor warnings.
	 */
	nextLine: function () {
		var char;

		if (this.line >= this.getLines().length) {
			return false;
		}

		this.input = this.getLines()[this.line];
		this.line += 1;
		this.char = 1;
		this.from = 1;

		char = this.scanMixedSpacesAndTabs();
		if (char >= 0) {
			this.trigger("warning", { code: "W099", line: this.line, character: char + 1 });
		}

		this.input = this.input.replace(/\t/g, state.tab);
		char = this.scanUnsafeChars();

		if (char >= 0) {
			this.trigger("warning", { code: "W100", line: this.line, character: char });
		}

		// If there is a limit on line length, warn when lines get too
		// long.

		if (state.option.maxlen && state.option.maxlen < this.input.length) {
			this.trigger("warning", { code: "W101", line: this.line, character: this.input.length });
		}

		return true;
	},

	/*
	 * This is simply a synonym for nextLine() method with a friendlier
	 * public name.
	 */
	start: function () {
		this.nextLine();
	},

	/*
	 * Produce the next token. This function is called by advance() to get
	 * the next token. It returns a token in a JSLint-compatible format.
	 */
	token: function () {
		/*jshint loopfunc:true */
		var checks = asyncTrigger();
		var token;


		function isReserved(token, isProperty) {
			if (!token.reserved) {
				return false;
			}
			var meta = token.meta;

			if (meta && meta.isFutureReservedWord && state.option.inES5()) {
				// ES3 FutureReservedWord in an ES5 environment.
				if (!meta.es5) {
					return false;
				}

				// Some ES5 FutureReservedWord identifiers are active only
				// within a strict mode environment.
				if (meta.strictOnly) {
					if (!state.option.strict && !state.directive["use strict"]) {
						return false;
					}
				}

				if (isProperty) {
					return false;
				}
			}

			return true;
		}

		// Produce a token object.
		var create = function (type, value, isProperty) {
			/*jshint validthis:true */
			var obj;

			if (type !== "(endline)" && type !== "(end)") {
				this.prereg = false;
			}

			if (type === "(punctuator)") {
				switch (value) {
				case ".":
				case ")":
				case "~":
				case "#":
				case "]":
					this.prereg = false;
					break;
				default:
					this.prereg = true;
				}

				obj = Object.create(state.syntax[value] || state.syntax["(error)"]);
			}

			if (type === "(identifier)") {
				if (value === "return" || value === "case" || value === "typeof") {
					this.prereg = true;
				}

				if (_.has(state.syntax, value)) {
					obj = Object.create(state.syntax[value] || state.syntax["(error)"]);

					// If this can't be a reserved keyword, reset the object.
					if (!isReserved(obj, isProperty && type === "(identifier)")) {
						obj = null;
					}
				}
			}

			if (!obj) {
				obj = Object.create(state.syntax[type]);
			}

			obj.identifier = (type === "(identifier)");
			obj.type = obj.type || type;
			obj.value = value;
			obj.line = this.line;
			obj.character = this.char;
			obj.from = this.from;

			if (isProperty && obj.identifier) {
				obj.isProperty = isProperty;
			}

			obj.check = checks.check;

			return obj;
		}.bind(this);

		for (;;) {
			if (!this.input.length) {
				return create(this.nextLine() ? "(endline)" : "(end)", "");
			}

			token = this.next(checks);

			if (!token) {
				if (this.input.length) {
					// Unexpected character.
					this.trigger("error", {
						code: "E024",
						line: this.line,
						character: this.char,
						data: [ this.peek() ]
					});

					this.input = "";
				}

				continue;
			}

			switch (token.type) {
			case Token.StringLiteral:
				this.triggerAsync("String", {
					line: this.line,
					char: this.char,
					from: this.from,
					value: token.value,
					quote: token.quote
				}, checks, function () { return true; });

				return create("(string)", token.value);
			case Token.Identifier:
				this.trigger("Identifier", {
					line: this.line,
					char: this.char,
					from: this.form,
					name: token.value,
					isProperty: state.tokens.curr.id === "."
				});

				/* falls through */
			case Token.Keyword:
			case Token.NullLiteral:
			case Token.BooleanLiteral:
				return create("(identifier)", token.value, state.tokens.curr.id === ".");

			case Token.NumericLiteral:
				if (token.isMalformed) {
					this.trigger("warning", {
						code: "W045",
						line: this.line,
						character: this.char,
						data: [ token.value ]
					});
				}

				this.triggerAsync("warning", {
					code: "W114",
					line: this.line,
					character: this.char,
					data: [ "0x-" ]
				}, checks, function () { return token.base === 16 && state.jsonMode; });

				this.triggerAsync("warning", {
					code: "W115",
					line: this.line,
					character: this.char
				}, checks, function () {
					return state.directive["use strict"] && token.base === 8; 
				});

				this.trigger("Number", {
					line: this.line,
					char: this.char,
					from: this.from,
					value: token.value,
					base: token.base,
					isMalformed: token.malformed
				});

				return create("(number)", token.value);

			case Token.RegExp:
				return create("(regexp)", token.value);

			case Token.Comment:
				state.tokens.curr.comment = true;

				if (token.isSpecial) {
					return {
						value: token.value,
						body: token.body,
						type: token.commentType,
						isSpecial: token.isSpecial,
						line: this.line,
						character: this.char,
						from: this.from
					};
				}

				break;

			case "":
				break;

			default:
				return create("(punctuator)", token.value);
			}
		}
	}
};

exports.Lexer = Lexer;

})()
},{"events":2,"./state.js":6,"./reg.js":4,"underscore":10}],9:[function(require,module,exports){
(function(global){/*global window, global*/
var util = require("util")
var assert = require("assert")

var slice = Array.prototype.slice
var console
var times = {}

if (typeof global !== "undefined" && global.console) {
    console = global.console
} else if (typeof window !== "undefined" && window.console) {
    console = window.console
} else {
    console = window.console = {}
}

var functions = [
    [log, "log"]
    , [info, "info"]
    , [warn, "warn"]
    , [error, "error"]
    , [time, "time"]
    , [timeEnd, "timeEnd"]
    , [trace, "trace"]
    , [dir, "dir"]
    , [assert, "assert"]
]

for (var i = 0; i < functions.length; i++) {
    var tuple = functions[i]
    var f = tuple[0]
    var name = tuple[1]

    if (!console[name]) {
        console[name] = f
    }
}

module.exports = console

function log() {}

function info() {
    console.log.apply(console, arguments)
}

function warn() {
    console.log.apply(console, arguments)
}

function error() {
    console.warn.apply(console, arguments)
}

function time(label) {
    times[label] = Date.now()
}

function timeEnd(label) {
    var time = times[label]
    if (!time) {
        throw new Error("No such label: " + label)
    }

    var duration = Date.now() - time
    console.log(label + ": " + duration + "ms")
}

function trace() {
    var err = new Error()
    err.name = "Trace"
    err.message = util.format.apply(null, arguments)
    console.error(err.stack)
}

function dir(object) {
    console.log(util.inspect(object) + "\n")
}

function assert(expression) {
    if (!expression) {
        var arr = slice.call(arguments, 1)
        assert.ok(false, util.format.apply(null, arr))
    }
}

})(window)
},{"util":11,"assert":12}],10:[function(require,module,exports){
(function(){//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.4.4';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? null : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

})()
},{}],11:[function(require,module,exports){
var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\033[' + styles[style][0] + 'm' + str +
             '\033[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return ar instanceof Array ||
         Array.isArray(ar) ||
         (ar && ar !== Object.prototype && isArray(ar.__proto__));
}


function isRegExp(re) {
  return re instanceof RegExp ||
    (typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]');
}


function isDate(d) {
  if (d instanceof Date) return true;
  if (typeof d !== 'object') return false;
  var properties = Date.prototype && Object_getOwnPropertyNames(Date.prototype);
  var proto = d.__proto__ && Object_getOwnPropertyNames(d.__proto__);
  return JSON.stringify(proto) === JSON.stringify(properties);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":2}],12:[function(require,module,exports){
(function(){// UTILITY
var util = require('util');
var Buffer = require("buffer").Buffer;
var pSlice = Array.prototype.slice;

function objectKeys(object) {
  if (Object.keys) return Object.keys(object);
  var result = [];
  for (var name in object) {
    if (Object.prototype.hasOwnProperty.call(object, name)) {
      result.push(name);
    }
  }
  return result;
}

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.message = options.message;
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
};
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (value === undefined) {
    return '' + value;
  }
  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (typeof value === 'function' || value instanceof RegExp) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (typeof s == 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

assert.AssertionError.prototype.toString = function() {
  if (this.message) {
    return [this.name + ':', this.message].join(' ');
  } else {
    return [
      this.name + ':',
      truncate(JSON.stringify(this.actual, replacer), 128),
      this.operator,
      truncate(JSON.stringify(this.expected, replacer), 128)
    ].join(' ');
  }
};

// assert.AssertionError instanceof Error

assert.AssertionError.__proto__ = Error.prototype;

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!!!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (expected instanceof RegExp) {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail('Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail('Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

})()
},{"util":11,"buffer":13}],14:[function(require,module,exports){
exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],13:[function(require,module,exports){
(function(){function SlowBuffer (size) {
    this.length = size;
};

var assert = require('assert');

exports.INSPECT_MAX_BYTES = 50;


function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return require("base64-js").toByteArray(str);
}

SlowBuffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
    case 'binary':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

SlowBuffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

SlowBuffer.prototype.binaryWrite = SlowBuffer.prototype.asciiWrite;

SlowBuffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return require("base64-js").fromByteArray(bytes);
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

SlowBuffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

SlowBuffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

SlowBuffer.prototype.binarySlice = SlowBuffer.prototype.asciiSlice;

SlowBuffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<SlowBuffer ' + out.join(' ') + '>';
};


SlowBuffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


SlowBuffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


SlowBuffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  SlowBuffer._charsWritten = i * 2;
  return i;
};


SlowBuffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};


// slice(start, end)
SlowBuffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;

  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  return new Buffer(this, end - start, +start);
};

SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
  var temp = [];
  for (var i=sourcestart; i<sourceend; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=targetstart; i<targetstart+temp.length; i++) {
    target[i] = temp[i-targetstart];
  }
};

SlowBuffer.prototype.fill = function(value, start, end) {
  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  for (var i = start; i < end; i++) {
    this[i] = value;
  }
}

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}


// Buffer

function Buffer(subject, encoding, offset) {
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    this.parent = subject;
    this.offset = offset;
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    if (this.length > Buffer.poolSize) {
      // Big buffer, just alloc one.
      this.parent = new SlowBuffer(this.length);
      this.offset = 0;

    } else {
      // Small buffer.
      if (!pool || pool.length - pool.used < this.length) allocPool();
      this.parent = pool;
      this.offset = pool.used;
      pool.used += this.length;
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        if (subject instanceof Buffer) {
          this.parent[i + this.offset] = subject.readUInt8(i);
        }
        else {
          this.parent[i + this.offset] = subject[i];
        }
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    }
  }

}

function isArrayIsh(subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

exports.SlowBuffer = SlowBuffer;
exports.Buffer = Buffer;

Buffer.poolSize = 8 * 1024;
var pool;

function allocPool() {
  pool = new SlowBuffer(Buffer.poolSize);
  pool.used = 0;
}


// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof SlowBuffer;
};

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

// Inspect
Buffer.prototype.inspect = function inspect() {
  var out = [],
      len = this.length;

  for (var i = 0; i < len; i++) {
    out[i] = toHex(this.parent[i + this.offset]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }

  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i];
};


Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i] = v;
};


// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = this.parent.hexWrite(string, this.offset + offset, length);
      break;

    case 'utf8':
    case 'utf-8':
      ret = this.parent.utf8Write(string, this.offset + offset, length);
      break;

    case 'ascii':
      ret = this.parent.asciiWrite(string, this.offset + offset, length);
      break;

    case 'binary':
      ret = this.parent.binaryWrite(string, this.offset + offset, length);
      break;

    case 'base64':
      // Warning: maxLength not taken into account in base64Write
      ret = this.parent.base64Write(string, this.offset + offset, length);
      break;

    case 'ucs2':
    case 'ucs-2':
      ret = this.parent.ucs2Write(string, this.offset + offset, length);
      break;

    default:
      throw new Error('Unknown encoding');
  }

  Buffer._charsWritten = SlowBuffer._charsWritten;

  return ret;
};


// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();

  if (typeof start == 'undefined' || start < 0) {
    start = 0;
  } else if (start > this.length) {
    start = this.length;
  }

  if (typeof end == 'undefined' || end > this.length) {
    end = this.length;
  } else if (end < 0) {
    end = 0;
  }

  start = start + this.offset;
  end = end + this.offset;

  switch (encoding) {
    case 'hex':
      return this.parent.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.parent.utf8Slice(start, end);

    case 'ascii':
      return this.parent.asciiSlice(start, end);

    case 'binary':
      return this.parent.binarySlice(start, end);

    case 'base64':
      return this.parent.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.parent.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


// byteLength
Buffer.byteLength = SlowBuffer.byteLength;


// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  return this.parent.fill(value,
                          start + this.offset,
                          end + this.offset);
};


// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  end || (end = this.length);
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  return this.parent.copy(target.parent,
                          target_start + target.offset,
                          start + this.offset,
                          end + this.offset);
};


// slice(start, end)
Buffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;
  if (end > this.length) throw new Error('oob');
  if (start > end) throw new Error('oob');

  return new Buffer(this.parent, end - start, +start + this.offset);
};


// Legacy methods for backwards compatibility.

Buffer.prototype.utf8Slice = function(start, end) {
  return this.toString('utf8', start, end);
};

Buffer.prototype.binarySlice = function(start, end) {
  return this.toString('binary', start, end);
};

Buffer.prototype.asciiSlice = function(start, end) {
  return this.toString('ascii', start, end);
};

Buffer.prototype.utf8Write = function(string, offset) {
  return this.write(string, offset, 'utf8');
};

Buffer.prototype.binaryWrite = function(string, offset) {
  return this.write(string, offset, 'binary');
};

Buffer.prototype.asciiWrite = function(string, offset) {
  return this.write(string, offset, 'ascii');
};

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  return buffer.parent[buffer.offset + offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset] << 8;
    if (offset + 1 < buffer.length) {
      val |= buffer.parent[buffer.offset + offset + 1];
    }
  } else {
    val = buffer.parent[buffer.offset + offset];
    if (offset + 1 < buffer.length) {
      val |= buffer.parent[buffer.offset + offset + 1] << 8;
    }
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    if (offset + 1 < buffer.length)
      val = buffer.parent[buffer.offset + offset + 1] << 16;
    if (offset + 2 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 2] << 8;
    if (offset + 3 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 3];
    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
  } else {
    if (offset + 2 < buffer.length)
      val = buffer.parent[buffer.offset + offset + 2] << 16;
    if (offset + 1 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 1] << 8;
    val |= buffer.parent[buffer.offset + offset];
    if (offset + 3 < buffer.length)
      val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  neg = buffer.parent[buffer.offset + offset] & 0x80;
  if (!neg) {
    return (buffer.parent[buffer.offset + offset]);
  }

  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  if (offset < buffer.length) {
    buffer.parent[buffer.offset + offset] = value;
  }
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 2); i++) {
    buffer.parent[buffer.offset + offset + i] =
        (value & (0xff << (8 * (isBigEndian ? 1 - i : i)))) >>>
            (isBigEndian ? 1 - i : i) * 8;
  }

}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 4); i++) {
    buffer.parent[buffer.offset + offset + i] =
        (value >>> (isBigEndian ? 3 - i : i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;

})()
},{"assert":12,"./buffer_ieee754":14,"base64-js":15}],15:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}]},{},["E/GbHF"])
;
JSHINT = require('jshint').JSHINT;
}());