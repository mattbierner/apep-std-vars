"use strict";
const pep = require('apep');
const pep_vars = require('../index');
const assert = require('assert');

describe('vars.store', function () {
    it('Should extend pep.', () => {
        const pep2 = pep_vars(pep);
        let g = 0;
     
        const p = pep2.store('a',
            pep2.lit(5).map(x => { g = x; return x }));
        
        assert.deepStrictEqual(['5'], Array.from(p));
        assert.strictEqual(5, g);
        
        assert.strictEqual(undefined, pep.store);
    });

    it('Should yield stored single value, converting to string.', () => {
        let g = 0;
    
        const p = pep_vars.store('a',
            pep.lit(5).map(x => { g = x; return x }));
        
        assert.deepStrictEqual(['5'], Array.from(p));
        assert.strictEqual(5, g);
    });
    
    it('Should always yield stored multiple value as a string.', () => {
        let g = 0;
    
        const p = pep.seq(
            pep_vars.store('a',
                pep.seq(pep.lit(1), pep.lit(20), pep.lit(300))
                    .map(x => { g += x; return x })),
            pep.get('a'));
                
        assert.deepStrictEqual(['120300', '120300'], Array.from(p));
        assert.strictEqual(321, g);
    });
    
    it('Should only be computed once.', () => {
        let g = 0;
    
        const a = pep_vars.store('a', pep.lit(5).map(x => { ++g; return x }));
    
        const p = pep.seq(a, a, a);
        assert.strictEqual('555', pep.run(p));
        assert.strictEqual(1, g);
    });
    
    it('Should not be evaluated if already set, but should yield current value.', () => {
        let g = 0;
    
        const p = pep.seq(
            pep.set('a', 100),
            pep_vars.store('a', pep.lit(5).map(x => { g = x; return x })),
            pep.get('a'));
        assert.strictEqual('100100', pep.run(p));
        assert.strictEqual(0, g);
    });
    
    it('Should be reevaluated after clear.', () => {
        let g = 0;
    
        const a = pep_vars.store('a', pep.lit(5).map(x => { ++g; return x; }));
        const p = pep.seq(
            a,
            'x',
            pep_vars.clear('a'),
            'y',
            a,
            pep.get('a'));
        assert.strictEqual('5xy55', pep.run(p));
        assert.strictEqual(2, g);
    });
});

