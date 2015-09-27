/* jshint esnext: true */

class FN {

    static guaranteeFunction(fn) {
        if(typeof fn !== 'function') { fn = function() { /* do nothing */ }; }
        return fn;
    }

    static loadNode(node, asyncReturn) {
        var yieldReturn = FN.guaranteeFunction(asyncReturn);
        if(!node) { yieldReturn(); return; }
        node.onerror = function() {
            yieldReturn();
        };
        node.onload = function() {
            yieldReturn();
        };
        document.getElementsByTagName('head')[0].appendChild(node);
        // :NOTE: casperJS doesn't trigger the onload event for link elements 
        // and for css files, there is no requirement to wait till the file is fully loaded. 
    }

    static injectLink(url, asyncReturn) {
        var yieldReturn = FN.guaranteeFunction(asyncReturn);
        if(typeof url !== 'string') { return yieldReturn(); }
        // Check that the css file doesn't exist yet before attempting to load it
        var node;
        if (document.querySelectorAll('head link[href="' + url + '"]').length === 0) {
            node      = document.createElement('link');
            node.rel  = 'stylesheet';
            node.type = 'text/css';
            node.href = url;
        } 
        FN.loadNode(node, asyncReturn);
    }    


}

export default class Inject {

    static font(list, asyncReturn) {
        FN.injectLink(url, asyncReturn);
    }

    static css(url, asyncReturn) {
        if(typeof url === 'object') {
            url = url.parent.filename + '/' + url.file;
        }
        FN.injectLink(url, asyncReturn);
    }

    static appendStyle(css) {
        var head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet){
        style.styleSheet.cssText = css;
        } else {
        style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }
}

