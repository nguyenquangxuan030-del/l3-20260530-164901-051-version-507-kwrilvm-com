(function () {
  function card(movie) {
    return [
      "<article class=\"movie-card\">",
      "<a href=\"" + movie.url + "\" aria-label=\"观看" + escapeHtml(movie.title) + "\">",
      "<figure class=\"card-poster\">",
      "<img src=\"" + movie.cover + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
      "<span class=\"card-badge\">" + escapeHtml(movie.category) + "</span>",
      "<span class=\"play-mark\">▶</span>",
      "</figure>",
      "<div class=\"card-body\">",
      "<div class=\"card-meta\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span></div>",
      "<h2>" + escapeHtml(movie.title) + "</h2>",
      "<p>" + escapeHtml(movie.oneLine) + "</p>",
      "<div class=\"tag-row\"><span>" + escapeHtml(movie.type) + "</span><span>" + escapeHtml(movie.genre.split(/[，、,/]/)[0] || movie.category) + "</span></div>",
      "</div>",
      "</a>",
      "</article>"
    ].join("");
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function query() {
    return new URLSearchParams(window.location.search).get("q") || "";
  }

  function render() {
    var q = query().trim();
    var input = document.getElementById("searchPageInput");
    var title = document.getElementById("searchTitle");
    var results = document.getElementById("searchResults");
    var empty = document.getElementById("searchEmpty");

    if (input) {
      input.value = q;
    }
    if (!results) {
      return;
    }

    if (!q) {
      var first = MOVIE_SEARCH_INDEX.slice(0, 24);
      results.innerHTML = first.map(card).join("");
      if (title) {
        title.textContent = "热门影片推荐";
      }
      if (empty) {
        empty.hidden = true;
      }
      return;
    }

    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    var matched = MOVIE_SEARCH_INDEX.filter(function (movie) {
      var hay = (movie.keywords || "").toLowerCase();
      return words.every(function (word) {
        return hay.indexOf(word) !== -1;
      });
    }).slice(0, 80);

    results.innerHTML = matched.map(card).join("");
    if (title) {
      title.textContent = "搜索：“" + q + "”";
    }
    if (empty) {
      empty.hidden = matched.length !== 0;
    }
  }

  document.addEventListener("DOMContentLoaded", render);
})();
