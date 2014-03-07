(function(root){
  var imagePlayer = root.imagePlayer = (root.imagePlayer || {});

  var shapeMode = imagePlayer.shapeMode = function(ctx, w, h){
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.settings = {
      elementSize: 5,
      alpha: 1,
      elementStart: "origin",
      strokeType: "circle",
      distance: 5,
      numElements: 5
    };
  };

  shapeMode.prototype.playLoop = function(ctx, pixelData, pixelCount) {
    var currentPixelPosition = this.randomPixelPosition(pixelCount);
    var currentColor = this.getFill(pixelData, currentPixelPosition);
    ctx.fillStyle = currentColor;
    ctx.strokeStyle = currentColor;
    var coords = this.getStartPosition(currentPixelPosition);
    var x = coords[0];
    var y = coords[1];
    this.draw(ctx, x, y);
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

  shapeMode.prototype.getFill = function(pixelData, currentPixelPosition) {
    var r = pixelData[currentPixelPosition];
    var g = pixelData[currentPixelPosition + 1];
    var b = pixelData[currentPixelPosition + 2];
    return "rgba(" + r + "," + g + "," + b + "," + this.settings.alpha + ")";
  };

  shapeMode.prototype.draw = function(ctx, x, y) {
    for(var i = 0; i < this.settings.numElements; i++) {
      this.drawShape(ctx, x, y, this.settings.elementSize * Math.random());
      x += (Math.random() * 2 - 1) * this.settings.distance;
      y += (Math.random() * 2 - 1) * this.settings.distance;
      if (x < 0 - this.settings.elementSize || y < 0 - this.settings.elementSize ||
          x > this.w + this.settings.elementSize || y > this.h + this.settings.elementSize) {
        break;
      }
    }
  };

  shapeMode.prototype.drawShape = function(ctx, x, y, size) {
    switch(this.settings.strokeType) {
    case "circle":
      this.drawCircle(ctx, x, y, size);
      break;
    case "square":
      this.drawSquare(ctx, x, y, size);
      break;
    case "random":
      this.drawRandom(ctx, x, y, size);
      break;
    case "line":
      this.drawLine(ctx, x, y, size);
      break;
    }
  };

  shapeMode.prototype.drawCircle = function(ctx, x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI, false);
    ctx.fill();
  };

  shapeMode.prototype.drawSquare = function(ctx, x, y, size) {
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
  };

  shapeMode.prototype.drawRandom = function(ctx, x, y, size) {
    size *= 2;
    var startX = x - (Math.random() * size);
    var startY = y - (Math.random() * size);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x + (size * Math.random()), y - (size * Math.random()));
    ctx.lineTo(x + (size * Math.random()), y + (size * Math.random()));
    ctx.lineTo(x - (size * Math.random()), y + (size * Math.random()));
    ctx.lineTo(startX, startY);
    ctx.fill();
  };

  shapeMode.prototype.drawLine = function(ctx, x, y, size) {
    var lengths = [Math.random() * size, Math.random() * size * -1, 0];
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + lengths.sample(), y + lengths.sample());
    ctx.stroke();
  };
})(this);
