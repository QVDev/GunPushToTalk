const gunDB = Gun('https://gunptt.herokuapp.com/gun');

var message = document.querySelector('#message');
var usersCounter = document.querySelector('#users');
var button = document.querySelector('#btn-record');
var info = document.querySelector("#info-subscribe");
var subscribe = document.querySelector("#btn-subscribe");
var channelInput = document.querySelector("#input-channel");

var room = "general-gun"
var hashRoom = window.location.hash.split('#')[1]
if (hashRoom != undefined) {
    room = window.location.hash.split('#')[1];
}

audioBridge.init();

showMessage("Welcome to room\n" + room);
showMessage("\n\nPress or hold button or spacebar")

function showMessage(msg) {
    message.textContent += `\n${msg}`;
}

window.pressedButton = false;

document.onkeyup = function (e) {
    if (e.which == 32) {
        console.log("stop");
        window.pressedButton = false;
        button.onpointerup();
    }
}

document.onkeydown = function (e) {
    if (e.which == 32 && window.pressedButton == false && button.disabled == false) {
        console.log("start")
        window.pressedButton = true;
        button.onpointerdown();
    }
}