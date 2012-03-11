// generates a pure web version
// run with: js web.js

print("(function(global) {");
print("var hasMatch = Object.hasOwnProperty.call(global, 'match');");
print("var oldMatch = global.match;");
print("function uninstall() {");
print("    if (hasMatch)");
print("        global.match = oldMatch;");
print("    else");
print("        delete global.match;");
print("    return match;");
print("}");
print("var match = {};");
print();

print(read("match.js"));

var exports = JSON.parse(read("exports.json")).exports;

for (var exp in exports) {
    print("match." + exp + " = " + exports[exp] + ";");
}
print("global.match = match;");
print("})(this);");
