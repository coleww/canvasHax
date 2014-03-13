(function(root){
  "use strict";

  var PixelArray = root.PixelArray = function(ctx, w, h){
    this._pixels = ctx.getImageData(0, 0, w, h).data;
    this.w = w;
    this.h = h;
    this.numPixels = this._pixels.length / 4;
  };

  PixelArray.prototype.getPixel = function(x, y){
    if(x > this.w || y > this.h || x < 0 || y < 0) {
      throw "OUTTA BOUNDS!";
    }
    var pixelPosition = (y * this.w + x) * 4;
    var pixelData = this._pixels.slice(pixelPosition, pixelPosition + 4);
    return new Pixel(pixelData, x, y);
  };

  PixelArray.prototype.randomPixel = function(){
    var coords = this.randomCoords();
    return this.getPixel(coords[0], coords[1]);
  };

  PixelArray.prototype.centerPixel = function(){
    var coords = this.centerCoords();
    return this.getPixel(coords[0], coords[1]);
  };

  PixelArray.prototype.randomCoords = function(){
    var x = Math.floor(Math.random() * this.w);
    var y = Math.floor(Math.random() * this.h);
    return [x, y];
  };

  PixelArray.prototype.centerCoords = function(){
    return [this.w / 2, this.h / 2];
  };

  PixelArray.prototype.getRow = function(y){
    var pixels = [];
    for(var i = 0; i < this.w; i++){
      var pixel = this.getPixel(i, y);
      pixels.push(pixel);
    }
    return pixels;
  };

  PixelArray.prototype.getCol = function(x){
    var pixels = [];
    for(var i = 0; i < this.h; i++){
      var pixel = this.getPixel(x, i);
      pixels.push(pixel);
    }
    return pixels;
  };

//is this any better?
  PixelArray.prototype.getA = function(type, coord){
    var pixels = [];
    var limit = (type === "row") ? this.w : this.h;
    for(var i = 0; i < limit; i++){
      var pixel = (type === "row") ? this.getPixel(i, coord) : this.getPixel(coord, i);
      pixels.push(pixel);
    }
    return pixels;
  };
})(this);
