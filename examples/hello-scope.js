const Egg = require("../lib/runtime-support.js");
Egg.print("computed value = ", (() => {
    let $x = 4
    let $inc = function($w) {
        if (arguments.length !== 1) throw Error("Function called with wrong number of arguments");
        return (() => {
            let $y = 999
            return ($w + 1)
        })()

    }

    let $z = -1
    return $x = $inc($x)
})());