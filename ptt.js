/**
 * Push-to-Talk object.
 */
const ptt = (function () {

    var websocket;
    var audiostream;
    var button;
    var id;
    var initial = true;

    return {
        connect: function () {
            /**
             * Binds UI button to ptt.
             * @param {HTMLElement} btn 
             */
            const bind = (btn) => {
                button = btn;
                audiostream.getRecorder().then(recorder => {

                    button.onpointerdown = () => {
                        recorder.start();
                    };

                    button.onpointerup = () => {
                        recorder.stop();
                    };
                });
            };

            // add listener to foo
            gunDB.get('audio').get('gun-talk').on(function (data, room) {
                // console.log("received\n" + JSON.stringify(data));

                if (initial) {
                    initial = false;
                    return;
                }

                if (data.user == gunDB._.opt.pid) {
                    return;
                }

                data.event = JSON.parse(data.event);

                if (data.event == 'started') {
                    if (button) {
                        button.disabled = true;
                    }
                }

                else if (data.event == 'stopped') {
                    if (button) {
                        button.disabled = false;
                    }
                    player.stop();
                }

                else if (data.event.channels != undefined) {
                    player = audiostream.getNewPlayer(data.event);
                }

                else {
                    let byteCharacters = atob(data.event);
                    let byteArray = str2ab(byteCharacters);

                    player.play(byteArray);
                }
            })

            return new Promise((resolve, reject) => {
                var player;
                var websocket = new Events()
                audiostream = new AudioStream(websocket, {});
                resolve({ bind });

                websocket.addEventListener('started', event => {
                    if (button) {
                        button.disabled = true;
                    }
                });

                websocket.addEventListener('stopped', event => {
                    if (button) {
                        button.disabled = false;
                    }
                    player.stop();
                });

                websocket.addEventListener('metadata', metadata => {
                    player = audiostream.getNewPlayer(metadata);
                });

                websocket.addEventListener('binary', buffer => {
                    // var base64String = btoa(
                    //     new Uint8Array(buffer)
                    //         .reduce((onData, byte) => onData + String.fromCharCode(byte), ''));

                    let byteCharacters = atob(buffer);
                    let byteArray = str2ab(byteCharacters);

                    player.play(byteArray);
                });

            }).catch(function (err) {
                reject(err);
            });
        }
    }
})();

function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    bufView = null;
    return buf;
}