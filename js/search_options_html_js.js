[
  './js/helper.js',
  './js/search.js',
  './js/search_options.js'
].forEach(function(src) {
  var script = document.createElement('script');
  script.src = src;
  script.async = false;
  document.head.appendChild(script);
});
