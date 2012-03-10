# match.js

A pattern-matching library for JS.

A simple example:

``` javascript
cases(on({ foo: Number, bar: Number }, function(o) { return o.foo + o.bar }),
      on([String, String, String]), function(a) { return a[0] + a[1] + a[2] })
 .match(f())
```

The same example, using ES6 destructuring:

``` javascript
cases(on({ foo: Number, bar: Number }, function({ foo, bar }) { return foo + bar }),
      on([String, String, String]), function([a, b, c]) { return a + b + c })
 .match(f())
```

Same example again, using [arrow syntax](https://gist.github.com/2011902) (which makes me go "squee!"):

``` javascript
cases(on({ foo: Number, bar: Number }, ({ foo, bar }) => foo + bar),
      on([String, String, String]), ([a, b, c]) => a + b + c)
 .match(f())
```

# The pattern API

```
pattern ::=                              match condition                        match result
                                         -----------------------------------    --------------------
  the Boolean function                   typeof x === "boolean"                 x
| the Number function                    typeof x === "number"                  x
| the String function                    typeof x === "string"                  x
| the Date function                      x.[[Class]] === "Date"                 x
| the Object function                    typeof x === "object" &&               x
                                           x !== null                           
| the Function function                  typeof x === "function"                x
| the Array function                     x.[[Class]] === "Array"                x
| function                               f(x)                                   x
| null                                   x === null                             null
| undefined                              x === void 0                           undefined
| boolean                                x === b                                b
| NaN                                    isNaN(x)                               NaN
| number other than NaN                  x === n                                n
| string                                 x === s                                s
| Date                                   x.[[Class]] === "Date" &&              d
                                           +x === +d                            
| regexp                                 r.match(x)                             result of r.match(x)
| { x1: pattern1, ..., xn: patternn }    typeof x === "object" &&               object w/ each match
                                           for each i, x.xi matches patterni    
| [ pattern1, ..., patternn ]            typeof x === "object" &&               array w/ each match
                                         x.length > n &&                        
                                           for each i, x[i] matches patterni    
| Pattern                                p.match(x)                             result of p.match(x)
```

# Pattern objects

A `Pattern<a>` is a Pattern object whose `match` method returns values of type `a` on successful matches.

A `pattern<a>` is pattern syntax value that produces a `Pattern<a>`.

## on(patt [, action])

**Type:** `(pattern<a>[, (a) -> b]) -> Pattern<b>`

## cases(patt, ...)

**Type:** `(Pattern<a>, ...) -> Pattern<a>`

## instance(ctor)

**Type:** `(Function) -> (any) -> boolean`

Returns a predicate that checks for instances of `ctor`.

## Pattern.prototype.match(x)

**Type:** `(this: Pattern<a>, any) -> a`

## Any

**Type:** `Pattern<true>`

## None

**Type:** `Pattern<nothing>`

