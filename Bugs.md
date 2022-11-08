### Groups on regex doesn't work

I try to use named groups on regex but it doesn't work. I have this code:

````js
const regex = /(?<name>\w+):(?<value>\w+)/g;
const str = 'name:foo;value:bar';
const result = str.matchAll(regex);
for (const match of result) {
  console.log(match.groups);
}
// Output expect { name: 'name', value: 'foo' }
// Output actual { }


### Array.from() doesn't work for Map.keys()

I try to use Array.from() for Map.keys() but it doesn't work. I have this code:

```js
const map = new Map();
map.set('foo', 'bar');
const keys = Array.from(map.keys());
console.log(keys);
// Output expect [ 'foo' ]
// Output actual [ '0' ]
````
