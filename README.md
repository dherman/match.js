# match.js

A pattern-matching library for JS.

An example using ES6 destructuring:

``` javascript
cases(on({ foo: Number, bar: Number }, function({ foo, bar }) { return foo + bar }),
      on([ String, String, String]), function([a, b, c]) { return a + b + c })
 .match(f())
```

Same example in ES3:

``` javascript
cases(on({ foo: Number, bar: Number }, function(o) { return o.foo + o.bar }),
      on([ String, String, String]), function(a) { return a[0] + a[1] + a[2] })
 .match(f())
```

# The pattern API

```
pattern ::=                              match condition                        match result
                                         -----------------------------------    --------------------
  the Any function                       true                                   x
| the Boolean function                   typeof x === "boolean"                 x
| the Number function                    typeof x === "number"                  x
| the String function                    typeof x === "string"                  x
| the Date function                      x.[[Class]] === "Date"                 x
| the Object function                    typeof x === "object" &&               x
                                           x !== null                           
| the Function function                  typeof x === "function"                x
| the Array function                     x.[[Class]] === "Array"                x
| NaN                                    SameValue(x, NaN)                      NaN
| -0                                     SameValue(x, -0)                       -0
| null                                   x === null                             null
| undefined                              x === void 0                           undefined
| boolean                                x === b                                b
| number                                 x === n                                n
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

* `on(p :: pattern [, action :: Function]) :: Pattern`

* `cases(p :: Pattern, ...) :: Pattern`

* `Pattern.prototype.match(x)`

