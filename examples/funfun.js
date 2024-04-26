const Egg = require("../lib/translation-support.js");
(() => {
    let $f = function($x) {
        if (arguments.length !== 1) throw Error("Function called with wrong number of arguments");
        return function($y) {
            if (arguments.length !== 1) throw Error("Function called with wrong number of arguments");
            return ($x + $y)
        }

    }

    return Egg.print($f(2)(4));
})()