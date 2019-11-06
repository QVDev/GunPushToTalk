function Events() {
    this.appEvents = ['started', 'stopped']
    this.listeners = {};
}

Events.prototype.send = function (data) {
    // console.log(data);

    if (typeof data === "string") {
        if (this.appEvents.includes(data)) {
            this.dispatchEvent(data, data);
        } else {
            try {
                var o = JSON.parse(data);
                if ('meta' in o) {
                    this.dispatchEvent('metadata', o.meta);
                } else {
                    // do nothing for now!
                }
            } catch (e) {
                // do nothing!
            }
        }
    } else {
        var base64String = btoa(
            new Uint8Array(data)
                .reduce((onData, byte) => onData + String.fromCharCode(byte), ''));

        this.dispatchEvent('binary', base64String);
    }
}

Events.prototype.addEventListener = function (event, callback) {
    if (!(event in this.listeners)) {
        this.listeners[event] = []
    }
    this.listeners[event].push(callback);
}

Events.prototype.removeEventListener = function (event, callback) {
    if (!(event in this.listeners)) {
        return;
    }
    for (var i = 0, l = this.listeners[event].length; i < l; i++) {
        if (this.listeners[event][i] === callback) {
            this.listeners[event].splice(i, 1);
            return;
        }
    }
}

Events.prototype.dispatchEvent = function (event, data) {
    if (!(event in this.listeners)) {
        return;
    }
    // for (var i = 0; i < this.listeners[event].length; i++) {
    // this.listeners[event][i].call(this, data);
    // console.log("sent\n" + JSON.stringify(data));
    sentData = {}
    sentData.user = gunDB._.opt.pid
    sentData.event = event
    sentData.timestamp = new Date().getTime();

    if (event == 'metadata') {
        sentData.data = JSON.stringify(data);
    }
    else {
        sentData.data = data;
    }
    
    gunDB.get('audio').get(room).put(sentData);    
    // }
}