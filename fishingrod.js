var http = require('http');
var https = require('https');

var config = {
	acceptedOptions : ["host", "hostname", "path", "port", "encoding", "headers"],
	acceptedMethods : ["GET", "PUT", "POST", "DELETE", "PATCH"],
	options:{},
	http: http,

	debug: false,

	default: function(params){
		console.log("Entered Default");
		var http_type = params.split("://")[0];
		config.http = (http_type.substr(-1,1) == "s") ? https : http;
		
		var rest = params.split("://")[1];
		var host = rest.split("/")[0];

		var path = "/";
		var semi_path = rest.split("/")[1];
		if(typeof semi_path != 'undefined'){
			for(var i = 0; i < semi_path.length; i++){
				path += semi_path[i];
			}
		}

		config.options = {
			method: "GET",
			host: host,
			path: path
		};

		console.log("Set defaults:", config.options);
	}
}
/*
http: "http://",
	hostname: 'localhost',
	path: '',
	method: 'POST',
	port: 7474,
	encoding : 'utf8',
	headers:{
		'Content-Type': 'application/json'
	}*/
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
				console.log("Setting Options");
				for(var opt in options){
					if(config.acceptedOptions.indexOf(opt) == -1) continue;
					if(opt == 'method') options[opt].toUpperCase();
					if(opt == 'path' && options[opt] == "") options[opt] = "/";
					config.options[opt] = options[opt];
				}
				console.log("Set options: ", config.options);
			}
		},

		debug: function(off){
			if(typeof off == "undefined" || off == "on" || off === 1){
				config.debug = true;
			}else{
				config.debug = false;
			}
		}
	},

	fish: function (params, callback){
		if(typeof params == 'string') {
			config.default(params);
		}else{
			fishingrod.config.options.set(params);
			if(params.debug) config.debug(1);	
		}

		

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
					}, response);
				}else{
					console.log("You should define a callback");
				}
			});
		});

		request.on('error', function(e){
			throw new Error(e);
		});

		if(typeof params.data !='undefined' && params.data!=null){

			request.write(JSON.stringify(params.data));
			request.end();
		}else{
			request.end();
		}

	}
};

module.exports = fishingrod;	