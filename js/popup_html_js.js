[
  './js/helper.js',
  './js/search.js',
  './js/popup.js'
].forEach(function(src) {
  var script = document.createElement('script');
  script.src = src;
  script.async = false;
  document.head.appendChild(script);
});
