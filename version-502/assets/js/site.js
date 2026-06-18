(function () {
  var toggle = document.querySelector("[data-mobile-toggle]");
  var panel = document.querySelector("[data-mobile-panel]");

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(
    document.querySelectorAll("[data-hero-slide]"),
  );
  var dots = Array.prototype.slice.call(
    document.querySelectorAll("[data-hero-dot]"),
  );
  var heroIndex = 0;

  function showHero(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === heroIndex);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === heroIndex);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      showHero(i);
    });
  });

  if (slides.length > 1) {
    showHero(0);
    setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  function applyFilter(scope) {
    var input = scope.querySelector("[data-filter-input]");
    var category = scope.querySelector("[data-filter-category]");
    var year = scope.querySelector("[data-filter-year]");
    var cards = Array.prototype.slice.call(
      scope.querySelectorAll(".movie-card"),
    );

    function run() {
      var q = input ? input.value.trim().toLowerCase() : "";
      var c = category ? category.value : "";
      var y = year ? year.value : "";

      cards.forEach(function (card) {
        var matchedText =
          !q || (card.dataset.search || "").toLowerCase().indexOf(q) >= 0;
        var matchedCategory = !c || card.dataset.category === c;
        var matchedYear = !y || card.dataset.year === y;
        card.classList.toggle(
          "hidden-by-filter",
          !(matchedText && matchedCategory && matchedYear),
        );
      });
    }

    if (input) {
      input.addEventListener("input", run);
    }
    if (category) {
      category.addEventListener("change", run);
    }
    if (year) {
      year.addEventListener("change", run);
    }
    run();
  }

  Array.prototype.slice
    .call(document.querySelectorAll("[data-filter-scope]"))
    .forEach(applyFilter);

  var resultRoot = document.querySelector("[data-search-results]");
  if (resultRoot && window.siteMovieIndex) {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim().toLowerCase();
    var source = window.siteMovieIndex;
    var matched = query
      ? source.filter(function (item) {
          return item.search.indexOf(query) >= 0;
        })
      : source.slice(0, 24);

    resultRoot.innerHTML = matched
      .slice(0, 120)
      .map(function (item) {
        return [
          '<article class="movie-card">',
          '<a class="card-cover" href="./' +
            item.file +
            '" aria-label="' +
            item.safeTitle +
            '">',
          '<img src="' +
            item.cover +
            '" alt="' +
            item.safeTitle +
            '" loading="lazy">',
          '<span class="play-mark">▶</span>',
          '<span class="card-category">' + item.safeCategory + "</span>",
          "</a>",
          '<div class="card-body">',
          '<h3><a href="./' + item.file + '">' + item.safeTitle + "</a></h3>",
          "<p>" + item.safeLine + "</p>",
          '<div class="card-meta"><span>' +
            item.year +
            "</span><span>" +
            item.safeRegion +
            "</span><span>" +
            item.safeType +
            "</span></div>",
          "</div>",
          "</article>",
        ].join("");
      })
      .join("");
  }
})();
