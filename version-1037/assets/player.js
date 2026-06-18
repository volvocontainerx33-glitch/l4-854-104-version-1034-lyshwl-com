(function () {
    window.bindMoviePlayer = function (config) {
        var video = document.getElementById(config.video);
        var overlay = document.getElementById(config.overlay);
        var hls = null;

        if (!video || !overlay) {
            return;
        }

        function prepare() {
            if (video.getAttribute('data-ready') === '1') {
                return;
            }

            video.setAttribute('poster', config.poster);

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = config.source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(config.source);
                hls.attachMedia(video);
            } else {
                video.src = config.source;
            }

            video.setAttribute('data-ready', '1');
        }

        function start() {
            prepare();
            overlay.classList.add('is-hidden');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    overlay.classList.remove('is-hidden');
                });
            }
        }

        overlay.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener('play', function () {
            overlay.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
            if (video.currentTime === 0 || video.ended) {
                overlay.classList.remove('is-hidden');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
