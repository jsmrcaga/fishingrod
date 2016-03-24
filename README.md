# fishingrod

A simple module for making http requests, depends on `nothing` but `http` and `https`.

`NOTE:` this is not intended to be a full-featured http package, or a full-tested module. This is a simple,
working http module, that permits very simple requests. `Do not use in production without testing`.

Every new call to `fish` will modify the general options.

## Example

```javascript
var fr = require('fishingrod');

fr.fish("example.com",
	function(st, res){
		console.log(res);
	});
```

## API

### Config

#### `fr.config.https`

##### `.enable()`

Enables HTTPS for requests. HTTPS will remain activated until changed.

##### `.disable()`

Disables HTTPS and enables HTTP. Will remain active until changed.

#### `fr.config.options.set(*options*)`

Takes an `Object` as parameter. Typically the same as `http.request`.

Accepted options are: 

| Name | Type | Definition |
|--------|------|-----------|
| `https | ssl` | `Boolean` | Defines if request will use HTTPS |
| `host | hostname` | `String` | The host to call, example: `example.com` |
| `path` | `String` (begins with `/`) | The path to append to the `host`. |
| `port` | `Integer` | The port to be used in HTTP request. |
| `encoding` | `String` | The encoding to use when sending the request |
| `headers` | `Object`  | An object, defining the key-value pairs of the headers to send. Can be used to send basic HTTP auth (`Authentication` : `Basic *base64EncodedCredentials*`) |
| `method` | `String` | A string among: `GET`, `PUT`, `POST`, `DELETE`, `PATCH` |

#### `fr.config.debug()`

Sets debug to true, some logging will be outputted to STDOUT. 
Can take optional parameters `"on"` | 1.

#### `fr.config.setHeaders(*headers*)`

Sets headers to `options`. Prevents setting headers from `options.set()` or in `fish()`;

Takes the same key-value pair `Object` as `options.set()`.

#### `fr.config.addHeaders(*headers*)`

If some headers have already been set, this function appends headers.

Useful when using `Content-Type` for example, where you woul call `setHeaders({"Content-Type": "application/json"})` and then append headers accordingly.

#### `fr.config.getOptions()`

Returns `Object` containing current `options` for HTTP Request.

### `fr.fish(*options*, *callback*)`

Function to perform actual HTTP request.

| Name | Type | Definition |
|--------|------|----------|
| `options` | `String` or `Object` | If `String`, treated as `URL` and automatic options are set, otherwise, `fr.config.options.set` is called, and passed this object |
| `callback (*status*, *response*)` | `Function` | Function to call on request `end` or `error`. `status` is an `Object`, containing only `status`, `headers` OR `error`. `response` is actual response | 

 