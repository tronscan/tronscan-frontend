export function parallelLoadScripts(scripts, callback) {
    /* eslint-disable */
    if (typeof scripts != "object") var scripts = [scripts];
    var HEAD =
        document.getElementsByTagName("head").item(0) || document.documentElement,
        s = new Array(),
        loaded = 0;
    for (var i = 0; i < scripts.length; i++) {
        s[i] = document.createElement("script");
        s[i].setAttribute("type", "text/javascript");
        s[i].onload = s[i].onreadystatechange = function() {
            //Attach handlers for all browsers
            if (! /*@cc_on!@*/ 0 ||
                this.readyState == "loaded" ||
                this.readyState == "complete"
            ) {
                loaded++;
                this.onload = this.onreadystatechange = null;
                this.parentNode.removeChild(this);
                if (loaded == scripts.length && typeof callback == "function")
                    callback();
            }
        };
        s[i].setAttribute("src", scripts[i]);
        HEAD.appendChild(s[i]);
    }
}