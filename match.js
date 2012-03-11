function _isNaN(x) {
    return typeof x === "number" && x !== x;
}

var _toString = Object.prototype.toString;
var _hasOwn = Object.prototype.hasOwnProperty;

function classOf(x) {
    var s = _toString.call(x);
    return s.substring(8, s.length - 1);
}

var NO_MATCH = { toString: function() { return "NO_MATCH" } };

function Pattern(doMatch, then) {
    this._doMatch = typeof then === "function" ? function(x) {
        var y = doMatch(x);
        if (y === NO_MATCH)
            return NO_MATCH;
        return then(y);
    } : doMatch;
}

var Pp = Pattern.prototype;

Pp.match = function(act) {
    // FIXME: compute informative error message
    var x = this._doMatch(act);
    if (x === NO_MATCH)
        throw new MatchError();
    return x;
};

var Any = predicatePattern(function(x) { return true });

var _ = Any;

var None = predicatePattern(function(x) { return false });

function instance(ctor) {
    return function(x) {
        return x instanceof ctor;
    }
}

function hasType(t) {
    return function(x) {
        return typeof x === t;
    }
}

function hasClass(c) {
    return function(x) {
        return typeof(x) === "object" && classOf(x) === c;
    }
}

function equals(v) {
    return function(x) {
        return x === v;
    }
}

function predicatePattern(pred, then) {
    return new Pattern(function(x) {
        return pred(x)
             ? (typeof then === "function" ? then(x) : x)
             : NO_MATCH;
    });
}

function ArrayPattern(a, then) {
    return new Pattern(function(x) {
        if (typeof x !== "object")
            return NO_MATCH;
        var n = a.length, m = +x.length;
        if (!(m >= n))
            return NO_MATCH;
        var result = [];
        for (var i = 0; i < n; i++) {
            var y = a[i]._doMatch(x[i]);
            if (y === NO_MATCH)
                return NO_MATCH;
            result[i] = y;
        }
        return result;
    }, then);
}

function ObjectPattern(a, then) {
    return new Pattern(function(x) {
        if (typeof x !== "object")
            return NO_MATCH;
        for (var i = 0, n = a.length, result = {}; i < n; i++) {
            var pair = a[i], key = pair[0], p = pair[1], y = p._doMatch(x[key]);
            if (y === NO_MATCH)
                return NO_MATCH;
            result[key] = y;
        }
        return result;
    }, then);
}

function cases() {
    var patterns = arguments;
    return new Pattern(function(x) {
        for (var n = patterns.length, i = 0; i < n; i++) {
            var y = patterns[i]._doMatch(x);
            if (y !== NO_MATCH)
                return y;
        }
        return NO_MATCH;
    });
}

function on(pattern, then) {
    if (pattern === Boolean)
        return predicatePattern(hasType("boolean"), then);
    if (pattern === Number)
        return predicatePattern(hasType("number"), then);
    if (pattern === String)
        return predicatePattern(hasType("string"), then);
    if (pattern === Date)
        return predicatePattern(hasClass("Date"), then);
    if (pattern === Object)
        return predicatePattern(hasType("object"), then);
    if (pattern === Function)
        return predicatePattern(hasType("function"), then);
    if (_isNaN(pattern))
        return predicatePattern(_isNaN, then);
    if (pattern == null || typeof pattern === "boolean" || typeof pattern === "string" || typeof pattern === "number")
        return predicatePattern(equals(pattern), then);
    if (typeof pattern === "function")
        return predicatePattern(pattern, then);
    if (pattern instanceof Pattern)
        return then ? new Pattern(function(x) { return pattern._doMatch(x) }, then) : pattern;

    switch (classOf(pattern)) {
      case "RegExp":
        return new Pattern(function(x) { return pattern.exec(x) || NO_MATCH }, then);

      case "Date":
        var v = +pattern;
        return predicatePattern(function(x) {
            return typeof x === "object" &&
                classOf(x) === "Date" &&
                +x === v;
        }, then);

      case "Array":
        return new ArrayPattern(pattern.map(on), then);

      default:
        return new ObjectPattern(mapObject(pattern, on), then);
    }
}

function mapObject(obj, f, thisArg) {
    var result = [];
    for (var key in obj) {
        if (_hasOwn.call(obj, key)) {
            result.push([key, f.call(thisArg, obj[key], key)]);
        }
    }
    return result;
}

function MatchError(msg) {
    this.message = msg;
}

MatchError.prototype = {
    toString: function() {
        return "match error: " + this.message;
    }
};
