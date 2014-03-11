(function(root){

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
    if(alpha !== undefined){
      alpha = alphaVal;
    }

    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  };

//?????????????????????????????///

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
    return this._pixels.slice(pixelPosition, pixelPosition + 4);
  };

  PixelArray.prototype.randomPixel = function(){
    var coords = this.randomCoords();
    return this.getPixel(coords[0], coords[1]);
  };

  PixelArray.prototype.randomCoords = function(){
    var x = Math.floor(Math.random() * this.w);
    var y = Math.floor(Math.random() * this.h);
    return [x, y];
  };

  PixelArray.prototype.getColor = function(pixel, alpha){
    if(alpha !== undefined){
      pixel[3] = alpha;
    }//is this a horrible thing to do? maybe... maybe...
    return "rgba(" + pixel.join(",") + ")";
  };

  PixelArray.prototype.getRow = function(y, alpha){
    var colors = [];
    // var pixels = [];
    for(var i = 0; i < this.w; i++){
      var pixel = this.getPixel(i, y);
      var color = this.getColor(pixel, alpha);
      colors.push(color);
      // pixels.push(pixel);
    }
    return colors;
    // return pixels;

  };
  //THESE ARE AWFULLY SIMILAR. also don't know bout this alpha business...maybe return the pixels and have something else turn themt o rgba??
  PixelArray.prototype.getCol = function(x, alpha){
    var colors = [];
    // var pixels = [];
    for(var i = 0; i < this.h; i++){
      var pixel = this.getPixel(x, i);
      var color = this.getColor(pixel, alpha);
      colors.push(color);
      // pixels.push(pixel);
    }
    return colors;
    // return pixels;
  };

  PixelArray.prototype.centerCoords = function(){
    return [this.w / 2, this.h / 2];
  };
})(this);
