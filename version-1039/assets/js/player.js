document.addEventListener('DOMContentLoaded', function () {
  var video = document.querySelector('[data-stream]');
  var cover = document.querySelector('.player-cover');
  var button = document.querySelector('.player-button');
  if (!video || !button) return;
  var stream = video.getAttribute('data-stream');
  var attached = false;
  var begin = function () {
    if (!stream) return;
    if (!attached) {
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else {
        video.src = stream;
      }
      attached = true;
    }
    if (cover) cover.classList.add('is-hidden');
    var promise = video.play();
    if (promise && promise.catch) {
      promise.catch(function () {});
    }
  };
  button.addEventListener('click', begin);
  if (cover) cover.addEventListener('click', begin);
});
