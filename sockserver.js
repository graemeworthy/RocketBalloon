var http = require('http'), 
        io = require('./path/to/socket.io'),

server = http.createServer(function(req, res){
    // your normal server code
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello world</h1>');
});

server.listen(80);

// socket.io, I choose you
var socket = io.listen(server);

socket.on('connection', function(client){
  // new client is here!
  client.on('message', function(){ … })
  client.on('disconnect', function(){ … })
});

