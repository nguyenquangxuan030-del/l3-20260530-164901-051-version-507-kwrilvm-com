(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var button = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
      panel.setAttribute("aria-hidden", open ? "false" : "true");
    });
  }

  function setupHero() {
    var slides = selectAll(".hero-slide");
    var dots = selectAll(".hero-dot");
    if (!slides.length || !dots.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function play() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide")) || 0);
        play();
      });
    });

    show(0);
    play();
  }

  function valueOf(id) {
    var node = document.getElementById(id);
    return node ? node.value.trim().toLowerCase() : "";
  }

  function setupFilters() {
    var scopes = selectAll(".filter-scope");
    if (!scopes.length) {
      return;
    }
    var search = document.getElementById("cardSearch");
    var year = document.getElementById("yearFilter");
    var type = document.getElementById("typeFilter");
    var empty = document.querySelector(".empty-state");

    function apply() {
      var keyword = valueOf("cardSearch");
      var yearValue = valueOf("yearFilter");
      var typeValue = valueOf("typeFilter");
      var visible = 0;

      scopes.forEach(function (scope) {
        selectAll(".movie-card, .rank-item", scope).forEach(function (card) {
          var keywords = (card.getAttribute("data-keywords") || "").toLowerCase();
          var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
          var cardType = (card.getAttribute("data-type") || "").toLowerCase();
          var matchKeyword = !keyword || keywords.indexOf(keyword) !== -1;
          var matchYear = !yearValue || cardYear === yearValue;
          var matchType = !typeValue || cardType === typeValue;
          var matched = matchKeyword && matchYear && matchType;
          card.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    [search, year, type].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });

    apply();
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
