const expect = require('chai').expect;
var fishingrod = require('../fishingrod.js');
var req = require('../lib/request.js');

describe('Data manipulation handling', function(){
	it('Should return the same data', function(){
		expect(req.handle({
			data:'un petit poulet'
		})).to.be.eql('un petit poulet');
	});

	it('Should return a string of ; separated data (array)', function(){
		expect(req.handle({
			data:['un','petit', 'poulet']
		})).to.be.eql('un;petit;poulet');
	});

	it('Should return a string of : separated data (array)', function(){
		expect(req.handle({
			data:['un','petit', 'poulet']
		},{
			join: ':'
		})).to.be.eql('un:petit:poulet');
	});

	it('Should return a string of ; separated data', function(){
		expect(req.handle({
			data:{
				un:'un',
				petit:'petit',
				poulet:'poulet'
			},
			headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			}
		})).to.be.eql('un=un;petit=petit;poulet=poulet;');
	});

	it('Should return a string of : separated data', function(){
		expect(req.handle({
			data:{
				un:'un',
				petit:'petit',
				poulet:'poulet'
			},
			headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			}
		}, {
			join: ':'
		})).to.be.eql('un=un:petit=petit:poulet=poulet:');
	});

	it('Should return a string of ^^ separated data and {} joined', function(){
		expect(req.handle({
			data:{
				un:'un',
				petit:'petit',
				poulet:'poulet'
			},
			headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			}
		}, {
			join: '{}',
			separator: '^^'
		})).to.be.eql('un^^un{}petit^^petit{}poulet^^poulet{}');
	});

	it('Should return a stringified version of data', function(){
		expect(req.handle({
			data:{
				un:'un',
				petit:'petit',
				poulet:'poulet'
			},
			headers:{
				'Content-Type':'application/json'
			}
		})).to.be.eql(JSON.stringify({
			un:'un',
			petit:'petit',
			poulet:'poulet'
		}));
	});

	it('Should return a stringified UTF8 version of the data', function(){
		expect(req.handle({
			data:{
				un:'un',
				petit:'petit',
				poulet:'poulet'
			},
			headers:{
				'Content-Type':'unknown/type'
			}
		})).to.be.eql(JSON.stringify({
			un:'un',
			petit:'petit',
			poulet:'poulet'
		}));
	});
});

describe('Headers creation test', function(){
	it('Should add a Content-Length header', function(){
		expect(req.headers({
			'X-Some-Header': 'some value;'
		}, 'data')).to.include.keys('Content-Length');
	});

	it('Should not add a Content-Length header', function(){
		expect(req.headers({
			'X-Some-Header': 'some value;'
		})).to.not.include.keys('Content-Length');
	});
});

describe('HTTP Tests', function(){
	it('CALLBACK: Should GET google.com', function(done){
		fishingrod.fish({
			method: 'GET',
			host: 'www.google.com'
		}, (err, st, res)=>{
			if(err){
				throw new Error(err);
			}

			expect(st.status).to.be.gt(199);
			expect(st.status).to.be.lt(400);
			done();
		});
	});

	it('CALLBACK: Should HTTPS GET google.com', function(done){
		fishingrod.fish({
			https:true,
			method: 'GET',
			host: 'www.google.com'
		}, (err, st, res)=>{
			if(err){
				throw new Error(err);
			}

			expect(st.status).to.be.gt(199);
			expect(st.status).to.be.lt(400);
			done();
		});
	});

	it('CALLBACK: Should POST google.com', function(done){
		fishingrod.fish({
			https:true,
			method: 'POST',
			host: 'www.google.com'
		}, (err, st, res)=>{
			if(err){
				throw new Error(err);
			}
			expect(st.status).to.be.gt(399);
			done();
		});
	});

	it('CALLBACK: Should GET json.com', function(done){
		fishingrod.fish({
			https:true,
			method: 'GET',
			host: 'jsonplaceholder.typicode.com',
			path:'/posts/1'
		}, (err, st, res)=>{
			if(err){
				throw new Error(err);
			}

			res = JSON.parse(res);
			expect(res.userId).to.be.eql(1);
			expect(res.id).to.be.eql(1);
			done();
		});
	});

	it('CALLBACK: Should POST json.com', function(done){
		fishingrod.fish({
			method: 'POST',
			host: 'jsonplaceholder.typicode.com',
			path:'/posts',
			data:{
				title: 'My super title',
				body: 'My awesome body'
			},
			headers:{
				'Content-Type': 'application/json'
			}
		}, (err, st, res)=>{
			if(err){
				throw new Error(err);
			}

			res = JSON.parse(res);
			expect(res.title).to.be.eql('My super title');
			expect(res.body).to.be.eql('My awesome body');
			done();
		});
	});
});


describe('Promise Tests', function(){
	it('PROMISE: Should GET google.com', function(done){
		fishingrod.fish({
			method: 'GET',
			host: 'www.google.com'
		}).then((res)=>{
			expect(res.status).to.be.gt(199);
			expect(res.status).to.be.lt(400);
			done();
		}).catch( function(err){
			done();
		});
	});

	it('PROMISE: Should HTTPS GET google.com', function(done){
		fishingrod.fish({
			https:true,
			method: 'GET',
			host: 'www.google.com'
		}).then((res) => {
			expect(res.status).to.be.gt(199);
			expect(res.status).to.be.lt(400);
			done();
		}).catch(function(err){
			done();
		});
	});

	it('PROMISE: Should POST google.com', function(done){
		fishingrod.fish({
			method: 'POST',
			host: 'www.google.com'
		}).then((res)=>{
			expect(res.status).to.be.gt(399);
			done();
		}).catch( function(err){
			done();
		});
	});

	it('PROMISE: Should GET json.com', function(done){
		fishingrod.fish({
			https:true,
			method: 'GET',
			host: 'jsonplaceholder.typicode.com',
			path:'/posts/1'
		}).then((res)=>{
			res = JSON.parse(res.response);
			expect(res.userId).to.be.eql(1);
			expect(res.id).to.be.eql(1);
			done();
		}).catch((err)=>{
			done();
		});
	});

	it('PROMISE: Should POST json.com', function(done){
		fishingrod.fish({
			https:true,
			method: 'POST',
			host: 'jsonplaceholder.typicode.com',
			path:'/posts',
			data:{
				title: 'My super title',
				body: 'My awesome body'
			},
			headers:{
				'Content-Type': 'application/json'
			}
		}).then((res)=>{
			res = JSON.parse(res.response);
			expect(res.title).to.be.eql('My super title');
			expect(res.body).to.be.eql('My awesome body');
			done();
		}).catch((e)=>{
			done();
		});
	});
});
