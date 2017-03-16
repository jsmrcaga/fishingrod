var request = require('./lib/request.js');
var fishingrod = {};

fishingrod.fish = function(params, callback){
	if(typeof params === 'string'){
		const URL = require('url');
		const QS = require('querystring');
		var params = URL.parse(params);
		if(params.query){
			params.data = QS.parse(params.query); 
			params.path = params.pathname;
		}
		if(params.protocol){
			if(params.protocol === 'http:'){
				params.https = false;
			} else if (params.protocol === 'https:'){
				params.https = true;
			}
		} else {
			params.https = false;
		}
	}

	if(!params.method) { params.method = 'GET'; }
	if(!params.https) { params.https = false; }

	var data = request.handle(params, params.extra);
	params.headers = request.headers(params.headers, data);

	return request(params, data, callback);
};

module.exports = fishingrod;