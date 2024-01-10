import { Server, Socket } from 'socket.io';
import { Redis } from 'ioredis';
import prisma from '../utils/prisma';
const pub = new Redis("redis://:@127.0.0.1:6379/");
const sub = new Redis("redis://:@127.0.0.1:6379/");
import { Message } from '../utils/types';
class SocketManager {
    private _io: Server;

    constructor() {
        this._io = new Server({
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
        this._io.on("connect", (socket: Socket) => {
            console.log(`New Socket Connected: ${socket.id}`);
            socket.on("event:default_message", (msg) => {
                pub.publish("DEFAULT_MESSAGES", JSON.stringify(msg));
                console.log(msg);
            });

            socket.on("event:group_message", (msg) => {
                pub.publish("GROUP_MESSAGES", JSON.stringify(msg));
                console.log(msg);
            })
            
            socket.on("event:join_group", (msg) => {
                try {            
                    let groupIds = msg.groupIds as string[];
                    groupIds = groupIds.concat("Global");
                    socket.join(groupIds);
                    
                } catch (error) {
                    console.log(error);
                }
            });
        })

        sub.on("message", (channel, msg) => {
            if (channel === "DEFAULT_MESSAGES") {
                console.log(msg);
                this.io.to("Global").emit("event:default_message", JSON.parse(msg));
            }

            if (channel === "GROUP_MESSAGES") {
                const serializedMessage = JSON.parse(msg) as Message;
                this.io.to(serializedMessage.groupId!).emit("event:group_message", serializedMessage);
            }
        });
    }
}

export default SocketManager;