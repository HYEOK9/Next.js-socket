"use strict";
exports.__esModule = true;
var express = require('express');
var http = require('http');
var socketIO = require('socket.io');
var PORT = 8080;
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.connect = function () {
            _this.io.on('connection', function (socket) {
                socket.on('chat', function (data) {
                    console.log(data);
                    _this.io.emit('chat', data);
                });
            });
        };
        this.listen = function () {
            _this.server.listen(PORT, function () {
                console.log("Server is listening on PORT ".concat(PORT, "..."));
            });
        };
        this.run = function () {
            _this.connect();
            _this.listen();
        };
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIO(this.server, { cors: { origin: '*' } });
    }
    return App;
}());
var app = new App();
app.run();
exports["default"] = App;
