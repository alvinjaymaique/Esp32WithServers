const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const port1 = 3000;
const port2 = 3001;
const port3 = 3002;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// app.post('/update', (req, res) => {
//     const value = req.body.value;
//     const currentPort = req.headers.host.split(':')[1];
//     console.log(`Server ${currentPort} received value ${value}`);
//     res.status(200).send(`Client received value on Server${currentPort}: ${value}`);
// });
// POST request handler for receiving values
app.post('/update', (req, res) => {
    const value = req.body.value;  // Get the value sent with the POST request
    const currentPort = req.headers.host.split(':')[1]; // Get the port from the request

    // Log the incoming value
    console.log(`Server ${currentPort} received value: ${value}`);

    // Based on the port, send the data to the appropriate WebSocket clients
    if (currentPort == port1) {
        sendToClients(wsClients1, value, currentPort);
    } else if (currentPort == port2) {
        sendToClients(wsClients2, value, currentPort);
    } else if (currentPort == port3) {
        sendToClients(wsClients3, value, currentPort);
    }

    // Respond back to the POST request
    res.status(200).send(`Client received value on Server ${currentPort}: ${value}`);
});

const server1 = http.createServer(app);
const server2 = http.createServer(app);
const server3 = http.createServer(app);
const wss1 = new WebSocket.Server({ server: server1 });
const wss2 = new WebSocket.Server({ server: server2 });
const wss3 = new WebSocket.Server({ server: server3 });

// Store WebSocket clients for each server
let wsClients1 = [];
let wsClients2 = [];
let wsClients3 = [];

// Handle incoming WebSocket connections for each server
wss1.on('connection', ws => {
    console.log('Client connected to Server 3000');
    wsClients1.push(ws); // Add the client to the list of WebSocket clients for Server 3000
    ws.on('close', () => {
        wsClients1 = wsClients1.filter(client => client !== ws); // Remove the client on disconnect
    });
});

wss2.on('connection', ws => {
    console.log('Client connected to Server 3001');
    wsClients2.push(ws); // Add the client to the list of WebSocket clients for Server 3001
    ws.on('close', () => {
        wsClients2 = wsClients2.filter(client => client !== ws); // Remove the client on disconnect
    });
});

wss3.on('connection', ws => {
    console.log('Client connected to Server 3002');
    wsClients3.push(ws); // Add the client to the list of WebSocket clients for Server 3002
    ws.on('close', () => {
        wsClients3 = wsClients3.filter(client => client !== ws); // Remove the client on disconnect
    });
});

// Function to send data to all connected WebSocket clients
function sendToClients(clients, value, port) {
    clients.forEach(ws => {
        // Send the value to each connected WebSocket client
        ws.send(JSON.stringify({ server: port, value: value }));
        console.log(`Sent value ${value} to client on Server ${port}`);
    });
}


// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

server1.listen(port1, () => {
    console.log(`Server1 running at http://localhost:${port1}`);
});

server2.listen(port2, () => {
    console.log(`Server2 running at http://localhost:${port2}`);
});

server3.listen(port3, () => {
    console.log(`Server3 running at http://localhost:${port3}`);
});

