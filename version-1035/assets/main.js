(function () {
  function toText(value) {
    return (value || "").toString().toLowerCase().trim();
  }

  function showMobileMenu() {
    var button = document.querySelector("[data-menu-button]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupHero() {
    document.querySelectorAll("[data-hero-carousel]").forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
      var index = 0;
      if (!slides.length) {
        return;
      }
      function setSlide(next) {
        index = next;
        slides.forEach(function (slide, itemIndex) {
          slide.classList.toggle("is-active", itemIndex === index);
        });
        dots.forEach(function (dot, itemIndex) {
          dot.classList.toggle("is-active", itemIndex === index);
        });
      }
      dots.forEach(function (dot, itemIndex) {
        dot.addEventListener("click", function () {
          setSlide(itemIndex);
        });
      });
      window.setInterval(function () {
        setSlide((index + 1) % slides.length);
      }, 5000);
    });
  }

  function setupFilters() {
    document.querySelectorAll("[data-filter-section]").forEach(function (section) {
      var list = section.querySelector("[data-movie-list]");
      var queryInput = section.querySelector("[data-filter-query]");
      var yearSelect = section.querySelector("[data-filter-year]");
      var regionSelect = section.querySelector("[data-filter-region]");
      var typeSelect = section.querySelector("[data-filter-type]");
      var sortSelect = section.querySelector("[data-filter-sort]");
      var countBox = section.querySelector("[data-filter-count]");
      if (!list) {
        return;
      }
      var originalCards = Array.prototype.slice.call(list.querySelectorAll("[data-card]"));
      var params = new URLSearchParams(window.location.search);
      var urlQuery = params.get("q");
      if (urlQuery && queryInput) {
        queryInput.value = urlQuery;
      }
      function match(card) {
        var query = toText(queryInput && queryInput.value);
        var year = yearSelect ? yearSelect.value : "";
        var region = regionSelect ? regionSelect.value : "";
        var type = typeSelect ? typeSelect.value : "";
        var text = [
          card.dataset.title,
          card.dataset.year,
          card.dataset.region,
          card.dataset.type,
          card.dataset.genre,
          card.dataset.tags
        ].map(toText).join(" ");
        if (query && text.indexOf(query) === -1) {
          return false;
        }
        if (year && card.dataset.year !== year) {
          return false;
        }
        if (region && card.dataset.region !== region) {
          return false;
        }
        if (type && card.dataset.type !== type) {
          return false;
        }
        return true;
      }
      function sortCards(cards) {
        var mode = sortSelect ? sortSelect.value : "default";
        var sorted = cards.slice();
        if (mode === "year-desc") {
          sorted.sort(function (a, b) {
            return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
          });
        } else if (mode === "year-asc") {
          sorted.sort(function (a, b) {
            return Number(a.dataset.year || 0) - Number(b.dataset.year || 0);
          });
        } else if (mode === "title-asc") {
          sorted.sort(function (a, b) {
            return (a.dataset.title || "").localeCompare(b.dataset.title || "", "zh-Hans-CN");
          });
        } else {
          sorted = originalCards.slice();
        }
        sorted.forEach(function (card) {
          list.appendChild(card);
        });
      }
      function applyFilter() {
        var visible = 0;
        sortCards(originalCards);
        originalCards.forEach(function (card) {
          var ok = match(card);
          card.classList.toggle("is-hidden", !ok);
          if (ok) {
            visible += 1;
          }
        });
        if (countBox) {
          countBox.textContent = visible ? "匹配影片 " + visible : "未找到匹配影片";
        }
      }
      [queryInput, yearSelect, regionSelect, typeSelect, sortSelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilter);
          control.addEventListener("change", applyFilter);
        }
      });
      applyFilter();
    });
  }

  function setupPlayers() {
    document.querySelectorAll("video[data-stream]").forEach(function (video) {
      var source = video.getAttribute("data-stream");
      var button = document.querySelector('[data-play-button="' + video.id + '"]');
      var attached = false;
      function attach() {
        if (attached || !source) {
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          attached = true;
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(source);
          hls.attachMedia(video);
          video._hls = hls;
          attached = true;
          return;
        }
        video.src = source;
        attached = true;
      }
      function play() {
        attach();
        if (button) {
          button.classList.add("is-hidden");
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      }
      if (button) {
        button.addEventListener("click", play);
      }
      video.addEventListener("click", function () {
        if (!attached || video.paused) {
          play();
        }
      });
    });
  }

  function setupBackTop() {
    var button = document.createElement("button");
    button.className = "back-top";
    button.type = "button";
    button.setAttribute("aria-label", "返回顶部");
    button.textContent = "↑";
    document.body.appendChild(button);
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", function () {
      button.classList.toggle("is-visible", window.scrollY > 360);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    showMobileMenu();
    setupHero();
    setupFilters();
    setupPlayers();
    setupBackTop();
  });
})();
