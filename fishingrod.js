var http = require('http');
var https = require('https');

var config = {
	acceptedOptions : ["https", "ssl","host", "hostname", "path", "port", "encoding", "headers", "method"],
	acceptedMethods : ["GET", "PUT", "POST", "DELETE", "PATCH"],
	options:{},
	permanent_headers:{};
	http: http,

	debug: false,

	default: function(params){
		var http_type = params.split("://")[0];
		var rest = null;
		if(http_type.substr(0,4) == "http") {
			config.http = (http_type.substr(-1,1) == "s") ? https : http;
			rest = params.split("://")[1];
		}else{
			rest = http_type;
		}
		
		var host = rest.split("/")[0];

		var path = "/";
		var semi_path = rest.split("/").slice(1);
		if(typeof semi_path != 'undefined'){
			for(var i = 0; i < semi_path.length; i++){
				path += semi_path[i] + "/";
			}
		}

		config.options.method = "GET";
		config.options.host= host;
		config.options.path= path;
		
	}
}

var fishingrod = {
	config:{
		https:{
			enable: function(){
				config.http = https;
			},
			disable: function(){
				config.http = http;
			}
		},

		options:{
			set: function _setOptions(options){
				for(var opt in options){
					if(config.acceptedOptions.indexOf(opt) == -1) continue;
					if(opt == 'method') options[opt].toUpperCase();
					if(opt == 'path' && options[opt] == "") options[opt] = "/";
					if((opt == "https" || opt == 'ssl')) {
						if(options[opt]){
							config.http = https;
							continue;
						}else{
							config.http = http;
							continue;
						}
					}
					config.options[opt] = options[opt];
				}

				// add permanent headers
				if(!config.options.headers){ 
					config.options.headers = config.permanent_headers;
				} else {
					for(var h in config.permanent_headers){
						if(config.options.headers[h]) continue;
						config.options.headers[h] = config.permanent_headers[h];
					}
				}
			}
		},

		debug: function(off){
			if(typeof off == "undefined" || off == "on" || off === 1){
				config.debug = true;
			}else{
				config.debug = false;
			}
		},

		setHeaders: function _setHeaders(headers){
			config.permanent_headers = {};
			for(var h in headers){
				config.permanent_headers[h] = headers[h];
			}
		},

		addHeaders: function _addHeaders(headers){
			config.options.headers = (!config.options.headers) ? {} : config.options.headers;
			for(var h in headers){
				config.options.headers[h] = headers[h];
			}
		},

		getOptions: function _getOptions(){
			return config.options;
		}
	},

	fish: function (params, callback){
		// flush config
		config.options = {};
		
		if(typeof params == 'string') {
			config.default(params);
		}else{
			if(params.data){
				var data_length = Buffer.byteLength(JSON.stringify(params.data));
				if(params.headers && !params.headers['Content-Length']){
					params.headers['Content-Length'] = data_length;
				}else if(!params.headers){
					params.headers = {};
					params.headers['Content-Length'] = data_length;
				}
			}

			fishingrod.config.options.set(params);
			if(params.debug) config.debug(1);	
		}

		fish_log("Sending request to host:", config.options.host || config.options.hostname, " and path: ", config.options.path);
		fish_log("Sending Request as: ", (config.http == http) ? "HTTP" : "HTTPS", config.options.method, config.options.headers);

		var response = "";

		var request = config.http.request(config.options, function (res){
			res.setEncoding(config.options.encoding);
			res.on('data', function (chunk){
				response += chunk;
			});

			res.on('end', function(){
				if(callback){
					callback({
						status:res.statusCode,
						headers: res.headers
					}, response);
				}else{
					fish_log("You should define a callback");
				}
			});
		});

		request.on('error', function(e){
			callback({error:e}, response);
			fish_log("Error", e);
		});

		if(typeof params.data !='undefined' && params.data!=null){
			fish_log("Writing data to HTTP Request:", params.data);
			request.write(JSON.stringify(params.data));
			request.end();
		}else{
			request.end();
		}

	}
};

function fish_log() {
	if(config.debug){
		console.log.apply(console, arguments);
	}
}

module.exports = fishingrod;	