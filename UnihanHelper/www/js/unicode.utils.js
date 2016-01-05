var Unicode = {};

(function () {
    /*String.fromCodePoint Polyfill*/
    if (!String.fromCodePoint) {
        (function () {
            var defineProperty = (function () {
                // IE 8 only supports `Object.defineProperty` on DOM elements
                try {
                    var object = {};
                    var $defineProperty = Object.defineProperty;
                    var result = $defineProperty(object, object, object) && $defineProperty;
                } catch (error) { }
                return result;
            }());
            var stringFromCharCode = String.fromCharCode;
            var floor = Math.floor;
            var fromCodePoint = function () {
                var MAX_SIZE = 0x4000;
                var codeUnits = [];
                var highSurrogate;
                var lowSurrogate;
                var index = -1;
                var length = arguments.length;
                if (!length) {
                    return '';
                }
                var result = '';
                while (++index < length) {
                    var codePoint = Number(arguments[index]);
                    if (
                      !isFinite(codePoint) ||       // `NaN`, `+Infinity`, or `-Infinity`
                      codePoint < 0 ||              // not a valid Unicode code point
                      codePoint > 0x10FFFF ||       // not a valid Unicode code point
                      floor(codePoint) != codePoint // not an integer
                    ) {
                        throw RangeError('Invalid code point: ' + codePoint);
                    }
                    if (codePoint <= 0xFFFF) { // BMP code point
                        codeUnits.push(codePoint);
                    } else { // Astral code point; split in surrogate halves
                        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                        codePoint -= 0x10000;
                        highSurrogate = (codePoint >> 10) + 0xD800;
                        lowSurrogate = (codePoint % 0x400) + 0xDC00;
                        codeUnits.push(highSurrogate, lowSurrogate);
                    }
                    if (index + 1 == length || codeUnits.length > MAX_SIZE) {
                        result += stringFromCharCode.apply(null, codeUnits);
                        codeUnits.length = 0;
                    }
                }
                return result;
            };
            if (defineProperty) {
                defineProperty(String, 'fromCodePoint', {
                    'value': fromCodePoint,
                    'configurable': true,
                    'writable': true
                });
            } else {
                String.fromCodePoint = fromCodePoint;
            }
        }());
    }
    /*END Polyfill*/

    function fixedCharCodeAt(str, idx) {
        // ex. fixedCharCodeAt('\uD800\uDC00', 0); // 65536
        // ex. fixedCharCodeAt('\uD800\uDC00', 1); // false
        idx = idx || 0;
        var code = str.charCodeAt(idx);
        var hi, low;

        // High surrogate (could change last hex to 0xDB7F to treat high
        // private surrogates as single characters)
        if (0xD800 <= code && code <= 0xDBFF) {
            hi = code;
            low = str.charCodeAt(idx + 1);
            if (isNaN(low)) {
                throw 'High surrogate not followed by low surrogate in fixedCharCodeAt()';
            }
            return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
        }
        if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
            // We return false to allow loops to skip this iteration since should have
            // already handled high surrogate above in the previous iteration
            return false;
            /*hi = str.charCodeAt(idx - 1);
            low = code;
            return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;*/
        }
        return code;
    }

    /**
     * Unicode.getCodePoint(str)
     * Function: get code point of a character
     * Parameters:
     *   - str: the character in query
     * Return value:
     *   U+XXXX format
     */
    Unicode.getCodePoint = function (str) {
        return 'U+' + fixedCharCodeAt(str, 0).toString(16).toUpperCase();
    }

    /**
     * Unicode.getCodeInt(str)
     */
    Unicode.getCodeInt = function (str) {
        return fixedCharCodeAt(str, 0);
    }

    /**
     * Unicode.codePointToChar(str)
     * Function: get unicode character based on code point
     * Parameters:
     *   - str: code point in format U+XXXX
     * Return value:
     *   A single character
     */
    Unicode.codePointToChar = function(str) {
        var hexString;
        if (str[0] == 'U' && str[1] == '+') {
            hexString = str.substr(2);
            decValue = parseInt(hexString, 16);
            return String.fromCodePoint(decValue);
        }
        else {
            return undefined;
        }
    }
})();

