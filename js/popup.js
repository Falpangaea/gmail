var ptemp;
var pi;
var pii;
var pid;
var purl;
var psel;
var pt;
var pa;
var pd = false;
var pinfo;
var ptab;

var los;
var numentries;


function initializeP() {

	var idt = localStorage.getItem("idp");
	ptemp = loadStorage('popup_options_'+idt);

	console.log(idp);
	console.log(idt);
	console.log(ptemp);

	pi = ptemp[0];		// index
	pii = ptemp[1];		// itemindex in menu
	pid = ptemp[2];		// ID of option
	purl = ptemp[3];	// search URL
	psel = ptemp[4];	// selected text
	pt = ptemp[5];		// added text
	pa = ptemp[6];		// always?
	pinfo = ptemp[7];	// info
	ptab = ptemp[8];	// tab

	document.getElementById("searchterm").value = pt;
  document.getElementById("always").checked = pa;
  document.getElementById("dont").checked = false;

  chrome.storage.sync.get("lossearch", function(loss) {
  	console.log("loadStorage: " + loss.lossearch + " received from " + "lossearch" + ".");
  			
  	console.log(JSON.parse(loss.lossearch));
  	los = JSON.parse(loss.lossearch);
  			
  	numentries = los.length;
	});
}

function searchOnClickP() {
  console.log("searchonclickp");

	pt = document.getElementById("searchterm").value;
	pa = document.getElementById("always").checked;
  pd = document.getElementById("dont").checked;

  console.log("pt: " + pt + " pa: " + pa + " pd: " + pd + " pii: " + pii);

	los[pii][4] = pt;
	los[pii][5] = pa;
	los[pii][6] = pd; 

	saveStorage("lossearch", los);
	syncOne("lossearch", los);

	var ftext = psel + "+" + pt;

	var targetURL = purl.replace("DUMMYSTRING", ftext);
	targetURL = targetURL.replace("%s", ftext);

	chrome.tabs.getSelected(null, function(tab){
  	pi = tab.index + 1;
  	chrome.tabs.create({"url":targetURL, "selected":true, "index":pi});
	});
}

document.getElementById("searchp").addEventListener("click", searchOnClickP);


// document.addEventListener("DOMContentLoaded", function () {
//     setTimeout(function () {
//     	document.getElementById("searchp").addEventListener("click", searchOnClickP)
//     }, 2000)
// });


initializeP();