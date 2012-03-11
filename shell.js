// dynamically load match.js at the SpiderMonkey shell
// run with: js -i shell.js

evalWithLocation((function() {
    var body = read("match.js");
    var exports = JSON.parse(read("exports.json")).exports;
    var prologue = "(function() { ";
    var epilogue = "";
    for (var exp in exports) {
        epilogue += "this." + exp + " = " + exports[exp] + ";\n";
    }
    epilogue += "}).call(this)";
    return prologue + body + epilogue;
})(), "match.js", 1);
