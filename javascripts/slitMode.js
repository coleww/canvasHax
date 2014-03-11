(function(root){
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
    //SPLIT IT UP INTO DRAW WIDTHS AND DRAW HEIGHTHS
    //DEPENDS ON SQUARE CANVAS UGH.
    //DISABLE LINE WIDTH ON THIS BAD BOY AND INSTEAD...?
    var centerX = this.w / 2;
    var centerY = this.h / 2;
    for(var i = 0; i < this.w; i += parseInt(this.settings.lineWidth, 10)) {

      this.ctx.beginPath();

      this.ctx.strokeStyle = pixels[i].getColor(this.settings.alpha);

      this.ctx.moveTo(0, i);
      this.ctx.lineTo(centerX, centerY);

      this.ctx.moveTo(this.w, i);
      this.ctx.lineTo(centerX, centerY);

      this.ctx.strokeStyle = pixels[i+this.w].getColor(this.settings.alpha);

      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(centerX, centerY);

      this.ctx.moveTo(i, this.h);
      this.ctx.lineTo(centerX, centerY);

      this.ctx.stroke();
    }
  };





  slitMode.prototype.drawHorizontal = function(pixels){
    var lineSize = parseInt(this.settings.lineWidth, 10);
    for(var i = 0; i < this.w; i += lineSize) {
      this.ctx.fillStyle = pixels[i].getColor(this.settings.alpha);
      this.ctx.fillRect(0, i, this.w, this.settings.lineWidth);
      // this.ctx.beginPath();
      // this.ctx.moveTo(0, i);
      // this.ctx.lineTo(this.w, i);
      // this.ctx.stroke();
    }
  };
//THESE TWO SHOULD ACTUALLY DRAW RECTANGLES.
  slitMode.prototype.drawVertical = function(pixels){
    var lineSize = parseInt(this.settings.lineWidth, 10);
    for(var i = 0; i < this.h; i += lineSize) {
      this.ctx.fillStyle = pixels[i].getColor(this.settings.alpha);
      this.ctx.fillRect(i, 0, this.settings.lineWidth, this.w);

      // this.ctx.beginPath();
      // this.ctx.moveTo(i, 0);
      // this.ctx.lineTo(i, this.h);
      // this.ctx.stroke();
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
