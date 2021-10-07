const socket = io();

const welcome = document.getElementById("welcom");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function ShowRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerHTML = `Room ${roomName}`;

    const msgform = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgform.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicnameSubmit);
}

function handleNicnameSubmit(event) {
    event.preventDefault();

    const input = room.querySelector("#name input");
    const value = input.value;

    socket.emit("nickname", value);
    input.value = "";
}

function handleMessageSubmit(event) {
    console.log("message send");
    event.preventDefault();

    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, ()=> {
        addMessage(`You: ${value}`);
    });

    input.value = "";
}

function backendDone(msg) {
    console.log(`The Backend says: ${msg}`);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value , ShowRoom);
    roomName = input.value;
    input.value = "";
    console.log("enter room");
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcom", (user, newCount)=> {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} arrived!`);
});

socket.on("bye", (left, newCount)=> {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${left} left!`);
});

socket.on("new_message", addMessage);

// 방 정보 갱신 메서드
socket.on("room_change", (rooms)=> {
    rooms.innerHTML = "";

    const roomList = welcome.querySelector("ul");
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});