let express = require( "express" );
let app = express();
const port = 8000;
const body = require( 'body-parser' );
const moment = require("moment");
let http = require( "http" ).Server( app );
let io = require( "socket.io" )( http );



app.set("view engine", "ejs");
app.set("views", __dirname + "/src/views");

app.get("/", (req, res) => {
    res.render("socket");
});

app.use( body.urlencoded( { extended:false } ) );
app.use( body.json() );

const nick_a = [];
const chat_a = [];

function update_list() {
    let nicks = [];
    for ( let socket in nick_a ){
        nicks.push(nick_a[socket]);
    }
    io.emit ( "update_nicks", nicks );
    // console.log(nick_a)
}

//#########################
// chats
//#########################
app.get( '/', ( req, res ) => {
    res.render('socket.ejs');
});


io.on( "connection", function ( socket ){
    //입장 하셨습니다.
    nick_a[socket.id] = socket.id;
    // io.emit( "notice", `$(socket.id.slice(0,5) .... 님이 입장하셨습니다.)` );
    io.emit( "notice", {socketid:socket.id, disc:"님이 입장하셨습니다.", Time_now:moment().format('HH:mm:ss')});
    update_list();
    

    socket.on( "sendMsg", ( msg ) =>{
        // console.log(socket)
        // console.log(socket.handshake)
        // console.log(socket.handshake.headers.cookie)
        if ( nick_a[socket.id] !== msg["nick"] ) {
            if ( Object.values(nick_a).indexOf( msg["nick"] ) > -1 ){
                socket.emit( "error", "이미 존재합니다." );
                return false;
            } else {
                nick_a[socket.id] = msg["nick"];
                update_list();
            }
            console.log(nick_a);
            console.log(msg);
        }
        io.emit( "newMsg",  {socketid:socket.id.slice(0,6), msg:msg, chat_a:msg["chat"], nick_a:nick_a[socket.id], Time_now:moment().format('HH:mm')});
        io.to(socket.id).emit("skcreated", {socketid:socket.id});
    } );
    
    socket.on( "disconnect", function () {
        io.emit( "notice", {socketid:socket.id.slice(0,6), disc:"접속을 종료하셨습니다.", Time_now:moment().format('HH:mm:ss')});
        delete nick_a[socket.id];
        update_list();
    });
} );

http.listen( 8000, ()=>{
    console.log( "listening on *:8000" );
});