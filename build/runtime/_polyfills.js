'use strict';

if(!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        if(this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if(typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for(var i = 0; i < length; i++) {
            value = list[i];
            if(predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

if(!String.prototype.includes) {
    String.prototype.includes = function() {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

if(![].includes) {
    Array.prototype.includes = function(searchElement/*, fromIndex*/) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length) || 0;
        if(len === 0) {
            return false;
        }
        var n = parseInt(arguments[1]) || 0;
        var k;
        if(n >= 0) {
            k = n;
        } else {
            k = len + n;
            if(k < 0) {
                k = 0;
            }
        }
        while(k < len) {
            var currentElement = O[k];
            if(searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)
            ) {
                return true;
            }
            k++;
        }
        return false;
    };
}

if(!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        }
    });
}

if(!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target, firstSource) {
            'use strict';
            if(target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            for(var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if(nextSource === undefined || nextSource === null) {
                    continue;
                }

                var keysArray = Object.keys(Object(nextSource));
                for(var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if(desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}