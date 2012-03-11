// generates a CommonJS module
// run with: js commonjs.js

print(read("match.js"));

var exports = JSON.parse(read("exports.json")).exports;
for (var exp in exports) {
    print("exports." + exp + " = " + exports[exp] + ";");
}
