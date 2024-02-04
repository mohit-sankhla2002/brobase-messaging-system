import Queue from "./managers/QueueManager";
while (true) {
    try {
        const queue = new Queue();
        queue.createConsumer();
    } catch (error) {
        console.log(error);
        break;
    }
}