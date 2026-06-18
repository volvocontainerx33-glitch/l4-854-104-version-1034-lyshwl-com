(function () {
  var headerInner = document.querySelector('.header-inner');
  var menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle && headerInner) {
    menuToggle.addEventListener('click', function () {
      headerInner.classList.toggle('is-open');
    });
  }

  var carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle('is-active', idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle('is-active', idx === current);
      });
    }

    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        showSlide(idx);
      });
    });

    setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  function applyFilter(input) {
    var list = document.querySelector('.searchable-list');
    if (!list) {
      return;
    }
    var keyword = (input.value || '').trim().toLowerCase();
    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
    cards.forEach(function (card) {
      var text = (card.getAttribute('data-search') || '').toLowerCase();
      card.classList.toggle('is-hidden-card', keyword && text.indexOf(keyword) === -1);
    });
  }

  var filterInput = document.querySelector('.page-filter');
  if (filterInput) {
    filterInput.addEventListener('input', function () {
      applyFilter(filterInput);
    });
  }

  var globalInput = document.getElementById('globalSearchInput');
  if (globalInput) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    globalInput.value = query;
    applyFilter(globalInput);
  }

  var sortSelect = document.querySelector('.sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      var list = document.querySelector('.searchable-list');
      if (!list) {
        return;
      }
      var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
      var mode = sortSelect.value;
      cards.sort(function (a, b) {
        if (mode === 'year-desc') {
          return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
        }
        if (mode === 'title-asc') {
          return String(a.getAttribute('data-title') || '').localeCompare(String(b.getAttribute('data-title') || ''), 'zh-Hans-CN');
        }
        return 0;
      });
      cards.forEach(function (card) {
        list.appendChild(card);
      });
    });
  }

  var backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('is-visible', window.scrollY > 320);
    });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

function initPlayer(source) {
  var video = document.getElementById('moviePlayer');
  var overlay = document.getElementById('playOverlay');
  if (!video || !source) {
    return;
  }

  var hlsInstance = null;
  var prepared = false;

  function prepare() {
    if (prepared) {
      return;
    }
    prepared = true;
    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal || !hlsInstance) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hlsInstance.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hlsInstance.recoverMediaError();
        } else {
          hlsInstance.destroy();
        }
      });
    } else {
      video.src = source;
    }
  }

  function play() {
    prepare();
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener('click', play);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });
}
