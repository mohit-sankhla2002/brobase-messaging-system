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
        sub.subscribe("DEFAULT_MESSAGES", "GROUP_MESSAGES");
    }
    get io() {
        return this._io;
    }
    initalizeListeners() {
        this._io.on("connect", (socket) => {
            console.log(`New Socket Connected: ${socket.id}`);
            socket.on("event:default_message", (msg) => {
                pub.publish("DEFAULT_MESSAGES", JSON.stringify(msg));
                console.log(msg);
            });
            socket.on("event:group_message", (msg) => {
                pub.publish("GROUP_MESSAGES", JSON.stringify(msg));
                console.log(msg);
            });
            socket.on("event:join_group", (msg) => {
                try {
                    let groupIds = msg.groupIds;
                    groupIds = groupIds.concat("Global");
                    socket.join(groupIds);
                }
                catch (error) {
                    console.log(error);
                }
            });
        });
        sub.on("message", (channel, msg) => {
            if (channel === "DEFAULT_MESSAGES") {
                console.log(msg);
                this.io.to("Global").emit("event:default_message", JSON.parse(msg));
            }
            if (channel === "GROUP_MESSAGES") {
                const serializedMessage = JSON.parse(msg);
                this.io.to(serializedMessage.groupId).emit("event:group_message", serializedMessage);
            }
        });
    }
}
exports.default = SocketManager;
