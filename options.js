var numoptions = 70;

function initialize() {

	chrome.storage.sync.get("notloaded", function(val) {
    	//console.log("loadStorage: " + val.notloaded + " received from " + "notloaded" + ".");
		var notLoaded = JSON.parse(val.notloaded);
		//console.log(notLoaded);

		if (notLoaded) {

			var bool = JSON.stringify(false);

			chrome.storage.sync.set({"notloaded": bool}, function() {
    			//console.log("saveStorage: " + bool + " saved in " + "notloaded" + ".");
    	});
    	saveStorage("notloaded", false);

			var newloat = [1,3,70,7,10];
    	var loat = JSON.stringify(newloat);

  		chrome.storage.sync.set({"loatstorage": loat}, function() {
  			//console.log("saveStorage: " + loat + " saved in " + "loatstorage" + ".");
			});
			saveStorage("loatstorage", newloat);

			populate();

		} else {

			chrome.storage.sync.get("lossearch", function(val) {
	    		//console.log("loadStorage: " + val.lossearch + " received from " + "lossearch" + ".");
				var los = JSON.parse(val.lossearch);

				updateLocal(los);

				populate();
			});
		}
	});
}

function populate() {

	var loat = loadStorage("loatstorage");

	for (var i = 1; i <= numoptions; i++) {

		var alreadyThere = isAlreadyThere(i, loat);

		if (alreadyThere) { document.getElementById("l"+i).checked = true; }
	}
}

function updateLocal (array) {

	var newlos = new Array(array.length);
	var newloat = new Array(array.length);

	for(var i = 0; i < array.length; i++) {

		newlos[i] = new Array(4);
		newlos[i] = array[i].slice(0);

		newloat[i] = newlos[i][1];
	}

	sortAndSave("lossearch", newlos, "loatstorage", newloat);
}

function isAlreadyThere(index, array) {

	return array.indexOf(index) == -1? false : true;
}

function add(index) {

	var x = index;
	var loat = loadStorage("loatstorage");
	loat.push(x);

	var parsedArray = loadStorage("lossearch");
	var newoptions = new Array(parsedArray.length+1);

	for(var i = 0; i < parsedArray.length; i++) {

		newoptions[i] = new Array(4);
		newoptions[i] = parsedArray[i].slice(0);
	}

	var nname = document.getElementById("name"+x).value;
	var nlink = document.getElementById("link"+x).value;

	newoptions[i] = new Array(4);
	newoptions[i][0] = "-1";
	newoptions[i][1] = x;
	newoptions[i][2] = nname;
	newoptions[i][3] = nlink;

	sortAndSave("lossearch", newoptions, "loatstorage", loat);
}

function remove(index) {

	document.getElementById("l"+index).checked = false;

	var loat = loadStorage("loatstorage");
	var x = loat.indexOf(index);
	loat.splice(x, 1);

	var parsedArray = loadStorage("lossearch")
	parsedArray.splice(x, 1)

	var newoptions = new Array(loat.length);

	for(var i = 0; i < parsedArray.length; i++) {

		newoptions[i] = new Array(4);
		newoptions[i] = parsedArray[i].slice(0);
	}

	sortAndSave("lossearch", newoptions, "loatstorage", loat);
}

function removeWindow () {

	chrome.tabs.getSelected(null, function(tab) {
    	chrome.tabs.update(tab.id, { selected: true } )
	});
}

function addFromList() {

	var loat = loadStorage("loatstorage");

	for (var i = 1; i <= numoptions; i++) {

		var alreadyThere = isAlreadyThere(i, loat);

		if (document.getElementById("l"+i).checked && !alreadyThere) { add(i); }

		if (!document.getElementById("l"+i).checked && alreadyThere) { remove(i); }

		saveOptions();
	}

	var status = document.getElementById("status_addfromlist");
	status.innerHTML = "Options Saved.";

	setTimeout(function() {status.innerHTML = ""; window.close()},1250);
}

function onLoad() {

	var button;
	var table;

	for (var i = 1; i <=  15; i++) {

		button = document.getElementById("header"+i);
		table = document.getElementById("table"+i);
		image = document.getElementById("t"+i);

		hideShow(button, table, image);
	}
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
    	document.getElementById("save").addEventListener("click", addFromList)
    }, 2000)
});


initialize();
onLoad();
