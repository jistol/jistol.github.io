'use strict';
(function() {
  const doConvert = function() {
    let src = document.getElementById('source').value;
    let targets = document.getElementsByName("replaceTarget");
    for (let t of targets) {
      src = replaceSource(src, t.value, t.getAttribute('to'));
    }
    document.getElementById('destination').innerHTML = src;
  };

  const replaceSource = function(src, from, to) {
    return (from && from.length > 0) ? src.replaceAll(from, to) : src;
  }

  let btnConvert = document.getElementById('btnConvert');
  btnConvert.addEventListener('click', doConvert)
})();
