# fishingrod

A simple module for making http requests, depends on `nothing` but `http` and `https`.

`NOTE:` this is not intended to be a full-featured http package, or a full-tested module. This is a simple,
working http module, that permits very simple requests. `Do not use in production without testing`.


## Simple Example

```javascript
var fr = require('fishingrod');

fr.fish({
	https:true,
	host: 'example.com',
	path: '/obj/1'
},
function(err, st, res){
	console.log(res);
});

fr.fish({
	https:true,
	host: 'example.com',
	path: '/obj/2'
}).then(function(res){
	console.log(res.response);
});


``` 