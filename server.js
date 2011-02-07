var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , io = require('socket.io')
  , sys = require(process.binding('natives').util ? 'util' : 'sys')
  , server;
    
server = http.createServer(function(req, res){
  // your normal server code
  var path = url.parse(req.url).pathname;
  switch (path){
    case '/':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(fs.readFileSync('rktblln.html'));
      res.end();
      break;
      
    case '/json.js':
    case '/chat.html':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
      
    default: send404(res);
  }
}),

send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
};

server.listen(8347);


var io = io.listen(server)
  , buffer = [];
var clients = [];  
function remove_client(id){
    clients = clients.slice(0, clients.indexOf(id)).concat(clients.slice(clients.indexOf(id) + 1))
}
io.on('connection', function(client){
  client.send({ buffer: buffer });
  client.send({ connected: client.sessionId});
  client.send({ members: clients});
  clients.push(client.sessionId);
  client.broadcast({ connect: client.sessionId});
  
  client.on('message', function(message){
    var msg = { message: [client.sessionId, message] };
    buffer.push(msg);
    if (buffer.length > 15) buffer.shift();
    client.broadcast(msg);
  });

  client.on('disconnect', function(){
    client.broadcast({ disconnect: client.sessionId }); 
    remove_client(client.sessionId);
  });
});
