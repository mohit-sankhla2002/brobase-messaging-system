import { Server, Socket } from 'socket.io';
import { Redis } from 'ioredis';
import prisma from '../utils/prisma';
const pub = new Redis("redis://:@127.0.0.1:6379/");
const sub = new Redis("redis://:@127.0.0.1:6379/");

class SocketManager {
    private _io: Server;

    constructor() {
        this._io = new Server({
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
        this._io.on("connect", (socket: Socket) => {
            console.log(`New Socket Connected: ${socket.id}`);
            socket.join("Global");
            socket.on("event:default_message", (msg) => {
                pub.publish("DEFAULT_MESSAGES", JSON.stringify({ message: msg.message }));
                console.log(msg);
            });

            socket.on("join:groups", (msg) => {
                try {
                    const serializedMessage = JSON.parse(msg) as { groupIds: string[] };                
                    socket.join(serializedMessage.groupIds);
                } catch (error) {
                    console.log(error);
                }
            })
        })

        sub.on("message", (channel, msg) => {
            if (channel === "DEFAULT_MESSAGES") {
                console.log(msg);
                this.io.to("Global").emit("event:default_message", msg);
            }
        });
    }
}

export default SocketManager;