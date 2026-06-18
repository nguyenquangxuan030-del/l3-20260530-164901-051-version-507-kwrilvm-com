(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  var carousel = document.querySelector("[data-hero-carousel]");

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
    var prev = carousel.querySelector("[data-hero-prev]");
    var next = carousel.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    function startAuto() {
      stopAuto();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function stopAuto() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        startAuto();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(current - 1);
        startAuto();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(current + 1);
        startAuto();
      });
    }

    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);
    startAuto();
  }

  var filterBars = document.querySelectorAll("[data-filter-bar]");

  filterBars.forEach(function (bar) {
    var input = bar.querySelector(".category-filter-input");
    var year = bar.querySelector(".category-filter-year");
    var grid = bar.parentElement.querySelector(".category-movie-grid");

    if (!grid) {
      return;
    }

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));

    function applyFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      var yearValue = year ? year.value : "";

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-genre") || "",
          card.getAttribute("data-year") || ""
        ].join(" ").toLowerCase();
        var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchYear = !yearValue || card.getAttribute("data-year") === yearValue;
        card.hidden = !(matchKeyword && matchYear);
      });
    }

    if (input) {
      input.addEventListener("input", applyFilter);
    }

    if (year) {
      year.addEventListener("change", applyFilter);
    }
  });

  var searchPage = document.querySelector("[data-search-page]");

  if (searchPage && window.SEARCH_MOVIES) {
    var searchInput = searchPage.querySelector("[data-search-input]");
    var searchYear = searchPage.querySelector("[data-search-year]");
    var searchType = searchPage.querySelector("[data-search-type]");
    var searchResults = searchPage.querySelector("[data-search-results]");
    var searchStatus = searchPage.querySelector("[data-search-status]");
    var params = new URLSearchParams(window.location.search);

    function uniqueValues(key) {
      return Array.from(new Set(window.SEARCH_MOVIES.map(function (movie) {
        return movie[key];
      }).filter(Boolean))).sort().reverse();
    }

    uniqueValues("year").forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      searchYear.appendChild(option);
    });

    uniqueValues("type").forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      searchType.appendChild(option);
    });

    if (params.get("q")) {
      searchInput.value = params.get("q");
    }

    if (params.get("year")) {
      searchYear.value = params.get("year");
    }

    function cardTemplate(movie) {
      var tagHtml = movie.tags.slice(0, 3).map(function (tag) {
        return "<span>" + escapeHtml(tag) + "</span>";
      }).join("");

      return [
        "<article class=\"movie-card\">",
        "<a href=\"" + escapeHtml(movie.url) + "\" class=\"poster-link\" aria-label=\"观看" + escapeHtml(movie.title) + "\">",
        "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
        "<span class=\"poster-badge\">" + escapeHtml(movie.type) + "</span>",
        "<span class=\"play-hover\">▶</span>",
        "</a>",
        "<div class=\"card-body\">",
        "<div class=\"card-meta\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span></div>",
        "<h3><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>",
        "<p>" + escapeHtml(movie.oneLine) + "</p>",
        "<div class=\"tag-row\">" + tagHtml + "</div>",
        "<div class=\"card-foot\"><a href=\"" + escapeHtml(movie.categoryUrl) + "\">" + escapeHtml(movie.category) + "</a><span>热度 " + escapeHtml(movie.heat) + "</span></div>",
        "</div>",
        "</article>"
      ].join("");
    }

    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function applySearch() {
      var keyword = searchInput.value.trim().toLowerCase();
      var yearValue = searchYear.value;
      var typeValue = searchType.value;

      var results = window.SEARCH_MOVIES.filter(function (movie) {
        var text = [movie.title, movie.region, movie.type, movie.genre, movie.tags.join(" "), movie.oneLine, movie.year].join(" ").toLowerCase();
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchYear = !yearValue || movie.year === yearValue;
        var matchType = !typeValue || movie.type === typeValue;
        return matchKeyword && matchYear && matchType;
      }).slice(0, 120);

      searchResults.innerHTML = results.map(cardTemplate).join("");
      searchStatus.textContent = results.length ? "已显示当前匹配内容" : "没有找到匹配内容";
    }

    searchInput.addEventListener("input", applySearch);
    searchYear.addEventListener("change", applySearch);
    searchType.addEventListener("change", applySearch);
    applySearch();
  }
})();
