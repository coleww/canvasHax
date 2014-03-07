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

//THE SLIT DRAWING LOGIC!!!!!!!!!!!!!!!!!!
  slitMode.prototype.playLoop = function(pixelData, pixelCount) {
      var colors = this.getColors(pixelCount, pixelData);
      this.ctx.lineWidth = this.settings.lineWidth;
      this.draw(colors);
  };
//ROLL OUT DIFFERENT DRAW FUNCITONS?
  slitMode.prototype.draw = function(colors) {
    // instead of 500, this.width + this.linewidth
    for(var i = 0; i < 550; i += parseInt(this.settings.lineWidth, 10)) {

      this.ctx.strokeStyle = colors[i];
      this.ctx.beginPath();
      if (this.settings.slitType === "horizontal") {
        this.ctx.moveTo(0, i);
        this.ctx.lineTo(500, i);
      } else if (this.settings.slitType === "vertical") {
        this.ctx.moveTo(i, 0);
        this.ctx.lineTo(i, 500);
      } else {
        this.ctx.moveTo(0, i);
        this.ctx.lineTo(250, 250);
        this.ctx.strokeStyle = colors[i+500];
        this.ctx.moveTo(i, 0);
        this.ctx.lineTo(250, 250);
        this.ctx.strokeStyle = colors[i];
        this.ctx.moveTo(500, i);
        this.ctx.lineTo(250, 250);
        this.ctx.strokeStyle = colors[i+500];
        this.ctx.moveTo(i, 500);
        this.ctx.lineTo(250, 250);
      }
      this.ctx.stroke();
    }
  };

  slitMode.prototype.getColors = function(pixelCount, pixelData) {
    var startingPixelPosition;
    if (this.settings.slitType === "horizontal") {
      startingPixelPosition = this.randomColStart(pixelCount);
      return this.getColColors(pixelData, startingPixelPosition);
    } else if (this.settings.slitType === "vertical") {
      startingPixelPosition = this.randomRowStart(pixelCount);
      return this.getRowColors(pixelData, startingPixelPosition);
    } else {
      var rowStart = this.randomRowStart(pixelCount);
      var colStart = this.randomColStart(pixelCount);
      var rowColors = this.getRowColors(pixelData, rowStart);
      var colColors = this.getColColors(pixelData, colStart);
      return rowColors.concat(colColors);
    }
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

//DUPLICATED CODE, ABSTRACT! INHERIT! WTF
  slitMode.prototype.getFill = function(pixelData, currentPixelPosition) {
    var r = pixelData[currentPixelPosition];
    var g = pixelData[currentPixelPosition + 1];
    var b = pixelData[currentPixelPosition + 2];
    return "rgba(" + r + "," + g + "," + b + "," + this.settings.alpha + ")";
  };
})(this);
