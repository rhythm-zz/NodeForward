var http = require('http'), parse = require('url').parse, util = require('util'),
formidable = require('formidable'),EventEmitterEx = require('events').EventEmitter;

function REQUEST(req, res){
this.req = req || null;
this.res = res || null;
}
var reqList = [];

http.createServer(function (req, res) {

	var EventEmitter = require('events').EventEmitter;
	var eventEx = new EventEmitter();

	eventEx.on('DataComing', function(postReq,data) {
		console.log("****Received one****");
		var j;
		for(var i = 0; i< reqList.length; i++){
		 console.log('reqList.length: ',reqList.length);
			if(reqList[i] != null && postReq.url == reqList[i].req.url ){
				reqList[i].res.writeHead(200, {'content-type': 'text/plain'});
				var obj = JSON.parse(data);
				var text = obj.content;
				reqList[i].res.end(text);
				j = i;
				break;
			}
		}
		if(j != undefined){
			console.log('Before deletion***********reqList.length: ',reqList.length);
			delete(reqList[j]);
			console.log('After deletion***********reqList.length: ',reqList.length);
		}
		return;
	});

	var url = parse(req.url), pathname = url.pathname;
	console.log(req.method.toLowerCase(),' URL: http://127.0.0.1:8090' + url.href);
	
	var evtInst = new EventEmitterEx();
	if(req.method.toLowerCase() == 'get' ){
		/*
		Push req & res into array 
		Must to create mutex to protect this variables. The memory is enough or not for more and more request???
		*/
		reqList.push(new REQUEST(req,res));
	}
	else if (req.method.toLowerCase() == 'post') {
		var messge = '';
		var data = '';
		req.on('data', function (chunk){
		data += chunk;
		});

		req.on('end',function(){
		var obj = JSON.parse(data);
		console.log( obj.content);
		messge = obj.content;
		if(messge.length){
			// Invoke reply to get request
			console.log("****Coming****");
			eventEx.emit('DataComing',req,data);
		
		}
		res.writeHead(200, {'content-type': 'text/plain'});
		res.write(messge);
		res.end(); 
		})
	}
	
}).listen(8090, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8090/');




