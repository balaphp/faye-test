var io = require('socket.io').listen(80, { log: false });

var totC = 0;
var totD = 0;

io.sockets.on('connection', function (socket) {
  totC++;	
  
  socket.on('test', function (data) {
    //console.log(data);
  });
  
  socket.on('disconnect', function () {
	  totD++;
  });
  
});

setInterval(function(){ 
	console.log("Total C:"+totC+" DC:"+totD);
},1000);
