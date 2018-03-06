var svs = [4,70,7,2,67,68];
var numsvs = 6;

function initializeSV() {

  chrome.storage.sync.get("default", function(val) {

    var default = JSON.parse(val.default);

    if (typeof val.default === 'undefined' || default) {

      var bool = JSON.stringify(false);

      chrome.storage.sync.set({"default": bool}, function() {});
      saveStorage("default", false);

      populateNew(svs, numsvs);

    } else {

      chrome.storage.sync.get("loststorage", function(val) {
        var lost = JSON.parse(val.loststorage);
        var num = svs.length;

        updateLocalSV(lost);

        populateSV(num);
      });
    }
  });
}

function updateLocalSV (array) {

	var newlost = new Array(array.length);

	for(var i = 0; i < array.length; i++) {

		newlost[i] = new Array(6);
		newlost[i] = array[i].slice(0);
	}

	saveStorage("loststorage", newlost);
}

function saveSettingsValues() {

  var newlost = new Array(svs.length);

  for (var i = 0; i <= numsvs; i++) {

    var oldid = svs[i];
    var tempv = document.getElementById("input"+oldid);
    var tempa = document.getElementById("always"+oldid).checked;
    var tempd = document.getElementById("dont"+oldid).checked;

    newlost[i] = new Array(6);
    newlost[i][0] = "-1";
    newlost[i][1] = i;
    newlost[i][2] = oldid;
    newlost[i][3] = tempv;
    newlost[i][4] = tempa;
    newlost[i][5] = tempd;
  }

  saveStorage(newlost);
  syncSV("loststorage", newlost);
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
    	document.getElementById("searchsettings").addEventListener("click", saveSettingsValues)
    }, 2000)
});

initializeSV();
