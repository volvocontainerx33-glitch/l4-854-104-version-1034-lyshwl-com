(function () {
    function attach(video, src, shell) {
        if (shell.getAttribute('data-ready') === '1') {
            var again = video.play();
            if (again && again.catch) {
                again.catch(function () {});
            }
            return;
        }
        shell.setAttribute('data-ready', '1');
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ maxBufferLength: 45 });
            hls.loadSource(src);
            hls.attachMedia(video);
        } else {
            video.src = src;
        }
        video.controls = true;
        shell.classList.add('is-playing');
        var started = video.play();
        if (started && started.catch) {
            started.catch(function () {});
        }
    }

    window.initMoviePlayer = function (id, src) {
        var shell = document.getElementById(id);
        if (!shell) {
            return;
        }
        var video = shell.querySelector('video');
        var cover = shell.querySelector('.player-cover');
        if (!video || !cover) {
            return;
        }
        cover.addEventListener('click', function () {
            attach(video, src, shell);
        });
        video.addEventListener('click', function () {
            attach(video, src, shell);
        });
    };
}());
