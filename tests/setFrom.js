"use strict";
const pep = require('apep');
const pep_vars = require('../index');
const assert = require('assert');

describe('setFrom', function () {
    it('Should extend pep.', () => {
        const pep2 = pep_vars(pep);
     
        const p = pep2.setFrom('a', pep2.lit(5));
        
        assert.deepStrictEqual(['5'], Array.from(p));        
        assert.strictEqual(undefined, pep.setFrom);
    });

    it('Should yield stored single value, converting to string.', () => {
        let g = 0;
    
        const p = pep.seq(
            pep_vars.setFrom('a',
                pep.lit(5).map(x => { ++g; return x })),
            'a',
            pep.get('a'));
        
        assert.deepStrictEqual(['5', 'a', '5'], Array.from(p));
        assert.strictEqual(1, g);
    });
    
    it('Should always yield stored multiple value as a string.', () => {
        let g = 0;
    
        const p = pep.seq(
            pep_vars.setFrom('a',
                pep.seq(pep.lit(1), pep.lit(20), pep.lit(300))
                    .map(x => { g += x; return x })),
            pep.get('a'));
                
        assert.deepStrictEqual(['120300', '120300'], Array.from(p));
        assert.strictEqual(321, g);
    });
    
    it('Should be computed every time it is called.', () => {
        let g = 0;
    
        const a = pep_vars.setFrom('a', pep.lit(5).map(x => { ++g; return x }));
    
        const p = pep.seq(a, a, a);
        assert.strictEqual('555', pep.run(p));
        assert.strictEqual(3, g);
    });
    
});

