import http from "http";
import WebSocket from "ws";
import express from "express";
import { parse } from "path";

const app = express();

console.log("hello");

app.set('view engine', "pug");
app.set("views", __dirname + "/views");

app.use('/public', express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    res.render("home")
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);  //optional
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous"
    console.log("Connected to Browser ✅");
    socket.on("close", () => {
        console.log("Disconnected from the Browser ❌");
    });
    socket.on("message", (msg) => {
        const message = JSON.parse(msg.toString());
        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
            case "nickname":
                socket["nickname"] = message.payload;
        }
        // if(parsed.type === "new_message"){
        //     sockets.forEach((aSocket) => aSocket.send(parsed.payload));
        // } else if (parsed.type === "nickname"){
        //     console.log(parsed.payload);
        // };
    });
});

server.listen(3000, handleListen);