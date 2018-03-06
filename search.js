var numentries;
var temp;
var defaultp = 0; // 0 is popup, 1 is no popup, 2 is popup with certain options checked
var popup_menu = [2, 4, 7, 67, 68, 70];
var popnum = 6;
var currid;
var htext;


function update() {

	chrome.storage.sync.get("started", function(val) {
    console.log("loadStorage: " + val.started + " received from " + "started" + ".");
		console.log(val.started);

		if(!val.started) {

			startUp();

		} else {

			chrome.storage.sync.get("lossearch", function(loss) {
    			console.log("loadStorage: " + loss.lossearch + " received from " + "lossearch" + ".");

    			console.log(JSON.parse(loss.lossearch));
    			var los = JSON.parse(loss.lossearch);

    			numentries = los.length;

    			createMenus(los, numentries);

  		});
			populateSV(popnum)
		}
	});
}

function startUp () {

	console.log("update started if");

	started = true;

	var los = new Array(5);

	los[0] = new Array(4);
	los[0][1] = 1;
	los[0][2] = "SalesForce";
	los[0][3] = "https://na13.salesforce.com/_ui/search/ui/UnifiedSearchResults?searchType=2&str=DUMMYSTRING";

	los[1] = new Array(4);
	los[1][1] = 3;
	los[1][2] = "MyStats";
	los[1][3] = "https://mystats.zeroturnaround.com/a/?pid=search&q=DUMMYSTRING";

	los[2] = new Array(4);
	los[2][1] = 70;
	los[2][2] = "LinkedIn-New";
	los[2][3] = "https://www.linkedin.com/search/results/index/?keywords=DUMMYSTRING";

	los[3] = new Array(4);
	los[3][1] = 7;
	los[3][2] = "The Google";
	los[3][3] = "https://www.google.com/#sclient=psy-ab&q=DUMMYSTRING";

	los[4] = new Array(4);
	los[4][1] = 10;
	los[4][2] = "Google Images";
	los[4][3] = "https://www.google.com/search?hl=en&site=imghp&tbm=isch&source=hp&biw=1317&bih=710&q=DUMMYSTRING";

	numentries = 5;

	var newloat = [1,3,70,7,10];

	chrome.storage.sync.set({"notloaded": true}, function() {
		console.log("saveStorage: " + "true" + " saved in " + "notloaded" + ".");
	});

	chrome.storage.sync.set({"started": true}, function() {
    	console.log("saveStorage: " + "true" + " saved in " + "started" + ".");
  	});

	chrome.storage.sync.set({"default": true}, function() {
			console.log("saveStorage: " + "true" + " saved in " + "default" + ".");
		});

  populateNew(popup_menu, popnum);
	sortAndSave("lossearch", los, "loatstorage", newloat);
	createMenus(los, numentries);
}

function createMenus (array, num) {
	chrome.contextMenus.removeAll();
	temp = array;

	for(var i = 0; i < num; i++) {
		array[i][0] = chrome.contextMenus.create({"title": array[i][2], "contexts":["selection"], "onclick": searchSeperate});
	}

	chrome.contextMenus.create({"type": "separator", "contexts":["selection"]});
	chrome.contextMenus.create({"title": "Options", "contexts":["selection"], "onclick": goToOptions});
	chrome.contextMenus.create({"title": "Settings", "contexts":["selection"], "onclick": goToSettings});

}

function searchSeperate(info, tab) {

	numentries = temp.length;
	var lost = loadStorage("loststorage");
	htext = info.selectionText;

	for(var i = 0; i < numentries; i++) {
		for(var j = 0; j < popnum; j++) {
			if (temp[i][1] != popup_menu[j]) {
				searchOnClick(info, tab);
			} else if (lost[j][5]) {
				searchOnClickOptions(info, tab, lost[j][1], lost);
			} else {
				searchOnClickPopup(info, tab, lost[j][1], lost);
			}
		}
	}
}

function searchOnClick(info, tab) {

	var itemindex = 0;
	numentries = temp.length;

	for(var i = 0; i < numentries; i++) {
		if(info.menuItemId == temp[i][0]) {
			itemindex = i;
		}
	}

	var index = 1000;

	var targetURL = temp[itemindex][3].replace("DUMMYSTRING", info.selectionText);
	targetURL = targetURL.replace("%s", info.selectionText);

	chrome.tabs.getSelected(null, function(tab){
							index = tab.index + 1;
							chrome.tabs.create({"url":targetURL, "selected":true, "index":index});
							});
}

function searchOnClickOptions(info, tab, id, array) {

	var itemindex = 0;
	numentries = temp.length;

	for(var i = 0; i < numentries; i++) {
		if(info.menuItemId == temp[i][0]) {
			itemindex = i;
		}
	}

	var index = 1000;

	var addtext = array[id][3];
	var seltext = info.selectionText + "+" + addtext;

	var targetURL = temp[itemindex][3].replace("DUMMYSTRING", seltext);
	targetURL = targetURL.replace("%s", seltext);

	chrome.tabs.getSelected(null, function(tab){
							index = tab.index + 1;
							chrome.tabs.create({"url":targetURL, "selected":true, "index":index});
							});
}

function searchOnClickPopup(info, tab, id, array) {

	currid = id;
	saveStorage("currid", currid);

	chrome.windows.getCurrent(function(w) {
  		var screenWidth = Math.floor((w.width - 400)/2);
  		var screenHeight =  Math.floor((w.height - 450)/2);

  		chrome.windows.create({"url":"./popup.html", "type":"popup", "width":400, "height":450, "left":screenWidth, "top":screenHeight});
	});
}

function goToOptions (info, tab) {

	chrome.windows.getCurrent(function(w) {
  		var screenWidth = Math.floor((w.width - 400)/2);
  		var screenHeight =  Math.floor((w.height - 450)/2);

  		chrome.windows.create({"url":"./options.html", "type":"popup", "width":400, "height":450, "left":screenWidth, "top":screenHeight});
	});
}

function goToSettings (info, tab) {

	chrome.windows.getCurrent(function(w) {
  		var screenWidth = Math.floor((w.width - 250)/2);
  		var screenHeight =  Math.floor((w.height - 450)/2);

  		chrome.windows.create({"url":"./search_options.html", "type":"popup", "width":250, "height":450, "left":screenWidth, "top":screenHeight});
	});
}

update();
