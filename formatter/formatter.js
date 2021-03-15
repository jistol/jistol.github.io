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
    return src.replaceAll(from, to);
  }

  let btnConvert = document.getElementById('btnConvert');
  btnConvert.addEventListener('click', doConvert)
})();
