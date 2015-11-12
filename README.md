# Apep-std-vars

Common generators and combinators for working with variables in [Apep Javascript text generation library][apep].

## Usage
```sh
$ npm install apep-std-vars
```

You can either use `apep-std-vars` as its own include:

```js
const pep = require('apep');
const pep_vars = require('apep-std-vars');

const p = pep_vars.store(...);
```

Or by extending an Apep instance:

```js
let pep = require('apep');
pep = require('apep-std-vars')(pep);

const p = pep.store(...);
```

Extension does not alter the original Apep include but creates a simple proxy that also has the std-var functionality. 

## Documentation

#### `clear(name)`
Delete a variable.

* `name` - Variable name.

#### `store(name, generator)`
Get the currently stored value of a variable or compute it with a generator.

* `name` - Variable name.
* `generator` -  Generator run to produce the value.

```js
// Make sure we always use the same name after computing it.
const name = pep_vars.store('name', pep.choice('Alice', 'Bob'))

const p = pep.seq(
    'Affirmative, ', name '. I read you. ',
    'Im sorry, ', name, ". Im afraid I cant do that.");

p.run() === "Affirmative, Dave. I read you. Im sorry Dave. Im afraid I cant do that."
p.run() === "Affirmative, Alice. I read you. Im sorry Alice. Im afraid I cant do that."
```

Always stores value as strings. The output of multiple
yielding generators are joined together into a single string value. `store` yields this combined value as its result.

```js
const v = pep_vars.store('joined_var',
    pep.seq(
        pep.lit(1.2),
        pep.lit({}),
        pep.lit(null)));

const p = pep.seq(v, v)

Array.from(p) === ['1.2[Object object]null', '1.2[Object object]null'];
```

Use `storeCombined` if you need to store non-string values.


#### `storeCombined(f, z, name, generator)`
Same behavior as store, but combines multiple yielded values with an accumulator function.

* `f` - Accumulator function to reduce multiple yields from `generator` to a single value.
* `z` - Initial value for accumulator.
* `name` - Variable name.
* `generator` - Generator run to produce the value.



[apep]: https://github.com/mattbierner/apep
