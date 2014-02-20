imagePlayer.prototype.startSlitLoop = function(ctx, pixelData, pixelCount){
  var that = this;
  this.interval = window.setInterval(function() {
    var startingPixelPosition = that.randomRowStart(pixelCount);
    var colors = that.getSlitColors(pixelData, startingPixelPosition);
    that.drawSlits(ctx, colors);
  }, 5);
};

imagePlayer.prototype.drawSlits = function(ctx, colors){
  for(i = 0; i < 500; i+= 1){
    ctx.strokeStyle = colors.shift();
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 500);
    ctx.stroke();
  }
};

imagePlayer.prototype.randomRowStart = function(pixelCount){
  //presuming a square canvas
  var rowCount = Math.sqrt(pixelCount);
  var startPixel = rowCount * parseInt(Math.random() * rowCount, 10) * 4;
  return startPixel;
};

imagePlayer.prototype.getSlitColors = function(pixelData, startPosition){
  var colors = [];
  for(var i = 0; i < 2000; i+= 4){
    colors.push(this.getFill(pixelData, startPosition + i));
  }
};
