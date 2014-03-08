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
      drawShape: "circle",
      distance: 5,
      numElements: 5
    };

    this.shapes = {
      "circle": this.drawCircle,
      "square": this.drawSquare,
      "random": this.drawRandom,
      "line": this.drawLine
    };
  };

  shapeMode.prototype.playLoop = function(pixelArray) {
    var coords = pixelArray.randomCoords();
    var x = coords[0];
    var y = coords[1];
    var pixel = pixelArray.getPixel(x, y);
    var color = pixelArray.getColor(pixel, this.settings.alpha);
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    switch(this.settings.elementStart) {
      case "center":
        coords = pixelArray.centerCoords();
        x = coords[0];
        y = coords[1];
        break;
      case "random":
        coords = pixelArray.randomCoords();
        x = coords[0];
        y = coords[1];
        break;
      case "origin":
        break;
    }

    this.draw(x, y);
  };

  shapeMode.prototype.draw = function(x, y) {
    for(var i = 0; i < this.settings.numElements; i++) {
      var elementSize = this.settings.elementSize * Math.random();
      this.shapes[this.settings.drawShape](x, y, elementSize);

      x += (Math.random() * 2 - 1) * this.settings.distance;
      y += (Math.random() * 2 - 1) * this.settings.distance;

      if (x < 0 - this.settings.elementSize ||
          y < 0 - this.settings.elementSize ||
          x > this.w + this.settings.elementSize ||
          y > this.h + this.settings.elementSize) {
        break;
      }
    }
  };

  shapeMode.prototype.drawCircle = function(x, y, size) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, 2 * Math.PI, false);
    this.ctx.fill();
  };

  shapeMode.prototype.drawSquare = function(x, y, size) {
    this.ctx.fillRect(x - size, y - size, size * 2, size * 2);
  };

  shapeMode.prototype.drawRandom = function(x, y, size) {
    size *= 2;
    var startX = x - (Math.random() * size);
    var startY = y - (Math.random() * size);
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(x + (size * Math.random()), y - (size * Math.random()));
    this.ctx.lineTo(x + (size * Math.random()), y + (size * Math.random()));
    this.ctx.lineTo(x - (size * Math.random()), y + (size * Math.random()));
    this.ctx.lineTo(startX, startY);
    this.ctx.fill();
  };

  shapeMode.prototype.drawLine = function(x, y, size) {
    var lengths = [Math.random() * size, Math.random() * size * -1, 0];
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + lengths.sample(), y + lengths.sample());
    this.ctx.stroke();
  };
})(this);
