import { Server, Socket } from 'socket.io';
import { Redis } from 'ioredis';
const pub = new Redis("redis://:@127.0.0.1:6379/");
const sub = new Redis("redis://:@127.0.0.1:6379/");
import { PrismaClient } from '@prisma/client';
import Queue from './QueueManager';
const prisma = new PrismaClient({ log: ["query", "error"] });

export interface ModifiedMessage {
    id: string, 
    username: string, 
    payload: string, 
    senderId: string, 
    groupId: string,
    createdAt: Date
  }
  

class SocketManager {
    private _io: Server;

    constructor() {
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*"
            }
        });
        sub.subscribe("GROUP_MESSAGES");
    }

    get io() {
        return this._io;
    }

    initalizeListeners() {
        this._io.on("connect", (socket: Socket) => {
            console.log(`New Socket Connected: ${socket.id}`);

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
        
        sub.on("message", async (channel, msg) => {
            if (channel === "GROUP_MESSAGES") {
                const serializedMessage = JSON.parse(msg) as ModifiedMessage;
                console.log(msg);
                const { groupId } = serializedMessage;
                await prisma.message.create({ 
                    data: {
                        groupId: serializedMessage.groupId,
                        senderId: serializedMessage.senderId,
                        payload: serializedMessage.payload
                    }
                });
                this.io.to(groupId!).emit("event:group_message", serializedMessage);
            }
        });
    }
}

export default SocketManager;