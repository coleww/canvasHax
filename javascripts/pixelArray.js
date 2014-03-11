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

    return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
  };

//?????????????????????????????///
///

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

  PixelArray.prototype.randomCoords = function(){
    var x = Math.floor(Math.random() * this.w);
    var y = Math.floor(Math.random() * this.h);
    return [x, y];
  };

  PixelArray.prototype.centerCoords = function(){
    return [this.w / 2, this.h / 2];
  };

//////////////////////////////////////erm pixels job to know? BUTTT make method to get color at x/y directly?
  // PixelArray.prototype.getColor = function(pixel, alpha){
  //   if(alpha !== undefined){
  //     pixel[3] = alpha;
  //   }//is this a horrible thing to do? maybe... maybe...
  //   return "rgba(" + pixel.join(",") + ")";
  // };
  ///////////////////////////////////////////

  PixelArray.prototype.getRow = function(y){
    var pixels = [];
    for(var i = 0; i < this.w; i++){
      var pixel = this.getPixel(i, y);
      pixels.push(pixel);
    }
    return pixels;
  };
  //THESE ARE AWFULLY SIMILAR. also don't know bout this alpha business...maybe return the pixels and have something else turn themt o rgba??
  PixelArray.prototype.getCol = function(x){
    var pixels = [];
    for(var i = 0; i < this.h; i++){
      var pixel = this.getPixel(x, i);
      pixels.push(pixel);
    }
    return pixels;
  };
})(this);
