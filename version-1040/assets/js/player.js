function initMoviePlayer(source) {
    var video = document.getElementById("movie-video");
    var layer = document.getElementById("movie-play-layer");
    var hlsInstance = null;

    if (!video || !source) {
        return;
    }

    function loadMedia() {
        if (video.getAttribute("data-loaded") === "1") {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else {
            video.src = source;
        }

        video.setAttribute("data-loaded", "1");
        video.controls = true;
    }

    function playMedia() {
        loadMedia();

        if (layer) {
            layer.classList.add("is-hidden");
        }

        var request = video.play();

        if (request && typeof request.catch === "function") {
            request.catch(function () {});
        }
    }

    if (layer) {
        layer.addEventListener("click", playMedia);
    }

    video.addEventListener("click", function () {
        if (video.paused) {
            playMedia();
        }
    });

    video.addEventListener("play", function () {
        if (layer) {
            layer.classList.add("is-hidden");
        }
    });

    video.addEventListener("ended", function () {
        if (layer) {
            layer.classList.remove("is-hidden");
        }
    });

    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
}
