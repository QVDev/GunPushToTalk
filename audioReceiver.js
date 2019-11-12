var audioReceiver = (function () {

  var audiostream = new AudioStream()
  var player;


  function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    bufView = null;
    return buf;
  }

  function receivedStarted() {
    console.log("Disable button?");
  }

  function receivedStopped() {
    player.stop();
  }

  function receivedMetadata(metadata) {
    player = audiostream.getNewPlayer(metadata);
  }

  function receivedAudioData(audioData) {
    let byteCharacters = atob(audioData);
    let byteArray = str2ab(byteCharacters);

    player.play(byteArray);
  }

  function receivedEvent(data) {
    if (data.event == 'started') {
      receivedStarted()

    } else if (data.event == 'stopped') {
      receivedStopped()

    } else if (data.event == 'metadata') {
      var metadata = JSON.parse(data.data);
      receivedMetadata(metadata);

    } else if (data.event == 'binary') {
      receivedAudioData(data.data)
    }
  }

  return {
    receive: receivedEvent
  };

})();
