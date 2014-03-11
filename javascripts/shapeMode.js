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
      "circle": this.drawCircle.bind(this.ctx),
      "square": this.drawSquare.bind(this.ctx),
      "random": this.drawRandom.bind(this.ctx),
      "line": this.drawLine.bind(this.ctx)
    };
  };

  shapeMode.prototype.playLoop = function(pixelArray) {
    var coords = pixelArray.randomCoords();
    var x = coords[0];
    var y = coords[1];
    var pixel = pixelArray.getPixel(x, y);
    var color = pixel.getColor(this.settings.alpha);
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    switch(this.settings.elementStart) {
      case "center":
        coords = pixelArray.centerCoords();//IS THIS RLLY THE RESPONSIBILITY OF THE PIXEL ARRAY?
        x = coords[0];
        y = coords[1];
        break;
      case "random":
        coords = pixelArray.randomCoords(); //IT IS PROBABLY NOT IT'S RESPONSIBILITY, NO.THANK YOU.
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
    this.beginPath();
    this.arc(x, y, size, 0, 2 * Math.PI, false);
    this.fill();
  };

  shapeMode.prototype.drawSquare = function(x, y, size) {
    this.fillRect(x - size, y - size, size * 2, size * 2);
  };

  shapeMode.prototype.drawRandom = function(x, y, size) {
    size *= 2;
    var startX = x - (Math.random() * size);
    var startY = y - (Math.random() * size);
    this.beginPath();
    this.moveTo(startX, startY);
    this.lineTo(x + (size * Math.random()), y - (size * Math.random()));
    this.lineTo(x + (size * Math.random()), y + (size * Math.random()));
    this.lineTo(x - (size * Math.random()), y + (size * Math.random()));
    this.lineTo(startX, startY);
    this.fill();
  };

  shapeMode.prototype.drawLine = function(x, y, size) {
    var lengths = [Math.random() * size, Math.random() * size * -1, 0];
    this.beginPath();
    this.moveTo(x, y);
    this.lineTo(x + lengths.sample(), y + lengths.sample());
    this.stroke();
  };
})(this);
