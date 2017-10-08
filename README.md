# fishingrod

A simple module for making http requests, depends on `nothing` but `http` and `https`.

`NOTE:` this is not intended to be a full-featured http package, or a full-tested module. This is a simple,
working http module, that permits very simple requests. `Do not use in production without testing`.


## Simple Example

```javascript
const fishingrod = require('fishingrod');

fishingrod.fish({
	https:true,
	host: 'example.com',
	path: '/obj/1'
},
function(err, st, res){
	console.log(res);
});

fishingrod.fish({
	https:true,
	host: 'example.com',
	path: '/obj/2'
}).then(function(res){
	console.log(res.response);
});


``` 

## Utility methods

You can also call `fishingrod` with only a url using the utility methods. These are `.get`, `.post`, `.put`, `.delete`, `._method`.
They all take `(url [STRING], data[OBJECT], headers[OBJECT])` as params, except `_method` which takes `(method, [STRING CAPITALS], url [STRING], data[OBJECT], headers[OBJECT])`.

```javascript
const fishingrod = require('fishingrod');

fishingrod.get('http://google.com', {query:'Bottomatik chatbots'}, {'Accept':'application/pdf'});
```