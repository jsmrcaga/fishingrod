let urlparser = {};
const URL = require('url');
const QS = require('querystring');
const request = require('./request');

urlparser.parse = function(params){
	params = URL.parse(params);
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
	return params;
};

urlparser.request = function(method, url, headers, data){
	let params = urlparser.parse(url);
	if(data){
		data = request.handle(data, {});
		params.data = data;
	}
	if(headers){
		headers = request.headers(method, headers, data);
		params.headers = headers;
	}
	return params;
}

module.exports = urlparser;