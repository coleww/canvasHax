//takes in a canvas context, width, and height.
//a "pixel" is a 4 element array. 0 => R, 1 => G, 2 => B, 3 => A
var PixelArray = function(ctx, w, h){
  this._pixels = ctx.getImageData(0, 0, w, h).data;
  this.w = w;
  this.h = h;
  this.numPixels = pixelData.length / 4;
};

PixelArray.prototype.getPixel = function(x, y){
  // if(x >= this.w || y >= this.h OR LESS THAN 0){throw "WAT";}

  var pixelPosition = (y * this.w + x) * 4;
  return this._pixels.slice(pixelPosition, pixelPosition + 5);
};

PixelArray.prototype.getColor = function(pixel){
  return "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
};

PixelArray.prototype._ = function(pixel){

};
PixelArray.prototype._ = function(pixel){

};


shapeMode.prototype.playLoop = function(pixelData, pixelCount) {
    var currentPixelPosition = this.randomPixelPosition(pixelCount);
    var currentColor = this.getFill(pixelData, currentPixelPosition);
    this.ctx.fillStyle = currentColor;
    this.ctx.strokeStyle = currentColor;
    var coords = this.getStartPosition(currentPixelPosition);
    var x = coords[0];
    var y = coords[1];
    this.draw(x, y);
  };

  shapeMode.prototype.getStartPosition = function(currentPixelPosition){
    var x = this.w;
    var y = this.h;
    switch(this.settings.elementStart) {
    case "center":
      x /= 2;
      y /= 2;
      break;
    case "random":
      x *= Math.random();
      y *= Math.random();
      break;
    case "origin":
      var actualPixel = currentPixelPosition / 4;
      x = actualPixel % this.w;
      y = actualPixel / this.h;
      break;
    }
    return [x, y];
  };

  shapeMode.prototype.randomPixelPosition = function(pixelCount) {
    return Math.floor(Math.random() * pixelCount) * 4;
  };

  slitMode.prototype.getFill = function(pixelData, currentPixelPosition) {
    var r = pixelData[currentPixelPosition];
    var g = pixelData[currentPixelPosition + 1];
    var b = pixelData[currentPixelPosition + 2];
    return "rgba(" + r + "," + g + "," + b + "," + this.settings.alpha + ")";
  };

 slitMode.prototype.randomRowStart = function(pixelCount) {
    //presuming a square canvas
    //ABSTRACT THIS FOOL!
    var rowCount = Math.sqrt(pixelCount);
    var startPixel = rowCount * Math.floor(Math.random() * rowCount) * 4;
    return startPixel;
  };

  slitMode.prototype.getRowColors = function(pixelData, startPosition) {
    var colors = [];
    //2000 magic number, this.h * 4 instead?
    for(var i = 0; i < 2000; i+= 4){
      colors.push(this.getFill(pixelData, startPosition + i));
    }
    return colors;
  };

  slitMode.prototype.randomColStart = function(pixelCount) {
    var colCount = Math.sqrt(pixelCount);
    var startPixel = Math.floor(Math.random() * colCount) * 4;
    return startPixel;
  };

  slitMode.prototype.getColColors = function(pixelData, startPosition) {
    var colors = [];
    //start position is btwn 0 and 500 (*4)
    for(var i = 0; i < pixelData.length; i+= 2000){
      colors.push(this.getFill(pixelData, startPosition + i));
    }
    return colors;
  };
