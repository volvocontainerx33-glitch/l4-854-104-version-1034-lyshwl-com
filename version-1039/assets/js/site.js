document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.mobile-toggle');
  var panel = document.querySelector('.mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('.hero');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var active = 0;
    var setActive = function (index) {
      if (!slides.length) return;
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        setActive(i);
      });
    });
    setInterval(function () {
      setActive(active + 1);
    }, 5200);
  }

  document.querySelectorAll('.filter-input').forEach(function (input) {
    input.addEventListener('input', function () {
      var query = input.value.trim().toLowerCase();
      var cards = document.querySelectorAll('.movie-card');
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-text') || '').toLowerCase();
        card.style.display = text.indexOf(query) >= 0 ? '' : 'none';
      });
    });
  });

  document.querySelectorAll('.sort-select').forEach(function (select) {
    select.addEventListener('change', function () {
      var grid = document.querySelector('.movie-grid');
      if (!grid) return;
      var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
      var mode = select.value;
      cards.sort(function (a, b) {
        if (mode === 'title') {
          return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
        }
        var ay = parseInt(a.getAttribute('data-year') || '0', 10) || 0;
        var by = parseInt(b.getAttribute('data-year') || '0', 10) || 0;
        return by - ay;
      });
      cards.forEach(function (card) {
        grid.appendChild(card);
      });
    });
  });

  var backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('is-visible', window.scrollY > 560);
    });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var resultsRoot = document.querySelector('[data-search-results]');
  if (resultsRoot && typeof siteSearchIndex !== 'undefined') {
    var params = new URLSearchParams(window.location.search);
    var q = (params.get('q') || '').trim();
    var input = document.querySelector('.search-page-input');
    if (input) input.value = q;
    var render = function (items) {
      if (!items.length) {
        resultsRoot.innerHTML = '<div class="empty-state">暂无影片</div>';
        return;
      }
      resultsRoot.innerHTML = items.map(function (item) {
        var tags = item.tags.slice(0, 3).map(function (tag) {
          return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return '<a class="movie-card" href="' + item.href + '" data-title="' + escapeHtml(item.title) + '" data-year="' + escapeHtml(item.year) + '" data-text="' + escapeHtml(item.text) + '">' +
          '<span class="poster" style="background-image: url(\'' + item.cover + '\');">' +
          '<span class="poster-shade"></span>' +
          '<span class="poster-info">' + escapeHtml(item.oneLine) + '</span>' +
          '<span class="year-badge">' + escapeHtml(item.year) + '</span>' +
          '<span class="play-dot">▶</span>' +
          '</span>' +
          '<span class="movie-card-body">' +
          '<strong>' + escapeHtml(item.title) + '</strong>' +
          '<span class="movie-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></span>' +
          '<span class="movie-tags">' + tags + '</span>' +
          '</span>' +
          '</a>';
      }).join('');
    };
    var escapeHtml = function (value) {
      return String(value).replace(/[&<>"]/g, function (char) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char];
      });
    };
    var source = siteSearchIndex;
    var matches = q ? source.filter(function (item) {
      return item.text.toLowerCase().indexOf(q.toLowerCase()) >= 0;
    }) : source.slice(0, 60);
    render(matches.slice(0, 120));
  }
});
