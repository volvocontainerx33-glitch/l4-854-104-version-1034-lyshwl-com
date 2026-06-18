(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector('.menu-toggle');
        var panel = document.querySelector('.mobile-panel');
        if (toggle && panel) {
            toggle.addEventListener('click', function () {
                panel.classList.toggle('open');
                toggle.textContent = panel.classList.contains('open') ? '×' : '☰';
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
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }
        if (slides.length) {
            var next = document.querySelector('.hero-control.next');
            var prev = document.querySelector('.hero-control.prev');
            if (next) {
                next.addEventListener('click', function () {
                    showSlide(current + 1);
                });
            }
            if (prev) {
                prev.addEventListener('click', function () {
                    showSlide(current - 1);
                });
            }
            dots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    showSlide(parseInt(dot.getAttribute('data-slide'), 10) || 0);
                });
            });
            setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        var filterInputs = Array.prototype.slice.call(document.querySelectorAll('.filter-input'));
        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
        function applyFilter(value) {
            var key = String(value || '').trim().toLowerCase();
            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
                card.classList.toggle('hidden-by-filter', key && text.indexOf(key) === -1);
            });
        }
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        filterInputs.forEach(function (input) {
            if (query) {
                input.value = query;
            }
            input.addEventListener('input', function () {
                applyFilter(input.value);
            });
        });
        if (query) {
            applyFilter(query);
        }

        var backTop = document.querySelector('.back-top');
        if (backTop) {
            window.addEventListener('scroll', function () {
                backTop.classList.toggle('show', window.scrollY > 360);
            });
            backTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    });
}());
