var numentries;
var temp;
var popup_menu = [2, 4, 7, 67, 68, 70];
var popup_options;
var idp;


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
    			migrate(los, numentries);	
    			
  			});
		}
	});
}

function initializeValues() {

	var pop_val = new Array(6);
	var num_pop = popup_menu.length;
	
	for (var i = 0; i < num_pop; i++) {
		pop_val[i] = new Array(5);
		pop_val[i][1] = popup_menu[i];
		pop_val[i][2] = "";
		pop_val[i][3] = false;
		pop_val[i][4] = false;
	} 

	saveStorage("pop_val", pop_val);
	syncOne("pop_val", pop_val);
}

function startUp () {

	initializeValues();

	started = true;
	
	var los = new Array(5);
		
	los[0] = new Array(8);
	los[0][1] = 1;
	los[0][2] = "SalesForce";
	los[0][3] = "https://na13.salesforce.com/_ui/search/ui/UnifiedSearchResults?searchType=2&str=DUMMYSTRING";
	los[0][4] = false;	
	los[0][5] = "";	
	los[0][6] = false;	
	los[0][7] = false;	

	los[1] = new Array(8);
	los[1][1] = 3;
	los[1][2] = "MyStats";
	los[1][3] = "https://mystats.zeroturnaround.com/a/?pid=search&q=DUMMYSTRING";
	los[1][4] = false;	
	los[1][5] = "";	
	los[1][6] = false;	
	los[1][7] = false;		

	los[2] = new Array(8);
	los[2][1] = 4;
	los[2][2] = "LinkedIn";
	los[2][3] = "http://www.linkedin.com/search/fpsearch?type=people&keywords=DUMMYSTRING";
	los[2][4] = true;	
	los[2][5] = "";	
	los[2][6] = false;	
	los[2][7] = false;		

	los[3] = new Array(8);
	los[3][1] = 7;
	los[3][2] = "The Google";
	los[3][3] = "https://www.google.com/#sclient=psy-ab&q=DUMMYSTRING";
	los[3][4] = true;	
	los[3][5] = "";	
	los[3][6] = false;	
	los[3][7] = false;			

	los[4] = new Array(8);
	los[4][1] = 10;
	los[4][2] = "Google Images";
	los[4][3] = "https://www.google.com/search?hl=en&site=imghp&tbm=isch&source=hp&biw=1317&bih=710&q=DUMMYSTRING";
	los[4][4] = false;	
	los[4][5] = "";	
	los[4][6] = false;	
	los[4][7] = false;		

	numentries = 5;
	
	var newloat = [1,3,4,7,10];
		
	chrome.storage.sync.set({"notloaded": true}, function() {
		console.log("saveStorage: " + "true" + " saved in " + "notloaded" + ".");
	});
	
	chrome.storage.sync.set({"started": true}, function() {
    	console.log("saveStorage: " + "true" + " saved in " + "started" + ".");
  	});

  	chrome.storage.sync.set({"migrated": true}, function() {
    	console.log("saveStorage: " + "true" + " saved in " + "migrated" + ".");
  	});
	
	sortAndSave("lossearch", los, "loatstorage", newloat);
	createMenus(los, numentries);
}

function migrate (array, num) {

	initializeValues();

	var tempj;
	var los = array;

	for(var i = 0; i < num; i++) {
		los[i][0] = new Array(8);
		los[i][1] = array[i][1];
		los[i][2] = array[i][2];
		los[i][3] = array[i][3];
		los[i][4] = false;
		los[i][5] = "";
		los[i][6] = false;
		los[i][7] = false;

		for (var j = 0; j < popup_menu.length; j++) {
			tempj = los[i][1];
			if (tempj == popup_menu[j]) {	
				los[i][4] = true;
			}
		}
	}

	chrome.storage.sync.set({"migrated": true}, function() {
    	console.log("saveStorage: " + "true" + " saved in " + "migrated" + ".");
  	});

  	sortAndSaveOne("lossearch", los);
  	createMenus(los, num);
}

function createMenus (array, num) {
	chrome.contextMenus.removeAll();
	temp = array;

	for(var i = 0; i < num; i++) {
		if (temp[i][4] && temp[i][7]) {
			array[i][0] = chrome.contextMenus.create({"title": array[i][2], "contexts":["selection"], "onclick": searchOnClickOptions});
		} else if (temp[i][4]) {
			array[i][0] = chrome.contextMenus.create({"title": array[i][2], "contexts":["selection"], "onclick": searchOnClickPopup});
		} else {
			array[i][0] = chrome.contextMenus.create({"title": array[i][2], "contexts":["selection"], "onclick": searchOnClick});
		}
	}

	chrome.contextMenus.create({"type": "separator", "contexts":["selection"]});
	chrome.contextMenus.create({"title": "Options", "contexts":["selection"], "onclick": goToOptions});
	chrome.contextMenus.create({"title": "Settings", "contexts":["selection"], "onclick": goToSettings});
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

function searchOnClickPopup(info, tab) {

	var itemindex = 0;
	var id;
	var url;
	var text;
	var always;
	numentries = temp.length;
	
	for(var i = 0; i < numentries; i++) {
		if(info.menuItemId == temp[i][0]) {
			itemindex = i;
			id = temp[i][1];
			url = temp[i][3];
			text = temp[i][5];
			always = temp[i][6];
		}
	}

	var index = 1000;

	var seltext = info.selectionText;

	window['popup_options_'+id] = [index, itemindex, id, url, seltext, text, always, info, tab];
	saveStorage('popup_options_'+id, window['popup_options_'+id]);
	syncOne('popup_options_'+id, window['popup_options_'+id]);

	chrome.tabs.getSelected(null, function(tab){
		idp = id;
		saveStorage("idp", idp);

		index = tab.index + 1;
		
		chrome.tabs.create({"url":"./popup.html", "selected":true, "index":index});
	});

	// chrome.windows.getCurrent(function(w) {
	// 	idp = id;
	// 	saveStorage("idp", idp);

 //  		var screenWidth = Math.floor((w.width - 400)/2);
 //  		var screenHeight =  Math.floor((w.height - 450)/2);

 //  		chrome.windows.create({"url":"./popup.html", "type":"popup", "width":400, "height":450, "left":screenWidth, "top":screenHeight});
	// });
}

function searchOnClickOptions(info, tab) {

	var itemindex = 0;
	var id;
	var url;
	var text;
	numentries = temp.length;
	
	for(var i = 0; i < numentries; i++) {
		if(info.menuItemId == temp[i][0]) {
			itemindex = i;
			id = temp[i][1];
			url = temp[i][3];
			text = temp[i][5];
		}
	}

	var index = 1000;

	var seltext = info.selectionText + "+" + text;
	
	var targetURL = url.replace("DUMMYSTRING", seltext);
	targetURL = targetURL.replace("%s", seltext);
	
	chrome.tabs.getSelected(null, function(tab){
							index = tab.index + 1;
							chrome.tabs.create({"url":targetURL, "selected":true, "index":index});
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