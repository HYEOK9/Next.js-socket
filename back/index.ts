import { Server } from 'http';
import { Socket } from 'socket.io';

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
interface Message {
    userNames: string;
    message: string;
}

const PORT = 8080;

class App {
    app: Express.Application;
    server: Server;
    io: Socket;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIO(this.server, { cors: { origin: '*' } });
    }

    connect = () => {
        this.io.on('connection', (socket: Socket) => {
            socket.on('chat', (data: Message) => {
                console.log(data);
                this.io.emit('chat', data);
            });
        });
    };

    listen = () => {
        this.server.listen(PORT, () => {
            console.log(`Server is listening on PORT ${PORT}...`);
        });
    };

    run = () => {
        this.connect();
        this.listen();
    };
}

const app = new App();

app.run();

export default App;
