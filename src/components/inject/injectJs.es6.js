/* jshint esnext: true */

export default function injectJs(list, asyncReturn) {
  let head = document.head || document.getElementsByTagName('head')[0];
  function next() {
    if(!list || !list.length) { 
      if(typeof asyncReturn === 'function') { asyncReturn(); }
      return;
    } 
    let js = list.shift();
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = js;
        script.addEventListener('load', next);
        head.appendChild(script);
  }
  next();
}