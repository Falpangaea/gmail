var temp;
var numentries;
var pid;
var pt;
var pa;
var pd;

var los;
var pop_val = loadStorage("pop_val");

function initializeSV() {
	chrome.storage.sync.get("lossearch", function(loss) {
		console.log("loadStorage: " + loss.lossearch + " received from " + "lossearch" + ".");
		
		console.log(JSON.parse(loss.lossearch));

		los = JSON.parse(loss.lossearch);

		numentries = los.length;
		num_pop = pop_val.length;

		for (var i = 0; i < num_pop; i++) {
				pid = pop_val[i][1];
				pt = pop_val[i][2];
				pa = pop_val[i][3];
				pd = pop_val[i][4];

				document.getElementById("input"+pid) = pt;
				document.getElementById("always"+pid).checked = pa;
				document.getElementById("dont"+pid).checked = pd;
		}
		for (var i = 0; i < numentries; i++) {
			if (los[i][4]) {

				pid = los[i][1];
				pt = los[i][5];
				pa = los[i][6];
				pd = los[i][7];

				document.getElementById("input"+pid) = pt;
				document.getElementById("always"+pid).checked = pa;
				document.getElementById("dont"+pid).checked = pd;
			}
		}
	});
}

function saveSettingsValues() {
	for (var i = 0; i < num_pop; i++) {
		pid = pop_val[i][1];
		pt = document.getElementById("input"+pid);
		pa = document.getElementById("always"+pid).checked;
		pd = document.getElementById("dont"+pid).checked;

		pop_val[i][2] = pt;
		pop_val[i][3] = pa;
		pop_val[i][4] = pd;
	}
	for (var i = 0; i < numentries; i++) {
		if (los[i][4]) {

			pid = los[i][1];
			pt = document.getElementById("input"+pid);
			pa = document.getElementById("always"+pid).checked;
			pd = document.getElementById("dont"+pid).checked;

			los[i][5] = pt;
			los[i][6] = pa;
			los[i][7] = pd;
		}
	}

	saveStorage("pop_val", pop_val);
	syncOne("pop_val", pop_val);
	
	saveStorage("lossearch", los);
	syncOne("lossearch", los);
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
    	document.getElementById("searchsettings").addEventListener("click", saveSettingsValues)
    }, 2000)
});