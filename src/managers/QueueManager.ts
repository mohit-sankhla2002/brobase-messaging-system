import * as amqp from "amqplib";
import { config } from 'dotenv';
config();
const QUEUE_NAME = process.env.QUEUE_NAME!;
import { ModifiedMessage } from "./SocketManager";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({ log: ["query", "error"] });
class Queue {
    private queue: amqp.Channel | undefined;
    async Queue() {
        try {
            const connection = await amqp.connect("amqp://localhost");
            this.queue = await connection.createChannel();

            await this.queue.assertQueue(QUEUE_NAME);
        } catch (error: any) {
            console.log(error.message);
        }
    }

    sendMessage(message: ModifiedMessage) {
        this.queue?.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
    }
    
    async createConsumer() {
        try {
            this.queue?.consume(QUEUE_NAME, (msg) => {
                if (!msg?.content) {
                    return;
                }
                const message = JSON.parse(msg?.content.toString()) as ModifiedMessage;
                prisma.message.create({
                    data: {
                        senderId: message.senderId,
                        groupId: message.groupId, 
                        payload: message.payload
                    }
                });
    
                return true;
            })
        } catch (error) {
            return error;
        }
    }
}

export default Queue;