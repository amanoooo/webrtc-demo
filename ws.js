// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

let sender = null;
let receiver = null;

wss.on('connection', ws => {
    ws.on('message', message => {
        const data = JSON.parse(message);

        // 将消息转发给对方
        if (data.type === 'offer') {
            sender = ws;
            if (receiver) receiver.send(message);
        } else if (data.type === 'answer') {
            if (sender) sender.send(message);
        } else if (data.type === 'candidate') {
            if (ws === sender && receiver) {
                receiver.send(message);
            } else if (ws === receiver && sender) {
                sender.send(message);
            }
        }
    });

    ws.on('close', () => {
        if (ws === sender) sender = null;
        if (ws === receiver) receiver = null;
    });

    // 标记接入的用户是共享端或接收端
    if (!sender) {
        sender = ws;
    } else if (!receiver) {
        receiver = ws;
    }
});

console.log('WebSocket server running on ws://localhost:3000');
