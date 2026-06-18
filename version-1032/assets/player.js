(function () {
  function loadHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js";
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  window.initMoviePlayer = function (streamUrl) {
    var video = document.getElementById("moviePlayer");
    var overlay = document.getElementById("playOverlay");
    var started = false;
    var hlsInstance = null;

    if (!video || !overlay || !streamUrl) {
      return;
    }

    function playVideo() {
      var playing = video.play();
      if (playing && typeof playing.catch === "function") {
        playing.catch(function () {});
      }
    }

    function attachAndPlay() {
      overlay.classList.add("is-hidden");
      if (started) {
        playVideo();
        return;
      }
      started = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        video.addEventListener("loadedmetadata", playVideo, { once: true });
        video.load();
        playVideo();
        return;
      }

      loadHls().then(function (Hls) {
        if (Hls && Hls.isSupported()) {
          hlsInstance = new Hls({ enableWorker: true });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, playVideo);
        } else {
          video.src = streamUrl;
          video.load();
          playVideo();
        }
      }).catch(function () {
        video.src = streamUrl;
        video.load();
        playVideo();
      });
    }

    overlay.addEventListener("click", attachAndPlay);
    video.addEventListener("click", function () {
      if (video.paused) {
        attachAndPlay();
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
