'use strict';
(function() {
  const convertSource = function() {
    let src = document.getElementById('source').value;

    src = src.replaceAll('<', '&lt;');
    src = src.replaceAll('>', '&gt;');
    src = replaceSource(src);
    src = highlightSource(src);
    return src;
  }

  const doConvert = function() {
    document.getElementById('destination').innerHTML = convertSource();
  };

  const toJson = function() {
    $('#destination').html('');
    $('#destination').jsonView(convertSource());
  }

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
    let useHighlight = document.getElementById('highlight');
    if (useHighlight.checked) {
      let regex = new RegExp(document.getElementById('highlightRegex').value, 'g');
      let color = document.getElementById('highlightColor').value;
      src = src.replace(regex, `<font color="${color}">\$&</font>`);
    }

    return src;
  };

  let btnConvert = document.getElementById('btnConvert');
  btnConvert.addEventListener('click', doConvert)

  let btnToJson = document.getElementById('btnToJson');
  btnToJson.addEventListener('click', toJson)
})();
