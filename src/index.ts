import http from 'http';
import SocketManager from './managers/SocketManager';
const PORT = process.env.PORT ? +process.env.PORT : 8000;
const init = () => {
    const server = http.createServer();
    const socketManager = new SocketManager();
    socketManager.io.attach(server);
    socketManager.initalizeListeners();
    
    server.listen(PORT, () => {
        console.log(`Server is listening on PORT ${PORT}`);
    })
}

init();