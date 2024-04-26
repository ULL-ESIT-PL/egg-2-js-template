const Egg = require("../lib/runtime-support.js");
(() => {
    let $f = function($x, $y) {
        if (arguments.length !== 2) throw Error("Function called with wrong number of arguments");
        return $x($y)
    }

    let $g = function($z) {
        if (arguments.length !== 1) throw Error("Function called with wrong number of arguments");
        return ($z + 1)
    }

    return Egg.print($f($g, 4));
})()