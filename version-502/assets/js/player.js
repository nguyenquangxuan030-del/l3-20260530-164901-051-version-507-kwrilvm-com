(function () {
  function initializePlayer(shell) {
    var video = shell.querySelector("video");
    var cover = shell.querySelector("[data-cover]");
    var button = shell.querySelector("[data-play]");

    if (!video) {
      return;
    }

    var stream = video.getAttribute("data-stream");
    if (stream) {
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      }
    }

    function reveal() {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    }

    function start() {
      reveal();
      var playback = video.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", start);
    }
    if (cover) {
      cover.addEventListener("click", start);
    }
    video.addEventListener("play", reveal);
  }

  Array.prototype.slice
    .call(document.querySelectorAll("[data-player]"))
    .forEach(initializePlayer);
})();
