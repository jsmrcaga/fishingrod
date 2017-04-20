const qs = require('querystring');
var req = function(options, data, callback){
	var http = options.https ? require('https') : require('http');

	if(['GET', 'DELETE', 'PATCH'].indexOf(options.method) > -1 && data){
		options.path += data;
	}

	var func = function(resolve, reject){
		var request = http.request(options, function(res){
			var response = '';
			var buffer = [];
			
			res.on('data', function (chunk){
				buffer.push(chunk);
				response += chunk;
			});

			res.on('end', function(){
				res.setEncoding(options.encoding || 'utf8');
				if(res.headers['Content-Type'] && res.headers['Content-Type'] === 'application/json'){
					try{
						response = JSON.parse(response); 
					} catch(e) {}
				}
				if(callback){
					process.nextTick(callback, null, {
						status: res.statusCode,
						headers: res.headers,
						http: res
					}, response, Buffer.concat(buffer));	
				}
				if(resolve){
					process.nextTick( resolve, {
						status: res.statusCode,
						headers: res.headers,
						http: res,
						response: response,
						raw: Buffer.concat(buffer)
					});
				}
			});
		});

		request.on('error', function(e){
			if(callback){
				process.nextTick(()=>{
					callback(new Error(e), null, null);
				});
			}
			if(reject){
				process.nextTick(()=>{
					reject(e);
				});
			}
		});

		if(options.debug){
			console.log('[FISHINGROD] ', Date.now(), 'Sending request as', JSON.stringify(options));
		}

		if((typeof data !='undefined') && data!=null){
			request.write(data);
			request.end();
		}else{
			request.end();
		}
	};

	return new Promise(func);	
};

// handles data manipulation
req.handle = function(data, params){
	if(!params) { params = {}; }
	if(!data.data){ return null; }
	if(typeof data.data === 'string'){
		return data.data;
	} else if (data.data instanceof Array){
		return data.data.join(params.join || ';');
	}

	if(!data.method){ data.method = 'GET'; }
	if(!data.headers){ data.headers = {}; }

	if(['GET', 'DELETE', 'PATCH'].indexOf(data.method) > -1){
		return qs.stringify(data.data, params.join, params.separator);
	}

	if(data.headers && data.headers['Content-Type']){
		var h = data.headers['Content-Type'];
		if((/application\/json/).test(h)){
			return JSON.stringify(data.data);
		} else if ((/application\/x-www-form-urlencoded/).test(h)) {
			return qs.stringify(data.data, params.join, params.separator);
		} else {
			return (new Buffer(JSON.stringify(data.data))).toString(params.encoding || 'utf8');
		}
	} else {
		return (new Buffer(JSON.stringify(data.data))).toString(params.encoding || 'utf8');
	}
};

req.headers = function(params, data){
	var headers = params || {};
	if(data){
		if(!headers['Content-Length']){
			headers['Content-Length'] = Buffer.byteLength(data);
		}

		if(!headers['Content-Type']){
			headers['Content-Type'] = 'text/plain';	
		}
	}

	if(params){
		for(var h in headers){
			if(!params[h]){
				params[h] = headers[h];
			}
		}
	} else {
		params = h;
	}

	return params;
};
module.exports = req;