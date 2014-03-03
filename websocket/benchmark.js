(function() {

   /**
    * Before connection (optional, just for faye)
    * @param {client} client connection
    */
   exports.beforeConnect = function(client) {
     // Example:
     // client.setHeader('Authorization', 'OAuth abcd-1234');
     // client.disable('websocket');
   };

   /**
    * On client connection (required)
    * @param {client} client connection
    * @param {done} callback function(err) {}
    */
   exports.onConnect = function(client, done) {
     // Faye client
	  setInterval(function(){ 
		   client.publish('/meta/rpc/test', {text: getDateTime()});
		   //client.publish('/test/'+client._clientId, {text: getDateTime(),clientId:client._clientId});
	   },1000);
 	 
	   function getDateTime() {

		    var date = new Date();

		    var hour = date.getHours();
		    hour = (hour < 10 ? "0" : "") + hour;

		    var min  = date.getMinutes();
		    min = (min < 10 ? "0" : "") + min;

		    var sec  = date.getSeconds();
		    sec = (sec < 10 ? "0" : "") + sec;

		    var year = date.getFullYear();

		    var month = date.getMonth() + 1;
		    month = (month < 10 ? "0" : "") + month;

		    var day  = date.getDate();
		    day = (day < 10 ? "0" : "") + day;

		    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

		}

     done();
   };

   /**
    * Send a message (required)
    * @param {client} client connection
    * @param {done} callback function(err) {}
    */
   exports.sendMessage = function(client, done) {
     // Example:
     // client.emit('test', { hello: 'world' });
     // client.publish('/test', { hello: 'world' });
     done();
   };

})();
