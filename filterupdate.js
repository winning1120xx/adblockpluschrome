// If you change this, also change this in background.html
var filterFiles = {
    "easylist": "http://easylist.adblockplus.org/easylist.txt", // "easylist.txt",
	"extras": "extras.txt",
    "germany": "https://easylist-downloads.adblockplus.org/easylistgermany.txt", // "easylistgermany.txt",
    "russia": "http://adblockplus.mihalkin.ru/Russia.txt", // "Russia.txt",
    "china": "http://adblock-chinalist.googlecode.com/svn/trunk/adblock.txt", // "adblock.txt",
	"france": "https://easylist-downloads.adblockplus.org/liste_fr+easylist.txt", // "liste_fr.txt",
	"korea": "http://brianyi.com/corset.txt", // "corset.txt",
	"romania": "http://www.picpoc.ro/menetzrolist.txt", // "menetzrolist.txt",
	"italy": "http://mozilla.gfsolone.com/filtri.txt", // "filtri.txt",
	"vietnam": "http://adblockplus-vietnam.googlecode.com/svn/trunk/abpvn.txt",
	"poland": "http://www.bsi.info.pl/filtrABP.txt",
	"fanboy": "http://www.fanboy.co.nz/adblock/fanboy-adblocklist-current-expanded.txt",
	"fanboy_es": "http://www.fanboy.co.nz/adblock/fanboy-adblocklist-esp.txt"
};

function FilterListFetcher(nameOrUrl, callback) {
    // TODO: Check if we've fetched this list recently. If so, return cached copy instead
    this.name = nameOrUrl;
    // Accept name as URL if it starts with http
    this.url = nameOrUrl.match(/^http/) ? nameOrUrl : filterFiles[nameOrUrl];
    this.callback = callback;
    this.xhr = new XMLHttpRequest();
    this.error = false;
    var fetcher = this;
    this.xhr.onreadystatechange = function() {
        if(this.readyState != 4) return;
        if(this.status == 200) {
            // Check if it's actually a filter set
            if(this.responseText.match(/^\[Adblock/)) {
                localStorage[fetcher.url] = JSON.stringify({lastUpdated: (new Date()).getTime(), text: this.responseText});
                fetcher.callback(fetcher);
                return;
            } else {
                fetcher.error = "Not a filter list";
                fetcher.callback(fetcher);
                return;
            }
        } else if(this.status == 404) {
            fetcher.error = "Not found on server";
            localStorage[fetcher.url] = JSON.stringify({lastUpdated: (new Date()).getTime(), error: fetcher.error});
            fetcher.callback(fetcher);
            return;
        }
    }
    this.xhr.open("GET", this.url, true);
    this.xhr.send(null);
}