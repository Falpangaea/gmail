var numsvs = 6;
var svs = [4,70,7,2,67,68];
var oldid;
var tempv;
var tempa;
var tempd = false;
var lost = loadStorage("loststorage");

function initalizeP() {

  chrome.storage.sync.get("default", function(val) {

    var default = JSON.parse(val.default);

    if (typeof val.default === 'undefined' || default) {

      var bool = JSON.stringify(false);

      chrome.storage.sync.set({"default": bool}, function() {});
      saveStorage("default", false);

      populateNew();

    } else {

      oldid = lost[currid][2];
      tempv = lost[currid][3];
      tempa = lost[currid][4];

      document.getElementById("input"+oldid).value = tempv;
      document.getElementById("always"+oldid).checked = tempa;
      document.getElementById("dont"+oldid).checked = false;
    }
  });
}

function searchOnClickP(info, tab) {

  lost[id][3] = document.getElementById("input"+oldid).value;
  lost[id][4] = document.getElementById("always"+oldid).checked;
  lost[id][5] = document.getElementById("dont"+oldid).checked;

  saveStorage("loststorage", lost);
  chrome.storage.sync.set({"loststorage": lost}, function(){});

	var itemindex = 0;
	numentries = temp.length;

	for(var i = 0; i < numentries; i++) {
		if(info.menuItemId == temp[i][0]) {
			itemindex = i;
		}
	}

	var index = 1000;

  var addtext = tempv;
	var seltext = htext + "+" + addtext;

	var targetURL = temp[itemindex][3].replace("DUMMYSTRING", seltext);
	targetURL = targetURL.replace("%s", seltext);

	chrome.tabs.getSelected(null, function(tab){
							index = tab.index + 1;
							chrome.tabs.create({"url":targetURL, "selected":true, "index":index});
							});
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
    	document.getElementById("searchsettings").addEventListener("click", searchOnClickP)
    }, 2000)
});


initalizeP();
