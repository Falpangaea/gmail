function setItem(key, value) {

	try {
		window.localStorage.removeItem(key);
		window.localStorage.setItem(key, value);
	} catch(e) {}
}

function getItem(key) {

	var value;

	try {
		value = window.localStorage.getItem(key);
	} catch(e) {
		value = "null";
	}
	return value;
}

function clearString () {
	window.localStorage.clear();
}

function sortArray (a, b) {

	return a[1] - b[1]
}

function sortList (a, b) {

	return a - b
}

function sortAndSave (astorage, array, lstorage, list) {

	array.sort(sortArray);
	list.sort(sortList);

	saveStorage(astorage, array);
	saveStorage(lstorage, list);

	sync(array, list);
}

function saveOptions() {

	chrome.extension.getBackgroundPage().update();
}

function loadStorage(name) {

	var stringified = localStorage.getItem(name);
	return JSON.parse(stringified);
}

function saveStorage(name, array) {

	var string = JSON.stringify(array);
	localStorage.setItem(name, string);
}

function sync(array, list) {

	var stringA = JSON.stringify(array);
	chrome.storage.sync.set({"lossearch": stringA}, function() {
    	//console.log("saveStorage: " + stringA + " saved in " + "lossearch" + ".");
    });

    console.log("lossearch saved in sync");

	var stringL = JSON.stringify(list);
	chrome.storage.sync.set({"loatstorage": stringL}, function() {
    	//console.log("saveStorage: " + stringL + " saved in " + "loatstorage" + ".");
  	});

	console.log("loatstorage saved in sync");
}

function syncSV(name, array) {

	var stringA = JSON.stringify(array);
	chrome.storage.sync.set({name: stringA}, function(){});
}

function hideShow (button, table, image) {

	if (button) {
		button.addEventListener("click", function () {

			if (table.style.display == "none") {
				table.style.display = "";
				image.src="images/tr.gif";
			} else {
				table.style.display = "none";
				image.src="images/td.gif";
			}

			console.log("added");
		});
	}
}

function populateNew(svs, numsvs) {

  var newlost = new Array(6);

  for (var i = 0; i <= numsvs; i++) {

    newlost[i] = new Array(6);
    newlost[i][0] = "-1";
    newlost[i][1] = i;
    newlost[i][2] = svs[i];
    newlost[i][3] = "";
    newlost[i][4] = false;
    newlost[i][5] = false;
  }

  chrome.storage.sync.set({"loststorage": newlost}, function() {});
  saveStorage("loststorage", newlost);
}

function populateSV(numsvs) {

  var lost = loadStorage("loststorage");

  for (var i = 0; i <= numsvs; i++) {

    var oldid = lost[i][2];
    var tempv = lost[i][3];
    var tempa = lost[i][4];
    var tempd = lost[i][5];

    document.getElementById("input"+oldid).value=tempv;

    if (tempa) {
      document.getElementById("always"+oldid).checked = true;
    }
    if (tempd) {
      document.getElementById("dont"+oldid).checked = true;
    }
  }
}
