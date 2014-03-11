(function(){
  "use strict";
  Array.prototype.sample = function(){
    return this[Math.floor(Math.random() * this.length)];
  };

  if (typeof Uint8ClampedArray !== 'undefined') {
    Uint8ClampedArray.prototype.slice = Array.prototype.slice; //Firefox and Chrome
  } else if(typeof CanvasPixelArray!== 'undefined') {
    CanvasPixelArray.prototype.slice = Array.prototype.slice; //IE10 and IE9
  } else {
    // Deprecated browser
  }
})();
