(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var toggle = qs(".nav-toggle");
    var mobileNav = qs(".mobile-nav");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    var backTop = qs(".back-to-top");

    if (backTop) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 360) {
                backTop.classList.add("is-visible");
            } else {
                backTop.classList.remove("is-visible");
            }
        });

        backTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    var slider = qs(".hero-slider");

    if (slider) {
        var slides = qsa(".hero-slide", slider);
        var dots = qsa(".hero-dot", slider);
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function startTimer() {
            if (timer) {
                clearInterval(timer);
            }

            timer = setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    var panels = qsa(".filter-panel");

    panels.forEach(function (panel) {
        var input = qs(".filter-input", panel);
        var yearSelect = qs(".filter-year", panel);
        var sortSelect = qs(".filter-sort", panel);
        var section = panel.closest(".content-section");
        var grid = section ? qs(".movie-grid", section) : null;
        var cards = grid ? qsa(".movie-card", grid) : [];
        var empty = section ? qs(".empty-state", section) : null;
        var years = [];

        cards.forEach(function (card) {
            var year = card.getAttribute("data-year") || "";

            if (year && years.indexOf(year) === -1) {
                years.push(year);
            }
        });

        years.sort(function (a, b) {
            return Number(b) - Number(a);
        });

        if (yearSelect) {
            years.forEach(function (year) {
                var option = document.createElement("option");
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            });
        }

        function applyFilter() {
            var query = input ? input.value.trim().toLowerCase() : "";
            var year = yearSelect ? yearSelect.value : "";
            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute("data-tags") || "").toLowerCase();
                var cardYear = card.getAttribute("data-year") || "";
                var matched = (!query || text.indexOf(query) !== -1) && (!year || cardYear === year);
                card.classList.toggle("is-hidden", !matched);

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        function applySort() {
            if (!grid || !sortSelect) {
                return;
            }

            var mode = sortSelect.value;
            var sorted = cards.slice();

            if (mode === "year-desc") {
                sorted.sort(function (a, b) {
                    return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
                });
            }

            if (mode === "title-asc") {
                sorted.sort(function (a, b) {
                    return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-Hans-CN");
                });
            }

            sorted.forEach(function (card) {
                grid.appendChild(card);
            });

            applyFilter();
        }

        if (input) {
            input.addEventListener("input", applyFilter);
        }

        if (yearSelect) {
            yearSelect.addEventListener("change", applyFilter);
        }

        if (sortSelect) {
            sortSelect.addEventListener("change", applySort);
        }
    });

    var rankingFilter = qs(".ranking-filter");

    if (rankingFilter) {
        var rankingSection = rankingFilter.closest(".content-section");
        var rows = qsa(".ranking-row", rankingSection);
        var rankingEmpty = qs(".empty-state", rankingSection);

        rankingFilter.addEventListener("input", function () {
            var query = rankingFilter.value.trim().toLowerCase();
            var visible = 0;

            rows.forEach(function (row) {
                var text = (row.getAttribute("data-tags") || "").toLowerCase();
                var matched = !query || text.indexOf(query) !== -1;
                row.classList.toggle("is-hidden", !matched);

                if (matched) {
                    visible += 1;
                }
            });

            if (rankingEmpty) {
                rankingEmpty.classList.toggle("is-visible", visible === 0);
            }
        });
    }

    var searchInput = qs("#search-page-input");
    var searchResults = qs("#search-results");

    if (searchInput && searchResults && window.MOVIE_SEARCH_DATA) {
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q") || "";

        if (initialQuery) {
            searchInput.value = initialQuery;
            renderSearch(initialQuery);
        }

        searchInput.closest("form").addEventListener("submit", function (event) {
            event.preventDefault();
            renderSearch(searchInput.value);
            var nextUrl = "search.html";

            if (searchInput.value.trim()) {
                nextUrl += "?q=" + encodeURIComponent(searchInput.value.trim());
            }

            window.history.replaceState(null, "", nextUrl);
        });

        searchInput.addEventListener("input", function () {
            renderSearch(searchInput.value);
        });
    }

    function renderSearch(query) {
        var value = (query || "").trim().toLowerCase();
        var empty = qs(".search-page-section .empty-state");
        var data = window.MOVIE_SEARCH_DATA || [];
        var matched = data.filter(function (movie) {
            return !value || movie.text.toLowerCase().indexOf(value) !== -1;
        }).slice(0, 240);

        searchResults.innerHTML = matched.map(function (movie) {
            return [
                '<article class="movie-card">',
                '    <a class="movie-poster" href="' + movie.url + '" aria-label="观看' + escapeHtml(movie.title) + '">',
                '        <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
                '        <span class="poster-shade"></span>',
                '        <span class="year-badge">' + escapeHtml(movie.year) + '</span>',
                '        <span class="play-badge">▶</span>',
                '        <p class="poster-line">' + escapeHtml(movie.oneLine) + '</p>',
                '    </a>',
                '    <div class="movie-card-body">',
                '        <h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
                '        <div class="movie-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
                '        <div class="tag-list">' + movie.tags.slice(0, 3).map(function (tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join("") + '</div>',
                '    </div>',
                '</article>'
            ].join("");
        }).join("");

        if (empty) {
            empty.classList.toggle("is-visible", matched.length === 0);
        }
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}());
