var audioBridge = (function () {

  var lastTimeStamp = new Date().getTime();
  var initial = true;

  function init() {
    gunDB.get('audio').get(room).on(function (data, room) {

      if (initial) {
        initial = false;
        return;
      }

      if (lastTimeStamp == data.timestamp) {
        return;
      }
      lastTimeStamp = data.timestamp;

      if (data.user == gunDB._.opt.pid) {
        return;
      }

      audioReceiver.receive(data)
    })
  }

  function sendToGun(data) {
    gunDB.get('audio').get(room).put(data);
  }

  return {
    init: init,
    send: sendToGun
  };

})();
