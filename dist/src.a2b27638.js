// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"node_modules/ieee754/index.js":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"node_modules/base64-js/index.js","ieee754":"node_modules/ieee754/index.js","isarray":"node_modules/isarray/index.js","buffer":"node_modules/buffer/index.js"}],"node_modules/docx/build/index.js":[function(require,module,exports) {
var define;
var Buffer = require("buffer").Buffer;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return { value: void 0, done: !0 }; } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable || "" === iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } throw new TypeError(_typeof(iterable) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e22) { throw _e22; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e23) { didErr = true; err = _e23; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/*! For license information please see index.js.LICENSE.txt */
!function (e, t) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.docx = t() : e.docx = t();
}(this, function () {
  return function () {
    var e = {
        9742: function _(e, t) {
          "use strict";

          t.byteLength = function (e) {
            var t = u(e),
              r = t[0],
              n = t[1];
            return 3 * (r + n) / 4 - n;
          }, t.toByteArray = function (e) {
            var t,
              r,
              i = u(e),
              s = i[0],
              a = i[1],
              c = new o(function (e, t, r) {
                return 3 * (t + r) / 4 - r;
              }(0, s, a)),
              l = 0,
              p = a > 0 ? s - 4 : s;
            for (r = 0; r < p; r += 4) t = n[e.charCodeAt(r)] << 18 | n[e.charCodeAt(r + 1)] << 12 | n[e.charCodeAt(r + 2)] << 6 | n[e.charCodeAt(r + 3)], c[l++] = t >> 16 & 255, c[l++] = t >> 8 & 255, c[l++] = 255 & t;
            return 2 === a && (t = n[e.charCodeAt(r)] << 2 | n[e.charCodeAt(r + 1)] >> 4, c[l++] = 255 & t), 1 === a && (t = n[e.charCodeAt(r)] << 10 | n[e.charCodeAt(r + 1)] << 4 | n[e.charCodeAt(r + 2)] >> 2, c[l++] = t >> 8 & 255, c[l++] = 255 & t), c;
          }, t.fromByteArray = function (e) {
            for (var t, n = e.length, o = n % 3, i = [], s = 16383, a = 0, u = n - o; a < u; a += s) i.push(c(e, a, a + s > u ? u : a + s));
            return 1 === o ? (t = e[n - 1], i.push(r[t >> 2] + r[t << 4 & 63] + "==")) : 2 === o && (t = (e[n - 2] << 8) + e[n - 1], i.push(r[t >> 10] + r[t >> 4 & 63] + r[t << 2 & 63] + "=")), i.join("");
          };
          for (var r = [], n = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, a = i.length; s < a; ++s) r[s] = i[s], n[i.charCodeAt(s)] = s;
          function u(e) {
            var t = e.length;
            if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
            var r = e.indexOf("=");
            return -1 === r && (r = t), [r, r === t ? 0 : 4 - r % 4];
          }
          function c(e, t, n) {
            for (var o, i, s = [], a = t; a < n; a += 3) o = (e[a] << 16 & 16711680) + (e[a + 1] << 8 & 65280) + (255 & e[a + 2]), s.push(r[(i = o) >> 18 & 63] + r[i >> 12 & 63] + r[i >> 6 & 63] + r[63 & i]);
            return s.join("");
          }
          n["-".charCodeAt(0)] = 62, n["_".charCodeAt(0)] = 63;
        },
        8764: function _(e, t, r) {
          "use strict";

          var n = r(9742),
            o = r(645),
            i = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
          t.Buffer = u, t.SlowBuffer = function (e) {
            return +e != e && (e = 0), u.alloc(+e);
          }, t.INSPECT_MAX_BYTES = 50;
          var s = 2147483647;
          function a(e) {
            if (e > s) throw new RangeError('The value "' + e + '" is invalid for option "size"');
            var t = new Uint8Array(e);
            return Object.setPrototypeOf(t, u.prototype), t;
          }
          function u(e, t, r) {
            if ("number" == typeof e) {
              if ("string" == typeof t) throw new TypeError('The "string" argument must be of type string. Received type number');
              return p(e);
            }
            return c(e, t, r);
          }
          function c(e, t, r) {
            if ("string" == typeof e) return function (e, t) {
              if ("string" == typeof t && "" !== t || (t = "utf8"), !u.isEncoding(t)) throw new TypeError("Unknown encoding: " + t);
              var r = 0 | m(e, t);
              var n = a(r);
              var o = n.write(e, t);
              return o !== r && (n = n.slice(0, o)), n;
            }(e, t);
            if (ArrayBuffer.isView(e)) return function (e) {
              if ($(e, Uint8Array)) {
                var _t = new Uint8Array(e);
                return d(_t.buffer, _t.byteOffset, _t.byteLength);
              }
              return h(e);
            }(e);
            if (null == e) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + _typeof(e));
            if ($(e, ArrayBuffer) || e && $(e.buffer, ArrayBuffer)) return d(e, t, r);
            if ("undefined" != typeof SharedArrayBuffer && ($(e, SharedArrayBuffer) || e && $(e.buffer, SharedArrayBuffer))) return d(e, t, r);
            if ("number" == typeof e) throw new TypeError('The "value" argument must not be of type number. Received type number');
            var n = e.valueOf && e.valueOf();
            if (null != n && n !== e) return u.from(n, t, r);
            var o = function (e) {
              if (u.isBuffer(e)) {
                var _t2 = 0 | f(e.length),
                  _r = a(_t2);
                return 0 === _r.length || e.copy(_r, 0, 0, _t2), _r;
              }
              return void 0 !== e.length ? "number" != typeof e.length || Z(e.length) ? a(0) : h(e) : "Buffer" === e.type && Array.isArray(e.data) ? h(e.data) : void 0;
            }(e);
            if (o) return o;
            if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive]) return u.from(e[Symbol.toPrimitive]("string"), t, r);
            throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + _typeof(e));
          }
          function l(e) {
            if ("number" != typeof e) throw new TypeError('"size" argument must be of type number');
            if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"');
          }
          function p(e) {
            return l(e), a(e < 0 ? 0 : 0 | f(e));
          }
          function h(e) {
            var t = e.length < 0 ? 0 : 0 | f(e.length),
              r = a(t);
            for (var _n = 0; _n < t; _n += 1) r[_n] = 255 & e[_n];
            return r;
          }
          function d(e, t, r) {
            if (t < 0 || e.byteLength < t) throw new RangeError('"offset" is outside of buffer bounds');
            if (e.byteLength < t + (r || 0)) throw new RangeError('"length" is outside of buffer bounds');
            var n;
            return n = void 0 === t && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e, t) : new Uint8Array(e, t, r), Object.setPrototypeOf(n, u.prototype), n;
          }
          function f(e) {
            if (e >= s) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s.toString(16) + " bytes");
            return 0 | e;
          }
          function m(e, t) {
            if (u.isBuffer(e)) return e.length;
            if (ArrayBuffer.isView(e) || $(e, ArrayBuffer)) return e.byteLength;
            if ("string" != typeof e) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + _typeof(e));
            var r = e.length,
              n = arguments.length > 2 && !0 === arguments[2];
            if (!n && 0 === r) return 0;
            var o = !1;
            for (;;) switch (t) {
              case "ascii":
              case "latin1":
              case "binary":
                return r;
              case "utf8":
              case "utf-8":
                return V(e).length;
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return 2 * r;
              case "hex":
                return r >>> 1;
              case "base64":
                return K(e).length;
              default:
                if (o) return n ? -1 : V(e).length;
                t = ("" + t).toLowerCase(), o = !0;
            }
          }
          function g(e, t, r) {
            var n = !1;
            if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
            if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
            if ((r >>>= 0) <= (t >>>= 0)) return "";
            for (e || (e = "utf8");;) switch (e) {
              case "hex":
                return R(this, t, r);
              case "utf8":
              case "utf-8":
                return S(this, t, r);
              case "ascii":
                return P(this, t, r);
              case "latin1":
              case "binary":
                return C(this, t, r);
              case "base64":
                return O(this, t, r);
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return I(this, t, r);
              default:
                if (n) throw new TypeError("Unknown encoding: " + e);
                e = (e + "").toLowerCase(), n = !0;
            }
          }
          function b(e, t, r) {
            var n = e[t];
            e[t] = e[r], e[r] = n;
          }
          function y(e, t, r, n, o) {
            if (0 === e.length) return -1;
            if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), Z(r = +r) && (r = o ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
              if (o) return -1;
              r = e.length - 1;
            } else if (r < 0) {
              if (!o) return -1;
              r = 0;
            }
            if ("string" == typeof t && (t = u.from(t, n)), u.isBuffer(t)) return 0 === t.length ? -1 : w(e, t, r, n, o);
            if ("number" == typeof t) return t &= 255, "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : w(e, [t], r, n, o);
            throw new TypeError("val must be string, number or Buffer");
          }
          function w(e, t, r, n, o) {
            var i,
              s = 1,
              a = e.length,
              u = t.length;
            if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
              if (e.length < 2 || t.length < 2) return -1;
              s = 2, a /= 2, u /= 2, r /= 2;
            }
            function c(e, t) {
              return 1 === s ? e[t] : e.readUInt16BE(t * s);
            }
            if (o) {
              var _n2 = -1;
              for (i = r; i < a; i++) if (c(e, i) === c(t, -1 === _n2 ? 0 : i - _n2)) {
                if (-1 === _n2 && (_n2 = i), i - _n2 + 1 === u) return _n2 * s;
              } else -1 !== _n2 && (i -= i - _n2), _n2 = -1;
            } else for (r + u > a && (r = a - u), i = r; i >= 0; i--) {
              var _r2 = !0;
              for (var _n3 = 0; _n3 < u; _n3++) if (c(e, i + _n3) !== c(t, _n3)) {
                _r2 = !1;
                break;
              }
              if (_r2) return i;
            }
            return -1;
          }
          function v(e, t, r, n) {
            r = Number(r) || 0;
            var o = e.length - r;
            n ? (n = Number(n)) > o && (n = o) : n = o;
            var i = t.length;
            var s;
            for (n > i / 2 && (n = i / 2), s = 0; s < n; ++s) {
              var _n4 = parseInt(t.substr(2 * s, 2), 16);
              if (Z(_n4)) return s;
              e[r + s] = _n4;
            }
            return s;
          }
          function _(e, t, r, n) {
            return q(V(t, e.length - r), e, r, n);
          }
          function x(e, t, r, n) {
            return q(function (e) {
              var t = [];
              for (var _r3 = 0; _r3 < e.length; ++_r3) t.push(255 & e.charCodeAt(_r3));
              return t;
            }(t), e, r, n);
          }
          function E(e, t, r, n) {
            return q(K(t), e, r, n);
          }
          function T(e, t, r, n) {
            return q(function (e, t) {
              var r, n, o;
              var i = [];
              for (var _s = 0; _s < e.length && !((t -= 2) < 0); ++_s) r = e.charCodeAt(_s), n = r >> 8, o = r % 256, i.push(o), i.push(n);
              return i;
            }(t, e.length - r), e, r, n);
          }
          function O(e, t, r) {
            return 0 === t && r === e.length ? n.fromByteArray(e) : n.fromByteArray(e.slice(t, r));
          }
          function S(e, t, r) {
            r = Math.min(e.length, r);
            var n = [];
            var o = t;
            for (; o < r;) {
              var _t3 = e[o];
              var _i = null,
                _s2 = _t3 > 239 ? 4 : _t3 > 223 ? 3 : _t3 > 191 ? 2 : 1;
              if (o + _s2 <= r) {
                var _r4 = void 0,
                  _n5 = void 0,
                  _a = void 0,
                  _u = void 0;
                switch (_s2) {
                  case 1:
                    _t3 < 128 && (_i = _t3);
                    break;
                  case 2:
                    _r4 = e[o + 1], 128 == (192 & _r4) && (_u = (31 & _t3) << 6 | 63 & _r4, _u > 127 && (_i = _u));
                    break;
                  case 3:
                    _r4 = e[o + 1], _n5 = e[o + 2], 128 == (192 & _r4) && 128 == (192 & _n5) && (_u = (15 & _t3) << 12 | (63 & _r4) << 6 | 63 & _n5, _u > 2047 && (_u < 55296 || _u > 57343) && (_i = _u));
                    break;
                  case 4:
                    _r4 = e[o + 1], _n5 = e[o + 2], _a = e[o + 3], 128 == (192 & _r4) && 128 == (192 & _n5) && 128 == (192 & _a) && (_u = (15 & _t3) << 18 | (63 & _r4) << 12 | (63 & _n5) << 6 | 63 & _a, _u > 65535 && _u < 1114112 && (_i = _u));
                }
              }
              null === _i ? (_i = 65533, _s2 = 1) : _i > 65535 && (_i -= 65536, n.push(_i >>> 10 & 1023 | 55296), _i = 56320 | 1023 & _i), n.push(_i), o += _s2;
            }
            return function (e) {
              var t = e.length;
              if (t <= A) return String.fromCharCode.apply(String, e);
              var r = "",
                n = 0;
              for (; n < t;) r += String.fromCharCode.apply(String, e.slice(n, n += A));
              return r;
            }(n);
          }
          t.kMaxLength = s, u.TYPED_ARRAY_SUPPORT = function () {
            try {
              var _e = new Uint8Array(1),
                _t4 = {
                  foo: function foo() {
                    return 42;
                  }
                };
              return Object.setPrototypeOf(_t4, Uint8Array.prototype), Object.setPrototypeOf(_e, _t4), 42 === _e.foo();
            } catch (e) {
              return !1;
            }
          }(), u.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(u.prototype, "parent", {
            enumerable: !0,
            get: function get() {
              if (u.isBuffer(this)) return this.buffer;
            }
          }), Object.defineProperty(u.prototype, "offset", {
            enumerable: !0,
            get: function get() {
              if (u.isBuffer(this)) return this.byteOffset;
            }
          }), u.poolSize = 8192, u.from = function (e, t, r) {
            return c(e, t, r);
          }, Object.setPrototypeOf(u.prototype, Uint8Array.prototype), Object.setPrototypeOf(u, Uint8Array), u.alloc = function (e, t, r) {
            return function (e, t, r) {
              return l(e), e <= 0 ? a(e) : void 0 !== t ? "string" == typeof r ? a(e).fill(t, r) : a(e).fill(t) : a(e);
            }(e, t, r);
          }, u.allocUnsafe = function (e) {
            return p(e);
          }, u.allocUnsafeSlow = function (e) {
            return p(e);
          }, u.isBuffer = function (e) {
            return null != e && !0 === e._isBuffer && e !== u.prototype;
          }, u.compare = function (e, t) {
            if ($(e, Uint8Array) && (e = u.from(e, e.offset, e.byteLength)), $(t, Uint8Array) && (t = u.from(t, t.offset, t.byteLength)), !u.isBuffer(e) || !u.isBuffer(t)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
            if (e === t) return 0;
            var r = e.length,
              n = t.length;
            for (var _o = 0, _i2 = Math.min(r, n); _o < _i2; ++_o) if (e[_o] !== t[_o]) {
              r = e[_o], n = t[_o];
              break;
            }
            return r < n ? -1 : n < r ? 1 : 0;
          }, u.isEncoding = function (e) {
            switch (String(e).toLowerCase()) {
              case "hex":
              case "utf8":
              case "utf-8":
              case "ascii":
              case "latin1":
              case "binary":
              case "base64":
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return !0;
              default:
                return !1;
            }
          }, u.concat = function (e, t) {
            if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
            if (0 === e.length) return u.alloc(0);
            var r;
            if (void 0 === t) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
            var n = u.allocUnsafe(t);
            var o = 0;
            for (r = 0; r < e.length; ++r) {
              var _t5 = e[r];
              if ($(_t5, Uint8Array)) o + _t5.length > n.length ? (u.isBuffer(_t5) || (_t5 = u.from(_t5)), _t5.copy(n, o)) : Uint8Array.prototype.set.call(n, _t5, o);else {
                if (!u.isBuffer(_t5)) throw new TypeError('"list" argument must be an Array of Buffers');
                _t5.copy(n, o);
              }
              o += _t5.length;
            }
            return n;
          }, u.byteLength = m, u.prototype._isBuffer = !0, u.prototype.swap16 = function () {
            var e = this.length;
            if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
            for (var _t6 = 0; _t6 < e; _t6 += 2) b(this, _t6, _t6 + 1);
            return this;
          }, u.prototype.swap32 = function () {
            var e = this.length;
            if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
            for (var _t7 = 0; _t7 < e; _t7 += 4) b(this, _t7, _t7 + 3), b(this, _t7 + 1, _t7 + 2);
            return this;
          }, u.prototype.swap64 = function () {
            var e = this.length;
            if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
            for (var _t8 = 0; _t8 < e; _t8 += 8) b(this, _t8, _t8 + 7), b(this, _t8 + 1, _t8 + 6), b(this, _t8 + 2, _t8 + 5), b(this, _t8 + 3, _t8 + 4);
            return this;
          }, u.prototype.toString = function () {
            var e = this.length;
            return 0 === e ? "" : 0 === arguments.length ? S(this, 0, e) : g.apply(this, arguments);
          }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function (e) {
            if (!u.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
            return this === e || 0 === u.compare(this, e);
          }, u.prototype.inspect = function () {
            var e = "";
            var r = t.INSPECT_MAX_BYTES;
            return e = this.toString("hex", 0, r).replace(/(.{2})/g, "$1 ").trim(), this.length > r && (e += " ... "), "<Buffer " + e + ">";
          }, i && (u.prototype[i] = u.prototype.inspect), u.prototype.compare = function (e, t, r, n, o) {
            if ($(e, Uint8Array) && (e = u.from(e, e.offset, e.byteLength)), !u.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + _typeof(e));
            if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === o && (o = this.length), t < 0 || r > e.length || n < 0 || o > this.length) throw new RangeError("out of range index");
            if (n >= o && t >= r) return 0;
            if (n >= o) return -1;
            if (t >= r) return 1;
            if (this === e) return 0;
            var i = (o >>>= 0) - (n >>>= 0),
              s = (r >>>= 0) - (t >>>= 0);
            var a = Math.min(i, s),
              c = this.slice(n, o),
              l = e.slice(t, r);
            for (var _e2 = 0; _e2 < a; ++_e2) if (c[_e2] !== l[_e2]) {
              i = c[_e2], s = l[_e2];
              break;
            }
            return i < s ? -1 : s < i ? 1 : 0;
          }, u.prototype.includes = function (e, t, r) {
            return -1 !== this.indexOf(e, t, r);
          }, u.prototype.indexOf = function (e, t, r) {
            return y(this, e, t, r, !0);
          }, u.prototype.lastIndexOf = function (e, t, r) {
            return y(this, e, t, r, !1);
          }, u.prototype.write = function (e, t, r, n) {
            if (void 0 === t) n = "utf8", r = this.length, t = 0;else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;else {
              if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
              t >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0);
            }
            var o = this.length - t;
            if ((void 0 === r || r > o) && (r = o), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
            n || (n = "utf8");
            var i = !1;
            for (;;) switch (n) {
              case "hex":
                return v(this, e, t, r);
              case "utf8":
              case "utf-8":
                return _(this, e, t, r);
              case "ascii":
              case "latin1":
              case "binary":
                return x(this, e, t, r);
              case "base64":
                return E(this, e, t, r);
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return T(this, e, t, r);
              default:
                if (i) throw new TypeError("Unknown encoding: " + n);
                n = ("" + n).toLowerCase(), i = !0;
            }
          }, u.prototype.toJSON = function () {
            return {
              type: "Buffer",
              data: Array.prototype.slice.call(this._arr || this, 0)
            };
          };
          var A = 4096;
          function P(e, t, r) {
            var n = "";
            r = Math.min(e.length, r);
            for (var _o2 = t; _o2 < r; ++_o2) n += String.fromCharCode(127 & e[_o2]);
            return n;
          }
          function C(e, t, r) {
            var n = "";
            r = Math.min(e.length, r);
            for (var _o3 = t; _o3 < r; ++_o3) n += String.fromCharCode(e[_o3]);
            return n;
          }
          function R(e, t, r) {
            var n = e.length;
            (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
            var o = "";
            for (var _n6 = t; _n6 < r; ++_n6) o += Y[e[_n6]];
            return o;
          }
          function I(e, t, r) {
            var n = e.slice(t, r);
            var o = "";
            for (var _e3 = 0; _e3 < n.length - 1; _e3 += 2) o += String.fromCharCode(n[_e3] + 256 * n[_e3 + 1]);
            return o;
          }
          function N(e, t, r) {
            if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
            if (e + t > r) throw new RangeError("Trying to access beyond buffer length");
          }
          function M(e, t, r, n, o, i) {
            if (!u.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
            if (t > o || t < i) throw new RangeError('"value" argument is out of bounds');
            if (r + n > e.length) throw new RangeError("Index out of range");
          }
          function k(e, t, r, n, o) {
            H(t, n, o, e, r, 7);
            var i = Number(t & BigInt(4294967295));
            e[r++] = i, i >>= 8, e[r++] = i, i >>= 8, e[r++] = i, i >>= 8, e[r++] = i;
            var s = Number(t >> BigInt(32) & BigInt(4294967295));
            return e[r++] = s, s >>= 8, e[r++] = s, s >>= 8, e[r++] = s, s >>= 8, e[r++] = s, r;
          }
          function D(e, t, r, n, o) {
            H(t, n, o, e, r, 7);
            var i = Number(t & BigInt(4294967295));
            e[r + 7] = i, i >>= 8, e[r + 6] = i, i >>= 8, e[r + 5] = i, i >>= 8, e[r + 4] = i;
            var s = Number(t >> BigInt(32) & BigInt(4294967295));
            return e[r + 3] = s, s >>= 8, e[r + 2] = s, s >>= 8, e[r + 1] = s, s >>= 8, e[r] = s, r + 8;
          }
          function j(e, t, r, n, o, i) {
            if (r + n > e.length) throw new RangeError("Index out of range");
            if (r < 0) throw new RangeError("Index out of range");
          }
          function F(e, t, r, n, i) {
            return t = +t, r >>>= 0, i || j(e, 0, r, 4), o.write(e, t, r, n, 23, 4), r + 4;
          }
          function B(e, t, r, n, i) {
            return t = +t, r >>>= 0, i || j(e, 0, r, 8), o.write(e, t, r, n, 52, 8), r + 8;
          }
          u.prototype.slice = function (e, t) {
            var r = this.length;
            (e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e);
            var n = this.subarray(e, t);
            return Object.setPrototypeOf(n, u.prototype), n;
          }, u.prototype.readUintLE = u.prototype.readUIntLE = function (e, t, r) {
            e >>>= 0, t >>>= 0, r || N(e, t, this.length);
            var n = this[e],
              o = 1,
              i = 0;
            for (; ++i < t && (o *= 256);) n += this[e + i] * o;
            return n;
          }, u.prototype.readUintBE = u.prototype.readUIntBE = function (e, t, r) {
            e >>>= 0, t >>>= 0, r || N(e, t, this.length);
            var n = this[e + --t],
              o = 1;
            for (; t > 0 && (o *= 256);) n += this[e + --t] * o;
            return n;
          }, u.prototype.readUint8 = u.prototype.readUInt8 = function (e, t) {
            return e >>>= 0, t || N(e, 1, this.length), this[e];
          }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function (e, t) {
            return e >>>= 0, t || N(e, 2, this.length), this[e] | this[e + 1] << 8;
          }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function (e, t) {
            return e >>>= 0, t || N(e, 2, this.length), this[e] << 8 | this[e + 1];
          }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function (e, t) {
            return e >>>= 0, t || N(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
          }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function (e, t) {
            return e >>>= 0, t || N(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
          }, u.prototype.readBigUInt64LE = Q(function (e) {
            z(e >>>= 0, "offset");
            var t = this[e],
              r = this[e + 7];
            void 0 !== t && void 0 !== r || G(e, this.length - 8);
            var n = t + 256 * this[++e] + 65536 * this[++e] + this[++e] * Math.pow(2, 24),
              o = this[++e] + 256 * this[++e] + 65536 * this[++e] + r * Math.pow(2, 24);
            return BigInt(n) + (BigInt(o) << BigInt(32));
          }), u.prototype.readBigUInt64BE = Q(function (e) {
            z(e >>>= 0, "offset");
            var t = this[e],
              r = this[e + 7];
            void 0 !== t && void 0 !== r || G(e, this.length - 8);
            var n = t * Math.pow(2, 24) + 65536 * this[++e] + 256 * this[++e] + this[++e],
              o = this[++e] * Math.pow(2, 24) + 65536 * this[++e] + 256 * this[++e] + r;
            return (BigInt(n) << BigInt(32)) + BigInt(o);
          }), u.prototype.readIntLE = function (e, t, r) {
            e >>>= 0, t >>>= 0, r || N(e, t, this.length);
            var n = this[e],
              o = 1,
              i = 0;
            for (; ++i < t && (o *= 256);) n += this[e + i] * o;
            return o *= 128, n >= o && (n -= Math.pow(2, 8 * t)), n;
          }, u.prototype.readIntBE = function (e, t, r) {
            e >>>= 0, t >>>= 0, r || N(e, t, this.length);
            var n = t,
              o = 1,
              i = this[e + --n];
            for (; n > 0 && (o *= 256);) i += this[e + --n] * o;
            return o *= 128, i >= o && (i -= Math.pow(2, 8 * t)), i;
          }, u.prototype.readInt8 = function (e, t) {
            return e >>>= 0, t || N(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
          }, u.prototype.readInt16LE = function (e, t) {
            e >>>= 0, t || N(e, 2, this.length);
            var r = this[e] | this[e + 1] << 8;
            return 32768 & r ? 4294901760 | r : r;
          }, u.prototype.readInt16BE = function (e, t) {
            e >>>= 0, t || N(e, 2, this.length);
            var r = this[e + 1] | this[e] << 8;
            return 32768 & r ? 4294901760 | r : r;
          }, u.prototype.readInt32LE = function (e, t) {
            return e >>>= 0, t || N(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
          }, u.prototype.readInt32BE = function (e, t) {
            return e >>>= 0, t || N(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
          }, u.prototype.readBigInt64LE = Q(function (e) {
            z(e >>>= 0, "offset");
            var t = this[e],
              r = this[e + 7];
            void 0 !== t && void 0 !== r || G(e, this.length - 8);
            var n = this[e + 4] + 256 * this[e + 5] + 65536 * this[e + 6] + (r << 24);
            return (BigInt(n) << BigInt(32)) + BigInt(t + 256 * this[++e] + 65536 * this[++e] + this[++e] * Math.pow(2, 24));
          }), u.prototype.readBigInt64BE = Q(function (e) {
            z(e >>>= 0, "offset");
            var t = this[e],
              r = this[e + 7];
            void 0 !== t && void 0 !== r || G(e, this.length - 8);
            var n = (t << 24) + 65536 * this[++e] + 256 * this[++e] + this[++e];
            return (BigInt(n) << BigInt(32)) + BigInt(this[++e] * Math.pow(2, 24) + 65536 * this[++e] + 256 * this[++e] + r);
          }), u.prototype.readFloatLE = function (e, t) {
            return e >>>= 0, t || N(e, 4, this.length), o.read(this, e, !0, 23, 4);
          }, u.prototype.readFloatBE = function (e, t) {
            return e >>>= 0, t || N(e, 4, this.length), o.read(this, e, !1, 23, 4);
          }, u.prototype.readDoubleLE = function (e, t) {
            return e >>>= 0, t || N(e, 8, this.length), o.read(this, e, !0, 52, 8);
          }, u.prototype.readDoubleBE = function (e, t) {
            return e >>>= 0, t || N(e, 8, this.length), o.read(this, e, !1, 52, 8);
          }, u.prototype.writeUintLE = u.prototype.writeUIntLE = function (e, t, r, n) {
            e = +e, t >>>= 0, r >>>= 0, n || M(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
            var o = 1,
              i = 0;
            for (this[t] = 255 & e; ++i < r && (o *= 256);) this[t + i] = e / o & 255;
            return t + r;
          }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function (e, t, r, n) {
            e = +e, t >>>= 0, r >>>= 0, n || M(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
            var o = r - 1,
              i = 1;
            for (this[t + o] = 255 & e; --o >= 0 && (i *= 256);) this[t + o] = e / i & 255;
            return t + r;
          }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function (e, t, r) {
            return e = +e, t >>>= 0, r || M(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1;
          }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function (e, t, r) {
            return e = +e, t >>>= 0, r || M(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2;
          }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function (e, t, r) {
            return e = +e, t >>>= 0, r || M(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2;
          }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function (e, t, r) {
            return e = +e, t >>>= 0, r || M(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4;
          }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function (e, t, r) {
            return e = +e, t >>>= 0, r || M(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4;
          }, u.prototype.writeBigUInt64LE = Q(function (e) {
            var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            return k(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
          }), u.prototype.writeBigUInt64BE = Q(function (e) {
            var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            return D(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
          }), u.prototype.writeIntLE = function (e, t, r, n) {
            if (e = +e, t >>>= 0, !n) {
              var _n7 = Math.pow(2, 8 * r - 1);
              M(this, e, t, r, _n7 - 1, -_n7);
            }
            var o = 0,
              i = 1,
              s = 0;
            for (this[t] = 255 & e; ++o < r && (i *= 256);) e < 0 && 0 === s && 0 !== this[t + o - 1] && (s = 1), this[t + o] = (e / i >> 0) - s & 255;
            return t + r;
          }, u.prototype.writeIntBE = function (e, t, r, n) {
            if (e = +e, t >>>= 0, !n) {
              var _n8 = Math.pow(2, 8 * r - 1);
              M(this, e, t, r, _n8 - 1, -_n8);
            }
            var o = r - 1,
              i = 1,
              s = 0;
            for (this[t + o] = 255 & e; --o >= 0 && (i *= 256);) e < 0 && 0 === s && 0 !== this[t + o + 1] && (s = 1), this[t + o] = (e / i >> 0) - s & 255;
            return t + r;
          }, u.prototype.writeInt8 = function (e, t, r) {
            return e = +e, t >>>= 0, r || M(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1;
          }, u.prototype.writeInt16LE = function (e, t, r) {
            return e = +e, t >>>= 0, r || M(this, e, t, 2, 32767, -32768), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2;
          }, u.prototype.writeInt16BE = function (e, t, r) {
            return e = +e, t >>>= 0, r || M(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2;
          }, u.prototype.writeInt32LE = function (e, t, r) {
            return e = +e, t >>>= 0, r || M(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
          }, u.prototype.writeInt32BE = function (e, t, r) {
            return e = +e, t >>>= 0, r || M(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4;
          }, u.prototype.writeBigInt64LE = Q(function (e) {
            var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            return k(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
          }), u.prototype.writeBigInt64BE = Q(function (e) {
            var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            return D(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
          }), u.prototype.writeFloatLE = function (e, t, r) {
            return F(this, e, t, !0, r);
          }, u.prototype.writeFloatBE = function (e, t, r) {
            return F(this, e, t, !1, r);
          }, u.prototype.writeDoubleLE = function (e, t, r) {
            return B(this, e, t, !0, r);
          }, u.prototype.writeDoubleBE = function (e, t, r) {
            return B(this, e, t, !1, r);
          }, u.prototype.copy = function (e, t, r, n) {
            if (!u.isBuffer(e)) throw new TypeError("argument should be a Buffer");
            if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && n < r && (n = r), n === r) return 0;
            if (0 === e.length || 0 === this.length) return 0;
            if (t < 0) throw new RangeError("targetStart out of bounds");
            if (r < 0 || r >= this.length) throw new RangeError("Index out of range");
            if (n < 0) throw new RangeError("sourceEnd out of bounds");
            n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
            var o = n - r;
            return this === e && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(t, r, n) : Uint8Array.prototype.set.call(e, this.subarray(r, n), t), o;
          }, u.prototype.fill = function (e, t, r, n) {
            if ("string" == typeof e) {
              if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
              if ("string" == typeof n && !u.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
              if (1 === e.length) {
                var _t9 = e.charCodeAt(0);
                ("utf8" === n && _t9 < 128 || "latin1" === n) && (e = _t9);
              }
            } else "number" == typeof e ? e &= 255 : "boolean" == typeof e && (e = Number(e));
            if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
            if (r <= t) return this;
            var o;
            if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e) for (o = t; o < r; ++o) this[o] = e;else {
              var _i3 = u.isBuffer(e) ? e : u.from(e, n),
                _s3 = _i3.length;
              if (0 === _s3) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
              for (o = 0; o < r - t; ++o) this[o + t] = _i3[o % _s3];
            }
            return this;
          };
          var L = {};
          function U(e, t, r) {
            L[e] = /*#__PURE__*/function (_r5) {
              _inherits(_class, _r5);
              var _super = _createSuper(_class);
              function _class() {
                var _this;
                _classCallCheck(this, _class);
                _this = _super.call(this), Object.defineProperty(_assertThisInitialized(_this), "message", {
                  value: t.apply(_assertThisInitialized(_this), arguments),
                  writable: !0,
                  configurable: !0
                }), _this.name = "".concat(_this.name, " [").concat(e, "]"), _this.stack, delete _this.name;
                return _this;
              }
              _createClass(_class, [{
                key: "code",
                get: function get() {
                  return e;
                },
                set: function set(e) {
                  Object.defineProperty(this, "code", {
                    configurable: !0,
                    enumerable: !0,
                    value: e,
                    writable: !0
                  });
                }
              }, {
                key: "toString",
                value: function toString() {
                  return "".concat(this.name, " [").concat(e, "]: ").concat(this.message);
                }
              }]);
              return _class;
            }(r);
          }
          function X(e) {
            var t = "",
              r = e.length;
            var n = "-" === e[0] ? 1 : 0;
            for (; r >= n + 4; r -= 3) t = "_".concat(e.slice(r - 3, r)).concat(t);
            return "".concat(e.slice(0, r)).concat(t);
          }
          function H(e, t, r, n, o, i) {
            if (e > r || e < t) {
              var _n9 = "bigint" == typeof t ? "n" : "";
              var _o4;
              throw _o4 = i > 3 ? 0 === t || t === BigInt(0) ? ">= 0".concat(_n9, " and < 2").concat(_n9, " ** ").concat(8 * (i + 1)).concat(_n9) : ">= -(2".concat(_n9, " ** ").concat(8 * (i + 1) - 1).concat(_n9, ") and < 2 ** ").concat(8 * (i + 1) - 1).concat(_n9) : ">= ".concat(t).concat(_n9, " and <= ").concat(r).concat(_n9), new L.ERR_OUT_OF_RANGE("value", _o4, e);
            }
            !function (e, t, r) {
              z(t, "offset"), void 0 !== e[t] && void 0 !== e[t + r] || G(t, e.length - (r + 1));
            }(n, o, i);
          }
          function z(e, t) {
            if ("number" != typeof e) throw new L.ERR_INVALID_ARG_TYPE(t, "number", e);
          }
          function G(e, t, r) {
            if (Math.floor(e) !== e) throw z(e, r), new L.ERR_OUT_OF_RANGE(r || "offset", "an integer", e);
            if (t < 0) throw new L.ERR_BUFFER_OUT_OF_BOUNDS();
            throw new L.ERR_OUT_OF_RANGE(r || "offset", ">= ".concat(r ? 1 : 0, " and <= ").concat(t), e);
          }
          U("ERR_BUFFER_OUT_OF_BOUNDS", function (e) {
            return e ? "".concat(e, " is outside of buffer bounds") : "Attempt to access memory outside buffer bounds";
          }, RangeError), U("ERR_INVALID_ARG_TYPE", function (e, t) {
            return "The \"".concat(e, "\" argument must be of type number. Received type ").concat(_typeof(t));
          }, TypeError), U("ERR_OUT_OF_RANGE", function (e, t, r) {
            var n = "The value of \"".concat(e, "\" is out of range."),
              o = r;
            return Number.isInteger(r) && Math.abs(r) > Math.pow(2, 32) ? o = X(String(r)) : "bigint" == typeof r && (o = String(r), (r > Math.pow(BigInt(2), BigInt(32)) || r < -Math.pow(BigInt(2), BigInt(32))) && (o = X(o)), o += "n"), n += " It must be ".concat(t, ". Received ").concat(o), n;
          }, RangeError);
          var W = /[^+/0-9A-Za-z-_]/g;
          function V(e, t) {
            var r;
            t = t || 1 / 0;
            var n = e.length;
            var o = null;
            var i = [];
            for (var _s4 = 0; _s4 < n; ++_s4) {
              if (r = e.charCodeAt(_s4), r > 55295 && r < 57344) {
                if (!o) {
                  if (r > 56319) {
                    (t -= 3) > -1 && i.push(239, 191, 189);
                    continue;
                  }
                  if (_s4 + 1 === n) {
                    (t -= 3) > -1 && i.push(239, 191, 189);
                    continue;
                  }
                  o = r;
                  continue;
                }
                if (r < 56320) {
                  (t -= 3) > -1 && i.push(239, 191, 189), o = r;
                  continue;
                }
                r = 65536 + (o - 55296 << 10 | r - 56320);
              } else o && (t -= 3) > -1 && i.push(239, 191, 189);
              if (o = null, r < 128) {
                if ((t -= 1) < 0) break;
                i.push(r);
              } else if (r < 2048) {
                if ((t -= 2) < 0) break;
                i.push(r >> 6 | 192, 63 & r | 128);
              } else if (r < 65536) {
                if ((t -= 3) < 0) break;
                i.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);
              } else {
                if (!(r < 1114112)) throw new Error("Invalid code point");
                if ((t -= 4) < 0) break;
                i.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);
              }
            }
            return i;
          }
          function K(e) {
            return n.toByteArray(function (e) {
              if ((e = (e = e.split("=")[0]).trim().replace(W, "")).length < 2) return "";
              for (; e.length % 4 != 0;) e += "=";
              return e;
            }(e));
          }
          function q(e, t, r, n) {
            var o;
            for (o = 0; o < n && !(o + r >= t.length || o >= e.length); ++o) t[o + r] = e[o];
            return o;
          }
          function $(e, t) {
            return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name;
          }
          function Z(e) {
            return e != e;
          }
          var Y = function () {
            var e = "0123456789abcdef",
              t = new Array(256);
            for (var _r6 = 0; _r6 < 16; ++_r6) {
              var _n10 = 16 * _r6;
              for (var _o5 = 0; _o5 < 16; ++_o5) t[_n10 + _o5] = e[_r6] + e[_o5];
            }
            return t;
          }();
          function Q(e) {
            return "undefined" == typeof BigInt ? J : e;
          }
          function J() {
            throw new Error("BigInt not supported");
          }
        },
        7187: function _(e) {
          "use strict";

          var t,
            r = "object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) ? Reflect : null,
            n = r && "function" == typeof r.apply ? r.apply : function (e, t, r) {
              return Function.prototype.apply.call(e, t, r);
            };
          t = r && "function" == typeof r.ownKeys ? r.ownKeys : Object.getOwnPropertySymbols ? function (e) {
            return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
          } : function (e) {
            return Object.getOwnPropertyNames(e);
          };
          var o = Number.isNaN || function (e) {
            return e != e;
          };
          function i() {
            i.init.call(this);
          }
          e.exports = i, e.exports.once = function (e, t) {
            return new Promise(function (r, n) {
              function o(r) {
                e.removeListener(t, i), n(r);
              }
              function i() {
                "function" == typeof e.removeListener && e.removeListener("error", o), r([].slice.call(arguments));
              }
              m(e, t, i, {
                once: !0
              }), "error" !== t && function (e, t, r) {
                "function" == typeof e.on && m(e, "error", t, {
                  once: !0
                });
              }(e, o);
            });
          }, i.EventEmitter = i, i.prototype._events = void 0, i.prototype._eventsCount = 0, i.prototype._maxListeners = void 0;
          var s = 10;
          function a(e) {
            if ("function" != typeof e) throw new TypeError('The "listener" argument must be of type Function. Received type ' + _typeof(e));
          }
          function u(e) {
            return void 0 === e._maxListeners ? i.defaultMaxListeners : e._maxListeners;
          }
          function c(e, t, r, n) {
            var o, i, s, c;
            if (a(r), void 0 === (i = e._events) ? (i = e._events = Object.create(null), e._eventsCount = 0) : (void 0 !== i.newListener && (e.emit("newListener", t, r.listener ? r.listener : r), i = e._events), s = i[t]), void 0 === s) s = i[t] = r, ++e._eventsCount;else if ("function" == typeof s ? s = i[t] = n ? [r, s] : [s, r] : n ? s.unshift(r) : s.push(r), (o = u(e)) > 0 && s.length > o && !s.warned) {
              s.warned = !0;
              var l = new Error("Possible EventEmitter memory leak detected. " + s.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
              l.name = "MaxListenersExceededWarning", l.emitter = e, l.type = t, l.count = s.length, c = l, console && console.warn && console.warn(c);
            }
            return e;
          }
          function l() {
            if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
          }
          function p(e, t, r) {
            var n = {
                fired: !1,
                wrapFn: void 0,
                target: e,
                type: t,
                listener: r
              },
              o = l.bind(n);
            return o.listener = r, n.wrapFn = o, o;
          }
          function h(e, t, r) {
            var n = e._events;
            if (void 0 === n) return [];
            var o = n[t];
            return void 0 === o ? [] : "function" == typeof o ? r ? [o.listener || o] : [o] : r ? function (e) {
              for (var t = new Array(e.length), r = 0; r < t.length; ++r) t[r] = e[r].listener || e[r];
              return t;
            }(o) : f(o, o.length);
          }
          function d(e) {
            var t = this._events;
            if (void 0 !== t) {
              var r = t[e];
              if ("function" == typeof r) return 1;
              if (void 0 !== r) return r.length;
            }
            return 0;
          }
          function f(e, t) {
            for (var r = new Array(t), n = 0; n < t; ++n) r[n] = e[n];
            return r;
          }
          function m(e, t, r, n) {
            if ("function" == typeof e.on) n.once ? e.once(t, r) : e.on(t, r);else {
              if ("function" != typeof e.addEventListener) throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + _typeof(e));
              e.addEventListener(t, function o(i) {
                n.once && e.removeEventListener(t, o), r(i);
              });
            }
          }
          Object.defineProperty(i, "defaultMaxListeners", {
            enumerable: !0,
            get: function get() {
              return s;
            },
            set: function set(e) {
              if ("number" != typeof e || e < 0 || o(e)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
              s = e;
            }
          }), i.init = function () {
            void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
          }, i.prototype.setMaxListeners = function (e) {
            if ("number" != typeof e || e < 0 || o(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
            return this._maxListeners = e, this;
          }, i.prototype.getMaxListeners = function () {
            return u(this);
          }, i.prototype.emit = function (e) {
            for (var t = [], r = 1; r < arguments.length; r++) t.push(arguments[r]);
            var o = "error" === e,
              i = this._events;
            if (void 0 !== i) o = o && void 0 === i.error;else if (!o) return !1;
            if (o) {
              var s;
              if (t.length > 0 && (s = t[0]), s instanceof Error) throw s;
              var a = new Error("Unhandled error." + (s ? " (" + s.message + ")" : ""));
              throw a.context = s, a;
            }
            var u = i[e];
            if (void 0 === u) return !1;
            if ("function" == typeof u) n(u, this, t);else {
              var c = u.length,
                l = f(u, c);
              for (r = 0; r < c; ++r) n(l[r], this, t);
            }
            return !0;
          }, i.prototype.addListener = function (e, t) {
            return c(this, e, t, !1);
          }, i.prototype.on = i.prototype.addListener, i.prototype.prependListener = function (e, t) {
            return c(this, e, t, !0);
          }, i.prototype.once = function (e, t) {
            return a(t), this.on(e, p(this, e, t)), this;
          }, i.prototype.prependOnceListener = function (e, t) {
            return a(t), this.prependListener(e, p(this, e, t)), this;
          }, i.prototype.removeListener = function (e, t) {
            var r, n, o, i, s;
            if (a(t), void 0 === (n = this._events)) return this;
            if (void 0 === (r = n[e])) return this;
            if (r === t || r.listener === t) 0 == --this._eventsCount ? this._events = Object.create(null) : (delete n[e], n.removeListener && this.emit("removeListener", e, r.listener || t));else if ("function" != typeof r) {
              for (o = -1, i = r.length - 1; i >= 0; i--) if (r[i] === t || r[i].listener === t) {
                s = r[i].listener, o = i;
                break;
              }
              if (o < 0) return this;
              0 === o ? r.shift() : function (e, t) {
                for (; t + 1 < e.length; t++) e[t] = e[t + 1];
                e.pop();
              }(r, o), 1 === r.length && (n[e] = r[0]), void 0 !== n.removeListener && this.emit("removeListener", e, s || t);
            }
            return this;
          }, i.prototype.off = i.prototype.removeListener, i.prototype.removeAllListeners = function (e) {
            var t, r, n;
            if (void 0 === (r = this._events)) return this;
            if (void 0 === r.removeListener) return 0 === arguments.length ? (this._events = Object.create(null), this._eventsCount = 0) : void 0 !== r[e] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete r[e]), this;
            if (0 === arguments.length) {
              var o,
                i = Object.keys(r);
              for (n = 0; n < i.length; ++n) "removeListener" !== (o = i[n]) && this.removeAllListeners(o);
              return this.removeAllListeners("removeListener"), this._events = Object.create(null), this._eventsCount = 0, this;
            }
            if ("function" == typeof (t = r[e])) this.removeListener(e, t);else if (void 0 !== t) for (n = t.length - 1; n >= 0; n--) this.removeListener(e, t[n]);
            return this;
          }, i.prototype.listeners = function (e) {
            return h(this, e, !0);
          }, i.prototype.rawListeners = function (e) {
            return h(this, e, !1);
          }, i.listenerCount = function (e, t) {
            return "function" == typeof e.listenerCount ? e.listenerCount(t) : d.call(e, t);
          }, i.prototype.listenerCount = d, i.prototype.eventNames = function () {
            return this._eventsCount > 0 ? t(this._events) : [];
          };
        },
        645: function _(e, t) {
          t.read = function (e, t, r, n, o) {
            var i,
              s,
              a = 8 * o - n - 1,
              u = (1 << a) - 1,
              c = u >> 1,
              l = -7,
              p = r ? o - 1 : 0,
              h = r ? -1 : 1,
              d = e[t + p];
            for (p += h, i = d & (1 << -l) - 1, d >>= -l, l += a; l > 0; i = 256 * i + e[t + p], p += h, l -= 8);
            for (s = i & (1 << -l) - 1, i >>= -l, l += n; l > 0; s = 256 * s + e[t + p], p += h, l -= 8);
            if (0 === i) i = 1 - c;else {
              if (i === u) return s ? NaN : 1 / 0 * (d ? -1 : 1);
              s += Math.pow(2, n), i -= c;
            }
            return (d ? -1 : 1) * s * Math.pow(2, i - n);
          }, t.write = function (e, t, r, n, o, i) {
            var s,
              a,
              u,
              c = 8 * i - o - 1,
              l = (1 << c) - 1,
              p = l >> 1,
              h = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
              d = n ? 0 : i - 1,
              f = n ? 1 : -1,
              m = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
            for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, s = l) : (s = Math.floor(Math.log(t) / Math.LN2), t * (u = Math.pow(2, -s)) < 1 && (s--, u *= 2), (t += s + p >= 1 ? h / u : h * Math.pow(2, 1 - p)) * u >= 2 && (s++, u /= 2), s + p >= l ? (a = 0, s = l) : s + p >= 1 ? (a = (t * u - 1) * Math.pow(2, o), s += p) : (a = t * Math.pow(2, p - 1) * Math.pow(2, o), s = 0)); o >= 8; e[r + d] = 255 & a, d += f, a /= 256, o -= 8);
            for (s = s << o | a, c += o; c > 0; e[r + d] = 255 & s, d += f, s /= 256, c -= 8);
            e[r + d - f] |= 128 * m;
          };
        },
        5717: function _(e) {
          "function" == typeof Object.create ? e.exports = function (e, t) {
            t && (e.super_ = t, e.prototype = Object.create(t.prototype, {
              constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
              }
            }));
          } : e.exports = function (e, t) {
            if (t) {
              e.super_ = t;
              var r = function r() {};
              r.prototype = t.prototype, e.prototype = new r(), e.prototype.constructor = e;
            }
          };
        },
        5733: function _(e, t, r) {
          e.exports = function e(t, r, n) {
            function o(s, a) {
              if (!r[s]) {
                if (!t[s]) {
                  if (i) return i(s, !0);
                  var u = new Error("Cannot find module '" + s + "'");
                  throw u.code = "MODULE_NOT_FOUND", u;
                }
                var c = r[s] = {
                  exports: {}
                };
                t[s][0].call(c.exports, function (e) {
                  return o(t[s][1][e] || e);
                }, c, c.exports, e, t, r, n);
              }
              return r[s].exports;
            }
            for (var i = void 0, s = 0; s < n.length; s++) o(n[s]);
            return o;
          }({
            1: [function (e, t, r) {
              "use strict";

              var n = e("./utils"),
                o = e("./support"),
                i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
              r.encode = function (e) {
                for (var t, r, o, s, a, u, c, l = [], p = 0, h = e.length, d = h, f = "string" !== n.getTypeOf(e); p < e.length;) d = h - p, o = f ? (t = e[p++], r = p < h ? e[p++] : 0, p < h ? e[p++] : 0) : (t = e.charCodeAt(p++), r = p < h ? e.charCodeAt(p++) : 0, p < h ? e.charCodeAt(p++) : 0), s = t >> 2, a = (3 & t) << 4 | r >> 4, u = 1 < d ? (15 & r) << 2 | o >> 6 : 64, c = 2 < d ? 63 & o : 64, l.push(i.charAt(s) + i.charAt(a) + i.charAt(u) + i.charAt(c));
                return l.join("");
              }, r.decode = function (e) {
                var t,
                  r,
                  n,
                  s,
                  a,
                  u,
                  c = 0,
                  l = 0,
                  p = "data:";
                if (e.substr(0, p.length) === p) throw new Error("Invalid base64 input, it looks like a data url.");
                var h,
                  d = 3 * (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "")).length / 4;
                if (e.charAt(e.length - 1) === i.charAt(64) && d--, e.charAt(e.length - 2) === i.charAt(64) && d--, d % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
                for (h = o.uint8array ? new Uint8Array(0 | d) : new Array(0 | d); c < e.length;) t = i.indexOf(e.charAt(c++)) << 2 | (s = i.indexOf(e.charAt(c++))) >> 4, r = (15 & s) << 4 | (a = i.indexOf(e.charAt(c++))) >> 2, n = (3 & a) << 6 | (u = i.indexOf(e.charAt(c++))), h[l++] = t, 64 !== a && (h[l++] = r), 64 !== u && (h[l++] = n);
                return h;
              };
            }, {
              "./support": 30,
              "./utils": 32
            }],
            2: [function (e, t, r) {
              "use strict";

              var n = e("./external"),
                o = e("./stream/DataWorker"),
                i = e("./stream/Crc32Probe"),
                s = e("./stream/DataLengthProbe");
              function a(e, t, r, n, o) {
                this.compressedSize = e, this.uncompressedSize = t, this.crc32 = r, this.compression = n, this.compressedContent = o;
              }
              a.prototype = {
                getContentWorker: function getContentWorker() {
                  var e = new o(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new s("data_length")),
                    t = this;
                  return e.on("end", function () {
                    if (this.streamInfo.data_length !== t.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
                  }), e;
                },
                getCompressedWorker: function getCompressedWorker() {
                  return new o(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
                }
              }, a.createWorkerFrom = function (e, t, r) {
                return e.pipe(new i()).pipe(new s("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new s("compressedSize")).withStreamInfo("compression", t);
              }, t.exports = a;
            }, {
              "./external": 6,
              "./stream/Crc32Probe": 25,
              "./stream/DataLengthProbe": 26,
              "./stream/DataWorker": 27
            }],
            3: [function (e, t, r) {
              "use strict";

              var n = e("./stream/GenericWorker");
              r.STORE = {
                magic: "\0\0",
                compressWorker: function compressWorker(e) {
                  return new n("STORE compression");
                },
                uncompressWorker: function uncompressWorker() {
                  return new n("STORE decompression");
                }
              }, r.DEFLATE = e("./flate");
            }, {
              "./flate": 7,
              "./stream/GenericWorker": 28
            }],
            4: [function (e, t, r) {
              "use strict";

              var n = e("./utils"),
                o = function () {
                  for (var e, t = [], r = 0; r < 256; r++) {
                    e = r;
                    for (var n = 0; n < 8; n++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
                    t[r] = e;
                  }
                  return t;
                }();
              t.exports = function (e, t) {
                return void 0 !== e && e.length ? "string" !== n.getTypeOf(e) ? function (e, t, r, n) {
                  var i = o,
                    s = 0 + r;
                  e ^= -1;
                  for (var a = 0; a < s; a++) e = e >>> 8 ^ i[255 & (e ^ t[a])];
                  return -1 ^ e;
                }(0 | t, e, e.length) : function (e, t, r, n) {
                  var i = o,
                    s = 0 + r;
                  e ^= -1;
                  for (var a = 0; a < s; a++) e = e >>> 8 ^ i[255 & (e ^ t.charCodeAt(a))];
                  return -1 ^ e;
                }(0 | t, e, e.length) : 0;
              };
            }, {
              "./utils": 32
            }],
            5: [function (e, t, r) {
              "use strict";

              r.base64 = !1, r.binary = !1, r.dir = !1, r.createFolders = !0, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
            }, {}],
            6: [function (e, t, r) {
              "use strict";

              var n;
              n = "undefined" != typeof Promise ? Promise : e("lie"), t.exports = {
                Promise: n
              };
            }, {
              lie: 37
            }],
            7: [function (e, t, r) {
              "use strict";

              var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array,
                o = e("pako"),
                i = e("./utils"),
                s = e("./stream/GenericWorker"),
                a = n ? "uint8array" : "array";
              function u(e, t) {
                s.call(this, "FlateWorker/" + e), this._pako = null, this._pakoAction = e, this._pakoOptions = t, this.meta = {};
              }
              r.magic = "\b\0", i.inherits(u, s), u.prototype.processChunk = function (e) {
                this.meta = e.meta, null === this._pako && this._createPako(), this._pako.push(i.transformTo(a, e.data), !1);
              }, u.prototype.flush = function () {
                s.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], !0);
              }, u.prototype.cleanUp = function () {
                s.prototype.cleanUp.call(this), this._pako = null;
              }, u.prototype._createPako = function () {
                this._pako = new o[this._pakoAction]({
                  raw: !0,
                  level: this._pakoOptions.level || -1
                });
                var e = this;
                this._pako.onData = function (t) {
                  e.push({
                    data: t,
                    meta: e.meta
                  });
                };
              }, r.compressWorker = function (e) {
                return new u("Deflate", e);
              }, r.uncompressWorker = function () {
                return new u("Inflate", {});
              };
            }, {
              "./stream/GenericWorker": 28,
              "./utils": 32,
              pako: 38
            }],
            8: [function (e, t, r) {
              "use strict";

              function n(e, t) {
                var r,
                  n = "";
                for (r = 0; r < t; r++) n += String.fromCharCode(255 & e), e >>>= 8;
                return n;
              }
              function o(e, t, r, o, s, l) {
                var p,
                  h,
                  d = e.file,
                  f = e.compression,
                  m = l !== a.utf8encode,
                  g = i.transformTo("string", l(d.name)),
                  b = i.transformTo("string", a.utf8encode(d.name)),
                  y = d.comment,
                  w = i.transformTo("string", l(y)),
                  v = i.transformTo("string", a.utf8encode(y)),
                  _ = b.length !== d.name.length,
                  x = v.length !== y.length,
                  E = "",
                  T = "",
                  O = "",
                  S = d.dir,
                  A = d.date,
                  P = {
                    crc32: 0,
                    compressedSize: 0,
                    uncompressedSize: 0
                  };
                t && !r || (P.crc32 = e.crc32, P.compressedSize = e.compressedSize, P.uncompressedSize = e.uncompressedSize);
                var C = 0;
                t && (C |= 8), m || !_ && !x || (C |= 2048);
                var R = 0,
                  I = 0;
                S && (R |= 16), "UNIX" === s ? (I = 798, R |= function (e, t) {
                  var r = e;
                  return e || (r = t ? 16893 : 33204), (65535 & r) << 16;
                }(d.unixPermissions, S)) : (I = 20, R |= function (e) {
                  return 63 & (e || 0);
                }(d.dosPermissions)), p = A.getUTCHours(), p <<= 6, p |= A.getUTCMinutes(), p <<= 5, p |= A.getUTCSeconds() / 2, h = A.getUTCFullYear() - 1980, h <<= 4, h |= A.getUTCMonth() + 1, h <<= 5, h |= A.getUTCDate(), _ && (T = n(1, 1) + n(u(g), 4) + b, E += "up" + n(T.length, 2) + T), x && (O = n(1, 1) + n(u(w), 4) + v, E += "uc" + n(O.length, 2) + O);
                var N = "";
                return N += "\n\0", N += n(C, 2), N += f.magic, N += n(p, 2), N += n(h, 2), N += n(P.crc32, 4), N += n(P.compressedSize, 4), N += n(P.uncompressedSize, 4), N += n(g.length, 2), N += n(E.length, 2), {
                  fileRecord: c.LOCAL_FILE_HEADER + N + g + E,
                  dirRecord: c.CENTRAL_FILE_HEADER + n(I, 2) + N + n(w.length, 2) + "\0\0\0\0" + n(R, 4) + n(o, 4) + g + E + w
                };
              }
              var i = e("../utils"),
                s = e("../stream/GenericWorker"),
                a = e("../utf8"),
                u = e("../crc32"),
                c = e("../signature");
              function l(e, t, r, n) {
                s.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t, this.zipPlatform = r, this.encodeFileName = n, this.streamFiles = e, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
              }
              i.inherits(l, s), l.prototype.push = function (e) {
                var t = e.meta.percent || 0,
                  r = this.entriesCount,
                  n = this._sources.length;
                this.accumulate ? this.contentBuffer.push(e) : (this.bytesWritten += e.data.length, s.prototype.push.call(this, {
                  data: e.data,
                  meta: {
                    currentFile: this.currentFile,
                    percent: r ? (t + 100 * (r - n - 1)) / r : 100
                  }
                }));
              }, l.prototype.openedSource = function (e) {
                this.currentSourceOffset = this.bytesWritten, this.currentFile = e.file.name;
                var t = this.streamFiles && !e.file.dir;
                if (t) {
                  var r = o(e, t, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                  this.push({
                    data: r.fileRecord,
                    meta: {
                      percent: 0
                    }
                  });
                } else this.accumulate = !0;
              }, l.prototype.closedSource = function (e) {
                this.accumulate = !1;
                var t = this.streamFiles && !e.file.dir,
                  r = o(e, t, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                if (this.dirRecords.push(r.dirRecord), t) this.push({
                  data: function (e) {
                    return c.DATA_DESCRIPTOR + n(e.crc32, 4) + n(e.compressedSize, 4) + n(e.uncompressedSize, 4);
                  }(e),
                  meta: {
                    percent: 100
                  }
                });else for (this.push({
                  data: r.fileRecord,
                  meta: {
                    percent: 0
                  }
                }); this.contentBuffer.length;) this.push(this.contentBuffer.shift());
                this.currentFile = null;
              }, l.prototype.flush = function () {
                for (var e = this.bytesWritten, t = 0; t < this.dirRecords.length; t++) this.push({
                  data: this.dirRecords[t],
                  meta: {
                    percent: 100
                  }
                });
                var r = this.bytesWritten - e,
                  o = function (e, t, r, o, s) {
                    var a = i.transformTo("string", s(o));
                    return c.CENTRAL_DIRECTORY_END + "\0\0\0\0" + n(e, 2) + n(e, 2) + n(t, 4) + n(r, 4) + n(a.length, 2) + a;
                  }(this.dirRecords.length, r, e, this.zipComment, this.encodeFileName);
                this.push({
                  data: o,
                  meta: {
                    percent: 100
                  }
                });
              }, l.prototype.prepareNextSource = function () {
                this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
              }, l.prototype.registerPrevious = function (e) {
                this._sources.push(e);
                var t = this;
                return e.on("data", function (e) {
                  t.processChunk(e);
                }), e.on("end", function () {
                  t.closedSource(t.previous.streamInfo), t._sources.length ? t.prepareNextSource() : t.end();
                }), e.on("error", function (e) {
                  t.error(e);
                }), this;
              }, l.prototype.resume = function () {
                return !!s.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
              }, l.prototype.error = function (e) {
                var t = this._sources;
                if (!s.prototype.error.call(this, e)) return !1;
                for (var r = 0; r < t.length; r++) try {
                  t[r].error(e);
                } catch (e) {}
                return !0;
              }, l.prototype.lock = function () {
                s.prototype.lock.call(this);
                for (var e = this._sources, t = 0; t < e.length; t++) e[t].lock();
              }, t.exports = l;
            }, {
              "../crc32": 4,
              "../signature": 23,
              "../stream/GenericWorker": 28,
              "../utf8": 31,
              "../utils": 32
            }],
            9: [function (e, t, r) {
              "use strict";

              var n = e("../compressions"),
                o = e("./ZipFileWorker");
              r.generateWorker = function (e, t, r) {
                var i = new o(t.streamFiles, r, t.platform, t.encodeFileName),
                  s = 0;
                try {
                  e.forEach(function (e, r) {
                    s++;
                    var o = function (e, t) {
                        var r = e || t,
                          o = n[r];
                        if (!o) throw new Error(r + " is not a valid compression method !");
                        return o;
                      }(r.options.compression, t.compression),
                      a = r.options.compressionOptions || t.compressionOptions || {},
                      u = r.dir,
                      c = r.date;
                    r._compressWorker(o, a).withStreamInfo("file", {
                      name: e,
                      dir: u,
                      date: c,
                      comment: r.comment || "",
                      unixPermissions: r.unixPermissions,
                      dosPermissions: r.dosPermissions
                    }).pipe(i);
                  }), i.entriesCount = s;
                } catch (e) {
                  i.error(e);
                }
                return i;
              };
            }, {
              "../compressions": 3,
              "./ZipFileWorker": 8
            }],
            10: [function (e, t, r) {
              "use strict";

              function n() {
                if (!(this instanceof n)) return new n();
                if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
                this.files = Object.create(null), this.comment = null, this.root = "", this.clone = function () {
                  var e = new n();
                  for (var t in this) "function" != typeof this[t] && (e[t] = this[t]);
                  return e;
                };
              }
              (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.7.1", n.loadAsync = function (e, t) {
                return new n().loadAsync(e, t);
              }, n.external = e("./external"), t.exports = n;
            }, {
              "./defaults": 5,
              "./external": 6,
              "./load": 11,
              "./object": 15,
              "./support": 30
            }],
            11: [function (e, t, r) {
              "use strict";

              var n = e("./utils"),
                o = e("./external"),
                i = e("./utf8"),
                s = e("./zipEntries"),
                a = e("./stream/Crc32Probe"),
                u = e("./nodejsUtils");
              function c(e) {
                return new o.Promise(function (t, r) {
                  var n = e.decompressed.getContentWorker().pipe(new a());
                  n.on("error", function (e) {
                    r(e);
                  }).on("end", function () {
                    n.streamInfo.crc32 !== e.decompressed.crc32 ? r(new Error("Corrupted zip : CRC32 mismatch")) : t();
                  }).resume();
                });
              }
              t.exports = function (e, t) {
                var r = this;
                return t = n.extend(t || {}, {
                  base64: !1,
                  checkCRC32: !1,
                  optimizedBinaryString: !1,
                  createFolders: !1,
                  decodeFileName: i.utf8decode
                }), u.isNode && u.isStream(e) ? o.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : n.prepareContent("the loaded zip file", e, !0, t.optimizedBinaryString, t.base64).then(function (e) {
                  var r = new s(t);
                  return r.load(e), r;
                }).then(function (e) {
                  var r = [o.Promise.resolve(e)],
                    n = e.files;
                  if (t.checkCRC32) for (var i = 0; i < n.length; i++) r.push(c(n[i]));
                  return o.Promise.all(r);
                }).then(function (e) {
                  for (var n = e.shift(), o = n.files, i = 0; i < o.length; i++) {
                    var s = o[i];
                    r.file(s.fileNameStr, s.decompressed, {
                      binary: !0,
                      optimizedBinaryString: !0,
                      date: s.date,
                      dir: s.dir,
                      comment: s.fileCommentStr.length ? s.fileCommentStr : null,
                      unixPermissions: s.unixPermissions,
                      dosPermissions: s.dosPermissions,
                      createFolders: t.createFolders
                    });
                  }
                  return n.zipComment.length && (r.comment = n.zipComment), r;
                });
              };
            }, {
              "./external": 6,
              "./nodejsUtils": 14,
              "./stream/Crc32Probe": 25,
              "./utf8": 31,
              "./utils": 32,
              "./zipEntries": 33
            }],
            12: [function (e, t, r) {
              "use strict";

              var n = e("../utils"),
                o = e("../stream/GenericWorker");
              function i(e, t) {
                o.call(this, "Nodejs stream input adapter for " + e), this._upstreamEnded = !1, this._bindStream(t);
              }
              n.inherits(i, o), i.prototype._bindStream = function (e) {
                var t = this;
                (this._stream = e).pause(), e.on("data", function (e) {
                  t.push({
                    data: e,
                    meta: {
                      percent: 0
                    }
                  });
                }).on("error", function (e) {
                  t.isPaused ? this.generatedError = e : t.error(e);
                }).on("end", function () {
                  t.isPaused ? t._upstreamEnded = !0 : t.end();
                });
              }, i.prototype.pause = function () {
                return !!o.prototype.pause.call(this) && (this._stream.pause(), !0);
              }, i.prototype.resume = function () {
                return !!o.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
              }, t.exports = i;
            }, {
              "../stream/GenericWorker": 28,
              "../utils": 32
            }],
            13: [function (e, t, r) {
              "use strict";

              var n = e("readable-stream").Readable;
              function o(e, t, r) {
                n.call(this, t), this._helper = e;
                var o = this;
                e.on("data", function (e, t) {
                  o.push(e) || o._helper.pause(), r && r(t);
                }).on("error", function (e) {
                  o.emit("error", e);
                }).on("end", function () {
                  o.push(null);
                });
              }
              e("../utils").inherits(o, n), o.prototype._read = function () {
                this._helper.resume();
              }, t.exports = o;
            }, {
              "../utils": 32,
              "readable-stream": 16
            }],
            14: [function (e, t, r) {
              "use strict";

              t.exports = {
                isNode: "undefined" != typeof Buffer,
                newBufferFrom: function newBufferFrom(e, t) {
                  if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(e, t);
                  if ("number" == typeof e) throw new Error('The "data" argument must not be a number');
                  return new Buffer(e, t);
                },
                allocBuffer: function allocBuffer(e) {
                  if (Buffer.alloc) return Buffer.alloc(e);
                  var t = new Buffer(e);
                  return t.fill(0), t;
                },
                isBuffer: function isBuffer(e) {
                  return Buffer.isBuffer(e);
                },
                isStream: function isStream(e) {
                  return e && "function" == typeof e.on && "function" == typeof e.pause && "function" == typeof e.resume;
                }
              };
            }, {}],
            15: [function (e, t, r) {
              "use strict";

              function n(e, t, r) {
                var n,
                  o = i.getTypeOf(t),
                  a = i.extend(r || {}, u);
                a.date = a.date || new Date(), null !== a.compression && (a.compression = a.compression.toUpperCase()), "string" == typeof a.unixPermissions && (a.unixPermissions = parseInt(a.unixPermissions, 8)), a.unixPermissions && 16384 & a.unixPermissions && (a.dir = !0), a.dosPermissions && 16 & a.dosPermissions && (a.dir = !0), a.dir && (e = m(e)), a.createFolders && (n = f(e)) && g.call(this, n, !0);
                var p = "string" === o && !1 === a.binary && !1 === a.base64;
                r && void 0 !== r.binary || (a.binary = !p), (t instanceof c && 0 === t.uncompressedSize || a.dir || !t || 0 === t.length) && (a.base64 = !1, a.binary = !0, t = "", a.compression = "STORE", o = "string");
                var b;
                b = t instanceof c || t instanceof s ? t : h.isNode && h.isStream(t) ? new d(e, t) : i.prepareContent(e, t, a.binary, a.optimizedBinaryString, a.base64);
                var y = new l(e, b, a);
                this.files[e] = y;
              }
              var o = e("./utf8"),
                i = e("./utils"),
                s = e("./stream/GenericWorker"),
                a = e("./stream/StreamHelper"),
                u = e("./defaults"),
                c = e("./compressedObject"),
                l = e("./zipObject"),
                p = e("./generate"),
                h = e("./nodejsUtils"),
                d = e("./nodejs/NodejsStreamInputAdapter"),
                f = function f(e) {
                  "/" === e.slice(-1) && (e = e.substring(0, e.length - 1));
                  var t = e.lastIndexOf("/");
                  return 0 < t ? e.substring(0, t) : "";
                },
                m = function m(e) {
                  return "/" !== e.slice(-1) && (e += "/"), e;
                },
                g = function g(e, t) {
                  return t = void 0 !== t ? t : u.createFolders, e = m(e), this.files[e] || n.call(this, e, null, {
                    dir: !0,
                    createFolders: t
                  }), this.files[e];
                };
              function b(e) {
                return "[object RegExp]" === Object.prototype.toString.call(e);
              }
              var y = {
                load: function load() {
                  throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
                },
                forEach: function forEach(e) {
                  var t, r, n;
                  for (t in this.files) n = this.files[t], (r = t.slice(this.root.length, t.length)) && t.slice(0, this.root.length) === this.root && e(r, n);
                },
                filter: function filter(e) {
                  var t = [];
                  return this.forEach(function (r, n) {
                    e(r, n) && t.push(n);
                  }), t;
                },
                file: function file(e, t, r) {
                  if (1 !== arguments.length) return e = this.root + e, n.call(this, e, t, r), this;
                  if (b(e)) {
                    var o = e;
                    return this.filter(function (e, t) {
                      return !t.dir && o.test(e);
                    });
                  }
                  var i = this.files[this.root + e];
                  return i && !i.dir ? i : null;
                },
                folder: function folder(e) {
                  if (!e) return this;
                  if (b(e)) return this.filter(function (t, r) {
                    return r.dir && e.test(t);
                  });
                  var t = this.root + e,
                    r = g.call(this, t),
                    n = this.clone();
                  return n.root = r.name, n;
                },
                remove: function remove(e) {
                  e = this.root + e;
                  var t = this.files[e];
                  if (t || ("/" !== e.slice(-1) && (e += "/"), t = this.files[e]), t && !t.dir) delete this.files[e];else for (var r = this.filter(function (t, r) {
                      return r.name.slice(0, e.length) === e;
                    }), n = 0; n < r.length; n++) delete this.files[r[n].name];
                  return this;
                },
                generate: function generate(e) {
                  throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
                },
                generateInternalStream: function generateInternalStream(e) {
                  var t,
                    r = {};
                  try {
                    if ((r = i.extend(e || {}, {
                      streamFiles: !1,
                      compression: "STORE",
                      compressionOptions: null,
                      type: "",
                      platform: "DOS",
                      comment: null,
                      mimeType: "application/zip",
                      encodeFileName: o.utf8encode
                    })).type = r.type.toLowerCase(), r.compression = r.compression.toUpperCase(), "binarystring" === r.type && (r.type = "string"), !r.type) throw new Error("No output type specified.");
                    i.checkSupport(r.type), "darwin" !== r.platform && "freebsd" !== r.platform && "linux" !== r.platform && "sunos" !== r.platform || (r.platform = "UNIX"), "win32" === r.platform && (r.platform = "DOS");
                    var n = r.comment || this.comment || "";
                    t = p.generateWorker(this, r, n);
                  } catch (e) {
                    (t = new s("error")).error(e);
                  }
                  return new a(t, r.type || "string", r.mimeType);
                },
                generateAsync: function generateAsync(e, t) {
                  return this.generateInternalStream(e).accumulate(t);
                },
                generateNodeStream: function generateNodeStream(e, t) {
                  return (e = e || {}).type || (e.type = "nodebuffer"), this.generateInternalStream(e).toNodejsStream(t);
                }
              };
              t.exports = y;
            }, {
              "./compressedObject": 2,
              "./defaults": 5,
              "./generate": 9,
              "./nodejs/NodejsStreamInputAdapter": 12,
              "./nodejsUtils": 14,
              "./stream/GenericWorker": 28,
              "./stream/StreamHelper": 29,
              "./utf8": 31,
              "./utils": 32,
              "./zipObject": 35
            }],
            16: [function (e, t, r) {
              t.exports = e("stream");
            }, {
              stream: void 0
            }],
            17: [function (e, t, r) {
              "use strict";

              var n = e("./DataReader");
              function o(e) {
                n.call(this, e);
                for (var t = 0; t < this.data.length; t++) e[t] = 255 & e[t];
              }
              e("../utils").inherits(o, n), o.prototype.byteAt = function (e) {
                return this.data[this.zero + e];
              }, o.prototype.lastIndexOfSignature = function (e) {
                for (var t = e.charCodeAt(0), r = e.charCodeAt(1), n = e.charCodeAt(2), o = e.charCodeAt(3), i = this.length - 4; 0 <= i; --i) if (this.data[i] === t && this.data[i + 1] === r && this.data[i + 2] === n && this.data[i + 3] === o) return i - this.zero;
                return -1;
              }, o.prototype.readAndCheckSignature = function (e) {
                var t = e.charCodeAt(0),
                  r = e.charCodeAt(1),
                  n = e.charCodeAt(2),
                  o = e.charCodeAt(3),
                  i = this.readData(4);
                return t === i[0] && r === i[1] && n === i[2] && o === i[3];
              }, o.prototype.readData = function (e) {
                if (this.checkOffset(e), 0 === e) return [];
                var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
                return this.index += e, t;
              }, t.exports = o;
            }, {
              "../utils": 32,
              "./DataReader": 18
            }],
            18: [function (e, t, r) {
              "use strict";

              var n = e("../utils");
              function o(e) {
                this.data = e, this.length = e.length, this.index = 0, this.zero = 0;
              }
              o.prototype = {
                checkOffset: function checkOffset(e) {
                  this.checkIndex(this.index + e);
                },
                checkIndex: function checkIndex(e) {
                  if (this.length < this.zero + e || e < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e + "). Corrupted zip ?");
                },
                setIndex: function setIndex(e) {
                  this.checkIndex(e), this.index = e;
                },
                skip: function skip(e) {
                  this.setIndex(this.index + e);
                },
                byteAt: function byteAt(e) {},
                readInt: function readInt(e) {
                  var t,
                    r = 0;
                  for (this.checkOffset(e), t = this.index + e - 1; t >= this.index; t--) r = (r << 8) + this.byteAt(t);
                  return this.index += e, r;
                },
                readString: function readString(e) {
                  return n.transformTo("string", this.readData(e));
                },
                readData: function readData(e) {},
                lastIndexOfSignature: function lastIndexOfSignature(e) {},
                readAndCheckSignature: function readAndCheckSignature(e) {},
                readDate: function readDate() {
                  var e = this.readInt(4);
                  return new Date(Date.UTC(1980 + (e >> 25 & 127), (e >> 21 & 15) - 1, e >> 16 & 31, e >> 11 & 31, e >> 5 & 63, (31 & e) << 1));
                }
              }, t.exports = o;
            }, {
              "../utils": 32
            }],
            19: [function (e, t, r) {
              "use strict";

              var n = e("./Uint8ArrayReader");
              function o(e) {
                n.call(this, e);
              }
              e("../utils").inherits(o, n), o.prototype.readData = function (e) {
                this.checkOffset(e);
                var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
                return this.index += e, t;
              }, t.exports = o;
            }, {
              "../utils": 32,
              "./Uint8ArrayReader": 21
            }],
            20: [function (e, t, r) {
              "use strict";

              var n = e("./DataReader");
              function o(e) {
                n.call(this, e);
              }
              e("../utils").inherits(o, n), o.prototype.byteAt = function (e) {
                return this.data.charCodeAt(this.zero + e);
              }, o.prototype.lastIndexOfSignature = function (e) {
                return this.data.lastIndexOf(e) - this.zero;
              }, o.prototype.readAndCheckSignature = function (e) {
                return e === this.readData(4);
              }, o.prototype.readData = function (e) {
                this.checkOffset(e);
                var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
                return this.index += e, t;
              }, t.exports = o;
            }, {
              "../utils": 32,
              "./DataReader": 18
            }],
            21: [function (e, t, r) {
              "use strict";

              var n = e("./ArrayReader");
              function o(e) {
                n.call(this, e);
              }
              e("../utils").inherits(o, n), o.prototype.readData = function (e) {
                if (this.checkOffset(e), 0 === e) return new Uint8Array(0);
                var t = this.data.subarray(this.zero + this.index, this.zero + this.index + e);
                return this.index += e, t;
              }, t.exports = o;
            }, {
              "../utils": 32,
              "./ArrayReader": 17
            }],
            22: [function (e, t, r) {
              "use strict";

              var n = e("../utils"),
                o = e("../support"),
                i = e("./ArrayReader"),
                s = e("./StringReader"),
                a = e("./NodeBufferReader"),
                u = e("./Uint8ArrayReader");
              t.exports = function (e) {
                var t = n.getTypeOf(e);
                return n.checkSupport(t), "string" !== t || o.uint8array ? "nodebuffer" === t ? new a(e) : o.uint8array ? new u(n.transformTo("uint8array", e)) : new i(n.transformTo("array", e)) : new s(e);
              };
            }, {
              "../support": 30,
              "../utils": 32,
              "./ArrayReader": 17,
              "./NodeBufferReader": 19,
              "./StringReader": 20,
              "./Uint8ArrayReader": 21
            }],
            23: [function (e, t, r) {
              "use strict";

              r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\b";
            }, {}],
            24: [function (e, t, r) {
              "use strict";

              var n = e("./GenericWorker"),
                o = e("../utils");
              function i(e) {
                n.call(this, "ConvertWorker to " + e), this.destType = e;
              }
              o.inherits(i, n), i.prototype.processChunk = function (e) {
                this.push({
                  data: o.transformTo(this.destType, e.data),
                  meta: e.meta
                });
              }, t.exports = i;
            }, {
              "../utils": 32,
              "./GenericWorker": 28
            }],
            25: [function (e, t, r) {
              "use strict";

              var n = e("./GenericWorker"),
                o = e("../crc32");
              function i() {
                n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
              }
              e("../utils").inherits(i, n), i.prototype.processChunk = function (e) {
                this.streamInfo.crc32 = o(e.data, this.streamInfo.crc32 || 0), this.push(e);
              }, t.exports = i;
            }, {
              "../crc32": 4,
              "../utils": 32,
              "./GenericWorker": 28
            }],
            26: [function (e, t, r) {
              "use strict";

              var n = e("../utils"),
                o = e("./GenericWorker");
              function i(e) {
                o.call(this, "DataLengthProbe for " + e), this.propName = e, this.withStreamInfo(e, 0);
              }
              n.inherits(i, o), i.prototype.processChunk = function (e) {
                if (e) {
                  var t = this.streamInfo[this.propName] || 0;
                  this.streamInfo[this.propName] = t + e.data.length;
                }
                o.prototype.processChunk.call(this, e);
              }, t.exports = i;
            }, {
              "../utils": 32,
              "./GenericWorker": 28
            }],
            27: [function (e, t, r) {
              "use strict";

              var n = e("../utils"),
                o = e("./GenericWorker");
              function i(e) {
                o.call(this, "DataWorker");
                var t = this;
                this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, e.then(function (e) {
                  t.dataIsReady = !0, t.data = e, t.max = e && e.length || 0, t.type = n.getTypeOf(e), t.isPaused || t._tickAndRepeat();
                }, function (e) {
                  t.error(e);
                });
              }
              n.inherits(i, o), i.prototype.cleanUp = function () {
                o.prototype.cleanUp.call(this), this.data = null;
              }, i.prototype.resume = function () {
                return !!o.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, n.delay(this._tickAndRepeat, [], this)), !0);
              }, i.prototype._tickAndRepeat = function () {
                this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
              }, i.prototype._tick = function () {
                if (this.isPaused || this.isFinished) return !1;
                var e = null,
                  t = Math.min(this.max, this.index + 16384);
                if (this.index >= this.max) return this.end();
                switch (this.type) {
                  case "string":
                    e = this.data.substring(this.index, t);
                    break;
                  case "uint8array":
                    e = this.data.subarray(this.index, t);
                    break;
                  case "array":
                  case "nodebuffer":
                    e = this.data.slice(this.index, t);
                }
                return this.index = t, this.push({
                  data: e,
                  meta: {
                    percent: this.max ? this.index / this.max * 100 : 0
                  }
                });
              }, t.exports = i;
            }, {
              "../utils": 32,
              "./GenericWorker": 28
            }],
            28: [function (e, t, r) {
              "use strict";

              function n(e) {
                this.name = e || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = {
                  data: [],
                  end: [],
                  error: []
                }, this.previous = null;
              }
              n.prototype = {
                push: function push(e) {
                  this.emit("data", e);
                },
                end: function end() {
                  if (this.isFinished) return !1;
                  this.flush();
                  try {
                    this.emit("end"), this.cleanUp(), this.isFinished = !0;
                  } catch (e) {
                    this.emit("error", e);
                  }
                  return !0;
                },
                error: function error(e) {
                  return !this.isFinished && (this.isPaused ? this.generatedError = e : (this.isFinished = !0, this.emit("error", e), this.previous && this.previous.error(e), this.cleanUp()), !0);
                },
                on: function on(e, t) {
                  return this._listeners[e].push(t), this;
                },
                cleanUp: function cleanUp() {
                  this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
                },
                emit: function emit(e, t) {
                  if (this._listeners[e]) for (var r = 0; r < this._listeners[e].length; r++) this._listeners[e][r].call(this, t);
                },
                pipe: function pipe(e) {
                  return e.registerPrevious(this);
                },
                registerPrevious: function registerPrevious(e) {
                  if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
                  this.streamInfo = e.streamInfo, this.mergeStreamInfo(), this.previous = e;
                  var t = this;
                  return e.on("data", function (e) {
                    t.processChunk(e);
                  }), e.on("end", function () {
                    t.end();
                  }), e.on("error", function (e) {
                    t.error(e);
                  }), this;
                },
                pause: function pause() {
                  return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
                },
                resume: function resume() {
                  if (!this.isPaused || this.isFinished) return !1;
                  var e = this.isPaused = !1;
                  return this.generatedError && (this.error(this.generatedError), e = !0), this.previous && this.previous.resume(), !e;
                },
                flush: function flush() {},
                processChunk: function processChunk(e) {
                  this.push(e);
                },
                withStreamInfo: function withStreamInfo(e, t) {
                  return this.extraStreamInfo[e] = t, this.mergeStreamInfo(), this;
                },
                mergeStreamInfo: function mergeStreamInfo() {
                  for (var e in this.extraStreamInfo) this.extraStreamInfo.hasOwnProperty(e) && (this.streamInfo[e] = this.extraStreamInfo[e]);
                },
                lock: function lock() {
                  if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
                  this.isLocked = !0, this.previous && this.previous.lock();
                },
                toString: function toString() {
                  var e = "Worker " + this.name;
                  return this.previous ? this.previous + " -> " + e : e;
                }
              }, t.exports = n;
            }, {}],
            29: [function (e, t, r) {
              "use strict";

              var n = e("../utils"),
                o = e("./ConvertWorker"),
                i = e("./GenericWorker"),
                s = e("../base64"),
                a = e("../support"),
                u = e("../external"),
                c = null;
              if (a.nodestream) try {
                c = e("../nodejs/NodejsStreamOutputAdapter");
              } catch (e) {}
              function l(e, t, r) {
                var s = t;
                switch (t) {
                  case "blob":
                  case "arraybuffer":
                    s = "uint8array";
                    break;
                  case "base64":
                    s = "string";
                }
                try {
                  this._internalType = s, this._outputType = t, this._mimeType = r, n.checkSupport(s), this._worker = e.pipe(new o(s)), e.lock();
                } catch (e) {
                  this._worker = new i("error"), this._worker.error(e);
                }
              }
              l.prototype = {
                accumulate: function accumulate(e) {
                  return function (e, t) {
                    return new u.Promise(function (r, o) {
                      var i = [],
                        a = e._internalType,
                        u = e._outputType,
                        c = e._mimeType;
                      e.on("data", function (e, r) {
                        i.push(e), t && t(r);
                      }).on("error", function (e) {
                        i = [], o(e);
                      }).on("end", function () {
                        try {
                          var e = function (e, t, r) {
                            switch (e) {
                              case "blob":
                                return n.newBlob(n.transformTo("arraybuffer", t), r);
                              case "base64":
                                return s.encode(t);
                              default:
                                return n.transformTo(e, t);
                            }
                          }(u, function (e, t) {
                            var r,
                              n = 0,
                              o = null,
                              i = 0;
                            for (r = 0; r < t.length; r++) i += t[r].length;
                            switch (e) {
                              case "string":
                                return t.join("");
                              case "array":
                                return Array.prototype.concat.apply([], t);
                              case "uint8array":
                                for (o = new Uint8Array(i), r = 0; r < t.length; r++) o.set(t[r], n), n += t[r].length;
                                return o;
                              case "nodebuffer":
                                return Buffer.concat(t);
                              default:
                                throw new Error("concat : unsupported type '" + e + "'");
                            }
                          }(a, i), c);
                          r(e);
                        } catch (e) {
                          o(e);
                        }
                        i = [];
                      }).resume();
                    });
                  }(this, e);
                },
                on: function on(e, t) {
                  var r = this;
                  return "data" === e ? this._worker.on(e, function (e) {
                    t.call(r, e.data, e.meta);
                  }) : this._worker.on(e, function () {
                    n.delay(t, arguments, r);
                  }), this;
                },
                resume: function resume() {
                  return n.delay(this._worker.resume, [], this._worker), this;
                },
                pause: function pause() {
                  return this._worker.pause(), this;
                },
                toNodejsStream: function toNodejsStream(e) {
                  if (n.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
                  return new c(this, {
                    objectMode: "nodebuffer" !== this._outputType
                  }, e);
                }
              }, t.exports = l;
            }, {
              "../base64": 1,
              "../external": 6,
              "../nodejs/NodejsStreamOutputAdapter": 13,
              "../support": 30,
              "../utils": 32,
              "./ConvertWorker": 24,
              "./GenericWorker": 28
            }],
            30: [function (e, t, r) {
              "use strict";

              if (r.base64 = !0, r.array = !0, r.string = !0, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) r.blob = !1;else {
                var n = new ArrayBuffer(0);
                try {
                  r.blob = 0 === new Blob([n], {
                    type: "application/zip"
                  }).size;
                } catch (e) {
                  try {
                    var o = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                    o.append(n), r.blob = 0 === o.getBlob("application/zip").size;
                  } catch (e) {
                    r.blob = !1;
                  }
                }
              }
              try {
                r.nodestream = !!e("readable-stream").Readable;
              } catch (e) {
                r.nodestream = !1;
              }
            }, {
              "readable-stream": 16
            }],
            31: [function (e, t, r) {
              "use strict";

              for (var n = e("./utils"), o = e("./support"), i = e("./nodejsUtils"), s = e("./stream/GenericWorker"), a = new Array(256), u = 0; u < 256; u++) a[u] = 252 <= u ? 6 : 248 <= u ? 5 : 240 <= u ? 4 : 224 <= u ? 3 : 192 <= u ? 2 : 1;
              function c() {
                s.call(this, "utf-8 decode"), this.leftOver = null;
              }
              function l() {
                s.call(this, "utf-8 encode");
              }
              a[254] = a[254] = 1, r.utf8encode = function (e) {
                return o.nodebuffer ? i.newBufferFrom(e, "utf-8") : function (e) {
                  var t,
                    r,
                    n,
                    i,
                    s,
                    a = e.length,
                    u = 0;
                  for (i = 0; i < a; i++) 55296 == (64512 & (r = e.charCodeAt(i))) && i + 1 < a && 56320 == (64512 & (n = e.charCodeAt(i + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), i++), u += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
                  for (t = o.uint8array ? new Uint8Array(u) : new Array(u), i = s = 0; s < u; i++) 55296 == (64512 & (r = e.charCodeAt(i))) && i + 1 < a && 56320 == (64512 & (n = e.charCodeAt(i + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), i++), r < 128 ? t[s++] = r : (r < 2048 ? t[s++] = 192 | r >>> 6 : (r < 65536 ? t[s++] = 224 | r >>> 12 : (t[s++] = 240 | r >>> 18, t[s++] = 128 | r >>> 12 & 63), t[s++] = 128 | r >>> 6 & 63), t[s++] = 128 | 63 & r);
                  return t;
                }(e);
              }, r.utf8decode = function (e) {
                return o.nodebuffer ? n.transformTo("nodebuffer", e).toString("utf-8") : function (e) {
                  var t,
                    r,
                    o,
                    i,
                    s = e.length,
                    u = new Array(2 * s);
                  for (t = r = 0; t < s;) if ((o = e[t++]) < 128) u[r++] = o;else if (4 < (i = a[o])) u[r++] = 65533, t += i - 1;else {
                    for (o &= 2 === i ? 31 : 3 === i ? 15 : 7; 1 < i && t < s;) o = o << 6 | 63 & e[t++], i--;
                    1 < i ? u[r++] = 65533 : o < 65536 ? u[r++] = o : (o -= 65536, u[r++] = 55296 | o >> 10 & 1023, u[r++] = 56320 | 1023 & o);
                  }
                  return u.length !== r && (u.subarray ? u = u.subarray(0, r) : u.length = r), n.applyFromCharCode(u);
                }(e = n.transformTo(o.uint8array ? "uint8array" : "array", e));
              }, n.inherits(c, s), c.prototype.processChunk = function (e) {
                var t = n.transformTo(o.uint8array ? "uint8array" : "array", e.data);
                if (this.leftOver && this.leftOver.length) {
                  if (o.uint8array) {
                    var i = t;
                    (t = new Uint8Array(i.length + this.leftOver.length)).set(this.leftOver, 0), t.set(i, this.leftOver.length);
                  } else t = this.leftOver.concat(t);
                  this.leftOver = null;
                }
                var s = function (e, t) {
                    var r;
                    for ((t = t || e.length) > e.length && (t = e.length), r = t - 1; 0 <= r && 128 == (192 & e[r]);) r--;
                    return r < 0 || 0 === r ? t : r + a[e[r]] > t ? r : t;
                  }(t),
                  u = t;
                s !== t.length && (o.uint8array ? (u = t.subarray(0, s), this.leftOver = t.subarray(s, t.length)) : (u = t.slice(0, s), this.leftOver = t.slice(s, t.length))), this.push({
                  data: r.utf8decode(u),
                  meta: e.meta
                });
              }, c.prototype.flush = function () {
                this.leftOver && this.leftOver.length && (this.push({
                  data: r.utf8decode(this.leftOver),
                  meta: {}
                }), this.leftOver = null);
              }, r.Utf8DecodeWorker = c, n.inherits(l, s), l.prototype.processChunk = function (e) {
                this.push({
                  data: r.utf8encode(e.data),
                  meta: e.meta
                });
              }, r.Utf8EncodeWorker = l;
            }, {
              "./nodejsUtils": 14,
              "./stream/GenericWorker": 28,
              "./support": 30,
              "./utils": 32
            }],
            32: [function (e, t, r) {
              "use strict";

              var n = e("./support"),
                o = e("./base64"),
                i = e("./nodejsUtils"),
                s = e("set-immediate-shim"),
                a = e("./external");
              function u(e) {
                return e;
              }
              function c(e, t) {
                for (var r = 0; r < e.length; ++r) t[r] = 255 & e.charCodeAt(r);
                return t;
              }
              r.newBlob = function (e, t) {
                r.checkSupport("blob");
                try {
                  return new Blob([e], {
                    type: t
                  });
                } catch (r) {
                  try {
                    var n = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                    return n.append(e), n.getBlob(t);
                  } catch (e) {
                    throw new Error("Bug : can't construct the Blob.");
                  }
                }
              };
              var l = {
                stringifyByChunk: function stringifyByChunk(e, t, r) {
                  var n = [],
                    o = 0,
                    i = e.length;
                  if (i <= r) return String.fromCharCode.apply(null, e);
                  for (; o < i;) "array" === t || "nodebuffer" === t ? n.push(String.fromCharCode.apply(null, e.slice(o, Math.min(o + r, i)))) : n.push(String.fromCharCode.apply(null, e.subarray(o, Math.min(o + r, i)))), o += r;
                  return n.join("");
                },
                stringifyByChar: function stringifyByChar(e) {
                  for (var t = "", r = 0; r < e.length; r++) t += String.fromCharCode(e[r]);
                  return t;
                },
                applyCanBeUsed: {
                  uint8array: function () {
                    try {
                      return n.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
                    } catch (e) {
                      return !1;
                    }
                  }(),
                  nodebuffer: function () {
                    try {
                      return n.nodebuffer && 1 === String.fromCharCode.apply(null, i.allocBuffer(1)).length;
                    } catch (e) {
                      return !1;
                    }
                  }()
                }
              };
              function p(e) {
                var t = 65536,
                  n = r.getTypeOf(e),
                  o = !0;
                if ("uint8array" === n ? o = l.applyCanBeUsed.uint8array : "nodebuffer" === n && (o = l.applyCanBeUsed.nodebuffer), o) for (; 1 < t;) try {
                  return l.stringifyByChunk(e, n, t);
                } catch (e) {
                  t = Math.floor(t / 2);
                }
                return l.stringifyByChar(e);
              }
              function h(e, t) {
                for (var r = 0; r < e.length; r++) t[r] = e[r];
                return t;
              }
              r.applyFromCharCode = p;
              var d = {};
              d.string = {
                string: u,
                array: function array(e) {
                  return c(e, new Array(e.length));
                },
                arraybuffer: function arraybuffer(e) {
                  return d.string.uint8array(e).buffer;
                },
                uint8array: function uint8array(e) {
                  return c(e, new Uint8Array(e.length));
                },
                nodebuffer: function nodebuffer(e) {
                  return c(e, i.allocBuffer(e.length));
                }
              }, d.array = {
                string: p,
                array: u,
                arraybuffer: function arraybuffer(e) {
                  return new Uint8Array(e).buffer;
                },
                uint8array: function uint8array(e) {
                  return new Uint8Array(e);
                },
                nodebuffer: function nodebuffer(e) {
                  return i.newBufferFrom(e);
                }
              }, d.arraybuffer = {
                string: function string(e) {
                  return p(new Uint8Array(e));
                },
                array: function array(e) {
                  return h(new Uint8Array(e), new Array(e.byteLength));
                },
                arraybuffer: u,
                uint8array: function uint8array(e) {
                  return new Uint8Array(e);
                },
                nodebuffer: function nodebuffer(e) {
                  return i.newBufferFrom(new Uint8Array(e));
                }
              }, d.uint8array = {
                string: p,
                array: function array(e) {
                  return h(e, new Array(e.length));
                },
                arraybuffer: function arraybuffer(e) {
                  return e.buffer;
                },
                uint8array: u,
                nodebuffer: function nodebuffer(e) {
                  return i.newBufferFrom(e);
                }
              }, d.nodebuffer = {
                string: p,
                array: function array(e) {
                  return h(e, new Array(e.length));
                },
                arraybuffer: function arraybuffer(e) {
                  return d.nodebuffer.uint8array(e).buffer;
                },
                uint8array: function uint8array(e) {
                  return h(e, new Uint8Array(e.length));
                },
                nodebuffer: u
              }, r.transformTo = function (e, t) {
                if (t = t || "", !e) return t;
                r.checkSupport(e);
                var n = r.getTypeOf(t);
                return d[n][e](t);
              }, r.getTypeOf = function (e) {
                return "string" == typeof e ? "string" : "[object Array]" === Object.prototype.toString.call(e) ? "array" : n.nodebuffer && i.isBuffer(e) ? "nodebuffer" : n.uint8array && e instanceof Uint8Array ? "uint8array" : n.arraybuffer && e instanceof ArrayBuffer ? "arraybuffer" : void 0;
              }, r.checkSupport = function (e) {
                if (!n[e.toLowerCase()]) throw new Error(e + " is not supported by this platform");
              }, r.MAX_VALUE_16BITS = 65535, r.MAX_VALUE_32BITS = -1, r.pretty = function (e) {
                var t,
                  r,
                  n = "";
                for (r = 0; r < (e || "").length; r++) n += "\\x" + ((t = e.charCodeAt(r)) < 16 ? "0" : "") + t.toString(16).toUpperCase();
                return n;
              }, r.delay = function (e, t, r) {
                s(function () {
                  e.apply(r || null, t || []);
                });
              }, r.inherits = function (e, t) {
                function r() {}
                r.prototype = t.prototype, e.prototype = new r();
              }, r.extend = function () {
                var e,
                  t,
                  r = {};
                for (e = 0; e < arguments.length; e++) for (t in arguments[e]) arguments[e].hasOwnProperty(t) && void 0 === r[t] && (r[t] = arguments[e][t]);
                return r;
              }, r.prepareContent = function (e, t, i, s, u) {
                return a.Promise.resolve(t).then(function (e) {
                  return n.blob && (e instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(e))) && "undefined" != typeof FileReader ? new a.Promise(function (t, r) {
                    var n = new FileReader();
                    n.onload = function (e) {
                      t(e.target.result);
                    }, n.onerror = function (e) {
                      r(e.target.error);
                    }, n.readAsArrayBuffer(e);
                  }) : e;
                }).then(function (t) {
                  var l = r.getTypeOf(t);
                  return l ? ("arraybuffer" === l ? t = r.transformTo("uint8array", t) : "string" === l && (u ? t = o.decode(t) : i && !0 !== s && (t = function (e) {
                    return c(e, n.uint8array ? new Uint8Array(e.length) : new Array(e.length));
                  }(t))), t) : a.Promise.reject(new Error("Can't read the data of '" + e + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
                });
              };
            }, {
              "./base64": 1,
              "./external": 6,
              "./nodejsUtils": 14,
              "./support": 30,
              "set-immediate-shim": 54
            }],
            33: [function (e, t, r) {
              "use strict";

              var n = e("./reader/readerFor"),
                o = e("./utils"),
                i = e("./signature"),
                s = e("./zipEntry"),
                a = (e("./utf8"), e("./support"));
              function u(e) {
                this.files = [], this.loadOptions = e;
              }
              u.prototype = {
                checkSignature: function checkSignature(e) {
                  if (!this.reader.readAndCheckSignature(e)) {
                    this.reader.index -= 4;
                    var t = this.reader.readString(4);
                    throw new Error("Corrupted zip or bug: unexpected signature (" + o.pretty(t) + ", expected " + o.pretty(e) + ")");
                  }
                },
                isSignature: function isSignature(e, t) {
                  var r = this.reader.index;
                  this.reader.setIndex(e);
                  var n = this.reader.readString(4) === t;
                  return this.reader.setIndex(r), n;
                },
                readBlockEndOfCentral: function readBlockEndOfCentral() {
                  this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
                  var e = this.reader.readData(this.zipCommentLength),
                    t = a.uint8array ? "uint8array" : "array",
                    r = o.transformTo(t, e);
                  this.zipComment = this.loadOptions.decodeFileName(r);
                },
                readBlockZip64EndOfCentral: function readBlockZip64EndOfCentral() {
                  this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
                  for (var e, t, r, n = this.zip64EndOfCentralSize - 44; 0 < n;) e = this.reader.readInt(2), t = this.reader.readInt(4), r = this.reader.readData(t), this.zip64ExtensibleData[e] = {
                    id: e,
                    length: t,
                    value: r
                  };
                },
                readBlockZip64EndOfCentralLocator: function readBlockZip64EndOfCentralLocator() {
                  if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
                },
                readLocalFiles: function readLocalFiles() {
                  var e, t;
                  for (e = 0; e < this.files.length; e++) t = this.files[e], this.reader.setIndex(t.localHeaderOffset), this.checkSignature(i.LOCAL_FILE_HEADER), t.readLocalPart(this.reader), t.handleUTF8(), t.processAttributes();
                },
                readCentralDir: function readCentralDir() {
                  var e;
                  for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(i.CENTRAL_FILE_HEADER);) (e = new s({
                    zip64: this.zip64
                  }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e);
                  if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
                },
                readEndOfCentral: function readEndOfCentral() {
                  var e = this.reader.lastIndexOfSignature(i.CENTRAL_DIRECTORY_END);
                  if (e < 0) throw this.isSignature(0, i.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
                  this.reader.setIndex(e);
                  var t = e;
                  if (this.checkSignature(i.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === o.MAX_VALUE_16BITS || this.diskWithCentralDirStart === o.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === o.MAX_VALUE_16BITS || this.centralDirRecords === o.MAX_VALUE_16BITS || this.centralDirSize === o.MAX_VALUE_32BITS || this.centralDirOffset === o.MAX_VALUE_32BITS) {
                    if (this.zip64 = !0, (e = this.reader.lastIndexOfSignature(i.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
                    if (this.reader.setIndex(e), this.checkSignature(i.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, i.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(i.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
                    this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(i.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
                  }
                  var r = this.centralDirOffset + this.centralDirSize;
                  this.zip64 && (r += 20, r += 12 + this.zip64EndOfCentralSize);
                  var n = t - r;
                  if (0 < n) this.isSignature(t, i.CENTRAL_FILE_HEADER) || (this.reader.zero = n);else if (n < 0) throw new Error("Corrupted zip: missing " + Math.abs(n) + " bytes.");
                },
                prepareReader: function prepareReader(e) {
                  this.reader = n(e);
                },
                load: function load(e) {
                  this.prepareReader(e), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
                }
              }, t.exports = u;
            }, {
              "./reader/readerFor": 22,
              "./signature": 23,
              "./support": 30,
              "./utf8": 31,
              "./utils": 32,
              "./zipEntry": 34
            }],
            34: [function (e, t, r) {
              "use strict";

              var n = e("./reader/readerFor"),
                o = e("./utils"),
                i = e("./compressedObject"),
                s = e("./crc32"),
                a = e("./utf8"),
                u = e("./compressions"),
                c = e("./support");
              function l(e, t) {
                this.options = e, this.loadOptions = t;
              }
              l.prototype = {
                isEncrypted: function isEncrypted() {
                  return 1 == (1 & this.bitFlag);
                },
                useUTF8: function useUTF8() {
                  return 2048 == (2048 & this.bitFlag);
                },
                readLocalPart: function readLocalPart(e) {
                  var t, r;
                  if (e.skip(22), this.fileNameLength = e.readInt(2), r = e.readInt(2), this.fileName = e.readData(this.fileNameLength), e.skip(r), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
                  if (null === (t = function (e) {
                    for (var t in u) if (u.hasOwnProperty(t) && u[t].magic === e) return u[t];
                    return null;
                  }(this.compressionMethod))) throw new Error("Corrupted zip : compression " + o.pretty(this.compressionMethod) + " unknown (inner file : " + o.transformTo("string", this.fileName) + ")");
                  this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t, e.readData(this.compressedSize));
                },
                readCentralPart: function readCentralPart(e) {
                  this.versionMadeBy = e.readInt(2), e.skip(2), this.bitFlag = e.readInt(2), this.compressionMethod = e.readString(2), this.date = e.readDate(), this.crc32 = e.readInt(4), this.compressedSize = e.readInt(4), this.uncompressedSize = e.readInt(4);
                  var t = e.readInt(2);
                  if (this.extraFieldsLength = e.readInt(2), this.fileCommentLength = e.readInt(2), this.diskNumberStart = e.readInt(2), this.internalFileAttributes = e.readInt(2), this.externalFileAttributes = e.readInt(4), this.localHeaderOffset = e.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
                  e.skip(t), this.readExtraFields(e), this.parseZIP64ExtraField(e), this.fileComment = e.readData(this.fileCommentLength);
                },
                processAttributes: function processAttributes() {
                  this.unixPermissions = null, this.dosPermissions = null;
                  var e = this.versionMadeBy >> 8;
                  this.dir = !!(16 & this.externalFileAttributes), 0 == e && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == e && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = !0);
                },
                parseZIP64ExtraField: function parseZIP64ExtraField(e) {
                  if (this.extraFields[1]) {
                    var t = n(this.extraFields[1].value);
                    this.uncompressedSize === o.MAX_VALUE_32BITS && (this.uncompressedSize = t.readInt(8)), this.compressedSize === o.MAX_VALUE_32BITS && (this.compressedSize = t.readInt(8)), this.localHeaderOffset === o.MAX_VALUE_32BITS && (this.localHeaderOffset = t.readInt(8)), this.diskNumberStart === o.MAX_VALUE_32BITS && (this.diskNumberStart = t.readInt(4));
                  }
                },
                readExtraFields: function readExtraFields(e) {
                  var t,
                    r,
                    n,
                    o = e.index + this.extraFieldsLength;
                  for (this.extraFields || (this.extraFields = {}); e.index + 4 < o;) t = e.readInt(2), r = e.readInt(2), n = e.readData(r), this.extraFields[t] = {
                    id: t,
                    length: r,
                    value: n
                  };
                  e.setIndex(o);
                },
                handleUTF8: function handleUTF8() {
                  var e = c.uint8array ? "uint8array" : "array";
                  if (this.useUTF8()) this.fileNameStr = a.utf8decode(this.fileName), this.fileCommentStr = a.utf8decode(this.fileComment);else {
                    var t = this.findExtraFieldUnicodePath();
                    if (null !== t) this.fileNameStr = t;else {
                      var r = o.transformTo(e, this.fileName);
                      this.fileNameStr = this.loadOptions.decodeFileName(r);
                    }
                    var n = this.findExtraFieldUnicodeComment();
                    if (null !== n) this.fileCommentStr = n;else {
                      var i = o.transformTo(e, this.fileComment);
                      this.fileCommentStr = this.loadOptions.decodeFileName(i);
                    }
                  }
                },
                findExtraFieldUnicodePath: function findExtraFieldUnicodePath() {
                  var e = this.extraFields[28789];
                  if (e) {
                    var t = n(e.value);
                    return 1 !== t.readInt(1) || s(this.fileName) !== t.readInt(4) ? null : a.utf8decode(t.readData(e.length - 5));
                  }
                  return null;
                },
                findExtraFieldUnicodeComment: function findExtraFieldUnicodeComment() {
                  var e = this.extraFields[25461];
                  if (e) {
                    var t = n(e.value);
                    return 1 !== t.readInt(1) || s(this.fileComment) !== t.readInt(4) ? null : a.utf8decode(t.readData(e.length - 5));
                  }
                  return null;
                }
              }, t.exports = l;
            }, {
              "./compressedObject": 2,
              "./compressions": 3,
              "./crc32": 4,
              "./reader/readerFor": 22,
              "./support": 30,
              "./utf8": 31,
              "./utils": 32
            }],
            35: [function (e, t, r) {
              "use strict";

              function n(e, t, r) {
                this.name = e, this.dir = r.dir, this.date = r.date, this.comment = r.comment, this.unixPermissions = r.unixPermissions, this.dosPermissions = r.dosPermissions, this._data = t, this._dataBinary = r.binary, this.options = {
                  compression: r.compression,
                  compressionOptions: r.compressionOptions
                };
              }
              var o = e("./stream/StreamHelper"),
                i = e("./stream/DataWorker"),
                s = e("./utf8"),
                a = e("./compressedObject"),
                u = e("./stream/GenericWorker");
              n.prototype = {
                internalStream: function internalStream(e) {
                  var t = null,
                    r = "string";
                  try {
                    if (!e) throw new Error("No output type specified.");
                    var n = "string" === (r = e.toLowerCase()) || "text" === r;
                    "binarystring" !== r && "text" !== r || (r = "string"), t = this._decompressWorker();
                    var i = !this._dataBinary;
                    i && !n && (t = t.pipe(new s.Utf8EncodeWorker())), !i && n && (t = t.pipe(new s.Utf8DecodeWorker()));
                  } catch (e) {
                    (t = new u("error")).error(e);
                  }
                  return new o(t, r, "");
                },
                async: function async(e, t) {
                  return this.internalStream(e).accumulate(t);
                },
                nodeStream: function nodeStream(e, t) {
                  return this.internalStream(e || "nodebuffer").toNodejsStream(t);
                },
                _compressWorker: function _compressWorker(e, t) {
                  if (this._data instanceof a && this._data.compression.magic === e.magic) return this._data.getCompressedWorker();
                  var r = this._decompressWorker();
                  return this._dataBinary || (r = r.pipe(new s.Utf8EncodeWorker())), a.createWorkerFrom(r, e, t);
                },
                _decompressWorker: function _decompressWorker() {
                  return this._data instanceof a ? this._data.getContentWorker() : this._data instanceof u ? this._data : new i(this._data);
                }
              };
              for (var c = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function l() {
                  throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
                }, p = 0; p < c.length; p++) n.prototype[c[p]] = l;
              t.exports = n;
            }, {
              "./compressedObject": 2,
              "./stream/DataWorker": 27,
              "./stream/GenericWorker": 28,
              "./stream/StreamHelper": 29,
              "./utf8": 31
            }],
            36: [function (e, t, n) {
              (function (e) {
                "use strict";

                var r,
                  n,
                  o = e.MutationObserver || e.WebKitMutationObserver;
                if (o) {
                  var i = 0,
                    s = new o(l),
                    a = e.document.createTextNode("");
                  s.observe(a, {
                    characterData: !0
                  }), r = function r() {
                    a.data = i = ++i % 2;
                  };
                } else if (e.setImmediate || void 0 === e.MessageChannel) r = "document" in e && "onreadystatechange" in e.document.createElement("script") ? function () {
                  var t = e.document.createElement("script");
                  t.onreadystatechange = function () {
                    l(), t.onreadystatechange = null, t.parentNode.removeChild(t), t = null;
                  }, e.document.documentElement.appendChild(t);
                } : function () {
                  setTimeout(l, 0);
                };else {
                  var u = new e.MessageChannel();
                  u.port1.onmessage = l, r = function r() {
                    u.port2.postMessage(0);
                  };
                }
                var c = [];
                function l() {
                  var e, t;
                  n = !0;
                  for (var r = c.length; r;) {
                    for (t = c, c = [], e = -1; ++e < r;) t[e]();
                    r = c.length;
                  }
                  n = !1;
                }
                t.exports = function (e) {
                  1 !== c.push(e) || n || r();
                };
              }).call(this, void 0 !== r.g ? r.g : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
            }, {}],
            37: [function (e, t, r) {
              "use strict";

              var n = e("immediate");
              function o() {}
              var i = {},
                s = ["REJECTED"],
                a = ["FULFILLED"],
                u = ["PENDING"];
              function c(e) {
                if ("function" != typeof e) throw new TypeError("resolver must be a function");
                this.state = u, this.queue = [], this.outcome = void 0, e !== o && d(this, e);
              }
              function l(e, t, r) {
                this.promise = e, "function" == typeof t && (this.onFulfilled = t, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r && (this.onRejected = r, this.callRejected = this.otherCallRejected);
              }
              function p(e, t, r) {
                n(function () {
                  var n;
                  try {
                    n = t(r);
                  } catch (n) {
                    return i.reject(e, n);
                  }
                  n === e ? i.reject(e, new TypeError("Cannot resolve promise with itself")) : i.resolve(e, n);
                });
              }
              function h(e) {
                var t = e && e.then;
                if (e && ("object" == _typeof(e) || "function" == typeof e) && "function" == typeof t) return function () {
                  t.apply(e, arguments);
                };
              }
              function d(e, t) {
                var r = !1;
                function n(t) {
                  r || (r = !0, i.reject(e, t));
                }
                function o(t) {
                  r || (r = !0, i.resolve(e, t));
                }
                var s = f(function () {
                  t(o, n);
                });
                "error" === s.status && n(s.value);
              }
              function f(e, t) {
                var r = {};
                try {
                  r.value = e(t), r.status = "success";
                } catch (e) {
                  r.status = "error", r.value = e;
                }
                return r;
              }
              (t.exports = c).prototype.finally = function (e) {
                if ("function" != typeof e) return this;
                var t = this.constructor;
                return this.then(function (r) {
                  return t.resolve(e()).then(function () {
                    return r;
                  });
                }, function (r) {
                  return t.resolve(e()).then(function () {
                    throw r;
                  });
                });
              }, c.prototype.catch = function (e) {
                return this.then(null, e);
              }, c.prototype.then = function (e, t) {
                if ("function" != typeof e && this.state === a || "function" != typeof t && this.state === s) return this;
                var r = new this.constructor(o);
                return this.state !== u ? p(r, this.state === a ? e : t, this.outcome) : this.queue.push(new l(r, e, t)), r;
              }, l.prototype.callFulfilled = function (e) {
                i.resolve(this.promise, e);
              }, l.prototype.otherCallFulfilled = function (e) {
                p(this.promise, this.onFulfilled, e);
              }, l.prototype.callRejected = function (e) {
                i.reject(this.promise, e);
              }, l.prototype.otherCallRejected = function (e) {
                p(this.promise, this.onRejected, e);
              }, i.resolve = function (e, t) {
                var r = f(h, t);
                if ("error" === r.status) return i.reject(e, r.value);
                var n = r.value;
                if (n) d(e, n);else {
                  e.state = a, e.outcome = t;
                  for (var o = -1, s = e.queue.length; ++o < s;) e.queue[o].callFulfilled(t);
                }
                return e;
              }, i.reject = function (e, t) {
                e.state = s, e.outcome = t;
                for (var r = -1, n = e.queue.length; ++r < n;) e.queue[r].callRejected(t);
                return e;
              }, c.resolve = function (e) {
                return e instanceof this ? e : i.resolve(new this(o), e);
              }, c.reject = function (e) {
                var t = new this(o);
                return i.reject(t, e);
              }, c.all = function (e) {
                var t = this;
                if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(new TypeError("must be an array"));
                var r = e.length,
                  n = !1;
                if (!r) return this.resolve([]);
                for (var s = new Array(r), a = 0, u = -1, c = new this(o); ++u < r;) l(e[u], u);
                return c;
                function l(e, o) {
                  t.resolve(e).then(function (e) {
                    s[o] = e, ++a !== r || n || (n = !0, i.resolve(c, s));
                  }, function (e) {
                    n || (n = !0, i.reject(c, e));
                  });
                }
              }, c.race = function (e) {
                if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(new TypeError("must be an array"));
                var t = e.length,
                  r = !1;
                if (!t) return this.resolve([]);
                for (var n, s = -1, a = new this(o); ++s < t;) n = e[s], this.resolve(n).then(function (e) {
                  r || (r = !0, i.resolve(a, e));
                }, function (e) {
                  r || (r = !0, i.reject(a, e));
                });
                return a;
              };
            }, {
              immediate: 36
            }],
            38: [function (e, t, r) {
              "use strict";

              var n = {};
              (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
            }, {
              "./lib/deflate": 39,
              "./lib/inflate": 40,
              "./lib/utils/common": 41,
              "./lib/zlib/constants": 44
            }],
            39: [function (e, t, r) {
              "use strict";

              var n = e("./zlib/deflate"),
                o = e("./utils/common"),
                i = e("./utils/strings"),
                s = e("./zlib/messages"),
                a = e("./zlib/zstream"),
                u = Object.prototype.toString;
              function c(e) {
                if (!(this instanceof c)) return new c(e);
                this.options = o.assign({
                  level: -1,
                  method: 8,
                  chunkSize: 16384,
                  windowBits: 15,
                  memLevel: 8,
                  strategy: 0,
                  to: ""
                }, e || {});
                var t = this.options;
                t.raw && 0 < t.windowBits ? t.windowBits = -t.windowBits : t.gzip && 0 < t.windowBits && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new a(), this.strm.avail_out = 0;
                var r = n.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
                if (0 !== r) throw new Error(s[r]);
                if (t.header && n.deflateSetHeader(this.strm, t.header), t.dictionary) {
                  var l;
                  if (l = "string" == typeof t.dictionary ? i.string2buf(t.dictionary) : "[object ArrayBuffer]" === u.call(t.dictionary) ? new Uint8Array(t.dictionary) : t.dictionary, 0 !== (r = n.deflateSetDictionary(this.strm, l))) throw new Error(s[r]);
                  this._dict_set = !0;
                }
              }
              function l(e, t) {
                var r = new c(t);
                if (r.push(e, !0), r.err) throw r.msg || s[r.err];
                return r.result;
              }
              c.prototype.push = function (e, t) {
                var r,
                  s,
                  a = this.strm,
                  c = this.options.chunkSize;
                if (this.ended) return !1;
                s = t === ~~t ? t : !0 === t ? 4 : 0, "string" == typeof e ? a.input = i.string2buf(e) : "[object ArrayBuffer]" === u.call(e) ? a.input = new Uint8Array(e) : a.input = e, a.next_in = 0, a.avail_in = a.input.length;
                do {
                  if (0 === a.avail_out && (a.output = new o.Buf8(c), a.next_out = 0, a.avail_out = c), 1 !== (r = n.deflate(a, s)) && 0 !== r) return this.onEnd(r), !(this.ended = !0);
                  0 !== a.avail_out && (0 !== a.avail_in || 4 !== s && 2 !== s) || ("string" === this.options.to ? this.onData(i.buf2binstring(o.shrinkBuf(a.output, a.next_out))) : this.onData(o.shrinkBuf(a.output, a.next_out)));
                } while ((0 < a.avail_in || 0 === a.avail_out) && 1 !== r);
                return 4 === s ? (r = n.deflateEnd(this.strm), this.onEnd(r), this.ended = !0, 0 === r) : 2 !== s || (this.onEnd(0), !(a.avail_out = 0));
              }, c.prototype.onData = function (e) {
                this.chunks.push(e);
              }, c.prototype.onEnd = function (e) {
                0 === e && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
              }, r.Deflate = c, r.deflate = l, r.deflateRaw = function (e, t) {
                return (t = t || {}).raw = !0, l(e, t);
              }, r.gzip = function (e, t) {
                return (t = t || {}).gzip = !0, l(e, t);
              };
            }, {
              "./utils/common": 41,
              "./utils/strings": 42,
              "./zlib/deflate": 46,
              "./zlib/messages": 51,
              "./zlib/zstream": 53
            }],
            40: [function (e, t, r) {
              "use strict";

              var n = e("./zlib/inflate"),
                o = e("./utils/common"),
                i = e("./utils/strings"),
                s = e("./zlib/constants"),
                a = e("./zlib/messages"),
                u = e("./zlib/zstream"),
                c = e("./zlib/gzheader"),
                l = Object.prototype.toString;
              function p(e) {
                if (!(this instanceof p)) return new p(e);
                this.options = o.assign({
                  chunkSize: 16384,
                  windowBits: 0,
                  to: ""
                }, e || {});
                var t = this.options;
                t.raw && 0 <= t.windowBits && t.windowBits < 16 && (t.windowBits = -t.windowBits, 0 === t.windowBits && (t.windowBits = -15)), !(0 <= t.windowBits && t.windowBits < 16) || e && e.windowBits || (t.windowBits += 32), 15 < t.windowBits && t.windowBits < 48 && 0 == (15 & t.windowBits) && (t.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new u(), this.strm.avail_out = 0;
                var r = n.inflateInit2(this.strm, t.windowBits);
                if (r !== s.Z_OK) throw new Error(a[r]);
                this.header = new c(), n.inflateGetHeader(this.strm, this.header);
              }
              function h(e, t) {
                var r = new p(t);
                if (r.push(e, !0), r.err) throw r.msg || a[r.err];
                return r.result;
              }
              p.prototype.push = function (e, t) {
                var r,
                  a,
                  u,
                  c,
                  p,
                  h,
                  d = this.strm,
                  f = this.options.chunkSize,
                  m = this.options.dictionary,
                  g = !1;
                if (this.ended) return !1;
                a = t === ~~t ? t : !0 === t ? s.Z_FINISH : s.Z_NO_FLUSH, "string" == typeof e ? d.input = i.binstring2buf(e) : "[object ArrayBuffer]" === l.call(e) ? d.input = new Uint8Array(e) : d.input = e, d.next_in = 0, d.avail_in = d.input.length;
                do {
                  if (0 === d.avail_out && (d.output = new o.Buf8(f), d.next_out = 0, d.avail_out = f), (r = n.inflate(d, s.Z_NO_FLUSH)) === s.Z_NEED_DICT && m && (h = "string" == typeof m ? i.string2buf(m) : "[object ArrayBuffer]" === l.call(m) ? new Uint8Array(m) : m, r = n.inflateSetDictionary(this.strm, h)), r === s.Z_BUF_ERROR && !0 === g && (r = s.Z_OK, g = !1), r !== s.Z_STREAM_END && r !== s.Z_OK) return this.onEnd(r), !(this.ended = !0);
                  d.next_out && (0 !== d.avail_out && r !== s.Z_STREAM_END && (0 !== d.avail_in || a !== s.Z_FINISH && a !== s.Z_SYNC_FLUSH) || ("string" === this.options.to ? (u = i.utf8border(d.output, d.next_out), c = d.next_out - u, p = i.buf2string(d.output, u), d.next_out = c, d.avail_out = f - c, c && o.arraySet(d.output, d.output, u, c, 0), this.onData(p)) : this.onData(o.shrinkBuf(d.output, d.next_out)))), 0 === d.avail_in && 0 === d.avail_out && (g = !0);
                } while ((0 < d.avail_in || 0 === d.avail_out) && r !== s.Z_STREAM_END);
                return r === s.Z_STREAM_END && (a = s.Z_FINISH), a === s.Z_FINISH ? (r = n.inflateEnd(this.strm), this.onEnd(r), this.ended = !0, r === s.Z_OK) : a !== s.Z_SYNC_FLUSH || (this.onEnd(s.Z_OK), !(d.avail_out = 0));
              }, p.prototype.onData = function (e) {
                this.chunks.push(e);
              }, p.prototype.onEnd = function (e) {
                e === s.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
              }, r.Inflate = p, r.inflate = h, r.inflateRaw = function (e, t) {
                return (t = t || {}).raw = !0, h(e, t);
              }, r.ungzip = h;
            }, {
              "./utils/common": 41,
              "./utils/strings": 42,
              "./zlib/constants": 44,
              "./zlib/gzheader": 47,
              "./zlib/inflate": 49,
              "./zlib/messages": 51,
              "./zlib/zstream": 53
            }],
            41: [function (e, t, r) {
              "use strict";

              var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
              r.assign = function (e) {
                for (var t = Array.prototype.slice.call(arguments, 1); t.length;) {
                  var r = t.shift();
                  if (r) {
                    if ("object" != _typeof(r)) throw new TypeError(r + "must be non-object");
                    for (var n in r) r.hasOwnProperty(n) && (e[n] = r[n]);
                  }
                }
                return e;
              }, r.shrinkBuf = function (e, t) {
                return e.length === t ? e : e.subarray ? e.subarray(0, t) : (e.length = t, e);
              };
              var o = {
                  arraySet: function arraySet(e, t, r, n, o) {
                    if (t.subarray && e.subarray) e.set(t.subarray(r, r + n), o);else for (var i = 0; i < n; i++) e[o + i] = t[r + i];
                  },
                  flattenChunks: function flattenChunks(e) {
                    var t, r, n, o, i, s;
                    for (t = n = 0, r = e.length; t < r; t++) n += e[t].length;
                    for (s = new Uint8Array(n), t = o = 0, r = e.length; t < r; t++) i = e[t], s.set(i, o), o += i.length;
                    return s;
                  }
                },
                i = {
                  arraySet: function arraySet(e, t, r, n, o) {
                    for (var i = 0; i < n; i++) e[o + i] = t[r + i];
                  },
                  flattenChunks: function flattenChunks(e) {
                    return [].concat.apply([], e);
                  }
                };
              r.setTyped = function (e) {
                e ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, o)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, i));
              }, r.setTyped(n);
            }, {}],
            42: [function (e, t, r) {
              "use strict";

              var n = e("./common"),
                o = !0,
                i = !0;
              try {
                String.fromCharCode.apply(null, [0]);
              } catch (e) {
                o = !1;
              }
              try {
                String.fromCharCode.apply(null, new Uint8Array(1));
              } catch (e) {
                i = !1;
              }
              for (var s = new n.Buf8(256), a = 0; a < 256; a++) s[a] = 252 <= a ? 6 : 248 <= a ? 5 : 240 <= a ? 4 : 224 <= a ? 3 : 192 <= a ? 2 : 1;
              function u(e, t) {
                if (t < 65537 && (e.subarray && i || !e.subarray && o)) return String.fromCharCode.apply(null, n.shrinkBuf(e, t));
                for (var r = "", s = 0; s < t; s++) r += String.fromCharCode(e[s]);
                return r;
              }
              s[254] = s[254] = 1, r.string2buf = function (e) {
                var t,
                  r,
                  o,
                  i,
                  s,
                  a = e.length,
                  u = 0;
                for (i = 0; i < a; i++) 55296 == (64512 & (r = e.charCodeAt(i))) && i + 1 < a && 56320 == (64512 & (o = e.charCodeAt(i + 1))) && (r = 65536 + (r - 55296 << 10) + (o - 56320), i++), u += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
                for (t = new n.Buf8(u), i = s = 0; s < u; i++) 55296 == (64512 & (r = e.charCodeAt(i))) && i + 1 < a && 56320 == (64512 & (o = e.charCodeAt(i + 1))) && (r = 65536 + (r - 55296 << 10) + (o - 56320), i++), r < 128 ? t[s++] = r : (r < 2048 ? t[s++] = 192 | r >>> 6 : (r < 65536 ? t[s++] = 224 | r >>> 12 : (t[s++] = 240 | r >>> 18, t[s++] = 128 | r >>> 12 & 63), t[s++] = 128 | r >>> 6 & 63), t[s++] = 128 | 63 & r);
                return t;
              }, r.buf2binstring = function (e) {
                return u(e, e.length);
              }, r.binstring2buf = function (e) {
                for (var t = new n.Buf8(e.length), r = 0, o = t.length; r < o; r++) t[r] = e.charCodeAt(r);
                return t;
              }, r.buf2string = function (e, t) {
                var r,
                  n,
                  o,
                  i,
                  a = t || e.length,
                  c = new Array(2 * a);
                for (r = n = 0; r < a;) if ((o = e[r++]) < 128) c[n++] = o;else if (4 < (i = s[o])) c[n++] = 65533, r += i - 1;else {
                  for (o &= 2 === i ? 31 : 3 === i ? 15 : 7; 1 < i && r < a;) o = o << 6 | 63 & e[r++], i--;
                  1 < i ? c[n++] = 65533 : o < 65536 ? c[n++] = o : (o -= 65536, c[n++] = 55296 | o >> 10 & 1023, c[n++] = 56320 | 1023 & o);
                }
                return u(c, n);
              }, r.utf8border = function (e, t) {
                var r;
                for ((t = t || e.length) > e.length && (t = e.length), r = t - 1; 0 <= r && 128 == (192 & e[r]);) r--;
                return r < 0 || 0 === r ? t : r + s[e[r]] > t ? r : t;
              };
            }, {
              "./common": 41
            }],
            43: [function (e, t, r) {
              "use strict";

              t.exports = function (e, t, r, n) {
                for (var o = 65535 & e | 0, i = e >>> 16 & 65535 | 0, s = 0; 0 !== r;) {
                  for (r -= s = 2e3 < r ? 2e3 : r; i = i + (o = o + t[n++] | 0) | 0, --s;);
                  o %= 65521, i %= 65521;
                }
                return o | i << 16 | 0;
              };
            }, {}],
            44: [function (e, t, r) {
              "use strict";

              t.exports = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8
              };
            }, {}],
            45: [function (e, t, r) {
              "use strict";

              var n = function () {
                for (var e, t = [], r = 0; r < 256; r++) {
                  e = r;
                  for (var n = 0; n < 8; n++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
                  t[r] = e;
                }
                return t;
              }();
              t.exports = function (e, t, r, o) {
                var i = n,
                  s = o + r;
                e ^= -1;
                for (var a = o; a < s; a++) e = e >>> 8 ^ i[255 & (e ^ t[a])];
                return -1 ^ e;
              };
            }, {}],
            46: [function (e, t, r) {
              "use strict";

              var n,
                o = e("../utils/common"),
                i = e("./trees"),
                s = e("./adler32"),
                a = e("./crc32"),
                u = e("./messages"),
                c = -2,
                l = 258,
                p = 262,
                h = 113;
              function d(e, t) {
                return e.msg = u[t], t;
              }
              function f(e) {
                return (e << 1) - (4 < e ? 9 : 0);
              }
              function m(e) {
                for (var t = e.length; 0 <= --t;) e[t] = 0;
              }
              function g(e) {
                var t = e.state,
                  r = t.pending;
                r > e.avail_out && (r = e.avail_out), 0 !== r && (o.arraySet(e.output, t.pending_buf, t.pending_out, r, e.next_out), e.next_out += r, t.pending_out += r, e.total_out += r, e.avail_out -= r, t.pending -= r, 0 === t.pending && (t.pending_out = 0));
              }
              function b(e, t) {
                i._tr_flush_block(e, 0 <= e.block_start ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, g(e.strm);
              }
              function y(e, t) {
                e.pending_buf[e.pending++] = t;
              }
              function w(e, t) {
                e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = 255 & t;
              }
              function v(e, t) {
                var r,
                  n,
                  o = e.max_chain_length,
                  i = e.strstart,
                  s = e.prev_length,
                  a = e.nice_match,
                  u = e.strstart > e.w_size - p ? e.strstart - (e.w_size - p) : 0,
                  c = e.window,
                  h = e.w_mask,
                  d = e.prev,
                  f = e.strstart + l,
                  m = c[i + s - 1],
                  g = c[i + s];
                e.prev_length >= e.good_match && (o >>= 2), a > e.lookahead && (a = e.lookahead);
                do {
                  if (c[(r = t) + s] === g && c[r + s - 1] === m && c[r] === c[i] && c[++r] === c[i + 1]) {
                    i += 2, r++;
                    do {} while (c[++i] === c[++r] && c[++i] === c[++r] && c[++i] === c[++r] && c[++i] === c[++r] && c[++i] === c[++r] && c[++i] === c[++r] && c[++i] === c[++r] && c[++i] === c[++r] && i < f);
                    if (n = l - (f - i), i = f - l, s < n) {
                      if (e.match_start = t, a <= (s = n)) break;
                      m = c[i + s - 1], g = c[i + s];
                    }
                  }
                } while ((t = d[t & h]) > u && 0 != --o);
                return s <= e.lookahead ? s : e.lookahead;
              }
              function _(e) {
                var t,
                  r,
                  n,
                  i,
                  u,
                  c,
                  l,
                  h,
                  d,
                  f,
                  m = e.w_size;
                do {
                  if (i = e.window_size - e.lookahead - e.strstart, e.strstart >= m + (m - p)) {
                    for (o.arraySet(e.window, e.window, m, m, 0), e.match_start -= m, e.strstart -= m, e.block_start -= m, t = r = e.hash_size; n = e.head[--t], e.head[t] = m <= n ? n - m : 0, --r;);
                    for (t = r = m; n = e.prev[--t], e.prev[t] = m <= n ? n - m : 0, --r;);
                    i += m;
                  }
                  if (0 === e.strm.avail_in) break;
                  if (c = e.strm, l = e.window, h = e.strstart + e.lookahead, f = void 0, (d = i) < (f = c.avail_in) && (f = d), r = 0 === f ? 0 : (c.avail_in -= f, o.arraySet(l, c.input, c.next_in, f, h), 1 === c.state.wrap ? c.adler = s(c.adler, l, f, h) : 2 === c.state.wrap && (c.adler = a(c.adler, l, f, h)), c.next_in += f, c.total_in += f, f), e.lookahead += r, e.lookahead + e.insert >= 3) for (u = e.strstart - e.insert, e.ins_h = e.window[u], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[u + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[u + 3 - 1]) & e.hash_mask, e.prev[u & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = u, u++, e.insert--, !(e.lookahead + e.insert < 3)););
                } while (e.lookahead < p && 0 !== e.strm.avail_in);
              }
              function x(e, t) {
                for (var r, n;;) {
                  if (e.lookahead < p) {
                    if (_(e), e.lookahead < p && 0 === t) return 1;
                    if (0 === e.lookahead) break;
                  }
                  if (r = 0, e.lookahead >= 3 && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 3 - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 !== r && e.strstart - r <= e.w_size - p && (e.match_length = v(e, r)), e.match_length >= 3) {
                    if (n = i._tr_tally(e, e.strstart - e.match_start, e.match_length - 3), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= 3) {
                      for (e.match_length--; e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 3 - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart, 0 != --e.match_length;);
                      e.strstart++;
                    } else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
                  } else n = i._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
                  if (n && (b(e, !1), 0 === e.strm.avail_out)) return 1;
                }
                return e.insert = e.strstart < 2 ? e.strstart : 2, 4 === t ? (b(e, !0), 0 === e.strm.avail_out ? 3 : 4) : e.last_lit && (b(e, !1), 0 === e.strm.avail_out) ? 1 : 2;
              }
              function E(e, t) {
                for (var r, n, o;;) {
                  if (e.lookahead < p) {
                    if (_(e), e.lookahead < p && 0 === t) return 1;
                    if (0 === e.lookahead) break;
                  }
                  if (r = 0, e.lookahead >= 3 && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 3 - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = 2, 0 !== r && e.prev_length < e.max_lazy_match && e.strstart - r <= e.w_size - p && (e.match_length = v(e, r), e.match_length <= 5 && (1 === e.strategy || 3 === e.match_length && 4096 < e.strstart - e.match_start) && (e.match_length = 2)), e.prev_length >= 3 && e.match_length <= e.prev_length) {
                    for (o = e.strstart + e.lookahead - 3, n = i._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - 3), e.lookahead -= e.prev_length - 1, e.prev_length -= 2; ++e.strstart <= o && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 3 - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 != --e.prev_length;);
                    if (e.match_available = 0, e.match_length = 2, e.strstart++, n && (b(e, !1), 0 === e.strm.avail_out)) return 1;
                  } else if (e.match_available) {
                    if ((n = i._tr_tally(e, 0, e.window[e.strstart - 1])) && b(e, !1), e.strstart++, e.lookahead--, 0 === e.strm.avail_out) return 1;
                  } else e.match_available = 1, e.strstart++, e.lookahead--;
                }
                return e.match_available && (n = i._tr_tally(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < 2 ? e.strstart : 2, 4 === t ? (b(e, !0), 0 === e.strm.avail_out ? 3 : 4) : e.last_lit && (b(e, !1), 0 === e.strm.avail_out) ? 1 : 2;
              }
              function T(e, t, r, n, o) {
                this.good_length = e, this.max_lazy = t, this.nice_length = r, this.max_chain = n, this.func = o;
              }
              function O() {
                this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = 8, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new o.Buf16(1146), this.dyn_dtree = new o.Buf16(122), this.bl_tree = new o.Buf16(78), m(this.dyn_ltree), m(this.dyn_dtree), m(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new o.Buf16(16), this.heap = new o.Buf16(573), m(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new o.Buf16(573), m(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
              }
              function S(e) {
                var t;
                return e && e.state ? (e.total_in = e.total_out = 0, e.data_type = 2, (t = e.state).pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap ? 42 : h, e.adler = 2 === t.wrap ? 0 : 1, t.last_flush = 0, i._tr_init(t), 0) : d(e, c);
              }
              function A(e) {
                var t = S(e);
                return 0 === t && function (e) {
                  e.window_size = 2 * e.w_size, m(e.head), e.max_lazy_match = n[e.level].max_lazy, e.good_match = n[e.level].good_length, e.nice_match = n[e.level].nice_length, e.max_chain_length = n[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = 2, e.match_available = 0, e.ins_h = 0;
                }(e.state), t;
              }
              function P(e, t, r, n, i, s) {
                if (!e) return c;
                var a = 1;
                if (-1 === t && (t = 6), n < 0 ? (a = 0, n = -n) : 15 < n && (a = 2, n -= 16), i < 1 || 9 < i || 8 !== r || n < 8 || 15 < n || t < 0 || 9 < t || s < 0 || 4 < s) return d(e, c);
                8 === n && (n = 9);
                var u = new O();
                return (e.state = u).strm = e, u.wrap = a, u.gzhead = null, u.w_bits = n, u.w_size = 1 << u.w_bits, u.w_mask = u.w_size - 1, u.hash_bits = i + 7, u.hash_size = 1 << u.hash_bits, u.hash_mask = u.hash_size - 1, u.hash_shift = ~~((u.hash_bits + 3 - 1) / 3), u.window = new o.Buf8(2 * u.w_size), u.head = new o.Buf16(u.hash_size), u.prev = new o.Buf16(u.w_size), u.lit_bufsize = 1 << i + 6, u.pending_buf_size = 4 * u.lit_bufsize, u.pending_buf = new o.Buf8(u.pending_buf_size), u.d_buf = 1 * u.lit_bufsize, u.l_buf = 3 * u.lit_bufsize, u.level = t, u.strategy = s, u.method = r, A(e);
              }
              n = [new T(0, 0, 0, 0, function (e, t) {
                var r = 65535;
                for (r > e.pending_buf_size - 5 && (r = e.pending_buf_size - 5);;) {
                  if (e.lookahead <= 1) {
                    if (_(e), 0 === e.lookahead && 0 === t) return 1;
                    if (0 === e.lookahead) break;
                  }
                  e.strstart += e.lookahead, e.lookahead = 0;
                  var n = e.block_start + r;
                  if ((0 === e.strstart || e.strstart >= n) && (e.lookahead = e.strstart - n, e.strstart = n, b(e, !1), 0 === e.strm.avail_out)) return 1;
                  if (e.strstart - e.block_start >= e.w_size - p && (b(e, !1), 0 === e.strm.avail_out)) return 1;
                }
                return e.insert = 0, 4 === t ? (b(e, !0), 0 === e.strm.avail_out ? 3 : 4) : (e.strstart > e.block_start && (b(e, !1), e.strm.avail_out), 1);
              }), new T(4, 4, 8, 4, x), new T(4, 5, 16, 8, x), new T(4, 6, 32, 32, x), new T(4, 4, 16, 16, E), new T(8, 16, 32, 32, E), new T(8, 16, 128, 128, E), new T(8, 32, 128, 256, E), new T(32, 128, 258, 1024, E), new T(32, 258, 258, 4096, E)], r.deflateInit = function (e, t) {
                return P(e, t, 8, 15, 8, 0);
              }, r.deflateInit2 = P, r.deflateReset = A, r.deflateResetKeep = S, r.deflateSetHeader = function (e, t) {
                return e && e.state ? 2 !== e.state.wrap ? c : (e.state.gzhead = t, 0) : c;
              }, r.deflate = function (e, t) {
                var r, o, s, u;
                if (!e || !e.state || 5 < t || t < 0) return e ? d(e, c) : c;
                if (o = e.state, !e.output || !e.input && 0 !== e.avail_in || 666 === o.status && 4 !== t) return d(e, 0 === e.avail_out ? -5 : c);
                if (o.strm = e, r = o.last_flush, o.last_flush = t, 42 === o.status) if (2 === o.wrap) e.adler = 0, y(o, 31), y(o, 139), y(o, 8), o.gzhead ? (y(o, (o.gzhead.text ? 1 : 0) + (o.gzhead.hcrc ? 2 : 0) + (o.gzhead.extra ? 4 : 0) + (o.gzhead.name ? 8 : 0) + (o.gzhead.comment ? 16 : 0)), y(o, 255 & o.gzhead.time), y(o, o.gzhead.time >> 8 & 255), y(o, o.gzhead.time >> 16 & 255), y(o, o.gzhead.time >> 24 & 255), y(o, 9 === o.level ? 2 : 2 <= o.strategy || o.level < 2 ? 4 : 0), y(o, 255 & o.gzhead.os), o.gzhead.extra && o.gzhead.extra.length && (y(o, 255 & o.gzhead.extra.length), y(o, o.gzhead.extra.length >> 8 & 255)), o.gzhead.hcrc && (e.adler = a(e.adler, o.pending_buf, o.pending, 0)), o.gzindex = 0, o.status = 69) : (y(o, 0), y(o, 0), y(o, 0), y(o, 0), y(o, 0), y(o, 9 === o.level ? 2 : 2 <= o.strategy || o.level < 2 ? 4 : 0), y(o, 3), o.status = h);else {
                  var p = 8 + (o.w_bits - 8 << 4) << 8;
                  p |= (2 <= o.strategy || o.level < 2 ? 0 : o.level < 6 ? 1 : 6 === o.level ? 2 : 3) << 6, 0 !== o.strstart && (p |= 32), p += 31 - p % 31, o.status = h, w(o, p), 0 !== o.strstart && (w(o, e.adler >>> 16), w(o, 65535 & e.adler)), e.adler = 1;
                }
                if (69 === o.status) if (o.gzhead.extra) {
                  for (s = o.pending; o.gzindex < (65535 & o.gzhead.extra.length) && (o.pending !== o.pending_buf_size || (o.gzhead.hcrc && o.pending > s && (e.adler = a(e.adler, o.pending_buf, o.pending - s, s)), g(e), s = o.pending, o.pending !== o.pending_buf_size));) y(o, 255 & o.gzhead.extra[o.gzindex]), o.gzindex++;
                  o.gzhead.hcrc && o.pending > s && (e.adler = a(e.adler, o.pending_buf, o.pending - s, s)), o.gzindex === o.gzhead.extra.length && (o.gzindex = 0, o.status = 73);
                } else o.status = 73;
                if (73 === o.status) if (o.gzhead.name) {
                  s = o.pending;
                  do {
                    if (o.pending === o.pending_buf_size && (o.gzhead.hcrc && o.pending > s && (e.adler = a(e.adler, o.pending_buf, o.pending - s, s)), g(e), s = o.pending, o.pending === o.pending_buf_size)) {
                      u = 1;
                      break;
                    }
                    u = o.gzindex < o.gzhead.name.length ? 255 & o.gzhead.name.charCodeAt(o.gzindex++) : 0, y(o, u);
                  } while (0 !== u);
                  o.gzhead.hcrc && o.pending > s && (e.adler = a(e.adler, o.pending_buf, o.pending - s, s)), 0 === u && (o.gzindex = 0, o.status = 91);
                } else o.status = 91;
                if (91 === o.status) if (o.gzhead.comment) {
                  s = o.pending;
                  do {
                    if (o.pending === o.pending_buf_size && (o.gzhead.hcrc && o.pending > s && (e.adler = a(e.adler, o.pending_buf, o.pending - s, s)), g(e), s = o.pending, o.pending === o.pending_buf_size)) {
                      u = 1;
                      break;
                    }
                    u = o.gzindex < o.gzhead.comment.length ? 255 & o.gzhead.comment.charCodeAt(o.gzindex++) : 0, y(o, u);
                  } while (0 !== u);
                  o.gzhead.hcrc && o.pending > s && (e.adler = a(e.adler, o.pending_buf, o.pending - s, s)), 0 === u && (o.status = 103);
                } else o.status = 103;
                if (103 === o.status && (o.gzhead.hcrc ? (o.pending + 2 > o.pending_buf_size && g(e), o.pending + 2 <= o.pending_buf_size && (y(o, 255 & e.adler), y(o, e.adler >> 8 & 255), e.adler = 0, o.status = h)) : o.status = h), 0 !== o.pending) {
                  if (g(e), 0 === e.avail_out) return o.last_flush = -1, 0;
                } else if (0 === e.avail_in && f(t) <= f(r) && 4 !== t) return d(e, -5);
                if (666 === o.status && 0 !== e.avail_in) return d(e, -5);
                if (0 !== e.avail_in || 0 !== o.lookahead || 0 !== t && 666 !== o.status) {
                  var v = 2 === o.strategy ? function (e, t) {
                    for (var r;;) {
                      if (0 === e.lookahead && (_(e), 0 === e.lookahead)) {
                        if (0 === t) return 1;
                        break;
                      }
                      if (e.match_length = 0, r = i._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, r && (b(e, !1), 0 === e.strm.avail_out)) return 1;
                    }
                    return e.insert = 0, 4 === t ? (b(e, !0), 0 === e.strm.avail_out ? 3 : 4) : e.last_lit && (b(e, !1), 0 === e.strm.avail_out) ? 1 : 2;
                  }(o, t) : 3 === o.strategy ? function (e, t) {
                    for (var r, n, o, s, a = e.window;;) {
                      if (e.lookahead <= l) {
                        if (_(e), e.lookahead <= l && 0 === t) return 1;
                        if (0 === e.lookahead) break;
                      }
                      if (e.match_length = 0, e.lookahead >= 3 && 0 < e.strstart && (n = a[o = e.strstart - 1]) === a[++o] && n === a[++o] && n === a[++o]) {
                        s = e.strstart + l;
                        do {} while (n === a[++o] && n === a[++o] && n === a[++o] && n === a[++o] && n === a[++o] && n === a[++o] && n === a[++o] && n === a[++o] && o < s);
                        e.match_length = l - (s - o), e.match_length > e.lookahead && (e.match_length = e.lookahead);
                      }
                      if (e.match_length >= 3 ? (r = i._tr_tally(e, 1, e.match_length - 3), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (r = i._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), r && (b(e, !1), 0 === e.strm.avail_out)) return 1;
                    }
                    return e.insert = 0, 4 === t ? (b(e, !0), 0 === e.strm.avail_out ? 3 : 4) : e.last_lit && (b(e, !1), 0 === e.strm.avail_out) ? 1 : 2;
                  }(o, t) : n[o.level].func(o, t);
                  if (3 !== v && 4 !== v || (o.status = 666), 1 === v || 3 === v) return 0 === e.avail_out && (o.last_flush = -1), 0;
                  if (2 === v && (1 === t ? i._tr_align(o) : 5 !== t && (i._tr_stored_block(o, 0, 0, !1), 3 === t && (m(o.head), 0 === o.lookahead && (o.strstart = 0, o.block_start = 0, o.insert = 0))), g(e), 0 === e.avail_out)) return o.last_flush = -1, 0;
                }
                return 4 !== t ? 0 : o.wrap <= 0 ? 1 : (2 === o.wrap ? (y(o, 255 & e.adler), y(o, e.adler >> 8 & 255), y(o, e.adler >> 16 & 255), y(o, e.adler >> 24 & 255), y(o, 255 & e.total_in), y(o, e.total_in >> 8 & 255), y(o, e.total_in >> 16 & 255), y(o, e.total_in >> 24 & 255)) : (w(o, e.adler >>> 16), w(o, 65535 & e.adler)), g(e), 0 < o.wrap && (o.wrap = -o.wrap), 0 !== o.pending ? 0 : 1);
              }, r.deflateEnd = function (e) {
                var t;
                return e && e.state ? 42 !== (t = e.state.status) && 69 !== t && 73 !== t && 91 !== t && 103 !== t && t !== h && 666 !== t ? d(e, c) : (e.state = null, t === h ? d(e, -3) : 0) : c;
              }, r.deflateSetDictionary = function (e, t) {
                var r,
                  n,
                  i,
                  a,
                  u,
                  l,
                  p,
                  h,
                  d = t.length;
                if (!e || !e.state) return c;
                if (2 === (a = (r = e.state).wrap) || 1 === a && 42 !== r.status || r.lookahead) return c;
                for (1 === a && (e.adler = s(e.adler, t, d, 0)), r.wrap = 0, d >= r.w_size && (0 === a && (m(r.head), r.strstart = 0, r.block_start = 0, r.insert = 0), h = new o.Buf8(r.w_size), o.arraySet(h, t, d - r.w_size, r.w_size, 0), t = h, d = r.w_size), u = e.avail_in, l = e.next_in, p = e.input, e.avail_in = d, e.next_in = 0, e.input = t, _(r); r.lookahead >= 3;) {
                  for (n = r.strstart, i = r.lookahead - 2; r.ins_h = (r.ins_h << r.hash_shift ^ r.window[n + 3 - 1]) & r.hash_mask, r.prev[n & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = n, n++, --i;);
                  r.strstart = n, r.lookahead = 2, _(r);
                }
                return r.strstart += r.lookahead, r.block_start = r.strstart, r.insert = r.lookahead, r.lookahead = 0, r.match_length = r.prev_length = 2, r.match_available = 0, e.next_in = l, e.input = p, e.avail_in = u, r.wrap = a, 0;
              }, r.deflateInfo = "pako deflate (from Nodeca project)";
            }, {
              "../utils/common": 41,
              "./adler32": 43,
              "./crc32": 45,
              "./messages": 51,
              "./trees": 52
            }],
            47: [function (e, t, r) {
              "use strict";

              t.exports = function () {
                this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
              };
            }, {}],
            48: [function (e, t, r) {
              "use strict";

              t.exports = function (e, t) {
                var r, n, o, i, s, a, u, c, l, p, h, d, f, m, g, b, y, w, v, _, x, E, T, O, S;
                r = e.state, n = e.next_in, O = e.input, o = n + (e.avail_in - 5), i = e.next_out, S = e.output, s = i - (t - e.avail_out), a = i + (e.avail_out - 257), u = r.dmax, c = r.wsize, l = r.whave, p = r.wnext, h = r.window, d = r.hold, f = r.bits, m = r.lencode, g = r.distcode, b = (1 << r.lenbits) - 1, y = (1 << r.distbits) - 1;
                e: do {
                  f < 15 && (d += O[n++] << f, f += 8, d += O[n++] << f, f += 8), w = m[d & b];
                  t: for (;;) {
                    if (d >>>= v = w >>> 24, f -= v, 0 == (v = w >>> 16 & 255)) S[i++] = 65535 & w;else {
                      if (!(16 & v)) {
                        if (0 == (64 & v)) {
                          w = m[(65535 & w) + (d & (1 << v) - 1)];
                          continue t;
                        }
                        if (32 & v) {
                          r.mode = 12;
                          break e;
                        }
                        e.msg = "invalid literal/length code", r.mode = 30;
                        break e;
                      }
                      _ = 65535 & w, (v &= 15) && (f < v && (d += O[n++] << f, f += 8), _ += d & (1 << v) - 1, d >>>= v, f -= v), f < 15 && (d += O[n++] << f, f += 8, d += O[n++] << f, f += 8), w = g[d & y];
                      r: for (;;) {
                        if (d >>>= v = w >>> 24, f -= v, !(16 & (v = w >>> 16 & 255))) {
                          if (0 == (64 & v)) {
                            w = g[(65535 & w) + (d & (1 << v) - 1)];
                            continue r;
                          }
                          e.msg = "invalid distance code", r.mode = 30;
                          break e;
                        }
                        if (x = 65535 & w, f < (v &= 15) && (d += O[n++] << f, (f += 8) < v && (d += O[n++] << f, f += 8)), u < (x += d & (1 << v) - 1)) {
                          e.msg = "invalid distance too far back", r.mode = 30;
                          break e;
                        }
                        if (d >>>= v, f -= v, (v = i - s) < x) {
                          if (l < (v = x - v) && r.sane) {
                            e.msg = "invalid distance too far back", r.mode = 30;
                            break e;
                          }
                          if (T = h, (E = 0) === p) {
                            if (E += c - v, v < _) {
                              for (_ -= v; S[i++] = h[E++], --v;);
                              E = i - x, T = S;
                            }
                          } else if (p < v) {
                            if (E += c + p - v, (v -= p) < _) {
                              for (_ -= v; S[i++] = h[E++], --v;);
                              if (E = 0, p < _) {
                                for (_ -= v = p; S[i++] = h[E++], --v;);
                                E = i - x, T = S;
                              }
                            }
                          } else if (E += p - v, v < _) {
                            for (_ -= v; S[i++] = h[E++], --v;);
                            E = i - x, T = S;
                          }
                          for (; 2 < _;) S[i++] = T[E++], S[i++] = T[E++], S[i++] = T[E++], _ -= 3;
                          _ && (S[i++] = T[E++], 1 < _ && (S[i++] = T[E++]));
                        } else {
                          for (E = i - x; S[i++] = S[E++], S[i++] = S[E++], S[i++] = S[E++], 2 < (_ -= 3););
                          _ && (S[i++] = S[E++], 1 < _ && (S[i++] = S[E++]));
                        }
                        break;
                      }
                    }
                    break;
                  }
                } while (n < o && i < a);
                n -= _ = f >> 3, d &= (1 << (f -= _ << 3)) - 1, e.next_in = n, e.next_out = i, e.avail_in = n < o ? o - n + 5 : 5 - (n - o), e.avail_out = i < a ? a - i + 257 : 257 - (i - a), r.hold = d, r.bits = f;
              };
            }, {}],
            49: [function (e, t, r) {
              "use strict";

              var n = e("../utils/common"),
                o = e("./adler32"),
                i = e("./crc32"),
                s = e("./inffast"),
                a = e("./inftrees"),
                u = -2;
              function c(e) {
                return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24);
              }
              function l() {
                this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new n.Buf16(320), this.work = new n.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
              }
              function p(e) {
                var t;
                return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = 1 & t.wrap), t.mode = 1, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new n.Buf32(852), t.distcode = t.distdyn = new n.Buf32(592), t.sane = 1, t.back = -1, 0) : u;
              }
              function h(e) {
                var t;
                return e && e.state ? ((t = e.state).wsize = 0, t.whave = 0, t.wnext = 0, p(e)) : u;
              }
              function d(e, t) {
                var r, n;
                return e && e.state ? (n = e.state, t < 0 ? (r = 0, t = -t) : (r = 1 + (t >> 4), t < 48 && (t &= 15)), t && (t < 8 || 15 < t) ? u : (null !== n.window && n.wbits !== t && (n.window = null), n.wrap = r, n.wbits = t, h(e))) : u;
              }
              function f(e, t) {
                var r, n;
                return e ? (n = new l(), (e.state = n).window = null, 0 !== (r = d(e, t)) && (e.state = null), r) : u;
              }
              var m,
                g,
                b = !0;
              function y(e) {
                if (b) {
                  var t;
                  for (m = new n.Buf32(512), g = new n.Buf32(32), t = 0; t < 144;) e.lens[t++] = 8;
                  for (; t < 256;) e.lens[t++] = 9;
                  for (; t < 280;) e.lens[t++] = 7;
                  for (; t < 288;) e.lens[t++] = 8;
                  for (a(1, e.lens, 0, 288, m, 0, e.work, {
                    bits: 9
                  }), t = 0; t < 32;) e.lens[t++] = 5;
                  a(2, e.lens, 0, 32, g, 0, e.work, {
                    bits: 5
                  }), b = !1;
                }
                e.lencode = m, e.lenbits = 9, e.distcode = g, e.distbits = 5;
              }
              function w(e, t, r, o) {
                var i,
                  s = e.state;
                return null === s.window && (s.wsize = 1 << s.wbits, s.wnext = 0, s.whave = 0, s.window = new n.Buf8(s.wsize)), o >= s.wsize ? (n.arraySet(s.window, t, r - s.wsize, s.wsize, 0), s.wnext = 0, s.whave = s.wsize) : (o < (i = s.wsize - s.wnext) && (i = o), n.arraySet(s.window, t, r - o, i, s.wnext), (o -= i) ? (n.arraySet(s.window, t, r - o, o, 0), s.wnext = o, s.whave = s.wsize) : (s.wnext += i, s.wnext === s.wsize && (s.wnext = 0), s.whave < s.wsize && (s.whave += i))), 0;
              }
              r.inflateReset = h, r.inflateReset2 = d, r.inflateResetKeep = p, r.inflateInit = function (e) {
                return f(e, 15);
              }, r.inflateInit2 = f, r.inflate = function (e, t) {
                var r,
                  l,
                  p,
                  h,
                  d,
                  f,
                  m,
                  g,
                  b,
                  v,
                  _,
                  x,
                  E,
                  T,
                  O,
                  S,
                  A,
                  P,
                  C,
                  R,
                  I,
                  N,
                  M,
                  k,
                  D = 0,
                  j = new n.Buf8(4),
                  F = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
                if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in) return u;
                12 === (r = e.state).mode && (r.mode = 13), d = e.next_out, p = e.output, m = e.avail_out, h = e.next_in, l = e.input, f = e.avail_in, g = r.hold, b = r.bits, v = f, _ = m, N = 0;
                e: for (;;) switch (r.mode) {
                  case 1:
                    if (0 === r.wrap) {
                      r.mode = 13;
                      break;
                    }
                    for (; b < 16;) {
                      if (0 === f) break e;
                      f--, g += l[h++] << b, b += 8;
                    }
                    if (2 & r.wrap && 35615 === g) {
                      j[r.check = 0] = 255 & g, j[1] = g >>> 8 & 255, r.check = i(r.check, j, 2, 0), b = g = 0, r.mode = 2;
                      break;
                    }
                    if (r.flags = 0, r.head && (r.head.done = !1), !(1 & r.wrap) || (((255 & g) << 8) + (g >> 8)) % 31) {
                      e.msg = "incorrect header check", r.mode = 30;
                      break;
                    }
                    if (8 != (15 & g)) {
                      e.msg = "unknown compression method", r.mode = 30;
                      break;
                    }
                    if (b -= 4, I = 8 + (15 & (g >>>= 4)), 0 === r.wbits) r.wbits = I;else if (I > r.wbits) {
                      e.msg = "invalid window size", r.mode = 30;
                      break;
                    }
                    r.dmax = 1 << I, e.adler = r.check = 1, r.mode = 512 & g ? 10 : 12, b = g = 0;
                    break;
                  case 2:
                    for (; b < 16;) {
                      if (0 === f) break e;
                      f--, g += l[h++] << b, b += 8;
                    }
                    if (r.flags = g, 8 != (255 & r.flags)) {
                      e.msg = "unknown compression method", r.mode = 30;
                      break;
                    }
                    if (57344 & r.flags) {
                      e.msg = "unknown header flags set", r.mode = 30;
                      break;
                    }
                    r.head && (r.head.text = g >> 8 & 1), 512 & r.flags && (j[0] = 255 & g, j[1] = g >>> 8 & 255, r.check = i(r.check, j, 2, 0)), b = g = 0, r.mode = 3;
                  case 3:
                    for (; b < 32;) {
                      if (0 === f) break e;
                      f--, g += l[h++] << b, b += 8;
                    }
                    r.head && (r.head.time = g), 512 & r.flags && (j[0] = 255 & g, j[1] = g >>> 8 & 255, j[2] = g >>> 16 & 255, j[3] = g >>> 24 & 255, r.check = i(r.check, j, 4, 0)), b = g = 0, r.mode = 4;
                  case 4:
                    for (; b < 16;) {
                      if (0 === f) break e;
                      f--, g += l[h++] << b, b += 8;
                    }
                    r.head && (r.head.xflags = 255 & g, r.head.os = g >> 8), 512 & r.flags && (j[0] = 255 & g, j[1] = g >>> 8 & 255, r.check = i(r.check, j, 2, 0)), b = g = 0, r.mode = 5;
                  case 5:
                    if (1024 & r.flags) {
                      for (; b < 16;) {
                        if (0 === f) break e;
                        f--, g += l[h++] << b, b += 8;
                      }
                      r.length = g, r.head && (r.head.extra_len = g), 512 & r.flags && (j[0] = 255 & g, j[1] = g >>> 8 & 255, r.check = i(r.check, j, 2, 0)), b = g = 0;
                    } else r.head && (r.head.extra = null);
                    r.mode = 6;
                  case 6:
                    if (1024 & r.flags && (f < (x = r.length) && (x = f), x && (r.head && (I = r.head.extra_len - r.length, r.head.extra || (r.head.extra = new Array(r.head.extra_len)), n.arraySet(r.head.extra, l, h, x, I)), 512 & r.flags && (r.check = i(r.check, l, x, h)), f -= x, h += x, r.length -= x), r.length)) break e;
                    r.length = 0, r.mode = 7;
                  case 7:
                    if (2048 & r.flags) {
                      if (0 === f) break e;
                      for (x = 0; I = l[h + x++], r.head && I && r.length < 65536 && (r.head.name += String.fromCharCode(I)), I && x < f;);
                      if (512 & r.flags && (r.check = i(r.check, l, x, h)), f -= x, h += x, I) break e;
                    } else r.head && (r.head.name = null);
                    r.length = 0, r.mode = 8;
                  case 8:
                    if (4096 & r.flags) {
                      if (0 === f) break e;
                      for (x = 0; I = l[h + x++], r.head && I && r.length < 65536 && (r.head.comment += String.fromCharCode(I)), I && x < f;);
                      if (512 & r.flags && (r.check = i(r.check, l, x, h)), f -= x, h += x, I) break e;
                    } else r.head && (r.head.comment = null);
                    r.mode = 9;
                  case 9:
                    if (512 & r.flags) {
                      for (; b < 16;) {
                        if (0 === f) break e;
                        f--, g += l[h++] << b, b += 8;
                      }
                      if (g !== (65535 & r.check)) {
                        e.msg = "header crc mismatch", r.mode = 30;
                        break;
                      }
                      b = g = 0;
                    }
                    r.head && (r.head.hcrc = r.flags >> 9 & 1, r.head.done = !0), e.adler = r.check = 0, r.mode = 12;
                    break;
                  case 10:
                    for (; b < 32;) {
                      if (0 === f) break e;
                      f--, g += l[h++] << b, b += 8;
                    }
                    e.adler = r.check = c(g), b = g = 0, r.mode = 11;
                  case 11:
                    if (0 === r.havedict) return e.next_out = d, e.avail_out = m, e.next_in = h, e.avail_in = f, r.hold = g, r.bits = b, 2;
                    e.adler = r.check = 1, r.mode = 12;
                  case 12:
                    if (5 === t || 6 === t) break e;
                  case 13:
                    if (r.last) {
                      g >>>= 7 & b, b -= 7 & b, r.mode = 27;
                      break;
                    }
                    for (; b < 3;) {
                      if (0 === f) break e;
                      f--, g += l[h++] << b, b += 8;
                    }
                    switch (r.last = 1 & g, b -= 1, 3 & (g >>>= 1)) {
                      case 0:
                        r.mode = 14;
                        break;
                      case 1:
                        if (y(r), r.mode = 20, 6 !== t) break;
                        g >>>= 2, b -= 2;
                        break e;
                      case 2:
                        r.mode = 17;
                        break;
                      case 3:
                        e.msg = "invalid block type", r.mode = 30;
                    }
                    g >>>= 2, b -= 2;
                    break;
                  case 14:
                    for (g >>>= 7 & b, b -= 7 & b; b < 32;) {
                      if (0 === f) break e;
                      f--, g += l[h++] << b, b += 8;
                    }
                    if ((65535 & g) != (g >>> 16 ^ 65535)) {
                      e.msg = "invalid stored block lengths", r.mode = 30;
                      break;
                    }
                    if (r.length = 65535 & g, b = g = 0, r.mode = 15, 6 === t) break e;
                  case 15:
                    r.mode = 16;
                  case 16:
                    if (x = r.length) {
                      if (f < x && (x = f), m < x && (x = m), 0 === x) break e;
                      n.arraySet(p, l, h, x, d), f -= x, h += x, m -= x, d += x, r.length -= x;
                      break;
                    }
                    r.mode = 12;
                    break;
                  case 17:
                    for (; b < 14;) {
                      if (0 === f) break e;
                      f--, g += l[h++] << b, b += 8;
                    }
                    if (r.nlen = 257 + (31 & g), g >>>= 5, b -= 5, r.ndist = 1 + (31 & g), g >>>= 5, b -= 5, r.ncode = 4 + (15 & g), g >>>= 4, b -= 4, 286 < r.nlen || 30 < r.ndist) {
                      e.msg = "too many length or distance symbols", r.mode = 30;
                      break;
                    }
                    r.have = 0, r.mode = 18;
                  case 18:
                    for (; r.have < r.ncode;) {
                      for (; b < 3;) {
                        if (0 === f) break e;
                        f--, g += l[h++] << b, b += 8;
                      }
                      r.lens[F[r.have++]] = 7 & g, g >>>= 3, b -= 3;
                    }
                    for (; r.have < 19;) r.lens[F[r.have++]] = 0;
                    if (r.lencode = r.lendyn, r.lenbits = 7, M = {
                      bits: r.lenbits
                    }, N = a(0, r.lens, 0, 19, r.lencode, 0, r.work, M), r.lenbits = M.bits, N) {
                      e.msg = "invalid code lengths set", r.mode = 30;
                      break;
                    }
                    r.have = 0, r.mode = 19;
                  case 19:
                    for (; r.have < r.nlen + r.ndist;) {
                      for (; S = (D = r.lencode[g & (1 << r.lenbits) - 1]) >>> 16 & 255, A = 65535 & D, !((O = D >>> 24) <= b);) {
                        if (0 === f) break e;
                        f--, g += l[h++] << b, b += 8;
                      }
                      if (A < 16) g >>>= O, b -= O, r.lens[r.have++] = A;else {
                        if (16 === A) {
                          for (k = O + 2; b < k;) {
                            if (0 === f) break e;
                            f--, g += l[h++] << b, b += 8;
                          }
                          if (g >>>= O, b -= O, 0 === r.have) {
                            e.msg = "invalid bit length repeat", r.mode = 30;
                            break;
                          }
                          I = r.lens[r.have - 1], x = 3 + (3 & g), g >>>= 2, b -= 2;
                        } else if (17 === A) {
                          for (k = O + 3; b < k;) {
                            if (0 === f) break e;
                            f--, g += l[h++] << b, b += 8;
                          }
                          b -= O, I = 0, x = 3 + (7 & (g >>>= O)), g >>>= 3, b -= 3;
                        } else {
                          for (k = O + 7; b < k;) {
                            if (0 === f) break e;
                            f--, g += l[h++] << b, b += 8;
                          }
                          b -= O, I = 0, x = 11 + (127 & (g >>>= O)), g >>>= 7, b -= 7;
                        }
                        if (r.have + x > r.nlen + r.ndist) {
                          e.msg = "invalid bit length repeat", r.mode = 30;
                          break;
                        }
                        for (; x--;) r.lens[r.have++] = I;
                      }
                    }
                    if (30 === r.mode) break;
                    if (0 === r.lens[256]) {
                      e.msg = "invalid code -- missing end-of-block", r.mode = 30;
                      break;
                    }
                    if (r.lenbits = 9, M = {
                      bits: r.lenbits
                    }, N = a(1, r.lens, 0, r.nlen, r.lencode, 0, r.work, M), r.lenbits = M.bits, N) {
                      e.msg = "invalid literal/lengths set", r.mode = 30;
                      break;
                    }
                    if (r.distbits = 6, r.distcode = r.distdyn, M = {
                      bits: r.distbits
                    }, N = a(2, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, M), r.distbits = M.bits, N) {
                      e.msg = "invalid distances set", r.mode = 30;
                      break;
                    }
                    if (r.mode = 20, 6 === t) break e;
                  case 20:
                    r.mode = 21;
                  case 21:
                    if (6 <= f && 258 <= m) {
                      e.next_out = d, e.avail_out = m, e.next_in = h, e.avail_in = f, r.hold = g, r.bits = b, s(e, _), d = e.next_out, p = e.output, m = e.avail_out, h = e.next_in, l = e.input, f = e.avail_in, g = r.hold, b = r.bits, 12 === r.mode && (r.back = -1);
                      break;
                    }
                    for (r.back = 0; S = (D = r.lencode[g & (1 << r.lenbits) - 1]) >>> 16 & 255, A = 65535 & D, !((O = D >>> 24) <= b);) {
                      if (0 === f) break e;
                      f--, g += l[h++] << b, b += 8;
                    }
                    if (S && 0 == (240 & S)) {
                      for (P = O, C = S, R = A; S = (D = r.lencode[R + ((g & (1 << P + C) - 1) >> P)]) >>> 16 & 255, A = 65535 & D, !(P + (O = D >>> 24) <= b);) {
                        if (0 === f) break e;
                        f--, g += l[h++] << b, b += 8;
                      }
                      g >>>= P, b -= P, r.back += P;
                    }
                    if (g >>>= O, b -= O, r.back += O, r.length = A, 0 === S) {
                      r.mode = 26;
                      break;
                    }
                    if (32 & S) {
                      r.back = -1, r.mode = 12;
                      break;
                    }
                    if (64 & S) {
                      e.msg = "invalid literal/length code", r.mode = 30;
                      break;
                    }
                    r.extra = 15 & S, r.mode = 22;
                  case 22:
                    if (r.extra) {
                      for (k = r.extra; b < k;) {
                        if (0 === f) break e;
                        f--, g += l[h++] << b, b += 8;
                      }
                      r.length += g & (1 << r.extra) - 1, g >>>= r.extra, b -= r.extra, r.back += r.extra;
                    }
                    r.was = r.length, r.mode = 23;
                  case 23:
                    for (; S = (D = r.distcode[g & (1 << r.distbits) - 1]) >>> 16 & 255, A = 65535 & D, !((O = D >>> 24) <= b);) {
                      if (0 === f) break e;
                      f--, g += l[h++] << b, b += 8;
                    }
                    if (0 == (240 & S)) {
                      for (P = O, C = S, R = A; S = (D = r.distcode[R + ((g & (1 << P + C) - 1) >> P)]) >>> 16 & 255, A = 65535 & D, !(P + (O = D >>> 24) <= b);) {
                        if (0 === f) break e;
                        f--, g += l[h++] << b, b += 8;
                      }
                      g >>>= P, b -= P, r.back += P;
                    }
                    if (g >>>= O, b -= O, r.back += O, 64 & S) {
                      e.msg = "invalid distance code", r.mode = 30;
                      break;
                    }
                    r.offset = A, r.extra = 15 & S, r.mode = 24;
                  case 24:
                    if (r.extra) {
                      for (k = r.extra; b < k;) {
                        if (0 === f) break e;
                        f--, g += l[h++] << b, b += 8;
                      }
                      r.offset += g & (1 << r.extra) - 1, g >>>= r.extra, b -= r.extra, r.back += r.extra;
                    }
                    if (r.offset > r.dmax) {
                      e.msg = "invalid distance too far back", r.mode = 30;
                      break;
                    }
                    r.mode = 25;
                  case 25:
                    if (0 === m) break e;
                    if (x = _ - m, r.offset > x) {
                      if ((x = r.offset - x) > r.whave && r.sane) {
                        e.msg = "invalid distance too far back", r.mode = 30;
                        break;
                      }
                      E = x > r.wnext ? (x -= r.wnext, r.wsize - x) : r.wnext - x, x > r.length && (x = r.length), T = r.window;
                    } else T = p, E = d - r.offset, x = r.length;
                    for (m < x && (x = m), m -= x, r.length -= x; p[d++] = T[E++], --x;);
                    0 === r.length && (r.mode = 21);
                    break;
                  case 26:
                    if (0 === m) break e;
                    p[d++] = r.length, m--, r.mode = 21;
                    break;
                  case 27:
                    if (r.wrap) {
                      for (; b < 32;) {
                        if (0 === f) break e;
                        f--, g |= l[h++] << b, b += 8;
                      }
                      if (_ -= m, e.total_out += _, r.total += _, _ && (e.adler = r.check = r.flags ? i(r.check, p, _, d - _) : o(r.check, p, _, d - _)), _ = m, (r.flags ? g : c(g)) !== r.check) {
                        e.msg = "incorrect data check", r.mode = 30;
                        break;
                      }
                      b = g = 0;
                    }
                    r.mode = 28;
                  case 28:
                    if (r.wrap && r.flags) {
                      for (; b < 32;) {
                        if (0 === f) break e;
                        f--, g += l[h++] << b, b += 8;
                      }
                      if (g !== (4294967295 & r.total)) {
                        e.msg = "incorrect length check", r.mode = 30;
                        break;
                      }
                      b = g = 0;
                    }
                    r.mode = 29;
                  case 29:
                    N = 1;
                    break e;
                  case 30:
                    N = -3;
                    break e;
                  case 31:
                    return -4;
                  default:
                    return u;
                }
                return e.next_out = d, e.avail_out = m, e.next_in = h, e.avail_in = f, r.hold = g, r.bits = b, (r.wsize || _ !== e.avail_out && r.mode < 30 && (r.mode < 27 || 4 !== t)) && w(e, e.output, e.next_out, _ - e.avail_out) ? (r.mode = 31, -4) : (v -= e.avail_in, _ -= e.avail_out, e.total_in += v, e.total_out += _, r.total += _, r.wrap && _ && (e.adler = r.check = r.flags ? i(r.check, p, _, e.next_out - _) : o(r.check, p, _, e.next_out - _)), e.data_type = r.bits + (r.last ? 64 : 0) + (12 === r.mode ? 128 : 0) + (20 === r.mode || 15 === r.mode ? 256 : 0), (0 == v && 0 === _ || 4 === t) && 0 === N && (N = -5), N);
              }, r.inflateEnd = function (e) {
                if (!e || !e.state) return u;
                var t = e.state;
                return t.window && (t.window = null), e.state = null, 0;
              }, r.inflateGetHeader = function (e, t) {
                var r;
                return e && e.state ? 0 == (2 & (r = e.state).wrap) ? u : ((r.head = t).done = !1, 0) : u;
              }, r.inflateSetDictionary = function (e, t) {
                var r,
                  n = t.length;
                return e && e.state ? 0 !== (r = e.state).wrap && 11 !== r.mode ? u : 11 === r.mode && o(1, t, n, 0) !== r.check ? -3 : w(e, t, n, n) ? (r.mode = 31, -4) : (r.havedict = 1, 0) : u;
              }, r.inflateInfo = "pako inflate (from Nodeca project)";
            }, {
              "../utils/common": 41,
              "./adler32": 43,
              "./crc32": 45,
              "./inffast": 48,
              "./inftrees": 50
            }],
            50: [function (e, t, r) {
              "use strict";

              var n = e("../utils/common"),
                o = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
                i = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
                s = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
                a = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
              t.exports = function (e, t, r, u, c, l, p, h) {
                var d,
                  f,
                  m,
                  g,
                  b,
                  y,
                  w,
                  v,
                  _,
                  x = h.bits,
                  E = 0,
                  T = 0,
                  O = 0,
                  S = 0,
                  A = 0,
                  P = 0,
                  C = 0,
                  R = 0,
                  I = 0,
                  N = 0,
                  M = null,
                  k = 0,
                  D = new n.Buf16(16),
                  j = new n.Buf16(16),
                  F = null,
                  B = 0;
                for (E = 0; E <= 15; E++) D[E] = 0;
                for (T = 0; T < u; T++) D[t[r + T]]++;
                for (A = x, S = 15; 1 <= S && 0 === D[S]; S--);
                if (S < A && (A = S), 0 === S) return c[l++] = 20971520, c[l++] = 20971520, h.bits = 1, 0;
                for (O = 1; O < S && 0 === D[O]; O++);
                for (A < O && (A = O), E = R = 1; E <= 15; E++) if (R <<= 1, (R -= D[E]) < 0) return -1;
                if (0 < R && (0 === e || 1 !== S)) return -1;
                for (j[1] = 0, E = 1; E < 15; E++) j[E + 1] = j[E] + D[E];
                for (T = 0; T < u; T++) 0 !== t[r + T] && (p[j[t[r + T]]++] = T);
                if (y = 0 === e ? (M = F = p, 19) : 1 === e ? (M = o, k -= 257, F = i, B -= 257, 256) : (M = s, F = a, -1), E = O, b = l, C = T = N = 0, m = -1, g = (I = 1 << (P = A)) - 1, 1 === e && 852 < I || 2 === e && 592 < I) return 1;
                for (;;) {
                  for (w = E - C, _ = p[T] < y ? (v = 0, p[T]) : p[T] > y ? (v = F[B + p[T]], M[k + p[T]]) : (v = 96, 0), d = 1 << E - C, O = f = 1 << P; c[b + (N >> C) + (f -= d)] = w << 24 | v << 16 | _ | 0, 0 !== f;);
                  for (d = 1 << E - 1; N & d;) d >>= 1;
                  if (0 !== d ? (N &= d - 1, N += d) : N = 0, T++, 0 == --D[E]) {
                    if (E === S) break;
                    E = t[r + p[T]];
                  }
                  if (A < E && (N & g) !== m) {
                    for (0 === C && (C = A), b += O, R = 1 << (P = E - C); P + C < S && !((R -= D[P + C]) <= 0);) P++, R <<= 1;
                    if (I += 1 << P, 1 === e && 852 < I || 2 === e && 592 < I) return 1;
                    c[m = N & g] = A << 24 | P << 16 | b - l | 0;
                  }
                }
                return 0 !== N && (c[b + N] = E - C << 24 | 64 << 16 | 0), h.bits = A, 0;
              };
            }, {
              "../utils/common": 41
            }],
            51: [function (e, t, r) {
              "use strict";

              t.exports = {
                2: "need dictionary",
                1: "stream end",
                0: "",
                "-1": "file error",
                "-2": "stream error",
                "-3": "data error",
                "-4": "insufficient memory",
                "-5": "buffer error",
                "-6": "incompatible version"
              };
            }, {}],
            52: [function (e, t, r) {
              "use strict";

              var n = e("../utils/common");
              function o(e) {
                for (var t = e.length; 0 <= --t;) e[t] = 0;
              }
              var i = 256,
                s = 286,
                a = 30,
                u = 15,
                c = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
                l = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
                p = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
                h = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
                d = new Array(576);
              o(d);
              var f = new Array(60);
              o(f);
              var m = new Array(512);
              o(m);
              var g = new Array(256);
              o(g);
              var b = new Array(29);
              o(b);
              var y,
                w,
                v,
                _ = new Array(a);
              function x(e, t, r, n, o) {
                this.static_tree = e, this.extra_bits = t, this.extra_base = r, this.elems = n, this.max_length = o, this.has_stree = e && e.length;
              }
              function E(e, t) {
                this.dyn_tree = e, this.max_code = 0, this.stat_desc = t;
              }
              function T(e) {
                return e < 256 ? m[e] : m[256 + (e >>> 7)];
              }
              function O(e, t) {
                e.pending_buf[e.pending++] = 255 & t, e.pending_buf[e.pending++] = t >>> 8 & 255;
              }
              function S(e, t, r) {
                e.bi_valid > 16 - r ? (e.bi_buf |= t << e.bi_valid & 65535, O(e, e.bi_buf), e.bi_buf = t >> 16 - e.bi_valid, e.bi_valid += r - 16) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += r);
              }
              function A(e, t, r) {
                S(e, r[2 * t], r[2 * t + 1]);
              }
              function P(e, t) {
                for (var r = 0; r |= 1 & e, e >>>= 1, r <<= 1, 0 < --t;);
                return r >>> 1;
              }
              function C(e, t, r) {
                var n,
                  o,
                  i = new Array(16),
                  s = 0;
                for (n = 1; n <= u; n++) i[n] = s = s + r[n - 1] << 1;
                for (o = 0; o <= t; o++) {
                  var a = e[2 * o + 1];
                  0 !== a && (e[2 * o] = P(i[a]++, a));
                }
              }
              function R(e) {
                var t;
                for (t = 0; t < s; t++) e.dyn_ltree[2 * t] = 0;
                for (t = 0; t < a; t++) e.dyn_dtree[2 * t] = 0;
                for (t = 0; t < 19; t++) e.bl_tree[2 * t] = 0;
                e.dyn_ltree[512] = 1, e.opt_len = e.static_len = 0, e.last_lit = e.matches = 0;
              }
              function I(e) {
                8 < e.bi_valid ? O(e, e.bi_buf) : 0 < e.bi_valid && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
              }
              function N(e, t, r, n) {
                var o = 2 * t,
                  i = 2 * r;
                return e[o] < e[i] || e[o] === e[i] && n[t] <= n[r];
              }
              function M(e, t, r) {
                for (var n = e.heap[r], o = r << 1; o <= e.heap_len && (o < e.heap_len && N(t, e.heap[o + 1], e.heap[o], e.depth) && o++, !N(t, n, e.heap[o], e.depth));) e.heap[r] = e.heap[o], r = o, o <<= 1;
                e.heap[r] = n;
              }
              function k(e, t, r) {
                var n,
                  o,
                  s,
                  a,
                  u = 0;
                if (0 !== e.last_lit) for (; n = e.pending_buf[e.d_buf + 2 * u] << 8 | e.pending_buf[e.d_buf + 2 * u + 1], o = e.pending_buf[e.l_buf + u], u++, 0 === n ? A(e, o, t) : (A(e, (s = g[o]) + i + 1, t), 0 !== (a = c[s]) && S(e, o -= b[s], a), A(e, s = T(--n), r), 0 !== (a = l[s]) && S(e, n -= _[s], a)), u < e.last_lit;);
                A(e, 256, t);
              }
              function D(e, t) {
                var r,
                  n,
                  o,
                  i = t.dyn_tree,
                  s = t.stat_desc.static_tree,
                  a = t.stat_desc.has_stree,
                  c = t.stat_desc.elems,
                  l = -1;
                for (e.heap_len = 0, e.heap_max = 573, r = 0; r < c; r++) 0 !== i[2 * r] ? (e.heap[++e.heap_len] = l = r, e.depth[r] = 0) : i[2 * r + 1] = 0;
                for (; e.heap_len < 2;) i[2 * (o = e.heap[++e.heap_len] = l < 2 ? ++l : 0)] = 1, e.depth[o] = 0, e.opt_len--, a && (e.static_len -= s[2 * o + 1]);
                for (t.max_code = l, r = e.heap_len >> 1; 1 <= r; r--) M(e, i, r);
                for (o = c; r = e.heap[1], e.heap[1] = e.heap[e.heap_len--], M(e, i, 1), n = e.heap[1], e.heap[--e.heap_max] = r, e.heap[--e.heap_max] = n, i[2 * o] = i[2 * r] + i[2 * n], e.depth[o] = (e.depth[r] >= e.depth[n] ? e.depth[r] : e.depth[n]) + 1, i[2 * r + 1] = i[2 * n + 1] = o, e.heap[1] = o++, M(e, i, 1), 2 <= e.heap_len;);
                e.heap[--e.heap_max] = e.heap[1], function (e, t) {
                  var r,
                    n,
                    o,
                    i,
                    s,
                    a,
                    c = t.dyn_tree,
                    l = t.max_code,
                    p = t.stat_desc.static_tree,
                    h = t.stat_desc.has_stree,
                    d = t.stat_desc.extra_bits,
                    f = t.stat_desc.extra_base,
                    m = t.stat_desc.max_length,
                    g = 0;
                  for (i = 0; i <= u; i++) e.bl_count[i] = 0;
                  for (c[2 * e.heap[e.heap_max] + 1] = 0, r = e.heap_max + 1; r < 573; r++) m < (i = c[2 * c[2 * (n = e.heap[r]) + 1] + 1] + 1) && (i = m, g++), c[2 * n + 1] = i, l < n || (e.bl_count[i]++, s = 0, f <= n && (s = d[n - f]), a = c[2 * n], e.opt_len += a * (i + s), h && (e.static_len += a * (p[2 * n + 1] + s)));
                  if (0 !== g) {
                    do {
                      for (i = m - 1; 0 === e.bl_count[i];) i--;
                      e.bl_count[i]--, e.bl_count[i + 1] += 2, e.bl_count[m]--, g -= 2;
                    } while (0 < g);
                    for (i = m; 0 !== i; i--) for (n = e.bl_count[i]; 0 !== n;) l < (o = e.heap[--r]) || (c[2 * o + 1] !== i && (e.opt_len += (i - c[2 * o + 1]) * c[2 * o], c[2 * o + 1] = i), n--);
                  }
                }(e, t), C(i, l, e.bl_count);
              }
              function j(e, t, r) {
                var n,
                  o,
                  i = -1,
                  s = t[1],
                  a = 0,
                  u = 7,
                  c = 4;
                for (0 === s && (u = 138, c = 3), t[2 * (r + 1) + 1] = 65535, n = 0; n <= r; n++) o = s, s = t[2 * (n + 1) + 1], ++a < u && o === s || (a < c ? e.bl_tree[2 * o] += a : 0 !== o ? (o !== i && e.bl_tree[2 * o]++, e.bl_tree[32]++) : a <= 10 ? e.bl_tree[34]++ : e.bl_tree[36]++, i = o, c = (a = 0) === s ? (u = 138, 3) : o === s ? (u = 6, 3) : (u = 7, 4));
              }
              function F(e, t, r) {
                var n,
                  o,
                  i = -1,
                  s = t[1],
                  a = 0,
                  u = 7,
                  c = 4;
                for (0 === s && (u = 138, c = 3), n = 0; n <= r; n++) if (o = s, s = t[2 * (n + 1) + 1], !(++a < u && o === s)) {
                  if (a < c) for (; A(e, o, e.bl_tree), 0 != --a;);else 0 !== o ? (o !== i && (A(e, o, e.bl_tree), a--), A(e, 16, e.bl_tree), S(e, a - 3, 2)) : a <= 10 ? (A(e, 17, e.bl_tree), S(e, a - 3, 3)) : (A(e, 18, e.bl_tree), S(e, a - 11, 7));
                  i = o, c = (a = 0) === s ? (u = 138, 3) : o === s ? (u = 6, 3) : (u = 7, 4);
                }
              }
              o(_);
              var B = !1;
              function L(e, t, r, o) {
                S(e, 0 + (o ? 1 : 0), 3), function (e, t, r, o) {
                  I(e), O(e, r), O(e, ~r), n.arraySet(e.pending_buf, e.window, t, r, e.pending), e.pending += r;
                }(e, t, r);
              }
              r._tr_init = function (e) {
                B || (function () {
                  var e,
                    t,
                    r,
                    n,
                    o,
                    i = new Array(16);
                  for (n = r = 0; n < 28; n++) for (b[n] = r, e = 0; e < 1 << c[n]; e++) g[r++] = n;
                  for (g[r - 1] = n, n = o = 0; n < 16; n++) for (_[n] = o, e = 0; e < 1 << l[n]; e++) m[o++] = n;
                  for (o >>= 7; n < a; n++) for (_[n] = o << 7, e = 0; e < 1 << l[n] - 7; e++) m[256 + o++] = n;
                  for (t = 0; t <= u; t++) i[t] = 0;
                  for (e = 0; e <= 143;) d[2 * e + 1] = 8, e++, i[8]++;
                  for (; e <= 255;) d[2 * e + 1] = 9, e++, i[9]++;
                  for (; e <= 279;) d[2 * e + 1] = 7, e++, i[7]++;
                  for (; e <= 287;) d[2 * e + 1] = 8, e++, i[8]++;
                  for (C(d, 287, i), e = 0; e < a; e++) f[2 * e + 1] = 5, f[2 * e] = P(e, 5);
                  y = new x(d, c, 257, s, u), w = new x(f, l, 0, a, u), v = new x(new Array(0), p, 0, 19, 7);
                }(), B = !0), e.l_desc = new E(e.dyn_ltree, y), e.d_desc = new E(e.dyn_dtree, w), e.bl_desc = new E(e.bl_tree, v), e.bi_buf = 0, e.bi_valid = 0, R(e);
              }, r._tr_stored_block = L, r._tr_flush_block = function (e, t, r, n) {
                var o,
                  s,
                  a = 0;
                0 < e.level ? (2 === e.strm.data_type && (e.strm.data_type = function (e) {
                  var t,
                    r = 4093624447;
                  for (t = 0; t <= 31; t++, r >>>= 1) if (1 & r && 0 !== e.dyn_ltree[2 * t]) return 0;
                  if (0 !== e.dyn_ltree[18] || 0 !== e.dyn_ltree[20] || 0 !== e.dyn_ltree[26]) return 1;
                  for (t = 32; t < i; t++) if (0 !== e.dyn_ltree[2 * t]) return 1;
                  return 0;
                }(e)), D(e, e.l_desc), D(e, e.d_desc), a = function (e) {
                  var t;
                  for (j(e, e.dyn_ltree, e.l_desc.max_code), j(e, e.dyn_dtree, e.d_desc.max_code), D(e, e.bl_desc), t = 18; 3 <= t && 0 === e.bl_tree[2 * h[t] + 1]; t--);
                  return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
                }(e), o = e.opt_len + 3 + 7 >>> 3, (s = e.static_len + 3 + 7 >>> 3) <= o && (o = s)) : o = s = r + 5, r + 4 <= o && -1 !== t ? L(e, t, r, n) : 4 === e.strategy || s === o ? (S(e, 2 + (n ? 1 : 0), 3), k(e, d, f)) : (S(e, 4 + (n ? 1 : 0), 3), function (e, t, r, n) {
                  var o;
                  for (S(e, t - 257, 5), S(e, r - 1, 5), S(e, n - 4, 4), o = 0; o < n; o++) S(e, e.bl_tree[2 * h[o] + 1], 3);
                  F(e, e.dyn_ltree, t - 1), F(e, e.dyn_dtree, r - 1);
                }(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, a + 1), k(e, e.dyn_ltree, e.dyn_dtree)), R(e), n && I(e);
              }, r._tr_tally = function (e, t, r) {
                return e.pending_buf[e.d_buf + 2 * e.last_lit] = t >>> 8 & 255, e.pending_buf[e.d_buf + 2 * e.last_lit + 1] = 255 & t, e.pending_buf[e.l_buf + e.last_lit] = 255 & r, e.last_lit++, 0 === t ? e.dyn_ltree[2 * r]++ : (e.matches++, t--, e.dyn_ltree[2 * (g[r] + i + 1)]++, e.dyn_dtree[2 * T(t)]++), e.last_lit === e.lit_bufsize - 1;
              }, r._tr_align = function (e) {
                S(e, 2, 3), A(e, 256, d), function (e) {
                  16 === e.bi_valid ? (O(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : 8 <= e.bi_valid && (e.pending_buf[e.pending++] = 255 & e.bi_buf, e.bi_buf >>= 8, e.bi_valid -= 8);
                }(e);
              };
            }, {
              "../utils/common": 41
            }],
            53: [function (e, t, r) {
              "use strict";

              t.exports = function () {
                this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
              };
            }, {}],
            54: [function (e, t, r) {
              "use strict";

              t.exports = "function" == typeof setImmediate ? setImmediate : function () {
                var e = [].slice.apply(arguments);
                e.splice(1, 0, 0), setTimeout.apply(null, e);
              };
            }, {}]
          }, {}, [10])(10);
        },
        4155: function _(e) {
          var t,
            r,
            n = e.exports = {};
          function o() {
            throw new Error("setTimeout has not been defined");
          }
          function i() {
            throw new Error("clearTimeout has not been defined");
          }
          function s(e) {
            if (t === setTimeout) return setTimeout(e, 0);
            if ((t === o || !t) && setTimeout) return t = setTimeout, setTimeout(e, 0);
            try {
              return t(e, 0);
            } catch (r) {
              try {
                return t.call(null, e, 0);
              } catch (r) {
                return t.call(this, e, 0);
              }
            }
          }
          !function () {
            try {
              t = "function" == typeof setTimeout ? setTimeout : o;
            } catch (e) {
              t = o;
            }
            try {
              r = "function" == typeof clearTimeout ? clearTimeout : i;
            } catch (e) {
              r = i;
            }
          }();
          var a,
            u = [],
            c = !1,
            l = -1;
          function p() {
            c && a && (c = !1, a.length ? u = a.concat(u) : l = -1, u.length && h());
          }
          function h() {
            if (!c) {
              var e = s(p);
              c = !0;
              for (var t = u.length; t;) {
                for (a = u, u = []; ++l < t;) a && a[l].run();
                l = -1, t = u.length;
              }
              a = null, c = !1, function (e) {
                if (r === clearTimeout) return clearTimeout(e);
                if ((r === i || !r) && clearTimeout) return r = clearTimeout, clearTimeout(e);
                try {
                  r(e);
                } catch (t) {
                  try {
                    return r.call(null, e);
                  } catch (t) {
                    return r.call(this, e);
                  }
                }
              }(e);
            }
          }
          function d(e, t) {
            this.fun = e, this.array = t;
          }
          function f() {}
          n.nextTick = function (e) {
            var t = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
            u.push(new d(e, t)), 1 !== u.length || c || s(h);
          }, d.prototype.run = function () {
            this.fun.apply(null, this.array);
          }, n.title = "browser", n.browser = !0, n.env = {}, n.argv = [], n.version = "", n.versions = {}, n.on = f, n.addListener = f, n.once = f, n.off = f, n.removeListener = f, n.removeAllListeners = f, n.emit = f, n.prependListener = f, n.prependOnceListener = f, n.listeners = function (e) {
            return [];
          }, n.binding = function (e) {
            throw new Error("process.binding is not supported");
          }, n.cwd = function () {
            return "/";
          }, n.chdir = function (e) {
            throw new Error("process.chdir is not supported");
          }, n.umask = function () {
            return 0;
          };
        },
        9509: function _(e, t, r) {
          var n = r(8764),
            o = n.Buffer;
          function i(e, t) {
            for (var r in e) t[r] = e[r];
          }
          function s(e, t, r) {
            return o(e, t, r);
          }
          o.from && o.alloc && o.allocUnsafe && o.allocUnsafeSlow ? e.exports = n : (i(n, t), t.Buffer = s), i(o, s), s.from = function (e, t, r) {
            if ("number" == typeof e) throw new TypeError("Argument must not be a number");
            return o(e, t, r);
          }, s.alloc = function (e, t, r) {
            if ("number" != typeof e) throw new TypeError("Argument must be a number");
            var n = o(e);
            return void 0 !== t ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0), n;
          }, s.allocUnsafe = function (e) {
            if ("number" != typeof e) throw new TypeError("Argument must be a number");
            return o(e);
          }, s.allocUnsafeSlow = function (e) {
            if ("number" != typeof e) throw new TypeError("Argument must be a number");
            return n.SlowBuffer(e);
          };
        },
        6099: function _(e, t, r) {
          !function (e) {
            e.parser = function (e, t) {
              return new o(e, t);
            }, e.SAXParser = o, e.SAXStream = s, e.createStream = function (e, t) {
              return new s(e, t);
            }, e.MAX_BUFFER_LENGTH = 65536;
            var t,
              n = ["comment", "sgmlDecl", "textNode", "tagName", "doctype", "procInstName", "procInstBody", "entity", "attribName", "attribValue", "cdata", "script"];
            function o(t, r) {
              if (!(this instanceof o)) return new o(t, r);
              var i = this;
              !function (e) {
                for (var t = 0, r = n.length; t < r; t++) e[n[t]] = "";
              }(i), i.q = i.c = "", i.bufferCheckPosition = e.MAX_BUFFER_LENGTH, i.opt = r || {}, i.opt.lowercase = i.opt.lowercase || i.opt.lowercasetags, i.looseCase = i.opt.lowercase ? "toLowerCase" : "toUpperCase", i.tags = [], i.closed = i.closedRoot = i.sawRoot = !1, i.tag = i.error = null, i.strict = !!t, i.noscript = !(!t && !i.opt.noscript), i.state = x.BEGIN, i.strictEntities = i.opt.strictEntities, i.ENTITIES = i.strictEntities ? Object.create(e.XML_ENTITIES) : Object.create(e.ENTITIES), i.attribList = [], i.opt.xmlns && (i.ns = Object.create(c)), i.trackPosition = !1 !== i.opt.position, i.trackPosition && (i.position = i.line = i.column = 0), T(i, "onready");
            }
            e.EVENTS = ["text", "processinginstruction", "sgmldeclaration", "doctype", "comment", "opentagstart", "attribute", "opentag", "closetag", "opencdata", "cdata", "closecdata", "error", "end", "ready", "script", "opennamespace", "closenamespace"], Object.create || (Object.create = function (e) {
              function t() {}
              return t.prototype = e, new t();
            }), Object.keys || (Object.keys = function (e) {
              var t = [];
              for (var r in e) e.hasOwnProperty(r) && t.push(r);
              return t;
            }), o.prototype = {
              end: function end() {
                C(this);
              },
              write: function write(t) {
                var r = this;
                if (this.error) throw this.error;
                if (r.closed) return P(r, "Cannot write after close. Assign an onready handler.");
                if (null === t) return C(r);
                "object" == _typeof(t) && (t = t.toString());
                for (var o = 0, i = ""; i = B(t, o++), r.c = i, i;) switch (r.trackPosition && (r.position++, "\n" === i ? (r.line++, r.column = 0) : r.column++), r.state) {
                  case x.BEGIN:
                    if (r.state = x.BEGIN_WHITESPACE, "\uFEFF" === i) continue;
                    F(r, i);
                    continue;
                  case x.BEGIN_WHITESPACE:
                    F(r, i);
                    continue;
                  case x.TEXT:
                    if (r.sawRoot && !r.closedRoot) {
                      for (var s = o - 1; i && "<" !== i && "&" !== i;) (i = B(t, o++)) && r.trackPosition && (r.position++, "\n" === i ? (r.line++, r.column = 0) : r.column++);
                      r.textNode += t.substring(s, o - 1);
                    }
                    "<" !== i || r.sawRoot && r.closedRoot && !r.strict ? (f(i) || r.sawRoot && !r.closedRoot || R(r, "Text data outside of root node."), "&" === i ? r.state = x.TEXT_ENTITY : r.textNode += i) : (r.state = x.OPEN_WAKA, r.startTagPosition = r.position);
                    continue;
                  case x.SCRIPT:
                    "<" === i ? r.state = x.SCRIPT_ENDING : r.script += i;
                    continue;
                  case x.SCRIPT_ENDING:
                    "/" === i ? r.state = x.CLOSE_TAG : (r.script += "<" + i, r.state = x.SCRIPT);
                    continue;
                  case x.OPEN_WAKA:
                    if ("!" === i) r.state = x.SGML_DECL, r.sgmlDecl = "";else if (f(i)) ;else if (b(l, i)) r.state = x.OPEN_TAG, r.tagName = i;else if ("/" === i) r.state = x.CLOSE_TAG, r.tagName = "";else if ("?" === i) r.state = x.PROC_INST, r.procInstName = r.procInstBody = "";else {
                      if (R(r, "Unencoded <"), r.startTagPosition + 1 < r.position) {
                        var a = r.position - r.startTagPosition;
                        i = new Array(a).join(" ") + i;
                      }
                      r.textNode += "<" + i, r.state = x.TEXT;
                    }
                    continue;
                  case x.SGML_DECL:
                    "[CDATA[" === (r.sgmlDecl + i).toUpperCase() ? (O(r, "onopencdata"), r.state = x.CDATA, r.sgmlDecl = "", r.cdata = "") : r.sgmlDecl + i === "--" ? (r.state = x.COMMENT, r.comment = "", r.sgmlDecl = "") : "DOCTYPE" === (r.sgmlDecl + i).toUpperCase() ? (r.state = x.DOCTYPE, (r.doctype || r.sawRoot) && R(r, "Inappropriately located doctype declaration"), r.doctype = "", r.sgmlDecl = "") : ">" === i ? (O(r, "onsgmldeclaration", r.sgmlDecl), r.sgmlDecl = "", r.state = x.TEXT) : m(i) ? (r.state = x.SGML_DECL_QUOTED, r.sgmlDecl += i) : r.sgmlDecl += i;
                    continue;
                  case x.SGML_DECL_QUOTED:
                    i === r.q && (r.state = x.SGML_DECL, r.q = ""), r.sgmlDecl += i;
                    continue;
                  case x.DOCTYPE:
                    ">" === i ? (r.state = x.TEXT, O(r, "ondoctype", r.doctype), r.doctype = !0) : (r.doctype += i, "[" === i ? r.state = x.DOCTYPE_DTD : m(i) && (r.state = x.DOCTYPE_QUOTED, r.q = i));
                    continue;
                  case x.DOCTYPE_QUOTED:
                    r.doctype += i, i === r.q && (r.q = "", r.state = x.DOCTYPE);
                    continue;
                  case x.DOCTYPE_DTD:
                    r.doctype += i, "]" === i ? r.state = x.DOCTYPE : m(i) && (r.state = x.DOCTYPE_DTD_QUOTED, r.q = i);
                    continue;
                  case x.DOCTYPE_DTD_QUOTED:
                    r.doctype += i, i === r.q && (r.state = x.DOCTYPE_DTD, r.q = "");
                    continue;
                  case x.COMMENT:
                    "-" === i ? r.state = x.COMMENT_ENDING : r.comment += i;
                    continue;
                  case x.COMMENT_ENDING:
                    "-" === i ? (r.state = x.COMMENT_ENDED, r.comment = A(r.opt, r.comment), r.comment && O(r, "oncomment", r.comment), r.comment = "") : (r.comment += "-" + i, r.state = x.COMMENT);
                    continue;
                  case x.COMMENT_ENDED:
                    ">" !== i ? (R(r, "Malformed comment"), r.comment += "--" + i, r.state = x.COMMENT) : r.state = x.TEXT;
                    continue;
                  case x.CDATA:
                    "]" === i ? r.state = x.CDATA_ENDING : r.cdata += i;
                    continue;
                  case x.CDATA_ENDING:
                    "]" === i ? r.state = x.CDATA_ENDING_2 : (r.cdata += "]" + i, r.state = x.CDATA);
                    continue;
                  case x.CDATA_ENDING_2:
                    ">" === i ? (r.cdata && O(r, "oncdata", r.cdata), O(r, "onclosecdata"), r.cdata = "", r.state = x.TEXT) : "]" === i ? r.cdata += "]" : (r.cdata += "]]" + i, r.state = x.CDATA);
                    continue;
                  case x.PROC_INST:
                    "?" === i ? r.state = x.PROC_INST_ENDING : f(i) ? r.state = x.PROC_INST_BODY : r.procInstName += i;
                    continue;
                  case x.PROC_INST_BODY:
                    if (!r.procInstBody && f(i)) continue;
                    "?" === i ? r.state = x.PROC_INST_ENDING : r.procInstBody += i;
                    continue;
                  case x.PROC_INST_ENDING:
                    ">" === i ? (O(r, "onprocessinginstruction", {
                      name: r.procInstName,
                      body: r.procInstBody
                    }), r.procInstName = r.procInstBody = "", r.state = x.TEXT) : (r.procInstBody += "?" + i, r.state = x.PROC_INST_BODY);
                    continue;
                  case x.OPEN_TAG:
                    b(p, i) ? r.tagName += i : (I(r), ">" === i ? k(r) : "/" === i ? r.state = x.OPEN_TAG_SLASH : (f(i) || R(r, "Invalid character in tag name"), r.state = x.ATTRIB));
                    continue;
                  case x.OPEN_TAG_SLASH:
                    ">" === i ? (k(r, !0), D(r)) : (R(r, "Forward-slash in opening tag not followed by >"), r.state = x.ATTRIB);
                    continue;
                  case x.ATTRIB:
                    if (f(i)) continue;
                    ">" === i ? k(r) : "/" === i ? r.state = x.OPEN_TAG_SLASH : b(l, i) ? (r.attribName = i, r.attribValue = "", r.state = x.ATTRIB_NAME) : R(r, "Invalid attribute name");
                    continue;
                  case x.ATTRIB_NAME:
                    "=" === i ? r.state = x.ATTRIB_VALUE : ">" === i ? (R(r, "Attribute without value"), r.attribValue = r.attribName, M(r), k(r)) : f(i) ? r.state = x.ATTRIB_NAME_SAW_WHITE : b(p, i) ? r.attribName += i : R(r, "Invalid attribute name");
                    continue;
                  case x.ATTRIB_NAME_SAW_WHITE:
                    if ("=" === i) r.state = x.ATTRIB_VALUE;else {
                      if (f(i)) continue;
                      R(r, "Attribute without value"), r.tag.attributes[r.attribName] = "", r.attribValue = "", O(r, "onattribute", {
                        name: r.attribName,
                        value: ""
                      }), r.attribName = "", ">" === i ? k(r) : b(l, i) ? (r.attribName = i, r.state = x.ATTRIB_NAME) : (R(r, "Invalid attribute name"), r.state = x.ATTRIB);
                    }
                    continue;
                  case x.ATTRIB_VALUE:
                    if (f(i)) continue;
                    m(i) ? (r.q = i, r.state = x.ATTRIB_VALUE_QUOTED) : (R(r, "Unquoted attribute value"), r.state = x.ATTRIB_VALUE_UNQUOTED, r.attribValue = i);
                    continue;
                  case x.ATTRIB_VALUE_QUOTED:
                    if (i !== r.q) {
                      "&" === i ? r.state = x.ATTRIB_VALUE_ENTITY_Q : r.attribValue += i;
                      continue;
                    }
                    M(r), r.q = "", r.state = x.ATTRIB_VALUE_CLOSED;
                    continue;
                  case x.ATTRIB_VALUE_CLOSED:
                    f(i) ? r.state = x.ATTRIB : ">" === i ? k(r) : "/" === i ? r.state = x.OPEN_TAG_SLASH : b(l, i) ? (R(r, "No whitespace between attributes"), r.attribName = i, r.attribValue = "", r.state = x.ATTRIB_NAME) : R(r, "Invalid attribute name");
                    continue;
                  case x.ATTRIB_VALUE_UNQUOTED:
                    if (!g(i)) {
                      "&" === i ? r.state = x.ATTRIB_VALUE_ENTITY_U : r.attribValue += i;
                      continue;
                    }
                    M(r), ">" === i ? k(r) : r.state = x.ATTRIB;
                    continue;
                  case x.CLOSE_TAG:
                    if (r.tagName) ">" === i ? D(r) : b(p, i) ? r.tagName += i : r.script ? (r.script += "</" + r.tagName, r.tagName = "", r.state = x.SCRIPT) : (f(i) || R(r, "Invalid tagname in closing tag"), r.state = x.CLOSE_TAG_SAW_WHITE);else {
                      if (f(i)) continue;
                      y(l, i) ? r.script ? (r.script += "</" + i, r.state = x.SCRIPT) : R(r, "Invalid tagname in closing tag.") : r.tagName = i;
                    }
                    continue;
                  case x.CLOSE_TAG_SAW_WHITE:
                    if (f(i)) continue;
                    ">" === i ? D(r) : R(r, "Invalid characters in closing tag");
                    continue;
                  case x.TEXT_ENTITY:
                  case x.ATTRIB_VALUE_ENTITY_Q:
                  case x.ATTRIB_VALUE_ENTITY_U:
                    var u, c;
                    switch (r.state) {
                      case x.TEXT_ENTITY:
                        u = x.TEXT, c = "textNode";
                        break;
                      case x.ATTRIB_VALUE_ENTITY_Q:
                        u = x.ATTRIB_VALUE_QUOTED, c = "attribValue";
                        break;
                      case x.ATTRIB_VALUE_ENTITY_U:
                        u = x.ATTRIB_VALUE_UNQUOTED, c = "attribValue";
                    }
                    ";" === i ? (r[c] += j(r), r.entity = "", r.state = u) : b(r.entity.length ? d : h, i) ? r.entity += i : (R(r, "Invalid character in entity name"), r[c] += "&" + r.entity + i, r.entity = "", r.state = u);
                    continue;
                  default:
                    throw new Error(r, "Unknown state: " + r.state);
                }
                return r.position >= r.bufferCheckPosition && function (t) {
                  for (var r = Math.max(e.MAX_BUFFER_LENGTH, 10), o = 0, i = 0, s = n.length; i < s; i++) {
                    var a = t[n[i]].length;
                    if (a > r) switch (n[i]) {
                      case "textNode":
                        S(t);
                        break;
                      case "cdata":
                        O(t, "oncdata", t.cdata), t.cdata = "";
                        break;
                      case "script":
                        O(t, "onscript", t.script), t.script = "";
                        break;
                      default:
                        P(t, "Max buffer length exceeded: " + n[i]);
                    }
                    o = Math.max(o, a);
                  }
                  var u = e.MAX_BUFFER_LENGTH - o;
                  t.bufferCheckPosition = u + t.position;
                }(r), r;
              },
              resume: function resume() {
                return this.error = null, this;
              },
              close: function close() {
                return this.write(null);
              },
              flush: function flush() {
                var e;
                S(e = this), "" !== e.cdata && (O(e, "oncdata", e.cdata), e.cdata = ""), "" !== e.script && (O(e, "onscript", e.script), e.script = "");
              }
            };
            try {
              t = r(2830).Stream;
            } catch (e) {
              t = function t() {};
            }
            var i = e.EVENTS.filter(function (e) {
              return "error" !== e && "end" !== e;
            });
            function s(e, r) {
              if (!(this instanceof s)) return new s(e, r);
              t.apply(this), this._parser = new o(e, r), this.writable = !0, this.readable = !0;
              var n = this;
              this._parser.onend = function () {
                n.emit("end");
              }, this._parser.onerror = function (e) {
                n.emit("error", e), n._parser.error = null;
              }, this._decoder = null, i.forEach(function (e) {
                Object.defineProperty(n, "on" + e, {
                  get: function get() {
                    return n._parser["on" + e];
                  },
                  set: function set(t) {
                    if (!t) return n.removeAllListeners(e), n._parser["on" + e] = t, t;
                    n.on(e, t);
                  },
                  enumerable: !0,
                  configurable: !1
                });
              });
            }
            s.prototype = Object.create(t.prototype, {
              constructor: {
                value: s
              }
            }), s.prototype.write = function (e) {
              if ("function" == typeof Buffer && "function" == typeof Buffer.isBuffer && Buffer.isBuffer(e)) {
                if (!this._decoder) {
                  var t = r(2553).s;
                  this._decoder = new t("utf8");
                }
                e = this._decoder.write(e);
              }
              return this._parser.write(e.toString()), this.emit("data", e), !0;
            }, s.prototype.end = function (e) {
              return e && e.length && this.write(e), this._parser.end(), !0;
            }, s.prototype.on = function (e, r) {
              var n = this;
              return n._parser["on" + e] || -1 === i.indexOf(e) || (n._parser["on" + e] = function () {
                var t = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
                t.splice(0, 0, e), n.emit.apply(n, t);
              }), t.prototype.on.call(n, e, r);
            };
            var a = "http://www.w3.org/XML/1998/namespace",
              u = "http://www.w3.org/2000/xmlns/",
              c = {
                xml: a,
                xmlns: u
              },
              l = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
              p = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/,
              h = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
              d = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
            function f(e) {
              return " " === e || "\n" === e || "\r" === e || "\t" === e;
            }
            function m(e) {
              return '"' === e || "'" === e;
            }
            function g(e) {
              return ">" === e || f(e);
            }
            function b(e, t) {
              return e.test(t);
            }
            function y(e, t) {
              return !b(e, t);
            }
            var w,
              v,
              _,
              x = 0;
            for (var E in e.STATE = {
              BEGIN: x++,
              BEGIN_WHITESPACE: x++,
              TEXT: x++,
              TEXT_ENTITY: x++,
              OPEN_WAKA: x++,
              SGML_DECL: x++,
              SGML_DECL_QUOTED: x++,
              DOCTYPE: x++,
              DOCTYPE_QUOTED: x++,
              DOCTYPE_DTD: x++,
              DOCTYPE_DTD_QUOTED: x++,
              COMMENT_STARTING: x++,
              COMMENT: x++,
              COMMENT_ENDING: x++,
              COMMENT_ENDED: x++,
              CDATA: x++,
              CDATA_ENDING: x++,
              CDATA_ENDING_2: x++,
              PROC_INST: x++,
              PROC_INST_BODY: x++,
              PROC_INST_ENDING: x++,
              OPEN_TAG: x++,
              OPEN_TAG_SLASH: x++,
              ATTRIB: x++,
              ATTRIB_NAME: x++,
              ATTRIB_NAME_SAW_WHITE: x++,
              ATTRIB_VALUE: x++,
              ATTRIB_VALUE_QUOTED: x++,
              ATTRIB_VALUE_CLOSED: x++,
              ATTRIB_VALUE_UNQUOTED: x++,
              ATTRIB_VALUE_ENTITY_Q: x++,
              ATTRIB_VALUE_ENTITY_U: x++,
              CLOSE_TAG: x++,
              CLOSE_TAG_SAW_WHITE: x++,
              SCRIPT: x++,
              SCRIPT_ENDING: x++
            }, e.XML_ENTITIES = {
              amp: "&",
              gt: ">",
              lt: "<",
              quot: '"',
              apos: "'"
            }, e.ENTITIES = {
              amp: "&",
              gt: ">",
              lt: "<",
              quot: '"',
              apos: "'",
              AElig: 198,
              Aacute: 193,
              Acirc: 194,
              Agrave: 192,
              Aring: 197,
              Atilde: 195,
              Auml: 196,
              Ccedil: 199,
              ETH: 208,
              Eacute: 201,
              Ecirc: 202,
              Egrave: 200,
              Euml: 203,
              Iacute: 205,
              Icirc: 206,
              Igrave: 204,
              Iuml: 207,
              Ntilde: 209,
              Oacute: 211,
              Ocirc: 212,
              Ograve: 210,
              Oslash: 216,
              Otilde: 213,
              Ouml: 214,
              THORN: 222,
              Uacute: 218,
              Ucirc: 219,
              Ugrave: 217,
              Uuml: 220,
              Yacute: 221,
              aacute: 225,
              acirc: 226,
              aelig: 230,
              agrave: 224,
              aring: 229,
              atilde: 227,
              auml: 228,
              ccedil: 231,
              eacute: 233,
              ecirc: 234,
              egrave: 232,
              eth: 240,
              euml: 235,
              iacute: 237,
              icirc: 238,
              igrave: 236,
              iuml: 239,
              ntilde: 241,
              oacute: 243,
              ocirc: 244,
              ograve: 242,
              oslash: 248,
              otilde: 245,
              ouml: 246,
              szlig: 223,
              thorn: 254,
              uacute: 250,
              ucirc: 251,
              ugrave: 249,
              uuml: 252,
              yacute: 253,
              yuml: 255,
              copy: 169,
              reg: 174,
              nbsp: 160,
              iexcl: 161,
              cent: 162,
              pound: 163,
              curren: 164,
              yen: 165,
              brvbar: 166,
              sect: 167,
              uml: 168,
              ordf: 170,
              laquo: 171,
              not: 172,
              shy: 173,
              macr: 175,
              deg: 176,
              plusmn: 177,
              sup1: 185,
              sup2: 178,
              sup3: 179,
              acute: 180,
              micro: 181,
              para: 182,
              middot: 183,
              cedil: 184,
              ordm: 186,
              raquo: 187,
              frac14: 188,
              frac12: 189,
              frac34: 190,
              iquest: 191,
              times: 215,
              divide: 247,
              OElig: 338,
              oelig: 339,
              Scaron: 352,
              scaron: 353,
              Yuml: 376,
              fnof: 402,
              circ: 710,
              tilde: 732,
              Alpha: 913,
              Beta: 914,
              Gamma: 915,
              Delta: 916,
              Epsilon: 917,
              Zeta: 918,
              Eta: 919,
              Theta: 920,
              Iota: 921,
              Kappa: 922,
              Lambda: 923,
              Mu: 924,
              Nu: 925,
              Xi: 926,
              Omicron: 927,
              Pi: 928,
              Rho: 929,
              Sigma: 931,
              Tau: 932,
              Upsilon: 933,
              Phi: 934,
              Chi: 935,
              Psi: 936,
              Omega: 937,
              alpha: 945,
              beta: 946,
              gamma: 947,
              delta: 948,
              epsilon: 949,
              zeta: 950,
              eta: 951,
              theta: 952,
              iota: 953,
              kappa: 954,
              lambda: 955,
              mu: 956,
              nu: 957,
              xi: 958,
              omicron: 959,
              pi: 960,
              rho: 961,
              sigmaf: 962,
              sigma: 963,
              tau: 964,
              upsilon: 965,
              phi: 966,
              chi: 967,
              psi: 968,
              omega: 969,
              thetasym: 977,
              upsih: 978,
              piv: 982,
              ensp: 8194,
              emsp: 8195,
              thinsp: 8201,
              zwnj: 8204,
              zwj: 8205,
              lrm: 8206,
              rlm: 8207,
              ndash: 8211,
              mdash: 8212,
              lsquo: 8216,
              rsquo: 8217,
              sbquo: 8218,
              ldquo: 8220,
              rdquo: 8221,
              bdquo: 8222,
              dagger: 8224,
              Dagger: 8225,
              bull: 8226,
              hellip: 8230,
              permil: 8240,
              prime: 8242,
              Prime: 8243,
              lsaquo: 8249,
              rsaquo: 8250,
              oline: 8254,
              frasl: 8260,
              euro: 8364,
              image: 8465,
              weierp: 8472,
              real: 8476,
              trade: 8482,
              alefsym: 8501,
              larr: 8592,
              uarr: 8593,
              rarr: 8594,
              darr: 8595,
              harr: 8596,
              crarr: 8629,
              lArr: 8656,
              uArr: 8657,
              rArr: 8658,
              dArr: 8659,
              hArr: 8660,
              forall: 8704,
              part: 8706,
              exist: 8707,
              empty: 8709,
              nabla: 8711,
              isin: 8712,
              notin: 8713,
              ni: 8715,
              prod: 8719,
              sum: 8721,
              minus: 8722,
              lowast: 8727,
              radic: 8730,
              prop: 8733,
              infin: 8734,
              ang: 8736,
              and: 8743,
              or: 8744,
              cap: 8745,
              cup: 8746,
              int: 8747,
              there4: 8756,
              sim: 8764,
              cong: 8773,
              asymp: 8776,
              ne: 8800,
              equiv: 8801,
              le: 8804,
              ge: 8805,
              sub: 8834,
              sup: 8835,
              nsub: 8836,
              sube: 8838,
              supe: 8839,
              oplus: 8853,
              otimes: 8855,
              perp: 8869,
              sdot: 8901,
              lceil: 8968,
              rceil: 8969,
              lfloor: 8970,
              rfloor: 8971,
              lang: 9001,
              rang: 9002,
              loz: 9674,
              spades: 9824,
              clubs: 9827,
              hearts: 9829,
              diams: 9830
            }, Object.keys(e.ENTITIES).forEach(function (t) {
              var r = e.ENTITIES[t],
                n = "number" == typeof r ? String.fromCharCode(r) : r;
              e.ENTITIES[t] = n;
            }), e.STATE) e.STATE[e.STATE[E]] = E;
            function T(e, t, r) {
              e[t] && e[t](r);
            }
            function O(e, t, r) {
              e.textNode && S(e), T(e, t, r);
            }
            function S(e) {
              e.textNode = A(e.opt, e.textNode), e.textNode && T(e, "ontext", e.textNode), e.textNode = "";
            }
            function A(e, t) {
              return e.trim && (t = t.trim()), e.normalize && (t = t.replace(/\s+/g, " ")), t;
            }
            function P(e, t) {
              return S(e), e.trackPosition && (t += "\nLine: " + e.line + "\nColumn: " + e.column + "\nChar: " + e.c), t = new Error(t), e.error = t, T(e, "onerror", t), e;
            }
            function C(e) {
              return e.sawRoot && !e.closedRoot && R(e, "Unclosed root tag"), e.state !== x.BEGIN && e.state !== x.BEGIN_WHITESPACE && e.state !== x.TEXT && P(e, "Unexpected end"), S(e), e.c = "", e.closed = !0, T(e, "onend"), o.call(e, e.strict, e.opt), e;
            }
            function R(e, t) {
              if ("object" != _typeof(e) || !(e instanceof o)) throw new Error("bad call to strictFail");
              e.strict && P(e, t);
            }
            function I(e) {
              e.strict || (e.tagName = e.tagName[e.looseCase]());
              var t = e.tags[e.tags.length - 1] || e,
                r = e.tag = {
                  name: e.tagName,
                  attributes: {}
                };
              e.opt.xmlns && (r.ns = t.ns), e.attribList.length = 0, O(e, "onopentagstart", r);
            }
            function N(e, t) {
              var r = e.indexOf(":") < 0 ? ["", e] : e.split(":"),
                n = r[0],
                o = r[1];
              return t && "xmlns" === e && (n = "xmlns", o = ""), {
                prefix: n,
                local: o
              };
            }
            function M(e) {
              if (e.strict || (e.attribName = e.attribName[e.looseCase]()), -1 !== e.attribList.indexOf(e.attribName) || e.tag.attributes.hasOwnProperty(e.attribName)) e.attribName = e.attribValue = "";else {
                if (e.opt.xmlns) {
                  var t = N(e.attribName, !0),
                    r = t.prefix,
                    n = t.local;
                  if ("xmlns" === r) if ("xml" === n && e.attribValue !== a) R(e, "xml: prefix must be bound to " + a + "\nActual: " + e.attribValue);else if ("xmlns" === n && e.attribValue !== u) R(e, "xmlns: prefix must be bound to " + u + "\nActual: " + e.attribValue);else {
                    var o = e.tag,
                      i = e.tags[e.tags.length - 1] || e;
                    o.ns === i.ns && (o.ns = Object.create(i.ns)), o.ns[n] = e.attribValue;
                  }
                  e.attribList.push([e.attribName, e.attribValue]);
                } else e.tag.attributes[e.attribName] = e.attribValue, O(e, "onattribute", {
                  name: e.attribName,
                  value: e.attribValue
                });
                e.attribName = e.attribValue = "";
              }
            }
            function k(e, t) {
              if (e.opt.xmlns) {
                var r = e.tag,
                  n = N(e.tagName);
                r.prefix = n.prefix, r.local = n.local, r.uri = r.ns[n.prefix] || "", r.prefix && !r.uri && (R(e, "Unbound namespace prefix: " + JSON.stringify(e.tagName)), r.uri = n.prefix);
                var o = e.tags[e.tags.length - 1] || e;
                r.ns && o.ns !== r.ns && Object.keys(r.ns).forEach(function (t) {
                  O(e, "onopennamespace", {
                    prefix: t,
                    uri: r.ns[t]
                  });
                });
                for (var i = 0, s = e.attribList.length; i < s; i++) {
                  var a = e.attribList[i],
                    u = a[0],
                    c = a[1],
                    l = N(u, !0),
                    p = l.prefix,
                    h = l.local,
                    d = "" === p ? "" : r.ns[p] || "",
                    f = {
                      name: u,
                      value: c,
                      prefix: p,
                      local: h,
                      uri: d
                    };
                  p && "xmlns" !== p && !d && (R(e, "Unbound namespace prefix: " + JSON.stringify(p)), f.uri = p), e.tag.attributes[u] = f, O(e, "onattribute", f);
                }
                e.attribList.length = 0;
              }
              e.tag.isSelfClosing = !!t, e.sawRoot = !0, e.tags.push(e.tag), O(e, "onopentag", e.tag), t || (e.noscript || "script" !== e.tagName.toLowerCase() ? e.state = x.TEXT : e.state = x.SCRIPT, e.tag = null, e.tagName = ""), e.attribName = e.attribValue = "", e.attribList.length = 0;
            }
            function D(e) {
              if (!e.tagName) return R(e, "Weird empty close tag."), e.textNode += "</>", void (e.state = x.TEXT);
              if (e.script) {
                if ("script" !== e.tagName) return e.script += "</" + e.tagName + ">", e.tagName = "", void (e.state = x.SCRIPT);
                O(e, "onscript", e.script), e.script = "";
              }
              var t = e.tags.length,
                r = e.tagName;
              e.strict || (r = r[e.looseCase]());
              for (var n = r; t-- && e.tags[t].name !== n;) R(e, "Unexpected close tag");
              if (t < 0) return R(e, "Unmatched closing tag: " + e.tagName), e.textNode += "</" + e.tagName + ">", void (e.state = x.TEXT);
              e.tagName = r;
              for (var o = e.tags.length; o-- > t;) {
                var i = e.tag = e.tags.pop();
                e.tagName = e.tag.name, O(e, "onclosetag", e.tagName);
                var s = {};
                for (var a in i.ns) s[a] = i.ns[a];
                var u = e.tags[e.tags.length - 1] || e;
                e.opt.xmlns && i.ns !== u.ns && Object.keys(i.ns).forEach(function (t) {
                  var r = i.ns[t];
                  O(e, "onclosenamespace", {
                    prefix: t,
                    uri: r
                  });
                });
              }
              0 === t && (e.closedRoot = !0), e.tagName = e.attribValue = e.attribName = "", e.attribList.length = 0, e.state = x.TEXT;
            }
            function j(e) {
              var t,
                r = e.entity,
                n = r.toLowerCase(),
                o = "";
              return e.ENTITIES[r] ? e.ENTITIES[r] : e.ENTITIES[n] ? e.ENTITIES[n] : ("#" === (r = n).charAt(0) && ("x" === r.charAt(1) ? (r = r.slice(2), o = (t = parseInt(r, 16)).toString(16)) : (r = r.slice(1), o = (t = parseInt(r, 10)).toString(10))), r = r.replace(/^0+/, ""), isNaN(t) || o.toLowerCase() !== r ? (R(e, "Invalid character entity"), "&" + e.entity + ";") : String.fromCodePoint(t));
            }
            function F(e, t) {
              "<" === t ? (e.state = x.OPEN_WAKA, e.startTagPosition = e.position) : f(t) || (R(e, "Non-whitespace before first tag."), e.textNode = t, e.state = x.TEXT);
            }
            function B(e, t) {
              var r = "";
              return t < e.length && (r = e.charAt(t)), r;
            }
            x = e.STATE, String.fromCodePoint || (w = String.fromCharCode, v = Math.floor, _ = function _() {
              var e,
                t,
                r = 16384,
                n = [],
                o = -1,
                i = arguments.length;
              if (!i) return "";
              for (var s = ""; ++o < i;) {
                var a = Number(arguments[o]);
                if (!isFinite(a) || a < 0 || a > 1114111 || v(a) !== a) throw RangeError("Invalid code point: " + a);
                a <= 65535 ? n.push(a) : (e = 55296 + ((a -= 65536) >> 10), t = a % 1024 + 56320, n.push(e, t)), (o + 1 === i || n.length > r) && (s += w.apply(null, n), n.length = 0);
              }
              return s;
            }, Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
              value: _,
              configurable: !0,
              writable: !0
            }) : String.fromCodePoint = _);
          }(t);
        },
        2830: function _(e, t, r) {
          e.exports = o;
          var n = r(7187).EventEmitter;
          function o() {
            n.call(this);
          }
          r(5717)(o, n), o.Readable = r(6577), o.Writable = r(323), o.Duplex = r(8656), o.Transform = r(4473), o.PassThrough = r(2366), o.finished = r(1086), o.pipeline = r(6472), o.Stream = o, o.prototype.pipe = function (e, t) {
            var r = this;
            function o(t) {
              e.writable && !1 === e.write(t) && r.pause && r.pause();
            }
            function i() {
              r.readable && r.resume && r.resume();
            }
            r.on("data", o), e.on("drain", i), e._isStdio || t && !1 === t.end || (r.on("end", a), r.on("close", u));
            var s = !1;
            function a() {
              s || (s = !0, e.end());
            }
            function u() {
              s || (s = !0, "function" == typeof e.destroy && e.destroy());
            }
            function c(e) {
              if (l(), 0 === n.listenerCount(this, "error")) throw e;
            }
            function l() {
              r.removeListener("data", o), e.removeListener("drain", i), r.removeListener("end", a), r.removeListener("close", u), r.removeListener("error", c), e.removeListener("error", c), r.removeListener("end", l), r.removeListener("close", l), e.removeListener("close", l);
            }
            return r.on("error", c), e.on("error", c), r.on("end", l), r.on("close", l), e.on("close", l), e.emit("pipe", r), e;
          };
        },
        8106: function _(e) {
          "use strict";

          var t = {};
          function r(e, r, n) {
            n || (n = Error);
            var o = function (e) {
              var t, n;
              function o(t, n, o) {
                return e.call(this, function (e, t, n) {
                  return "string" == typeof r ? r : r(e, t, n);
                }(t, n, o)) || this;
              }
              return n = e, (t = o).prototype = Object.create(n.prototype), t.prototype.constructor = t, t.__proto__ = n, o;
            }(n);
            o.prototype.name = n.name, o.prototype.code = e, t[e] = o;
          }
          function n(e, t) {
            if (Array.isArray(e)) {
              var r = e.length;
              return e = e.map(function (e) {
                return String(e);
              }), r > 2 ? "one of ".concat(t, " ").concat(e.slice(0, r - 1).join(", "), ", or ") + e[r - 1] : 2 === r ? "one of ".concat(t, " ").concat(e[0], " or ").concat(e[1]) : "of ".concat(t, " ").concat(e[0]);
            }
            return "of ".concat(t, " ").concat(String(e));
          }
          r("ERR_INVALID_OPT_VALUE", function (e, t) {
            return 'The value "' + t + '" is invalid for option "' + e + '"';
          }, TypeError), r("ERR_INVALID_ARG_TYPE", function (e, t, r) {
            var o, i, s, a, u;
            if ("string" == typeof t && (i = "not ", t.substr(0, i.length) === i) ? (o = "must not be", t = t.replace(/^not /, "")) : o = "must be", function (e, t, r) {
              return (void 0 === r || r > e.length) && (r = e.length), e.substring(r - t.length, r) === t;
            }(e, " argument")) s = "The ".concat(e, " ").concat(o, " ").concat(n(t, "type"));else {
              var c = ("number" != typeof u && (u = 0), u + ".".length > (a = e).length || -1 === a.indexOf(".", u) ? "argument" : "property");
              s = 'The "'.concat(e, '" ').concat(c, " ").concat(o, " ").concat(n(t, "type"));
            }
            return s + ". Received type ".concat(_typeof(r));
          }, TypeError), r("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), r("ERR_METHOD_NOT_IMPLEMENTED", function (e) {
            return "The " + e + " method is not implemented";
          }), r("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), r("ERR_STREAM_DESTROYED", function (e) {
            return "Cannot call " + e + " after a stream was destroyed";
          }), r("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), r("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), r("ERR_STREAM_WRITE_AFTER_END", "write after end"), r("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), r("ERR_UNKNOWN_ENCODING", function (e) {
            return "Unknown encoding: " + e;
          }, TypeError), r("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), e.exports.q = t;
        },
        8656: function _(e, t, r) {
          "use strict";

          var n = r(4155),
            o = Object.keys || function (e) {
              var t = [];
              for (var r in e) t.push(r);
              return t;
            };
          e.exports = l;
          var i = r(6577),
            s = r(323);
          r(5717)(l, i);
          for (var a = o(s.prototype), u = 0; u < a.length; u++) {
            var c = a[u];
            l.prototype[c] || (l.prototype[c] = s.prototype[c]);
          }
          function l(e) {
            if (!(this instanceof l)) return new l(e);
            i.call(this, e), s.call(this, e), this.allowHalfOpen = !0, e && (!1 === e.readable && (this.readable = !1), !1 === e.writable && (this.writable = !1), !1 === e.allowHalfOpen && (this.allowHalfOpen = !1, this.once("end", p)));
          }
          function p() {
            this._writableState.ended || n.nextTick(h, this);
          }
          function h(e) {
            e.end();
          }
          Object.defineProperty(l.prototype, "writableHighWaterMark", {
            enumerable: !1,
            get: function get() {
              return this._writableState.highWaterMark;
            }
          }), Object.defineProperty(l.prototype, "writableBuffer", {
            enumerable: !1,
            get: function get() {
              return this._writableState && this._writableState.getBuffer();
            }
          }), Object.defineProperty(l.prototype, "writableLength", {
            enumerable: !1,
            get: function get() {
              return this._writableState.length;
            }
          }), Object.defineProperty(l.prototype, "destroyed", {
            enumerable: !1,
            get: function get() {
              return void 0 !== this._readableState && void 0 !== this._writableState && this._readableState.destroyed && this._writableState.destroyed;
            },
            set: function set(e) {
              void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e);
            }
          });
        },
        2366: function _(e, t, r) {
          "use strict";

          e.exports = o;
          var n = r(4473);
          function o(e) {
            if (!(this instanceof o)) return new o(e);
            n.call(this, e);
          }
          r(5717)(o, n), o.prototype._transform = function (e, t, r) {
            r(null, e);
          };
        },
        6577: function _(e, t, r) {
          "use strict";

          var n,
            o = r(4155);
          e.exports = O, O.ReadableState = T, r(7187).EventEmitter;
          var i,
            s = function s(e, t) {
              return e.listeners(t).length;
            },
            a = r(3194),
            u = r(8764).Buffer,
            c = r.g.Uint8Array || function () {},
            l = r(964);
          i = l && l.debuglog ? l.debuglog("stream") : function () {};
          var p,
            h,
            d,
            f = r(9686),
            m = r(1029),
            g = r(94).getHighWaterMark,
            b = r(8106).q,
            y = b.ERR_INVALID_ARG_TYPE,
            w = b.ERR_STREAM_PUSH_AFTER_EOF,
            v = b.ERR_METHOD_NOT_IMPLEMENTED,
            _ = b.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
          r(5717)(O, a);
          var x = m.errorOrDestroy,
            E = ["error", "close", "destroy", "pause", "resume"];
          function T(e, t, o) {
            n = n || r(8656), e = e || {}, "boolean" != typeof o && (o = t instanceof n), this.objectMode = !!e.objectMode, o && (this.objectMode = this.objectMode || !!e.readableObjectMode), this.highWaterMark = g(this, e, "readableHighWaterMark", o), this.buffer = new f(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = !1 !== e.emitClose, this.autoDestroy = !!e.autoDestroy, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (p || (p = r(2553).s), this.decoder = new p(e.encoding), this.encoding = e.encoding);
          }
          function O(e) {
            if (n = n || r(8656), !(this instanceof O)) return new O(e);
            var t = this instanceof n;
            this._readableState = new T(e, this, t), this.readable = !0, e && ("function" == typeof e.read && (this._read = e.read), "function" == typeof e.destroy && (this._destroy = e.destroy)), a.call(this);
          }
          function S(e, t, r, n, o) {
            i("readableAddChunk", t);
            var s,
              a = e._readableState;
            if (null === t) a.reading = !1, function (e, t) {
              if (i("onEofChunk"), !t.ended) {
                if (t.decoder) {
                  var r = t.decoder.end();
                  r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
                }
                t.ended = !0, t.sync ? R(e) : (t.needReadable = !1, t.emittedReadable || (t.emittedReadable = !0, I(e)));
              }
            }(e, a);else if (o || (s = function (e, t) {
              var r, n;
              return n = t, u.isBuffer(n) || n instanceof c || "string" == typeof t || void 0 === t || e.objectMode || (r = new y("chunk", ["string", "Buffer", "Uint8Array"], t)), r;
            }(a, t)), s) x(e, s);else if (a.objectMode || t && t.length > 0) {
              if ("string" == typeof t || a.objectMode || Object.getPrototypeOf(t) === u.prototype || (t = function (e) {
                return u.from(e);
              }(t)), n) a.endEmitted ? x(e, new _()) : A(e, a, t, !0);else if (a.ended) x(e, new w());else {
                if (a.destroyed) return !1;
                a.reading = !1, a.decoder && !r ? (t = a.decoder.write(t), a.objectMode || 0 !== t.length ? A(e, a, t, !1) : N(e, a)) : A(e, a, t, !1);
              }
            } else n || (a.reading = !1, N(e, a));
            return !a.ended && (a.length < a.highWaterMark || 0 === a.length);
          }
          function A(e, t, r, n) {
            t.flowing && 0 === t.length && !t.sync ? (t.awaitDrain = 0, e.emit("data", r)) : (t.length += t.objectMode ? 1 : r.length, n ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && R(e)), N(e, t);
          }
          Object.defineProperty(O.prototype, "destroyed", {
            enumerable: !1,
            get: function get() {
              return void 0 !== this._readableState && this._readableState.destroyed;
            },
            set: function set(e) {
              this._readableState && (this._readableState.destroyed = e);
            }
          }), O.prototype.destroy = m.destroy, O.prototype._undestroy = m.undestroy, O.prototype._destroy = function (e, t) {
            t(e);
          }, O.prototype.push = function (e, t) {
            var r,
              n = this._readableState;
            return n.objectMode ? r = !0 : "string" == typeof e && ((t = t || n.defaultEncoding) !== n.encoding && (e = u.from(e, t), t = ""), r = !0), S(this, e, t, !1, r);
          }, O.prototype.unshift = function (e) {
            return S(this, e, null, !0, !1);
          }, O.prototype.isPaused = function () {
            return !1 === this._readableState.flowing;
          }, O.prototype.setEncoding = function (e) {
            p || (p = r(2553).s);
            var t = new p(e);
            this._readableState.decoder = t, this._readableState.encoding = this._readableState.decoder.encoding;
            for (var n = this._readableState.buffer.head, o = ""; null !== n;) o += t.write(n.data), n = n.next;
            return this._readableState.buffer.clear(), "" !== o && this._readableState.buffer.push(o), this._readableState.length = o.length, this;
          };
          var P = 1073741824;
          function C(e, t) {
            return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function (e) {
              return e >= P ? e = P : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
            }(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
          }
          function R(e) {
            var t = e._readableState;
            i("emitReadable", t.needReadable, t.emittedReadable), t.needReadable = !1, t.emittedReadable || (i("emitReadable", t.flowing), t.emittedReadable = !0, o.nextTick(I, e));
          }
          function I(e) {
            var t = e._readableState;
            i("emitReadable_", t.destroyed, t.length, t.ended), t.destroyed || !t.length && !t.ended || (e.emit("readable"), t.emittedReadable = !1), t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark, F(e);
          }
          function N(e, t) {
            t.readingMore || (t.readingMore = !0, o.nextTick(M, e, t));
          }
          function M(e, t) {
            for (; !t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && 0 === t.length);) {
              var r = t.length;
              if (i("maybeReadMore read 0"), e.read(0), r === t.length) break;
            }
            t.readingMore = !1;
          }
          function k(e) {
            var t = e._readableState;
            t.readableListening = e.listenerCount("readable") > 0, t.resumeScheduled && !t.paused ? t.flowing = !0 : e.listenerCount("data") > 0 && e.resume();
          }
          function D(e) {
            i("readable nexttick read 0"), e.read(0);
          }
          function j(e, t) {
            i("resume", t.reading), t.reading || e.read(0), t.resumeScheduled = !1, e.emit("resume"), F(e), t.flowing && !t.reading && e.read(0);
          }
          function F(e) {
            var t = e._readableState;
            for (i("flow", t.flowing); t.flowing && null !== e.read(););
          }
          function B(e, t) {
            return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.first() : t.buffer.concat(t.length), t.buffer.clear()) : r = t.buffer.consume(e, t.decoder), r);
            var r;
          }
          function L(e) {
            var t = e._readableState;
            i("endReadable", t.endEmitted), t.endEmitted || (t.ended = !0, o.nextTick(U, t, e));
          }
          function U(e, t) {
            if (i("endReadableNT", e.endEmitted, e.length), !e.endEmitted && 0 === e.length && (e.endEmitted = !0, t.readable = !1, t.emit("end"), e.autoDestroy)) {
              var r = t._writableState;
              (!r || r.autoDestroy && r.finished) && t.destroy();
            }
          }
          function X(e, t) {
            for (var r = 0, n = e.length; r < n; r++) if (e[r] === t) return r;
            return -1;
          }
          O.prototype.read = function (e) {
            i("read", e), e = parseInt(e, 10);
            var t = this._readableState,
              r = e;
            if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && ((0 !== t.highWaterMark ? t.length >= t.highWaterMark : t.length > 0) || t.ended)) return i("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? L(this) : R(this), null;
            if (0 === (e = C(e, t)) && t.ended) return 0 === t.length && L(this), null;
            var n,
              o = t.needReadable;
            return i("need readable", o), (0 === t.length || t.length - e < t.highWaterMark) && i("length less than watermark", o = !0), t.ended || t.reading ? i("reading or ended", o = !1) : o && (i("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = C(r, t))), null === (n = e > 0 ? B(e, t) : null) ? (t.needReadable = t.length <= t.highWaterMark, e = 0) : (t.length -= e, t.awaitDrain = 0), 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && L(this)), null !== n && this.emit("data", n), n;
          }, O.prototype._read = function (e) {
            x(this, new v("_read()"));
          }, O.prototype.pipe = function (e, t) {
            var r = this,
              n = this._readableState;
            switch (n.pipesCount) {
              case 0:
                n.pipes = e;
                break;
              case 1:
                n.pipes = [n.pipes, e];
                break;
              default:
                n.pipes.push(e);
            }
            n.pipesCount += 1, i("pipe count=%d opts=%j", n.pipesCount, t);
            var a = t && !1 === t.end || e === o.stdout || e === o.stderr ? m : u;
            function u() {
              i("onend"), e.end();
            }
            n.endEmitted ? o.nextTick(a) : r.once("end", a), e.on("unpipe", function t(o, s) {
              i("onunpipe"), o === r && s && !1 === s.hasUnpiped && (s.hasUnpiped = !0, i("cleanup"), e.removeListener("close", d), e.removeListener("finish", f), e.removeListener("drain", c), e.removeListener("error", h), e.removeListener("unpipe", t), r.removeListener("end", u), r.removeListener("end", m), r.removeListener("data", p), l = !0, !n.awaitDrain || e._writableState && !e._writableState.needDrain || c());
            });
            var c = function (e) {
              return function () {
                var t = e._readableState;
                i("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && s(e, "data") && (t.flowing = !0, F(e));
              };
            }(r);
            e.on("drain", c);
            var l = !1;
            function p(t) {
              i("ondata");
              var o = e.write(t);
              i("dest.write", o), !1 === o && ((1 === n.pipesCount && n.pipes === e || n.pipesCount > 1 && -1 !== X(n.pipes, e)) && !l && (i("false write response, pause", n.awaitDrain), n.awaitDrain++), r.pause());
            }
            function h(t) {
              i("onerror", t), m(), e.removeListener("error", h), 0 === s(e, "error") && x(e, t);
            }
            function d() {
              e.removeListener("finish", f), m();
            }
            function f() {
              i("onfinish"), e.removeListener("close", d), m();
            }
            function m() {
              i("unpipe"), r.unpipe(e);
            }
            return r.on("data", p), function (e, t, r) {
              if ("function" == typeof e.prependListener) return e.prependListener(t, r);
              e._events && e._events.error ? Array.isArray(e._events.error) ? e._events.error.unshift(r) : e._events.error = [r, e._events.error] : e.on(t, r);
            }(e, "error", h), e.once("close", d), e.once("finish", f), e.emit("pipe", r), n.flowing || (i("pipe resume"), r.resume()), e;
          }, O.prototype.unpipe = function (e) {
            var t = this._readableState,
              r = {
                hasUnpiped: !1
              };
            if (0 === t.pipesCount) return this;
            if (1 === t.pipesCount) return e && e !== t.pipes || (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r)), this;
            if (!e) {
              var n = t.pipes,
                o = t.pipesCount;
              t.pipes = null, t.pipesCount = 0, t.flowing = !1;
              for (var i = 0; i < o; i++) n[i].emit("unpipe", this, {
                hasUnpiped: !1
              });
              return this;
            }
            var s = X(t.pipes, e);
            return -1 === s || (t.pipes.splice(s, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r)), this;
          }, O.prototype.on = function (e, t) {
            var r = a.prototype.on.call(this, e, t),
              n = this._readableState;
            return "data" === e ? (n.readableListening = this.listenerCount("readable") > 0, !1 !== n.flowing && this.resume()) : "readable" === e && (n.endEmitted || n.readableListening || (n.readableListening = n.needReadable = !0, n.flowing = !1, n.emittedReadable = !1, i("on readable", n.length, n.reading), n.length ? R(this) : n.reading || o.nextTick(D, this))), r;
          }, O.prototype.addListener = O.prototype.on, O.prototype.removeListener = function (e, t) {
            var r = a.prototype.removeListener.call(this, e, t);
            return "readable" === e && o.nextTick(k, this), r;
          }, O.prototype.removeAllListeners = function (e) {
            var t = a.prototype.removeAllListeners.apply(this, arguments);
            return "readable" !== e && void 0 !== e || o.nextTick(k, this), t;
          }, O.prototype.resume = function () {
            var e = this._readableState;
            return e.flowing || (i("resume"), e.flowing = !e.readableListening, function (e, t) {
              t.resumeScheduled || (t.resumeScheduled = !0, o.nextTick(j, e, t));
            }(this, e)), e.paused = !1, this;
          }, O.prototype.pause = function () {
            return i("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (i("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
          }, O.prototype.wrap = function (e) {
            var t = this,
              r = this._readableState,
              n = !1;
            for (var o in e.on("end", function () {
              if (i("wrapped end"), r.decoder && !r.ended) {
                var e = r.decoder.end();
                e && e.length && t.push(e);
              }
              t.push(null);
            }), e.on("data", function (o) {
              i("wrapped data"), r.decoder && (o = r.decoder.write(o)), r.objectMode && null == o || (r.objectMode || o && o.length) && (t.push(o) || (n = !0, e.pause()));
            }), e) void 0 === this[o] && "function" == typeof e[o] && (this[o] = function (t) {
              return function () {
                return e[t].apply(e, arguments);
              };
            }(o));
            for (var s = 0; s < E.length; s++) e.on(E[s], this.emit.bind(this, E[s]));
            return this._read = function (t) {
              i("wrapped _read", t), n && (n = !1, e.resume());
            }, this;
          }, "function" == typeof Symbol && (O.prototype[Symbol.asyncIterator] = function () {
            return void 0 === h && (h = r(828)), h(this);
          }), Object.defineProperty(O.prototype, "readableHighWaterMark", {
            enumerable: !1,
            get: function get() {
              return this._readableState.highWaterMark;
            }
          }), Object.defineProperty(O.prototype, "readableBuffer", {
            enumerable: !1,
            get: function get() {
              return this._readableState && this._readableState.buffer;
            }
          }), Object.defineProperty(O.prototype, "readableFlowing", {
            enumerable: !1,
            get: function get() {
              return this._readableState.flowing;
            },
            set: function set(e) {
              this._readableState && (this._readableState.flowing = e);
            }
          }), O._fromList = B, Object.defineProperty(O.prototype, "readableLength", {
            enumerable: !1,
            get: function get() {
              return this._readableState.length;
            }
          }), "function" == typeof Symbol && (O.from = function (e, t) {
            return void 0 === d && (d = r(1265)), d(O, e, t);
          });
        },
        4473: function _(e, t, r) {
          "use strict";

          e.exports = l;
          var n = r(8106).q,
            o = n.ERR_METHOD_NOT_IMPLEMENTED,
            i = n.ERR_MULTIPLE_CALLBACK,
            s = n.ERR_TRANSFORM_ALREADY_TRANSFORMING,
            a = n.ERR_TRANSFORM_WITH_LENGTH_0,
            u = r(8656);
          function c(e, t) {
            var r = this._transformState;
            r.transforming = !1;
            var n = r.writecb;
            if (null === n) return this.emit("error", new i());
            r.writechunk = null, r.writecb = null, null != t && this.push(t), n(e);
            var o = this._readableState;
            o.reading = !1, (o.needReadable || o.length < o.highWaterMark) && this._read(o.highWaterMark);
          }
          function l(e) {
            if (!(this instanceof l)) return new l(e);
            u.call(this, e), this._transformState = {
              afterTransform: c.bind(this),
              needTransform: !1,
              transforming: !1,
              writecb: null,
              writechunk: null,
              writeencoding: null
            }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.on("prefinish", p);
          }
          function p() {
            var e = this;
            "function" != typeof this._flush || this._readableState.destroyed ? h(this, null, null) : this._flush(function (t, r) {
              h(e, t, r);
            });
          }
          function h(e, t, r) {
            if (t) return e.emit("error", t);
            if (null != r && e.push(r), e._writableState.length) throw new a();
            if (e._transformState.transforming) throw new s();
            return e.push(null);
          }
          r(5717)(l, u), l.prototype.push = function (e, t) {
            return this._transformState.needTransform = !1, u.prototype.push.call(this, e, t);
          }, l.prototype._transform = function (e, t, r) {
            r(new o("_transform()"));
          }, l.prototype._write = function (e, t, r) {
            var n = this._transformState;
            if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) {
              var o = this._readableState;
              (n.needTransform || o.needReadable || o.length < o.highWaterMark) && this._read(o.highWaterMark);
            }
          }, l.prototype._read = function (e) {
            var t = this._transformState;
            null === t.writechunk || t.transforming ? t.needTransform = !0 : (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform));
          }, l.prototype._destroy = function (e, t) {
            u.prototype._destroy.call(this, e, function (e) {
              t(e);
            });
          };
        },
        323: function _(e, t, r) {
          "use strict";

          var n,
            o = r(4155);
          function i(e) {
            var t = this;
            this.next = null, this.entry = null, this.finish = function () {
              !function (e, t, r) {
                var n = e.entry;
                for (e.entry = null; n;) {
                  var o = n.callback;
                  t.pendingcb--, o(undefined), n = n.next;
                }
                t.corkedRequestsFree.next = e;
              }(t, e);
            };
          }
          e.exports = O, O.WritableState = T;
          var s,
            a = {
              deprecate: r(4927)
            },
            u = r(3194),
            c = r(8764).Buffer,
            l = r.g.Uint8Array || function () {},
            p = r(1029),
            h = r(94).getHighWaterMark,
            d = r(8106).q,
            f = d.ERR_INVALID_ARG_TYPE,
            m = d.ERR_METHOD_NOT_IMPLEMENTED,
            g = d.ERR_MULTIPLE_CALLBACK,
            b = d.ERR_STREAM_CANNOT_PIPE,
            y = d.ERR_STREAM_DESTROYED,
            w = d.ERR_STREAM_NULL_VALUES,
            v = d.ERR_STREAM_WRITE_AFTER_END,
            _ = d.ERR_UNKNOWN_ENCODING,
            x = p.errorOrDestroy;
          function E() {}
          function T(e, t, s) {
            n = n || r(8656), e = e || {}, "boolean" != typeof s && (s = t instanceof n), this.objectMode = !!e.objectMode, s && (this.objectMode = this.objectMode || !!e.writableObjectMode), this.highWaterMark = h(this, e, "writableHighWaterMark", s), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
            var a = !1 === e.decodeStrings;
            this.decodeStrings = !a, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
              !function (e, t) {
                var r = e._writableState,
                  n = r.sync,
                  i = r.writecb;
                if ("function" != typeof i) throw new g();
                if (function (e) {
                  e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
                }(r), t) !function (e, t, r, n, i) {
                  --t.pendingcb, r ? (o.nextTick(i, n), o.nextTick(I, e, t), e._writableState.errorEmitted = !0, x(e, n)) : (i(n), e._writableState.errorEmitted = !0, x(e, n), I(e, t));
                }(e, r, n, t, i);else {
                  var s = C(r) || e.destroyed;
                  s || r.corked || r.bufferProcessing || !r.bufferedRequest || P(e, r), n ? o.nextTick(A, e, r, s, i) : A(e, r, s, i);
                }
              }(t, e);
            }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = !1 !== e.emitClose, this.autoDestroy = !!e.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new i(this);
          }
          function O(e) {
            var t = this instanceof (n = n || r(8656));
            if (!t && !s.call(O, this)) return new O(e);
            this._writableState = new T(e, this, t), this.writable = !0, e && ("function" == typeof e.write && (this._write = e.write), "function" == typeof e.writev && (this._writev = e.writev), "function" == typeof e.destroy && (this._destroy = e.destroy), "function" == typeof e.final && (this._final = e.final)), u.call(this);
          }
          function S(e, t, r, n, o, i, s) {
            t.writelen = n, t.writecb = s, t.writing = !0, t.sync = !0, t.destroyed ? t.onwrite(new y("write")) : r ? e._writev(o, t.onwrite) : e._write(o, i, t.onwrite), t.sync = !1;
          }
          function A(e, t, r, n) {
            r || function (e, t) {
              0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"));
            }(e, t), t.pendingcb--, n(), I(e, t);
          }
          function P(e, t) {
            t.bufferProcessing = !0;
            var r = t.bufferedRequest;
            if (e._writev && r && r.next) {
              var n = t.bufferedRequestCount,
                o = new Array(n),
                s = t.corkedRequestsFree;
              s.entry = r;
              for (var a = 0, u = !0; r;) o[a] = r, r.isBuf || (u = !1), r = r.next, a += 1;
              o.allBuffers = u, S(e, t, !0, t.length, o, "", s.finish), t.pendingcb++, t.lastBufferedRequest = null, s.next ? (t.corkedRequestsFree = s.next, s.next = null) : t.corkedRequestsFree = new i(t), t.bufferedRequestCount = 0;
            } else {
              for (; r;) {
                var c = r.chunk,
                  l = r.encoding,
                  p = r.callback;
                if (S(e, t, !1, t.objectMode ? 1 : c.length, c, l, p), r = r.next, t.bufferedRequestCount--, t.writing) break;
              }
              null === r && (t.lastBufferedRequest = null);
            }
            t.bufferedRequest = r, t.bufferProcessing = !1;
          }
          function C(e) {
            return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
          }
          function R(e, t) {
            e._final(function (r) {
              t.pendingcb--, r && x(e, r), t.prefinished = !0, e.emit("prefinish"), I(e, t);
            });
          }
          function I(e, t) {
            var r = C(t);
            if (r && (function (e, t) {
              t.prefinished || t.finalCalled || ("function" != typeof e._final || t.destroyed ? (t.prefinished = !0, e.emit("prefinish")) : (t.pendingcb++, t.finalCalled = !0, o.nextTick(R, e, t)));
            }(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"), t.autoDestroy))) {
              var n = e._readableState;
              (!n || n.autoDestroy && n.endEmitted) && e.destroy();
            }
            return r;
          }
          r(5717)(O, u), T.prototype.getBuffer = function () {
            for (var e = this.bufferedRequest, t = []; e;) t.push(e), e = e.next;
            return t;
          }, function () {
            try {
              Object.defineProperty(T.prototype, "buffer", {
                get: a.deprecate(function () {
                  return this.getBuffer();
                }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
              });
            } catch (e) {}
          }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (s = Function.prototype[Symbol.hasInstance], Object.defineProperty(O, Symbol.hasInstance, {
            value: function value(e) {
              return !!s.call(this, e) || this === O && e && e._writableState instanceof T;
            }
          })) : s = function s(e) {
            return e instanceof this;
          }, O.prototype.pipe = function () {
            x(this, new b());
          }, O.prototype.write = function (e, t, r) {
            var n,
              i = this._writableState,
              s = !1,
              a = !i.objectMode && (n = e, c.isBuffer(n) || n instanceof l);
            return a && !c.isBuffer(e) && (e = function (e) {
              return c.from(e);
            }(e)), "function" == typeof t && (r = t, t = null), a ? t = "buffer" : t || (t = i.defaultEncoding), "function" != typeof r && (r = E), i.ending ? function (e, t) {
              var r = new v();
              x(e, r), o.nextTick(t, r);
            }(this, r) : (a || function (e, t, r, n) {
              var i;
              return null === r ? i = new w() : "string" == typeof r || t.objectMode || (i = new f("chunk", ["string", "Buffer"], r)), !i || (x(e, i), o.nextTick(n, i), !1);
            }(this, i, e, r)) && (i.pendingcb++, s = function (e, t, r, n, o, i) {
              if (!r) {
                var s = function (e, t, r) {
                  return e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = c.from(t, r)), t;
                }(t, n, o);
                n !== s && (r = !0, o = "buffer", n = s);
              }
              var a = t.objectMode ? 1 : n.length;
              t.length += a;
              var u = t.length < t.highWaterMark;
              if (u || (t.needDrain = !0), t.writing || t.corked) {
                var l = t.lastBufferedRequest;
                t.lastBufferedRequest = {
                  chunk: n,
                  encoding: o,
                  isBuf: r,
                  callback: i,
                  next: null
                }, l ? l.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
              } else S(e, t, !1, a, n, o, i);
              return u;
            }(this, i, a, e, t, r)), s;
          }, O.prototype.cork = function () {
            this._writableState.corked++;
          }, O.prototype.uncork = function () {
            var e = this._writableState;
            e.corked && (e.corked--, e.writing || e.corked || e.bufferProcessing || !e.bufferedRequest || P(this, e));
          }, O.prototype.setDefaultEncoding = function (e) {
            if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1)) throw new _(e);
            return this._writableState.defaultEncoding = e, this;
          }, Object.defineProperty(O.prototype, "writableBuffer", {
            enumerable: !1,
            get: function get() {
              return this._writableState && this._writableState.getBuffer();
            }
          }), Object.defineProperty(O.prototype, "writableHighWaterMark", {
            enumerable: !1,
            get: function get() {
              return this._writableState.highWaterMark;
            }
          }), O.prototype._write = function (e, t, r) {
            r(new m("_write()"));
          }, O.prototype._writev = null, O.prototype.end = function (e, t, r) {
            var n = this._writableState;
            return "function" == typeof e ? (r = e, e = null, t = null) : "function" == typeof t && (r = t, t = null), null != e && this.write(e, t), n.corked && (n.corked = 1, this.uncork()), n.ending || function (e, t, r) {
              t.ending = !0, I(e, t), r && (t.finished ? o.nextTick(r) : e.once("finish", r)), t.ended = !0, e.writable = !1;
            }(this, n, r), this;
          }, Object.defineProperty(O.prototype, "writableLength", {
            enumerable: !1,
            get: function get() {
              return this._writableState.length;
            }
          }), Object.defineProperty(O.prototype, "destroyed", {
            enumerable: !1,
            get: function get() {
              return void 0 !== this._writableState && this._writableState.destroyed;
            },
            set: function set(e) {
              this._writableState && (this._writableState.destroyed = e);
            }
          }), O.prototype.destroy = p.destroy, O.prototype._undestroy = p.undestroy, O.prototype._destroy = function (e, t) {
            t(e);
          };
        },
        828: function _(e, t, r) {
          "use strict";

          var n,
            o = r(4155);
          function i(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
              value: r,
              enumerable: !0,
              configurable: !0,
              writable: !0
            }) : e[t] = r, e;
          }
          var s = r(1086),
            a = Symbol("lastResolve"),
            u = Symbol("lastReject"),
            c = Symbol("error"),
            l = Symbol("ended"),
            p = Symbol("lastPromise"),
            h = Symbol("handlePromise"),
            d = Symbol("stream");
          function f(e, t) {
            return {
              value: e,
              done: t
            };
          }
          function m(e) {
            var t = e[a];
            if (null !== t) {
              var r = e[d].read();
              null !== r && (e[p] = null, e[a] = null, e[u] = null, t(f(r, !1)));
            }
          }
          function g(e) {
            o.nextTick(m, e);
          }
          var b = Object.getPrototypeOf(function () {}),
            y = Object.setPrototypeOf((i(n = {
              get stream() {
                return this[d];
              },
              next: function next() {
                var e = this,
                  t = this[c];
                if (null !== t) return Promise.reject(t);
                if (this[l]) return Promise.resolve(f(void 0, !0));
                if (this[d].destroyed) return new Promise(function (t, r) {
                  o.nextTick(function () {
                    e[c] ? r(e[c]) : t(f(void 0, !0));
                  });
                });
                var r,
                  n = this[p];
                if (n) r = new Promise(function (e, t) {
                  return function (r, n) {
                    e.then(function () {
                      t[l] ? r(f(void 0, !0)) : t[h](r, n);
                    }, n);
                  };
                }(n, this));else {
                  var i = this[d].read();
                  if (null !== i) return Promise.resolve(f(i, !1));
                  r = new Promise(this[h]);
                }
                return this[p] = r, r;
              }
            }, Symbol.asyncIterator, function () {
              return this;
            }), i(n, "return", function () {
              var e = this;
              return new Promise(function (t, r) {
                e[d].destroy(null, function (e) {
                  e ? r(e) : t(f(void 0, !0));
                });
              });
            }), n), b);
          e.exports = function (e) {
            var t,
              r = Object.create(y, (i(t = {}, d, {
                value: e,
                writable: !0
              }), i(t, a, {
                value: null,
                writable: !0
              }), i(t, u, {
                value: null,
                writable: !0
              }), i(t, c, {
                value: null,
                writable: !0
              }), i(t, l, {
                value: e._readableState.endEmitted,
                writable: !0
              }), i(t, h, {
                value: function value(e, t) {
                  var n = r[d].read();
                  n ? (r[p] = null, r[a] = null, r[u] = null, e(f(n, !1))) : (r[a] = e, r[u] = t);
                },
                writable: !0
              }), t));
            return r[p] = null, s(e, function (e) {
              if (e && "ERR_STREAM_PREMATURE_CLOSE" !== e.code) {
                var t = r[u];
                return null !== t && (r[p] = null, r[a] = null, r[u] = null, t(e)), void (r[c] = e);
              }
              var n = r[a];
              null !== n && (r[p] = null, r[a] = null, r[u] = null, n(f(void 0, !0))), r[l] = !0;
            }), e.on("readable", g.bind(null, r)), r;
          };
        },
        9686: function _(e, t, r) {
          "use strict";

          function n(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(e);
              t && (n = n.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })), r.push.apply(r, n);
            }
            return r;
          }
          function o(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
              value: r,
              enumerable: !0,
              configurable: !0,
              writable: !0
            }) : e[t] = r, e;
          }
          function i(e, t) {
            for (var r = 0; r < t.length; r++) {
              var n = t[r];
              n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
            }
          }
          var s = r(8764).Buffer,
            a = r(9862).inspect,
            u = a && a.custom || "inspect";
          e.exports = function () {
            function e() {
              !function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
              }(this, e), this.head = null, this.tail = null, this.length = 0;
            }
            var t, r;
            return t = e, r = [{
              key: "push",
              value: function value(e) {
                var t = {
                  data: e,
                  next: null
                };
                this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;
              }
            }, {
              key: "unshift",
              value: function value(e) {
                var t = {
                  data: e,
                  next: this.head
                };
                0 === this.length && (this.tail = t), this.head = t, ++this.length;
              }
            }, {
              key: "shift",
              value: function value() {
                if (0 !== this.length) {
                  var e = this.head.data;
                  return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;
                }
              }
            }, {
              key: "clear",
              value: function value() {
                this.head = this.tail = null, this.length = 0;
              }
            }, {
              key: "join",
              value: function value(e) {
                if (0 === this.length) return "";
                for (var t = this.head, r = "" + t.data; t = t.next;) r += e + t.data;
                return r;
              }
            }, {
              key: "concat",
              value: function value(e) {
                if (0 === this.length) return s.alloc(0);
                for (var t, r, n, o = s.allocUnsafe(e >>> 0), i = this.head, a = 0; i;) t = i.data, r = o, n = a, s.prototype.copy.call(t, r, n), a += i.data.length, i = i.next;
                return o;
              }
            }, {
              key: "consume",
              value: function value(e, t) {
                var r;
                return e < this.head.data.length ? (r = this.head.data.slice(0, e), this.head.data = this.head.data.slice(e)) : r = e === this.head.data.length ? this.shift() : t ? this._getString(e) : this._getBuffer(e), r;
              }
            }, {
              key: "first",
              value: function value() {
                return this.head.data;
              }
            }, {
              key: "_getString",
              value: function value(e) {
                var t = this.head,
                  r = 1,
                  n = t.data;
                for (e -= n.length; t = t.next;) {
                  var o = t.data,
                    i = e > o.length ? o.length : e;
                  if (i === o.length ? n += o : n += o.slice(0, e), 0 == (e -= i)) {
                    i === o.length ? (++r, t.next ? this.head = t.next : this.head = this.tail = null) : (this.head = t, t.data = o.slice(i));
                    break;
                  }
                  ++r;
                }
                return this.length -= r, n;
              }
            }, {
              key: "_getBuffer",
              value: function value(e) {
                var t = s.allocUnsafe(e),
                  r = this.head,
                  n = 1;
                for (r.data.copy(t), e -= r.data.length; r = r.next;) {
                  var o = r.data,
                    i = e > o.length ? o.length : e;
                  if (o.copy(t, t.length - e, 0, i), 0 == (e -= i)) {
                    i === o.length ? (++n, r.next ? this.head = r.next : this.head = this.tail = null) : (this.head = r, r.data = o.slice(i));
                    break;
                  }
                  ++n;
                }
                return this.length -= n, t;
              }
            }, {
              key: u,
              value: function value(e, t) {
                return a(this, function (e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var r = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? n(Object(r), !0).forEach(function (t) {
                      o(e, t, r[t]);
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : n(Object(r)).forEach(function (t) {
                      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                    });
                  }
                  return e;
                }({}, t, {
                  depth: 0,
                  customInspect: !1
                }));
              }
            }], r && i(t.prototype, r), e;
          }();
        },
        1029: function _(e, t, r) {
          "use strict";

          var n = r(4155);
          function o(e, t) {
            s(e, t), i(e);
          }
          function i(e) {
            e._writableState && !e._writableState.emitClose || e._readableState && !e._readableState.emitClose || e.emit("close");
          }
          function s(e, t) {
            e.emit("error", t);
          }
          e.exports = {
            destroy: function destroy(e, t) {
              var r = this,
                a = this._readableState && this._readableState.destroyed,
                u = this._writableState && this._writableState.destroyed;
              return a || u ? (t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, n.nextTick(s, this, e)) : n.nextTick(s, this, e)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function (e) {
                !t && e ? r._writableState ? r._writableState.errorEmitted ? n.nextTick(i, r) : (r._writableState.errorEmitted = !0, n.nextTick(o, r, e)) : n.nextTick(o, r, e) : t ? (n.nextTick(i, r), t(e)) : n.nextTick(i, r);
              }), this);
            },
            undestroy: function undestroy() {
              this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
            },
            errorOrDestroy: function errorOrDestroy(e, t) {
              var r = e._readableState,
                n = e._writableState;
              r && r.autoDestroy || n && n.autoDestroy ? e.destroy(t) : e.emit("error", t);
            }
          };
        },
        1086: function _(e, t, r) {
          "use strict";

          var n = r(8106).q.ERR_STREAM_PREMATURE_CLOSE;
          function o() {}
          e.exports = function e(t, r, i) {
            if ("function" == typeof r) return e(t, null, r);
            r || (r = {}), i = function (e) {
              var t = !1;
              return function () {
                if (!t) {
                  t = !0;
                  for (var r = arguments.length, n = new Array(r), o = 0; o < r; o++) n[o] = arguments[o];
                  e.apply(this, n);
                }
              };
            }(i || o);
            var s = r.readable || !1 !== r.readable && t.readable,
              a = r.writable || !1 !== r.writable && t.writable,
              u = function u() {
                t.writable || l();
              },
              c = t._writableState && t._writableState.finished,
              l = function l() {
                a = !1, c = !0, s || i.call(t);
              },
              p = t._readableState && t._readableState.endEmitted,
              h = function h() {
                s = !1, p = !0, a || i.call(t);
              },
              d = function d(e) {
                i.call(t, e);
              },
              f = function f() {
                var e;
                return s && !p ? (t._readableState && t._readableState.ended || (e = new n()), i.call(t, e)) : a && !c ? (t._writableState && t._writableState.ended || (e = new n()), i.call(t, e)) : void 0;
              },
              m = function m() {
                t.req.on("finish", l);
              };
            return function (e) {
              return e.setHeader && "function" == typeof e.abort;
            }(t) ? (t.on("complete", l), t.on("abort", f), t.req ? m() : t.on("request", m)) : a && !t._writableState && (t.on("end", u), t.on("close", u)), t.on("end", h), t.on("finish", l), !1 !== r.error && t.on("error", d), t.on("close", f), function () {
              t.removeListener("complete", l), t.removeListener("abort", f), t.removeListener("request", m), t.req && t.req.removeListener("finish", l), t.removeListener("end", u), t.removeListener("close", u), t.removeListener("finish", l), t.removeListener("end", h), t.removeListener("error", d), t.removeListener("close", f);
            };
          };
        },
        1265: function _(e) {
          e.exports = function () {
            throw new Error("Readable.from is not available in the browser");
          };
        },
        6472: function _(e, t, r) {
          "use strict";

          var n,
            o = r(8106).q,
            i = o.ERR_MISSING_ARGS,
            s = o.ERR_STREAM_DESTROYED;
          function a(e) {
            if (e) throw e;
          }
          function u(e, t, o, i) {
            i = function (e) {
              var t = !1;
              return function () {
                t || (t = !0, e.apply(void 0, arguments));
              };
            }(i);
            var a = !1;
            e.on("close", function () {
              a = !0;
            }), void 0 === n && (n = r(1086)), n(e, {
              readable: t,
              writable: o
            }, function (e) {
              if (e) return i(e);
              a = !0, i();
            });
            var u = !1;
            return function (t) {
              if (!a && !u) return u = !0, function (e) {
                return e.setHeader && "function" == typeof e.abort;
              }(e) ? e.abort() : "function" == typeof e.destroy ? e.destroy() : void i(t || new s("pipe"));
            };
          }
          function c(e) {
            e();
          }
          function l(e, t) {
            return e.pipe(t);
          }
          function p(e) {
            return e.length ? "function" != typeof e[e.length - 1] ? a : e.pop() : a;
          }
          e.exports = function () {
            for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
            var n,
              o = p(t);
            if (Array.isArray(t[0]) && (t = t[0]), t.length < 2) throw new i("streams");
            var s = t.map(function (e, r) {
              var i = r < t.length - 1;
              return u(e, i, r > 0, function (e) {
                n || (n = e), e && s.forEach(c), i || (s.forEach(c), o(n));
              });
            });
            return t.reduce(l);
          };
        },
        94: function _(e, t, r) {
          "use strict";

          var n = r(8106).q.ERR_INVALID_OPT_VALUE;
          e.exports = {
            getHighWaterMark: function getHighWaterMark(e, t, r, o) {
              var i = function (e, t, r) {
                return null != e.highWaterMark ? e.highWaterMark : t ? e[r] : null;
              }(t, o, r);
              if (null != i) {
                if (!isFinite(i) || Math.floor(i) !== i || i < 0) throw new n(o ? r : "highWaterMark", i);
                return Math.floor(i);
              }
              return e.objectMode ? 16 : 16384;
            }
          };
        },
        3194: function _(e, t, r) {
          e.exports = r(7187).EventEmitter;
        },
        2553: function _(e, t, r) {
          "use strict";

          var n = r(9509).Buffer,
            o = n.isEncoding || function (e) {
              switch ((e = "" + e) && e.toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                case "raw":
                  return !0;
                default:
                  return !1;
              }
            };
          function i(e) {
            var t;
            switch (this.encoding = function (e) {
              var t = function (e) {
                if (!e) return "utf8";
                for (var t;;) switch (e) {
                  case "utf8":
                  case "utf-8":
                    return "utf8";
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return "utf16le";
                  case "latin1":
                  case "binary":
                    return "latin1";
                  case "base64":
                  case "ascii":
                  case "hex":
                    return e;
                  default:
                    if (t) return;
                    e = ("" + e).toLowerCase(), t = !0;
                }
              }(e);
              if ("string" != typeof t && (n.isEncoding === o || !o(e))) throw new Error("Unknown encoding: " + e);
              return t || e;
            }(e), this.encoding) {
              case "utf16le":
                this.text = u, this.end = c, t = 4;
                break;
              case "utf8":
                this.fillLast = a, t = 4;
                break;
              case "base64":
                this.text = l, this.end = p, t = 3;
                break;
              default:
                return this.write = h, void (this.end = d);
            }
            this.lastNeed = 0, this.lastTotal = 0, this.lastChar = n.allocUnsafe(t);
          }
          function s(e) {
            return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2;
          }
          function a(e) {
            var t = this.lastTotal - this.lastNeed,
              r = function (e, t, r) {
                if (128 != (192 & t[0])) return e.lastNeed = 0, "�";
                if (e.lastNeed > 1 && t.length > 1) {
                  if (128 != (192 & t[1])) return e.lastNeed = 1, "�";
                  if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2])) return e.lastNeed = 2, "�";
                }
              }(this, e);
            return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length), void (this.lastNeed -= e.length));
          }
          function u(e, t) {
            if ((e.length - t) % 2 == 0) {
              var r = e.toString("utf16le", t);
              if (r) {
                var n = r.charCodeAt(r.length - 1);
                if (n >= 55296 && n <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1], r.slice(0, -1);
              }
              return r;
            }
            return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], e.toString("utf16le", t, e.length - 1);
          }
          function c(e) {
            var t = e && e.length ? this.write(e) : "";
            if (this.lastNeed) {
              var r = this.lastTotal - this.lastNeed;
              return t + this.lastChar.toString("utf16le", 0, r);
            }
            return t;
          }
          function l(e, t) {
            var r = (e.length - t) % 3;
            return 0 === r ? e.toString("base64", t) : (this.lastNeed = 3 - r, this.lastTotal = 3, 1 === r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - r));
          }
          function p(e) {
            var t = e && e.length ? this.write(e) : "";
            return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t;
          }
          function h(e) {
            return e.toString(this.encoding);
          }
          function d(e) {
            return e && e.length ? this.write(e) : "";
          }
          t.s = i, i.prototype.write = function (e) {
            if (0 === e.length) return "";
            var t, r;
            if (this.lastNeed) {
              if (void 0 === (t = this.fillLast(e))) return "";
              r = this.lastNeed, this.lastNeed = 0;
            } else r = 0;
            return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || "";
          }, i.prototype.end = function (e) {
            var t = e && e.length ? this.write(e) : "";
            return this.lastNeed ? t + "�" : t;
          }, i.prototype.text = function (e, t) {
            var r = function (e, t, r) {
              var n = t.length - 1;
              if (n < r) return 0;
              var o = s(t[n]);
              return o >= 0 ? (o > 0 && (e.lastNeed = o - 1), o) : --n < r || -2 === o ? 0 : (o = s(t[n])) >= 0 ? (o > 0 && (e.lastNeed = o - 2), o) : --n < r || -2 === o ? 0 : (o = s(t[n])) >= 0 ? (o > 0 && (2 === o ? o = 0 : e.lastNeed = o - 3), o) : 0;
            }(this, e, t);
            if (!this.lastNeed) return e.toString("utf8", t);
            this.lastTotal = r;
            var n = e.length - (r - this.lastNeed);
            return e.copy(this.lastChar, 0, n), e.toString("utf8", t, n);
          }, i.prototype.fillLast = function (e) {
            if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
            e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length;
          };
        },
        5524: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.uniqueId = t.uniqueNumericId = t.convertInchesToTwip = t.convertMillimetersToTwip = void 0;
          var n = r(2961);
          var o = 0;
          t.convertMillimetersToTwip = function (e) {
            return Math.floor(e / 25.4 * 72 * 20);
          }, t.convertInchesToTwip = function (e) {
            return Math.floor(72 * e * 20);
          }, t.uniqueNumericId = function () {
            return ++o;
          }, t.uniqueId = function () {
            return (0, n.nanoid)().toLowerCase();
          };
        },
        3599: function _(e, t) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Formatter = void 0, t.Formatter = /*#__PURE__*/function () {
            function _class2() {
              _classCallCheck(this, _class2);
            }
            _createClass(_class2, [{
              key: "format",
              value: function format(e) {
                var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var r = e.prepForXml(t);
                if (r) return r;
                throw Error("XMLComponent did not format correctly");
              }
            }]);
            return _class2;
          }();
        },
        6117: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(3689), t);
        },
        697: function _(e, t) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ImageReplacer = void 0, t.ImageReplacer = /*#__PURE__*/function () {
            function _class3() {
              _classCallCheck(this, _class3);
            }
            _createClass(_class3, [{
              key: "replace",
              value: function replace(e, t, r) {
                var n = e;
                return t.forEach(function (e, t) {
                  n = n.replace(new RegExp("{".concat(e.fileName, "}"), "g"), (r + t).toString());
                }), n;
              }
            }, {
              key: "getMediaData",
              value: function getMediaData(e, t) {
                return t.Array.filter(function (t) {
                  return e.search("{".concat(t.fileName, "}")) > 0;
                });
              }
            }]);
            return _class3;
          }();
        },
        1399: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Compiler = void 0;
          var n = r(5733),
            o = r(3479),
            i = r(3599),
            s = r(697),
            a = r(9347);
          t.Compiler = /*#__PURE__*/function () {
            function _class4() {
              _classCallCheck(this, _class4);
              this.formatter = new i.Formatter(), this.imageReplacer = new s.ImageReplacer(), this.numberingReplacer = new a.NumberingReplacer();
            }
            _createClass(_class4, [{
              key: "compile",
              value: function compile(e, t) {
                var r = new n(),
                  o = this.xmlifyFile(e, t);
                for (var _e4 in o) {
                  if (!o[_e4]) continue;
                  var _t10 = o[_e4];
                  if (Array.isArray(_t10)) {
                    var _iterator = _createForOfIteratorHelper(_t10),
                      _step;
                    try {
                      for (_iterator.s(); !(_step = _iterator.n()).done;) {
                        var _e5 = _step.value;
                        r.file(_e5.path, _e5.data);
                      }
                    } catch (err) {
                      _iterator.e(err);
                    } finally {
                      _iterator.f();
                    }
                  } else r.file(_t10.path, _t10.data);
                }
                var _iterator2 = _createForOfIteratorHelper(e.Media.Array),
                  _step2;
                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    var _t11 = _step2.value;
                    var _e6 = _t11.stream;
                    r.file("word/media/".concat(_t11.fileName), _e6);
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }
                return r;
              }
            }, {
              key: "xmlifyFile",
              value: function xmlifyFile(e, t) {
                var _this2 = this;
                var r = e.Document.Relationships.RelationshipCount + 1,
                  n = o(this.formatter.format(e.Document.View, {
                    viewWrapper: e.Document,
                    file: e
                  }), {
                    indent: t,
                    declaration: {
                      standalone: "yes",
                      encoding: "UTF-8"
                    }
                  }),
                  i = this.imageReplacer.getMediaData(n, e.Media);
                return {
                  Relationships: {
                    data: function () {
                      return i.forEach(function (t, n) {
                        e.Document.Relationships.createRelationship(r + n, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image", "media/".concat(t.fileName));
                      }), o(_this2.formatter.format(e.Document.Relationships, {
                        viewWrapper: e.Document,
                        file: e
                      }), {
                        indent: t,
                        declaration: {
                          encoding: "UTF-8"
                        }
                      });
                    }(),
                    path: "word/_rels/document.xml.rels"
                  },
                  Document: {
                    data: function () {
                      var t = _this2.imageReplacer.replace(n, i, r);
                      return _this2.numberingReplacer.replace(t, e.Numbering.ConcreteNumbering);
                    }(),
                    path: "word/document.xml"
                  },
                  Styles: {
                    data: function () {
                      var r = o(_this2.formatter.format(e.Styles, {
                        viewWrapper: e.Document,
                        file: e
                      }), {
                        indent: t,
                        declaration: {
                          standalone: "yes",
                          encoding: "UTF-8"
                        }
                      });
                      return _this2.numberingReplacer.replace(r, e.Numbering.ConcreteNumbering);
                    }(),
                    path: "word/styles.xml"
                  },
                  Properties: {
                    data: o(this.formatter.format(e.CoreProperties, {
                      viewWrapper: e.Document,
                      file: e
                    }), {
                      indent: t,
                      declaration: {
                        standalone: "yes",
                        encoding: "UTF-8"
                      }
                    }),
                    path: "docProps/core.xml"
                  },
                  Numbering: {
                    data: o(this.formatter.format(e.Numbering, {
                      viewWrapper: e.Document,
                      file: e
                    }), {
                      indent: t,
                      declaration: {
                        standalone: "yes",
                        encoding: "UTF-8"
                      }
                    }),
                    path: "word/numbering.xml"
                  },
                  FileRelationships: {
                    data: o(this.formatter.format(e.FileRelationships, {
                      viewWrapper: e.Document,
                      file: e
                    }), {
                      indent: t,
                      declaration: {
                        encoding: "UTF-8"
                      }
                    }),
                    path: "_rels/.rels"
                  },
                  HeaderRelationships: e.Headers.map(function (r, n) {
                    var i = o(_this2.formatter.format(r.View, {
                      viewWrapper: r,
                      file: e
                    }), {
                      indent: t,
                      declaration: {
                        encoding: "UTF-8"
                      }
                    });
                    return _this2.imageReplacer.getMediaData(i, e.Media).forEach(function (e, t) {
                      r.Relationships.createRelationship(t, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image", "media/".concat(e.fileName));
                    }), {
                      data: o(_this2.formatter.format(r.Relationships, {
                        viewWrapper: r,
                        file: e
                      }), {
                        indent: t,
                        declaration: {
                          encoding: "UTF-8"
                        }
                      }),
                      path: "word/_rels/header".concat(n + 1, ".xml.rels")
                    };
                  }),
                  FooterRelationships: e.Footers.map(function (r, n) {
                    var i = o(_this2.formatter.format(r.View, {
                      viewWrapper: r,
                      file: e
                    }), {
                      indent: t,
                      declaration: {
                        encoding: "UTF-8"
                      }
                    });
                    return _this2.imageReplacer.getMediaData(i, e.Media).forEach(function (e, t) {
                      r.Relationships.createRelationship(t, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image", "media/".concat(e.fileName));
                    }), {
                      data: o(_this2.formatter.format(r.Relationships, {
                        viewWrapper: r,
                        file: e
                      }), {
                        indent: t,
                        declaration: {
                          encoding: "UTF-8"
                        }
                      }),
                      path: "word/_rels/footer".concat(n + 1, ".xml.rels")
                    };
                  }),
                  Headers: e.Headers.map(function (r, n) {
                    var i = o(_this2.formatter.format(r.View, {
                        viewWrapper: r,
                        file: e
                      }), {
                        indent: t,
                        declaration: {
                          encoding: "UTF-8"
                        }
                      }),
                      s = _this2.imageReplacer.getMediaData(i, e.Media);
                    return {
                      data: _this2.imageReplacer.replace(i, s, 0),
                      path: "word/header".concat(n + 1, ".xml")
                    };
                  }),
                  Footers: e.Footers.map(function (r, n) {
                    var i = o(_this2.formatter.format(r.View, {
                        viewWrapper: r,
                        file: e
                      }), {
                        indent: t,
                        declaration: {
                          encoding: "UTF-8"
                        }
                      }),
                      s = _this2.imageReplacer.getMediaData(i, e.Media);
                    return {
                      data: _this2.imageReplacer.replace(i, s, 0),
                      path: "word/footer".concat(n + 1, ".xml")
                    };
                  }),
                  ContentTypes: {
                    data: o(this.formatter.format(e.ContentTypes, {
                      viewWrapper: e.Document,
                      file: e
                    }), {
                      indent: t,
                      declaration: {
                        encoding: "UTF-8"
                      }
                    }),
                    path: "[Content_Types].xml"
                  },
                  CustomProperties: {
                    data: o(this.formatter.format(e.CustomProperties, {
                      viewWrapper: e.Document,
                      file: e
                    }), {
                      indent: t,
                      declaration: {
                        standalone: "yes",
                        encoding: "UTF-8"
                      }
                    }),
                    path: "docProps/custom.xml"
                  },
                  AppProperties: {
                    data: o(this.formatter.format(e.AppProperties, {
                      viewWrapper: e.Document,
                      file: e
                    }), {
                      indent: t,
                      declaration: {
                        standalone: "yes",
                        encoding: "UTF-8"
                      }
                    }),
                    path: "docProps/app.xml"
                  },
                  FootNotes: {
                    data: o(this.formatter.format(e.FootNotes.View, {
                      viewWrapper: e.FootNotes,
                      file: e
                    }), {
                      indent: t,
                      declaration: {
                        encoding: "UTF-8"
                      }
                    }),
                    path: "word/footnotes.xml"
                  },
                  FootNotesRelationships: {
                    data: o(this.formatter.format(e.FootNotes.Relationships, {
                      viewWrapper: e.FootNotes,
                      file: e
                    }), {
                      indent: t,
                      declaration: {
                        encoding: "UTF-8"
                      }
                    }),
                    path: "word/_rels/footnotes.xml.rels"
                  },
                  Settings: {
                    data: o(this.formatter.format(e.Settings, {
                      viewWrapper: e.Document,
                      file: e
                    }), {
                      indent: t,
                      declaration: {
                        standalone: "yes",
                        encoding: "UTF-8"
                      }
                    }),
                    path: "word/settings.xml"
                  }
                };
              }
            }]);
            return _class4;
          }();
        },
        9347: function _(e, t) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.NumberingReplacer = void 0, t.NumberingReplacer = /*#__PURE__*/function () {
            function _class5() {
              _classCallCheck(this, _class5);
            }
            _createClass(_class5, [{
              key: "replace",
              value: function replace(e, t) {
                var r = e;
                var _iterator3 = _createForOfIteratorHelper(t),
                  _step3;
                try {
                  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                    var _e7 = _step3.value;
                    r = r.replace(new RegExp("{".concat(_e7.reference, "-").concat(_e7.instance, "}"), "g"), _e7.numId.toString());
                  }
                } catch (err) {
                  _iterator3.e(err);
                } finally {
                  _iterator3.f();
                }
                return r;
              }
            }]);
            return _class5;
          }();
        },
        3689: function _(e, t, r) {
          "use strict";

          var n = this && this.__awaiter || function (e, t, r, n) {
            return new (r || (r = Promise))(function (o, i) {
              function s(e) {
                try {
                  u(n.next(e));
                } catch (e) {
                  i(e);
                }
              }
              function a(e) {
                try {
                  u(n.throw(e));
                } catch (e) {
                  i(e);
                }
              }
              function u(e) {
                var t;
                e.done ? o(e.value) : (t = e.value, t instanceof r ? t : new r(function (e) {
                  e(t);
                })).then(s, a);
              }
              u((n = n.apply(e, t || [])).next());
            });
          };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Packer = void 0;
          var o = r(1399);
          var i = /*#__PURE__*/function () {
            function i() {
              _classCallCheck(this, i);
            }
            _createClass(i, null, [{
              key: "toBuffer",
              value: function toBuffer(e, t) {
                return n(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
                  var r;
                  return _regeneratorRuntime().wrap(function _callee$(_context) {
                    while (1) switch (_context.prev = _context.next) {
                      case 0:
                        r = this.compiler.compile(e, t);
                        _context.next = 3;
                        return r.generateAsync({
                          type: "nodebuffer",
                          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          compression: "DEFLATE"
                        });
                      case 3:
                        return _context.abrupt("return", _context.sent);
                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }, _callee, this);
                }));
              }
            }, {
              key: "toBase64String",
              value: function toBase64String(e, t) {
                return n(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
                  var r;
                  return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                    while (1) switch (_context2.prev = _context2.next) {
                      case 0:
                        r = this.compiler.compile(e, t);
                        _context2.next = 3;
                        return r.generateAsync({
                          type: "base64",
                          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          compression: "DEFLATE"
                        });
                      case 3:
                        return _context2.abrupt("return", _context2.sent);
                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }, _callee2, this);
                }));
              }
            }, {
              key: "toBlob",
              value: function toBlob(e, t) {
                return n(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
                  var r;
                  return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                    while (1) switch (_context3.prev = _context3.next) {
                      case 0:
                        r = this.compiler.compile(e, t);
                        _context3.next = 3;
                        return r.generateAsync({
                          type: "blob",
                          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          compression: "DEFLATE"
                        });
                      case 3:
                        return _context3.abrupt("return", _context3.sent);
                      case 4:
                      case "end":
                        return _context3.stop();
                    }
                  }, _callee3, this);
                }));
              }
            }]);
            return i;
          }();
          t.Packer = i, i.compiler = new o.Compiler();
        },
        4546: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.AppPropertiesAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon) {
            _inherits(o, _n$XmlAttributeCompon);
            var _super2 = _createSuper(o);
            function o() {
              var _this3;
              _classCallCheck(this, o);
              _this3 = _super2.apply(this, arguments), _this3.xmlKeys = {
                xmlns: "xmlns",
                vt: "xmlns:vt"
              };
              return _this3;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.AppPropertiesAttributes = o;
        },
        2378: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.AppProperties = void 0;
          var n = r(2451),
            o = r(4546);
          var i = /*#__PURE__*/function (_n$XmlComponent) {
            _inherits(i, _n$XmlComponent);
            var _super3 = _createSuper(i);
            function i() {
              var _this4;
              _classCallCheck(this, i);
              _this4 = _super3.call(this, "Properties"), _this4.root.push(new o.AppPropertiesAttributes({
                xmlns: "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties",
                vt: "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"
              }));
              return _this4;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.AppProperties = i;
        },
        5620: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.BorderStyle = t.BorderElement = void 0;
          var n = r(2451),
            o = r(459);
          var i = /*#__PURE__*/function (_n$XmlComponent2) {
            _inherits(i, _n$XmlComponent2);
            var _super4 = _createSuper(i);
            function i(e, _ref) {
              var _this5;
              var t = _ref.color,
                r = _ref.size,
                n = _ref.space,
                _i4 = _ref.style;
              _classCallCheck(this, i);
              _this5 = _super4.call(this, e), _this5.root.push(new s({
                style: _i4,
                color: void 0 === t ? void 0 : (0, o.hexColorValue)(t),
                size: void 0 === r ? void 0 : (0, o.eighthPointMeasureValue)(r),
                space: void 0 === n ? void 0 : (0, o.pointMeasureValue)(n)
              }));
              return _this5;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.BorderElement = i;
          var s = /*#__PURE__*/function (_n$XmlAttributeCompon2) {
            _inherits(s, _n$XmlAttributeCompon2);
            var _super5 = _createSuper(s);
            function s() {
              var _this6;
              _classCallCheck(this, s);
              _this6 = _super5.apply(this, arguments), _this6.xmlKeys = {
                style: "w:val",
                color: "w:color",
                size: "w:sz",
                space: "w:space"
              };
              return _this6;
            }
            return _createClass(s);
          }(n.XmlAttributeComponent);
          var a;
          (a = t.BorderStyle || (t.BorderStyle = {})).SINGLE = "single", a.DASH_DOT_STROKED = "dashDotStroked", a.DASHED = "dashed", a.DASH_SMALL_GAP = "dashSmallGap", a.DOT_DASH = "dotDash", a.DOT_DOT_DASH = "dotDotDash", a.DOTTED = "dotted", a.DOUBLE = "double", a.DOUBLE_WAVE = "doubleWave", a.INSET = "inset", a.NIL = "nil", a.NONE = "none", a.OUTSET = "outset", a.THICK = "thick", a.THICK_THIN_LARGE_GAP = "thickThinLargeGap", a.THICK_THIN_MEDIUM_GAP = "thickThinMediumGap", a.THICK_THIN_SMALL_GAP = "thickThinSmallGap", a.THIN_THICK_LARGE_GAP = "thinThickLargeGap", a.THIN_THICK_MEDIUM_GAP = "thinThickMediumGap", a.THIN_THICK_SMALL_GAP = "thinThickSmallGap", a.THIN_THICK_THIN_LARGE_GAP = "thinThickThinLargeGap", a.THIN_THICK_THIN_MEDIUM_GAP = "thinThickThinMediumGap", a.THIN_THICK_THIN_SMALL_GAP = "thinThickThinSmallGap", a.THREE_D_EMBOSS = "threeDEmboss", a.THREE_D_ENGRAVE = "threeDEngrave", a.TRIPLE = "triple", a.WAVE = "wave";
        },
        5328: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(5620), t);
        },
        6963: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ContentTypeAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon3) {
            _inherits(o, _n$XmlAttributeCompon3);
            var _super6 = _createSuper(o);
            function o() {
              var _this7;
              _classCallCheck(this, o);
              _this7 = _super6.apply(this, arguments), _this7.xmlKeys = {
                xmlns: "xmlns"
              };
              return _this7;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.ContentTypeAttributes = o;
        },
        8351: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ContentTypes = void 0;
          var n = r(2451),
            o = r(6963),
            i = r(6445),
            s = r(5425);
          var a = /*#__PURE__*/function (_n$XmlComponent3) {
            _inherits(a, _n$XmlComponent3);
            var _super7 = _createSuper(a);
            function a() {
              var _this8;
              _classCallCheck(this, a);
              _this8 = _super7.call(this, "Types"), _this8.root.push(new o.ContentTypeAttributes({
                xmlns: "http://schemas.openxmlformats.org/package/2006/content-types"
              })), _this8.root.push(new i.Default("image/png", "png")), _this8.root.push(new i.Default("image/jpeg", "jpeg")), _this8.root.push(new i.Default("image/jpeg", "jpg")), _this8.root.push(new i.Default("image/bmp", "bmp")), _this8.root.push(new i.Default("image/gif", "gif")), _this8.root.push(new i.Default("application/vnd.openxmlformats-package.relationships+xml", "rels")), _this8.root.push(new i.Default("application/xml", "xml")), _this8.root.push(new s.Override("application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml", "/word/document.xml")), _this8.root.push(new s.Override("application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml", "/word/styles.xml")), _this8.root.push(new s.Override("application/vnd.openxmlformats-package.core-properties+xml", "/docProps/core.xml")), _this8.root.push(new s.Override("application/vnd.openxmlformats-officedocument.custom-properties+xml", "/docProps/custom.xml")), _this8.root.push(new s.Override("application/vnd.openxmlformats-officedocument.extended-properties+xml", "/docProps/app.xml")), _this8.root.push(new s.Override("application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml", "/word/numbering.xml")), _this8.root.push(new s.Override("application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml", "/word/footnotes.xml")), _this8.root.push(new s.Override("application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml", "/word/settings.xml"));
              return _this8;
            }
            _createClass(a, [{
              key: "addFooter",
              value: function addFooter(e) {
                this.root.push(new s.Override("application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml", "/word/footer".concat(e, ".xml")));
              }
            }, {
              key: "addHeader",
              value: function addHeader(e) {
                this.root.push(new s.Override("application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml", "/word/header".concat(e, ".xml")));
              }
            }]);
            return a;
          }(n.XmlComponent);
          t.ContentTypes = a;
        },
        3942: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.DefaultAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon4) {
            _inherits(o, _n$XmlAttributeCompon4);
            var _super8 = _createSuper(o);
            function o() {
              var _this9;
              _classCallCheck(this, o);
              _this9 = _super8.apply(this, arguments), _this9.xmlKeys = {
                contentType: "ContentType",
                extension: "Extension"
              };
              return _this9;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.DefaultAttributes = o;
        },
        6445: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Default = void 0;
          var n = r(2451),
            o = r(3942);
          var i = /*#__PURE__*/function (_n$XmlComponent4) {
            _inherits(i, _n$XmlComponent4);
            var _super9 = _createSuper(i);
            function i(e, t) {
              var _this10;
              _classCallCheck(this, i);
              _this10 = _super9.call(this, "Default"), _this10.root.push(new o.DefaultAttributes({
                contentType: e,
                extension: t
              }));
              return _this10;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.Default = i;
        },
        4348: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.OverrideAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon5) {
            _inherits(o, _n$XmlAttributeCompon5);
            var _super10 = _createSuper(o);
            function o() {
              var _this11;
              _classCallCheck(this, o);
              _this11 = _super10.apply(this, arguments), _this11.xmlKeys = {
                contentType: "ContentType",
                partName: "PartName"
              };
              return _this11;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.OverrideAttributes = o;
        },
        5425: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Override = void 0;
          var n = r(2451),
            o = r(4348);
          var i = /*#__PURE__*/function (_n$XmlComponent5) {
            _inherits(i, _n$XmlComponent5);
            var _super11 = _createSuper(i);
            function i(e, t) {
              var _this12;
              _classCallCheck(this, i);
              _this12 = _super11.call(this, "Override"), _this12.root.push(new o.OverrideAttributes({
                contentType: e,
                partName: t
              }));
              return _this12;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.Override = i;
        },
        9349: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(2429), t);
        },
        2429: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.CoreProperties = void 0;
          var n = r(2451),
            o = r(7627),
            i = r(459);
          var s = /*#__PURE__*/function (_n$XmlComponent6) {
            _inherits(s, _n$XmlComponent6);
            var _super12 = _createSuper(s);
            function s(e) {
              var _this13;
              _classCallCheck(this, s);
              _this13 = _super12.call(this, "cp:coreProperties"), _this13.root.push(new o.DocumentAttributes({
                cp: "http://schemas.openxmlformats.org/package/2006/metadata/core-properties",
                dc: "http://purl.org/dc/elements/1.1/",
                dcterms: "http://purl.org/dc/terms/",
                dcmitype: "http://purl.org/dc/dcmitype/",
                xsi: "http://www.w3.org/2001/XMLSchema-instance"
              })), e.title && _this13.root.push(new n.StringContainer("dc:title", e.title)), e.subject && _this13.root.push(new n.StringContainer("dc:subject", e.subject)), e.creator && _this13.root.push(new n.StringContainer("dc:creator", e.creator)), e.keywords && _this13.root.push(new n.StringContainer("cp:keywords", e.keywords)), e.description && _this13.root.push(new n.StringContainer("dc:description", e.description)), e.lastModifiedBy && _this13.root.push(new n.StringContainer("cp:lastModifiedBy", e.lastModifiedBy)), e.revision && _this13.root.push(new n.StringContainer("cp:revision", e.revision)), _this13.root.push(new a("dcterms:created")), _this13.root.push(new a("dcterms:modified"));
              return _this13;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.CoreProperties = s;
          var a = /*#__PURE__*/function (_n$XmlComponent7) {
            _inherits(a, _n$XmlComponent7);
            var _super13 = _createSuper(a);
            function a(e) {
              var _this14;
              _classCallCheck(this, a);
              _this14 = _super13.call(this, e), _this14.root.push(new o.DocumentAttributes({
                type: "dcterms:W3CDTF"
              })), _this14.root.push((0, i.dateTimeValue)(new Date()));
              return _this14;
            }
            return _createClass(a);
          }(n.XmlComponent);
        },
        7312: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.CustomPropertiesAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon6) {
            _inherits(o, _n$XmlAttributeCompon6);
            var _super14 = _createSuper(o);
            function o() {
              var _this15;
              _classCallCheck(this, o);
              _this15 = _super14.apply(this, arguments), _this15.xmlKeys = {
                xmlns: "xmlns",
                vt: "xmlns:vt"
              };
              return _this15;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.CustomPropertiesAttributes = o;
        },
        45: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.CustomProperties = void 0;
          var n = r(2451),
            o = r(7312),
            i = r(5587);
          var s = /*#__PURE__*/function (_n$XmlComponent8) {
            _inherits(s, _n$XmlComponent8);
            var _super15 = _createSuper(s);
            function s(e) {
              var _this16;
              _classCallCheck(this, s);
              _this16 = _super15.call(this, "Properties"), _this16.properties = [], _this16.root.push(new o.CustomPropertiesAttributes({
                xmlns: "http://schemas.openxmlformats.org/officeDocument/2006/custom-properties",
                vt: "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"
              })), _this16.nextId = 2;
              var _iterator4 = _createForOfIteratorHelper(e),
                _step4;
              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  var _t12 = _step4.value;
                  _this16.addCustomProperty(_t12);
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
              return _this16;
            }
            _createClass(s, [{
              key: "prepForXml",
              value: function prepForXml(e) {
                var _this17 = this;
                return this.properties.forEach(function (e) {
                  return _this17.root.push(e);
                }), _get(_getPrototypeOf(s.prototype), "prepForXml", this).call(this, e);
              }
            }, {
              key: "addCustomProperty",
              value: function addCustomProperty(e) {
                this.properties.push(new i.CustomProperty(this.nextId++, e));
              }
            }]);
            return s;
          }(n.XmlComponent);
          t.CustomProperties = s;
        },
        2455: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.CustomPropertyAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon7) {
            _inherits(o, _n$XmlAttributeCompon7);
            var _super16 = _createSuper(o);
            function o() {
              var _this18;
              _classCallCheck(this, o);
              _this18 = _super16.apply(this, arguments), _this18.xmlKeys = {
                fmtid: "fmtid",
                pid: "pid",
                name: "name"
              };
              return _this18;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.CustomPropertyAttributes = o;
        },
        5587: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.CustomPropertyValue = t.CustomProperty = void 0;
          var n = r(2451),
            o = r(2455);
          var i = /*#__PURE__*/function (_n$XmlComponent9) {
            _inherits(i, _n$XmlComponent9);
            var _super17 = _createSuper(i);
            function i(e, t) {
              var _this19;
              _classCallCheck(this, i);
              _this19 = _super17.call(this, "property"), _this19.root.push(new o.CustomPropertyAttributes({
                fmtid: "{D5CDD505-2E9C-101B-9397-08002B2CF9AE}",
                pid: e.toString(),
                name: t.name
              })), _this19.root.push(new s(t.value));
              return _this19;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.CustomProperty = i;
          var s = /*#__PURE__*/function (_n$XmlComponent10) {
            _inherits(s, _n$XmlComponent10);
            var _super18 = _createSuper(s);
            function s(e) {
              var _this20;
              _classCallCheck(this, s);
              _this20 = _super18.call(this, "vt:lpwstr"), _this20.root.push(e);
              return _this20;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.CustomPropertyValue = s;
        },
        1157: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(45), t), o(r(5587), t);
        },
        7249: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.DocumentWrapper = void 0;
          var n = r(6593),
            o = r(7224);
          t.DocumentWrapper = /*#__PURE__*/function () {
            function _class6(e) {
              _classCallCheck(this, _class6);
              this.document = new n.Document(e), this.relationships = new o.Relationships();
            }
            _createClass(_class6, [{
              key: "View",
              get: function get() {
                return this.document;
              }
            }, {
              key: "Relationships",
              get: function get() {
                return this.relationships;
              }
            }]);
            return _class6;
          }();
        },
        6693: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Body = void 0;
          var n = r(2451),
            o = r(7559),
            i = r(7748);
          var s = /*#__PURE__*/function (_n$XmlComponent11) {
            _inherits(s, _n$XmlComponent11);
            var _super19 = _createSuper(s);
            function s() {
              var _this21;
              _classCallCheck(this, s);
              _this21 = _super19.call(this, "w:body"), _this21.sections = [];
              return _this21;
            }
            _createClass(s, [{
              key: "addSection",
              value: function addSection(e) {
                var t = this.sections.pop();
                this.root.push(this.createSectionParagraph(t)), this.sections.push(new i.SectionProperties(e));
              }
            }, {
              key: "prepForXml",
              value: function prepForXml(e) {
                return 1 === this.sections.length && (this.root.splice(0, 1), this.root.push(this.sections.pop())), _get(_getPrototypeOf(s.prototype), "prepForXml", this).call(this, e);
              }
            }, {
              key: "push",
              value: function push(e) {
                this.root.push(e);
              }
            }, {
              key: "createSectionParagraph",
              value: function createSectionParagraph(e) {
                var t = new o.Paragraph({}),
                  r = new o.ParagraphProperties({});
                return r.push(e), t.addChildElement(r), t;
              }
            }]);
            return s;
          }(n.XmlComponent);
          t.Body = s;
        },
        5290: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(6693), t), o(r(3778), t);
        },
        3778: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(7748), t), o(r(243), t);
        },
        3014: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Column = t.ColumnAttributes = void 0;
          var n = r(459),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon) {
            _inherits(i, _o$XmlAttributeCompon);
            var _super20 = _createSuper(i);
            function i() {
              var _this22;
              _classCallCheck(this, i);
              _this22 = _super20.apply(this, arguments), _this22.xmlKeys = {
                width: "w:w",
                space: "w:space"
              };
              return _this22;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          t.ColumnAttributes = i;
          var s = /*#__PURE__*/function (_o$XmlComponent) {
            _inherits(s, _o$XmlComponent);
            var _super21 = _createSuper(s);
            function s(_ref2) {
              var _this23;
              var e = _ref2.width,
                t = _ref2.space;
              _classCallCheck(this, s);
              _this23 = _super21.call(this, "w:col"), _this23.root.push(new i({
                width: (0, n.twipsMeasureValue)(e),
                space: void 0 === t ? void 0 : (0, n.twipsMeasureValue)(t)
              }));
              return _this23;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.Column = s;
        },
        1770: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Columns = t.ColumnsAttributes = void 0;
          var n = r(459),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon2) {
            _inherits(i, _o$XmlAttributeCompon2);
            var _super22 = _createSuper(i);
            function i() {
              var _this24;
              _classCallCheck(this, i);
              _this24 = _super22.apply(this, arguments), _this24.xmlKeys = {
                space: "w:space",
                count: "w:num",
                separate: "w:sep",
                equalWidth: "w:equalWidth"
              };
              return _this24;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          t.ColumnsAttributes = i;
          var s = /*#__PURE__*/function (_o$XmlComponent2) {
            _inherits(s, _o$XmlComponent2);
            var _super23 = _createSuper(s);
            function s(_ref3) {
              var _this25;
              var e = _ref3.space,
                t = _ref3.count,
                r = _ref3.separate,
                o = _ref3.equalWidth,
                _s5 = _ref3.children;
              _classCallCheck(this, s);
              _this25 = _super23.call(this, "w:cols"), _this25.root.push(new i({
                space: void 0 === e ? void 0 : (0, n.twipsMeasureValue)(e),
                count: void 0 === t ? void 0 : (0, n.decimalNumber)(t),
                separate: r,
                equalWidth: o
              })), !o && _s5 && _s5.forEach(function (e) {
                return _this25.addChildElement(e);
              });
              return _this25;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.Columns = s;
        },
        2062: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.DocumentGrid = t.DocGridAttributes = void 0;
          var n = r(459),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon3) {
            _inherits(i, _o$XmlAttributeCompon3);
            var _super24 = _createSuper(i);
            function i() {
              var _this26;
              _classCallCheck(this, i);
              _this26 = _super24.apply(this, arguments), _this26.xmlKeys = {
                linePitch: "w:linePitch"
              };
              return _this26;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          t.DocGridAttributes = i;
          var s = /*#__PURE__*/function (_o$XmlComponent3) {
            _inherits(s, _o$XmlComponent3);
            var _super25 = _createSuper(s);
            function s(e) {
              var _this27;
              _classCallCheck(this, s);
              _this27 = _super25.call(this, "w:docGrid"), _this27.root.push(new i({
                linePitch: (0, n.decimalNumber)(e)
              }));
              return _this27;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.DocumentGrid = s;
        },
        9719: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.HeaderFooterReference = t.HeaderFooterType = t.HeaderFooterReferenceType = void 0;
          var n = r(2451);
          var o, i;
          !function (e) {
            e.DEFAULT = "default", e.FIRST = "first", e.EVEN = "even";
          }(o = t.HeaderFooterReferenceType || (t.HeaderFooterReferenceType = {}));
          var s = /*#__PURE__*/function (_n$XmlAttributeCompon8) {
            _inherits(s, _n$XmlAttributeCompon8);
            var _super26 = _createSuper(s);
            function s() {
              var _this28;
              _classCallCheck(this, s);
              _this28 = _super26.apply(this, arguments), _this28.xmlKeys = {
                type: "w:type",
                id: "r:id"
              };
              return _this28;
            }
            return _createClass(s);
          }(n.XmlAttributeComponent);
          (i = t.HeaderFooterType || (t.HeaderFooterType = {})).HEADER = "w:headerReference", i.FOOTER = "w:footerReference";
          var a = /*#__PURE__*/function (_n$XmlComponent12) {
            _inherits(a, _n$XmlComponent12);
            var _super27 = _createSuper(a);
            function a(e, t) {
              var _this29;
              _classCallCheck(this, a);
              _this29 = _super27.call(this, e), _this29.root.push(new s({
                type: t.type || o.DEFAULT,
                id: "rId".concat(t.id)
              }));
              return _this29;
            }
            return _createClass(a);
          }(n.XmlComponent);
          t.HeaderFooterReference = a;
        },
        243: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(3014), t), o(r(1770), t), o(r(2062), t), o(r(7649), t), o(r(7797), t), o(r(6527), t), o(r(7189), t), o(r(6527), t), o(r(7067), t), o(r(5849), t), o(r(9719), t);
        },
        7067: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.LineNumberType = t.LineNumberAttributes = t.LineNumberRestartFormat = void 0;
          var n = r(459),
            o = r(2451);
          var i;
          (i = t.LineNumberRestartFormat || (t.LineNumberRestartFormat = {})).NEW_PAGE = "newPage", i.NEW_SECTION = "newSection", i.CONTINUOUS = "continuous";
          var s = /*#__PURE__*/function (_o$XmlAttributeCompon4) {
            _inherits(s, _o$XmlAttributeCompon4);
            var _super28 = _createSuper(s);
            function s() {
              var _this30;
              _classCallCheck(this, s);
              _this30 = _super28.apply(this, arguments), _this30.xmlKeys = {
                countBy: "w:countBy",
                start: "w:start",
                restart: "w:restart",
                distance: "w:distance"
              };
              return _this30;
            }
            return _createClass(s);
          }(o.XmlAttributeComponent);
          t.LineNumberAttributes = s;
          var a = /*#__PURE__*/function (_o$XmlComponent4) {
            _inherits(a, _o$XmlComponent4);
            var _super29 = _createSuper(a);
            function a(_ref4) {
              var _this31;
              var e = _ref4.countBy,
                t = _ref4.start,
                r = _ref4.restart,
                o = _ref4.distance;
              _classCallCheck(this, a);
              _this31 = _super29.call(this, "w:lnNumType"), _this31.root.push(new s({
                countBy: void 0 === e ? void 0 : (0, n.decimalNumber)(e),
                start: void 0 === t ? void 0 : (0, n.decimalNumber)(t),
                restart: r,
                distance: void 0 === o ? void 0 : (0, n.twipsMeasureValue)(o)
              }));
              return _this31;
            }
            return _createClass(a);
          }(o.XmlComponent);
          t.LineNumberType = a;
        },
        6527: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.PageBorders = t.PageBorderZOrder = t.PageBorderOffsetFrom = t.PageBorderDisplay = void 0;
          var n = r(5328),
            o = r(2451);
          var i, s, a;
          (a = t.PageBorderDisplay || (t.PageBorderDisplay = {})).ALL_PAGES = "allPages", a.FIRST_PAGE = "firstPage", a.NOT_FIRST_PAGE = "notFirstPage", (s = t.PageBorderOffsetFrom || (t.PageBorderOffsetFrom = {})).PAGE = "page", s.TEXT = "text", (i = t.PageBorderZOrder || (t.PageBorderZOrder = {})).BACK = "back", i.FRONT = "front";
          var u = /*#__PURE__*/function (_o$XmlAttributeCompon5) {
            _inherits(u, _o$XmlAttributeCompon5);
            var _super30 = _createSuper(u);
            function u() {
              var _this32;
              _classCallCheck(this, u);
              _this32 = _super30.apply(this, arguments), _this32.xmlKeys = {
                display: "w:display",
                offsetFrom: "w:offsetFrom",
                zOrder: "w:zOrder"
              };
              return _this32;
            }
            return _createClass(u);
          }(o.XmlAttributeComponent);
          var c = /*#__PURE__*/function (_o$IgnoreIfEmptyXmlCo) {
            _inherits(c, _o$IgnoreIfEmptyXmlCo);
            var _super31 = _createSuper(c);
            function c(e) {
              var _this33;
              _classCallCheck(this, c);
              _this33 = _super31.call(this, "w:pgBorders"), e && (e.pageBorders ? _this33.root.push(new u({
                display: e.pageBorders.display,
                offsetFrom: e.pageBorders.offsetFrom,
                zOrder: e.pageBorders.zOrder
              })) : _this33.root.push(new u({})), e.pageBorderTop && _this33.root.push(new n.BorderElement("w:top", e.pageBorderTop)), e.pageBorderLeft && _this33.root.push(new n.BorderElement("w:left", e.pageBorderLeft)), e.pageBorderBottom && _this33.root.push(new n.BorderElement("w:bottom", e.pageBorderBottom)), e.pageBorderRight && _this33.root.push(new n.BorderElement("w:right", e.pageBorderRight)));
              return _this33;
            }
            return _createClass(c);
          }(o.IgnoreIfEmptyXmlComponent);
          t.PageBorders = c;
        },
        7189: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.PageMargin = t.PageMarginAttributes = void 0;
          var n = r(459),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon6) {
            _inherits(i, _o$XmlAttributeCompon6);
            var _super32 = _createSuper(i);
            function i() {
              var _this34;
              _classCallCheck(this, i);
              _this34 = _super32.apply(this, arguments), _this34.xmlKeys = {
                top: "w:top",
                right: "w:right",
                bottom: "w:bottom",
                left: "w:left",
                header: "w:header",
                footer: "w:footer",
                gutter: "w:gutter"
              };
              return _this34;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          t.PageMarginAttributes = i;
          var s = /*#__PURE__*/function (_o$XmlComponent5) {
            _inherits(s, _o$XmlComponent5);
            var _super33 = _createSuper(s);
            function s(e, t, r, o, _s6, a, u) {
              var _this35;
              _classCallCheck(this, s);
              _this35 = _super33.call(this, "w:pgMar"), _this35.root.push(new i({
                top: (0, n.signedTwipsMeasureValue)(e),
                right: (0, n.twipsMeasureValue)(t),
                bottom: (0, n.signedTwipsMeasureValue)(r),
                left: (0, n.twipsMeasureValue)(o),
                header: (0, n.twipsMeasureValue)(_s6),
                footer: (0, n.twipsMeasureValue)(a),
                gutter: (0, n.twipsMeasureValue)(u)
              }));
              return _this35;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.PageMargin = s;
        },
        7797: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.PageNumberType = t.PageNumberTypeAttributes = t.PageNumberSeparator = void 0;
          var n = r(459),
            o = r(2451);
          var i;
          (i = t.PageNumberSeparator || (t.PageNumberSeparator = {})).HYPHEN = "hyphen", i.PERIOD = "period", i.COLON = "colon", i.EM_DASH = "emDash", i.EN_DASH = "endash";
          var s = /*#__PURE__*/function (_o$XmlAttributeCompon7) {
            _inherits(s, _o$XmlAttributeCompon7);
            var _super34 = _createSuper(s);
            function s() {
              var _this36;
              _classCallCheck(this, s);
              _this36 = _super34.apply(this, arguments), _this36.xmlKeys = {
                start: "w:start",
                formatType: "w:fmt",
                separator: "w:chapSep"
              };
              return _this36;
            }
            return _createClass(s);
          }(o.XmlAttributeComponent);
          t.PageNumberTypeAttributes = s;
          var a = /*#__PURE__*/function (_o$XmlComponent6) {
            _inherits(a, _o$XmlComponent6);
            var _super35 = _createSuper(a);
            function a(_ref5) {
              var _this37;
              var e = _ref5.start,
                t = _ref5.formatType,
                r = _ref5.separator;
              _classCallCheck(this, a);
              _this37 = _super35.call(this, "w:pgNumType"), _this37.root.push(new s({
                start: void 0 === e ? void 0 : (0, n.decimalNumber)(e),
                formatType: t,
                separator: r
              }));
              return _this37;
            }
            return _createClass(a);
          }(o.XmlComponent);
          t.PageNumberType = a;
        },
        7649: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.PageSize = t.PageSizeAttributes = t.PageOrientation = void 0;
          var n = r(459),
            o = r(2451);
          var i;
          !function (e) {
            e.PORTRAIT = "portrait", e.LANDSCAPE = "landscape";
          }(i = t.PageOrientation || (t.PageOrientation = {}));
          var s = /*#__PURE__*/function (_o$XmlAttributeCompon8) {
            _inherits(s, _o$XmlAttributeCompon8);
            var _super36 = _createSuper(s);
            function s() {
              var _this38;
              _classCallCheck(this, s);
              _this38 = _super36.apply(this, arguments), _this38.xmlKeys = {
                width: "w:w",
                height: "w:h",
                orientation: "w:orient"
              };
              return _this38;
            }
            return _createClass(s);
          }(o.XmlAttributeComponent);
          t.PageSizeAttributes = s;
          var a = /*#__PURE__*/function (_o$XmlComponent7) {
            _inherits(a, _o$XmlComponent7);
            var _super37 = _createSuper(a);
            function a(e, t, r) {
              var _this39;
              _classCallCheck(this, a);
              _this39 = _super37.call(this, "w:pgSz");
              var o = r === i.LANDSCAPE,
                _a2 = (0, n.twipsMeasureValue)(e),
                u = (0, n.twipsMeasureValue)(t);
              _this39.root.push(new s({
                width: o ? u : _a2,
                height: o ? _a2 : u,
                orientation: r
              }));
              return _this39;
            }
            return _createClass(a);
          }(o.XmlComponent);
          t.PageSize = a;
        },
        5849: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Type = t.SectionTypeAttributes = t.SectionType = void 0;
          var n = r(2451);
          var o;
          (o = t.SectionType || (t.SectionType = {})).NEXT_PAGE = "nextPage", o.NEXT_COLUMN = "nextColumn", o.CONTINUOUS = "continuous", o.EVEN_PAGE = "evenPage", o.ODD_PAGE = "oddPage";
          var i = /*#__PURE__*/function (_n$XmlAttributeCompon9) {
            _inherits(i, _n$XmlAttributeCompon9);
            var _super38 = _createSuper(i);
            function i() {
              var _this40;
              _classCallCheck(this, i);
              _this40 = _super38.apply(this, arguments), _this40.xmlKeys = {
                val: "w:val"
              };
              return _this40;
            }
            return _createClass(i);
          }(n.XmlAttributeComponent);
          t.SectionTypeAttributes = i;
          var s = /*#__PURE__*/function (_n$XmlComponent13) {
            _inherits(s, _n$XmlComponent13);
            var _super39 = _createSuper(s);
            function s(e) {
              var _this41;
              _classCallCheck(this, s);
              _this41 = _super39.call(this, "w:type"), _this41.root.push(new i({
                val: e
              }));
              return _this41;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.Type = s;
        },
        7748: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.SectionProperties = t.sectionPageSizeDefaults = t.sectionMarginDefaults = void 0;
          var n = r(4087),
            o = r(2451),
            i = r(9719),
            s = r(1770),
            a = r(2062),
            u = r(7067),
            c = r(6527),
            l = r(7189),
            p = r(7797),
            h = r(7649),
            d = r(5849);
          t.sectionMarginDefaults = {
            TOP: "1in",
            RIGHT: "1in",
            BOTTOM: "1in",
            LEFT: "1in",
            HEADER: 708,
            FOOTER: 708,
            GUTTER: 0
          }, t.sectionPageSizeDefaults = {
            WIDTH: 11906,
            HEIGHT: 16838,
            ORIENTATION: h.PageOrientation.PORTRAIT
          };
          var f = /*#__PURE__*/function (_o$XmlComponent8) {
            _inherits(f, _o$XmlComponent8);
            var _super40 = _createSuper(f);
            function f() {
              var _this42;
              var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref6$page = _ref6.page,
                _ref6$page2 = _ref6$page === void 0 ? {} : _ref6$page,
                _ref6$page2$size = _ref6$page2.size,
                _ref6$page2$size2 = _ref6$page2$size === void 0 ? {} : _ref6$page2$size,
                _ref6$page2$size2$wid = _ref6$page2$size2.width,
                e = _ref6$page2$size2$wid === void 0 ? t.sectionPageSizeDefaults.WIDTH : _ref6$page2$size2$wid,
                _ref6$page2$size2$hei = _ref6$page2$size2.height,
                r = _ref6$page2$size2$hei === void 0 ? t.sectionPageSizeDefaults.HEIGHT : _ref6$page2$size2$hei,
                _ref6$page2$size2$ori = _ref6$page2$size2.orientation,
                _f = _ref6$page2$size2$ori === void 0 ? t.sectionPageSizeDefaults.ORIENTATION : _ref6$page2$size2$ori,
                _ref6$page2$margin = _ref6$page2.margin,
                _ref6$page2$margin2 = _ref6$page2$margin === void 0 ? {} : _ref6$page2$margin,
                _ref6$page2$margin2$t = _ref6$page2$margin2.top,
                m = _ref6$page2$margin2$t === void 0 ? t.sectionMarginDefaults.TOP : _ref6$page2$margin2$t,
                _ref6$page2$margin2$r = _ref6$page2$margin2.right,
                g = _ref6$page2$margin2$r === void 0 ? t.sectionMarginDefaults.RIGHT : _ref6$page2$margin2$r,
                _ref6$page2$margin2$b = _ref6$page2$margin2.bottom,
                b = _ref6$page2$margin2$b === void 0 ? t.sectionMarginDefaults.BOTTOM : _ref6$page2$margin2$b,
                _ref6$page2$margin2$l = _ref6$page2$margin2.left,
                y = _ref6$page2$margin2$l === void 0 ? t.sectionMarginDefaults.LEFT : _ref6$page2$margin2$l,
                _ref6$page2$margin2$h = _ref6$page2$margin2.header,
                w = _ref6$page2$margin2$h === void 0 ? t.sectionMarginDefaults.HEADER : _ref6$page2$margin2$h,
                _ref6$page2$margin2$f = _ref6$page2$margin2.footer,
                v = _ref6$page2$margin2$f === void 0 ? t.sectionMarginDefaults.FOOTER : _ref6$page2$margin2$f,
                _ref6$page2$margin2$g = _ref6$page2$margin2.gutter,
                _ = _ref6$page2$margin2$g === void 0 ? t.sectionMarginDefaults.GUTTER : _ref6$page2$margin2$g,
                _ref6$page2$pageNumbe = _ref6$page2.pageNumbers,
                x = _ref6$page2$pageNumbe === void 0 ? {} : _ref6$page2$pageNumbe,
                E = _ref6$page2.borders,
                _ref6$grid = _ref6.grid,
                _ref6$grid2 = _ref6$grid === void 0 ? {} : _ref6$grid,
                _ref6$grid2$linePitch = _ref6$grid2.linePitch,
                T = _ref6$grid2$linePitch === void 0 ? 360 : _ref6$grid2$linePitch,
                _ref6$headerWrapperGr = _ref6.headerWrapperGroup,
                O = _ref6$headerWrapperGr === void 0 ? {} : _ref6$headerWrapperGr,
                _ref6$footerWrapperGr = _ref6.footerWrapperGroup,
                S = _ref6$footerWrapperGr === void 0 ? {} : _ref6$footerWrapperGr,
                A = _ref6.lineNumbers,
                P = _ref6.titlePage,
                C = _ref6.verticalAlign,
                R = _ref6.column,
                I = _ref6.type;
              _classCallCheck(this, f);
              _this42 = _super40.call(this, "w:sectPr"), _this42.addHeaderFooterGroup(i.HeaderFooterType.HEADER, O), _this42.addHeaderFooterGroup(i.HeaderFooterType.FOOTER, S), I && _this42.root.push(new d.Type(I)), _this42.root.push(new h.PageSize(e, r, _f)), _this42.root.push(new l.PageMargin(m, g, b, y, w, v, _)), E && _this42.root.push(new c.PageBorders(E)), A && _this42.root.push(new u.LineNumberType(A)), _this42.root.push(new p.PageNumberType(x)), R && _this42.root.push(new s.Columns(R)), C && _this42.root.push(new n.VerticalAlignElement(C)), void 0 !== P && _this42.root.push(new o.OnOffElement("w:titlePg", P)), _this42.root.push(new a.DocumentGrid(T));
              return _this42;
            }
            _createClass(f, [{
              key: "addHeaderFooterGroup",
              value: function addHeaderFooterGroup(e, t) {
                t.default && this.root.push(new i.HeaderFooterReference(e, {
                  type: i.HeaderFooterReferenceType.DEFAULT,
                  id: t.default.View.ReferenceId
                })), t.first && this.root.push(new i.HeaderFooterReference(e, {
                  type: i.HeaderFooterReferenceType.FIRST,
                  id: t.first.View.ReferenceId
                })), t.even && this.root.push(new i.HeaderFooterReference(e, {
                  type: i.HeaderFooterReferenceType.EVEN,
                  id: t.even.View.ReferenceId
                }));
              }
            }]);
            return f;
          }(o.XmlComponent);
          t.SectionProperties = f;
        },
        7627: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.DocumentAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon10) {
            _inherits(o, _n$XmlAttributeCompon10);
            var _super41 = _createSuper(o);
            function o() {
              var _this43;
              _classCallCheck(this, o);
              _this43 = _super41.apply(this, arguments), _this43.xmlKeys = {
                wpc: "xmlns:wpc",
                mc: "xmlns:mc",
                o: "xmlns:o",
                r: "xmlns:r",
                m: "xmlns:m",
                v: "xmlns:v",
                wp14: "xmlns:wp14",
                wp: "xmlns:wp",
                w10: "xmlns:w10",
                w: "xmlns:w",
                w14: "xmlns:w14",
                w15: "xmlns:w15",
                wpg: "xmlns:wpg",
                wpi: "xmlns:wpi",
                wne: "xmlns:wne",
                wps: "xmlns:wps",
                Ignorable: "mc:Ignorable",
                cp: "xmlns:cp",
                dc: "xmlns:dc",
                dcterms: "xmlns:dcterms",
                dcmitype: "xmlns:dcmitype",
                xsi: "xmlns:xsi",
                type: "xsi:type"
              };
              return _this43;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.DocumentAttributes = o;
        },
        2844: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.DocumentBackground = t.DocumentBackgroundAttributes = void 0;
          var n = r(459),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon9) {
            _inherits(i, _o$XmlAttributeCompon9);
            var _super42 = _createSuper(i);
            function i() {
              var _this44;
              _classCallCheck(this, i);
              _this44 = _super42.apply(this, arguments), _this44.xmlKeys = {
                color: "w:color",
                themeColor: "w:themeColor",
                themeShade: "w:themeShade",
                themeTint: "w:themeTint"
              };
              return _this44;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          t.DocumentBackgroundAttributes = i;
          var s = /*#__PURE__*/function (_o$XmlComponent9) {
            _inherits(s, _o$XmlComponent9);
            var _super43 = _createSuper(s);
            function s(e) {
              var _this45;
              _classCallCheck(this, s);
              _this45 = _super43.call(this, "w:background"), _this45.root.push(new i({
                color: (0, n.hexColorValue)(e.color ? e.color : "FFFFFF"),
                themeColor: e.themeColor,
                themeShade: void 0 === e.themeShade ? void 0 : (0, n.uCharHexNumber)(e.themeShade),
                themeTint: void 0 === e.themeTint ? void 0 : (0, n.uCharHexNumber)(e.themeTint)
              }));
              return _this45;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.DocumentBackground = s;
        },
        8736: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(2844), t);
        },
        3504: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Document = void 0;
          var n = r(2451),
            o = r(5290),
            i = r(7627),
            s = r(8736);
          var a = /*#__PURE__*/function (_n$XmlComponent14) {
            _inherits(a, _n$XmlComponent14);
            var _super44 = _createSuper(a);
            function a(e) {
              var _this46;
              _classCallCheck(this, a);
              _this46 = _super44.call(this, "w:document"), _this46.root.push(new i.DocumentAttributes({
                wpc: "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas",
                mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
                o: "urn:schemas-microsoft-com:office:office",
                r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
                m: "http://schemas.openxmlformats.org/officeDocument/2006/math",
                v: "urn:schemas-microsoft-com:vml",
                wp14: "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
                wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
                w10: "urn:schemas-microsoft-com:office:word",
                w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
                w14: "http://schemas.microsoft.com/office/word/2010/wordml",
                w15: "http://schemas.microsoft.com/office/word/2012/wordml",
                wpg: "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
                wpi: "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
                wne: "http://schemas.microsoft.com/office/word/2006/wordml",
                wps: "http://schemas.microsoft.com/office/word/2010/wordprocessingShape",
                Ignorable: "w14 w15 wp14"
              })), _this46.body = new o.Body(), _this46.root.push(new s.DocumentBackground(e.background)), _this46.root.push(_this46.body);
              return _this46;
            }
            _createClass(a, [{
              key: "add",
              value: function add(e) {
                return this.body.push(e), this;
              }
            }, {
              key: "Body",
              get: function get() {
                return this.body;
              }
            }]);
            return a;
          }(n.XmlComponent);
          t.Document = a;
        },
        6593: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(3504), t), o(r(7627), t), o(r(5290), t), o(r(8736), t);
        },
        1668: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.AnchorAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon11) {
            _inherits(o, _n$XmlAttributeCompon11);
            var _super45 = _createSuper(o);
            function o() {
              var _this47;
              _classCallCheck(this, o);
              _this47 = _super45.apply(this, arguments), _this47.xmlKeys = {
                distT: "distT",
                distB: "distB",
                distL: "distL",
                distR: "distR",
                allowOverlap: "allowOverlap",
                behindDoc: "behindDoc",
                layoutInCell: "layoutInCell",
                locked: "locked",
                relativeHeight: "relativeHeight",
                simplePos: "simplePos"
              };
              return _this47;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.AnchorAttributes = o;
        },
        9128: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Anchor = void 0;
          var n = r(2451),
            o = r(1178),
            i = r(3344),
            s = r(1712),
            a = r(9779),
            u = r(1384),
            c = r(2215),
            l = r(4924),
            p = r(1668);
          var h = /*#__PURE__*/function (_n$XmlComponent15) {
            _inherits(h, _n$XmlComponent15);
            var _super46 = _createSuper(h);
            function h(e, t, r) {
              var _this48;
              _classCallCheck(this, h);
              _this48 = _super46.call(this, "wp:anchor");
              var n = Object.assign({
                allowOverlap: !0,
                behindDocument: !1,
                lockAnchor: !1,
                layoutInCell: !0,
                verticalPosition: {},
                horizontalPosition: {}
              }, r.floating);
              if (_this48.root.push(new p.AnchorAttributes({
                distT: n.margins && n.margins.top || 0,
                distB: n.margins && n.margins.bottom || 0,
                distL: n.margins && n.margins.left || 0,
                distR: n.margins && n.margins.right || 0,
                simplePos: "0",
                allowOverlap: !0 === n.allowOverlap ? "1" : "0",
                behindDoc: !0 === n.behindDocument ? "1" : "0",
                locked: !0 === n.lockAnchor ? "1" : "0",
                layoutInCell: !0 === n.layoutInCell ? "1" : "0",
                relativeHeight: n.zIndex ? n.zIndex : t.emus.y
              })), _this48.root.push(new o.SimplePos()), _this48.root.push(new o.HorizontalPosition(n.horizontalPosition)), _this48.root.push(new o.VerticalPosition(n.verticalPosition)), _this48.root.push(new c.Extent(t.emus.x, t.emus.y)), _this48.root.push(new u.EffectExtent()), void 0 !== r.floating && void 0 !== r.floating.wrap) switch (r.floating.wrap.type) {
                case s.TextWrappingType.SQUARE:
                  _this48.root.push(new s.WrapSquare(r.floating.wrap, r.floating.margins));
                  break;
                case s.TextWrappingType.TIGHT:
                  _this48.root.push(new s.WrapTight(r.floating.margins));
                  break;
                case s.TextWrappingType.TOP_AND_BOTTOM:
                  _this48.root.push(new s.WrapTopAndBottom(r.floating.margins));
                  break;
                case s.TextWrappingType.NONE:
                default:
                  _this48.root.push(new s.WrapNone());
              } else _this48.root.push(new s.WrapNone());
              _this48.root.push(new a.DocProperties()), _this48.root.push(new l.GraphicFrameProperties()), _this48.root.push(new i.Graphic(e, t));
              return _this48;
            }
            return _createClass(h);
          }(n.XmlComponent);
          t.Anchor = h;
        },
        2439: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(9128), t), o(r(1668), t);
        },
        2578: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.DocPropertiesAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon12) {
            _inherits(o, _n$XmlAttributeCompon12);
            var _super47 = _createSuper(o);
            function o() {
              var _this49;
              _classCallCheck(this, o);
              _this49 = _super47.apply(this, arguments), _this49.xmlKeys = {
                id: "id",
                name: "name",
                descr: "descr"
              };
              return _this49;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.DocPropertiesAttributes = o;
        },
        9779: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.DocProperties = void 0;
          var n = r(2451),
            o = r(2578);
          var i = /*#__PURE__*/function (_n$XmlComponent16) {
            _inherits(i, _n$XmlComponent16);
            var _super48 = _createSuper(i);
            function i() {
              var _this50;
              _classCallCheck(this, i);
              _this50 = _super48.call(this, "wp:docPr"), _this50.root.push(new o.DocPropertiesAttributes({
                id: 0,
                name: "",
                descr: ""
              }));
              return _this50;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.DocProperties = i;
        },
        5180: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Drawing = void 0;
          var n = r(2451),
            o = r(2439),
            i = r(8683);
          var s = /*#__PURE__*/function (_n$XmlComponent17) {
            _inherits(s, _n$XmlComponent17);
            var _super49 = _createSuper(s);
            function s(e) {
              var _this51;
              var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
              _classCallCheck(this, s);
              _this51 = _super49.call(this, "w:drawing"), t.floating ? _this51.root.push(new o.Anchor(e, e.transformation, t)) : (_this51.inline = new i.Inline(e, e.transformation), _this51.root.push(_this51.inline));
              return _this51;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.Drawing = s;
        },
        1050: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.EffectExtentAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon13) {
            _inherits(o, _n$XmlAttributeCompon13);
            var _super50 = _createSuper(o);
            function o() {
              var _this52;
              _classCallCheck(this, o);
              _this52 = _super50.apply(this, arguments), _this52.xmlKeys = {
                b: "b",
                l: "l",
                r: "r",
                t: "t"
              };
              return _this52;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.EffectExtentAttributes = o;
        },
        1384: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.EffectExtent = void 0;
          var n = r(2451),
            o = r(1050);
          var i = /*#__PURE__*/function (_n$XmlComponent18) {
            _inherits(i, _n$XmlComponent18);
            var _super51 = _createSuper(i);
            function i() {
              var _this53;
              _classCallCheck(this, i);
              _this53 = _super51.call(this, "wp:effectExtent"), _this53.root.push(new o.EffectExtentAttributes({
                b: 0,
                l: 0,
                r: 0,
                t: 0
              }));
              return _this53;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.EffectExtent = i;
        },
        488: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ExtentAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon14) {
            _inherits(o, _n$XmlAttributeCompon14);
            var _super52 = _createSuper(o);
            function o() {
              var _this54;
              _classCallCheck(this, o);
              _this54 = _super52.apply(this, arguments), _this54.xmlKeys = {
                cx: "cx",
                cy: "cy"
              };
              return _this54;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.ExtentAttributes = o;
        },
        2215: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Extent = void 0;
          var n = r(2451),
            o = r(488);
          var i = /*#__PURE__*/function (_n$XmlComponent19) {
            _inherits(i, _n$XmlComponent19);
            var _super53 = _createSuper(i);
            function i(e, t) {
              var _this55;
              _classCallCheck(this, i);
              _this55 = _super53.call(this, "wp:extent"), _this55.attributes = new o.ExtentAttributes({
                cx: e,
                cy: t
              }), _this55.root.push(_this55.attributes);
              return _this55;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.Extent = i;
        },
        8982: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Align = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent20) {
            _inherits(o, _n$XmlComponent20);
            var _super54 = _createSuper(o);
            function o(e) {
              var _this56;
              _classCallCheck(this, o);
              _this56 = _super54.call(this, "wp:align"), _this56.root.push(e);
              return _this56;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.Align = o;
        },
        4146: function _(e, t) {
          "use strict";

          var r, n;
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.VerticalPositionRelativeFrom = t.HorizontalPositionRelativeFrom = void 0, (n = t.HorizontalPositionRelativeFrom || (t.HorizontalPositionRelativeFrom = {})).CHARACTER = "character", n.COLUMN = "column", n.INSIDE_MARGIN = "insideMargin", n.LEFT_MARGIN = "leftMargin", n.MARGIN = "margin", n.OUTSIDE_MARGIN = "outsideMargin", n.PAGE = "page", n.RIGHT_MARGIN = "rightMargin", (r = t.VerticalPositionRelativeFrom || (t.VerticalPositionRelativeFrom = {})).BOTTOM_MARGIN = "bottomMargin", r.INSIDE_MARGIN = "insideMargin", r.LINE = "line", r.MARGIN = "margin", r.OUTSIDE_MARGIN = "outsideMargin", r.PAGE = "page", r.PARAGRAPH = "paragraph", r.TOP_MARGIN = "topMargin";
        },
        1806: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.HorizontalPosition = void 0;
          var n = r(2451),
            o = r(8982),
            i = r(4146),
            s = r(5102);
          var a = /*#__PURE__*/function (_n$XmlAttributeCompon15) {
            _inherits(a, _n$XmlAttributeCompon15);
            var _super55 = _createSuper(a);
            function a() {
              var _this57;
              _classCallCheck(this, a);
              _this57 = _super55.apply(this, arguments), _this57.xmlKeys = {
                relativeFrom: "relativeFrom"
              };
              return _this57;
            }
            return _createClass(a);
          }(n.XmlAttributeComponent);
          var u = /*#__PURE__*/function (_n$XmlComponent21) {
            _inherits(u, _n$XmlComponent21);
            var _super56 = _createSuper(u);
            function u(e) {
              var _this58;
              _classCallCheck(this, u);
              if (_this58 = _super56.call(this, "wp:positionH"), _this58.root.push(new a({
                relativeFrom: e.relative || i.HorizontalPositionRelativeFrom.PAGE
              })), e.align) _this58.root.push(new o.Align(e.align));else {
                if (void 0 === e.offset) throw new Error("There is no configuration provided for floating position (Align or offset)");
                _this58.root.push(new s.PositionOffset(e.offset));
              }
              return _possibleConstructorReturn(_this58);
            }
            return _createClass(u);
          }(n.XmlComponent);
          t.HorizontalPosition = u;
        },
        1178: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(4146), t), o(r(4050), t), o(r(1806), t), o(r(5935), t);
        },
        5102: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.PositionOffset = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent22) {
            _inherits(o, _n$XmlComponent22);
            var _super57 = _createSuper(o);
            function o(e) {
              var _this59;
              _classCallCheck(this, o);
              _this59 = _super57.call(this, "wp:posOffset"), _this59.root.push(e.toString());
              return _this59;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.PositionOffset = o;
        },
        4050: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.SimplePos = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon16) {
            _inherits(o, _n$XmlAttributeCompon16);
            var _super58 = _createSuper(o);
            function o() {
              var _this60;
              _classCallCheck(this, o);
              _this60 = _super58.apply(this, arguments), _this60.xmlKeys = {
                x: "x",
                y: "y"
              };
              return _this60;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent23) {
            _inherits(i, _n$XmlComponent23);
            var _super59 = _createSuper(i);
            function i() {
              var _this61;
              _classCallCheck(this, i);
              _this61 = _super59.call(this, "wp:simplePos"), _this61.root.push(new o({
                x: 0,
                y: 0
              }));
              return _this61;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.SimplePos = i;
        },
        5935: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.VerticalPosition = void 0;
          var n = r(2451),
            o = r(8982),
            i = r(4146),
            s = r(5102);
          var a = /*#__PURE__*/function (_n$XmlAttributeCompon17) {
            _inherits(a, _n$XmlAttributeCompon17);
            var _super60 = _createSuper(a);
            function a() {
              var _this62;
              _classCallCheck(this, a);
              _this62 = _super60.apply(this, arguments), _this62.xmlKeys = {
                relativeFrom: "relativeFrom"
              };
              return _this62;
            }
            return _createClass(a);
          }(n.XmlAttributeComponent);
          var u = /*#__PURE__*/function (_n$XmlComponent24) {
            _inherits(u, _n$XmlComponent24);
            var _super61 = _createSuper(u);
            function u(e) {
              var _this63;
              _classCallCheck(this, u);
              if (_this63 = _super61.call(this, "wp:positionV"), _this63.root.push(new a({
                relativeFrom: e.relative || i.VerticalPositionRelativeFrom.PAGE
              })), e.align) _this63.root.push(new o.Align(e.align));else {
                if (void 0 === e.offset) throw new Error("There is no configuration provided for floating position (Align or offset)");
                _this63.root.push(new s.PositionOffset(e.offset));
              }
              return _possibleConstructorReturn(_this63);
            }
            return _createClass(u);
          }(n.XmlComponent);
          t.VerticalPosition = u;
        },
        5506: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.GraphicFrameLockAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon18) {
            _inherits(o, _n$XmlAttributeCompon18);
            var _super62 = _createSuper(o);
            function o() {
              var _this64;
              _classCallCheck(this, o);
              _this64 = _super62.apply(this, arguments), _this64.xmlKeys = {
                xmlns: "xmlns:a",
                noChangeAspect: "noChangeAspect"
              };
              return _this64;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.GraphicFrameLockAttributes = o;
        },
        8460: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.GraphicFrameLocks = void 0;
          var n = r(2451),
            o = r(5506);
          var i = /*#__PURE__*/function (_n$XmlComponent25) {
            _inherits(i, _n$XmlComponent25);
            var _super63 = _createSuper(i);
            function i() {
              var _this65;
              _classCallCheck(this, i);
              _this65 = _super63.call(this, "a:graphicFrameLocks"), _this65.root.push(new o.GraphicFrameLockAttributes({
                xmlns: "http://schemas.openxmlformats.org/drawingml/2006/main",
                noChangeAspect: 1
              }));
              return _this65;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.GraphicFrameLocks = i;
        },
        4924: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.GraphicFrameProperties = void 0;
          var n = r(2451),
            o = r(8460);
          var i = /*#__PURE__*/function (_n$XmlComponent26) {
            _inherits(i, _n$XmlComponent26);
            var _super64 = _createSuper(i);
            function i() {
              var _this66;
              _classCallCheck(this, i);
              _this66 = _super64.call(this, "wp:cNvGraphicFramePr"), _this66.root.push(new o.GraphicFrameLocks());
              return _this66;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.GraphicFrameProperties = i;
        },
        6876: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(5180), t), o(r(1712), t), o(r(1178), t);
        },
        5842: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.GraphicDataAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon19) {
            _inherits(o, _n$XmlAttributeCompon19);
            var _super65 = _createSuper(o);
            function o() {
              var _this67;
              _classCallCheck(this, o);
              _this67 = _super65.apply(this, arguments), _this67.xmlKeys = {
                uri: "uri"
              };
              return _this67;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.GraphicDataAttributes = o;
        },
        9902: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.GraphicData = void 0;
          var n = r(2451),
            o = r(5842),
            i = r(8806);
          var s = /*#__PURE__*/function (_n$XmlComponent27) {
            _inherits(s, _n$XmlComponent27);
            var _super66 = _createSuper(s);
            function s(e, t) {
              var _this68;
              _classCallCheck(this, s);
              _this68 = _super66.call(this, "a:graphicData"), _this68.root.push(new o.GraphicDataAttributes({
                uri: "http://schemas.openxmlformats.org/drawingml/2006/picture"
              })), _this68.pic = new i.Pic(e, t), _this68.root.push(_this68.pic);
              return _this68;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.GraphicData = s;
        },
        5729: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(9902), t);
        },
        2554: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.BlipFill = void 0;
          var n = r(2451),
            o = r(7156),
            i = r(3829),
            s = r(7099);
          var a = /*#__PURE__*/function (_n$XmlComponent28) {
            _inherits(a, _n$XmlComponent28);
            var _super67 = _createSuper(a);
            function a(e) {
              var _this69;
              _classCallCheck(this, a);
              _this69 = _super67.call(this, "pic:blipFill"), _this69.root.push(new o.Blip(e)), _this69.root.push(new i.SourceRectangle()), _this69.root.push(new s.Stretch());
              return _this69;
            }
            return _createClass(a);
          }(n.XmlComponent);
          t.BlipFill = a;
        },
        7156: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Blip = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon20) {
            _inherits(o, _n$XmlAttributeCompon20);
            var _super68 = _createSuper(o);
            function o() {
              var _this70;
              _classCallCheck(this, o);
              _this70 = _super68.apply(this, arguments), _this70.xmlKeys = {
                embed: "r:embed",
                cstate: "cstate"
              };
              return _this70;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent29) {
            _inherits(i, _n$XmlComponent29);
            var _super69 = _createSuper(i);
            function i(e) {
              var _this71;
              _classCallCheck(this, i);
              _this71 = _super69.call(this, "a:blip"), _this71.root.push(new o({
                embed: "rId{".concat(e.fileName, "}"),
                cstate: "none"
              }));
              return _this71;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.Blip = i;
        },
        3829: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.SourceRectangle = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent30) {
            _inherits(o, _n$XmlComponent30);
            var _super70 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super70.call(this, "a:srcRect");
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.SourceRectangle = o;
        },
        7099: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Stretch = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent31) {
            _inherits(o, _n$XmlComponent31);
            var _super71 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super71.call(this, "a:fillRect");
            }
            return _createClass(o);
          }(n.XmlComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent32) {
            _inherits(i, _n$XmlComponent32);
            var _super72 = _createSuper(i);
            function i() {
              var _this72;
              _classCallCheck(this, i);
              _this72 = _super72.call(this, "a:stretch"), _this72.root.push(new o());
              return _this72;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.Stretch = i;
        },
        8806: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(5826), t);
        },
        907: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ChildNonVisualProperties = void 0;
          var n = r(2451),
            o = r(9467);
          var i = /*#__PURE__*/function (_n$XmlComponent33) {
            _inherits(i, _n$XmlComponent33);
            var _super73 = _createSuper(i);
            function i() {
              var _this73;
              _classCallCheck(this, i);
              _this73 = _super73.call(this, "pic:cNvPicPr"), _this73.root.push(new o.PicLocks());
              return _this73;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.ChildNonVisualProperties = i;
        },
        2702: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.PicLocksAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon21) {
            _inherits(o, _n$XmlAttributeCompon21);
            var _super74 = _createSuper(o);
            function o() {
              var _this74;
              _classCallCheck(this, o);
              _this74 = _super74.apply(this, arguments), _this74.xmlKeys = {
                noChangeAspect: "noChangeAspect",
                noChangeArrowheads: "noChangeArrowheads"
              };
              return _this74;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.PicLocksAttributes = o;
        },
        9467: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.PicLocks = void 0;
          var n = r(2451),
            o = r(2702);
          var i = /*#__PURE__*/function (_n$XmlComponent34) {
            _inherits(i, _n$XmlComponent34);
            var _super75 = _createSuper(i);
            function i() {
              var _this75;
              _classCallCheck(this, i);
              _this75 = _super75.call(this, "a:picLocks"), _this75.root.push(new o.PicLocksAttributes({
                noChangeAspect: 1,
                noChangeArrowheads: 1
              }));
              return _this75;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.PicLocks = i;
        },
        3105: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.NonVisualPicProperties = void 0;
          var n = r(2451),
            o = r(907),
            i = r(7703);
          var s = /*#__PURE__*/function (_n$XmlComponent35) {
            _inherits(s, _n$XmlComponent35);
            var _super76 = _createSuper(s);
            function s() {
              var _this76;
              _classCallCheck(this, s);
              _this76 = _super76.call(this, "pic:nvPicPr"), _this76.root.push(new i.NonVisualProperties()), _this76.root.push(new o.ChildNonVisualProperties());
              return _this76;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.NonVisualPicProperties = s;
        },
        2829: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.NonVisualPropertiesAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon22) {
            _inherits(o, _n$XmlAttributeCompon22);
            var _super77 = _createSuper(o);
            function o() {
              var _this77;
              _classCallCheck(this, o);
              _this77 = _super77.apply(this, arguments), _this77.xmlKeys = {
                id: "id",
                name: "name",
                descr: "descr"
              };
              return _this77;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.NonVisualPropertiesAttributes = o;
        },
        7703: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.NonVisualProperties = void 0;
          var n = r(2451),
            o = r(2829);
          var i = /*#__PURE__*/function (_n$XmlComponent36) {
            _inherits(i, _n$XmlComponent36);
            var _super78 = _createSuper(i);
            function i() {
              var _this78;
              _classCallCheck(this, i);
              _this78 = _super78.call(this, "pic:cNvPr"), _this78.root.push(new o.NonVisualPropertiesAttributes({
                id: 0,
                name: "",
                descr: ""
              }));
              return _this78;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.NonVisualProperties = i;
        },
        5665: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.PicAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon23) {
            _inherits(o, _n$XmlAttributeCompon23);
            var _super79 = _createSuper(o);
            function o() {
              var _this79;
              _classCallCheck(this, o);
              _this79 = _super79.apply(this, arguments), _this79.xmlKeys = {
                xmlns: "xmlns:pic"
              };
              return _this79;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.PicAttributes = o;
        },
        5826: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Pic = void 0;
          var n = r(2451),
            o = r(2554),
            i = r(3105),
            s = r(5665),
            a = r(6369);
          var u = /*#__PURE__*/function (_n$XmlComponent37) {
            _inherits(u, _n$XmlComponent37);
            var _super80 = _createSuper(u);
            function u(e, t) {
              var _this80;
              _classCallCheck(this, u);
              _this80 = _super80.call(this, "pic:pic"), _this80.root.push(new s.PicAttributes({
                xmlns: "http://schemas.openxmlformats.org/drawingml/2006/picture"
              })), _this80.root.push(new i.NonVisualPicProperties()), _this80.root.push(new o.BlipFill(e)), _this80.root.push(new a.ShapeProperties(t));
              return _this80;
            }
            return _createClass(u);
          }(n.XmlComponent);
          t.Pic = u;
        },
        8269: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ExtentsAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon24) {
            _inherits(o, _n$XmlAttributeCompon24);
            var _super81 = _createSuper(o);
            function o() {
              var _this81;
              _classCallCheck(this, o);
              _this81 = _super81.apply(this, arguments), _this81.xmlKeys = {
                cx: "cx",
                cy: "cy"
              };
              return _this81;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.ExtentsAttributes = o;
        },
        9905: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Extents = void 0;
          var n = r(2451),
            o = r(8269);
          var i = /*#__PURE__*/function (_n$XmlComponent38) {
            _inherits(i, _n$XmlComponent38);
            var _super82 = _createSuper(i);
            function i(e, t) {
              var _this82;
              _classCallCheck(this, i);
              _this82 = _super82.call(this, "a:ext"), _this82.attributes = new o.ExtentsAttributes({
                cx: e,
                cy: t
              }), _this82.root.push(_this82.attributes);
              return _this82;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.Extents = i;
        },
        2499: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Form = t.FormAttributes = void 0;
          var n = r(2451),
            o = r(9905),
            i = r(2243);
          var s = /*#__PURE__*/function (_n$XmlAttributeCompon25) {
            _inherits(s, _n$XmlAttributeCompon25);
            var _super83 = _createSuper(s);
            function s() {
              var _this83;
              _classCallCheck(this, s);
              _this83 = _super83.apply(this, arguments), _this83.xmlKeys = {
                flipVertical: "flipV",
                flipHorizontal: "flipH",
                rotation: "rot"
              };
              return _this83;
            }
            return _createClass(s);
          }(n.XmlAttributeComponent);
          t.FormAttributes = s;
          var a = /*#__PURE__*/function (_n$XmlComponent39) {
            _inherits(a, _n$XmlComponent39);
            var _super84 = _createSuper(a);
            function a(e) {
              var _this84;
              _classCallCheck(this, a);
              var t, r;
              _this84 = _super84.call(this, "a:xfrm"), _this84.root.push(new s({
                flipVertical: null === (t = e.flip) || void 0 === t ? void 0 : t.vertical,
                flipHorizontal: null === (r = e.flip) || void 0 === r ? void 0 : r.horizontal,
                rotation: e.rotation
              })), _this84.extents = new o.Extents(e.emus.x, e.emus.y), _this84.root.push(new i.Offset()), _this84.root.push(_this84.extents);
              return _this84;
            }
            return _createClass(a);
          }(n.XmlComponent);
          t.Form = a;
        },
        7879: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(2499), t);
        },
        6856: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.OffsetAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon26) {
            _inherits(o, _n$XmlAttributeCompon26);
            var _super85 = _createSuper(o);
            function o() {
              var _this85;
              _classCallCheck(this, o);
              _this85 = _super85.apply(this, arguments), _this85.xmlKeys = {
                x: "x",
                y: "y"
              };
              return _this85;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.OffsetAttributes = o;
        },
        2243: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Offset = void 0;
          var n = r(2451),
            o = r(6856);
          var i = /*#__PURE__*/function (_n$XmlComponent40) {
            _inherits(i, _n$XmlComponent40);
            var _super86 = _createSuper(i);
            function i() {
              var _this86;
              _classCallCheck(this, i);
              _this86 = _super86.call(this, "a:off"), _this86.root.push(new o.OffsetAttributes({
                x: 0,
                y: 0
              }));
              return _this86;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.Offset = i;
        },
        2526: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.AdjustmentValues = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent41) {
            _inherits(o, _n$XmlComponent41);
            var _super87 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super87.call(this, "a:avLst");
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.AdjustmentValues = o;
        },
        9065: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.PresetGeometryAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon27) {
            _inherits(o, _n$XmlAttributeCompon27);
            var _super88 = _createSuper(o);
            function o() {
              var _this87;
              _classCallCheck(this, o);
              _this87 = _super88.apply(this, arguments), _this87.xmlKeys = {
                prst: "prst"
              };
              return _this87;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.PresetGeometryAttributes = o;
        },
        6325: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.PresetGeometry = void 0;
          var n = r(2451),
            o = r(2526),
            i = r(9065);
          var s = /*#__PURE__*/function (_n$XmlComponent42) {
            _inherits(s, _n$XmlComponent42);
            var _super89 = _createSuper(s);
            function s() {
              var _this88;
              _classCallCheck(this, s);
              _this88 = _super89.call(this, "a:prstGeom"), _this88.root.push(new i.PresetGeometryAttributes({
                prst: "rect"
              })), _this88.root.push(new o.AdjustmentValues());
              return _this88;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.PresetGeometry = s;
        },
        9493: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ShapePropertiesAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon28) {
            _inherits(o, _n$XmlAttributeCompon28);
            var _super90 = _createSuper(o);
            function o() {
              var _this89;
              _classCallCheck(this, o);
              _this89 = _super90.apply(this, arguments), _this89.xmlKeys = {
                bwMode: "bwMode"
              };
              return _this89;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.ShapePropertiesAttributes = o;
        },
        6369: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ShapeProperties = void 0;
          var n = r(2451),
            o = r(7879),
            i = r(6325),
            s = r(9493);
          var a = /*#__PURE__*/function (_n$XmlComponent43) {
            _inherits(a, _n$XmlComponent43);
            var _super91 = _createSuper(a);
            function a(e) {
              var _this90;
              _classCallCheck(this, a);
              _this90 = _super91.call(this, "pic:spPr"), _this90.root.push(new s.ShapePropertiesAttributes({
                bwMode: "auto"
              })), _this90.form = new o.Form(e), _this90.root.push(_this90.form), _this90.root.push(new i.PresetGeometry());
              return _this90;
            }
            return _createClass(a);
          }(n.XmlComponent);
          t.ShapeProperties = a;
        },
        1104: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Graphic = void 0;
          var n = r(2451),
            o = r(5729);
          var i = /*#__PURE__*/function (_n$XmlAttributeCompon29) {
            _inherits(i, _n$XmlAttributeCompon29);
            var _super92 = _createSuper(i);
            function i() {
              var _this91;
              _classCallCheck(this, i);
              _this91 = _super92.apply(this, arguments), _this91.xmlKeys = {
                a: "xmlns:a"
              };
              return _this91;
            }
            return _createClass(i);
          }(n.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_n$XmlComponent44) {
            _inherits(s, _n$XmlComponent44);
            var _super93 = _createSuper(s);
            function s(e, t) {
              var _this92;
              _classCallCheck(this, s);
              _this92 = _super93.call(this, "a:graphic"), _this92.root.push(new i({
                a: "http://schemas.openxmlformats.org/drawingml/2006/main"
              })), _this92.data = new o.GraphicData(e, t), _this92.root.push(_this92.data);
              return _this92;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.Graphic = s;
        },
        3344: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(1104), t);
        },
        8683: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(4947), t);
        },
        2340: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.InlineAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon30) {
            _inherits(o, _n$XmlAttributeCompon30);
            var _super94 = _createSuper(o);
            function o() {
              var _this93;
              _classCallCheck(this, o);
              _this93 = _super94.apply(this, arguments), _this93.xmlKeys = {
                distT: "distT",
                distB: "distB",
                distL: "distL",
                distR: "distR"
              };
              return _this93;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.InlineAttributes = o;
        },
        4947: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Inline = void 0;
          var n = r(2451),
            o = r(9779),
            i = r(1384),
            s = r(2215),
            a = r(4924),
            u = r(3344),
            c = r(2340);
          var l = /*#__PURE__*/function (_n$XmlComponent45) {
            _inherits(l, _n$XmlComponent45);
            var _super95 = _createSuper(l);
            function l(e, t) {
              var _this94;
              _classCallCheck(this, l);
              _this94 = _super95.call(this, "wp:inline"), _this94.root.push(new c.InlineAttributes({
                distT: 0,
                distB: 0,
                distL: 0,
                distR: 0
              })), _this94.extent = new s.Extent(t.emus.x, t.emus.y), _this94.graphic = new u.Graphic(e, t), _this94.root.push(_this94.extent), _this94.root.push(new i.EffectExtent()), _this94.root.push(new o.DocProperties()), _this94.root.push(new a.GraphicFrameProperties()), _this94.root.push(_this94.graphic);
              return _this94;
            }
            return _createClass(l);
          }(n.XmlComponent);
          t.Inline = l;
        },
        1712: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(2256), t), o(r(3520), t), o(r(2543), t), o(r(305), t), o(r(2615), t);
        },
        2256: function _(e, t) {
          "use strict";

          var r, n;
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TextWrappingSide = t.TextWrappingType = void 0, (n = t.TextWrappingType || (t.TextWrappingType = {}))[n.NONE = 0] = "NONE", n[n.SQUARE = 1] = "SQUARE", n[n.TIGHT = 2] = "TIGHT", n[n.TOP_AND_BOTTOM = 3] = "TOP_AND_BOTTOM", (r = t.TextWrappingSide || (t.TextWrappingSide = {})).BOTH_SIDES = "bothSides", r.LEFT = "left", r.RIGHT = "right", r.LARGEST = "largest";
        },
        3520: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.WrapNone = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent46) {
            _inherits(o, _n$XmlComponent46);
            var _super96 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super96.call(this, "wp:wrapNone");
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.WrapNone = o;
        },
        2543: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.WrapSquare = void 0;
          var n = r(2451),
            o = r(1712);
          var i = /*#__PURE__*/function (_n$XmlAttributeCompon31) {
            _inherits(i, _n$XmlAttributeCompon31);
            var _super97 = _createSuper(i);
            function i() {
              var _this95;
              _classCallCheck(this, i);
              _this95 = _super97.apply(this, arguments), _this95.xmlKeys = {
                distT: "distT",
                distB: "distB",
                distL: "distL",
                distR: "distR",
                wrapText: "wrapText"
              };
              return _this95;
            }
            return _createClass(i);
          }(n.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_n$XmlComponent47) {
            _inherits(s, _n$XmlComponent47);
            var _super98 = _createSuper(s);
            function s(e) {
              var _this96;
              var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
              };
              _classCallCheck(this, s);
              _this96 = _super98.call(this, "wp:wrapSquare"), _this96.root.push(new i({
                wrapText: e.side || o.TextWrappingSide.BOTH_SIDES,
                distT: t.top,
                distB: t.bottom,
                distL: t.left,
                distR: t.right
              }));
              return _this96;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.WrapSquare = s;
        },
        305: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.WrapTight = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon32) {
            _inherits(o, _n$XmlAttributeCompon32);
            var _super99 = _createSuper(o);
            function o() {
              var _this97;
              _classCallCheck(this, o);
              _this97 = _super99.apply(this, arguments), _this97.xmlKeys = {
                distT: "distT",
                distB: "distB"
              };
              return _this97;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent48) {
            _inherits(i, _n$XmlComponent48);
            var _super100 = _createSuper(i);
            function i() {
              var _this98;
              var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
                top: 0,
                bottom: 0
              };
              _classCallCheck(this, i);
              _this98 = _super100.call(this, "wp:wrapTight"), _this98.root.push(new o({
                distT: e.top,
                distB: e.bottom
              }));
              return _this98;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.WrapTight = i;
        },
        2615: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.WrapTopAndBottom = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon33) {
            _inherits(o, _n$XmlAttributeCompon33);
            var _super101 = _createSuper(o);
            function o() {
              var _this99;
              _classCallCheck(this, o);
              _this99 = _super101.apply(this, arguments), _this99.xmlKeys = {
                distT: "distT",
                distB: "distB"
              };
              return _this99;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent49) {
            _inherits(i, _n$XmlComponent49);
            var _super102 = _createSuper(i);
            function i() {
              var _this100;
              var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
                top: 0,
                bottom: 0
              };
              _classCallCheck(this, i);
              _this100 = _super102.call(this, "wp:wrapTopAndBottom"), _this100.root.push(new o({
                distT: e.top,
                distB: e.bottom
              }));
              return _this100;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.WrapTopAndBottom = i;
        },
        2637: function _(e, t) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.WORKAROUND = void 0, t.WORKAROUND = "";
        },
        3528: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.File = void 0;
          var n = r(2378),
            o = r(8351),
            i = r(9349),
            s = r(1157),
            a = r(7249),
            u = r(3778),
            c = r(7158),
            l = r(4860),
            p = r(1117),
            h = r(6276),
            d = r(146),
            f = r(7224),
            m = r(9694),
            g = r(5703),
            b = r(5258),
            y = r(2202);
          t.File = /*#__PURE__*/function () {
            function _class7(e) {
              var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
              _classCallCheck(this, _class7);
              var r, u, c, p, w, v;
              if (this.currentRelationshipId = 1, this.headers = [], this.footers = [], this.coreProperties = new i.CoreProperties(Object.assign(Object.assign({}, e), {
                creator: null !== (r = e.creator) && void 0 !== r ? r : "Un-named",
                revision: null !== (u = e.revision) && void 0 !== u ? u : "1",
                lastModifiedBy: null !== (c = e.lastModifiedBy) && void 0 !== c ? c : "Un-named"
              })), this.numbering = new d.Numbering(e.numbering ? e.numbering : {
                config: []
              }), this.fileRelationships = new f.Relationships(), this.customProperties = new s.CustomProperties(null !== (p = e.customProperties) && void 0 !== p ? p : []), this.appProperties = new n.AppProperties(), this.footnotesWrapper = new l.FootnotesWrapper(), this.contentTypes = new o.ContentTypes(), this.documentWrapper = new a.DocumentWrapper({
                background: e.background || {}
              }), this.settings = new m.Settings({
                compatabilityModeVersion: e.compatabilityModeVersion,
                evenAndOddHeaders: !!e.evenAndOddHeaderAndFooters,
                trackRevisions: null === (w = e.features) || void 0 === w ? void 0 : w.trackRevisions,
                updateFields: null === (v = e.features) || void 0 === v ? void 0 : v.updateFields
              }), this.media = t.template && t.template.media ? t.template.media : new h.Media(), t.template && (this.currentRelationshipId = t.template.currentRelationshipId + 1), t.template && e.externalStyles) throw Error("can not use both template and external styles");
              if (t.template) {
                var _e8 = new b.ExternalStylesFactory();
                this.styles = _e8.newInstance(t.template.styles);
              } else if (e.externalStyles) {
                var _t13 = new b.ExternalStylesFactory();
                this.styles = _t13.newInstance(e.externalStyles);
              } else if (e.styles) {
                var _t14 = new y.DefaultStylesFactory().newInstance(e.styles.default);
                this.styles = new g.Styles(Object.assign(Object.assign({}, _t14), e.styles));
              } else {
                var _e9 = new y.DefaultStylesFactory();
                this.styles = new g.Styles(_e9.newInstance());
              }
              if (this.addDefaultRelationships(), t.template && t.template.headers) {
                var _iterator5 = _createForOfIteratorHelper(t.template.headers),
                  _step5;
                try {
                  for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                    var _e10 = _step5.value;
                    this.addHeaderToDocument(_e10.header, _e10.type);
                  }
                } catch (err) {
                  _iterator5.e(err);
                } finally {
                  _iterator5.f();
                }
              }
              if (t.template && t.template.footers) {
                var _iterator6 = _createForOfIteratorHelper(t.template.footers),
                  _step6;
                try {
                  for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                    var _e11 = _step6.value;
                    this.addFooterToDocument(_e11.footer, _e11.type);
                  }
                } catch (err) {
                  _iterator6.e(err);
                } finally {
                  _iterator6.f();
                }
              }
              var _iterator7 = _createForOfIteratorHelper(e.sections),
                _step7;
              try {
                for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                  var _t16 = _step7.value;
                  this.addSection(_t16);
                }
              } catch (err) {
                _iterator7.e(err);
              } finally {
                _iterator7.f();
              }
              if (e.footnotes) for (var _t15 in e.footnotes) this.footnotesWrapper.View.createFootNote(parseFloat(_t15), e.footnotes[_t15].children);
            }
            _createClass(_class7, [{
              key: "addSection",
              value: function addSection(_ref7) {
                var _ref7$headers = _ref7.headers,
                  e = _ref7$headers === void 0 ? {} : _ref7$headers,
                  _ref7$footers = _ref7.footers,
                  t = _ref7$footers === void 0 ? {} : _ref7$footers,
                  r = _ref7.children,
                  n = _ref7.properties;
                this.documentWrapper.View.Body.addSection(Object.assign(Object.assign({}, n), {
                  headerWrapperGroup: {
                    default: e.default ? this.createHeader(e.default) : void 0,
                    first: e.first ? this.createHeader(e.first) : void 0,
                    even: e.even ? this.createHeader(e.even) : void 0
                  },
                  footerWrapperGroup: {
                    default: t.default ? this.createFooter(t.default) : void 0,
                    first: t.first ? this.createFooter(t.first) : void 0,
                    even: t.even ? this.createFooter(t.even) : void 0
                  }
                }));
                var _iterator8 = _createForOfIteratorHelper(r),
                  _step8;
                try {
                  for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                    var _e12 = _step8.value;
                    this.documentWrapper.View.add(_e12);
                  }
                } catch (err) {
                  _iterator8.e(err);
                } finally {
                  _iterator8.f();
                }
              }
            }, {
              key: "createHeader",
              value: function createHeader(e) {
                var t = new p.HeaderWrapper(this.media, this.currentRelationshipId++);
                var _iterator9 = _createForOfIteratorHelper(e.options.children),
                  _step9;
                try {
                  for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                    var _r7 = _step9.value;
                    t.add(_r7);
                  }
                } catch (err) {
                  _iterator9.e(err);
                } finally {
                  _iterator9.f();
                }
                return this.addHeaderToDocument(t), t;
              }
            }, {
              key: "createFooter",
              value: function createFooter(e) {
                var t = new c.FooterWrapper(this.media, this.currentRelationshipId++);
                var _iterator10 = _createForOfIteratorHelper(e.options.children),
                  _step10;
                try {
                  for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                    var _r8 = _step10.value;
                    t.add(_r8);
                  }
                } catch (err) {
                  _iterator10.e(err);
                } finally {
                  _iterator10.f();
                }
                return this.addFooterToDocument(t), t;
              }
            }, {
              key: "addHeaderToDocument",
              value: function addHeaderToDocument(e) {
                var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : u.HeaderFooterReferenceType.DEFAULT;
                this.headers.push({
                  header: e,
                  type: t
                }), this.documentWrapper.Relationships.createRelationship(e.View.ReferenceId, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/header", "header".concat(this.headers.length, ".xml")), this.contentTypes.addHeader(this.headers.length);
              }
            }, {
              key: "addFooterToDocument",
              value: function addFooterToDocument(e) {
                var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : u.HeaderFooterReferenceType.DEFAULT;
                this.footers.push({
                  footer: e,
                  type: t
                }), this.documentWrapper.Relationships.createRelationship(e.View.ReferenceId, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer", "footer".concat(this.footers.length, ".xml")), this.contentTypes.addFooter(this.footers.length);
              }
            }, {
              key: "addDefaultRelationships",
              value: function addDefaultRelationships() {
                this.fileRelationships.createRelationship(1, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument", "word/document.xml"), this.fileRelationships.createRelationship(2, "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties", "docProps/core.xml"), this.fileRelationships.createRelationship(3, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties", "docProps/app.xml"), this.fileRelationships.createRelationship(4, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties", "docProps/custom.xml"), this.documentWrapper.Relationships.createRelationship(this.currentRelationshipId++, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles", "styles.xml"), this.documentWrapper.Relationships.createRelationship(this.currentRelationshipId++, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering", "numbering.xml"), this.documentWrapper.Relationships.createRelationship(this.currentRelationshipId++, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes", "footnotes.xml"), this.documentWrapper.Relationships.createRelationship(this.currentRelationshipId++, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings", "settings.xml");
              }
            }, {
              key: "Document",
              get: function get() {
                return this.documentWrapper;
              }
            }, {
              key: "Styles",
              get: function get() {
                return this.styles;
              }
            }, {
              key: "CoreProperties",
              get: function get() {
                return this.coreProperties;
              }
            }, {
              key: "Numbering",
              get: function get() {
                return this.numbering;
              }
            }, {
              key: "Media",
              get: function get() {
                return this.media;
              }
            }, {
              key: "FileRelationships",
              get: function get() {
                return this.fileRelationships;
              }
            }, {
              key: "Headers",
              get: function get() {
                return this.headers.map(function (e) {
                  return e.header;
                });
              }
            }, {
              key: "Footers",
              get: function get() {
                return this.footers.map(function (e) {
                  return e.footer;
                });
              }
            }, {
              key: "ContentTypes",
              get: function get() {
                return this.contentTypes;
              }
            }, {
              key: "CustomProperties",
              get: function get() {
                return this.customProperties;
              }
            }, {
              key: "AppProperties",
              get: function get() {
                return this.appProperties;
              }
            }, {
              key: "FootNotes",
              get: function get() {
                return this.footnotesWrapper;
              }
            }, {
              key: "Settings",
              get: function get() {
                return this.settings;
              }
            }]);
            return _class7;
          }();
        },
        7158: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.FooterWrapper = void 0;
          var n = r(1657),
            o = r(7224);
          t.FooterWrapper = /*#__PURE__*/function () {
            function _class8(e, t, r) {
              _classCallCheck(this, _class8);
              this.media = e, this.footer = new n.Footer(t, r), this.relationships = new o.Relationships();
            }
            _createClass(_class8, [{
              key: "add",
              value: function add(e) {
                this.footer.add(e);
              }
            }, {
              key: "addChildElement",
              value: function addChildElement(e) {
                this.footer.addChildElement(e);
              }
            }, {
              key: "View",
              get: function get() {
                return this.footer;
              }
            }, {
              key: "Relationships",
              get: function get() {
                return this.relationships;
              }
            }, {
              key: "Media",
              get: function get() {
                return this.media;
              }
            }]);
            return _class8;
          }();
        },
        6146: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.FooterAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon34) {
            _inherits(o, _n$XmlAttributeCompon34);
            var _super103 = _createSuper(o);
            function o() {
              var _this101;
              _classCallCheck(this, o);
              _this101 = _super103.apply(this, arguments), _this101.xmlKeys = {
                wpc: "xmlns:wpc",
                mc: "xmlns:mc",
                o: "xmlns:o",
                r: "xmlns:r",
                m: "xmlns:m",
                v: "xmlns:v",
                wp14: "xmlns:wp14",
                wp: "xmlns:wp",
                w10: "xmlns:w10",
                w: "xmlns:w",
                w14: "xmlns:w14",
                w15: "xmlns:w15",
                wpg: "xmlns:wpg",
                wpi: "xmlns:wpi",
                wne: "xmlns:wne",
                wps: "xmlns:wps",
                cp: "xmlns:cp",
                dc: "xmlns:dc",
                dcterms: "xmlns:dcterms",
                dcmitype: "xmlns:dcmitype",
                xsi: "xmlns:xsi",
                type: "xsi:type"
              };
              return _this101;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.FooterAttributes = o;
        },
        1657: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Footer = void 0;
          var n = r(2451),
            o = r(6146);
          var i = /*#__PURE__*/function (_n$InitializableXmlCo) {
            _inherits(i, _n$InitializableXmlCo);
            var _super104 = _createSuper(i);
            function i(e, t) {
              var _this102;
              _classCallCheck(this, i);
              _this102 = _super104.call(this, "w:ftr", t), _this102.refId = e, t || _this102.root.push(new o.FooterAttributes({
                wpc: "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas",
                mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
                o: "urn:schemas-microsoft-com:office:office",
                r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
                m: "http://schemas.openxmlformats.org/officeDocument/2006/math",
                v: "urn:schemas-microsoft-com:vml",
                wp14: "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
                wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
                w10: "urn:schemas-microsoft-com:office:word",
                w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
                w14: "http://schemas.microsoft.com/office/word/2010/wordml",
                w15: "http://schemas.microsoft.com/office/word/2012/wordml",
                wpg: "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
                wpi: "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
                wne: "http://schemas.microsoft.com/office/word/2006/wordml",
                wps: "http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
              }));
              return _this102;
            }
            _createClass(i, [{
              key: "ReferenceId",
              get: function get() {
                return this.refId;
              }
            }, {
              key: "add",
              value: function add(e) {
                this.root.push(e);
              }
            }]);
            return i;
          }(n.InitializableXmlComponent);
          t.Footer = i;
        },
        4860: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.FootnotesWrapper = void 0;
          var n = r(9272),
            o = r(7224);
          t.FootnotesWrapper = /*#__PURE__*/function () {
            function _class9() {
              _classCallCheck(this, _class9);
              this.footnotess = new n.FootNotes(), this.relationships = new o.Relationships();
            }
            _createClass(_class9, [{
              key: "View",
              get: function get() {
                return this.footnotess;
              }
            }, {
              key: "Relationships",
              get: function get() {
                return this.relationships;
              }
            }]);
            return _class9;
          }();
        },
        8301: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.FootnoteAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon35) {
            _inherits(o, _n$XmlAttributeCompon35);
            var _super105 = _createSuper(o);
            function o() {
              var _this103;
              _classCallCheck(this, o);
              _this103 = _super105.apply(this, arguments), _this103.xmlKeys = {
                type: "w:type",
                id: "w:id"
              };
              return _this103;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.FootnoteAttributes = o;
        },
        8742: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Footnote = t.FootnoteType = void 0;
          var n = r(2451),
            o = r(8301),
            i = r(532);
          var s;
          (s = t.FootnoteType || (t.FootnoteType = {})).SEPERATOR = "separator", s.CONTINUATION_SEPERATOR = "continuationSeparator";
          var a = /*#__PURE__*/function (_n$XmlComponent50) {
            _inherits(a, _n$XmlComponent50);
            var _super106 = _createSuper(a);
            function a(e) {
              var _this104;
              _classCallCheck(this, a);
              _this104 = _super106.call(this, "w:footnote"), _this104.root.push(new o.FootnoteAttributes({
                type: e.type,
                id: e.id
              }));
              for (var _t17 = 0; _t17 < e.children.length; _t17++) {
                var _r9 = e.children[_t17];
                0 === _t17 && _r9.addRunToFront(new i.FootnoteRefRun()), _this104.root.push(_r9);
              }
              return _this104;
            }
            return _createClass(a);
          }(n.XmlComponent);
          t.Footnote = a;
        },
        378: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(7009), t);
        },
        9388: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ContinuationSeperatorRun = void 0;
          var n = r(4827),
            o = r(8974);
          var i = /*#__PURE__*/function (_n$Run) {
            _inherits(i, _n$Run);
            var _super107 = _createSuper(i);
            function i() {
              var _this105;
              _classCallCheck(this, i);
              _this105 = _super107.call(this, {}), _this105.root.push(new o.ContinuationSeperator());
              return _this105;
            }
            return _createClass(i);
          }(n.Run);
          t.ContinuationSeperatorRun = i;
        },
        8974: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ContinuationSeperator = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent51) {
            _inherits(o, _n$XmlComponent51);
            var _super108 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super108.call(this, "w:continuationSeparator");
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.ContinuationSeperator = o;
        },
        532: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.FootnoteRefRun = void 0;
          var n = r(4827),
            o = r(1078);
          var i = /*#__PURE__*/function (_n$Run2) {
            _inherits(i, _n$Run2);
            var _super109 = _createSuper(i);
            function i() {
              var _this106;
              _classCallCheck(this, i);
              _this106 = _super109.call(this, {
                style: "FootnoteReference"
              }), _this106.root.push(new o.FootnoteRef());
              return _this106;
            }
            return _createClass(i);
          }(n.Run);
          t.FootnoteRefRun = i;
        },
        1078: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.FootnoteRef = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent52) {
            _inherits(o, _n$XmlComponent52);
            var _super110 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super110.call(this, "w:footnoteRef");
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.FootnoteRef = o;
        },
        7009: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(4375), t);
        },
        4375: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.FootnoteReferenceRun = t.FootnoteReference = t.FootNoteReferenceRunAttributes = void 0;
          var n = r(6902),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon10) {
            _inherits(i, _o$XmlAttributeCompon10);
            var _super111 = _createSuper(i);
            function i() {
              var _this107;
              _classCallCheck(this, i);
              _this107 = _super111.apply(this, arguments), _this107.xmlKeys = {
                id: "w:id"
              };
              return _this107;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          t.FootNoteReferenceRunAttributes = i;
          var s = /*#__PURE__*/function (_o$XmlComponent10) {
            _inherits(s, _o$XmlComponent10);
            var _super112 = _createSuper(s);
            function s(e) {
              var _this108;
              _classCallCheck(this, s);
              _this108 = _super112.call(this, "w:footnoteReference"), _this108.root.push(new i({
                id: e
              }));
              return _this108;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.FootnoteReference = s;
          var a = /*#__PURE__*/function (_n$Run3) {
            _inherits(a, _n$Run3);
            var _super113 = _createSuper(a);
            function a(e) {
              var _this109;
              _classCallCheck(this, a);
              _this109 = _super113.call(this, {
                style: "FootnoteReference"
              }), _this109.root.push(new s(e));
              return _this109;
            }
            return _createClass(a);
          }(n.Run);
          t.FootnoteReferenceRun = a;
        },
        6238: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.SeperatorRun = void 0;
          var n = r(4827),
            o = r(239);
          var i = /*#__PURE__*/function (_n$Run4) {
            _inherits(i, _n$Run4);
            var _super114 = _createSuper(i);
            function i() {
              var _this110;
              _classCallCheck(this, i);
              _this110 = _super114.call(this, {}), _this110.root.push(new o.Seperator());
              return _this110;
            }
            return _createClass(i);
          }(n.Run);
          t.SeperatorRun = i;
        },
        239: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Seperator = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent53) {
            _inherits(o, _n$XmlComponent53);
            var _super115 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super115.call(this, "w:separator");
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.Seperator = o;
        },
        1249: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.FootnotesAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon36) {
            _inherits(o, _n$XmlAttributeCompon36);
            var _super116 = _createSuper(o);
            function o() {
              var _this111;
              _classCallCheck(this, o);
              _this111 = _super116.apply(this, arguments), _this111.xmlKeys = {
                wpc: "xmlns:wpc",
                mc: "xmlns:mc",
                o: "xmlns:o",
                r: "xmlns:r",
                m: "xmlns:m",
                v: "xmlns:v",
                wp14: "xmlns:wp14",
                wp: "xmlns:wp",
                w10: "xmlns:w10",
                w: "xmlns:w",
                w14: "xmlns:w14",
                w15: "xmlns:w15",
                wpg: "xmlns:wpg",
                wpi: "xmlns:wpi",
                wne: "xmlns:wne",
                wps: "xmlns:wps",
                Ignorable: "mc:Ignorable"
              };
              return _this111;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.FootnotesAttributes = o;
        },
        9272: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.FootNotes = void 0;
          var n = r(2451),
            o = r(4827),
            i = r(8742),
            s = r(9388),
            a = r(6238),
            u = r(1249);
          var c = /*#__PURE__*/function (_n$XmlComponent54) {
            _inherits(c, _n$XmlComponent54);
            var _super117 = _createSuper(c);
            function c() {
              var _this112;
              _classCallCheck(this, c);
              _this112 = _super117.call(this, "w:footnotes"), _this112.root.push(new u.FootnotesAttributes({
                wpc: "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas",
                mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
                o: "urn:schemas-microsoft-com:office:office",
                r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
                m: "http://schemas.openxmlformats.org/officeDocument/2006/math",
                v: "urn:schemas-microsoft-com:vml",
                wp14: "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
                wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
                w10: "urn:schemas-microsoft-com:office:word",
                w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
                w14: "http://schemas.microsoft.com/office/word/2010/wordml",
                w15: "http://schemas.microsoft.com/office/word/2012/wordml",
                wpg: "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
                wpi: "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
                wne: "http://schemas.microsoft.com/office/word/2006/wordml",
                wps: "http://schemas.microsoft.com/office/word/2010/wordprocessingShape",
                Ignorable: "w14 w15 wp14"
              }));
              var e = new i.Footnote({
                id: -1,
                type: i.FootnoteType.SEPERATOR,
                children: [new o.Paragraph({
                  spacing: {
                    after: 0,
                    line: 240,
                    lineRule: o.LineRuleType.AUTO
                  },
                  children: [new a.SeperatorRun()]
                })]
              });
              _this112.root.push(e);
              var t = new i.Footnote({
                id: 0,
                type: i.FootnoteType.CONTINUATION_SEPERATOR,
                children: [new o.Paragraph({
                  spacing: {
                    after: 0,
                    line: 240,
                    lineRule: o.LineRuleType.AUTO
                  },
                  children: [new s.ContinuationSeperatorRun()]
                })]
              });
              _this112.root.push(t);
              return _this112;
            }
            _createClass(c, [{
              key: "createFootNote",
              value: function createFootNote(e, t) {
                var r = new i.Footnote({
                  id: e,
                  children: t
                });
                this.root.push(r);
              }
            }]);
            return c;
          }(n.XmlComponent);
          t.FootNotes = c;
        },
        2766: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(9272), t), o(r(378), t);
        },
        1117: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.HeaderWrapper = void 0;
          var n = r(3646),
            o = r(7224);
          t.HeaderWrapper = /*#__PURE__*/function () {
            function _class10(e, t, r) {
              _classCallCheck(this, _class10);
              this.media = e, this.header = new n.Header(t, r), this.relationships = new o.Relationships();
            }
            _createClass(_class10, [{
              key: "add",
              value: function add(e) {
                return this.header.add(e), this;
              }
            }, {
              key: "addChildElement",
              value: function addChildElement(e) {
                this.header.addChildElement(e);
              }
            }, {
              key: "View",
              get: function get() {
                return this.header;
              }
            }, {
              key: "Relationships",
              get: function get() {
                return this.relationships;
              }
            }, {
              key: "Media",
              get: function get() {
                return this.media;
              }
            }]);
            return _class10;
          }();
        },
        4793: function _(e, t) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Footer = t.Header = void 0, t.Header = /*#__PURE__*/function () {
            function _class11() {
              var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
                children: []
              };
              _classCallCheck(this, _class11);
              this.options = e;
            }
            return _createClass(_class11);
          }(), t.Footer = /*#__PURE__*/function () {
            function _class12() {
              var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
                children: []
              };
              _classCallCheck(this, _class12);
              this.options = e;
            }
            return _createClass(_class12);
          }();
        },
        4716: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.HeaderAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon37) {
            _inherits(o, _n$XmlAttributeCompon37);
            var _super118 = _createSuper(o);
            function o() {
              var _this113;
              _classCallCheck(this, o);
              _this113 = _super118.apply(this, arguments), _this113.xmlKeys = {
                wpc: "xmlns:wpc",
                mc: "xmlns:mc",
                o: "xmlns:o",
                r: "xmlns:r",
                m: "xmlns:m",
                v: "xmlns:v",
                wp14: "xmlns:wp14",
                wp: "xmlns:wp",
                w10: "xmlns:w10",
                w: "xmlns:w",
                w14: "xmlns:w14",
                w15: "xmlns:w15",
                wpg: "xmlns:wpg",
                wpi: "xmlns:wpi",
                wne: "xmlns:wne",
                wps: "xmlns:wps",
                cp: "xmlns:cp",
                dc: "xmlns:dc",
                dcterms: "xmlns:dcterms",
                dcmitype: "xmlns:dcmitype",
                xsi: "xmlns:xsi",
                type: "xsi:type",
                cx: "xmlns:cx",
                cx1: "xmlns:cx1",
                cx2: "xmlns:cx2",
                cx3: "xmlns:cx3",
                cx4: "xmlns:cx4",
                cx5: "xmlns:cx5",
                cx6: "xmlns:cx6",
                cx7: "xmlns:cx7",
                cx8: "xmlns:cx8",
                w16cid: "xmlns:w16cid",
                w16se: "xmlns:w16se"
              };
              return _this113;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.HeaderAttributes = o;
        },
        3646: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Header = void 0;
          var n = r(2451),
            o = r(4716);
          var i = /*#__PURE__*/function (_n$InitializableXmlCo2) {
            _inherits(i, _n$InitializableXmlCo2);
            var _super119 = _createSuper(i);
            function i(e, t) {
              var _this114;
              _classCallCheck(this, i);
              _this114 = _super119.call(this, "w:hdr", t), _this114.refId = e, t || _this114.root.push(new o.HeaderAttributes({
                wpc: "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas",
                mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
                o: "urn:schemas-microsoft-com:office:office",
                r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
                m: "http://schemas.openxmlformats.org/officeDocument/2006/math",
                v: "urn:schemas-microsoft-com:vml",
                wp14: "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
                wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
                w10: "urn:schemas-microsoft-com:office:word",
                w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
                w14: "http://schemas.microsoft.com/office/word/2010/wordml",
                w15: "http://schemas.microsoft.com/office/word/2012/wordml",
                wpg: "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
                wpi: "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
                wne: "http://schemas.microsoft.com/office/word/2006/wordml",
                wps: "http://schemas.microsoft.com/office/word/2010/wordprocessingShape",
                cx: "http://schemas.microsoft.com/office/drawing/2014/chartex",
                cx1: "http://schemas.microsoft.com/office/drawing/2015/9/8/chartex",
                cx2: "http://schemas.microsoft.com/office/drawing/2015/10/21/chartex",
                cx3: "http://schemas.microsoft.com/office/drawing/2016/5/9/chartex",
                cx4: "http://schemas.microsoft.com/office/drawing/2016/5/10/chartex",
                cx5: "http://schemas.microsoft.com/office/drawing/2016/5/11/chartex",
                cx6: "http://schemas.microsoft.com/office/drawing/2016/5/12/chartex",
                cx7: "http://schemas.microsoft.com/office/drawing/2016/5/13/chartex",
                cx8: "http://schemas.microsoft.com/office/drawing/2016/5/14/chartex",
                w16cid: "http://schemas.microsoft.com/office/word/2016/wordml/cid",
                w16se: "http://schemas.microsoft.com/office/word/2015/wordml/symex"
              }));
              return _this114;
            }
            _createClass(i, [{
              key: "ReferenceId",
              get: function get() {
                return this.refId;
              }
            }, {
              key: "add",
              value: function add(e) {
                this.root.push(e);
              }
            }]);
            return i;
          }(n.InitializableXmlComponent);
          t.Header = i;
        },
        7559: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(4827), t), o(r(5), t), o(r(3528), t), o(r(2637), t), o(r(146), t), o(r(6276), t), o(r(6876), t), o(r(6593), t), o(r(8613), t), o(r(5703), t), o(r(5205), t), o(r(2451), t), o(r(1117), t), o(r(7158), t), o(r(4793), t), o(r(2766), t), o(r(699), t), o(r(2969), t), o(r(5328), t), o(r(459), t), o(r(4087), t);
        },
        6740: function _(e, t) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.WORKAROUND2 = void 0, t.WORKAROUND2 = "";
        },
        6276: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(7117), t), o(r(6740), t);
        },
        7117: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Media = void 0;
          var n = r(5524);
          t.Media = /*#__PURE__*/function () {
            function _class13() {
              _classCallCheck(this, _class13);
              this.map = new Map();
            }
            _createClass(_class13, [{
              key: "addMedia",
              value: function addMedia(e, t) {
                var r = "".concat((0, n.uniqueId)(), ".png"),
                  o = {
                    stream: "string" == typeof e ? this.convertDataURIToBinary(e) : e,
                    fileName: r,
                    transformation: {
                      pixels: {
                        x: Math.round(t.width),
                        y: Math.round(t.height)
                      },
                      emus: {
                        x: Math.round(9525 * t.width),
                        y: Math.round(9525 * t.height)
                      },
                      flip: t.flip,
                      rotation: t.rotation ? 6e4 * t.rotation : void 0
                    }
                  };
                return this.map.set(r, o), o;
              }
            }, {
              key: "addImage",
              value: function addImage(e, t) {
                this.map.set(e, t);
              }
            }, {
              key: "Array",
              get: function get() {
                return Array.from(this.map.values());
              }
            }, {
              key: "convertDataURIToBinary",
              value: function convertDataURIToBinary(e) {
                var t = ";base64,",
                  n = e.indexOf(t) + t.length;
                return "function" == typeof atob ? new Uint8Array(atob(e.substring(n)).split("").map(function (e) {
                  return e.charCodeAt(0);
                })) : new (r(8764).Buffer)(e, "base64");
              }
            }]);
            return _class13;
          }();
        },
        9808: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.AbstractNumbering = void 0;
          var n = r(459),
            o = r(2451),
            i = r(1160),
            s = r(5349);
          var a = /*#__PURE__*/function (_o$XmlAttributeCompon11) {
            _inherits(a, _o$XmlAttributeCompon11);
            var _super120 = _createSuper(a);
            function a() {
              var _this115;
              _classCallCheck(this, a);
              _this115 = _super120.apply(this, arguments), _this115.xmlKeys = {
                abstractNumId: "w:abstractNumId",
                restartNumberingAfterBreak: "w15:restartNumberingAfterBreak"
              };
              return _this115;
            }
            return _createClass(a);
          }(o.XmlAttributeComponent);
          var u = /*#__PURE__*/function (_o$XmlComponent11) {
            _inherits(u, _o$XmlComponent11);
            var _super121 = _createSuper(u);
            function u(e, t) {
              var _this116;
              _classCallCheck(this, u);
              _this116 = _super121.call(this, "w:abstractNum"), _this116.root.push(new a({
                abstractNumId: (0, n.decimalNumber)(e),
                restartNumberingAfterBreak: 0
              })), _this116.root.push(new s.MultiLevelType("hybridMultilevel")), _this116.id = e;
              var _iterator11 = _createForOfIteratorHelper(t),
                _step11;
              try {
                for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
                  var _e13 = _step11.value;
                  _this116.root.push(new i.Level(_e13));
                }
              } catch (err) {
                _iterator11.e(err);
              } finally {
                _iterator11.f();
              }
              return _this116;
            }
            return _createClass(u);
          }(o.XmlComponent);
          t.AbstractNumbering = u;
        },
        146: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(1283), t), o(r(9808), t), o(r(1160), t), o(r(9138), t);
        },
        1160: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.LevelForOverride = t.Level = t.LevelBase = t.LevelSuffix = t.LevelFormat = void 0;
          var n = r(459),
            o = r(2451),
            i = r(7654),
            s = r(3434),
            a = r(1972);
          var u, c;
          (u = t.LevelFormat || (t.LevelFormat = {})).BULLET = "bullet", u.CARDINAL_TEXT = "cardinalText", u.CHICAGO = "chicago", u.DECIMAL = "decimal", u.DECIMAL_ENCLOSED_CIRCLE = "decimalEnclosedCircle", u.DECIMAL_ENCLOSED_FULLSTOP = "decimalEnclosedFullstop", u.DECIMAL_ENCLOSED_PARENTHESES = "decimalEnclosedParen", u.DECIMAL_ZERO = "decimalZero", u.LOWER_LETTER = "lowerLetter", u.LOWER_ROMAN = "lowerRoman", u.NONE = "none", u.ORDINAL_TEXT = "ordinalText", u.UPPER_LETTER = "upperLetter", u.UPPER_ROMAN = "upperRoman";
          var l = /*#__PURE__*/function (_o$XmlAttributeCompon12) {
            _inherits(l, _o$XmlAttributeCompon12);
            var _super122 = _createSuper(l);
            function l() {
              var _this117;
              _classCallCheck(this, l);
              _this117 = _super122.apply(this, arguments), _this117.xmlKeys = {
                ilvl: "w:ilvl",
                tentative: "w15:tentative"
              };
              return _this117;
            }
            return _createClass(l);
          }(o.XmlAttributeComponent);
          var p = /*#__PURE__*/function (_o$XmlComponent12) {
            _inherits(p, _o$XmlComponent12);
            var _super123 = _createSuper(p);
            function p(e) {
              var _this118;
              _classCallCheck(this, p);
              _this118 = _super123.call(this, "w:numFmt"), _this118.root.push(new o.Attributes({
                val: e
              }));
              return _this118;
            }
            return _createClass(p);
          }(o.XmlComponent);
          var h = /*#__PURE__*/function (_o$XmlComponent13) {
            _inherits(h, _o$XmlComponent13);
            var _super124 = _createSuper(h);
            function h(e) {
              var _this119;
              _classCallCheck(this, h);
              _this119 = _super124.call(this, "w:lvlText"), _this119.root.push(new o.Attributes({
                val: e
              }));
              return _this119;
            }
            return _createClass(h);
          }(o.XmlComponent);
          var d = /*#__PURE__*/function (_o$XmlComponent14) {
            _inherits(d, _o$XmlComponent14);
            var _super125 = _createSuper(d);
            function d(e) {
              var _this120;
              _classCallCheck(this, d);
              _this120 = _super125.call(this, "w:lvlJc"), _this120.root.push(new o.Attributes({
                val: e
              }));
              return _this120;
            }
            return _createClass(d);
          }(o.XmlComponent);
          (c = t.LevelSuffix || (t.LevelSuffix = {})).NOTHING = "nothing", c.SPACE = "space", c.TAB = "tab";
          var f = /*#__PURE__*/function (_o$XmlComponent15) {
            _inherits(f, _o$XmlComponent15);
            var _super126 = _createSuper(f);
            function f(e) {
              var _this121;
              _classCallCheck(this, f);
              _this121 = _super126.call(this, "w:suff"), _this121.root.push(new o.Attributes({
                val: e
              }));
              return _this121;
            }
            return _createClass(f);
          }(o.XmlComponent);
          var m = /*#__PURE__*/function (_o$XmlComponent16) {
            _inherits(m, _o$XmlComponent16);
            var _super127 = _createSuper(m);
            function m(_ref8) {
              var _this122;
              var e = _ref8.level,
                t = _ref8.format,
                r = _ref8.text,
                _ref8$alignment = _ref8.alignment,
                u = _ref8$alignment === void 0 ? i.AlignmentType.START : _ref8$alignment,
                _ref8$start = _ref8.start,
                c = _ref8$start === void 0 ? 1 : _ref8$start,
                _m = _ref8.style,
                g = _ref8.suffix;
              _classCallCheck(this, m);
              _this122 = _super127.call(this, "w:lvl"), _this122.root.push(new o.NumberValueElement("w:start", (0, n.decimalNumber)(c))), t && _this122.root.push(new p(t)), g && _this122.root.push(new f(g)), r && _this122.root.push(new h(r)), _this122.root.push(new d(u)), _this122.paragraphProperties = new s.ParagraphProperties(_m && _m.paragraph), _this122.runProperties = new a.RunProperties(_m && _m.run), _this122.root.push(_this122.paragraphProperties), _this122.root.push(_this122.runProperties), _this122.root.push(new l({
                ilvl: (0, n.decimalNumber)(e),
                tentative: 1
              }));
              return _this122;
            }
            return _createClass(m);
          }(o.XmlComponent);
          t.LevelBase = m, t.Level = /*#__PURE__*/function (_m2) {
            _inherits(_class14, _m2);
            var _super128 = _createSuper(_class14);
            function _class14(e) {
              _classCallCheck(this, _class14);
              return _super128.call(this, e);
            }
            return _createClass(_class14);
          }(m), t.LevelForOverride = /*#__PURE__*/function (_m3) {
            _inherits(_class15, _m3);
            var _super129 = _createSuper(_class15);
            function _class15() {
              _classCallCheck(this, _class15);
              return _super129.apply(this, arguments);
            }
            return _createClass(_class15);
          }(m);
        },
        5349: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MultiLevelType = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent55) {
            _inherits(o, _n$XmlComponent55);
            var _super130 = _createSuper(o);
            function o(e) {
              var _this123;
              _classCallCheck(this, o);
              _this123 = _super130.call(this, "w:multiLevelType"), _this123.root.push(new n.Attributes({
                val: e
              }));
              return _this123;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.MultiLevelType = o;
        },
        9138: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.LevelOverride = t.ConcreteNumbering = void 0;
          var n = r(459),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlComponent17) {
            _inherits(i, _o$XmlComponent17);
            var _super131 = _createSuper(i);
            function i(e) {
              var _this124;
              _classCallCheck(this, i);
              _this124 = _super131.call(this, "w:abstractNumId"), _this124.root.push(new o.Attributes({
                val: e
              }));
              return _this124;
            }
            return _createClass(i);
          }(o.XmlComponent);
          var s = /*#__PURE__*/function (_o$XmlAttributeCompon13) {
            _inherits(s, _o$XmlAttributeCompon13);
            var _super132 = _createSuper(s);
            function s() {
              var _this125;
              _classCallCheck(this, s);
              _this125 = _super132.apply(this, arguments), _this125.xmlKeys = {
                numId: "w:numId"
              };
              return _this125;
            }
            return _createClass(s);
          }(o.XmlAttributeComponent);
          var a = /*#__PURE__*/function (_o$XmlComponent18) {
            _inherits(a, _o$XmlComponent18);
            var _super133 = _createSuper(a);
            function a(e) {
              var _this126;
              _classCallCheck(this, a);
              _this126 = _super133.call(this, "w:num"), _this126.numId = e.numId, _this126.reference = e.reference, _this126.instance = e.instance, _this126.root.push(new s({
                numId: (0, n.decimalNumber)(e.numId)
              })), _this126.root.push(new i((0, n.decimalNumber)(e.abstractNumId))), e.overrideLevel && _this126.root.push(new c(e.overrideLevel.num, e.overrideLevel.start));
              return _this126;
            }
            return _createClass(a);
          }(o.XmlComponent);
          t.ConcreteNumbering = a;
          var u = /*#__PURE__*/function (_o$XmlAttributeCompon14) {
            _inherits(u, _o$XmlAttributeCompon14);
            var _super134 = _createSuper(u);
            function u() {
              var _this127;
              _classCallCheck(this, u);
              _this127 = _super134.apply(this, arguments), _this127.xmlKeys = {
                ilvl: "w:ilvl"
              };
              return _this127;
            }
            return _createClass(u);
          }(o.XmlAttributeComponent);
          var c = /*#__PURE__*/function (_o$XmlComponent19) {
            _inherits(c, _o$XmlComponent19);
            var _super135 = _createSuper(c);
            function c(e, t) {
              var _this128;
              _classCallCheck(this, c);
              _this128 = _super135.call(this, "w:lvlOverride"), _this128.root.push(new u({
                ilvl: e
              })), void 0 !== t && _this128.root.push(new p(t));
              return _this128;
            }
            return _createClass(c);
          }(o.XmlComponent);
          t.LevelOverride = c;
          var l = /*#__PURE__*/function (_o$XmlAttributeCompon15) {
            _inherits(l, _o$XmlAttributeCompon15);
            var _super136 = _createSuper(l);
            function l() {
              var _this129;
              _classCallCheck(this, l);
              _this129 = _super136.apply(this, arguments), _this129.xmlKeys = {
                val: "w:val"
              };
              return _this129;
            }
            return _createClass(l);
          }(o.XmlAttributeComponent);
          var p = /*#__PURE__*/function (_o$XmlComponent20) {
            _inherits(p, _o$XmlComponent20);
            var _super137 = _createSuper(p);
            function p(e) {
              var _this130;
              _classCallCheck(this, p);
              _this130 = _super137.call(this, "w:startOverride"), _this130.root.push(new l({
                val: e
              }));
              return _this130;
            }
            return _createClass(p);
          }(o.XmlComponent);
        },
        1283: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Numbering = void 0;
          var n = r(5524),
            o = r(4827),
            i = r(2451),
            s = r(7627),
            a = r(9808),
            u = r(1160),
            c = r(9138);
          var l = /*#__PURE__*/function (_i$XmlComponent) {
            _inherits(l, _i$XmlComponent);
            var _super138 = _createSuper(l);
            function l(e) {
              var _this131;
              _classCallCheck(this, l);
              _this131 = _super138.call(this, "w:numbering"), _this131.abstractNumberingMap = new Map(), _this131.concreteNumberingMap = new Map(), _this131.referenceConfigMap = new Map(), _this131.root.push(new s.DocumentAttributes({
                wpc: "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas",
                mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
                o: "urn:schemas-microsoft-com:office:office",
                r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
                m: "http://schemas.openxmlformats.org/officeDocument/2006/math",
                v: "urn:schemas-microsoft-com:vml",
                wp14: "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
                wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
                w10: "urn:schemas-microsoft-com:office:word",
                w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
                w14: "http://schemas.microsoft.com/office/word/2010/wordml",
                w15: "http://schemas.microsoft.com/office/word/2012/wordml",
                wpg: "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
                wpi: "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
                wne: "http://schemas.microsoft.com/office/word/2006/wordml",
                wps: "http://schemas.microsoft.com/office/word/2010/wordprocessingShape",
                Ignorable: "w14 w15 wp14"
              }));
              var t = new a.AbstractNumbering((0, n.uniqueNumericId)(), [{
                level: 0,
                format: u.LevelFormat.BULLET,
                text: "●",
                alignment: o.AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: {
                      left: (0, n.convertInchesToTwip)(.5),
                      hanging: (0, n.convertInchesToTwip)(.25)
                    }
                  }
                }
              }, {
                level: 1,
                format: u.LevelFormat.BULLET,
                text: "○",
                alignment: o.AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: {
                      left: (0, n.convertInchesToTwip)(1),
                      hanging: (0, n.convertInchesToTwip)(.25)
                    }
                  }
                }
              }, {
                level: 2,
                format: u.LevelFormat.BULLET,
                text: "■",
                alignment: o.AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: {
                      left: 2160,
                      hanging: (0, n.convertInchesToTwip)(.25)
                    }
                  }
                }
              }, {
                level: 3,
                format: u.LevelFormat.BULLET,
                text: "●",
                alignment: o.AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: {
                      left: 2880,
                      hanging: (0, n.convertInchesToTwip)(.25)
                    }
                  }
                }
              }, {
                level: 4,
                format: u.LevelFormat.BULLET,
                text: "○",
                alignment: o.AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: {
                      left: 3600,
                      hanging: (0, n.convertInchesToTwip)(.25)
                    }
                  }
                }
              }, {
                level: 5,
                format: u.LevelFormat.BULLET,
                text: "■",
                alignment: o.AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: {
                      left: 4320,
                      hanging: (0, n.convertInchesToTwip)(.25)
                    }
                  }
                }
              }, {
                level: 6,
                format: u.LevelFormat.BULLET,
                text: "●",
                alignment: o.AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: {
                      left: 5040,
                      hanging: (0, n.convertInchesToTwip)(.25)
                    }
                  }
                }
              }, {
                level: 7,
                format: u.LevelFormat.BULLET,
                text: "●",
                alignment: o.AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: {
                      left: 5760,
                      hanging: (0, n.convertInchesToTwip)(.25)
                    }
                  }
                }
              }, {
                level: 8,
                format: u.LevelFormat.BULLET,
                text: "●",
                alignment: o.AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: {
                      left: 6480,
                      hanging: (0, n.convertInchesToTwip)(.25)
                    }
                  }
                }
              }]);
              _this131.concreteNumberingMap.set("default-bullet-numbering", new c.ConcreteNumbering({
                numId: 1,
                abstractNumId: t.id,
                reference: "default-bullet-numbering",
                instance: 0,
                overrideLevel: {
                  num: 0,
                  start: 1
                }
              })), _this131.abstractNumberingMap.set("default-bullet-numbering", t);
              var _iterator12 = _createForOfIteratorHelper(e.config),
                _step12;
              try {
                for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
                  var _t18 = _step12.value;
                  _this131.abstractNumberingMap.set(_t18.reference, new a.AbstractNumbering((0, n.uniqueNumericId)(), _t18.levels)), _this131.referenceConfigMap.set(_t18.reference, _t18.levels);
                }
              } catch (err) {
                _iterator12.e(err);
              } finally {
                _iterator12.f();
              }
              return _this131;
            }
            _createClass(l, [{
              key: "prepForXml",
              value: function prepForXml(e) {
                var _iterator13 = _createForOfIteratorHelper(this.abstractNumberingMap.values()),
                  _step13;
                try {
                  for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
                    var _e14 = _step13.value;
                    this.root.push(_e14);
                  }
                } catch (err) {
                  _iterator13.e(err);
                } finally {
                  _iterator13.f();
                }
                var _iterator14 = _createForOfIteratorHelper(this.concreteNumberingMap.values()),
                  _step14;
                try {
                  for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
                    var _e15 = _step14.value;
                    this.root.push(_e15);
                  }
                } catch (err) {
                  _iterator14.e(err);
                } finally {
                  _iterator14.f();
                }
                return _get(_getPrototypeOf(l.prototype), "prepForXml", this).call(this, e);
              }
            }, {
              key: "createConcreteNumberingInstance",
              value: function createConcreteNumberingInstance(e, t) {
                var r = this.abstractNumberingMap.get(e);
                if (!r) return;
                var o = "".concat(e, "-").concat(t);
                if (this.concreteNumberingMap.has(o)) return;
                var i = {
                    numId: (0, n.uniqueNumericId)(),
                    abstractNumId: r.id,
                    reference: e,
                    instance: t,
                    overrideLevel: {
                      num: 0,
                      start: 1
                    }
                  },
                  s = this.referenceConfigMap.get(e),
                  a = s && s[0].start;
                a && Number.isInteger(a) && (i.overrideLevel = {
                  num: 0,
                  start: a
                }), this.concreteNumberingMap.set(o, new c.ConcreteNumbering(i));
              }
            }, {
              key: "ConcreteNumbering",
              get: function get() {
                return Array.from(this.concreteNumberingMap.values());
              }
            }, {
              key: "ReferenceConfig",
              get: function get() {
                return Array.from(this.referenceConfigMap.values());
              }
            }]);
            return l;
          }(i.XmlComponent);
          t.Numbering = l;
        },
        5778: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Alignment = t.AlignmentAttributes = t.AlignmentType = void 0;
          var n = r(2451);
          var o;
          (o = t.AlignmentType || (t.AlignmentType = {})).START = "start", o.END = "end", o.CENTER = "center", o.BOTH = "both", o.JUSTIFIED = "both", o.DISTRIBUTE = "distribute", o.LEFT = "left", o.RIGHT = "right";
          var i = /*#__PURE__*/function (_n$XmlAttributeCompon38) {
            _inherits(i, _n$XmlAttributeCompon38);
            var _super139 = _createSuper(i);
            function i() {
              var _this132;
              _classCallCheck(this, i);
              _this132 = _super139.apply(this, arguments), _this132.xmlKeys = {
                val: "w:val"
              };
              return _this132;
            }
            return _createClass(i);
          }(n.XmlAttributeComponent);
          t.AlignmentAttributes = i;
          var s = /*#__PURE__*/function (_n$XmlComponent56) {
            _inherits(s, _n$XmlComponent56);
            var _super140 = _createSuper(s);
            function s(e) {
              var _this133;
              _classCallCheck(this, s);
              _this133 = _super140.call(this, "w:jc"), _this133.root.push(new i({
                val: e
              }));
              return _this133;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.Alignment = s;
        },
        7942: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ThematicBreak = t.Border = void 0;
          var n = r(5328),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$IgnoreIfEmptyXmlCo2) {
            _inherits(i, _o$IgnoreIfEmptyXmlCo2);
            var _super141 = _createSuper(i);
            function i(e) {
              var _this134;
              _classCallCheck(this, i);
              _this134 = _super141.call(this, "w:pBdr"), e.top && _this134.root.push(new n.BorderElement("w:top", e.top)), e.bottom && _this134.root.push(new n.BorderElement("w:bottom", e.bottom)), e.left && _this134.root.push(new n.BorderElement("w:left", e.left)), e.right && _this134.root.push(new n.BorderElement("w:right", e.right));
              return _this134;
            }
            return _createClass(i);
          }(o.IgnoreIfEmptyXmlComponent);
          t.Border = i;
          var s = /*#__PURE__*/function (_o$XmlComponent21) {
            _inherits(s, _o$XmlComponent21);
            var _super142 = _createSuper(s);
            function s() {
              var _this135;
              _classCallCheck(this, s);
              _this135 = _super142.call(this, "w:pBdr");
              var e = new n.BorderElement("w:bottom", {
                color: "auto",
                space: 1,
                style: n.BorderStyle.SINGLE,
                size: 6
              });
              _this135.root.push(e);
              return _this135;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.ThematicBreak = s;
        },
        9884: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.PageBreakBefore = t.ColumnBreak = t.PageBreak = void 0;
          var n = r(2451),
            o = r(6902);
          var i;
          !function (e) {
            e.COLUMN = "column", e.PAGE = "page";
          }(i || (i = {}));
          var s = /*#__PURE__*/function (_n$XmlComponent57) {
            _inherits(s, _n$XmlComponent57);
            var _super143 = _createSuper(s);
            function s(e) {
              var _this136;
              _classCallCheck(this, s);
              _this136 = _super143.call(this, "w:br"), _this136.root.push(new n.Attributes({
                type: e
              }));
              return _this136;
            }
            return _createClass(s);
          }(n.XmlComponent);
          var a = /*#__PURE__*/function (_o$Run) {
            _inherits(a, _o$Run);
            var _super144 = _createSuper(a);
            function a() {
              var _this137;
              _classCallCheck(this, a);
              _this137 = _super144.call(this, {}), _this137.root.push(new s(i.PAGE));
              return _this137;
            }
            return _createClass(a);
          }(o.Run);
          t.PageBreak = a;
          var u = /*#__PURE__*/function (_o$Run2) {
            _inherits(u, _o$Run2);
            var _super145 = _createSuper(u);
            function u() {
              var _this138;
              _classCallCheck(this, u);
              _this138 = _super145.call(this, {}), _this138.root.push(new s(i.COLUMN));
              return _this138;
            }
            return _createClass(u);
          }(o.Run);
          t.ColumnBreak = u;
          var c = /*#__PURE__*/function (_n$XmlComponent58) {
            _inherits(c, _n$XmlComponent58);
            var _super146 = _createSuper(c);
            function c() {
              _classCallCheck(this, c);
              return _super146.call(this, "w:pageBreakBefore");
            }
            return _createClass(c);
          }(n.XmlComponent);
          t.PageBreakBefore = c;
        },
        2639: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Indent = void 0;
          var n = r(459),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon16) {
            _inherits(i, _o$XmlAttributeCompon16);
            var _super147 = _createSuper(i);
            function i() {
              var _this139;
              _classCallCheck(this, i);
              _this139 = _super147.apply(this, arguments), _this139.xmlKeys = {
                start: "w:start",
                end: "w:end",
                left: "w:left",
                right: "w:right",
                hanging: "w:hanging",
                firstLine: "w:firstLine"
              };
              return _this139;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_o$XmlComponent22) {
            _inherits(s, _o$XmlComponent22);
            var _super148 = _createSuper(s);
            function s(_ref9) {
              var _this140;
              var e = _ref9.start,
                t = _ref9.end,
                r = _ref9.left,
                o = _ref9.right,
                _s7 = _ref9.hanging,
                a = _ref9.firstLine;
              _classCallCheck(this, s);
              _this140 = _super148.call(this, "w:ind"), _this140.root.push(new i({
                start: void 0 === e ? void 0 : (0, n.signedTwipsMeasureValue)(e),
                end: void 0 === t ? void 0 : (0, n.signedTwipsMeasureValue)(t),
                left: void 0 === r ? void 0 : (0, n.signedTwipsMeasureValue)(r),
                right: void 0 === o ? void 0 : (0, n.signedTwipsMeasureValue)(o),
                hanging: void 0 === _s7 ? void 0 : (0, n.twipsMeasureValue)(_s7),
                firstLine: void 0 === a ? void 0 : (0, n.twipsMeasureValue)(a)
              }));
              return _this140;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.Indent = s;
        },
        7654: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(5778), t), o(r(7942), t), o(r(2639), t), o(r(9884), t), o(r(4200), t), o(r(6923), t), o(r(317), t), o(r(3538), t);
        },
        4200: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Spacing = t.LineRuleType = void 0;
          var n = r(2451);
          var o;
          (o = t.LineRuleType || (t.LineRuleType = {})).AT_LEAST = "atLeast", o.EXACTLY = "exactly", o.AUTO = "auto";
          var i = /*#__PURE__*/function (_n$XmlAttributeCompon39) {
            _inherits(i, _n$XmlAttributeCompon39);
            var _super149 = _createSuper(i);
            function i() {
              var _this141;
              _classCallCheck(this, i);
              _this141 = _super149.apply(this, arguments), _this141.xmlKeys = {
                after: "w:after",
                before: "w:before",
                line: "w:line",
                lineRule: "w:lineRule"
              };
              return _this141;
            }
            return _createClass(i);
          }(n.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_n$XmlComponent59) {
            _inherits(s, _n$XmlComponent59);
            var _super150 = _createSuper(s);
            function s(e) {
              var _this142;
              _classCallCheck(this, s);
              _this142 = _super150.call(this, "w:spacing"), _this142.root.push(new i(e));
              return _this142;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.Spacing = s;
        },
        6923: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Style = t.HeadingLevel = void 0;
          var n = r(2451);
          var o;
          (o = t.HeadingLevel || (t.HeadingLevel = {})).HEADING_1 = "Heading1", o.HEADING_2 = "Heading2", o.HEADING_3 = "Heading3", o.HEADING_4 = "Heading4", o.HEADING_5 = "Heading5", o.HEADING_6 = "Heading6", o.TITLE = "Title";
          var i = /*#__PURE__*/function (_n$XmlComponent60) {
            _inherits(i, _n$XmlComponent60);
            var _super151 = _createSuper(i);
            function i(e) {
              var _this143;
              _classCallCheck(this, i);
              _this143 = _super151.call(this, "w:pStyle"), _this143.root.push(new n.Attributes({
                val: e
              }));
              return _this143;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.Style = i;
        },
        317: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TabStopItem = t.TabAttributes = t.TabStopPosition = t.LeaderType = t.TabStopType = t.TabStop = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent61) {
            _inherits(o, _n$XmlComponent61);
            var _super152 = _createSuper(o);
            function o(e, t, r) {
              var _this144;
              _classCallCheck(this, o);
              _this144 = _super152.call(this, "w:tabs"), _this144.root.push(new c(e, t, r));
              return _this144;
            }
            return _createClass(o);
          }(n.XmlComponent);
          var i, s, a;
          t.TabStop = o, (a = t.TabStopType || (t.TabStopType = {})).LEFT = "left", a.RIGHT = "right", a.CENTER = "center", a.BAR = "bar", a.CLEAR = "clear", a.DECIMAL = "decimal", a.END = "end", a.NUM = "num", a.START = "start", (s = t.LeaderType || (t.LeaderType = {})).DOT = "dot", s.HYPHEN = "hyphen", s.MIDDLE_DOT = "middleDot", s.NONE = "none", s.UNDERSCORE = "underscore", (i = t.TabStopPosition || (t.TabStopPosition = {}))[i.MAX = 9026] = "MAX";
          var u = /*#__PURE__*/function (_n$XmlAttributeCompon40) {
            _inherits(u, _n$XmlAttributeCompon40);
            var _super153 = _createSuper(u);
            function u() {
              var _this145;
              _classCallCheck(this, u);
              _this145 = _super153.apply(this, arguments), _this145.xmlKeys = {
                val: "w:val",
                pos: "w:pos",
                leader: "w:leader"
              };
              return _this145;
            }
            return _createClass(u);
          }(n.XmlAttributeComponent);
          t.TabAttributes = u;
          var c = /*#__PURE__*/function (_n$XmlComponent62) {
            _inherits(c, _n$XmlComponent62);
            var _super154 = _createSuper(c);
            function c(e, t, r) {
              var _this146;
              _classCallCheck(this, c);
              _this146 = _super154.call(this, "w:tab"), _this146.root.push(new u({
                val: e,
                pos: t,
                leader: r
              }));
              return _this146;
            }
            return _createClass(c);
          }(n.XmlComponent);
          t.TabStopItem = c;
        },
        3538: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.NumberProperties = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent63) {
            _inherits(o, _n$XmlComponent63);
            var _super155 = _createSuper(o);
            function o(e, t) {
              var _this147;
              _classCallCheck(this, o);
              _this147 = _super155.call(this, "w:numPr"), _this147.root.push(new i(t)), _this147.root.push(new s(e));
              return _this147;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.NumberProperties = o;
          var i = /*#__PURE__*/function (_n$XmlComponent64) {
            _inherits(i, _n$XmlComponent64);
            var _super156 = _createSuper(i);
            function i(e) {
              var _this148;
              _classCallCheck(this, i);
              _this148 = _super156.call(this, "w:ilvl"), _this148.root.push(new n.Attributes({
                val: e
              }));
              return _this148;
            }
            return _createClass(i);
          }(n.XmlComponent);
          var s = /*#__PURE__*/function (_n$XmlComponent65) {
            _inherits(s, _n$XmlComponent65);
            var _super157 = _createSuper(s);
            function s(e) {
              var _this149;
              _classCallCheck(this, s);
              _this149 = _super157.call(this, "w:numId"), _this149.root.push(new n.Attributes({
                val: "string" == typeof e ? "{".concat(e, "}") : e
              }));
              return _this149;
            }
            return _createClass(s);
          }(n.XmlComponent);
        },
        9889: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.FrameProperties = t.FramePropertiesAttributes = t.FrameWrap = t.FrameAnchorType = t.DropCapType = void 0;
          var n = r(2451);
          var o, i, s;
          (s = t.DropCapType || (t.DropCapType = {})).NONE = "none", s.DROP = "drop", s.MARGIN = "margin", (i = t.FrameAnchorType || (t.FrameAnchorType = {})).MARGIN = "margin", i.PAGE = "page", i.TEXT = "text", (o = t.FrameWrap || (t.FrameWrap = {})).AROUND = "around", o.AUTO = "auto", o.NONE = "none", o.NOT_BESIDE = "notBeside", o.THROUGH = "through", o.TIGHT = "tight";
          var a = /*#__PURE__*/function (_n$XmlAttributeCompon41) {
            _inherits(a, _n$XmlAttributeCompon41);
            var _super158 = _createSuper(a);
            function a() {
              var _this150;
              _classCallCheck(this, a);
              _this150 = _super158.apply(this, arguments), _this150.xmlKeys = {
                anchorLock: "w:anchorLock",
                dropCap: "w:dropCap",
                width: "w:w",
                height: "w:h",
                x: "w:x",
                y: "w:y",
                anchorHorizontal: "w:hAnchor",
                anchorVertical: "w:vAnchor",
                spaceHorizontal: "w:hSpace",
                spaceVertical: "w:vSpace",
                rule: "w:hRule",
                alignmentX: "w:xAlign",
                alignmentY: "w:yAlign",
                lines: "w:lines",
                wrap: "w:wrap"
              };
              return _this150;
            }
            return _createClass(a);
          }(n.XmlAttributeComponent);
          t.FramePropertiesAttributes = a;
          var u = /*#__PURE__*/function (_n$XmlComponent66) {
            _inherits(u, _n$XmlComponent66);
            var _super159 = _createSuper(u);
            function u(e) {
              var _this151;
              _classCallCheck(this, u);
              var t, r;
              _this151 = _super159.call(this, "w:framePr"), _this151.root.push(new a({
                anchorLock: e.anchorLock,
                dropCap: e.dropCap,
                width: e.width,
                height: e.height,
                x: e.position.x,
                y: e.position.y,
                anchorHorizontal: e.anchor.horizontal,
                anchorVertical: e.anchor.vertical,
                spaceHorizontal: null === (t = e.space) || void 0 === t ? void 0 : t.horizontal,
                spaceVertical: null === (r = e.space) || void 0 === r ? void 0 : r.vertical,
                rule: e.rule,
                alignmentX: e.alignment.x,
                alignmentY: e.alignment.y,
                lines: e.lines,
                wrap: e.wrap
              }));
              return _this151;
            }
            return _createClass(u);
          }(n.XmlComponent);
          t.FrameProperties = u;
        },
        6464: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(9889), t);
        },
        4827: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(7654), t), o(r(1859), t), o(r(3434), t), o(r(6902), t), o(r(2805), t), o(r(3723), t), o(r(6464), t);
        },
        361: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.BookmarkEndAttributes = t.BookmarkStartAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon42) {
            _inherits(o, _n$XmlAttributeCompon42);
            var _super160 = _createSuper(o);
            function o() {
              var _this152;
              _classCallCheck(this, o);
              _this152 = _super160.apply(this, arguments), _this152.xmlKeys = {
                id: "w:id",
                name: "w:name"
              };
              return _this152;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.BookmarkStartAttributes = o;
          var i = /*#__PURE__*/function (_n$XmlAttributeCompon43) {
            _inherits(i, _n$XmlAttributeCompon43);
            var _super161 = _createSuper(i);
            function i() {
              var _this153;
              _classCallCheck(this, i);
              _this153 = _super161.apply(this, arguments), _this153.xmlKeys = {
                id: "w:id"
              };
              return _this153;
            }
            return _createClass(i);
          }(n.XmlAttributeComponent);
          t.BookmarkEndAttributes = i;
        },
        703: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.BookmarkEnd = t.BookmarkStart = t.Bookmark = void 0;
          var n = r(5524),
            o = r(2451),
            i = r(361);
          t.Bookmark = /*#__PURE__*/function () {
            function _class16(e) {
              _classCallCheck(this, _class16);
              var t = (0, n.uniqueId)();
              this.start = new s(e.id, t), this.children = e.children, this.end = new a(t);
            }
            return _createClass(_class16);
          }();
          var s = /*#__PURE__*/function (_o$XmlComponent23) {
            _inherits(s, _o$XmlComponent23);
            var _super162 = _createSuper(s);
            function s(e, t) {
              var _this154;
              _classCallCheck(this, s);
              _this154 = _super162.call(this, "w:bookmarkStart");
              var r = new i.BookmarkStartAttributes({
                name: e,
                id: t
              });
              _this154.root.push(r);
              return _this154;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.BookmarkStart = s;
          var a = /*#__PURE__*/function (_o$XmlComponent24) {
            _inherits(a, _o$XmlComponent24);
            var _super163 = _createSuper(a);
            function a(e) {
              var _this155;
              _classCallCheck(this, a);
              _this155 = _super163.call(this, "w:bookmarkEnd");
              var t = new i.BookmarkEndAttributes({
                id: e
              });
              _this155.root.push(t);
              return _this155;
            }
            return _createClass(a);
          }(o.XmlComponent);
          t.BookmarkEnd = a;
        },
        2472: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.HyperlinkAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon44) {
            _inherits(o, _n$XmlAttributeCompon44);
            var _super164 = _createSuper(o);
            function o() {
              var _this156;
              _classCallCheck(this, o);
              _this156 = _super164.apply(this, arguments), _this156.xmlKeys = {
                id: "r:id",
                history: "w:history",
                anchor: "w:anchor"
              };
              return _this156;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.HyperlinkAttributes = o;
        },
        7794: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ExternalHyperlink = t.InternalHyperlink = t.ConcreteHyperlink = t.HyperlinkType = void 0;
          var n = r(5524),
            o = r(2451),
            i = r(2472);
          var s;
          (s = t.HyperlinkType || (t.HyperlinkType = {})).INTERNAL = "INTERNAL", s.EXTERNAL = "EXTERNAL";
          var a = /*#__PURE__*/function (_o$XmlComponent25) {
            _inherits(a, _o$XmlComponent25);
            var _super165 = _createSuper(a);
            function a(e, t, r) {
              var _this157;
              _classCallCheck(this, a);
              _this157 = _super165.call(this, "w:hyperlink"), _this157.linkId = t;
              var n = {
                  history: 1,
                  anchor: r || void 0,
                  id: r ? void 0 : "rId".concat(_this157.linkId)
                },
                o = new i.HyperlinkAttributes(n);
              _this157.root.push(o), e.forEach(function (e) {
                _this157.root.push(e);
              });
              return _this157;
            }
            return _createClass(a);
          }(o.XmlComponent);
          t.ConcreteHyperlink = a, t.InternalHyperlink = /*#__PURE__*/function (_a3) {
            _inherits(_class17, _a3);
            var _super166 = _createSuper(_class17);
            function _class17(e) {
              _classCallCheck(this, _class17);
              return _super166.call(this, e.children, (0, n.uniqueId)(), e.anchor);
            }
            return _createClass(_class17);
          }(a), t.ExternalHyperlink = /*#__PURE__*/function () {
            function _class18(e) {
              _classCallCheck(this, _class18);
              this.options = e;
            }
            return _createClass(_class18);
          }();
        },
        2805: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(7794), t), o(r(703), t), o(r(7254), t), o(r(1488), t);
        },
        7254: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.OutlineLevel = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent67) {
            _inherits(o, _n$XmlComponent67);
            var _super167 = _createSuper(o);
            function o(e) {
              var _this158;
              _classCallCheck(this, o);
              _this158 = _super167.call(this, "w:outlineLvl"), _this158.level = e, _this158.root.push(new n.Attributes({
                val: e
              }));
              return _this158;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.OutlineLevel = o;
        },
        1140: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.PageReferenceFieldInstruction = void 0;
          var n = r(5321),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon17) {
            _inherits(i, _o$XmlAttributeCompon17);
            var _super168 = _createSuper(i);
            function i() {
              var _this159;
              _classCallCheck(this, i);
              _this159 = _super168.apply(this, arguments), _this159.xmlKeys = {
                space: "xml:space"
              };
              return _this159;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_o$XmlComponent26) {
            _inherits(s, _o$XmlComponent26);
            var _super169 = _createSuper(s);
            function s(e) {
              var _this160;
              var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
              _classCallCheck(this, s);
              _this160 = _super169.call(this, "w:instrText"), _this160.root.push(new i({
                space: n.SpaceType.PRESERVE
              }));
              var r = "PAGEREF ".concat(e);
              t.hyperlink && (r = "".concat(r, " \\h")), t.useRelativePosition && (r = "".concat(r, " \\p")), _this160.root.push(r);
              return _this160;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.PageReferenceFieldInstruction = s;
        },
        1488: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.PageReference = void 0;
          var n = r(3178),
            o = r(6902),
            i = r(1140);
          var s = /*#__PURE__*/function (_o$Run3) {
            _inherits(s, _o$Run3);
            var _super170 = _createSuper(s);
            function s(e) {
              var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
              _classCallCheck(this, s);
              return _super170.call(this, {
                children: [new n.Begin(!0), new i.PageReferenceFieldInstruction(e, t), new n.End()]
              });
            }
            return _createClass(s);
          }(o.Run);
          t.PageReference = s;
        },
        454: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(6721), t), o(r(4063), t), o(r(6507), t), o(r(6412), t);
        },
        6412: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathAngledBrackets = void 0;
          var n = r(2451),
            o = r(4114),
            i = r(5664);
          var s = /*#__PURE__*/function (_n$XmlComponent68) {
            _inherits(s, _n$XmlComponent68);
            var _super171 = _createSuper(s);
            function s(e) {
              var _this161;
              _classCallCheck(this, s);
              _this161 = _super171.call(this, "m:d"), _this161.root.push(new i.MathBracketProperties({
                beginningCharacter: "〈",
                endingCharacter: "〉"
              })), _this161.root.push(new o.MathBase(e.children));
              return _this161;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.MathAngledBrackets = s;
        },
        4981: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathBeginningCharacter = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon45) {
            _inherits(o, _n$XmlAttributeCompon45);
            var _super172 = _createSuper(o);
            function o() {
              var _this162;
              _classCallCheck(this, o);
              _this162 = _super172.apply(this, arguments), _this162.xmlKeys = {
                character: "m:val"
              };
              return _this162;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent69) {
            _inherits(i, _n$XmlComponent69);
            var _super173 = _createSuper(i);
            function i(e) {
              var _this163;
              _classCallCheck(this, i);
              _this163 = _super173.call(this, "m:begChr"), _this163.root.push(new o({
                character: e
              }));
              return _this163;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.MathBeginningCharacter = i;
        },
        5664: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathBracketProperties = void 0;
          var n = r(2451),
            o = r(4981),
            i = r(6886);
          var s = /*#__PURE__*/function (_n$XmlComponent70) {
            _inherits(s, _n$XmlComponent70);
            var _super174 = _createSuper(s);
            function s(e) {
              var _this164;
              _classCallCheck(this, s);
              _this164 = _super174.call(this, "m:dPr"), e && (_this164.root.push(new o.MathBeginningCharacter(e.beginningCharacter)), _this164.root.push(new i.MathEndingCharacter(e.endingCharacter)));
              return _this164;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.MathBracketProperties = s;
        },
        6507: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathCurlyBrackets = void 0;
          var n = r(2451),
            o = r(4114),
            i = r(5664);
          var s = /*#__PURE__*/function (_n$XmlComponent71) {
            _inherits(s, _n$XmlComponent71);
            var _super175 = _createSuper(s);
            function s(e) {
              var _this165;
              _classCallCheck(this, s);
              _this165 = _super175.call(this, "m:d"), _this165.root.push(new i.MathBracketProperties({
                beginningCharacter: "{",
                endingCharacter: "}"
              })), _this165.root.push(new o.MathBase(e.children));
              return _this165;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.MathCurlyBrackets = s;
        },
        6886: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathEndingCharacter = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon46) {
            _inherits(o, _n$XmlAttributeCompon46);
            var _super176 = _createSuper(o);
            function o() {
              var _this166;
              _classCallCheck(this, o);
              _this166 = _super176.apply(this, arguments), _this166.xmlKeys = {
                character: "m:val"
              };
              return _this166;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent72) {
            _inherits(i, _n$XmlComponent72);
            var _super177 = _createSuper(i);
            function i(e) {
              var _this167;
              _classCallCheck(this, i);
              _this167 = _super177.call(this, "m:endChr"), _this167.root.push(new o({
                character: e
              }));
              return _this167;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.MathEndingCharacter = i;
        },
        6721: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathRoundBrackets = void 0;
          var n = r(2451),
            o = r(4114),
            i = r(5664);
          var s = /*#__PURE__*/function (_n$XmlComponent73) {
            _inherits(s, _n$XmlComponent73);
            var _super178 = _createSuper(s);
            function s(e) {
              var _this168;
              _classCallCheck(this, s);
              _this168 = _super178.call(this, "m:d"), _this168.root.push(new i.MathBracketProperties()), _this168.root.push(new o.MathBase(e.children));
              return _this168;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.MathRoundBrackets = s;
        },
        4063: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathSquareBrackets = void 0;
          var n = r(2451),
            o = r(4114),
            i = r(5664);
          var s = /*#__PURE__*/function (_n$XmlComponent74) {
            _inherits(s, _n$XmlComponent74);
            var _super179 = _createSuper(s);
            function s(e) {
              var _this169;
              _classCallCheck(this, s);
              _this169 = _super179.call(this, "m:d"), _this169.root.push(new i.MathBracketProperties({
                beginningCharacter: "[",
                endingCharacter: "]"
              })), _this169.root.push(new o.MathBase(e.children));
              return _this169;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.MathSquareBrackets = s;
        },
        1762: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(159), t), o(r(6014), t), o(r(2754), t);
        },
        6014: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathDenominator = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent75) {
            _inherits(o, _n$XmlComponent75);
            var _super180 = _createSuper(o);
            function o(e) {
              var _this170;
              _classCallCheck(this, o);
              _this170 = _super180.call(this, "m:den");
              var _iterator15 = _createForOfIteratorHelper(e),
                _step15;
              try {
                for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
                  var _t19 = _step15.value;
                  _this170.root.push(_t19);
                }
              } catch (err) {
                _iterator15.e(err);
              } finally {
                _iterator15.f();
              }
              return _this170;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.MathDenominator = o;
        },
        159: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathFraction = void 0;
          var n = r(2451),
            o = r(6014),
            i = r(2754);
          var s = /*#__PURE__*/function (_n$XmlComponent76) {
            _inherits(s, _n$XmlComponent76);
            var _super181 = _createSuper(s);
            function s(e) {
              var _this171;
              _classCallCheck(this, s);
              _this171 = _super181.call(this, "m:f"), _this171.root.push(new i.MathNumerator(e.numerator)), _this171.root.push(new o.MathDenominator(e.denominator));
              return _this171;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.MathFraction = s;
        },
        2754: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathNumerator = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent77) {
            _inherits(o, _n$XmlComponent77);
            var _super182 = _createSuper(o);
            function o(e) {
              var _this172;
              _classCallCheck(this, o);
              _this172 = _super182.call(this, "m:num");
              var _iterator16 = _createForOfIteratorHelper(e),
                _step16;
              try {
                for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
                  var _t20 = _step16.value;
                  _this172.root.push(_t20);
                }
              } catch (err) {
                _iterator16.e(err);
              } finally {
                _iterator16.f();
              }
              return _this172;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.MathNumerator = o;
        },
        8516: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(8058), t), o(r(6699), t), o(r(5881), t);
        },
        6699: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathFunctionName = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent78) {
            _inherits(o, _n$XmlComponent78);
            var _super183 = _createSuper(o);
            function o(e) {
              var _this173;
              _classCallCheck(this, o);
              _this173 = _super183.call(this, "m:fName");
              var _iterator17 = _createForOfIteratorHelper(e),
                _step17;
              try {
                for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
                  var _t21 = _step17.value;
                  _this173.root.push(_t21);
                }
              } catch (err) {
                _iterator17.e(err);
              } finally {
                _iterator17.f();
              }
              return _this173;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.MathFunctionName = o;
        },
        5881: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathFunctionProperties = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent79) {
            _inherits(o, _n$XmlComponent79);
            var _super184 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super184.call(this, "m:funcPr");
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.MathFunctionProperties = o;
        },
        8058: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathFunction = void 0;
          var n = r(2451),
            o = r(4114),
            i = r(6699),
            s = r(5881);
          var a = /*#__PURE__*/function (_n$XmlComponent80) {
            _inherits(a, _n$XmlComponent80);
            var _super185 = _createSuper(a);
            function a(e) {
              var _this174;
              _classCallCheck(this, a);
              _this174 = _super185.call(this, "m:func"), _this174.root.push(new s.MathFunctionProperties()), _this174.root.push(new i.MathFunctionName(e.name)), _this174.root.push(new o.MathBase(e.children));
              return _this174;
            }
            return _createClass(a);
          }(n.XmlComponent);
          t.MathFunction = a;
        },
        3723: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(9098), t), o(r(4127), t), o(r(1762), t), o(r(4114), t), o(r(7017), t), o(r(2071), t), o(r(1590), t), o(r(8516), t), o(r(454), t);
        },
        2071: function _(e, t) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.WORKAROUND4 = void 0, t.WORKAROUND4 = "";
        },
        4127: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathRun = void 0;
          var n = r(2451),
            o = r(787);
          var i = /*#__PURE__*/function (_n$XmlComponent81) {
            _inherits(i, _n$XmlComponent81);
            var _super186 = _createSuper(i);
            function i(e) {
              var _this175;
              _classCallCheck(this, i);
              _this175 = _super186.call(this, "m:r"), _this175.root.push(new o.MathText(e));
              return _this175;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.MathRun = i;
        },
        787: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathText = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent82) {
            _inherits(o, _n$XmlComponent82);
            var _super187 = _createSuper(o);
            function o(e) {
              var _this176;
              _classCallCheck(this, o);
              _this176 = _super187.call(this, "m:t"), _this176.root.push(e);
              return _this176;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.MathText = o;
        },
        9098: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Math = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent83) {
            _inherits(o, _n$XmlComponent83);
            var _super188 = _createSuper(o);
            function o(e) {
              var _this177;
              _classCallCheck(this, o);
              _this177 = _super188.call(this, "m:oMath");
              var _iterator18 = _createForOfIteratorHelper(e.children),
                _step18;
              try {
                for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
                  var _t22 = _step18.value;
                  _this177.root.push(_t22);
                }
              } catch (err) {
                _iterator18.e(err);
              } finally {
                _iterator18.f();
              }
              return _this177;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.Math = o;
        },
        4114: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(8910), t), o(r(8406), t), o(r(2981), t), o(r(8431), t), o(r(7817), t), o(r(1426), t), o(r(1427), t);
        },
        8910: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathAccentCharacter = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon47) {
            _inherits(o, _n$XmlAttributeCompon47);
            var _super189 = _createSuper(o);
            function o() {
              var _this178;
              _classCallCheck(this, o);
              _this178 = _super189.apply(this, arguments), _this178.xmlKeys = {
                accent: "m:val"
              };
              return _this178;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent84) {
            _inherits(i, _n$XmlComponent84);
            var _super190 = _createSuper(i);
            function i(e) {
              var _this179;
              _classCallCheck(this, i);
              _this179 = _super190.call(this, "m:chr"), _this179.root.push(new o({
                accent: e
              }));
              return _this179;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.MathAccentCharacter = i;
        },
        8406: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathBase = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent85) {
            _inherits(o, _n$XmlComponent85);
            var _super191 = _createSuper(o);
            function o(e) {
              var _this180;
              _classCallCheck(this, o);
              _this180 = _super191.call(this, "m:e");
              var _iterator19 = _createForOfIteratorHelper(e),
                _step19;
              try {
                for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
                  var _t23 = _step19.value;
                  _this180.root.push(_t23);
                }
              } catch (err) {
                _iterator19.e(err);
              } finally {
                _iterator19.f();
              }
              return _this180;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.MathBase = o;
        },
        2981: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathLimitLocation = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon48) {
            _inherits(o, _n$XmlAttributeCompon48);
            var _super192 = _createSuper(o);
            function o() {
              var _this181;
              _classCallCheck(this, o);
              _this181 = _super192.apply(this, arguments), _this181.xmlKeys = {
                value: "m:val"
              };
              return _this181;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent86) {
            _inherits(i, _n$XmlComponent86);
            var _super193 = _createSuper(i);
            function i() {
              var _this182;
              _classCallCheck(this, i);
              _this182 = _super193.call(this, "m:limLoc"), _this182.root.push(new o({
                value: "undOvr"
              }));
              return _this182;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.MathLimitLocation = i;
        },
        8431: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathNArayProperties = void 0;
          var n = r(2451),
            o = r(8910),
            i = r(2981),
            s = r(5449),
            a = r(1069);
          var u = /*#__PURE__*/function (_n$XmlComponent87) {
            _inherits(u, _n$XmlComponent87);
            var _super194 = _createSuper(u);
            function u(e, t, r) {
              var _this183;
              _classCallCheck(this, u);
              _this183 = _super194.call(this, "m:naryPr"), _this183.root.push(new o.MathAccentCharacter(e)), _this183.root.push(new i.MathLimitLocation()), t || _this183.root.push(new a.MathSuperScriptHide()), r || _this183.root.push(new s.MathSubScriptHide());
              return _this183;
            }
            return _createClass(u);
          }(n.XmlComponent);
          t.MathNArayProperties = u;
        },
        5449: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathSubScriptHide = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon49) {
            _inherits(o, _n$XmlAttributeCompon49);
            var _super195 = _createSuper(o);
            function o() {
              var _this184;
              _classCallCheck(this, o);
              _this184 = _super195.apply(this, arguments), _this184.xmlKeys = {
                hide: "m:val"
              };
              return _this184;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent88) {
            _inherits(i, _n$XmlComponent88);
            var _super196 = _createSuper(i);
            function i() {
              var _this185;
              _classCallCheck(this, i);
              _this185 = _super196.call(this, "m:subHide"), _this185.root.push(new o({
                hide: 1
              }));
              return _this185;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.MathSubScriptHide = i;
        },
        7817: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathSubScriptElement = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent89) {
            _inherits(o, _n$XmlComponent89);
            var _super197 = _createSuper(o);
            function o(e) {
              var _this186;
              _classCallCheck(this, o);
              _this186 = _super197.call(this, "m:sub");
              var _iterator20 = _createForOfIteratorHelper(e),
                _step20;
              try {
                for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
                  var _t24 = _step20.value;
                  _this186.root.push(_t24);
                }
              } catch (err) {
                _iterator20.e(err);
              } finally {
                _iterator20.f();
              }
              return _this186;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.MathSubScriptElement = o;
        },
        1426: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathSum = void 0;
          var n = r(2451),
            o = r(8406),
            i = r(8431),
            s = r(7817),
            a = r(1427);
          var u = /*#__PURE__*/function (_n$XmlComponent90) {
            _inherits(u, _n$XmlComponent90);
            var _super198 = _createSuper(u);
            function u(e) {
              var _this187;
              _classCallCheck(this, u);
              _this187 = _super198.call(this, "m:nary"), _this187.root.push(new i.MathNArayProperties("∑", !!e.superScript, !!e.subScript)), e.subScript && _this187.root.push(new s.MathSubScriptElement(e.subScript)), e.superScript && _this187.root.push(new a.MathSuperScriptElement(e.superScript)), _this187.root.push(new o.MathBase(e.children));
              return _this187;
            }
            return _createClass(u);
          }(n.XmlComponent);
          t.MathSum = u;
        },
        1069: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathSuperScriptHide = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon50) {
            _inherits(o, _n$XmlAttributeCompon50);
            var _super199 = _createSuper(o);
            function o() {
              var _this188;
              _classCallCheck(this, o);
              _this188 = _super199.apply(this, arguments), _this188.xmlKeys = {
                hide: "m:val"
              };
              return _this188;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent91) {
            _inherits(i, _n$XmlComponent91);
            var _super200 = _createSuper(i);
            function i() {
              var _this189;
              _classCallCheck(this, i);
              _this189 = _super200.call(this, "m:supHide"), _this189.root.push(new o({
                hide: 1
              }));
              return _this189;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.MathSuperScriptHide = i;
        },
        1427: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathSuperScriptElement = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent92) {
            _inherits(o, _n$XmlComponent92);
            var _super201 = _createSuper(o);
            function o(e) {
              var _this190;
              _classCallCheck(this, o);
              _this190 = _super201.call(this, "m:sup");
              var _iterator21 = _createForOfIteratorHelper(e),
                _step21;
              try {
                for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
                  var _t25 = _step21.value;
                  _this190.root.push(_t25);
                }
              } catch (err) {
                _iterator21.e(err);
              } finally {
                _iterator21.f();
              }
              return _this190;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.MathSuperScriptElement = o;
        },
        1590: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(1659), t), o(r(6391), t), o(r(8344), t);
        },
        3210: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathDegreeHide = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon51) {
            _inherits(o, _n$XmlAttributeCompon51);
            var _super202 = _createSuper(o);
            function o() {
              var _this191;
              _classCallCheck(this, o);
              _this191 = _super202.apply(this, arguments), _this191.xmlKeys = {
                hide: "m:val"
              };
              return _this191;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent93) {
            _inherits(i, _n$XmlComponent93);
            var _super203 = _createSuper(i);
            function i() {
              var _this192;
              _classCallCheck(this, i);
              _this192 = _super203.call(this, "m:degHide"), _this192.root.push(new o({
                hide: 1
              }));
              return _this192;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.MathDegreeHide = i;
        },
        1659: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathDegree = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent94) {
            _inherits(o, _n$XmlComponent94);
            var _super204 = _createSuper(o);
            function o(e) {
              var _this193;
              _classCallCheck(this, o);
              if (_this193 = _super204.call(this, "m:deg"), e) {
                var _iterator22 = _createForOfIteratorHelper(e),
                  _step22;
                try {
                  for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
                    var _t26 = _step22.value;
                    _this193.root.push(_t26);
                  }
                } catch (err) {
                  _iterator22.e(err);
                } finally {
                  _iterator22.f();
                }
              }
              return _possibleConstructorReturn(_this193);
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.MathDegree = o;
        },
        8344: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathRadicalProperties = void 0;
          var n = r(2451),
            o = r(3210);
          var i = /*#__PURE__*/function (_n$XmlComponent95) {
            _inherits(i, _n$XmlComponent95);
            var _super205 = _createSuper(i);
            function i(e) {
              var _this194;
              _classCallCheck(this, i);
              _this194 = _super205.call(this, "m:radPr"), e || _this194.root.push(new o.MathDegreeHide());
              return _this194;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.MathRadicalProperties = i;
        },
        6391: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathRadical = void 0;
          var n = r(2451),
            o = r(4114),
            i = r(1659),
            s = r(8344);
          var a = /*#__PURE__*/function (_n$XmlComponent96) {
            _inherits(a, _n$XmlComponent96);
            var _super206 = _createSuper(a);
            function a(e) {
              var _this195;
              _classCallCheck(this, a);
              _this195 = _super206.call(this, "m:rad"), _this195.root.push(new s.MathRadicalProperties(!!e.degree)), _this195.root.push(new i.MathDegree(e.degree)), _this195.root.push(new o.MathBase(e.children));
              return _this195;
            }
            return _createClass(a);
          }(n.XmlComponent);
          t.MathRadical = a;
        },
        7017: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(35), t), o(r(9680), t), o(r(573), t), o(r(6274), t);
        },
        6274: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(6977), t), o(r(3003), t);
        },
        3003: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathPreSubSuperScriptProperties = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent97) {
            _inherits(o, _n$XmlComponent97);
            var _super207 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super207.call(this, "m:sPrePr");
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.MathPreSubSuperScriptProperties = o;
        },
        6977: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathPreSubSuperScript = void 0;
          var n = r(2451),
            o = r(4114),
            i = r(3003);
          var s = /*#__PURE__*/function (_n$XmlComponent98) {
            _inherits(s, _n$XmlComponent98);
            var _super208 = _createSuper(s);
            function s(e) {
              var _this196;
              _classCallCheck(this, s);
              _this196 = _super208.call(this, "m:sPre"), _this196.root.push(new i.MathPreSubSuperScriptProperties()), _this196.root.push(new o.MathBase(e.children)), _this196.root.push(new o.MathSubScriptElement(e.subScript)), _this196.root.push(new o.MathSuperScriptElement(e.superScript));
              return _this196;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.MathPreSubSuperScript = s;
        },
        9680: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(8507), t), o(r(476), t);
        },
        476: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathSubScriptProperties = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent99) {
            _inherits(o, _n$XmlComponent99);
            var _super209 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super209.call(this, "m:sSubPr");
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.MathSubScriptProperties = o;
        },
        8507: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathSubScript = void 0;
          var n = r(2451),
            o = r(4114),
            i = r(476);
          var s = /*#__PURE__*/function (_n$XmlComponent100) {
            _inherits(s, _n$XmlComponent100);
            var _super210 = _createSuper(s);
            function s(e) {
              var _this197;
              _classCallCheck(this, s);
              _this197 = _super210.call(this, "m:sSub"), _this197.root.push(new i.MathSubScriptProperties()), _this197.root.push(new o.MathBase(e.children)), _this197.root.push(new o.MathSubScriptElement(e.subScript));
              return _this197;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.MathSubScript = s;
        },
        573: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(9442), t), o(r(7137), t);
        },
        7137: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathSubSuperScriptProperties = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent101) {
            _inherits(o, _n$XmlComponent101);
            var _super211 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super211.call(this, "m:sSubSupPr");
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.MathSubSuperScriptProperties = o;
        },
        9442: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathSubSuperScript = void 0;
          var n = r(2451),
            o = r(4114),
            i = r(7137);
          var s = /*#__PURE__*/function (_n$XmlComponent102) {
            _inherits(s, _n$XmlComponent102);
            var _super212 = _createSuper(s);
            function s(e) {
              var _this198;
              _classCallCheck(this, s);
              _this198 = _super212.call(this, "m:sSubSup"), _this198.root.push(new i.MathSubSuperScriptProperties()), _this198.root.push(new o.MathBase(e.children)), _this198.root.push(new o.MathSubScriptElement(e.subScript)), _this198.root.push(new o.MathSuperScriptElement(e.superScript));
              return _this198;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.MathSubSuperScript = s;
        },
        35: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(2901), t), o(r(4912), t);
        },
        4912: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathSuperScriptProperties = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent103) {
            _inherits(o, _n$XmlComponent103);
            var _super213 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super213.call(this, "m:sSupPr");
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.MathSuperScriptProperties = o;
        },
        2901: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.MathSuperScript = void 0;
          var n = r(2451),
            o = r(4114),
            i = r(4912);
          var s = /*#__PURE__*/function (_n$XmlComponent104) {
            _inherits(s, _n$XmlComponent104);
            var _super214 = _createSuper(s);
            function s(e) {
              var _this199;
              _classCallCheck(this, s);
              _this199 = _super214.call(this, "m:sSup"), _this199.root.push(new i.MathSuperScriptProperties()), _this199.root.push(new o.MathBase(e.children)), _this199.root.push(new o.MathSuperScriptElement(e.superScript));
              return _this199;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.MathSuperScript = s;
        },
        1859: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Paragraph = void 0;
          var n = r(5524),
            o = r(2451),
            i = r(9522),
            s = r(2805),
            a = r(3434),
            u = r(6902);
          var c = /*#__PURE__*/function (_o$XmlComponent27) {
            _inherits(c, _o$XmlComponent27);
            var _super215 = _createSuper(c);
            function c(e) {
              var _this200;
              _classCallCheck(this, c);
              if (_this200 = _super215.call(this, "w:p"), "string" == typeof e) return _possibleConstructorReturn(_this200, (_this200.properties = new a.ParagraphProperties({}), _this200.root.push(_this200.properties), _this200.root.push(new u.TextRun(e)), _assertThisInitialized(_this200)));
              if (_this200.properties = new a.ParagraphProperties(e), _this200.root.push(_this200.properties), e.text && _this200.root.push(new u.TextRun(e.text)), e.children) {
                var _iterator23 = _createForOfIteratorHelper(e.children),
                  _step23;
                try {
                  for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
                    var _t27 = _step23.value;
                    if (_t27 instanceof s.Bookmark) {
                      _this200.root.push(_t27.start);
                      var _iterator24 = _createForOfIteratorHelper(_t27.children),
                        _step24;
                      try {
                        for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
                          var _e16 = _step24.value;
                          _this200.root.push(_e16);
                        }
                      } catch (err) {
                        _iterator24.e(err);
                      } finally {
                        _iterator24.f();
                      }
                      _this200.root.push(_t27.end);
                    } else _this200.root.push(_t27);
                  }
                } catch (err) {
                  _iterator23.e(err);
                } finally {
                  _iterator23.f();
                }
              }
              return _possibleConstructorReturn(_this200);
            }
            _createClass(c, [{
              key: "prepForXml",
              value: function prepForXml(e) {
                var _iterator25 = _createForOfIteratorHelper(this.root),
                  _step25;
                try {
                  for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
                    var _t28 = _step25.value;
                    if (_t28 instanceof s.ExternalHyperlink) {
                      var _r10 = this.root.indexOf(_t28),
                        _o6 = new s.ConcreteHyperlink(_t28.options.children, (0, n.uniqueId)());
                      e.viewWrapper.Relationships.createRelationship(_o6.linkId, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", _t28.options.link, i.TargetModeType.EXTERNAL), this.root[_r10] = _o6;
                    }
                  }
                } catch (err) {
                  _iterator25.e(err);
                } finally {
                  _iterator25.f();
                }
                return _get(_getPrototypeOf(c.prototype), "prepForXml", this).call(this, e);
              }
            }, {
              key: "addRunToFront",
              value: function addRunToFront(e) {
                return this.root.splice(1, 0, e), this;
              }
            }]);
            return c;
          }(o.XmlComponent);
          t.Paragraph = c;
        },
        3434: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ParagraphProperties = void 0;
          var n = r(2451),
            o = r(7249),
            i = r(8613),
            s = r(5778),
            a = r(7942),
            u = r(9884),
            c = r(2639),
            l = r(4200),
            p = r(6923),
            h = r(317),
            d = r(3538),
            f = r(9889),
            m = r(2805);
          var g = /*#__PURE__*/function (_n$IgnoreIfEmptyXmlCo) {
            _inherits(g, _n$IgnoreIfEmptyXmlCo);
            var _super216 = _createSuper(g);
            function g(e) {
              var _this201;
              _classCallCheck(this, g);
              var t, r;
              if (_this201 = _super216.call(this, "w:pPr"), _this201.numberingReferences = [], !e) return _possibleConstructorReturn(_this201, _assertThisInitialized(_this201));
              if (e.heading && _this201.push(new p.Style(e.heading)), e.bullet && _this201.push(new p.Style("ListParagraph")), e.numbering && (e.style || e.heading || e.numbering.custom || _this201.push(new p.Style("ListParagraph"))), e.style && _this201.push(new p.Style(e.style)), void 0 !== e.keepNext && _this201.push(new n.OnOffElement("w:keepNext", e.keepNext)), void 0 !== e.keepLines && _this201.push(new n.OnOffElement("w:keepLines", e.keepLines)), e.pageBreakBefore && _this201.push(new u.PageBreakBefore()), e.frame && _this201.push(new f.FrameProperties(e.frame)), void 0 !== e.widowControl && _this201.push(new n.OnOffElement("w:widowControl", e.widowControl)), e.bullet && _this201.push(new d.NumberProperties(1, e.bullet.level)), e.numbering && (_this201.numberingReferences.push({
                reference: e.numbering.reference,
                instance: null !== (t = e.numbering.instance) && void 0 !== t ? t : 0
              }), _this201.push(new d.NumberProperties("".concat(e.numbering.reference, "-").concat(null !== (r = e.numbering.instance) && void 0 !== r ? r : 0), e.numbering.level))), e.border && _this201.push(new a.Border(e.border)), e.thematicBreak && _this201.push(new a.ThematicBreak()), e.shading && _this201.push(new i.Shading(e.shading)), e.rightTabStop && _this201.push(new h.TabStop(h.TabStopType.RIGHT, e.rightTabStop)), e.tabStops) {
                var _iterator26 = _createForOfIteratorHelper(e.tabStops),
                  _step26;
                try {
                  for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) {
                    var _t29 = _step26.value;
                    _this201.push(new h.TabStop(_t29.type, _t29.position, _t29.leader));
                  }
                } catch (err) {
                  _iterator26.e(err);
                } finally {
                  _iterator26.f();
                }
              }
              e.leftTabStop && _this201.push(new h.TabStop(h.TabStopType.LEFT, e.leftTabStop)), void 0 !== e.bidirectional && _this201.push(new n.OnOffElement("w:bidi", e.contextualSpacing)), e.spacing && _this201.push(new l.Spacing(e.spacing)), e.indent && _this201.push(new c.Indent(e.indent)), void 0 !== e.contextualSpacing && _this201.push(new n.OnOffElement("w:contextualSpacing", e.contextualSpacing)), e.alignment && _this201.push(new s.Alignment(e.alignment)), void 0 !== e.outlineLevel && _this201.push(new m.OutlineLevel(e.outlineLevel)), void 0 !== e.suppressLineNumbers && _this201.push(new n.OnOffElement("w:suppressLineNumbers", e.suppressLineNumbers));
              return _possibleConstructorReturn(_this201);
            }
            _createClass(g, [{
              key: "push",
              value: function push(e) {
                this.root.push(e);
              }
            }, {
              key: "prepForXml",
              value: function prepForXml(e) {
                if (e.viewWrapper instanceof o.DocumentWrapper) {
                  var _iterator27 = _createForOfIteratorHelper(this.numberingReferences),
                    _step27;
                  try {
                    for (_iterator27.s(); !(_step27 = _iterator27.n()).done;) {
                      var _t30 = _step27.value;
                      e.file.Numbering.createConcreteNumberingInstance(_t30.reference, _t30.instance);
                    }
                  } catch (err) {
                    _iterator27.e(err);
                  } finally {
                    _iterator27.f();
                  }
                }
                return _get(_getPrototypeOf(g.prototype), "prepForXml", this).call(this, e);
              }
            }]);
            return g;
          }(n.IgnoreIfEmptyXmlComponent);
          t.ParagraphProperties = g;
        },
        6724: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Break = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent105) {
            _inherits(o, _n$XmlComponent105);
            var _super217 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super217.call(this, "w:br");
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.Break = o;
        },
        3846: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.DotEmphasisMark = t.EmphasisMark = t.BaseEmphasisMark = t.EmphasisMarkType = void 0;
          var n = r(2451);
          var o;
          !function (e) {
            e.DOT = "dot";
          }(o = t.EmphasisMarkType || (t.EmphasisMarkType = {}));
          var i = /*#__PURE__*/function (_n$XmlComponent106) {
            _inherits(i, _n$XmlComponent106);
            var _super218 = _createSuper(i);
            function i(e) {
              var _this202;
              _classCallCheck(this, i);
              _this202 = _super218.call(this, "w:em"), _this202.root.push(new n.Attributes({
                val: e
              }));
              return _this202;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.BaseEmphasisMark = i, t.EmphasisMark = /*#__PURE__*/function (_i5) {
            _inherits(_class19, _i5);
            var _super219 = _createSuper(_class19);
            function _class19() {
              var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : o.DOT;
              _classCallCheck(this, _class19);
              return _super219.call(this, e);
            }
            return _createClass(_class19);
          }(i), t.DotEmphasisMark = /*#__PURE__*/function (_i6) {
            _inherits(_class20, _i6);
            var _super220 = _createSuper(_class20);
            function _class20() {
              _classCallCheck(this, _class20);
              return _super220.call(this, o.DOT);
            }
            return _createClass(_class20);
          }(i);
        },
        3178: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.End = t.Separate = t.Begin = void 0;
          var n = r(2451);
          var o;
          !function (e) {
            e.BEGIN = "begin", e.END = "end", e.SEPARATE = "separate";
          }(o || (o = {}));
          var i = /*#__PURE__*/function (_n$XmlAttributeCompon52) {
            _inherits(i, _n$XmlAttributeCompon52);
            var _super221 = _createSuper(i);
            function i() {
              var _this203;
              _classCallCheck(this, i);
              _this203 = _super221.apply(this, arguments), _this203.xmlKeys = {
                type: "w:fldCharType",
                dirty: "w:dirty"
              };
              return _this203;
            }
            return _createClass(i);
          }(n.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_n$XmlComponent107) {
            _inherits(s, _n$XmlComponent107);
            var _super222 = _createSuper(s);
            function s(e) {
              var _this204;
              _classCallCheck(this, s);
              _this204 = _super222.call(this, "w:fldChar"), _this204.root.push(new i({
                type: o.BEGIN,
                dirty: e
              }));
              return _this204;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.Begin = s;
          var a = /*#__PURE__*/function (_n$XmlComponent108) {
            _inherits(a, _n$XmlComponent108);
            var _super223 = _createSuper(a);
            function a(e) {
              var _this205;
              _classCallCheck(this, a);
              _this205 = _super223.call(this, "w:fldChar"), _this205.root.push(new i({
                type: o.SEPARATE,
                dirty: e
              }));
              return _this205;
            }
            return _createClass(a);
          }(n.XmlComponent);
          t.Separate = a;
          var u = /*#__PURE__*/function (_n$XmlComponent109) {
            _inherits(u, _n$XmlComponent109);
            var _super224 = _createSuper(u);
            function u(e) {
              var _this206;
              _classCallCheck(this, u);
              _this206 = _super224.call(this, "w:fldChar"), _this206.root.push(new i({
                type: o.END,
                dirty: e
              }));
              return _this206;
            }
            return _createClass(u);
          }(n.XmlComponent);
          t.End = u;
        },
        9588: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.HighlightComplexScript = t.Highlight = t.Color = t.CharacterSpacing = void 0;
          var n = r(459),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlComponent28) {
            _inherits(i, _o$XmlComponent28);
            var _super225 = _createSuper(i);
            function i(e) {
              var _this207;
              _classCallCheck(this, i);
              _this207 = _super225.call(this, "w:spacing"), _this207.root.push(new o.Attributes({
                val: (0, n.signedTwipsMeasureValue)(e)
              }));
              return _this207;
            }
            return _createClass(i);
          }(o.XmlComponent);
          t.CharacterSpacing = i;
          var s = /*#__PURE__*/function (_o$XmlComponent29) {
            _inherits(s, _o$XmlComponent29);
            var _super226 = _createSuper(s);
            function s(e) {
              var _this208;
              _classCallCheck(this, s);
              _this208 = _super226.call(this, "w:color"), _this208.root.push(new o.Attributes({
                val: (0, n.hexColorValue)(e)
              }));
              return _this208;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.Color = s;
          var a = /*#__PURE__*/function (_o$XmlComponent30) {
            _inherits(a, _o$XmlComponent30);
            var _super227 = _createSuper(a);
            function a(e) {
              var _this209;
              _classCallCheck(this, a);
              _this209 = _super227.call(this, "w:highlight"), _this209.root.push(new o.Attributes({
                val: e
              }));
              return _this209;
            }
            return _createClass(a);
          }(o.XmlComponent);
          t.Highlight = a;
          var u = /*#__PURE__*/function (_o$XmlComponent31) {
            _inherits(u, _o$XmlComponent31);
            var _super228 = _createSuper(u);
            function u(e) {
              var _this210;
              _classCallCheck(this, u);
              _this210 = _super228.call(this, "w:highlightCs"), _this210.root.push(new o.Attributes({
                val: e
              }));
              return _this210;
            }
            return _createClass(u);
          }(o.XmlComponent);
          t.HighlightComplexScript = u;
        },
        2413: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ImageRun = void 0;
          var n = r(5524),
            o = r(6876),
            i = r(6902);
          var s = /*#__PURE__*/function (_i$Run) {
            _inherits(s, _i$Run);
            var _super229 = _createSuper(s);
            function s(e) {
              var _this211;
              _classCallCheck(this, s);
              _this211 = _super229.call(this, {}), _this211.key = "".concat((0, n.uniqueId)(), ".png");
              var t = "string" == typeof e.data ? _this211.convertDataURIToBinary(e.data) : e.data;
              _this211.imageData = {
                stream: t,
                fileName: _this211.key,
                transformation: {
                  pixels: {
                    x: Math.round(e.transformation.width),
                    y: Math.round(e.transformation.height)
                  },
                  emus: {
                    x: Math.round(9525 * e.transformation.width),
                    y: Math.round(9525 * e.transformation.height)
                  },
                  flip: e.transformation.flip,
                  rotation: e.transformation.rotation ? 6e4 * e.transformation.rotation : void 0
                }
              };
              var r = new o.Drawing(_this211.imageData, {
                floating: e.floating
              });
              _this211.root.push(r);
              return _this211;
            }
            _createClass(s, [{
              key: "prepForXml",
              value: function prepForXml(e) {
                return e.file.Media.addImage(this.key, this.imageData), _get(_getPrototypeOf(s.prototype), "prepForXml", this).call(this, e);
              }
            }, {
              key: "convertDataURIToBinary",
              value: function convertDataURIToBinary(e) {
                var t = ";base64,",
                  n = e.indexOf(t) + t.length;
                return "function" == typeof atob ? new Uint8Array(atob(e.substring(n)).split("").map(function (e) {
                  return e.charCodeAt(0);
                })) : new (r(8764).Buffer)(e, "base64");
              }
            }]);
            return s;
          }(i.Run);
          t.ImageRun = s;
        },
        6902: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(2076), t), o(r(1972), t), o(r(2468), t), o(r(1877), t), o(r(2413), t), o(r(6149), t), o(r(6706), t), o(r(104), t), o(r(3846), t), o(r(6210), t), o(r(7803), t);
        },
        8503: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.NumberOfPagesSection = t.NumberOfPages = t.Page = void 0;
          var n = r(5321),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon18) {
            _inherits(i, _o$XmlAttributeCompon18);
            var _super230 = _createSuper(i);
            function i() {
              var _this212;
              _classCallCheck(this, i);
              _this212 = _super230.apply(this, arguments), _this212.xmlKeys = {
                space: "xml:space"
              };
              return _this212;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_o$XmlComponent32) {
            _inherits(s, _o$XmlComponent32);
            var _super231 = _createSuper(s);
            function s() {
              var _this213;
              _classCallCheck(this, s);
              _this213 = _super231.call(this, "w:instrText"), _this213.root.push(new i({
                space: n.SpaceType.PRESERVE
              })), _this213.root.push("PAGE");
              return _this213;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.Page = s;
          var a = /*#__PURE__*/function (_o$XmlComponent33) {
            _inherits(a, _o$XmlComponent33);
            var _super232 = _createSuper(a);
            function a() {
              var _this214;
              _classCallCheck(this, a);
              _this214 = _super232.call(this, "w:instrText"), _this214.root.push(new i({
                space: n.SpaceType.PRESERVE
              })), _this214.root.push("NUMPAGES");
              return _this214;
            }
            return _createClass(a);
          }(o.XmlComponent);
          t.NumberOfPages = a;
          var u = /*#__PURE__*/function (_o$XmlComponent34) {
            _inherits(u, _o$XmlComponent34);
            var _super233 = _createSuper(u);
            function u() {
              var _this215;
              _classCallCheck(this, u);
              _this215 = _super233.call(this, "w:instrText"), _this215.root.push(new i({
                space: n.SpaceType.PRESERVE
              })), _this215.root.push("SECTIONPAGES");
              return _this215;
            }
            return _createClass(u);
          }(o.XmlComponent);
          t.NumberOfPagesSection = u;
        },
        1972: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.RunProperties = void 0;
          var n = r(8613),
            o = r(2451),
            i = r(3846),
            s = r(9588),
            a = r(6149),
            u = r(2737),
            c = r(104);
          var l = /*#__PURE__*/function (_o$IgnoreIfEmptyXmlCo3) {
            _inherits(l, _o$IgnoreIfEmptyXmlCo3);
            var _super234 = _createSuper(l);
            function l(e) {
              var _this216;
              _classCallCheck(this, l);
              var t, r;
              if (_this216 = _super234.call(this, "w:rPr"), !e) return _possibleConstructorReturn(_this216);
              void 0 !== e.bold && _this216.push(new o.OnOffElement("w:b", e.bold)), (void 0 === e.boldComplexScript && void 0 !== e.bold || e.boldComplexScript) && _this216.push(new o.OnOffElement("w:bCs", null !== (t = e.boldComplexScript) && void 0 !== t ? t : e.bold)), void 0 !== e.italics && _this216.push(new o.OnOffElement("w:i", e.italics)), (void 0 === e.italicsComplexScript && void 0 !== e.italics || e.italicsComplexScript) && _this216.push(new o.OnOffElement("w:iCs", null !== (r = e.italicsComplexScript) && void 0 !== r ? r : e.italics)), e.underline && _this216.push(new c.Underline(e.underline.type, e.underline.color)), e.emphasisMark && _this216.push(new i.EmphasisMark(e.emphasisMark.type)), e.color && _this216.push(new s.Color(e.color)), void 0 !== e.size && _this216.push(new o.HpsMeasureElement("w:sz", e.size));
              var _l = void 0 === e.sizeComplexScript || !0 === e.sizeComplexScript ? e.size : e.sizeComplexScript;
              _l && _this216.push(new o.HpsMeasureElement("w:szCs", _l)), void 0 !== e.rightToLeft && _this216.push(new o.OnOffElement("w:rtl", e.rightToLeft)), void 0 !== e.smallCaps ? _this216.push(new o.OnOffElement("w:smallCaps", e.smallCaps)) : void 0 !== e.allCaps && _this216.push(new o.OnOffElement("w:caps", e.allCaps)), void 0 !== e.strike && _this216.push(new o.OnOffElement("w:strike", e.strike)), void 0 !== e.doubleStrike && _this216.push(new o.OnOffElement("w:dstrike", e.doubleStrike)), e.subScript && _this216.push(new u.SubScript()), e.superScript && _this216.push(new u.SuperScript()), e.style && _this216.push(new o.StringValueElement("w:rStyle", e.style)), e.font && ("string" == typeof e.font ? _this216.push(new a.RunFonts(e.font)) : "name" in e.font ? _this216.push(new a.RunFonts(e.font.name, e.font.hint)) : _this216.push(new a.RunFonts(e.font))), e.highlight && _this216.push(new s.Highlight(e.highlight));
              var p = void 0 === e.highlightComplexScript || !0 === e.highlightComplexScript ? e.highlight : e.highlightComplexScript;
              p && _this216.push(new s.HighlightComplexScript(p)), e.characterSpacing && _this216.push(new s.CharacterSpacing(e.characterSpacing)), void 0 !== e.emboss && _this216.push(new o.OnOffElement("w:emboss", e.emboss)), void 0 !== e.imprint && _this216.push(new o.OnOffElement("w:imprint", e.imprint)), e.shading && _this216.push(new n.Shading(e.shading));
              return _possibleConstructorReturn(_this216);
            }
            _createClass(l, [{
              key: "push",
              value: function push(e) {
                this.root.push(e);
              }
            }]);
            return l;
          }(o.IgnoreIfEmptyXmlComponent);
          t.RunProperties = l;
        },
        1689: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Symbol = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon53) {
            _inherits(o, _n$XmlAttributeCompon53);
            var _super235 = _createSuper(o);
            function o() {
              var _this217;
              _classCallCheck(this, o);
              _this217 = _super235.apply(this, arguments), _this217.xmlKeys = {
                char: "w:char",
                symbolfont: "w:font"
              };
              return _this217;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent110) {
            _inherits(i, _n$XmlComponent110);
            var _super236 = _createSuper(i);
            function i() {
              var _this218;
              var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
              var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Wingdings";
              _classCallCheck(this, i);
              _this218 = _super236.call(this, "w:sym"), _this218.root.push(new o({
                char: e,
                symbolfont: t
              }));
              return _this218;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.Symbol = i;
        },
        9291: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Text = void 0;
          var n = r(5321),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon19) {
            _inherits(i, _o$XmlAttributeCompon19);
            var _super237 = _createSuper(i);
            function i() {
              var _this219;
              _classCallCheck(this, i);
              _this219 = _super237.apply(this, arguments), _this219.xmlKeys = {
                space: "xml:space"
              };
              return _this219;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_o$XmlComponent35) {
            _inherits(s, _o$XmlComponent35);
            var _super238 = _createSuper(s);
            function s(e) {
              var _this220;
              _classCallCheck(this, s);
              _this220 = _super238.call(this, "w:t"), _this220.root.push(new i({
                space: n.SpaceType.PRESERVE
              })), _this220.root.push(e);
              return _this220;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.Text = s;
        },
        6149: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.RunFonts = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon54) {
            _inherits(o, _n$XmlAttributeCompon54);
            var _super239 = _createSuper(o);
            function o() {
              var _this221;
              _classCallCheck(this, o);
              _this221 = _super239.apply(this, arguments), _this221.xmlKeys = {
                ascii: "w:ascii",
                cs: "w:cs",
                eastAsia: "w:eastAsia",
                hAnsi: "w:hAnsi",
                hint: "w:hint"
              };
              return _this221;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent111) {
            _inherits(i, _n$XmlComponent111);
            var _super240 = _createSuper(i);
            function i(e, t) {
              var _this222;
              _classCallCheck(this, i);
              if (_this222 = _super240.call(this, "w:rFonts"), "string" == typeof e) {
                var _r11 = e;
                _this222.root.push(new o({
                  ascii: _r11,
                  cs: _r11,
                  eastAsia: _r11,
                  hAnsi: _r11,
                  hint: t
                }));
              } else {
                var _t31 = e;
                _this222.root.push(new o(_t31));
              }
              return _possibleConstructorReturn(_this222);
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.RunFonts = i;
        },
        2076: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Run = t.PageNumber = void 0;
          var n = r(2451),
            o = r(6724),
            i = r(3178),
            s = r(8503),
            a = r(1972),
            u = r(9291);
          var c;
          !function (e) {
            e.CURRENT = "CURRENT", e.TOTAL_PAGES = "TOTAL_PAGES", e.TOTAL_PAGES_IN_SECTION = "TOTAL_PAGES_IN_SECTION";
          }(c = t.PageNumber || (t.PageNumber = {}));
          var l = /*#__PURE__*/function (_n$XmlComponent112) {
            _inherits(l, _n$XmlComponent112);
            var _super241 = _createSuper(l);
            function l(e) {
              var _this223;
              _classCallCheck(this, l);
              if (_this223 = _super241.call(this, "w:r"), _this223.properties = new a.RunProperties(e), _this223.root.push(_this223.properties), e.break) for (var _t32 = 0; _t32 < e.break; _t32++) _this223.root.push(new o.Break());
              if (e.children) {
                var _iterator28 = _createForOfIteratorHelper(e.children),
                  _step28;
                try {
                  for (_iterator28.s(); !(_step28 = _iterator28.n()).done;) {
                    var _t33 = _step28.value;
                    if ("string" != typeof _t33) _this223.root.push(_t33);else switch (_t33) {
                      case c.CURRENT:
                        _this223.root.push(new i.Begin()), _this223.root.push(new s.Page()), _this223.root.push(new i.Separate()), _this223.root.push(new i.End());
                        break;
                      case c.TOTAL_PAGES:
                        _this223.root.push(new i.Begin()), _this223.root.push(new s.NumberOfPages()), _this223.root.push(new i.Separate()), _this223.root.push(new i.End());
                        break;
                      case c.TOTAL_PAGES_IN_SECTION:
                        _this223.root.push(new i.Begin()), _this223.root.push(new s.NumberOfPagesSection()), _this223.root.push(new i.Separate()), _this223.root.push(new i.End());
                        break;
                      default:
                        _this223.root.push(new u.Text(_t33));
                    }
                  }
                } catch (err) {
                  _iterator28.e(err);
                } finally {
                  _iterator28.f();
                }
              } else e.text && _this223.root.push(new u.Text(e.text));
              return _possibleConstructorReturn(_this223);
            }
            return _createClass(l);
          }(n.XmlComponent);
          t.Run = l;
        },
        2737: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.SubScript = t.SuperScript = t.VerticalAlign = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent113) {
            _inherits(o, _n$XmlComponent113);
            var _super242 = _createSuper(o);
            function o(e) {
              var _this224;
              _classCallCheck(this, o);
              _this224 = _super242.call(this, "w:vertAlign"), _this224.root.push(new n.Attributes({
                val: e
              }));
              return _this224;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.VerticalAlign = o, t.SuperScript = /*#__PURE__*/function (_o7) {
            _inherits(_class21, _o7);
            var _super243 = _createSuper(_class21);
            function _class21() {
              _classCallCheck(this, _class21);
              return _super243.call(this, "superscript");
            }
            return _createClass(_class21);
          }(o), t.SubScript = /*#__PURE__*/function (_o8) {
            _inherits(_class22, _o8);
            var _super244 = _createSuper(_class22);
            function _class22() {
              _classCallCheck(this, _class22);
              return _super244.call(this, "subscript");
            }
            return _createClass(_class22);
          }(o);
        },
        2393: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.SequentialIdentifierInstruction = void 0;
          var n = r(5321),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon20) {
            _inherits(i, _o$XmlAttributeCompon20);
            var _super245 = _createSuper(i);
            function i() {
              var _this225;
              _classCallCheck(this, i);
              _this225 = _super245.apply(this, arguments), _this225.xmlKeys = {
                space: "xml:space"
              };
              return _this225;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_o$XmlComponent36) {
            _inherits(s, _o$XmlComponent36);
            var _super246 = _createSuper(s);
            function s(e) {
              var _this226;
              _classCallCheck(this, s);
              _this226 = _super246.call(this, "w:instrText"), _this226.root.push(new i({
                space: n.SpaceType.PRESERVE
              })), _this226.root.push("SEQ ".concat(e));
              return _this226;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.SequentialIdentifierInstruction = s;
        },
        6706: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.SequentialIdentifier = void 0;
          var n = r(6902),
            o = r(3178),
            i = r(2393);
          var s = /*#__PURE__*/function (_n$Run5) {
            _inherits(s, _n$Run5);
            var _super247 = _createSuper(s);
            function s(e) {
              var _this227;
              _classCallCheck(this, s);
              _this227 = _super247.call(this, {}), _this227.root.push(new o.Begin(!0)), _this227.root.push(new i.SequentialIdentifierInstruction(e)), _this227.root.push(new o.Separate()), _this227.root.push(new o.End());
              return _this227;
            }
            return _createClass(s);
          }(n.Run);
          t.SequentialIdentifier = s;
        },
        7803: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.SimpleMailMergeField = t.SimpleField = void 0;
          var n = r(2451),
            o = r(2468);
          var i = /*#__PURE__*/function (_n$XmlAttributeCompon55) {
            _inherits(i, _n$XmlAttributeCompon55);
            var _super248 = _createSuper(i);
            function i() {
              var _this228;
              _classCallCheck(this, i);
              _this228 = _super248.apply(this, arguments), _this228.xmlKeys = {
                instr: "w:instr"
              };
              return _this228;
            }
            return _createClass(i);
          }(n.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_n$XmlComponent114) {
            _inherits(s, _n$XmlComponent114);
            var _super249 = _createSuper(s);
            function s(e, t) {
              var _this229;
              _classCallCheck(this, s);
              _this229 = _super249.call(this, "w:fldSimple"), _this229.root.push(new i({
                instr: e
              })), void 0 !== t && _this229.root.push(new o.TextRun(t));
              return _this229;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.SimpleField = s, t.SimpleMailMergeField = /*#__PURE__*/function (_s8) {
            _inherits(_class23, _s8);
            var _super250 = _createSuper(_class23);
            function _class23(e) {
              _classCallCheck(this, _class23);
              return _super250.call(this, " MERGEFIELD ".concat(e, " "), "\xAB".concat(e, "\xBB"));
            }
            return _createClass(_class23);
          }(s);
        },
        1877: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.SymbolRun = void 0;
          var n = r(2076),
            o = r(1689);
          var i = /*#__PURE__*/function (_n$Run6) {
            _inherits(i, _n$Run6);
            var _super251 = _createSuper(i);
            function i(e) {
              var _this230;
              _classCallCheck(this, i);
              if ("string" == typeof e) return _possibleConstructorReturn(_this230, (_this230 = _super251.call(this, {}), void _this230.root.push(new o.Symbol(e))));
              _this230 = _super251.call(this, e), _this230.root.push(new o.Symbol(e.char, e.symbolfont));
              return _possibleConstructorReturn(_this230);
            }
            return _createClass(i);
          }(n.Run);
          t.SymbolRun = i;
        },
        6210: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Tab = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent115) {
            _inherits(o, _n$XmlComponent115);
            var _super252 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super252.call(this, "w:tab");
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.Tab = o;
        },
        2468: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TextRun = void 0;
          var n = r(2076),
            o = r(9291);
          var i = /*#__PURE__*/function (_n$Run7) {
            _inherits(i, _n$Run7);
            var _super253 = _createSuper(i);
            function i(e) {
              var _this231;
              _classCallCheck(this, i);
              if ("string" == typeof e) return _possibleConstructorReturn(_this231, (_this231 = _super253.call(this, {}), _this231.root.push(new o.Text(e)), _assertThisInitialized(_this231)));
              return _this231 = _super253.call(this, e);
            }
            return _createClass(i);
          }(n.Run);
          t.TextRun = i;
        },
        104: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Underline = t.UnderlineType = void 0;
          var n = r(459),
            o = r(2451);
          var i;
          !function (e) {
            e.SINGLE = "single", e.WORDS = "words", e.DOUBLE = "double", e.THICK = "thick", e.DOTTED = "dotted", e.DOTTEDHEAVY = "dottedHeavy", e.DASH = "dash", e.DASHEDHEAVY = "dashedHeavy", e.DASHLONG = "dashLong", e.DASHLONGHEAVY = "dashLongHeavy", e.DOTDASH = "dotDash", e.DASHDOTHEAVY = "dashDotHeavy", e.DOTDOTDASH = "dotDotDash", e.DASHDOTDOTHEAVY = "dashDotDotHeavy", e.WAVE = "wave", e.WAVYHEAVY = "wavyHeavy", e.WAVYDOUBLE = "wavyDouble";
          }(i = t.UnderlineType || (t.UnderlineType = {}));
          var s = /*#__PURE__*/function (_o$XmlComponent37) {
            _inherits(s, _o$XmlComponent37);
            var _super254 = _createSuper(s);
            function s() {
              var _this232;
              var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : i.SINGLE;
              var t = arguments.length > 1 ? arguments[1] : undefined;
              _classCallCheck(this, s);
              _this232 = _super254.call(this, "w:u"), _this232.root.push(new o.Attributes({
                val: e,
                color: void 0 === t ? void 0 : (0, n.hexColorValue)(t)
              }));
              return _this232;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.Underline = s;
        },
        282: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.RelationshipsAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon56) {
            _inherits(o, _n$XmlAttributeCompon56);
            var _super255 = _createSuper(o);
            function o() {
              var _this233;
              _classCallCheck(this, o);
              _this233 = _super255.apply(this, arguments), _this233.xmlKeys = {
                xmlns: "xmlns"
              };
              return _this233;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.RelationshipsAttributes = o;
        },
        7224: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(3561), t);
        },
        9464: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.RelationshipAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon57) {
            _inherits(o, _n$XmlAttributeCompon57);
            var _super256 = _createSuper(o);
            function o() {
              var _this234;
              _classCallCheck(this, o);
              _this234 = _super256.apply(this, arguments), _this234.xmlKeys = {
                id: "Id",
                type: "Type",
                target: "Target",
                targetMode: "TargetMode"
              };
              return _this234;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.RelationshipAttributes = o;
        },
        9522: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Relationship = t.TargetModeType = void 0;
          var n = r(2451),
            o = r(9464);
          (t.TargetModeType || (t.TargetModeType = {})).EXTERNAL = "External";
          var i = /*#__PURE__*/function (_n$XmlComponent116) {
            _inherits(i, _n$XmlComponent116);
            var _super257 = _createSuper(i);
            function i(e, t, r, n) {
              var _this235;
              _classCallCheck(this, i);
              _this235 = _super257.call(this, "Relationship"), _this235.root.push(new o.RelationshipAttributes({
                id: e,
                type: t,
                target: r,
                targetMode: n
              }));
              return _this235;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.Relationship = i;
        },
        3561: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Relationships = void 0;
          var n = r(2451),
            o = r(282),
            i = r(9522);
          var s = /*#__PURE__*/function (_n$XmlComponent117) {
            _inherits(s, _n$XmlComponent117);
            var _super258 = _createSuper(s);
            function s() {
              var _this236;
              _classCallCheck(this, s);
              _this236 = _super258.call(this, "Relationships"), _this236.root.push(new o.RelationshipsAttributes({
                xmlns: "http://schemas.openxmlformats.org/package/2006/relationships"
              }));
              return _this236;
            }
            _createClass(s, [{
              key: "addRelationship",
              value: function addRelationship(e) {
                this.root.push(e);
              }
            }, {
              key: "createRelationship",
              value: function createRelationship(e, t, r, n) {
                var o = new i.Relationship("rId".concat(e), t, r, n);
                return this.addRelationship(o), o;
              }
            }, {
              key: "RelationshipCount",
              get: function get() {
                return this.root.length - 1;
              }
            }]);
            return s;
          }(n.XmlComponent);
          t.Relationships = s;
        },
        5192: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.CompatibilitySetting = t.CompatibilitySettingAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon58) {
            _inherits(o, _n$XmlAttributeCompon58);
            var _super259 = _createSuper(o);
            function o() {
              var _this237;
              _classCallCheck(this, o);
              _this237 = _super259.apply(this, arguments), _this237.xmlKeys = {
                version: "w:val",
                name: "w:name",
                uri: "w:uri"
              };
              return _this237;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.CompatibilitySettingAttributes = o;
          var i = /*#__PURE__*/function (_n$XmlComponent118) {
            _inherits(i, _n$XmlComponent118);
            var _super260 = _createSuper(i);
            function i(e) {
              var _this238;
              _classCallCheck(this, i);
              _this238 = _super260.call(this, "w:compatSetting"), _this238.root.push(new o({
                version: e,
                uri: "http://schemas.microsoft.com/office/word",
                name: "compatibilityMode"
              }));
              return _this238;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.CompatibilitySetting = i;
        },
        2201: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Compatibility = void 0;
          var n = r(2451),
            o = r(5192);
          var i = /*#__PURE__*/function (_n$XmlComponent119) {
            _inherits(i, _n$XmlComponent119);
            var _super261 = _createSuper(i);
            function i(e) {
              var _this239;
              _classCallCheck(this, i);
              _this239 = _super261.call(this, "w:compat"), void 0 !== e.doNotExpandShiftReturn && _this239.root.push(new n.OnOffElement("w:doNotExpandShiftReturn", e.doNotExpandShiftReturn)), e.version && _this239.root.push(new o.CompatibilitySetting(e.version));
              return _this239;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.Compatibility = i;
        },
        9694: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(4110), t);
        },
        4110: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Settings = t.SettingsAttributes = void 0;
          var n = r(2451),
            o = r(2201);
          var i = /*#__PURE__*/function (_n$XmlAttributeCompon59) {
            _inherits(i, _n$XmlAttributeCompon59);
            var _super262 = _createSuper(i);
            function i() {
              var _this240;
              _classCallCheck(this, i);
              _this240 = _super262.apply(this, arguments), _this240.xmlKeys = {
                wpc: "xmlns:wpc",
                mc: "xmlns:mc",
                o: "xmlns:o",
                r: "xmlns:r",
                m: "xmlns:m",
                v: "xmlns:v",
                wp14: "xmlns:wp14",
                wp: "xmlns:wp",
                w10: "xmlns:w10",
                w: "xmlns:w",
                w14: "xmlns:w14",
                w15: "xmlns:w15",
                wpg: "xmlns:wpg",
                wpi: "xmlns:wpi",
                wne: "xmlns:wne",
                wps: "xmlns:wps",
                Ignorable: "mc:Ignorable"
              };
              return _this240;
            }
            return _createClass(i);
          }(n.XmlAttributeComponent);
          t.SettingsAttributes = i;
          var s = /*#__PURE__*/function (_n$XmlComponent120) {
            _inherits(s, _n$XmlComponent120);
            var _super263 = _createSuper(s);
            function s(e) {
              var _this241;
              _classCallCheck(this, s);
              _this241 = _super263.call(this, "w:settings"), _this241.root.push(new i({
                wpc: "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas",
                mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
                o: "urn:schemas-microsoft-com:office:office",
                r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
                m: "http://schemas.openxmlformats.org/officeDocument/2006/math",
                v: "urn:schemas-microsoft-com:vml",
                wp14: "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
                wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
                w10: "urn:schemas-microsoft-com:office:word",
                w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
                w14: "http://schemas.microsoft.com/office/word/2010/wordml",
                w15: "http://schemas.microsoft.com/office/word/2012/wordml",
                wpg: "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
                wpi: "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
                wne: "http://schemas.microsoft.com/office/word/2006/wordml",
                wps: "http://schemas.microsoft.com/office/word/2010/wordprocessingShape",
                Ignorable: "w14 w15 wp14"
              })), _this241.root.push(new n.OnOffElement("w:displayBackgroundShape", !0)), void 0 !== e.trackRevisions && _this241.root.push(new n.OnOffElement("w:trackRevisions", e.trackRevisions)), void 0 !== e.evenAndOddHeaders && _this241.root.push(new n.OnOffElement("w:evenAndOddHeaders", e.evenAndOddHeaders)), void 0 !== e.updateFields && _this241.root.push(new n.OnOffElement("w:updateFields", e.updateFields)), _this241.root.push(new o.Compatibility({
                version: e.compatabilityModeVersion || 15
              }));
              return _this241;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.Settings = s;
        },
        8613: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(4533), t);
        },
        4533: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ShadingType = t.Shading = void 0;
          var n = r(2451),
            o = r(459);
          var i = /*#__PURE__*/function (_n$XmlAttributeCompon60) {
            _inherits(i, _n$XmlAttributeCompon60);
            var _super264 = _createSuper(i);
            function i() {
              var _this242;
              _classCallCheck(this, i);
              _this242 = _super264.apply(this, arguments), _this242.xmlKeys = {
                fill: "w:fill",
                color: "w:color",
                type: "w:val"
              };
              return _this242;
            }
            return _createClass(i);
          }(n.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_n$XmlComponent121) {
            _inherits(s, _n$XmlComponent121);
            var _super265 = _createSuper(s);
            function s(_ref10) {
              var _this243;
              var e = _ref10.fill,
                t = _ref10.color,
                r = _ref10.type;
              _classCallCheck(this, s);
              _this243 = _super265.call(this, "w:shd"), _this243.root.push(new i({
                fill: void 0 === e ? void 0 : (0, o.hexColorValue)(e),
                color: void 0 === t ? void 0 : (0, o.hexColorValue)(t),
                type: r
              }));
              return _this243;
            }
            return _createClass(s);
          }(n.XmlComponent);
          var a;
          t.Shading = s, (a = t.ShadingType || (t.ShadingType = {})).CLEAR = "clear", a.DIAGONAL_CROSS = "diagCross", a.DIAGONAL_STRIPE = "diagStripe", a.HORIZONTAL_CROSS = "horzCross", a.HORIZONTAL_STRIPE = "horzStripe", a.NIL = "nil", a.PERCENT_5 = "pct5", a.PERCENT_10 = "pct10", a.PERCENT_12 = "pct12", a.PERCENT_15 = "pct15", a.PERCENT_20 = "pct20", a.PERCENT_25 = "pct25", a.PERCENT_30 = "pct30", a.PERCENT_35 = "pct35", a.PERCENT_37 = "pct37", a.PERCENT_40 = "pct40", a.PERCENT_45 = "pct45", a.PERCENT_50 = "pct50", a.PERCENT_55 = "pct55", a.PERCENT_60 = "pct60", a.PERCENT_62 = "pct62", a.PERCENT_65 = "pct65", a.PERCENT_70 = "pct70", a.PERCENT_75 = "pct75", a.PERCENT_80 = "pct80", a.PERCENT_85 = "pct85", a.PERCENT_87 = "pct87", a.PERCENT_90 = "pct90", a.PERCENT_95 = "pct95", a.REVERSE_DIAGONAL_STRIPE = "reverseDiagStripe", a.SOLID = "solid", a.THIN_DIAGONAL_CROSS = "thinDiagCross", a.THIN_DIAGONAL_STRIPE = "thinDiagStripe", a.THIN_HORIZONTAL_CROSS = "thinHorzCross", a.THIN_REVERSE_DIAGONAL_STRIPE = "thinReverseDiagStripe", a.THIN_VERTICAL_STRIPE = "thinVertStripe", a.VERTICAL_STRIPE = "vertStripe";
        },
        1420: function _(e, t) {
          "use strict";

          var r, n;
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.VerticalPositionAlign = t.HorizontalPositionAlign = void 0, (n = t.HorizontalPositionAlign || (t.HorizontalPositionAlign = {})).CENTER = "center", n.INSIDE = "inside", n.LEFT = "left", n.OUTSIDE = "outside", n.RIGHT = "right", (r = t.VerticalPositionAlign || (t.VerticalPositionAlign = {})).BOTTOM = "bottom", r.CENTER = "center", r.INSIDE = "inside", r.OUTSIDE = "outside", r.TOP = "top";
        },
        2969: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(1420), t), o(r(7321), t);
        },
        7321: function _(e, t) {
          "use strict";

          var r;
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.NumberFormat = void 0, (r = t.NumberFormat || (t.NumberFormat = {})).DECIMAL = "decimal", r.UPPER_ROMAN = "upperRoman", r.LOWER_ROMAN = "lowerRoman", r.UPPER_LETTER = "upperLetter", r.LOWER_LETTER = "lowerLetter", r.ORDINAL = "ordinal", r.CARDINAL_TEXT = "cardinalText", r.ORDINAL_TEXT = "ordinalText", r.HEX = "hex", r.CHICAGO = "chicago", r.IDEOGRAPH_DIGITAL = "ideographDigital", r.JAPANESE_COUNTING = "japaneseCounting", r.AIUEO = "aiueo", r.IROHA = "iroha", r.DECIMAL_FULL_WIDTH = "decimalFullWidth", r.DECIMAL_HALF_WIDTH = "decimalHalfWidth", r.JAPANESE_LEGAL = "japaneseLegal", r.JAPANESE_DIGITAL_TEN_THOUSAND = "japaneseDigitalTenThousand", r.DECIMAL_ENCLOSED_CIRCLE = "decimalEnclosedCircle", r.DECIMAL_FULL_WIDTH_2 = "decimalFullWidth2", r.AIUEO_FULL_WIDTH = "aiueoFullWidth", r.IROHA_FULL_WIDTH = "irohaFullWidth", r.DECIMAL_ZERO = "decimalZero", r.BULLET = "bullet", r.GANADA = "ganada", r.CHOSUNG = "chosung", r.DECIMAL_ENCLOSED_FULL_STOP = "decimalEnclosedFullstop", r.DECIMAL_ENCLOSED_PAREN = "decimalEnclosedParen", r.DECIMAL_ENCLOSED_CIRCLE_CHINESE = "decimalEnclosedCircleChinese", r.IDEOGRAPH_ENCLOSED_CIRCLE = "ideographEnclosedCircle", r.IDEOGRAPH_TRADITIONAL = "ideographTraditional", r.IDEOGRAPH_ZODIAC = "ideographZodiac", r.IDEOGRAPH_ZODIAC_TRADITIONAL = "ideographZodiacTraditional", r.TAIWANESE_COUNTING = "taiwaneseCounting", r.IDEOGRAPH_LEGAL_TRADITIONAL = "ideographLegalTraditional", r.TAIWANESE_COUNTING_THOUSAND = "taiwaneseCountingThousand", r.TAIWANESE_DIGITAL = "taiwaneseDigital", r.CHINESE_COUNTING = "chineseCounting", r.CHINESE_LEGAL_SIMPLIFIED = "chineseLegalSimplified", r.CHINESE_COUNTING_TEN_THOUSAND = "chineseCountingThousand", r.KOREAN_DIGITAL = "koreanDigital", r.KOREAN_COUNTING = "koreanCounting", r.KOREAN_LEGAL = "koreanLegal", r.KOREAN_DIGITAL_2 = "koreanDigital2", r.VIETNAMESE_COUNTING = "vietnameseCounting", r.RUSSIAN_LOWER = "russianLower", r.RUSSIAN_UPPER = "russianUpper", r.NONE = "none", r.NUMBER_IN_DASH = "numberInDash", r.HEBREW_1 = "hebrew1", r.HEBREW_2 = "hebrew2", r.ARABIC_ALPHA = "arabicAlpha", r.ARABIC_ABJAD = "arabicAbjad", r.HINDI_VOWELS = "hindiVowels", r.HINDI_CONSONANTS = "hindiConsonants", r.HINDI_NUMBERS = "hindiNumbers", r.HINDI_COUNTING = "hindiCounting", r.THAI_LETTERS = "thaiLetters", r.THAI_NUMBERS = "thaiNumbers", r.THAI_COUNTING = "thaiCounting", r.BAHT_TEXT = "bahtText", r.DOLLAR_TEXT = "dollarText";
        },
        5321: function _(e, t) {
          "use strict";

          var r;
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.SpaceType = void 0, (r = t.SpaceType || (t.SpaceType = {})).DEFAULT = "default", r.PRESERVE = "preserve";
        },
        5452: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.DocumentDefaults = void 0;
          var n = r(2451),
            o = r(7697),
            i = r(5011);
          var s = /*#__PURE__*/function (_n$XmlComponent122) {
            _inherits(s, _n$XmlComponent122);
            var _super266 = _createSuper(s);
            function s(e) {
              var _this244;
              _classCallCheck(this, s);
              _this244 = _super266.call(this, "w:docDefaults"), _this244.runPropertiesDefaults = new i.RunPropertiesDefaults(e.run), _this244.paragraphPropertiesDefaults = new o.ParagraphPropertiesDefaults(e.paragraph), _this244.root.push(_this244.runPropertiesDefaults), _this244.root.push(_this244.paragraphPropertiesDefaults);
              return _this244;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.DocumentDefaults = s;
        },
        6441: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(7697), t), o(r(5011), t), o(r(5452), t);
        },
        7697: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ParagraphPropertiesDefaults = void 0;
          var n = r(3434),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlComponent38) {
            _inherits(i, _o$XmlComponent38);
            var _super267 = _createSuper(i);
            function i(e) {
              var _this245;
              _classCallCheck(this, i);
              _this245 = _super267.call(this, "w:pPrDefault"), _this245.root.push(new n.ParagraphProperties(e));
              return _this245;
            }
            return _createClass(i);
          }(o.XmlComponent);
          t.ParagraphPropertiesDefaults = i;
        },
        5011: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.RunPropertiesDefaults = void 0;
          var n = r(1972),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlComponent39) {
            _inherits(i, _o$XmlComponent39);
            var _super268 = _createSuper(i);
            function i(e) {
              var _this246;
              _classCallCheck(this, i);
              _this246 = _super268.call(this, "w:rPrDefault"), _this246.root.push(new n.RunProperties(e));
              return _this246;
            }
            return _createClass(i);
          }(o.XmlComponent);
          t.RunPropertiesDefaults = i;
        },
        5258: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ExternalStylesFactory = void 0;
          var n = r(2451),
            o = r(7888),
            i = r(5703);
          t.ExternalStylesFactory = /*#__PURE__*/function () {
            function _class24() {
              _classCallCheck(this, _class24);
            }
            _createClass(_class24, [{
              key: "newInstance",
              value: function newInstance(e) {
                var t = (0, o.xml2js)(e, {
                  compact: !1
                });
                var r;
                var _iterator29 = _createForOfIteratorHelper(t.elements || []),
                  _step29;
                try {
                  for (_iterator29.s(); !(_step29 = _iterator29.n()).done;) {
                    var _e17 = _step29.value;
                    "w:styles" === _e17.name && (r = _e17);
                  }
                } catch (err) {
                  _iterator29.e(err);
                } finally {
                  _iterator29.f();
                }
                if (void 0 === r) throw new Error("can not find styles element");
                var s = r.elements || [];
                return new i.Styles({
                  initialStyles: new n.ImportedRootElementAttributes(r.attributes),
                  importedStyles: s.map(function (e) {
                    return (0, n.convertToXmlComponent)(e);
                  })
                });
              }
            }]);
            return _class24;
          }();
        },
        2202: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.DefaultStylesFactory = void 0;
          var n = r(7627),
            o = r(6441),
            i = r(6631);
          t.DefaultStylesFactory = /*#__PURE__*/function () {
            function _class25() {
              _classCallCheck(this, _class25);
            }
            _createClass(_class25, [{
              key: "newInstance",
              value: function newInstance() {
                var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var t;
                return {
                  initialStyles: new n.DocumentAttributes({
                    mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
                    r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
                    w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
                    w14: "http://schemas.microsoft.com/office/word/2010/wordml",
                    w15: "http://schemas.microsoft.com/office/word/2012/wordml",
                    Ignorable: "w14 w15"
                  }),
                  importedStyles: [new o.DocumentDefaults(null !== (t = e.document) && void 0 !== t ? t : {}), new i.TitleStyle(Object.assign({
                    run: {
                      size: 56
                    }
                  }, e.title)), new i.Heading1Style(Object.assign({
                    run: {
                      color: "2E74B5",
                      size: 32
                    }
                  }, e.heading1)), new i.Heading2Style(Object.assign({
                    run: {
                      color: "2E74B5",
                      size: 26
                    }
                  }, e.heading2)), new i.Heading3Style(Object.assign({
                    run: {
                      color: "1F4D78",
                      size: 24
                    }
                  }, e.heading3)), new i.Heading4Style(Object.assign({
                    run: {
                      color: "2E74B5",
                      italics: !0
                    }
                  }, e.heading4)), new i.Heading5Style(Object.assign({
                    run: {
                      color: "2E74B5"
                    }
                  }, e.heading5)), new i.Heading6Style(Object.assign({
                    run: {
                      color: "1F4D78"
                    }
                  }, e.heading6)), new i.StrongStyle(Object.assign({
                    run: {
                      bold: !0
                    }
                  }, e.strong)), new i.ListParagraph(e.listParagraph || {}), new i.HyperlinkStyle(e.hyperlink || {}), new i.FootnoteReferenceStyle(e.footnoteReference || {}), new i.FootnoteText(e.footnoteText || {}), new i.FootnoteTextChar(e.footnoteTextChar || {})]
                };
              }
            }]);
            return _class25;
          }();
        },
        5703: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(6785), t), o(r(8056), t), o(r(4232), t), o(r(6441), t);
        },
        8056: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.StyleForCharacter = void 0;
          var n = r(1972),
            o = r(3176);
          var i = /*#__PURE__*/function (_o$Style) {
            _inherits(i, _o$Style);
            var _super269 = _createSuper(i);
            function i(e) {
              var _this247;
              _classCallCheck(this, i);
              _this247 = _super269.call(this, {
                type: "character",
                styleId: e.id
              }, Object.assign({
                uiPriority: 99,
                unhideWhenUsed: !0
              }, e)), _this247.runProperties = new n.RunProperties(e.run), _this247.root.push(_this247.runProperties);
              return _this247;
            }
            return _createClass(i);
          }(o.Style);
          t.StyleForCharacter = i;
        },
        2063: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.RsId = t.TableProperties = t.UiPriority = t.Name = void 0;
          var n = r(459),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon21) {
            _inherits(i, _o$XmlAttributeCompon21);
            var _super270 = _createSuper(i);
            function i() {
              var _this248;
              _classCallCheck(this, i);
              _this248 = _super270.apply(this, arguments), _this248.xmlKeys = {
                val: "w:val"
              };
              return _this248;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_o$XmlComponent40) {
            _inherits(s, _o$XmlComponent40);
            var _super271 = _createSuper(s);
            function s(e) {
              var _this249;
              _classCallCheck(this, s);
              _this249 = _super271.call(this, "w:name"), _this249.root.push(new i({
                val: e
              }));
              return _this249;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.Name = s;
          var a = /*#__PURE__*/function (_o$XmlComponent41) {
            _inherits(a, _o$XmlComponent41);
            var _super272 = _createSuper(a);
            function a(e) {
              var _this250;
              _classCallCheck(this, a);
              _this250 = _super272.call(this, "w:uiPriority"), _this250.root.push(new i({
                val: (0, n.decimalNumber)(e)
              }));
              return _this250;
            }
            return _createClass(a);
          }(o.XmlComponent);
          t.UiPriority = a;
          var u = /*#__PURE__*/function (_o$XmlComponent42) {
            _inherits(u, _o$XmlComponent42);
            var _super273 = _createSuper(u);
            function u() {
              _classCallCheck(this, u);
              return _super273.apply(this, arguments);
            }
            return _createClass(u);
          }(o.XmlComponent);
          t.TableProperties = u;
          var c = /*#__PURE__*/function (_o$XmlComponent43) {
            _inherits(c, _o$XmlComponent43);
            var _super274 = _createSuper(c);
            function c() {
              _classCallCheck(this, c);
              return _super274.apply(this, arguments);
            }
            return _createClass(c);
          }(o.XmlComponent);
          t.RsId = c;
        },
        1401: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.HyperlinkStyle = t.FootnoteTextChar = t.FootnoteReferenceStyle = t.FootnoteText = t.ListParagraph = t.StrongStyle = t.Heading6Style = t.Heading5Style = t.Heading4Style = t.Heading3Style = t.Heading2Style = t.Heading1Style = t.TitleStyle = t.HeadingStyle = void 0;
          var n = r(104),
            o = r(4827),
            i = r(8056),
            s = r(4232);
          var a = /*#__PURE__*/function (_s$StyleForParagraph) {
            _inherits(a, _s$StyleForParagraph);
            var _super275 = _createSuper(a);
            function a(e) {
              _classCallCheck(this, a);
              return _super275.call(this, Object.assign(Object.assign({}, e), {
                basedOn: "Normal",
                next: "Normal",
                quickFormat: !0
              }));
            }
            return _createClass(a);
          }(s.StyleForParagraph);
          t.HeadingStyle = a, t.TitleStyle = /*#__PURE__*/function (_a4) {
            _inherits(_class26, _a4);
            var _super276 = _createSuper(_class26);
            function _class26(e) {
              _classCallCheck(this, _class26);
              return _super276.call(this, Object.assign(Object.assign({}, e), {
                id: "Title",
                name: "Title"
              }));
            }
            return _createClass(_class26);
          }(a), t.Heading1Style = /*#__PURE__*/function (_a5) {
            _inherits(_class27, _a5);
            var _super277 = _createSuper(_class27);
            function _class27(e) {
              _classCallCheck(this, _class27);
              return _super277.call(this, Object.assign(Object.assign({}, e), {
                id: "Heading1",
                name: "Heading 1"
              }));
            }
            return _createClass(_class27);
          }(a), t.Heading2Style = /*#__PURE__*/function (_a6) {
            _inherits(_class28, _a6);
            var _super278 = _createSuper(_class28);
            function _class28(e) {
              _classCallCheck(this, _class28);
              return _super278.call(this, Object.assign(Object.assign({}, e), {
                id: "Heading2",
                name: "Heading 2"
              }));
            }
            return _createClass(_class28);
          }(a), t.Heading3Style = /*#__PURE__*/function (_a7) {
            _inherits(_class29, _a7);
            var _super279 = _createSuper(_class29);
            function _class29(e) {
              _classCallCheck(this, _class29);
              return _super279.call(this, Object.assign(Object.assign({}, e), {
                id: "Heading3",
                name: "Heading 3"
              }));
            }
            return _createClass(_class29);
          }(a), t.Heading4Style = /*#__PURE__*/function (_a8) {
            _inherits(_class30, _a8);
            var _super280 = _createSuper(_class30);
            function _class30(e) {
              _classCallCheck(this, _class30);
              return _super280.call(this, Object.assign(Object.assign({}, e), {
                id: "Heading4",
                name: "Heading 4"
              }));
            }
            return _createClass(_class30);
          }(a), t.Heading5Style = /*#__PURE__*/function (_a9) {
            _inherits(_class31, _a9);
            var _super281 = _createSuper(_class31);
            function _class31(e) {
              _classCallCheck(this, _class31);
              return _super281.call(this, Object.assign(Object.assign({}, e), {
                id: "Heading5",
                name: "Heading 5"
              }));
            }
            return _createClass(_class31);
          }(a), t.Heading6Style = /*#__PURE__*/function (_a10) {
            _inherits(_class32, _a10);
            var _super282 = _createSuper(_class32);
            function _class32(e) {
              _classCallCheck(this, _class32);
              return _super282.call(this, Object.assign(Object.assign({}, e), {
                id: "Heading6",
                name: "Heading 6"
              }));
            }
            return _createClass(_class32);
          }(a), t.StrongStyle = /*#__PURE__*/function (_a11) {
            _inherits(_class33, _a11);
            var _super283 = _createSuper(_class33);
            function _class33(e) {
              _classCallCheck(this, _class33);
              return _super283.call(this, Object.assign(Object.assign({}, e), {
                id: "Strong",
                name: "Strong"
              }));
            }
            return _createClass(_class33);
          }(a);
          var u = /*#__PURE__*/function (_s$StyleForParagraph2) {
            _inherits(u, _s$StyleForParagraph2);
            var _super284 = _createSuper(u);
            function u(e) {
              _classCallCheck(this, u);
              return _super284.call(this, Object.assign(Object.assign({}, e), {
                id: "ListParagraph",
                name: "List Paragraph",
                basedOn: "Normal",
                quickFormat: !0
              }));
            }
            return _createClass(u);
          }(s.StyleForParagraph);
          t.ListParagraph = u;
          var c = /*#__PURE__*/function (_s$StyleForParagraph3) {
            _inherits(c, _s$StyleForParagraph3);
            var _super285 = _createSuper(c);
            function c(e) {
              _classCallCheck(this, c);
              return _super285.call(this, Object.assign(Object.assign({}, e), {
                id: "FootnoteText",
                name: "footnote text",
                link: "FootnoteTextChar",
                basedOn: "Normal",
                uiPriority: 99,
                semiHidden: !0,
                unhideWhenUsed: !0,
                paragraph: {
                  spacing: {
                    after: 0,
                    line: 240,
                    lineRule: o.LineRuleType.AUTO
                  }
                },
                run: {
                  size: 20
                }
              }));
            }
            return _createClass(c);
          }(s.StyleForParagraph);
          t.FootnoteText = c;
          var l = /*#__PURE__*/function (_i$StyleForCharacter) {
            _inherits(l, _i$StyleForCharacter);
            var _super286 = _createSuper(l);
            function l(e) {
              _classCallCheck(this, l);
              return _super286.call(this, Object.assign(Object.assign({}, e), {
                id: "FootnoteReference",
                name: "footnote reference",
                basedOn: "DefaultParagraphFont",
                semiHidden: !0,
                run: {
                  superScript: !0
                }
              }));
            }
            return _createClass(l);
          }(i.StyleForCharacter);
          t.FootnoteReferenceStyle = l;
          var p = /*#__PURE__*/function (_i$StyleForCharacter2) {
            _inherits(p, _i$StyleForCharacter2);
            var _super287 = _createSuper(p);
            function p(e) {
              _classCallCheck(this, p);
              return _super287.call(this, Object.assign(Object.assign({}, e), {
                id: "FootnoteTextChar",
                name: "Footnote Text Char",
                basedOn: "DefaultParagraphFont",
                link: "FootnoteText",
                semiHidden: !0,
                run: {
                  size: 20
                }
              }));
            }
            return _createClass(p);
          }(i.StyleForCharacter);
          t.FootnoteTextChar = p;
          var h = /*#__PURE__*/function (_i$StyleForCharacter3) {
            _inherits(h, _i$StyleForCharacter3);
            var _super288 = _createSuper(h);
            function h(e) {
              _classCallCheck(this, h);
              return _super288.call(this, Object.assign(Object.assign({}, e), {
                id: "Hyperlink",
                name: "Hyperlink",
                basedOn: "DefaultParagraphFont",
                run: {
                  color: "0563C1",
                  underline: {
                    type: n.UnderlineType.SINGLE
                  }
                }
              }));
            }
            return _createClass(h);
          }(i.StyleForCharacter);
          t.HyperlinkStyle = h;
        },
        6631: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(3176), t), o(r(4232), t), o(r(8056), t), o(r(1401), t);
        },
        4232: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.StyleForParagraph = void 0;
          var n = r(4827),
            o = r(1972),
            i = r(3176);
          var s = /*#__PURE__*/function (_i$Style) {
            _inherits(s, _i$Style);
            var _super289 = _createSuper(s);
            function s(e) {
              var _this251;
              _classCallCheck(this, s);
              _this251 = _super289.call(this, {
                type: "paragraph",
                styleId: e.id
              }, e), _this251.paragraphProperties = new n.ParagraphProperties(e.paragraph), _this251.runProperties = new o.RunProperties(e.run), _this251.root.push(_this251.paragraphProperties), _this251.root.push(_this251.runProperties);
              return _this251;
            }
            return _createClass(s);
          }(i.Style);
          t.StyleForParagraph = s;
        },
        3176: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Style = void 0;
          var n = r(2451),
            o = r(2063);
          var i = /*#__PURE__*/function (_n$XmlAttributeCompon61) {
            _inherits(i, _n$XmlAttributeCompon61);
            var _super290 = _createSuper(i);
            function i() {
              var _this252;
              _classCallCheck(this, i);
              _this252 = _super290.apply(this, arguments), _this252.xmlKeys = {
                type: "w:type",
                styleId: "w:styleId",
                default: "w:default",
                customStyle: "w:customStyle"
              };
              return _this252;
            }
            return _createClass(i);
          }(n.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_n$XmlComponent123) {
            _inherits(s, _n$XmlComponent123);
            var _super291 = _createSuper(s);
            function s(e, t) {
              var _this253;
              _classCallCheck(this, s);
              _this253 = _super291.call(this, "w:style"), _this253.root.push(new i(e)), t.name && _this253.root.push(new o.Name(t.name)), t.basedOn && _this253.root.push(new n.StringValueElement("w:basedOn", t.basedOn)), t.next && _this253.root.push(new n.StringValueElement("w:next", t.next)), t.link && _this253.root.push(new n.StringValueElement("w:link", t.link)), void 0 !== t.uiPriority && _this253.root.push(new o.UiPriority(t.uiPriority)), void 0 !== t.semiHidden && _this253.root.push(new n.OnOffElement("w:semiHidden", t.semiHidden)), void 0 !== t.unhideWhenUsed && _this253.root.push(new n.OnOffElement("w:unhideWhenUsed", t.unhideWhenUsed)), void 0 !== t.quickFormat && _this253.root.push(new n.OnOffElement("w:qFormat", t.quickFormat));
              return _this253;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.Style = s;
        },
        6785: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Styles = void 0;
          var n = r(2451),
            o = r(6631);
          var i = /*#__PURE__*/function (_n$XmlComponent124) {
            _inherits(i, _n$XmlComponent124);
            var _super292 = _createSuper(i);
            function i(e) {
              var _this254;
              _classCallCheck(this, i);
              if (_this254 = _super292.call(this, "w:styles"), e.initialStyles && _this254.root.push(e.initialStyles), e.importedStyles) {
                var _iterator30 = _createForOfIteratorHelper(e.importedStyles),
                  _step30;
                try {
                  for (_iterator30.s(); !(_step30 = _iterator30.n()).done;) {
                    var _t34 = _step30.value;
                    _this254.root.push(_t34);
                  }
                } catch (err) {
                  _iterator30.e(err);
                } finally {
                  _iterator30.f();
                }
              }
              if (e.paragraphStyles) {
                var _iterator31 = _createForOfIteratorHelper(e.paragraphStyles),
                  _step31;
                try {
                  for (_iterator31.s(); !(_step31 = _iterator31.n()).done;) {
                    var _t35 = _step31.value;
                    _this254.root.push(new o.StyleForParagraph(_t35));
                  }
                } catch (err) {
                  _iterator31.e(err);
                } finally {
                  _iterator31.f();
                }
              }
              if (e.characterStyles) {
                var _iterator32 = _createForOfIteratorHelper(e.characterStyles),
                  _step32;
                try {
                  for (_iterator32.s(); !(_step32 = _iterator32.n()).done;) {
                    var _t36 = _step32.value;
                    _this254.root.push(new o.StyleForCharacter(_t36));
                  }
                } catch (err) {
                  _iterator32.e(err);
                } finally {
                  _iterator32.f();
                }
              }
              return _possibleConstructorReturn(_this254);
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.Styles = i;
        },
        7823: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Alias = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon62) {
            _inherits(o, _n$XmlAttributeCompon62);
            var _super293 = _createSuper(o);
            function o() {
              var _this255;
              _classCallCheck(this, o);
              _this255 = _super293.apply(this, arguments), _this255.xmlKeys = {
                alias: "w:val"
              };
              return _this255;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          var i = /*#__PURE__*/function (_n$XmlComponent125) {
            _inherits(i, _n$XmlComponent125);
            var _super294 = _createSuper(i);
            function i(e) {
              var _this256;
              _classCallCheck(this, i);
              _this256 = _super294.call(this, "w:alias"), _this256.root.push(new o({
                alias: e
              }));
              return _this256;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.Alias = i;
        },
        1233: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.FieldInstruction = void 0;
          var n = r(5321),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon22) {
            _inherits(i, _o$XmlAttributeCompon22);
            var _super295 = _createSuper(i);
            function i() {
              var _this257;
              _classCallCheck(this, i);
              _this257 = _super295.apply(this, arguments), _this257.xmlKeys = {
                space: "xml:space"
              };
              return _this257;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_o$XmlComponent44) {
            _inherits(s, _o$XmlComponent44);
            var _super296 = _createSuper(s);
            function s() {
              var _this258;
              var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
              _classCallCheck(this, s);
              _this258 = _super296.call(this, "w:instrText"), _this258.properties = e, _this258.root.push(new i({
                space: n.SpaceType.PRESERVE
              }));
              var t = "TOC";
              _this258.properties.captionLabel && (t = "".concat(t, " \\a \"").concat(_this258.properties.captionLabel, "\"")), _this258.properties.entriesFromBookmark && (t = "".concat(t, " \\b \"").concat(_this258.properties.entriesFromBookmark, "\"")), _this258.properties.captionLabelIncludingNumbers && (t = "".concat(t, " \\c \"").concat(_this258.properties.captionLabelIncludingNumbers, "\"")), _this258.properties.sequenceAndPageNumbersSeparator && (t = "".concat(t, " \\d \"").concat(_this258.properties.sequenceAndPageNumbersSeparator, "\"")), _this258.properties.tcFieldIdentifier && (t = "".concat(t, " \\f \"").concat(_this258.properties.tcFieldIdentifier, "\"")), _this258.properties.hyperlink && (t = "".concat(t, " \\h")), _this258.properties.tcFieldLevelRange && (t = "".concat(t, " \\l \"").concat(_this258.properties.tcFieldLevelRange, "\"")), _this258.properties.pageNumbersEntryLevelsRange && (t = "".concat(t, " \\n \"").concat(_this258.properties.pageNumbersEntryLevelsRange, "\"")), _this258.properties.headingStyleRange && (t = "".concat(t, " \\o \"").concat(_this258.properties.headingStyleRange, "\"")), _this258.properties.entryAndPageNumberSeparator && (t = "".concat(t, " \\p \"").concat(_this258.properties.entryAndPageNumberSeparator, "\"")), _this258.properties.seqFieldIdentifierForPrefix && (t = "".concat(t, " \\s \"").concat(_this258.properties.seqFieldIdentifierForPrefix, "\"")), _this258.properties.stylesWithLevels && _this258.properties.stylesWithLevels.length && (t = "".concat(t, " \\t \"").concat(_this258.properties.stylesWithLevels.map(function (e) {
                return "".concat(e.styleName, ",").concat(e.level);
              }).join(","), "\"")), _this258.properties.useAppliedParagraphOutlineLevel && (t = "".concat(t, " \\u")), _this258.properties.preserveTabInEntries && (t = "".concat(t, " \\w")), _this258.properties.preserveNewLineInEntries && (t = "".concat(t, " \\x")), _this258.properties.hideTabAndPageNumbersInWebView && (t = "".concat(t, " \\z")), _this258.root.push(t);
              return _this258;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.FieldInstruction = s;
        },
        5205: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(5080), t), o(r(1072), t);
        },
        1844: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.StructuredDocumentTagContent = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent126) {
            _inherits(o, _n$XmlComponent126);
            var _super297 = _createSuper(o);
            function o() {
              _classCallCheck(this, o);
              return _super297.call(this, "w:sdtContent");
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.StructuredDocumentTagContent = o;
        },
        6191: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.StructuredDocumentTagProperties = void 0;
          var n = r(2451),
            o = r(7823);
          var i = /*#__PURE__*/function (_n$XmlComponent127) {
            _inherits(i, _n$XmlComponent127);
            var _super298 = _createSuper(i);
            function i(e) {
              var _this259;
              _classCallCheck(this, i);
              _this259 = _super298.call(this, "w:sdtPr"), _this259.root.push(new o.Alias(e));
              return _this259;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.StructuredDocumentTagProperties = i;
        },
        1072: function _(e, t) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.StyleLevel = void 0, t.StyleLevel = /*#__PURE__*/function () {
            function _class34(e, t) {
              _classCallCheck(this, _class34);
              this.styleName = e, this.level = t;
            }
            return _createClass(_class34);
          }();
        },
        5080: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TableOfContents = void 0;
          var n = r(4827),
            o = r(6902),
            i = r(3178),
            s = r(2451),
            a = r(1233),
            u = r(1844),
            c = r(6191);
          var l = /*#__PURE__*/function (_s$XmlComponent) {
            _inherits(l, _s$XmlComponent);
            var _super299 = _createSuper(l);
            function l() {
              var _this260;
              var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Table of Contents";
              var t = arguments.length > 1 ? arguments[1] : undefined;
              _classCallCheck(this, l);
              _this260 = _super299.call(this, "w:sdt"), _this260.root.push(new c.StructuredDocumentTagProperties(e));
              var r = new u.StructuredDocumentTagContent(),
                s = new n.Paragraph({
                  children: [new o.Run({
                    children: [new i.Begin(!0), new a.FieldInstruction(t), new i.Separate()]
                  })]
                });
              r.addChildElement(s);
              var _l2 = new n.Paragraph({
                children: [new o.Run({
                  children: [new i.End()]
                })]
              });
              r.addChildElement(_l2), _this260.root.push(r);
              return _this260;
            }
            return _createClass(l);
          }(s.XmlComponent);
          t.TableOfContents = l;
        },
        5541: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.GridCol = t.TableGrid = void 0;
          var n = r(459),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlComponent45) {
            _inherits(i, _o$XmlComponent45);
            var _super300 = _createSuper(i);
            function i(e) {
              var _this261;
              _classCallCheck(this, i);
              _this261 = _super300.call(this, "w:tblGrid");
              var _iterator33 = _createForOfIteratorHelper(e),
                _step33;
              try {
                for (_iterator33.s(); !(_step33 = _iterator33.n()).done;) {
                  var _t37 = _step33.value;
                  _this261.root.push(new a(_t37));
                }
              } catch (err) {
                _iterator33.e(err);
              } finally {
                _iterator33.f();
              }
              return _this261;
            }
            return _createClass(i);
          }(o.XmlComponent);
          t.TableGrid = i;
          var s = /*#__PURE__*/function (_o$XmlAttributeCompon23) {
            _inherits(s, _o$XmlAttributeCompon23);
            var _super301 = _createSuper(s);
            function s() {
              var _this262;
              _classCallCheck(this, s);
              _this262 = _super301.apply(this, arguments), _this262.xmlKeys = {
                w: "w:w"
              };
              return _this262;
            }
            return _createClass(s);
          }(o.XmlAttributeComponent);
          var a = /*#__PURE__*/function (_o$XmlComponent46) {
            _inherits(a, _o$XmlComponent46);
            var _super302 = _createSuper(a);
            function a(e) {
              var _this263;
              _classCallCheck(this, a);
              _this263 = _super302.call(this, "w:gridCol"), void 0 !== e && _this263.root.push(new s({
                w: (0, n.twipsMeasureValue)(e)
              }));
              return _this263;
            }
            return _createClass(a);
          }(o.XmlComponent);
          t.GridCol = a;
        },
        5: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(4113), t), o(r(204), t), o(r(704), t), o(r(9003), t), o(r(5295), t);
        },
        204: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(7203), t), o(r(3282), t);
        },
        3282: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TDirection = t.TextDirection = t.VerticalMerge = t.VerticalMergeType = t.GridSpan = t.TableCellBorders = void 0;
          var n = r(5328),
            o = r(459),
            i = r(2451);
          var s = /*#__PURE__*/function (_i$IgnoreIfEmptyXmlCo) {
            _inherits(s, _i$IgnoreIfEmptyXmlCo);
            var _super303 = _createSuper(s);
            function s(e) {
              var _this264;
              _classCallCheck(this, s);
              _this264 = _super303.call(this, "w:tcBorders"), e.top && _this264.root.push(new n.BorderElement("w:top", e.top)), e.start && _this264.root.push(new n.BorderElement("w:start", e.start)), e.left && _this264.root.push(new n.BorderElement("w:left", e.left)), e.bottom && _this264.root.push(new n.BorderElement("w:bottom", e.bottom)), e.end && _this264.root.push(new n.BorderElement("w:end", e.end)), e.right && _this264.root.push(new n.BorderElement("w:right", e.right));
              return _this264;
            }
            return _createClass(s);
          }(i.IgnoreIfEmptyXmlComponent);
          t.TableCellBorders = s;
          var a = /*#__PURE__*/function (_i$XmlAttributeCompon) {
            _inherits(a, _i$XmlAttributeCompon);
            var _super304 = _createSuper(a);
            function a() {
              var _this265;
              _classCallCheck(this, a);
              _this265 = _super304.apply(this, arguments), _this265.xmlKeys = {
                val: "w:val"
              };
              return _this265;
            }
            return _createClass(a);
          }(i.XmlAttributeComponent);
          var u = /*#__PURE__*/function (_i$XmlComponent2) {
            _inherits(u, _i$XmlComponent2);
            var _super305 = _createSuper(u);
            function u(e) {
              var _this266;
              _classCallCheck(this, u);
              _this266 = _super305.call(this, "w:gridSpan"), _this266.root.push(new a({
                val: (0, o.decimalNumber)(e)
              }));
              return _this266;
            }
            return _createClass(u);
          }(i.XmlComponent);
          var c, l;
          t.GridSpan = u, (c = t.VerticalMergeType || (t.VerticalMergeType = {})).CONTINUE = "continue", c.RESTART = "restart";
          var p = /*#__PURE__*/function (_i$XmlAttributeCompon2) {
            _inherits(p, _i$XmlAttributeCompon2);
            var _super306 = _createSuper(p);
            function p() {
              var _this267;
              _classCallCheck(this, p);
              _this267 = _super306.apply(this, arguments), _this267.xmlKeys = {
                val: "w:val"
              };
              return _this267;
            }
            return _createClass(p);
          }(i.XmlAttributeComponent);
          var h = /*#__PURE__*/function (_i$XmlComponent3) {
            _inherits(h, _i$XmlComponent3);
            var _super307 = _createSuper(h);
            function h(e) {
              var _this268;
              _classCallCheck(this, h);
              _this268 = _super307.call(this, "w:vMerge"), _this268.root.push(new p({
                val: e
              }));
              return _this268;
            }
            return _createClass(h);
          }(i.XmlComponent);
          t.VerticalMerge = h, (l = t.TextDirection || (t.TextDirection = {})).BOTTOM_TO_TOP_LEFT_TO_RIGHT = "btLr", l.LEFT_TO_RIGHT_TOP_TO_BOTTOM = "lrTb", l.TOP_TO_BOTTOM_RIGHT_TO_LEFT = "tbRl";
          var d = /*#__PURE__*/function (_i$XmlAttributeCompon3) {
            _inherits(d, _i$XmlAttributeCompon3);
            var _super308 = _createSuper(d);
            function d() {
              var _this269;
              _classCallCheck(this, d);
              _this269 = _super308.apply(this, arguments), _this269.xmlKeys = {
                val: "w:val"
              };
              return _this269;
            }
            return _createClass(d);
          }(i.XmlAttributeComponent);
          var f = /*#__PURE__*/function (_i$XmlComponent4) {
            _inherits(f, _i$XmlComponent4);
            var _super309 = _createSuper(f);
            function f(e) {
              var _this270;
              _classCallCheck(this, f);
              _this270 = _super309.call(this, "w:textDirection"), _this270.root.push(new d({
                val: e
              }));
              return _this270;
            }
            return _createClass(f);
          }(i.XmlComponent);
          t.TDirection = f;
        },
        5957: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TableCellProperties = void 0;
          var n = r(4087),
            o = r(2451),
            i = r(8613),
            s = r(3148),
            a = r(5295),
            u = r(3282);
          var c = /*#__PURE__*/function (_o$IgnoreIfEmptyXmlCo4) {
            _inherits(c, _o$IgnoreIfEmptyXmlCo4);
            var _super310 = _createSuper(c);
            function c(e) {
              var _this271;
              _classCallCheck(this, c);
              _this271 = _super310.call(this, "w:tcPr"), e.width && _this271.root.push(new a.TableWidthElement("w:tcW", e.width)), e.columnSpan && _this271.root.push(new u.GridSpan(e.columnSpan)), e.verticalMerge ? _this271.root.push(new u.VerticalMerge(e.verticalMerge)) : e.rowSpan && e.rowSpan > 1 && _this271.root.push(new u.VerticalMerge(u.VerticalMergeType.RESTART)), e.borders && _this271.root.push(new u.TableCellBorders(e.borders)), e.shading && _this271.root.push(new i.Shading(e.shading)), e.margins && _this271.root.push(new s.TableCellMargin(s.TableCellMarginElementType.TABLE_CELL, e.margins)), e.textDirection && _this271.root.push(new u.TDirection(e.textDirection)), e.verticalAlign && _this271.root.push(new n.VerticalAlignElement(e.verticalAlign));
              return _this271;
            }
            return _createClass(c);
          }(o.IgnoreIfEmptyXmlComponent);
          t.TableCellProperties = c;
        },
        7203: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TableCell = void 0;
          var n = r(4827),
            o = r(2451),
            i = r(5957);
          var s = /*#__PURE__*/function (_o$XmlComponent47) {
            _inherits(s, _o$XmlComponent47);
            var _super311 = _createSuper(s);
            function s(e) {
              var _this272;
              _classCallCheck(this, s);
              _this272 = _super311.call(this, "w:tc"), _this272.options = e, _this272.root.push(new i.TableCellProperties(e));
              var _iterator34 = _createForOfIteratorHelper(e.children),
                _step34;
              try {
                for (_iterator34.s(); !(_step34 = _iterator34.n()).done;) {
                  var _t38 = _step34.value;
                  _this272.root.push(_t38);
                }
              } catch (err) {
                _iterator34.e(err);
              } finally {
                _iterator34.f();
              }
              return _this272;
            }
            _createClass(s, [{
              key: "prepForXml",
              value: function prepForXml(e) {
                return this.root[this.root.length - 1] instanceof n.Paragraph || this.root.push(new n.Paragraph({})), _get(_getPrototypeOf(s.prototype), "prepForXml", this).call(this, e);
              }
            }]);
            return s;
          }(o.XmlComponent);
          t.TableCell = s;
        },
        704: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(816), t), o(r(2687), t), o(r(1935), t), o(r(3043), t), o(r(4767), t);
        },
        3043: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TableBorders = void 0;
          var n = r(5328),
            o = r(2451),
            i = {
              style: n.BorderStyle.NONE,
              size: 0,
              color: "auto"
            },
            s = {
              style: n.BorderStyle.SINGLE,
              size: 4,
              color: "auto"
            };
          var a = /*#__PURE__*/function (_o$XmlComponent48) {
            _inherits(a, _o$XmlComponent48);
            var _super312 = _createSuper(a);
            function a(e) {
              var _this273;
              _classCallCheck(this, a);
              _this273 = _super312.call(this, "w:tblBorders"), e.top ? _this273.root.push(new n.BorderElement("w:top", e.top)) : _this273.root.push(new n.BorderElement("w:top", s)), e.left ? _this273.root.push(new n.BorderElement("w:left", e.left)) : _this273.root.push(new n.BorderElement("w:left", s)), e.bottom ? _this273.root.push(new n.BorderElement("w:bottom", e.bottom)) : _this273.root.push(new n.BorderElement("w:bottom", s)), e.right ? _this273.root.push(new n.BorderElement("w:right", e.right)) : _this273.root.push(new n.BorderElement("w:right", s)), e.insideHorizontal ? _this273.root.push(new n.BorderElement("w:insideH", e.insideHorizontal)) : _this273.root.push(new n.BorderElement("w:insideH", s)), e.insideVertical ? _this273.root.push(new n.BorderElement("w:insideV", e.insideVertical)) : _this273.root.push(new n.BorderElement("w:insideV", s));
              return _this273;
            }
            return _createClass(a);
          }(o.XmlComponent);
          t.TableBorders = a, a.NONE = {
            top: i,
            bottom: i,
            left: i,
            right: i,
            insideHorizontal: i,
            insideVertical: i
          };
        },
        3148: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TableCellMargin = t.TableCellMarginElementType = void 0;
          var n = r(2451),
            o = r(5295);
          var i;
          (i = t.TableCellMarginElementType || (t.TableCellMarginElementType = {})).TABLE = "w:tblCellMar", i.TABLE_CELL = "w:tcMar";
          var s = /*#__PURE__*/function (_n$IgnoreIfEmptyXmlCo2) {
            _inherits(s, _n$IgnoreIfEmptyXmlCo2);
            var _super313 = _createSuper(s);
            function s(e, _ref11) {
              var _this274;
              var _ref11$marginUnitType = _ref11.marginUnitType,
                t = _ref11$marginUnitType === void 0 ? o.WidthType.DXA : _ref11$marginUnitType,
                r = _ref11.top,
                n = _ref11.left,
                i = _ref11.bottom,
                _s9 = _ref11.right;
              _classCallCheck(this, s);
              _this274 = _super313.call(this, e), void 0 !== r && _this274.root.push(new o.TableWidthElement("w:top", {
                type: t,
                size: r
              })), void 0 !== n && _this274.root.push(new o.TableWidthElement("w:left", {
                type: t,
                size: n
              })), void 0 !== i && _this274.root.push(new o.TableWidthElement("w:bottom", {
                type: t,
                size: i
              })), void 0 !== _s9 && _this274.root.push(new o.TableWidthElement("w:right", {
                type: t,
                size: _s9
              }));
              return _this274;
            }
            return _createClass(s);
          }(n.IgnoreIfEmptyXmlComponent);
          t.TableCellMargin = s;
        },
        2687: function _(e, t, r) {
          "use strict";

          var n = this && this.__rest || function (e, t) {
            var r = {};
            for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
            if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
              var o = 0;
              for (n = Object.getOwnPropertySymbols(e); o < n.length; o++) t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]]);
            }
            return r;
          };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TableFloatProperties = t.TableFloatOptionsAttributes = t.RelativeVerticalPosition = t.RelativeHorizontalPosition = t.TableAnchorType = void 0;
          var o = r(459),
            i = r(2451),
            s = r(4767);
          var a, u, c;
          (c = t.TableAnchorType || (t.TableAnchorType = {})).MARGIN = "margin", c.PAGE = "page", c.TEXT = "text", (u = t.RelativeHorizontalPosition || (t.RelativeHorizontalPosition = {})).CENTER = "center", u.INSIDE = "inside", u.LEFT = "left", u.OUTSIDE = "outside", u.RIGHT = "right", (a = t.RelativeVerticalPosition || (t.RelativeVerticalPosition = {})).CENTER = "center", a.INSIDE = "inside", a.BOTTOM = "bottom", a.OUTSIDE = "outside", a.INLINE = "inline", a.TOP = "top";
          var l = /*#__PURE__*/function (_i$XmlAttributeCompon4) {
            _inherits(l, _i$XmlAttributeCompon4);
            var _super314 = _createSuper(l);
            function l() {
              var _this275;
              _classCallCheck(this, l);
              _this275 = _super314.apply(this, arguments), _this275.xmlKeys = {
                horizontalAnchor: "w:horzAnchor",
                verticalAnchor: "w:vertAnchor",
                absoluteHorizontalPosition: "w:tblpX",
                relativeHorizontalPosition: "w:tblpXSpec",
                absoluteVerticalPosition: "w:tblpY",
                relativeVerticalPosition: "w:tblpYSpec",
                bottomFromText: "w:bottomFromText",
                topFromText: "w:topFromText",
                leftFromText: "w:leftFromText",
                rightFromText: "w:rightFromText"
              };
              return _this275;
            }
            return _createClass(l);
          }(i.XmlAttributeComponent);
          t.TableFloatOptionsAttributes = l;
          var p = /*#__PURE__*/function (_i$XmlComponent5) {
            _inherits(p, _i$XmlComponent5);
            var _super315 = _createSuper(p);
            function p(e) {
              var _this276;
              _classCallCheck(this, p);
              var t = e.leftFromText,
                r = e.rightFromText,
                i = e.topFromText,
                a = e.bottomFromText,
                u = e.absoluteHorizontalPosition,
                c = e.absoluteVerticalPosition,
                _p = n(e, ["leftFromText", "rightFromText", "topFromText", "bottomFromText", "absoluteHorizontalPosition", "absoluteVerticalPosition"]);
              _this276 = _super315.call(this, "w:tblpPr"), _this276.root.push(new l(Object.assign({
                leftFromText: void 0 === t ? void 0 : (0, o.twipsMeasureValue)(t),
                rightFromText: void 0 === r ? void 0 : (0, o.twipsMeasureValue)(r),
                topFromText: void 0 === i ? void 0 : (0, o.twipsMeasureValue)(i),
                bottomFromText: void 0 === a ? void 0 : (0, o.twipsMeasureValue)(a),
                absoluteHorizontalPosition: void 0 === u ? void 0 : (0, o.signedTwipsMeasureValue)(u),
                absoluteVerticalPosition: void 0 === c ? void 0 : (0, o.signedTwipsMeasureValue)(c)
              }, _p))), _p.overlap && _this276.root.push(new s.TableOverlap(_p.overlap));
              return _this276;
            }
            return _createClass(p);
          }(i.XmlComponent);
          t.TableFloatProperties = p;
        },
        1935: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TableLayout = t.TableLayoutType = void 0;
          var n = r(2451);
          var o;
          (o = t.TableLayoutType || (t.TableLayoutType = {})).AUTOFIT = "autofit", o.FIXED = "fixed";
          var i = /*#__PURE__*/function (_n$XmlAttributeCompon63) {
            _inherits(i, _n$XmlAttributeCompon63);
            var _super316 = _createSuper(i);
            function i() {
              var _this277;
              _classCallCheck(this, i);
              _this277 = _super316.apply(this, arguments), _this277.xmlKeys = {
                type: "w:type"
              };
              return _this277;
            }
            return _createClass(i);
          }(n.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_n$XmlComponent128) {
            _inherits(s, _n$XmlComponent128);
            var _super317 = _createSuper(s);
            function s(e) {
              var _this278;
              _classCallCheck(this, s);
              _this278 = _super317.call(this, "w:tblLayout"), _this278.root.push(new i({
                type: e
              }));
              return _this278;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.TableLayout = s;
        },
        4767: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TableOverlap = t.OverlapType = void 0;
          var n = r(2451);
          var o;
          (o = t.OverlapType || (t.OverlapType = {})).NEVER = "never", o.OVERLAP = "overlap";
          var i = /*#__PURE__*/function (_n$XmlAttributeCompon64) {
            _inherits(i, _n$XmlAttributeCompon64);
            var _super318 = _createSuper(i);
            function i() {
              var _this279;
              _classCallCheck(this, i);
              _this279 = _super318.apply(this, arguments), _this279.xmlKeys = {
                val: "w:val"
              };
              return _this279;
            }
            return _createClass(i);
          }(n.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_n$XmlComponent129) {
            _inherits(s, _n$XmlComponent129);
            var _super319 = _createSuper(s);
            function s(e) {
              var _this280;
              _classCallCheck(this, s);
              _this280 = _super319.call(this, "w:tblOverlap"), _this280.root.push(new i({
                val: e
              }));
              return _this280;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.TableOverlap = s;
        },
        816: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TableProperties = void 0;
          var n = r(2451),
            o = r(4827),
            i = r(8613),
            s = r(5295),
            a = r(3043),
            u = r(3148),
            c = r(2687),
            l = r(1935);
          var p = /*#__PURE__*/function (_n$IgnoreIfEmptyXmlCo3) {
            _inherits(p, _n$IgnoreIfEmptyXmlCo3);
            var _super320 = _createSuper(p);
            function p(e) {
              var _this281;
              _classCallCheck(this, p);
              _this281 = _super320.call(this, "w:tblPr"), e.style && _this281.root.push(new n.StringValueElement("w:tblStyle", e.style)), e.float && _this281.root.push(new c.TableFloatProperties(e.float)), void 0 !== e.visuallyRightToLeft && _this281.root.push(new n.OnOffElement("w:bidiVisual", e.visuallyRightToLeft)), e.width && _this281.root.push(new s.TableWidthElement("w:tblW", e.width)), e.alignment && _this281.root.push(new o.Alignment(e.alignment)), e.indent && _this281.root.push(new s.TableWidthElement("w:tblInd", e.indent)), e.borders && _this281.root.push(new a.TableBorders(e.borders)), e.shading && _this281.root.push(new i.Shading(e.shading)), e.layout && _this281.root.push(new l.TableLayout(e.layout)), e.cellMargin && _this281.root.push(new u.TableCellMargin(u.TableCellMarginElementType.TABLE, e.cellMargin));
              return _this281;
            }
            return _createClass(p);
          }(n.IgnoreIfEmptyXmlComponent);
          t.TableProperties = p;
        },
        9003: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(5348), t), o(r(5367), t), o(r(6408), t);
        },
        6408: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TableRowHeight = t.TableRowHeightAttributes = t.HeightRule = void 0;
          var n = r(459),
            o = r(2451);
          var i;
          (i = t.HeightRule || (t.HeightRule = {})).AUTO = "auto", i.ATLEAST = "atLeast", i.EXACT = "exact";
          var s = /*#__PURE__*/function (_o$XmlAttributeCompon24) {
            _inherits(s, _o$XmlAttributeCompon24);
            var _super321 = _createSuper(s);
            function s() {
              var _this282;
              _classCallCheck(this, s);
              _this282 = _super321.apply(this, arguments), _this282.xmlKeys = {
                value: "w:val",
                rule: "w:hRule"
              };
              return _this282;
            }
            return _createClass(s);
          }(o.XmlAttributeComponent);
          t.TableRowHeightAttributes = s;
          var a = /*#__PURE__*/function (_o$XmlComponent49) {
            _inherits(a, _o$XmlComponent49);
            var _super322 = _createSuper(a);
            function a(e, t) {
              var _this283;
              _classCallCheck(this, a);
              _this283 = _super322.call(this, "w:trHeight"), _this283.root.push(new s({
                value: (0, n.twipsMeasureValue)(e),
                rule: t
              }));
              return _this283;
            }
            return _createClass(a);
          }(o.XmlComponent);
          t.TableRowHeight = a;
        },
        5367: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TableRowProperties = void 0;
          var n = r(2451),
            o = r(6408);
          var i = /*#__PURE__*/function (_n$IgnoreIfEmptyXmlCo4) {
            _inherits(i, _n$IgnoreIfEmptyXmlCo4);
            var _super323 = _createSuper(i);
            function i(e) {
              var _this284;
              _classCallCheck(this, i);
              _this284 = _super323.call(this, "w:trPr"), void 0 !== e.cantSplit && _this284.root.push(new n.OnOffElement("w:cantSplit", e.cantSplit)), void 0 !== e.tableHeader && _this284.root.push(new n.OnOffElement("w:tblHeader", e.tableHeader)), e.height && _this284.root.push(new o.TableRowHeight(e.height.value, e.height.rule));
              return _this284;
            }
            return _createClass(i);
          }(n.IgnoreIfEmptyXmlComponent);
          t.TableRowProperties = i;
        },
        5348: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TableRow = void 0;
          var n = r(2451),
            o = r(204),
            i = r(5367);
          var s = /*#__PURE__*/function (_n$XmlComponent130) {
            _inherits(s, _n$XmlComponent130);
            var _super324 = _createSuper(s);
            function s(e) {
              var _this285;
              _classCallCheck(this, s);
              _this285 = _super324.call(this, "w:tr"), _this285.options = e, _this285.root.push(new i.TableRowProperties(e));
              var _iterator35 = _createForOfIteratorHelper(e.children),
                _step35;
              try {
                for (_iterator35.s(); !(_step35 = _iterator35.n()).done;) {
                  var _t39 = _step35.value;
                  _this285.root.push(_t39);
                }
              } catch (err) {
                _iterator35.e(err);
              } finally {
                _iterator35.f();
              }
              return _this285;
            }
            _createClass(s, [{
              key: "CellCount",
              get: function get() {
                return this.options.children.length;
              }
            }, {
              key: "cells",
              get: function get() {
                return this.root.filter(function (e) {
                  return e instanceof o.TableCell;
                });
              }
            }, {
              key: "addCellToIndex",
              value: function addCellToIndex(e, t) {
                this.root.splice(t + 1, 0, e);
              }
            }, {
              key: "addCellToColumnIndex",
              value: function addCellToColumnIndex(e, t) {
                var r = this.columnIndexToRootIndex(t, !0);
                this.addCellToIndex(e, r - 1);
              }
            }, {
              key: "rootIndexToColumnIndex",
              value: function rootIndexToColumnIndex(e) {
                if (e < 1 || e >= this.root.length) throw new Error("cell 'rootIndex' should between 1 to " + (this.root.length - 1));
                var t = 0;
                for (var _r12 = 1; _r12 < e; _r12++) t += this.root[_r12].options.columnSpan || 1;
                return t;
              }
            }, {
              key: "columnIndexToRootIndex",
              value: function columnIndexToRootIndex(e) {
                var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1;
                if (e < 0) throw new Error("cell 'columnIndex' should not less than zero");
                var r = 0,
                  n = 1;
                for (; r <= e;) {
                  if (n >= this.root.length) {
                    if (t) return this.root.length;
                    throw new Error("cell 'columnIndex' should not great than " + (r - 1));
                  }
                  var _e18 = this.root[n];
                  n += 1, r += _e18 && _e18.options.columnSpan || 1;
                }
                return n - 1;
              }
            }]);
            return s;
          }(n.XmlComponent);
          t.TableRow = s;
        },
        5295: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.TableWidthElement = t.WidthType = void 0;
          var n = r(459),
            o = r(2451);
          var i;
          !function (e) {
            e.AUTO = "auto", e.DXA = "dxa", e.NIL = "nil", e.PERCENTAGE = "pct";
          }(i = t.WidthType || (t.WidthType = {}));
          var s = /*#__PURE__*/function (_o$XmlAttributeCompon25) {
            _inherits(s, _o$XmlAttributeCompon25);
            var _super325 = _createSuper(s);
            function s() {
              var _this286;
              _classCallCheck(this, s);
              _this286 = _super325.apply(this, arguments), _this286.xmlKeys = {
                type: "w:type",
                size: "w:w"
              };
              return _this286;
            }
            return _createClass(s);
          }(o.XmlAttributeComponent);
          var a = /*#__PURE__*/function (_o$XmlComponent50) {
            _inherits(a, _o$XmlComponent50);
            var _super326 = _createSuper(a);
            function a(e, _ref12) {
              var _this287;
              var _ref12$type = _ref12.type,
                t = _ref12$type === void 0 ? i.AUTO : _ref12$type,
                r = _ref12.size;
              _classCallCheck(this, a);
              _this287 = _super326.call(this, e);
              var o = r;
              t === i.PERCENTAGE && "number" == typeof r && (o = "".concat(r, "%")), _this287.root.push(new s({
                type: t,
                size: (0, n.measurementOrPercentValue)(o)
              }));
              return _this287;
            }
            return _createClass(a);
          }(o.XmlComponent);
          t.TableWidthElement = a;
        },
        4113: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Table = void 0;
          var n = r(2451),
            o = r(5541),
            i = r(204),
            s = r(704);
          var a = /*#__PURE__*/function (_n$XmlComponent131) {
            _inherits(a, _n$XmlComponent131);
            var _super327 = _createSuper(a);
            function a(_ref13) {
              var _this288;
              var e = _ref13.rows,
                t = _ref13.width,
                _ref13$columnWidths = _ref13.columnWidths,
                r = _ref13$columnWidths === void 0 ? Array(Math.max.apply(Math, _toConsumableArray(e.map(function (e) {
                  return e.CellCount;
                })))).fill(100) : _ref13$columnWidths,
                n = _ref13.margins,
                _a12 = _ref13.indent,
                u = _ref13.float,
                c = _ref13.layout,
                l = _ref13.style,
                p = _ref13.borders,
                h = _ref13.alignment,
                d = _ref13.visuallyRightToLeft;
              _classCallCheck(this, a);
              _this288 = _super327.call(this, "w:tbl"), _this288.root.push(new s.TableProperties({
                borders: null != p ? p : {},
                width: null != t ? t : {
                  size: 100
                },
                indent: _a12,
                float: u,
                layout: c,
                style: l,
                alignment: h,
                cellMargin: n,
                visuallyRightToLeft: d
              })), _this288.root.push(new o.TableGrid(r));
              var _iterator36 = _createForOfIteratorHelper(e),
                _step36;
              try {
                for (_iterator36.s(); !(_step36 = _iterator36.n()).done;) {
                  var _t40 = _step36.value;
                  _this288.root.push(_t40);
                }
              } catch (err) {
                _iterator36.e(err);
              } finally {
                _iterator36.f();
              }
              e.forEach(function (t, r) {
                if (r === e.length - 1) return;
                var n = 0;
                t.cells.forEach(function (t) {
                  if (t.options.rowSpan && t.options.rowSpan > 1) {
                    var _o9 = new i.TableCell({
                      rowSpan: t.options.rowSpan - 1,
                      columnSpan: t.options.columnSpan,
                      borders: t.options.borders,
                      children: [],
                      verticalMerge: i.VerticalMergeType.CONTINUE
                    });
                    e[r + 1].addCellToColumnIndex(_o9, n);
                  }
                  n += t.options.columnSpan || 1;
                });
              });
              return _this288;
            }
            return _createClass(a);
          }(n.XmlComponent);
          t.Table = a;
        },
        699: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(3841), t), o(r(2415), t);
        },
        9357: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.DeletedNumberOfPagesSection = t.DeletedNumberOfPages = t.DeletedPage = void 0;
          var n = r(5321),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon26) {
            _inherits(i, _o$XmlAttributeCompon26);
            var _super328 = _createSuper(i);
            function i() {
              var _this289;
              _classCallCheck(this, i);
              _this289 = _super328.apply(this, arguments), _this289.xmlKeys = {
                space: "xml:space"
              };
              return _this289;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_o$XmlComponent51) {
            _inherits(s, _o$XmlComponent51);
            var _super329 = _createSuper(s);
            function s() {
              var _this290;
              _classCallCheck(this, s);
              _this290 = _super329.call(this, "w:delInstrText"), _this290.root.push(new i({
                space: n.SpaceType.PRESERVE
              })), _this290.root.push("PAGE");
              return _this290;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.DeletedPage = s;
          var a = /*#__PURE__*/function (_o$XmlComponent52) {
            _inherits(a, _o$XmlComponent52);
            var _super330 = _createSuper(a);
            function a() {
              var _this291;
              _classCallCheck(this, a);
              _this291 = _super330.call(this, "w:delInstrText"), _this291.root.push(new i({
                space: n.SpaceType.PRESERVE
              })), _this291.root.push("NUMPAGES");
              return _this291;
            }
            return _createClass(a);
          }(o.XmlComponent);
          t.DeletedNumberOfPages = a;
          var u = /*#__PURE__*/function (_o$XmlComponent53) {
            _inherits(u, _o$XmlComponent53);
            var _super331 = _createSuper(u);
            function u() {
              var _this292;
              _classCallCheck(this, u);
              _this292 = _super331.call(this, "w:delInstrText"), _this292.root.push(new i({
                space: n.SpaceType.PRESERVE
              })), _this292.root.push("SECTIONPAGES");
              return _this292;
            }
            return _createClass(u);
          }(o.XmlComponent);
          t.DeletedNumberOfPagesSection = u;
        },
        2415: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.DeletedTextRun = void 0;
          var n = r(2451),
            o = r(7559),
            i = r(6724),
            s = r(3178),
            a = r(2076),
            u = r(7044),
            c = r(9357),
            l = r(3849);
          var p = /*#__PURE__*/function (_n$XmlComponent132) {
            _inherits(p, _n$XmlComponent132);
            var _super332 = _createSuper(p);
            function p(e) {
              var _this293;
              _classCallCheck(this, p);
              _this293 = _super332.call(this, "w:del"), _this293.root.push(new u.ChangeAttributes({
                id: e.id,
                author: e.author,
                date: e.date
              })), _this293.deletedTextRunWrapper = new h(e), _this293.addChildElement(_this293.deletedTextRunWrapper);
              return _this293;
            }
            return _createClass(p);
          }(n.XmlComponent);
          t.DeletedTextRun = p;
          var h = /*#__PURE__*/function (_n$XmlComponent133) {
            _inherits(h, _n$XmlComponent133);
            var _super333 = _createSuper(h);
            function h(e) {
              var _this294;
              _classCallCheck(this, h);
              if (_this294 = _super333.call(this, "w:r"), _this294.root.push(new o.RunProperties(e)), e.children) {
                var _iterator37 = _createForOfIteratorHelper(e.children),
                  _step37;
                try {
                  for (_iterator37.s(); !(_step37 = _iterator37.n()).done;) {
                    var _t41 = _step37.value;
                    if ("string" != typeof _t41) _this294.root.push(_t41);else switch (_t41) {
                      case a.PageNumber.CURRENT:
                        _this294.root.push(new s.Begin()), _this294.root.push(new c.DeletedPage()), _this294.root.push(new s.Separate()), _this294.root.push(new s.End());
                        break;
                      case a.PageNumber.TOTAL_PAGES:
                        _this294.root.push(new s.Begin()), _this294.root.push(new c.DeletedNumberOfPages()), _this294.root.push(new s.Separate()), _this294.root.push(new s.End());
                        break;
                      case a.PageNumber.TOTAL_PAGES_IN_SECTION:
                        _this294.root.push(new s.Begin()), _this294.root.push(new c.DeletedNumberOfPagesSection()), _this294.root.push(new s.Separate()), _this294.root.push(new s.End());
                        break;
                      default:
                        _this294.root.push(new l.DeletedText(_t41));
                    }
                  }
                } catch (err) {
                  _iterator37.e(err);
                } finally {
                  _iterator37.f();
                }
              } else e.text && _this294.root.push(new l.DeletedText(e.text));
              if (e.break) for (var _t42 = 0; _t42 < e.break; _t42++) _this294.root.splice(1, 0, new i.Break());
              return _possibleConstructorReturn(_this294);
            }
            return _createClass(h);
          }(n.XmlComponent);
        },
        3849: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.DeletedText = void 0;
          var n = r(5321),
            o = r(2451);
          var i = /*#__PURE__*/function (_o$XmlAttributeCompon27) {
            _inherits(i, _o$XmlAttributeCompon27);
            var _super334 = _createSuper(i);
            function i() {
              var _this295;
              _classCallCheck(this, i);
              _this295 = _super334.apply(this, arguments), _this295.xmlKeys = {
                space: "xml:space"
              };
              return _this295;
            }
            return _createClass(i);
          }(o.XmlAttributeComponent);
          var s = /*#__PURE__*/function (_o$XmlComponent54) {
            _inherits(s, _o$XmlComponent54);
            var _super335 = _createSuper(s);
            function s(e) {
              var _this296;
              _classCallCheck(this, s);
              _this296 = _super335.call(this, "w:delText"), _this296.root.push(new i({
                space: n.SpaceType.PRESERVE
              })), _this296.root.push(e);
              return _this296;
            }
            return _createClass(s);
          }(o.XmlComponent);
          t.DeletedText = s;
        },
        3841: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.InsertedTextRun = void 0;
          var n = r(2451),
            o = r(7559),
            i = r(7044);
          var s = /*#__PURE__*/function (_n$XmlComponent134) {
            _inherits(s, _n$XmlComponent134);
            var _super336 = _createSuper(s);
            function s(e) {
              var _this297;
              _classCallCheck(this, s);
              _this297 = _super336.call(this, "w:ins"), _this297.root.push(new i.ChangeAttributes({
                id: e.id,
                author: e.author,
                date: e.date
              })), _this297.addChildElement(new o.TextRun(e));
              return _this297;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.InsertedTextRun = s;
        },
        7044: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ChangeAttributes = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon65) {
            _inherits(o, _n$XmlAttributeCompon65);
            var _super337 = _createSuper(o);
            function o() {
              var _this298;
              _classCallCheck(this, o);
              _this298 = _super337.apply(this, arguments), _this298.xmlKeys = {
                id: "w:id",
                author: "w:author",
                date: "w:date"
              };
              return _this298;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.ChangeAttributes = o;
        },
        459: function _(e, t) {
          "use strict";

          function r(e) {
            if (isNaN(e)) throw new Error("Invalid value '".concat(e, "' specified. Must be an integer."));
            return Math.floor(e);
          }
          function n(e) {
            var t = r(e);
            if (t < 0) throw new Error("Invalid value '".concat(e, "' specified. Must be a positive integer."));
            return t;
          }
          function o(e, t) {
            var r = 2 * t;
            if (e.length !== r || isNaN(Number("0x" + e))) throw new Error("Invalid hex value '".concat(e, "'. Expected ").concat(r, " digit hex value"));
            return e;
          }
          function i(e) {
            var t = e.slice(-2);
            if (!s.includes(t)) throw new Error("Invalid unit '".concat(t, "' specified. Valid units are ").concat(s.join(", ")));
            var r = e.substring(0, e.length - 2);
            if (isNaN(Number(r))) throw new Error("Invalid value '".concat(r, "' specified. Expected a valid number."));
            return "".concat(Number(r)).concat(t);
          }
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.dateTimeValue = t.pointMeasureValue = t.eighthPointMeasureValue = t.measurementOrPercentValue = t.percentageValue = t.twipsMeasureValue = t.signedHpsMeasureValue = t.hpsMeasureValue = t.signedTwipsMeasureValue = t.hexColorValue = t.positiveUniversalMeasureValue = t.universalMeasureValue = t.uCharHexNumber = t.shortHexNumber = t.longHexNumber = t.unsignedDecimalNumber = t.decimalNumber = void 0, t.decimalNumber = r, t.unsignedDecimalNumber = n, t.longHexNumber = function (e) {
            return o(e, 4);
          }, t.shortHexNumber = function (e) {
            return o(e, 2);
          }, t.uCharHexNumber = function (e) {
            return o(e, 1);
          }, t.universalMeasureValue = i;
          var s = ["mm", "cm", "in", "pt", "pc", "pi"];
          function a(e) {
            var t = i(e);
            if (parseFloat(t) < 0) throw new Error("Invalid value '".concat(t, "' specified. Expected a positive number."));
            return t;
          }
          function u(e) {
            if ("%" !== e.slice(-1)) throw new Error("Invalid value '".concat(e, "'. Expected percentage value (eg '55%')"));
            var t = e.substring(0, e.length - 1);
            if (isNaN(Number(t))) throw new Error("Invalid value '".concat(t, "' specified. Expected a valid number."));
            return "".concat(Number(t), "%");
          }
          t.positiveUniversalMeasureValue = a, t.hexColorValue = function (e) {
            return "auto" === e ? e : o("#" === e.charAt(0) ? e.substring(1) : e, 3);
          }, t.signedTwipsMeasureValue = function (e) {
            return "string" == typeof e ? i(e) : r(e);
          }, t.hpsMeasureValue = function (e) {
            return "string" == typeof e ? a(e) : n(e);
          }, t.signedHpsMeasureValue = function (e) {
            return "string" == typeof e ? i(e) : r(e);
          }, t.twipsMeasureValue = function (e) {
            return "string" == typeof e ? a(e) : n(e);
          }, t.percentageValue = u, t.measurementOrPercentValue = function (e) {
            return "number" == typeof e ? r(e) : "%" === e.slice(-1) ? u(e) : i(e);
          }, t.eighthPointMeasureValue = n, t.pointMeasureValue = n, t.dateTimeValue = function (e) {
            return e.toISOString();
          };
        },
        4087: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(1729), t);
        },
        1729: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.VerticalAlignElement = t.VerticalAlignAttributes = t.VerticalAlign = void 0;
          var n = r(2451);
          var o;
          (o = t.VerticalAlign || (t.VerticalAlign = {})).BOTH = "both", o.BOTTOM = "bottom", o.CENTER = "center", o.TOP = "top";
          var i = /*#__PURE__*/function (_n$XmlAttributeCompon66) {
            _inherits(i, _n$XmlAttributeCompon66);
            var _super338 = _createSuper(i);
            function i() {
              var _this299;
              _classCallCheck(this, i);
              _this299 = _super338.apply(this, arguments), _this299.xmlKeys = {
                verticalAlign: "w:val"
              };
              return _this299;
            }
            return _createClass(i);
          }(n.XmlAttributeComponent);
          t.VerticalAlignAttributes = i;
          var s = /*#__PURE__*/function (_n$XmlComponent135) {
            _inherits(s, _n$XmlComponent135);
            var _super339 = _createSuper(s);
            function s(e) {
              var _this300;
              _classCallCheck(this, s);
              _this300 = _super339.call(this, "w:vAlign"), _this300.root.push(new i({
                verticalAlign: e
              }));
              return _this300;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.VerticalAlignElement = s;
        },
        7518: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Attributes = void 0;
          var n = r(2852);
          var o = /*#__PURE__*/function (_n$XmlAttributeCompon67) {
            _inherits(o, _n$XmlAttributeCompon67);
            var _super340 = _createSuper(o);
            function o() {
              var _this301;
              _classCallCheck(this, o);
              _this301 = _super340.apply(this, arguments), _this301.xmlKeys = {
                val: "w:val",
                color: "w:color",
                fill: "w:fill",
                space: "w:space",
                sz: "w:sz",
                type: "w:type",
                rsidR: "w:rsidR",
                rsidRPr: "w:rsidRPr",
                rsidSect: "w:rsidSect",
                w: "w:w",
                h: "w:h",
                top: "w:top",
                right: "w:right",
                bottom: "w:bottom",
                left: "w:left",
                header: "w:header",
                footer: "w:footer",
                gutter: "w:gutter",
                linePitch: "w:linePitch",
                pos: "w:pos"
              };
              return _this301;
            }
            return _createClass(o);
          }(n.XmlAttributeComponent);
          t.Attributes = o;
        },
        8198: function _(e, t) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.BaseXmlComponent = void 0, t.BaseXmlComponent = /*#__PURE__*/function () {
            function _class35(e) {
              _classCallCheck(this, _class35);
              this.rootKey = e;
            }
            return _createClass(_class35);
          }();
        },
        2852: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.XmlAttributeComponent = void 0;
          var n = r(8198);
          var o = /*#__PURE__*/function (_n$BaseXmlComponent) {
            _inherits(o, _n$BaseXmlComponent);
            var _super341 = _createSuper(o);
            function o(e) {
              var _this302;
              _classCallCheck(this, o);
              _this302 = _super341.call(this, "_attr"), _this302.root = e;
              return _this302;
            }
            _createClass(o, [{
              key: "prepForXml",
              value: function prepForXml(e) {
                var _this303 = this;
                var t = {};
                return Object.keys(this.root).forEach(function (e) {
                  var r = _this303.root[e];
                  if (void 0 !== r) {
                    var _n11 = _this303.xmlKeys && _this303.xmlKeys[e] || e;
                    t[_n11] = r;
                  }
                }), {
                  _attr: t
                };
              }
            }, {
              key: "set",
              value: function set(e) {
                this.root = e;
              }
            }]);
            return o;
          }(n.BaseXmlComponent);
          t.XmlAttributeComponent = o;
        },
        3247: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ImportedRootElementAttributes = t.ImportedXmlComponent = t.convertToXmlComponent = void 0;
          var n = r(7888),
            o = r(2451);
          function i(e) {
            switch (e.type) {
              case void 0:
              case "element":
                var _t43 = new a(e.name, e.attributes),
                  _r13 = e.elements || [];
                var _iterator38 = _createForOfIteratorHelper(_r13),
                  _step38;
                try {
                  for (_iterator38.s(); !(_step38 = _iterator38.n()).done;) {
                    var _e19 = _step38.value;
                    var _r14 = i(_e19);
                    void 0 !== _r14 && _t43.push(_r14);
                  }
                } catch (err) {
                  _iterator38.e(err);
                } finally {
                  _iterator38.f();
                }
                return _t43;
              case "text":
                return e.text;
              default:
                return;
            }
          }
          t.convertToXmlComponent = i;
          var s = /*#__PURE__*/function (_o$XmlAttributeCompon28) {
            _inherits(s, _o$XmlAttributeCompon28);
            var _super342 = _createSuper(s);
            function s() {
              _classCallCheck(this, s);
              return _super342.apply(this, arguments);
            }
            return _createClass(s);
          }(o.XmlAttributeComponent);
          var a = /*#__PURE__*/function (_o$XmlComponent55) {
            _inherits(a, _o$XmlComponent55);
            var _super343 = _createSuper(a);
            function a(e, t) {
              var _this304;
              _classCallCheck(this, a);
              _this304 = _super343.call(this, e), t && _this304.root.push(new s(t));
              return _this304;
            }
            _createClass(a, [{
              key: "push",
              value: function push(e) {
                this.root.push(e);
              }
            }], [{
              key: "fromXmlString",
              value: function fromXmlString(e) {
                return i((0, n.xml2js)(e, {
                  compact: !1
                }));
              }
            }]);
            return a;
          }(o.XmlComponent);
          t.ImportedXmlComponent = a;
          var u = /*#__PURE__*/function (_o$XmlComponent56) {
            _inherits(u, _o$XmlComponent56);
            var _super344 = _createSuper(u);
            function u(e) {
              var _this305;
              _classCallCheck(this, u);
              _this305 = _super344.call(this, ""), _this305._attr = e;
              return _this305;
            }
            _createClass(u, [{
              key: "prepForXml",
              value: function prepForXml(e) {
                return {
                  _attr: this._attr
                };
              }
            }]);
            return u;
          }(o.XmlComponent);
          t.ImportedRootElementAttributes = u;
        },
        2451: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(7473), t), o(r(7518), t), o(r(2852), t), o(r(3247), t), o(r(3093), t), o(r(9372), t), o(r(2631), t), o(r(8198), t);
        },
        9372: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.InitializableXmlComponent = void 0;
          var n = r(2451);
          var o = /*#__PURE__*/function (_n$XmlComponent136) {
            _inherits(o, _n$XmlComponent136);
            var _super345 = _createSuper(o);
            function o(e, t) {
              var _this306;
              _classCallCheck(this, o);
              _this306 = _super345.call(this, e), t && (_this306.root = t.root);
              return _this306;
            }
            return _createClass(o);
          }(n.XmlComponent);
          t.InitializableXmlComponent = o;
        },
        2631: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.StringContainer = t.NumberValueElement = t.StringValueElement = t.HpsMeasureElement = t.OnOffElement = void 0;
          var n = r(2451),
            o = r(459);
          var i = /*#__PURE__*/function (_n$XmlComponent137) {
            _inherits(i, _n$XmlComponent137);
            var _super346 = _createSuper(i);
            function i(e) {
              var _this307;
              var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !0;
              _classCallCheck(this, i);
              _this307 = _super346.call(this, e), !0 !== t && _this307.root.push(new n.Attributes({
                val: t
              }));
              return _this307;
            }
            return _createClass(i);
          }(n.XmlComponent);
          t.OnOffElement = i;
          var s = /*#__PURE__*/function (_n$XmlComponent138) {
            _inherits(s, _n$XmlComponent138);
            var _super347 = _createSuper(s);
            function s(e, t) {
              var _this308;
              _classCallCheck(this, s);
              _this308 = _super347.call(this, e), _this308.root.push(new n.Attributes({
                val: (0, o.hpsMeasureValue)(t)
              }));
              return _this308;
            }
            return _createClass(s);
          }(n.XmlComponent);
          t.HpsMeasureElement = s;
          var a = /*#__PURE__*/function (_n$XmlComponent139) {
            _inherits(a, _n$XmlComponent139);
            var _super348 = _createSuper(a);
            function a(e, t) {
              var _this309;
              _classCallCheck(this, a);
              _this309 = _super348.call(this, e), _this309.root.push(new n.Attributes({
                val: t
              }));
              return _this309;
            }
            return _createClass(a);
          }(n.XmlComponent);
          t.StringValueElement = a;
          var u = /*#__PURE__*/function (_n$XmlComponent140) {
            _inherits(u, _n$XmlComponent140);
            var _super349 = _createSuper(u);
            function u(e, t) {
              var _this310;
              _classCallCheck(this, u);
              _this310 = _super349.call(this, e), _this310.root.push(new n.Attributes({
                val: t
              }));
              return _this310;
            }
            return _createClass(u);
          }(n.XmlComponent);
          t.NumberValueElement = u;
          var c = /*#__PURE__*/function (_n$XmlComponent141) {
            _inherits(c, _n$XmlComponent141);
            var _super350 = _createSuper(c);
            function c(e, t) {
              var _this311;
              _classCallCheck(this, c);
              _this311 = _super350.call(this, e), _this311.root.push(t);
              return _this311;
            }
            return _createClass(c);
          }(n.XmlComponent);
          t.StringContainer = c;
        },
        7473: function _(e, t, r) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.IgnoreIfEmptyXmlComponent = t.XmlComponent = t.EMPTY_OBJECT = void 0;
          var n = r(8198);
          t.EMPTY_OBJECT = Object.seal({});
          var o = /*#__PURE__*/function (_n$BaseXmlComponent2) {
            _inherits(o, _n$BaseXmlComponent2);
            var _super351 = _createSuper(o);
            function o(e) {
              var _this312;
              _classCallCheck(this, o);
              _this312 = _super351.call(this, e), _this312.root = new Array();
              return _this312;
            }
            _createClass(o, [{
              key: "prepForXml",
              value: function prepForXml(e) {
                var r;
                var _o10 = this.root.map(function (t) {
                  return t instanceof n.BaseXmlComponent ? t.prepForXml(e) : t;
                }).filter(function (e) {
                  return void 0 !== e;
                });
                return _defineProperty({}, this.rootKey, _o10.length ? 1 === _o10.length && (null === (r = _o10[0]) || void 0 === r ? void 0 : r._attr) ? _o10[0] : _o10 : t.EMPTY_OBJECT);
              }
            }, {
              key: "addChildElement",
              value: function addChildElement(e) {
                return this.root.push(e), this;
              }
            }]);
            return o;
          }(n.BaseXmlComponent);
          t.XmlComponent = o, t.IgnoreIfEmptyXmlComponent = /*#__PURE__*/function (_o11) {
            _inherits(_class36, _o11);
            var _super352 = _createSuper(_class36);
            function _class36() {
              _classCallCheck(this, _class36);
              return _super352.apply(this, arguments);
            }
            _createClass(_class36, [{
              key: "prepForXml",
              value: function prepForXml(e) {
                var t = _get(_getPrototypeOf(_class36.prototype), "prepForXml", this).call(this, e);
                if (t && ("object" != _typeof(t[this.rootKey]) || Object.keys(t[this.rootKey]).length)) return t;
              }
            }]);
            return _class36;
          }(o);
        },
        3093: function _(e, t) {
          "use strict";

          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.WORKAROUND3 = void 0, t.WORKAROUND3 = "";
        },
        1797: function _(e, t, r) {
          "use strict";

          var n = this && this.__awaiter || function (e, t, r, n) {
            return new (r || (r = Promise))(function (o, i) {
              function s(e) {
                try {
                  u(n.next(e));
                } catch (e) {
                  i(e);
                }
              }
              function a(e) {
                try {
                  u(n.throw(e));
                } catch (e) {
                  i(e);
                }
              }
              function u(e) {
                var t;
                e.done ? o(e.value) : (t = e.value, t instanceof r ? t : new r(function (e) {
                  e(t);
                })).then(s, a);
              }
              u((n = n.apply(e, t || [])).next());
            });
          };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.ImportDotx = void 0;
          var o = r(5733),
            i = r(7888),
            s = r(7158),
            a = r(1117),
            u = r(6276),
            c = r(9522),
            l = r(2451),
            p = {
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/header": "header",
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer": "footer",
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image": "image",
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink": "hyperlink"
            };
          var h;
          !function (e) {
            e.HEADER = "header", e.FOOTER = "footer", e.IMAGE = "image", e.HYPERLINK = "hyperlink";
          }(h || (h = {})), t.ImportDotx = /*#__PURE__*/function () {
            function _class37() {
              _classCallCheck(this, _class37);
            }
            _createClass(_class37, [{
              key: "extract",
              value: function extract(e) {
                return n(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
                  var t, r, n, i, s, a;
                  return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                    while (1) switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return o.loadAsync(e);
                      case 2:
                        t = _context4.sent;
                        _context4.next = 5;
                        return t.files["word/document.xml"].async("text");
                      case 5:
                        r = _context4.sent;
                        _context4.next = 8;
                        return t.files["word/_rels/document.xml.rels"].async("text");
                      case 8:
                        n = _context4.sent;
                        i = this.extractDocumentRefs(r);
                        s = this.findReferenceFiles(n);
                        a = new u.Media();
                        _context4.next = 14;
                        return this.createHeaders(t, i, s, a, 0);
                      case 14:
                        _context4.t0 = _context4.sent;
                        _context4.next = 17;
                        return this.createFooters(t, i, s, a, i.headers.length);
                      case 17:
                        _context4.t1 = _context4.sent;
                        _context4.t2 = i.footers.length + i.headers.length;
                        _context4.next = 21;
                        return t.files["word/styles.xml"].async("text");
                      case 21:
                        _context4.t3 = _context4.sent;
                        _context4.t4 = this.checkIfTitlePageIsDefined(r);
                        _context4.t5 = a;
                        return _context4.abrupt("return", {
                          headers: _context4.t0,
                          footers: _context4.t1,
                          currentRelationshipId: _context4.t2,
                          styles: _context4.t3,
                          titlePageIsDefined: _context4.t4,
                          media: _context4.t5
                        });
                      case 25:
                      case "end":
                        return _context4.stop();
                    }
                  }, _callee4, this);
                }));
              }
            }, {
              key: "createFooters",
              value: function createFooters(e, t, r, o, a) {
                return n(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
                  var _this313 = this;
                  var u;
                  return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                    while (1) switch (_context6.prev = _context6.next) {
                      case 0:
                        u = t.footers.map(function (t, u) {
                          return n(_this313, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
                            var n, c, p, h, d, f;
                            return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                              while (1) switch (_context5.prev = _context5.next) {
                                case 0:
                                  n = r.find(function (e) {
                                    return e.id === t.id;
                                  });
                                  if (!(null === n || !n)) {
                                    _context5.next = 3;
                                    break;
                                  }
                                  throw new Error("Can not find target file for id ".concat(t.id));
                                case 3:
                                  _context5.next = 5;
                                  return e.files["word/".concat(n.target)].async("text");
                                case 5:
                                  c = _context5.sent;
                                  p = (0, i.xml2js)(c, {
                                    compact: !1,
                                    captureSpacesBetweenElements: !0
                                  });
                                  if (p.elements) {
                                    _context5.next = 9;
                                    break;
                                  }
                                  return _context5.abrupt("return");
                                case 9:
                                  h = p.elements.reduce(function (e, t) {
                                    return "w:ftr" === t.name ? t : e;
                                  }), d = (0, l.convertToXmlComponent)(h), f = new s.FooterWrapper(o, a + u, d);
                                  _context5.next = 12;
                                  return this.addRelationshipToWrapper(n, e, f, o);
                                case 12:
                                  return _context5.abrupt("return", {
                                    type: t.type,
                                    footer: f
                                  });
                                case 13:
                                case "end":
                                  return _context5.stop();
                              }
                            }, _callee5, this);
                          }));
                        }).filter(function (e) {
                          return !!e;
                        });
                        return _context6.abrupt("return", Promise.all(u));
                      case 2:
                      case "end":
                        return _context6.stop();
                    }
                  }, _callee6);
                }));
              }
            }, {
              key: "createHeaders",
              value: function createHeaders(e, t, r, o, s) {
                return n(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
                  var _this314 = this;
                  var u;
                  return _regeneratorRuntime().wrap(function _callee8$(_context8) {
                    while (1) switch (_context8.prev = _context8.next) {
                      case 0:
                        u = t.headers.map(function (t, u) {
                          return n(_this314, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
                            var n, c, p, h, d, f;
                            return _regeneratorRuntime().wrap(function _callee7$(_context7) {
                              while (1) switch (_context7.prev = _context7.next) {
                                case 0:
                                  n = r.find(function (e) {
                                    return e.id === t.id;
                                  });
                                  if (!(null === n || !n)) {
                                    _context7.next = 3;
                                    break;
                                  }
                                  throw new Error("Can not find target file for id ".concat(t.id));
                                case 3:
                                  _context7.next = 5;
                                  return e.files["word/".concat(n.target)].async("text");
                                case 5:
                                  c = _context7.sent;
                                  p = (0, i.xml2js)(c, {
                                    compact: !1,
                                    captureSpacesBetweenElements: !0
                                  });
                                  if (p.elements) {
                                    _context7.next = 9;
                                    break;
                                  }
                                  return _context7.abrupt("return");
                                case 9:
                                  h = p.elements.reduce(function (e, t) {
                                    return "w:hdr" === t.name ? t : e;
                                  }), d = (0, l.convertToXmlComponent)(h), f = new a.HeaderWrapper(o, s + u, d);
                                  _context7.next = 12;
                                  return this.addRelationshipToWrapper(n, e, f, o);
                                case 12:
                                  return _context7.abrupt("return", {
                                    type: t.type,
                                    header: f
                                  });
                                case 13:
                                case "end":
                                  return _context7.stop();
                              }
                            }, _callee7, this);
                          }));
                        }).filter(function (e) {
                          return !!e;
                        });
                        return _context8.abrupt("return", Promise.all(u));
                      case 2:
                      case "end":
                        return _context8.stop();
                    }
                  }, _callee8);
                }));
              }
            }, {
              key: "addRelationshipToWrapper",
              value: function addRelationshipToWrapper(e, t, r, o) {
                return n(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
                  var n, i, s, a, _iterator39, _step39, _e20, _n12, _i7, _iterator40, _step40, _e21;
                  return _regeneratorRuntime().wrap(function _callee9$(_context9) {
                    while (1) switch (_context9.prev = _context9.next) {
                      case 0:
                        n = t.files["word/_rels/".concat(e.target, ".rels")];
                        if (n) {
                          _context9.next = 3;
                          break;
                        }
                        return _context9.abrupt("return");
                      case 3:
                        _context9.next = 5;
                        return n.async("text");
                      case 5:
                        i = _context9.sent;
                        s = this.findReferenceFiles(i).filter(function (e) {
                          return e.type === h.IMAGE;
                        });
                        a = this.findReferenceFiles(i).filter(function (e) {
                          return e.type === h.HYPERLINK;
                        });
                        _iterator39 = _createForOfIteratorHelper(s);
                        _context9.prev = 9;
                        _iterator39.s();
                      case 11:
                        if ((_step39 = _iterator39.n()).done) {
                          _context9.next = 20;
                          break;
                        }
                        _e20 = _step39.value;
                        _context9.next = 15;
                        return t.files["word/".concat(_e20.target)].async("nodebuffer");
                      case 15:
                        _n12 = _context9.sent;
                        _i7 = o.addMedia(_n12, {
                          width: 100,
                          height: 100
                        });
                        r.Relationships.createRelationship(_e20.id, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image", "media/".concat(_i7.fileName));
                      case 18:
                        _context9.next = 11;
                        break;
                      case 20:
                        _context9.next = 25;
                        break;
                      case 22:
                        _context9.prev = 22;
                        _context9.t0 = _context9["catch"](9);
                        _iterator39.e(_context9.t0);
                      case 25:
                        _context9.prev = 25;
                        _iterator39.f();
                        return _context9.finish(25);
                      case 28:
                        _iterator40 = _createForOfIteratorHelper(a);
                        try {
                          for (_iterator40.s(); !(_step40 = _iterator40.n()).done;) {
                            _e21 = _step40.value;
                            r.Relationships.createRelationship(_e21.id, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", _e21.target, c.TargetModeType.EXTERNAL);
                          }
                        } catch (err) {
                          _iterator40.e(err);
                        } finally {
                          _iterator40.f();
                        }
                      case 30:
                      case "end":
                        return _context9.stop();
                    }
                  }, _callee9, this, [[9, 22, 25, 28]]);
                }));
              }
            }, {
              key: "findReferenceFiles",
              value: function findReferenceFiles(e) {
                var _this315 = this;
                var t = (0, i.xml2js)(e, {
                  compact: !0
                });
                return (Array.isArray(t.Relationships.Relationship) ? t.Relationships.Relationship : [t.Relationships.Relationship]).map(function (e) {
                  if (void 0 === e._attributes) throw Error("relationship element has no attributes");
                  return {
                    id: _this315.parseRefId(e._attributes.Id),
                    type: p[e._attributes.Type],
                    target: e._attributes.Target
                  };
                }).filter(function (e) {
                  return null !== e.type;
                });
              }
            }, {
              key: "extractDocumentRefs",
              value: function extractDocumentRefs(e) {
                var _this316 = this;
                var t = (0, i.xml2js)(e, {
                    compact: !0
                  })["w:document"]["w:body"]["w:sectPr"],
                  r = t["w:headerReference"];
                var n;
                n = void 0 === r ? [] : Array.isArray(r) ? r : [r];
                var o = n.map(function (e) {
                    if (void 0 === e._attributes) throw Error("header reference element has no attributes");
                    return {
                      type: e._attributes["w:type"],
                      id: _this316.parseRefId(e._attributes["r:id"])
                    };
                  }),
                  s = t["w:footerReference"];
                var a;
                return a = void 0 === s ? [] : Array.isArray(s) ? s : [s], {
                  headers: o,
                  footers: a.map(function (e) {
                    if (void 0 === e._attributes) throw Error("footer reference element has no attributes");
                    return {
                      type: e._attributes["w:type"],
                      id: _this316.parseRefId(e._attributes["r:id"])
                    };
                  })
                };
              }
            }, {
              key: "checkIfTitlePageIsDefined",
              value: function checkIfTitlePageIsDefined(e) {
                return void 0 !== (0, i.xml2js)(e, {
                  compact: !0
                })["w:document"]["w:body"]["w:sectPr"]["w:titlePg"];
              }
            }, {
              key: "parseRefId",
              value: function parseRefId(e) {
                var t = /^rId(\d+)$/.exec(e);
                if (null === t) throw new Error("Invalid ref id");
                return parseInt(t[1], 10);
              }
            }]);
            return _class37;
          }();
        },
        1057: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), o(r(1797), t);
        },
        341: function _(e, t, r) {
          "use strict";

          var n = this && this.__createBinding || (Object.create ? function (e, t, r, n) {
              void 0 === n && (n = r), Object.defineProperty(e, n, {
                enumerable: !0,
                get: function get() {
                  return t[r];
                }
              });
            } : function (e, t, r, n) {
              void 0 === n && (n = r), e[n] = t[r];
            }),
            o = this && this.__exportStar || function (e, t) {
              for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r);
            };
          Object.defineProperty(t, "__esModule", {
            value: !0
          }), t.Document = void 0;
          var i = r(7559);
          Object.defineProperty(t, "Document", {
            enumerable: !0,
            get: function get() {
              return i.File;
            }
          }), o(r(7559), t), o(r(6117), t), o(r(1057), t), o(r(5524), t);
        },
        4927: function _(e, t, r) {
          function n(e) {
            try {
              if (!r.g.localStorage) return !1;
            } catch (e) {
              return !1;
            }
            var t = r.g.localStorage[e];
            return null != t && "true" === String(t).toLowerCase();
          }
          e.exports = function (e, t) {
            if (n("noDeprecation")) return e;
            var r = !1;
            return function () {
              if (!r) {
                if (n("throwDeprecation")) throw new Error(t);
                n("traceDeprecation") ? console.trace(t) : console.warn(t), r = !0;
              }
              return e.apply(this, arguments);
            };
          };
        },
        9881: function _(e) {
          e.exports = {
            isArray: function isArray(e) {
              return Array.isArray ? Array.isArray(e) : "[object Array]" === Object.prototype.toString.call(e);
            }
          };
        },
        7888: function _(e, t, r) {
          var n = r(1229),
            o = r(1388),
            i = r(6501),
            s = r(4673);
          e.exports = {
            xml2js: n,
            xml2json: o,
            js2xml: i,
            json2xml: s
          };
        },
        6501: function _(e, t, r) {
          var n,
            o,
            i = r(4740),
            s = r(9881).isArray;
          function a(e, t, r) {
            return (!r && e.spaces ? "\n" : "") + Array(t + 1).join(e.spaces);
          }
          function u(e, t, r) {
            if (t.ignoreAttributes) return "";
            "attributesFn" in t && (e = t.attributesFn(e, o, n));
            var i,
              s,
              u,
              c,
              l = [];
            for (i in e) e.hasOwnProperty(i) && null !== e[i] && void 0 !== e[i] && (c = t.noQuotesForNativeAttributes && "string" != typeof e[i] ? "" : '"', s = (s = "" + e[i]).replace(/"/g, "&quot;"), u = "attributeNameFn" in t ? t.attributeNameFn(i, s, o, n) : i, l.push(t.spaces && t.indentAttributes ? a(t, r + 1, !1) : " "), l.push(u + "=" + c + ("attributeValueFn" in t ? t.attributeValueFn(s, i, o, n) : s) + c));
            return e && Object.keys(e).length && t.spaces && t.indentAttributes && l.push(a(t, r, !1)), l.join("");
          }
          function c(e, t, r) {
            return n = e, o = "xml", t.ignoreDeclaration ? "" : "<?xml" + u(e[t.attributesKey], t, r) + "?>";
          }
          function l(e, t, r) {
            if (t.ignoreInstruction) return "";
            var i;
            for (i in e) if (e.hasOwnProperty(i)) break;
            var s = "instructionNameFn" in t ? t.instructionNameFn(i, e[i], o, n) : i;
            if ("object" == _typeof(e[i])) return n = e, o = s, "<?" + s + u(e[i][t.attributesKey], t, r) + "?>";
            var a = e[i] ? e[i] : "";
            return "instructionFn" in t && (a = t.instructionFn(a, i, o, n)), "<?" + s + (a ? " " + a : "") + "?>";
          }
          function p(e, t) {
            return t.ignoreComment ? "" : "\x3c!--" + ("commentFn" in t ? t.commentFn(e, o, n) : e) + "--\x3e";
          }
          function h(e, t) {
            return t.ignoreCdata ? "" : "<![CDATA[" + ("cdataFn" in t ? t.cdataFn(e, o, n) : e.replace("]]>", "]]]]><![CDATA[>")) + "]]>";
          }
          function d(e, t) {
            return t.ignoreDoctype ? "" : "<!DOCTYPE " + ("doctypeFn" in t ? t.doctypeFn(e, o, n) : e) + ">";
          }
          function f(e, t) {
            return t.ignoreText ? "" : (e = (e = (e = "" + e).replace(/&amp;/g, "&")).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), "textFn" in t ? t.textFn(e, o, n) : e);
          }
          function m(e, t, r, i) {
            return e.reduce(function (e, s) {
              var c = a(t, r, i && !e);
              switch (s.type) {
                case "element":
                  return e + c + function (e, t, r) {
                    n = e, o = e.name;
                    var i = [],
                      s = "elementNameFn" in t ? t.elementNameFn(e.name, e) : e.name;
                    i.push("<" + s), e[t.attributesKey] && i.push(u(e[t.attributesKey], t, r));
                    var a = e[t.elementsKey] && e[t.elementsKey].length || e[t.attributesKey] && "preserve" === e[t.attributesKey]["xml:space"];
                    return a || (a = "fullTagEmptyElementFn" in t ? t.fullTagEmptyElementFn(e.name, e) : t.fullTagEmptyElement), a ? (i.push(">"), e[t.elementsKey] && e[t.elementsKey].length && (i.push(m(e[t.elementsKey], t, r + 1)), n = e, o = e.name), i.push(t.spaces && function (e, t) {
                      var r;
                      if (e.elements && e.elements.length) for (r = 0; r < e.elements.length; ++r) switch (e.elements[r][t.typeKey]) {
                        case "text":
                          if (t.indentText) return !0;
                          break;
                        case "cdata":
                          if (t.indentCdata) return !0;
                          break;
                        case "instruction":
                          if (t.indentInstruction) return !0;
                          break;
                        default:
                          return !0;
                      }
                      return !1;
                    }(e, t) ? "\n" + Array(r + 1).join(t.spaces) : ""), i.push("</" + s + ">")) : i.push("/>"), i.join("");
                  }(s, t, r);
                case "comment":
                  return e + c + p(s[t.commentKey], t);
                case "doctype":
                  return e + c + d(s[t.doctypeKey], t);
                case "cdata":
                  return e + (t.indentCdata ? c : "") + h(s[t.cdataKey], t);
                case "text":
                  return e + (t.indentText ? c : "") + f(s[t.textKey], t);
                case "instruction":
                  var g = {};
                  return g[s[t.nameKey]] = s[t.attributesKey] ? s : s[t.instructionKey], e + (t.indentInstruction ? c : "") + l(g, t, r);
              }
            }, "");
          }
          function g(e, t, r) {
            var n;
            for (n in e) if (e.hasOwnProperty(n)) switch (n) {
              case t.parentKey:
              case t.attributesKey:
                break;
              case t.textKey:
                if (t.indentText || r) return !0;
                break;
              case t.cdataKey:
                if (t.indentCdata || r) return !0;
                break;
              case t.instructionKey:
                if (t.indentInstruction || r) return !0;
                break;
              case t.doctypeKey:
              case t.commentKey:
              default:
                return !0;
            }
            return !1;
          }
          function b(e, t, r, i, s) {
            n = e, o = t;
            var c = "elementNameFn" in r ? r.elementNameFn(t, e) : t;
            if (null == e || "" === e) return "fullTagEmptyElementFn" in r && r.fullTagEmptyElementFn(t, e) || r.fullTagEmptyElement ? "<" + c + "></" + c + ">" : "<" + c + "/>";
            var l = [];
            if (t) {
              if (l.push("<" + c), "object" != _typeof(e)) return l.push(">" + f(e, r) + "</" + c + ">"), l.join("");
              e[r.attributesKey] && l.push(u(e[r.attributesKey], r, i));
              var p = g(e, r, !0) || e[r.attributesKey] && "preserve" === e[r.attributesKey]["xml:space"];
              if (p || (p = "fullTagEmptyElementFn" in r ? r.fullTagEmptyElementFn(t, e) : r.fullTagEmptyElement), !p) return l.push("/>"), l.join("");
              l.push(">");
            }
            return l.push(y(e, r, i + 1, !1)), n = e, o = t, t && l.push((s ? a(r, i, !1) : "") + "</" + c + ">"), l.join("");
          }
          function y(e, t, r, n) {
            var o,
              i,
              u,
              m = [];
            for (i in e) if (e.hasOwnProperty(i)) for (u = s(e[i]) ? e[i] : [e[i]], o = 0; o < u.length; ++o) {
              switch (i) {
                case t.declarationKey:
                  m.push(c(u[o], t, r));
                  break;
                case t.instructionKey:
                  m.push((t.indentInstruction ? a(t, r, n) : "") + l(u[o], t, r));
                  break;
                case t.attributesKey:
                case t.parentKey:
                  break;
                case t.textKey:
                  m.push((t.indentText ? a(t, r, n) : "") + f(u[o], t));
                  break;
                case t.cdataKey:
                  m.push((t.indentCdata ? a(t, r, n) : "") + h(u[o], t));
                  break;
                case t.doctypeKey:
                  m.push(a(t, r, n) + d(u[o], t));
                  break;
                case t.commentKey:
                  m.push(a(t, r, n) + p(u[o], t));
                  break;
                default:
                  m.push(a(t, r, n) + b(u[o], i, t, r, g(u[o], t)));
              }
              n = n && !m.length;
            }
            return m.join("");
          }
          e.exports = function (e, t) {
            t = function (e) {
              var t = i.copyOptions(e);
              return i.ensureFlagExists("ignoreDeclaration", t), i.ensureFlagExists("ignoreInstruction", t), i.ensureFlagExists("ignoreAttributes", t), i.ensureFlagExists("ignoreText", t), i.ensureFlagExists("ignoreComment", t), i.ensureFlagExists("ignoreCdata", t), i.ensureFlagExists("ignoreDoctype", t), i.ensureFlagExists("compact", t), i.ensureFlagExists("indentText", t), i.ensureFlagExists("indentCdata", t), i.ensureFlagExists("indentAttributes", t), i.ensureFlagExists("indentInstruction", t), i.ensureFlagExists("fullTagEmptyElement", t), i.ensureFlagExists("noQuotesForNativeAttributes", t), i.ensureSpacesExists(t), "number" == typeof t.spaces && (t.spaces = Array(t.spaces + 1).join(" ")), i.ensureKeyExists("declaration", t), i.ensureKeyExists("instruction", t), i.ensureKeyExists("attributes", t), i.ensureKeyExists("text", t), i.ensureKeyExists("comment", t), i.ensureKeyExists("cdata", t), i.ensureKeyExists("doctype", t), i.ensureKeyExists("type", t), i.ensureKeyExists("name", t), i.ensureKeyExists("elements", t), i.checkFnExists("doctype", t), i.checkFnExists("instruction", t), i.checkFnExists("cdata", t), i.checkFnExists("comment", t), i.checkFnExists("text", t), i.checkFnExists("instructionName", t), i.checkFnExists("elementName", t), i.checkFnExists("attributeName", t), i.checkFnExists("attributeValue", t), i.checkFnExists("attributes", t), i.checkFnExists("fullTagEmptyElement", t), t;
            }(t);
            var r = [];
            return n = e, o = "_root_", t.compact ? r.push(y(e, t, 0, !0)) : (e[t.declarationKey] && r.push(c(e[t.declarationKey], t, 0)), e[t.elementsKey] && e[t.elementsKey].length && r.push(m(e[t.elementsKey], t, 0, !r.length))), r.join("");
          };
        },
        4673: function _(e, t, r) {
          var n = r(6501);
          e.exports = function (e, t) {
            e instanceof Buffer && (e = e.toString());
            var r = null;
            if ("string" == typeof e) try {
              r = JSON.parse(e);
            } catch (e) {
              throw new Error("The JSON structure is invalid");
            } else r = e;
            return n(r, t);
          };
        },
        4740: function _(e, t, r) {
          var n = r(9881).isArray;
          e.exports = {
            copyOptions: function copyOptions(e) {
              var t,
                r = {};
              for (t in e) e.hasOwnProperty(t) && (r[t] = e[t]);
              return r;
            },
            ensureFlagExists: function ensureFlagExists(e, t) {
              e in t && "boolean" == typeof t[e] || (t[e] = !1);
            },
            ensureSpacesExists: function ensureSpacesExists(e) {
              (!("spaces" in e) || "number" != typeof e.spaces && "string" != typeof e.spaces) && (e.spaces = 0);
            },
            ensureAlwaysArrayExists: function ensureAlwaysArrayExists(e) {
              "alwaysArray" in e && ("boolean" == typeof e.alwaysArray || n(e.alwaysArray)) || (e.alwaysArray = !1);
            },
            ensureKeyExists: function ensureKeyExists(e, t) {
              e + "Key" in t && "string" == typeof t[e + "Key"] || (t[e + "Key"] = t.compact ? "_" + e : e);
            },
            checkFnExists: function checkFnExists(e, t) {
              return e + "Fn" in t;
            }
          };
        },
        1229: function _(e, t, r) {
          var n,
            o,
            i = r(6099),
            s = r(4740),
            a = r(9881).isArray;
          function u(e) {
            var t = Number(e);
            if (!isNaN(t)) return t;
            var r = e.toLowerCase();
            return "true" === r || "false" !== r && e;
          }
          function c(e, t) {
            var r;
            if (n.compact) {
              if (!o[n[e + "Key"]] && (a(n.alwaysArray) ? -1 !== n.alwaysArray.indexOf(n[e + "Key"]) : n.alwaysArray) && (o[n[e + "Key"]] = []), o[n[e + "Key"]] && !a(o[n[e + "Key"]]) && (o[n[e + "Key"]] = [o[n[e + "Key"]]]), e + "Fn" in n && "string" == typeof t && (t = n[e + "Fn"](t, o)), "instruction" === e && ("instructionFn" in n || "instructionNameFn" in n)) for (r in t) if (t.hasOwnProperty(r)) if ("instructionFn" in n) t[r] = n.instructionFn(t[r], r, o);else {
                var i = t[r];
                delete t[r], t[n.instructionNameFn(r, i, o)] = i;
              }
              a(o[n[e + "Key"]]) ? o[n[e + "Key"]].push(t) : o[n[e + "Key"]] = t;
            } else {
              o[n.elementsKey] || (o[n.elementsKey] = []);
              var s = {};
              if (s[n.typeKey] = e, "instruction" === e) {
                for (r in t) if (t.hasOwnProperty(r)) break;
                s[n.nameKey] = "instructionNameFn" in n ? n.instructionNameFn(r, t, o) : r, n.instructionHasAttributes ? (s[n.attributesKey] = t[r][n.attributesKey], "instructionFn" in n && (s[n.attributesKey] = n.instructionFn(s[n.attributesKey], r, o))) : ("instructionFn" in n && (t[r] = n.instructionFn(t[r], r, o)), s[n.instructionKey] = t[r]);
              } else e + "Fn" in n && (t = n[e + "Fn"](t, o)), s[n[e + "Key"]] = t;
              n.addParent && (s[n.parentKey] = o), o[n.elementsKey].push(s);
            }
          }
          function l(e) {
            var t;
            if ("attributesFn" in n && e && (e = n.attributesFn(e, o)), (n.trim || "attributeValueFn" in n || "attributeNameFn" in n || n.nativeTypeAttributes) && e) for (t in e) if (e.hasOwnProperty(t) && (n.trim && (e[t] = e[t].trim()), n.nativeTypeAttributes && (e[t] = u(e[t])), "attributeValueFn" in n && (e[t] = n.attributeValueFn(e[t], t, o)), "attributeNameFn" in n)) {
              var r = e[t];
              delete e[t], e[n.attributeNameFn(t, e[t], o)] = r;
            }
            return e;
          }
          function p(e) {
            var t = {};
            if (e.body && ("xml" === e.name.toLowerCase() || n.instructionHasAttributes)) {
              for (var r, i = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\w+))\s*/g; null !== (r = i.exec(e.body));) t[r[1]] = r[2] || r[3] || r[4];
              t = l(t);
            }
            if ("xml" === e.name.toLowerCase()) {
              if (n.ignoreDeclaration) return;
              o[n.declarationKey] = {}, Object.keys(t).length && (o[n.declarationKey][n.attributesKey] = t), n.addParent && (o[n.declarationKey][n.parentKey] = o);
            } else {
              if (n.ignoreInstruction) return;
              n.trim && (e.body = e.body.trim());
              var s = {};
              n.instructionHasAttributes && Object.keys(t).length ? (s[e.name] = {}, s[e.name][n.attributesKey] = t) : s[e.name] = e.body, c("instruction", s);
            }
          }
          function h(e, t) {
            var r;
            if ("object" == _typeof(e) && (t = e.attributes, e = e.name), t = l(t), "elementNameFn" in n && (e = n.elementNameFn(e, o)), n.compact) {
              var i;
              if (r = {}, !n.ignoreAttributes && t && Object.keys(t).length) for (i in r[n.attributesKey] = {}, t) t.hasOwnProperty(i) && (r[n.attributesKey][i] = t[i]);
              !(e in o) && (a(n.alwaysArray) ? -1 !== n.alwaysArray.indexOf(e) : n.alwaysArray) && (o[e] = []), o[e] && !a(o[e]) && (o[e] = [o[e]]), a(o[e]) ? o[e].push(r) : o[e] = r;
            } else o[n.elementsKey] || (o[n.elementsKey] = []), (r = {})[n.typeKey] = "element", r[n.nameKey] = e, !n.ignoreAttributes && t && Object.keys(t).length && (r[n.attributesKey] = t), n.alwaysChildren && (r[n.elementsKey] = []), o[n.elementsKey].push(r);
            r[n.parentKey] = o, o = r;
          }
          function d(e) {
            n.ignoreText || (e.trim() || n.captureSpacesBetweenElements) && (n.trim && (e = e.trim()), n.nativeType && (e = u(e)), n.sanitize && (e = e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")), c("text", e));
          }
          function f(e) {
            n.ignoreComment || (n.trim && (e = e.trim()), c("comment", e));
          }
          function m(e) {
            var t = o[n.parentKey];
            n.addParent || delete o[n.parentKey], o = t;
          }
          function g(e) {
            n.ignoreCdata || (n.trim && (e = e.trim()), c("cdata", e));
          }
          function b(e) {
            n.ignoreDoctype || (e = e.replace(/^ /, ""), n.trim && (e = e.trim()), c("doctype", e));
          }
          function y(e) {
            e.note = e;
          }
          e.exports = function (e, t) {
            var r = i.parser(!0, {}),
              a = {};
            if (o = a, n = function (e) {
              return n = s.copyOptions(e), s.ensureFlagExists("ignoreDeclaration", n), s.ensureFlagExists("ignoreInstruction", n), s.ensureFlagExists("ignoreAttributes", n), s.ensureFlagExists("ignoreText", n), s.ensureFlagExists("ignoreComment", n), s.ensureFlagExists("ignoreCdata", n), s.ensureFlagExists("ignoreDoctype", n), s.ensureFlagExists("compact", n), s.ensureFlagExists("alwaysChildren", n), s.ensureFlagExists("addParent", n), s.ensureFlagExists("trim", n), s.ensureFlagExists("nativeType", n), s.ensureFlagExists("nativeTypeAttributes", n), s.ensureFlagExists("sanitize", n), s.ensureFlagExists("instructionHasAttributes", n), s.ensureFlagExists("captureSpacesBetweenElements", n), s.ensureAlwaysArrayExists(n), s.ensureKeyExists("declaration", n), s.ensureKeyExists("instruction", n), s.ensureKeyExists("attributes", n), s.ensureKeyExists("text", n), s.ensureKeyExists("comment", n), s.ensureKeyExists("cdata", n), s.ensureKeyExists("doctype", n), s.ensureKeyExists("type", n), s.ensureKeyExists("name", n), s.ensureKeyExists("elements", n), s.ensureKeyExists("parent", n), s.checkFnExists("doctype", n), s.checkFnExists("instruction", n), s.checkFnExists("cdata", n), s.checkFnExists("comment", n), s.checkFnExists("text", n), s.checkFnExists("instructionName", n), s.checkFnExists("elementName", n), s.checkFnExists("attributeName", n), s.checkFnExists("attributeValue", n), s.checkFnExists("attributes", n), n;
            }(t), r.opt = {
              strictEntities: !0
            }, r.onopentag = h, r.ontext = d, r.oncomment = f, r.onclosetag = m, r.onerror = y, r.oncdata = g, r.ondoctype = b, r.onprocessinginstruction = p, r.write(e).close(), a[n.elementsKey]) {
              var u = a[n.elementsKey];
              delete a[n.elementsKey], a[n.elementsKey] = u, delete a.text;
            }
            return a;
          };
        },
        1388: function _(e, t, r) {
          var n = r(4740),
            o = r(1229);
          e.exports = function (e, t) {
            var r, i, s;
            return r = function (e) {
              var t = n.copyOptions(e);
              return n.ensureSpacesExists(t), t;
            }(t), i = o(e, r), s = "compact" in r && r.compact ? "_parent" : "parent", ("addParent" in r && r.addParent ? JSON.stringify(i, function (e, t) {
              return e === s ? "_" : t;
            }, r.spaces) : JSON.stringify(i, null, r.spaces)).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
          };
        },
        255: function _(e) {
          var t = {
            "&": "&amp;",
            '"': "&quot;",
            "'": "&apos;",
            "<": "&lt;",
            ">": "&gt;"
          };
          e.exports = function (e) {
            return e && e.replace ? e.replace(/([&"<>'])/g, function (e, r) {
              return t[r];
            }) : e;
          };
        },
        3479: function _(e, t, r) {
          var n = r(4155),
            o = r(255),
            i = r(2830).Stream;
          function s(e, t, r) {
            r = r || 0;
            var n,
              i,
              a = (n = t, new Array(r || 0).join(n || "")),
              u = e;
            if ("object" == _typeof(e) && (u = e[i = Object.keys(e)[0]]) && u._elem) return u._elem.name = i, u._elem.icount = r, u._elem.indent = t, u._elem.indents = a, u._elem.interrupt = u, u._elem;
            var c,
              l = [],
              p = [];
            function h(e) {
              Object.keys(e).forEach(function (t) {
                l.push(function (e, t) {
                  return e + '="' + o(t) + '"';
                }(t, e[t]));
              });
            }
            switch (_typeof(u)) {
              case "object":
                if (null === u) break;
                u._attr && h(u._attr), u._cdata && p.push(("<![CDATA[" + u._cdata).replace(/\]\]>/g, "]]]]><![CDATA[>") + "]]>"), u.forEach && (c = !1, p.push(""), u.forEach(function (e) {
                  "object" == _typeof(e) ? "_attr" == Object.keys(e)[0] ? h(e._attr) : p.push(s(e, t, r + 1)) : (p.pop(), c = !0, p.push(o(e)));
                }), c || p.push(""));
                break;
              default:
                p.push(o(u));
            }
            return {
              name: i,
              interrupt: !1,
              attributes: l,
              content: p,
              icount: r,
              indents: a,
              indent: t
            };
          }
          function a(e, t, r) {
            if ("object" != _typeof(t)) return e(!1, t);
            var n = t.interrupt ? 1 : t.content.length;
            function o() {
              for (; t.content.length;) {
                var o = t.content.shift();
                if (void 0 !== o) {
                  if (i(o)) return;
                  a(e, o);
                }
              }
              e(!1, (n > 1 ? t.indents : "") + (t.name ? "</" + t.name + ">" : "") + (t.indent && !r ? "\n" : "")), r && r();
            }
            function i(t) {
              return !!t.interrupt && (t.interrupt.append = e, t.interrupt.end = o, t.interrupt = !1, e(!0), !0);
            }
            if (e(!1, t.indents + (t.name ? "<" + t.name : "") + (t.attributes.length ? " " + t.attributes.join(" ") : "") + (n ? t.name ? ">" : "" : t.name ? "/>" : "") + (t.indent && n > 1 ? "\n" : "")), !n) return e(!1, t.indent ? "\n" : "");
            i(t) || o();
          }
          e.exports = function (e, t) {
            "object" != _typeof(t) && (t = {
              indent: t
            });
            var r,
              o,
              u = t.stream ? new i() : null,
              c = "",
              l = !1,
              p = t.indent ? !0 === t.indent ? "    " : t.indent : "",
              h = !0;
            function d(e) {
              h ? n.nextTick(e) : e();
            }
            function f(e, t) {
              if (void 0 !== t && (c += t), e && !l && (u = u || new i(), l = !0), e && l) {
                var r = c;
                d(function () {
                  u.emit("data", r);
                }), c = "";
              }
            }
            function m(e, t) {
              a(f, s(e, p, p ? 1 : 0), t);
            }
            function g() {
              if (u) {
                var e = c;
                d(function () {
                  u.emit("data", e), u.emit("end"), u.readable = !1, u.emit("close");
                });
              }
            }
            return d(function () {
              h = !1;
            }), t.declaration && (o = {
              version: "1.0",
              encoding: (r = t.declaration).encoding || "UTF-8"
            }, r.standalone && (o.standalone = r.standalone), m({
              "?xml": {
                _attr: o
              }
            }), c = c.replace("/>", "?>")), e && e.forEach ? e.forEach(function (t, r) {
              var n;
              r + 1 === e.length && (n = g), m(t, n);
            }) : m(e, g), u ? (u.readable = !0, u) : c;
          }, e.exports.element = e.exports.Element = function () {
            var e = Array.prototype.slice.call(arguments),
              t = {
                _elem: s(e),
                push: function push(e) {
                  if (!this.append) throw new Error("not assigned to a parent!");
                  var t = this,
                    r = this._elem.indent;
                  a(this.append, s(e, r, this._elem.icount + (r ? 1 : 0)), function () {
                    t.append(!0);
                  });
                },
                close: function close(e) {
                  void 0 !== e && this.push(e), this.end && this.end();
                }
              };
            return t;
          };
        },
        9862: function _() {},
        964: function _() {},
        2961: function _(e) {
          e.exports = {
            nanoid: function nanoid() {
              var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 21;
              var t = "",
                r = e;
              for (; r--;) t += "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW"[64 * Math.random() | 0];
              return t;
            },
            customAlphabet: function customAlphabet(e, t) {
              return function () {
                var r = "",
                  n = t;
                for (; n--;) r += e[Math.random() * e.length | 0];
                return r;
              };
            }
          };
        }
      },
      t = {};
    function r(n) {
      var o = t[n];
      if (void 0 !== o) return o.exports;
      var i = t[n] = {
        exports: {}
      };
      return e[n].call(i.exports, i, i.exports, r), i.exports;
    }
    return r.g = function () {
      if ("object" == (typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis))) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if ("object" == (typeof window === "undefined" ? "undefined" : _typeof(window))) return window;
      }
    }(), r(341);
  }();
});
},{"buffer":"node_modules/buffer/index.js"}],"node_modules/file-saver/dist/FileSaver.min.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(b,c,d){var e=new XMLHttpRequest;e.open("GET",b),e.responseType="blob",e.onload=function(){a(e.response,c,d)},e.onerror=function(){console.error("could not download file")},e.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(a,b,d,e){if(e=e||open("","_blank"),e&&(e.document.title=e.document.body.innerText="downloading..."),"string"==typeof a)return c(a,b,d);var g="application/octet-stream"===a.type,h=/constructor/i.test(f.HTMLElement)||f.safari,i=/CriOS\/[\d]+/.test(navigator.userAgent);if((i||g&&h)&&"object"==typeof FileReader){var j=new FileReader;j.onloadend=function(){var a=j.result;a=i?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),e?e.location.href=a:location=a,e=null},j.readAsDataURL(a)}else{var k=f.URL||f.webkitURL,l=k.createObjectURL(a);e?e.location=l:location.href=l,e=null,setTimeout(function(){k.revokeObjectURL(l)},4E4)}});f.saveAs=a.saveAs=a,"undefined"!=typeof module&&(module.exports=a)});


},{}],"src/index.js":[function(require,module,exports) {
"use strict";

var _docx = require("docx");
var _fileSaver = require("file-saver");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
// Listen for clicks on Generate Word Document button
document.getElementById("generate").addEventListener("click", function (event) {
  generateWordDocument(event);
}, false);
function removeEmpty(song) {
  return song != "" && song != " " && song != null && song != undefined;
}
function generateWordDocument(event) {
  event.preventDefault();
  var textarea = document.getElementById("songs");
  if (!textarea) return;
  var songs = textarea.value.split("\n").filter(removeEmpty);
  var title = document.getElementById("fname").value;
  var files = document.getElementById("numfiles").value;
  var columnes = document.getElementById("numcolumnes").value;
  var cells = files * columnes;
  var num = document.getElementById("num").value;
  var cartrons = [];
  var cartro;
  var auxset;
  var number;
  var sortedaux1, sortedaux2;
  var iguals;
  var error = 0;
  for (var i = 0; i < num && error < 100;) {
    auxset = _toConsumableArray(songs);
    cartro = [];
    for (var j = 0; j < cells; j++) {
      number = Math.floor(Math.random() * auxset.length);
      cartro.push(auxset[number]); //Pot ser cartro.push(auxset.splice(number, 1)); crec
      auxset.splice(number, 1);
    }
    for (var k = 0; k < cartrons.length; k++) {
      iguals = false;
      sortedaux1 = _toConsumableArray(cartro);
      sortedaux1.sort();
      sortedaux2 = _toConsumableArray(cartrons[k]);
      sortedaux2.sort();
      if (sortedaux1.toString() === sortedaux2.toString())
        //Segurament es poden posar moltes coses juntes. (sort i tostring)
        {
          iguals = true;
          break;
        }
    }
    error++;
    if (!iguals) {
      cartrons.push(cartro);
      i++;
      error = 0;
    }
  }
  var tc,
    tr,
    t = [];
  var row, tab;
  for (var i = 0; i < num; i++) {
    tr = [];
    for (var fil = 0; fil < files; fil++) {
      tc = [];
      for (var col = 0; col < columnes; col++) {
        tc.push(new _docx.TableCell({
          width: {
            size: 100 / columnes,
            type: _docx.WidthType.PERCENTAGE
          },
          verticalAlign: _docx.VerticalAlign.CENTER,
          margins: {
            top: (0, _docx.convertMillimetersToTwip)(5),
            bottom: (0, _docx.convertMillimetersToTwip)(5),
            left: (0, _docx.convertMillimetersToTwip)(2),
            right: (0, _docx.convertMillimetersToTwip)(2)
          },
          children: [new _docx.Paragraph({
            alignment: _docx.AlignmentType.CENTER,
            children: [new _docx.TextRun({
              text: cartrons[i][columnes * fil + col],
              bold: true,
              size: 20,
              alignment: _docx.AlignmentType.CENTER
            })]
          })]
        }));
      }
      tr.push(new _docx.TableRow({
        children: tc,
        cantSplit: true
      }));
    }
    t.push(new _docx.Table({
      rows: [new _docx.TableRow({
        children: [new _docx.TableCell({
          children: [new _docx.Paragraph({
            children: [new _docx.TextRun({
              text: title,
              bold: true,
              size: 40
            })]
          }), new _docx.Table({
            rows: tr
          })],
          borders: {
            top: {
              size: 1
            },
            bottom: {
              size: 1
            },
            left: {
              size: 1
            },
            right: {
              size: 1
            }
          }
        })],
        cantSplit: true
      })],
      margins: {
        bottom: (0, _docx.convertMillimetersToTwip)(30)
      }
    }));
  }
  var doc = new _docx.Document({
    sections: [{
      children: t
    }]
  });
  _docx.Packer.toBlob(doc).then(function (blob) {
    (0, _fileSaver.saveAs)(blob, "Bingo.docx");
  });
}
},{"docx":"node_modules/docx/build/index.js","file-saver":"node_modules/file-saver/dist/FileSaver.min.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54875" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map