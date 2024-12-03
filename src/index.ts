import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let rooms: { [room: string]: WebSocket[] } = {};

wss.on("connection", (socket) => {

    socket.on("message", (message) => {
        console.log("A user connected");
        try {
            const parsedMessage = JSON.parse(message as unknown as string);

            if (parsedMessage.type == "join") {
                const roomId = parsedMessage.payload.roomId;

                if (!rooms[roomId]) {
                    rooms[roomId] = []
                }

                rooms[roomId].push(socket);
                console.log(`User joined room: ${roomId}`);
            }

            if (parsedMessage.type == "chat") {
                const roomId = parsedMessage.payload.roomId;
                const messageContent = parsedMessage.payload.message;

                if (rooms[roomId]) {
                    rooms[roomId].forEach((userSocket) => {
                        userSocket.send(JSON.stringify({
                            type: "chat",
                            payload: { message: messageContent }
                        }))

                    })
                    console.log(`Message sent to room ${roomId}: ${messageContent}`);
                }
            }
        }
        catch (error) {
            console.error("Error processing message:", error);
        }

    })

    socket.on("close", () => {
        for (let room in rooms) {
            rooms[room] = rooms[room].filter((userSocket) =>  userSocket !== socket );

            if (rooms[room].length === 0) {
                delete rooms[room];
                console.log("room is deleted")
            }
        }
        console.log("user Disconnected");
    })
})