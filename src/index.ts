import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let userCount = 0;

wss.on("connection", (socket) => {
    userCount = userCount + 1;
    console.log("User Connected ", userCount);
    socket.on("message", (message) => {
        console.log(message.toString() + "received from user");
        setTimeout(() => {
            socket.send(message.toString() + "sent from server");
        }, 2000)

    })
})