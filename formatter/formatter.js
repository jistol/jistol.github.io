'use strict';
(function() {
  const doConvert = function() {
    let src = document.getElementById('source').value;

    src = src.replaceAll('<', '&lt;');
    src = src.replaceAll('>', '&gt;');
    src = replaceSource(src);
    src = highlightSource(src);

    document.getElementById('destination').innerHTML = src;
  };

  const replaceSource = function(src) {
    let targets = document.getElementsByName("replaceTarget");
    for (let t of targets) {
      let from = t.value;
      let to = t.getAttribute('to');
      src = (from && from.length > 0) ? src.replaceAll(from, to) : src;
    }
    return src;
  };

  const highlightSource = function(src) {
    let useHighlight = document.getElementById('highlight').value;
    if (useHighlight) {
      let regex = new RegExp(document.getElementById('highlightRegex').value);
      let color = document.getElementById('highlightColor');
      src = src.replace(regex, `<font color="${color}">\$&</font>`);
    }

    return src;
  };

  let btnConvert = document.getElementById('btnConvert');
  btnConvert.addEventListener('click', doConvert)
})();
