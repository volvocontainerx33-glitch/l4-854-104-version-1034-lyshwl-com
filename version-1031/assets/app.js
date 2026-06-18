(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-main-nav]");
    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }

    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function uniqueValues(cards, attribute) {
    var values = [];
    cards.forEach(function (card) {
      var value = card.getAttribute(attribute);
      if (value && values.indexOf(value) === -1) {
        values.push(value);
      }
    });
    return values.sort(function (a, b) {
      return String(b).localeCompare(String(a), "zh-Hans-CN");
    });
  }

  function fillSelect(select, values) {
    if (!select) {
      return;
    }
    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function initFilters() {
    var search = document.querySelector("[data-movie-search]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    if (!search || cards.length === 0) {
      return;
    }

    var typeSelect = document.querySelector("[data-filter-type]");
    var yearSelect = document.querySelector("[data-filter-year]");
    var resetButton = document.querySelector("[data-filter-reset]");

    fillSelect(typeSelect, uniqueValues(cards, "data-type"));
    fillSelect(yearSelect, uniqueValues(cards, "data-year"));

    function apply() {
      var keyword = search.value.trim().toLowerCase();
      var typeValue = typeSelect ? typeSelect.value : "";
      var yearValue = yearSelect ? yearSelect.value : "";

      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || "").toLowerCase();
        var type = card.getAttribute("data-type") || "";
        var year = card.getAttribute("data-year") || "";
        var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchedType = !typeValue || type === typeValue;
        var matchedYear = !yearValue || year === yearValue;
        card.classList.toggle("is-hidden", !(matchedKeyword && matchedType && matchedYear));
      });
    }

    search.addEventListener("input", apply);
    if (typeSelect) {
      typeSelect.addEventListener("change", apply);
    }
    if (yearSelect) {
      yearSelect.addEventListener("change", apply);
    }
    if (resetButton) {
      resetButton.addEventListener("click", function () {
        search.value = "";
        if (typeSelect) {
          typeSelect.value = "";
        }
        if (yearSelect) {
          yearSelect.value = "";
        }
        apply();
      });
    }
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (frame) {
      var video = frame.querySelector("video");
      var button = frame.querySelector("[data-play-button]");
      if (!video || !button) {
        return;
      }

      var source = video.getAttribute("data-src");
      var attached = false;
      var hlsInstance = null;

      function attachSource() {
        if (attached || !source) {
          return;
        }
        attached = true;

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            maxBufferLength: 45
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      function playVideo() {
        attachSource();
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            button.classList.remove("is-hidden");
          });
        }
      }

      button.addEventListener("click", function (event) {
        event.preventDefault();
        button.classList.add("is-hidden");
        playVideo();
      });

      video.addEventListener("click", function () {
        if (video.paused) {
          button.classList.add("is-hidden");
          playVideo();
        } else {
          video.pause();
        }
      });

      video.addEventListener("play", function () {
        button.classList.add("is-hidden");
      });

      video.addEventListener("pause", function () {
        if (!video.ended) {
          button.classList.remove("is-hidden");
        }
      });

      video.addEventListener("ended", function () {
        button.classList.remove("is-hidden");
      });

      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayers();
  });
})();
