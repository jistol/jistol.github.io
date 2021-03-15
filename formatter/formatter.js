'use strict';
(function() {
  const doConvert = function() {
    let newLine = document.getElementById('newLine');
    let source = document.getElementById('source');
    let destination = document.getElementById('destination');

    console.log(`src : ${source.value}, newLine : ${newLine.value}`);

    let src = source.value;
    src = replaceSource(src, newLine.value, '<br/>');
    destination.innerHTML = src;
  };

  const replaceSource = function(src, from, to) {
    return src.replaceAll(from, to);
  }

  let btnConvert = document.getElementById('btnConvert');
  btnConvert.addEventListener('click', doConvert)
})();
