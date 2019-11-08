const root = 'audio'
const users = 'users_test'
const usersInRoom = new Map();


var pid = sessionStorage.getItem('pid');
if (pid == null || pid == undefined) {
    pid = gunDB._.opt.pid;
    sessionStorage.setItem('pid', pid);
}

console.log(pid);

window.onunload = window.onbeforeunload = function()
{
    console.log("leaving " + pid);
    setPresence("left");
}

window.onload = function (e) {
    console.log("entering " + pid);
    setPresence("active")
}

function displayActiveUsers() {
    gunDB.get(root).get(users).map(user => user.currentRoom === room ? user : undefined).on(function (user, id) {
        if (user.state == 'active') {
            usersInRoom.set(user.pid, user.state)
        }
        else {
            usersInRoom.delete(user.pid);
        }
        console.log(usersInRoom.size);
        if(usersInRoom.size > 1) {
            usersCounter.textContent = usersInRoom.size + " users online";
        } else {
            usersCounter.textContent = usersInRoom.size + " user online";
        }
    });
}

function setPresence(currentState) {
    gunDB.get(root).get(users).get(pid).put({ pid: pid, currentRoom: room, state: currentState });
}

displayActiveUsers();

function addItem(channel) {
    if (itemExist(channel) == false) {
        var ul = document.getElementById("dynamic-list");
        var li = document.createElement("li");
        li.setAttribute('id', channel);
        li.appendChild(document.createTextNode(channel));
        ul.appendChild(li);
    }
}

function removeItem(channel) {
    var ul = document.getElementById("dynamic-list");
    var item = document.getElementById(channel);
    ul.removeChild(item);
}

function itemExist(channel) {
    if (document.getElementById(channel) != null) {
        return true;
    } else {
        return false;
    }
}
