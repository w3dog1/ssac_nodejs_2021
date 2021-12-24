const socket = io.connect("");

socket.on("connect", function(){
    console.log("Server Connected!🌐");
});

/*
function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", { payload: input.value });
    input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);
*/