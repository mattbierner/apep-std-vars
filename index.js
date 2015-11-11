"use strict";

var pep = require('apep');

var pep_vars = module.exports = function () {
    var proto = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    return Object.create(proto, {
        'clear': { value: pep_vars.clear },
        'storeCombined': { value: pep_vars.storeCombined },
        'store': { value: pep_vars.store }
    });
};

/**
    Clear the value of a variable.
    
    @param name Variable name.
*/
pep_vars.clear = function (name) {
    return pep.set(name, undefined);
};

/**
    Get the currently stored value of a variable or compute it with a generator.

    Yields the result value.

    @param f Accumulator function to reduce multiple yields from `generator` to
        a single value.
    @param z Initial value for accumulator.
    @param name Variable name.
    @param generator Generator run to produce the value.

    The function always stores value as strings. The output of multiple
    yielding generators are joined together into a single string value which 
    is yielded once.
*/
pep_vars.storeCombined = function (f, z, name, generator) {
    var computeValue = pep.chain(pep.combine(f, z, generator), function (val) {
        return pep.seq(pep.set(name, val), pep.lit(val));
    });

    return pep.get(name, null).chain(function (x) {
        return x === null || x === undefined ? computeValue : pep.lit(x);
    });
};

/**
    Get the currently stored value of a variable or compute it with a generator.

    Yields the result value.

    @param name Variable name.
    @param generator Generator run to produce the value.

    The function always stores value as strings. The output of multiple
    yielding generators are joined together into a single string value which 
    is yielded once.
*/
pep_vars.store = pep_vars.storeCombined.bind(null, function (p, c) {
    return p + c;
}, '');
//# sourceMappingURL=index.js.map
