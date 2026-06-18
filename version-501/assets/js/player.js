(function () {
  var players = document.querySelectorAll("[data-player]");

  players.forEach(function (player) {
    var video = player.querySelector("video");
    var overlay = player.querySelector(".player-overlay");
    var errorBox = player.querySelector(".player-error");
    var source = player.getAttribute("data-video");
    var ready = false;
    var hls = null;

    function showError(message) {
      if (errorBox) {
        errorBox.textContent = message;
        errorBox.classList.add("show");
      }
    }

    function prepareVideo() {
      if (ready || !video || !source) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        ready = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (!data || !data.fatal) {
            return;
          }

          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
            return;
          }

          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
            return;
          }

          showError("播放暂时不可用，请稍后再试");
        });
        ready = true;
        return;
      }

      showError("当前环境暂不支持播放");
    }

    function startPlay() {
      prepareVideo();

      if (!video) {
        return;
      }

      if (overlay) {
        overlay.classList.add("is-hidden");
      }

      video.controls = true;
      var playRequest = video.play();

      if (playRequest && typeof playRequest.catch === "function") {
        playRequest.catch(function () {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", startPlay);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          startPlay();
        }
      });
    }

    window.addEventListener("beforeunload", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  });
})();
