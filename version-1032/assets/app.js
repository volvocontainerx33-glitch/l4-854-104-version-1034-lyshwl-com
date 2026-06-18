document.addEventListener("DOMContentLoaded", function () {
  setupNavigation();
  setupHero();
  setupFilters();
  setupBackTop();
  carrySearchQuery();
});

function setupNavigation() {
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  if (!toggle || !menu) {
    return;
  }
  toggle.addEventListener("click", function () {
    menu.classList.toggle("is-open");
  });
}

function setupHero() {
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var prev = document.querySelector("[data-hero-prev]");
  var next = document.querySelector("[data-hero-next]");
  if (!slides.length) {
    return;
  }
  var index = 0;
  var timer = null;

  function show(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach(function (slide, position) {
      slide.classList.toggle("is-active", position === index);
    });
    dots.forEach(function (dot, position) {
      dot.classList.toggle("is-active", position === index);
    });
  }

  function start() {
    stop();
    timer = window.setInterval(function () {
      show(index + 1);
    }, 5000);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach(function (dot, position) {
    dot.addEventListener("click", function () {
      show(position);
      start();
    });
  });

  if (prev) {
    prev.addEventListener("click", function () {
      show(index - 1);
      start();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      show(index + 1);
      start();
    });
  }

  start();
}

function setupFilters() {
  var scopes = Array.prototype.slice.call(document.querySelectorAll(".filter-scope"));
  scopes.forEach(function (scope) {
    var search = scope.querySelector("[data-filter-search]");
    var region = scope.querySelector("[data-filter-region]");
    var year = scope.querySelector("[data-filter-year]");
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
    if (!cards.length) {
      return;
    }

    function apply() {
      var keyword = search ? search.value.trim().toLowerCase() : "";
      var regionValue = region ? region.value : "";
      var yearValue = year ? year.value : "";
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-tags") || "").toLowerCase();
        var cardRegion = card.getAttribute("data-region") || "";
        var cardYear = card.getAttribute("data-year") || "";
        var matched = true;
        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }
        if (regionValue && cardRegion !== regionValue) {
          matched = false;
        }
        if (yearValue && cardYear !== yearValue) {
          matched = false;
        }
        card.style.display = matched ? "" : "none";
      });
    }

    [search, region, year].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
  });
}

function setupBackTop() {
  var button = document.getElementById("backTop");
  if (!button) {
    return;
  }
  window.addEventListener("scroll", function () {
    button.classList.toggle("is-visible", window.scrollY > 460);
  });
  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function carrySearchQuery() {
  var input = document.getElementById("searchInput");
  if (!input) {
    return;
  }
  var params = new URLSearchParams(window.location.search);
  var query = params.get("q");
  if (query) {
    input.value = query;
    input.dispatchEvent(new Event("input"));
  }
}
