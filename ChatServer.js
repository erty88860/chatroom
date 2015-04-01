var net = require('net');
var readline = require('readline').createInterface(process.stdin, process.stdout);

// Keep track of the chat clients
var clients = [];

var server = net.createServer();

server.on('connection', function(sock) {
  sock.name = sock.remoteAddress +':'+ sock.remotePort;

  console.log(sock.name+' 連進來了');
  clients.push(sock);

  broadcast(sock.name + " joined the chat\n", sock);

  // Handle incoming messages from clients.
  sock.on('data', function (data) {
    broadcast(sock.name + "> " + data, sock);
  });
 
  // Remove the client from the list when it leaves
  sock.on('end', function () {
    clients.splice(clients.indexOf(sock), 1);
    broadcast(sock.name + " left the chat.\n");
  });


  // Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      if (client === sender) return;
      client.write(message);
    });
    // Log it to the server output too
    console.log(message)
  }
});

server.listen(5757);
console.log('server 啟動');
