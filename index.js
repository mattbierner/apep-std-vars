"use strict";

var pep = require('apep');

var pep_vars = module.exports = function () {
    var proto = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    return Object.create(proto, Object.getOwnPropertyNames(pep_vars).reduce(function (p, c) {
        p[c] = Object.getOwnPropertyDescriptor(pep_vars, c);
        return p;
    }, {}));
};

/**
    Clear the value of a variable.
    
    @param name Variable name.
*/
pep_vars.clear = function (name) {
    return pep.set(name, undefined);
};

/**
    Set the variable `name` to the result of `generator`.

    Combines multiple yielded values. Yields the result value.

    @param f Accumulator function to reduce multiple yields from `generator` to
        a single value.
    @param z Initial value for accumulator.
    @param name Variable name.
    @param generator Generator run to produce the value.
*/
pep_vars.setFromCombined = function (f, z, name, generator) {
    return pep.chain(pep.combine(f, z, generator), function (val) {
        return pep.seq(pep.set(name, val), pep.lit(val));
    });
};

/**
    Set the variable `name` to the result of `generator`.

    @param name Variable name.
    @param generator Generator run to produce the value.

    The function always stores value as strings. The output of multiple
    yielding generators are joined together into a single string value which 
    is yielded once.
*/
pep_vars.setFrom = pep_vars.setFromCombined.bind(null, function (p, c) {
    return p + c;
}, '');

/**
    Get the currently stored value of a variable or compute it with a generator.

    @see setFromCombined
*/
pep_vars.storeCombined = function (f, z, name, generator) {
    var computeValue = pep_vars.setFromCombined(f, z, name, generator);
    return pep.get(name, null).chain(function (x) {
        return x === null || x === undefined ? computeValue : pep.lit(x);
    });
};

/**
    Get the currently stored value of a variable or compute it with a generator.

    @see setFrom
*/
pep_vars.store = pep_vars.storeCombined.bind(null, function (p, c) {
    return p + c;
}, '');
//# sourceMappingURL=index.js.map
