//Lets require/import the HTTP module
var http = require('http');
var request = require('request');

//Lets define a port we want to listen to
const PORT=80;

//We need a function which handles requests and send response
function handleRequest(request, response){
  response.end(JSON.stringify({
    "success": true
  }));
}

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://0.mongodb.service.consul:27017/test,mongodb://1.mongodb.service.consul:27017/test", function(err, db) {
  if(err) {
    return console.error("MongoDB Error: " + err.message)
  }
  console.log("We are connected");
  var collection = db.collection('stuff');
  setInterval(function() {
    collection.insert({timestamp: Date.now()}, function() {})
  }, 3000);
});

setInterval(function() {
  request.get("http://0.api.service.consul", function() {})
  request.get("http://1.api.service.consul", function() {})
}, 1000);


//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
  //Callback triggered when server is successfully listening. Hurray!
  console.log("Server listening on: http://localhost:%s", PORT);
});
