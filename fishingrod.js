var request = require('./lib/request.js');
var fishingrod = {};

fishingrod.fish = function(params, callback){
	if(!params.method) { params.method = 'GET'; }
	if(!params.https) { params.https = false; }

	var data = request.handle(params, params.extra);
	params.headers = request.headers(params.headers, data);

	return request(params, data, callback);
};

module.exports = fishingrod;