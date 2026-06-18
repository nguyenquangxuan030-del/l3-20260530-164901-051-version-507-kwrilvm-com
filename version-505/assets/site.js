(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var index = 0;
  var timer = null;

  function showSlide(nextIndex) {
    if (!slides.length) {
      return;
    }
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }
    timer = window.setInterval(function () {
      showSlide(index + 1);
    }, 5600);
  }

  function restartHero() {
    if (timer) {
      window.clearInterval(timer);
    }
    startHero();
  }

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(index - 1);
      restartHero();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(index + 1);
      restartHero();
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
      restartHero();
    });
  });

  startHero();

  Array.prototype.slice.call(document.querySelectorAll('[data-search-form]')).forEach(function (form) {
    var input = form.querySelector('[data-search-input]');
    var region = form.querySelector('[data-region-filter]');
    var type = form.querySelector('[data-type-filter]');
    var target = form.getAttribute('data-target') || '[data-card-list]';
    var list = document.querySelector(target);
    if (!list) {
      return;
    }
    var cards = Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]'));

    function applyFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var regionValue = region ? region.value : '';
      var typeValue = type ? type.value : '';

      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        var cardRegion = card.getAttribute('data-region') || '';
        var cardType = card.getAttribute('data-type') || '';
        var matched = true;

        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }
        if (regionValue && cardRegion !== regionValue) {
          matched = false;
        }
        if (typeValue && cardType !== typeValue) {
          matched = false;
        }
        card.classList.toggle('is-hidden', !matched);
      });
    }

    ['input', 'change'].forEach(function (eventName) {
      if (input) {
        input.addEventListener(eventName, applyFilter);
      }
      if (region) {
        region.addEventListener(eventName, applyFilter);
      }
      if (type) {
        type.addEventListener(eventName, applyFilter);
      }
    });
  });

  var player = document.querySelector('[data-player]');
  if (player) {
    var video = player.querySelector('video');
    var playButton = player.querySelector('[data-play-button]');
    var overlay = player.querySelector('.player-overlay');
    var engine = null;

    function beginPlayback() {
      if (!video) {
        return;
      }
      var src = video.getAttribute('data-video-src') || '';
      if (!src) {
        return;
      }
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      video.controls = true;

      if (window.Hls && window.Hls.isSupported()) {
        if (!engine) {
          engine = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          engine.loadSource(src);
          engine.attachMedia(video);
        }
        engine.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
      } else {
        if (video.src !== src) {
          video.src = src;
        }
        video.play().catch(function () {});
      }
    }

    if (playButton) {
      playButton.addEventListener('click', beginPlayback);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        beginPlayback();
      }
    });
  }
})();
