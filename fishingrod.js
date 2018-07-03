const request = require('./lib/request');
const urlparser = require('./lib/urlparser');
let fishingrod = {};

fishingrod.fish = function(params, callback){
	if(typeof params === 'string'){
		params = urlparser.parse(params);
	}

	if(!params.method) { params.method = 'GET'; }
	if(!params.https) { params.https = false; }

	let data = request.handle(params, params.extra);
	params.headers = request.headers(params.method, params.headers, data);

	return request(params, data, callback);
};

fishingrod.get = function(url, data, headers){
	let params = urlparser.request('GET', url, data, headers);
	return fishingrod.fish(params);
};

fishingrod.post = function(url, data, headers){
	let params = urlparser.request('POST', url, data, headers);
	return fishingrod.fish(params);
};

fishingrod.put = function(url, data, headers){
	let params = urlparser.request('PUT', url, data, headers);
	return fishingrod.fish(params);
};

fishingrod.delete = function(url, data, headers){
	let params = urlparser.request('DELETE', url, data, headers);
	return fishingrod.fish(params);
};

fishingrod.__method = function(method, url, data, headers){
	let params = urlparser.request(method, url, data, headers);
	return fishingrod.fish(params);
};

module.exports = fishingrod;