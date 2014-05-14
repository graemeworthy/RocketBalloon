var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    io = require('socket.io'),
    sys = require(process.binding('natives').util ? 'util' : 'sys'),
    server;
console.log('rcktblln')
server = http.createServer(function(req, res) {
    // your normal server code
    var path = url.parse(req.url).pathname;
    switch (path) {
        case '/':
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(fs.readFileSync('rktblln.html'));
            res.end();
            break;
        case '/RocketBalloons.png':
            res.writeHead(200, {
                'Content-Type': 'image/png'
            });
            res.write(fs.readFileSync('RocketBallons.png'));
            res.end();
        case '/Clouds.png':
            res.writeHead(200, {
                'Content-Type': 'image/png'
            });
            res.write(fs.readFileSync('Clouds.png'));
            res.end();

        case '/json.js':

        case '/chat.html':
            fs.readFile(__dirname + path, function(err, data) {
                if (err) return send404(res);
                res.writeHead(200, {
                    'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'
                })
                res.write(data, 'utf8');
                res.end();
            });
            break;

        default:
            send404(res);
    }
}),

send404 = function(res) {
    res.writeHead(404);
    res.write('404');
    res.end();
};

server.listen(8347);

var socket = io.listen(server),
    buffer = [];
var clients = [];

function remove_client(id) {
    clients = clients.slice(0, clients.indexOf(id)).concat(clients.slice(clients.indexOf(id) + 1))
}
socket.sockets.on('connection', function(client) {
    console.log('connect')

    client.emit('message', {
        buffer: buffer
    });
    client.emit('message', {
        connected: client.id
    });
    client.emit('message', {
        members: clients
    });
    clients.push(client.id);
    client.broadcast.emit('message', {
        connect: client.id
    });

    client.on('movement', function(data) {
        console.log('got movement')
        console.log(data)
        var msg = {
            movement: [client.id, data]
        };
        buffer.push(msg);
        if (buffer.length > 15) buffer.shift();
        client.broadcast.emit('message', msg);
    });

    client.on('disconnect', function() {
        console.log('disconnect')
        client.broadcast.emit('message', {
            disconnect: client.id
        });
        remove_client(client.id);
    });
});