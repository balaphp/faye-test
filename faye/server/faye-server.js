var http 	= require('http');
var faye 	= require('faye');
var redis 	= require('faye-redis');

var cluster  = require('cluster');
var numCPUs  = require('os').cpus().length;
var cClients = {};
var dClients = [];
var uClients = [];

if (cluster.isMaster) {
	
	  // Fork workers.
	  for (var i = 0; i < numCPUs; i++) {
	    cluster.fork();
	  }

	  cluster.on('exit', function(worker, code, signal) {
	    console.log('worker ' + worker.process.pid + ' died');
	  });
	  
} else {
	
	var bayeux = new faye.NodeAdapter({
		mount: '/faye', 
		timeout: 25, 
		engine: {
			type:   redis,
			host:   '192.168.10.129',
	    }});

	// Handle non-Bayeux requests
	var server = http.createServer(function(request, response) {
	  response.writeHead(200, {'Content-Type': 'text/plain'});
	  response.end('Hello, non-Bayeux request');
	});
	
	bayeux.on('debug',function(data,cid){ console.log(data);  });
	
	bayeux.addExtension({
		  incoming: function(message, callback) {
		    if (message.channel.indexOf('/meta/rpc/') == 0) {
		    		cClients[message.clientId] = message.cClients;
		    		//bayeux.getClient().publish('/'+message.clientId,message.data); 
		    		//console.log(message);
		    }
		    callback(message);
		  }
	});
	
	bayeux.attach(server);
	server.listen(8000);
	console.log("Faye App Server Running....");
	
	bayeux.on('subscribe',function(CleintId,Channel){
		//cClients.push(CleintId);
	});
	
	bayeux.on('publish',function(clientId, channel, data){
		//cClients[data.clientId] = data.cClients;
		//console.log(clientId+"-"+channel+"-"+data.clientId);
	});
	
	bayeux.on('unsubscribe',function(CleintId,Channel){
		uClients.push(CleintId);
	});
	
	bayeux.on('disconnect',function(CleintId){
	 	dClients.push(CleintId);
	});
	
	setInterval(function(){ 
		console.log("Total C:"+Object.keys(cClients).length+" DC:"+dClients.length+" UC:"+uClients.length);
	},1000); 
}
