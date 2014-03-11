(function(root){
  "use strict";
  var imagePlayer = root.imagePlayer = (root.imagePlayer || {});

  var slitMode = imagePlayer.slitMode = function(ctx, w, h){
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.settings = {
      lineWidth: 1,
      slitType: "vertical",
      alpha: 1
    };
  };

  slitMode.prototype.playLoop = function(pixelArray) {
    var pixels = this.getPixels(pixelArray);
    this.ctx.lineWidth = this.settings.lineWidth;
    this.draw(pixels);
  };

  slitMode.prototype.draw = function(pixels) {
    switch(this.settings.slitType) {
      case "horizontal":
        this.drawHorizontal(pixels);
        break;
      case "vertical":
        this.drawVertical(pixels);
        break;
      case "converge":
        this.drawConvergence(pixels);
        break;
    }
  };

  slitMode.prototype.drawConvergence = function(pixels){
    //x and y can each be 1 for loop i think?
    //whatevers
    var centerX = this.w / 2;
    var centerY = this.h / 2;
    this.ctx.lineWidth = 1;
    for(var x = 0; x < this.w; x++) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = pixels[x].getColor(this.settings.alpha);
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(centerX, centerY);
      this.ctx.stroke();
    }

    for(var x2 = this.w - 1; x2 > 0; x2--) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = pixels[x2].getColor(this.settings.alpha);
      this.ctx.moveTo(this.w - x2, this.h);
      this.ctx.lineTo(centerX, centerY);
      this.ctx.stroke();
    }

    for(var y = this.w; y < this.w + this.h; y++){
      this.ctx.beginPath();
      this.ctx.strokeStyle = pixels[y].getColor(this.settings.alpha);
      this.ctx.moveTo(0, y - this.w);
      this.ctx.lineTo(centerX, centerY);
      this.ctx.stroke();
    }

    for(var y2 = this.w + this.h - 1; y2 > this.w; y2--){
      this.ctx.beginPath();
      this.ctx.strokeStyle = pixels[y2].getColor(this.settings.alpha);
      this.ctx.moveTo(this.w, this.h + this.w - y2);
      this.ctx.lineTo(centerX, centerY);
      this.ctx.stroke();
      console.log(this.h - y2 - this.w);
    }
  };

  slitMode.prototype.drawHorizontal = function(pixels){
    var lineSize = parseInt(this.settings.lineWidth, 10);
    for(var i = 0; i < this.w; i += lineSize) {
      this.ctx.fillStyle = pixels[i].getColor(this.settings.alpha);
      this.ctx.fillRect(0, i, this.w, this.settings.lineWidth);
    }
  };

  slitMode.prototype.drawVertical = function(pixels){
    var lineSize = parseInt(this.settings.lineWidth, 10);
    for(var i = 0; i < this.h; i += lineSize) {
      this.ctx.fillStyle = pixels[i].getColor(this.settings.alpha);
      this.ctx.fillRect(i, 0, this.settings.lineWidth, this.w);
    }
  };

  slitMode.prototype.getPixels = function(pixelArray) {
    var coords = pixelArray.randomCoords();
    if (this.settings.slitType === "horizontal") {
      return pixelArray.getCol(coords[0]);
    } else if (this.settings.slitType === "vertical") {
      return pixelArray.getRow(coords[1]);
    } else {
      var rowpixels = pixelArray.getRow(coords[0]);
      var colpixels = pixelArray.getCol(coords[1]);
      return rowpixels.concat(colpixels);
    }
  };
})(this);
