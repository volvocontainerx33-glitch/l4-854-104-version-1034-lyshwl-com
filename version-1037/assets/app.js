(function () {
    var toggle = document.querySelector('.mobile-toggle');
    var panel = document.querySelector('.mobile-panel');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    var backTop = document.querySelector('.back-top');
    if (backTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 360) {
                backTop.classList.add('is-visible');
            } else {
                backTop.classList.remove('is-visible');
            }
        });
        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === current);
        });
    }

    if (slides.length) {
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });
        showSlide(0);
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    var filterInput = document.querySelector('[data-filter-input]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var regionSelect = document.querySelector('[data-region-filter]');
    var clearButton = document.querySelector('[data-filter-clear]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var empty = document.querySelector('.empty-message');

    if (filterInput && initialQuery) {
        filterInput.value = initialQuery;
    }

    function normalize(value) {
        return (value || '').toString().toLowerCase().trim();
    }

    function applyFilters() {
        var keyword = normalize(filterInput ? filterInput.value : '');
        var year = yearSelect ? yearSelect.value : '';
        var region = regionSelect ? regionSelect.value : '';
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = [
                card.getAttribute('data-title'),
                card.getAttribute('data-year'),
                card.getAttribute('data-region'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-type')
            ].join(' ').toLowerCase();
            var ok = true;

            if (keyword && haystack.indexOf(keyword) === -1) {
                ok = false;
            }
            if (year && card.getAttribute('data-year') !== year) {
                ok = false;
            }
            if (region && card.getAttribute('data-region') !== region) {
                ok = false;
            }

            card.style.display = ok ? '' : 'none';
            if (ok) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle('is-visible', visible === 0 && cards.length > 0);
        }
    }

    [filterInput, yearSelect, regionSelect].forEach(function (item) {
        if (item) {
            item.addEventListener('input', applyFilters);
            item.addEventListener('change', applyFilters);
        }
    });

    if (clearButton) {
        clearButton.addEventListener('click', function () {
            if (filterInput) {
                filterInput.value = '';
            }
            if (yearSelect) {
                yearSelect.value = '';
            }
            if (regionSelect) {
                regionSelect.value = '';
            }
            applyFilters();
        });
    }

    if (cards.length) {
        applyFilters();
    }
})();
