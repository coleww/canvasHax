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
      var colors = this.getColors(pixelArray);
      this.ctx.lineWidth = this.settings.lineWidth;
      this.draw(colors);
  };

  slitMode.prototype.draw = function(colors) {
    //ACK! ONLY WORKS FOR SQUARE CANVII
    var centerX = this.w / 2;
    var centerY = this.h / 2;
    for(var i = 0; i < this.w + this.settings.lineWidth; i += parseInt(this.settings.lineWidth, 10)) {
      this.ctx.strokeStyle = colors[i];
      this.ctx.beginPath();
      if (this.settings.slitType === "horizontal") {
        this.ctx.moveTo(0, i);
        this.ctx.lineTo(this.w, i);
      } else if (this.settings.slitType === "vertical") {
        this.ctx.moveTo(i, 0);
        this.ctx.lineTo(i, this.h);
      } else {
        this.ctx.moveTo(0, i);
        this.ctx.lineTo(centerX, centerY);

        this.ctx.strokeStyle = colors[i+this.w];
        this.ctx.moveTo(i, 0);
        this.ctx.lineTo(centerX, centerY);

        this.ctx.strokeStyle = colors[i];
        this.ctx.moveTo(this.w, i);
        this.ctx.lineTo(centerX, centerY);

        this.ctx.strokeStyle = colors[i+this.w];
        this.ctx.moveTo(i, 500);
        this.ctx.lineTo(centerX, centerY);
      }
      this.ctx.stroke();
    }
  };

  slitMode.prototype.drawConvergence = function(colors){
        var centerX = this.w / 2;
    var centerY = this.h / 2;
    for(var i = 0; i < this.width + this.settings.lineWidth; i += parseInt(this.settings.lineWidth, 10)) {

      this.ctx.beginPath();

      //left sidec
      this.ctx.strokeStyle = colors[i];
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(centerX, centerY);

      //
      this.ctx.strokeStyle = colors[i+this.w];
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(centerX, centerY);

      this.ctx.strokeStyle = colors[i];
      this.ctx.moveTo(this.w, i);
      this.ctx.lineTo(centerX, centerY);

      this.ctx.strokeStyle = colors[i+this.w];
      this.ctx.moveTo(i, this.h);
      this.ctx.lineTo(centerX, centerY);

      this.ctx.stroke();
    }
  };

  slitMode.prototype.drawHorizontal = function(colors){
    var lineSize = parseInt(this.settings.lineWidth, 10);
    for(var i = 0; i < this.width + this.settings.lineWidth; i += lineSize) {
      this.ctx.strokeStyle = colors[i];
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.w, i);
      this.ctx.stroke();
    }
  };

  slitMode.prototype.drawVertical = function(colors){
    var lineSize = parseInt(this.settings.lineWidth, 10);
    for(var i = 0; i < this.height + this.settings.lineWidth; i += lineSize) {
      this.ctx.strokeStyle = colors[i];
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.w, i);
      this.ctx.stroke();
    }
  };

  slitMode.prototype.getColors = function(pixelArray) {
    var coords = pixelArray.randomCoords();
    if (this.settings.slitType === "horizontal") {
      return pixelArray.getCol(coords[0], this.settings.alpha);
    } else if (this.settings.slitType === "vertical") {
      return pixelArray.getRow(coords[1], this.settings.alpha);
    } else {
      var rowColors = pixelArray.getRow(coords[0], this.settings.alpha);
      var colColors = pixelArray.getCol(coords[1], this.settings.alpha);
      return rowColors.concat(colColors);
    }
  };
})(this);
