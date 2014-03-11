(function(root){
  "use strict";
  //could get passed ref to original pixelArray so that it knows it's neighbors?
  var Pixel = root.Pixel = function(rgba, xpos, ypos){
    this.rgba = rgba;
    this.xpos = xpos;
    this.ypos = ypos;
  };

  Pixel.prototype.getColor = function(alphaVal){
    var red = this.rgba[0];
    var green = this.rgba[1];
    var blue = this.rgba[2];
    var alpha = this.rgba[3];
    if(alphaVal !== undefined){
      alpha = alphaVal;
    }

    return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
  };
})(this);
