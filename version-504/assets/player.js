(function () {
    function startPlayer(container) {
        var video = container.querySelector("video");
        var button = container.querySelector("[data-play-button]");
        var streamUrl = container.getAttribute("data-src");
        var initialized = false;
        var hlsInstance = null;

        if (!video || !streamUrl) {
            return;
        }

        function attach() {
            if (initialized) {
                return;
            }

            initialized = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.ERROR, function (_event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hlsInstance.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hlsInstance.recoverMediaError();
                    } else {
                        hlsInstance.destroy();
                        hlsInstance = null;
                        video.src = streamUrl;
                    }
                });
                return;
            }

            video.src = streamUrl;
        }

        function play() {
            attach();
            container.classList.add("is-playing");
            if (button) {
                button.hidden = true;
            }
            video.controls = true;
            var request = video.play();
            if (request && typeof request.catch === "function") {
                request.catch(function () {
                    if (button) {
                        button.hidden = false;
                    }
                    container.classList.remove("is-playing");
                });
            }
        }

        if (button) {
            button.addEventListener("click", play);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
    }

    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        document.querySelectorAll("[data-player]").forEach(startPlayer);
    });
})();
