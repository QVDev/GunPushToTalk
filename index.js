var peers = ['https://livecodestream-us.herokuapp.com/gun', 'https://livecodestream-eu.herokuapp.com/gun'];
var opt = { peers: peers, localStorage: false, radisk: false };
const gunDB = Gun(opt);

var message = document.querySelector('#message');
var button = document.querySelector('#btn-record');
var info = document.querySelector("#info-subscribe");
var subscribe = document.querySelector("#btn-subscribe");
var channelInput = document.querySelector("#input-channel");

var room = "general-gun"
var hashRoom = window.location.hash.split('#')[1]
if (hashRoom != undefined) {
    room = window.location.hash.split('#')[1];
}

showMessage("Welcome to room\n" + room);

ptt.connect().then((connection) => {
    connection.bind(button);
}).catch(err => {
    showMessage("Connection failed!");
    showMessage(JSON.stringify(err));
});

function showMessage(msg) {
    message.textContent += `\n${msg}`;
}
