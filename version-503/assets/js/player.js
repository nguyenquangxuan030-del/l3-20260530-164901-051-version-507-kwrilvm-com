(function () {
  function initPlayer(shell) {
    var video = shell.querySelector("video");
    var cover = shell.querySelector(".player-cover");
    var hls = null;
    var loaded = false;

    if (!video || !cover) {
      return;
    }

    function requestPlay(keepCover) {
      shell.classList.add("is-playing");
      video.setAttribute("controls", "controls");
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {
          if (!keepCover) {
            shell.classList.remove("is-playing");
          }
        });
      }
    }

    function start() {
      var src = video.getAttribute("data-hls");
      if (!src) {
        return;
      }

      if (!loaded) {
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src;
          requestPlay(false);
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            requestPlay(false);
          });
          requestPlay(true);
        } else {
          video.src = src;
          requestPlay(false);
        }
      } else {
        requestPlay(false);
      }
    }

    cover.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (!loaded || video.paused) {
        start();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(initPlayer);
  });
})();
