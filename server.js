const { Console } = require("console");
let express = require("express");
let app = express();
let http = require("http").Server(app);
let io = require("socket.io")(http);
let publicDir = require("path").join(__dirname+"/src/public");

app.use( express.static(publicDir));

app.set('view engine', 'ejs');
app.set("views", __dirname + "/src/views");

app.get("/", (_, res) => {
    res.render("final_socket");
});
//app.get("/*", (_, res) => res.redirect("/"));

function publicRooms(){
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = io;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

io.on("connection", function( socket ) {
    socket["nickname"] = "Anonymous";
    console.log("socket connect");
    socket.onAny((event) => {
        console.log(io.sockets.adapter);
        console.log(`Socket Event:${event}`);
    });
    socket.on("enter_room", (roomName, nickname, done) => {
        socket["nickname"] = nickname;
        socket.join(roomName);
        console.log(socket.rooms);
        socket.to(roomName).emit("welcome", socket.nickname);
        done();
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname));
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();//얘는 js 문법입니다 
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});


/* http 서버
//const httpServer = http.createServer(app);
//const wsServer = SocketIO(server);


// fake database 각기 다른 브라우저 간 소통 가능
const sockets = [];

//서버가 아니라 socket에 있는 매서드 사용
wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous";
    console.log("connected to Browser ✅");
    socket.on("close", onSocketClose);
    socket.on("message", (msg) => {
        const message = JSON.parse(msg)
        switch (message.type) {
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    });
});*/

http.listen( 8000, ()=>{
    console.log( "listening on *:8000" );
    });