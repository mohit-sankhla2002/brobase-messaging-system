"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const ioredis_1 = require("ioredis");
const pub = new ioredis_1.Redis("redis://:@127.0.0.1:6379/");
const sub = new ioredis_1.Redis("redis://:@127.0.0.1:6379/");
class SocketManager {
    constructor() {
        this._io = new socket_io_1.Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*"
            }
        });
        sub.subscribe("MESSAGES");
    }
    get io() {
        return this._io;
    }
    initalizeListeners() {
        this._io.on("connect", (socket) => {
            console.log(`New Socket Connected: ${socket.id}`);
            socket.join("Global");
            socket.on("event:default_message", (msg) => {
                pub.publish("MESSAGES", JSON.stringify({ message: msg.message }));
                console.log(msg);
            });
            socket.on("join:groups", (msg) => {
                try {
                    const serializedMessage = JSON.parse(msg);
                    socket.join(serializedMessage.groupIds);
                }
                catch (error) {
                    console.log(error);
                }
            });
        });
        sub.on("message", (channel, msg) => {
            if (channel === "MESSAGES") {
                console.log(msg);
                this.io.to("Global").emit("event:default_message", msg);
            }
        });
    }
}
exports.default = SocketManager;
