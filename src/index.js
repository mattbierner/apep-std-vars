"use strict";
const pep = require('apep');

const pep_vars = module.exports = (proto = {}) =>
    Object.create(proto, Object.getOwnPropertyNames(pep_vars)
        .reduce((p, c) => {
            p[c] = Object.getOwnPropertyDescriptor(pep_vars, c);
            return p;
        }, {}));

/**
    Clear the value of a variable.
    
    @param name Variable name.
*/
pep_vars.clear = (name) =>
    pep.set(name, undefined);

/**
    Set the variable `name` to the result of `generator`.

    Combines multiple yielded values. Yields the result value.

    @param f Accumulator function to reduce multiple yields from `generator` to
        a single value.
    @param z Initial value for accumulator.
    @param name Variable name.
    @param generator Generator run to produce the value.
*/
pep_vars.setFromCombined = (f, z, name, generator) =>
    pep.chain(pep.combine(f, z, generator), val =>
        pep.seq(pep.set(name, val), pep.lit(val)));

/**
    Set the variable `name` to the result of `generator`.

    @param name Variable name.
    @param generator Generator run to produce the value.

    The function always stores value as strings. The output of multiple
    yielding generators are joined together into a single string value which 
    is yielded once.
*/
pep_vars.setFrom = pep_vars.setFromCombined.bind(null, (p, c) => p + c, '');

/**
    Get the currently stored value of a variable or compute it with a generator.

    @see setFromCombined
*/
pep_vars.storeCombined = (f, z, name, generator) => {
    const computeValue = pep_vars.setFromCombined(f, z, name, generator);
    return pep.get(name, null)
        .chain(x =>
            x === null || x === undefined ? computeValue : pep.lit(x));
};

/**
    Get the currently stored value of a variable or compute it with a generator.

    @see setFrom
*/
pep_vars.store = pep_vars.storeCombined.bind(null, (p, c) => p + c, '');

