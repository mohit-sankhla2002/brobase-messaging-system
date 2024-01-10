"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const SocketManager_1 = __importDefault(require("./managers/SocketManager"));
const PORT = process.env.PORT ? +process.env.PORT : 8000;
const init = () => {
    const server = http_1.default.createServer();
    const socketManager = new SocketManager_1.default();
    socketManager.io.attach(server);
    socketManager.initalizeListeners();
    server.listen(PORT, () => {
        console.log(`Server is listening on PORT ${PORT}`);
    });
};
init();
