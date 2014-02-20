(function(root) {
  var imagePlayer = root.imagePlayer = function(canvas, currImageCanvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.currImgCtx = currImageCanvas.getContext('2d');
    this.w = canvas.width;
    this.h = canvas.height;
    this.interval = undefined;
    // /\ canvas junk     \/ attrs
    this.loopType = "draw";
    this.elementSize = 5;
    this.alpha = 1;
    this.elementStart = "origin";
    this.strokeType = "circle";
    this.distance = 5;
    this.numElements = 5;
    this.ctx.lineWidth = 2;
  };

  imagePlayer.prototype.play = function() {
    this.installListeners();
    this.drawDefault(this.ctx, this.currImgCtx);
  };

  imagePlayer.prototype.drawDefault = function(ctx, currImgCtx) {
    var that = this;
    var img = new Image();
    img.onload = function() {
      var imgW = img.width;
      var imgH = img.height;
      that.ctx.drawImage(img, 0, 0, that.w, that.h);
      that.currImgCtx.drawImage(img, 0, 0, imgW, imgH, 0, 0, 50, 50);
      if(that.interval) {clearInterval(that.interval);}
      that.drawNewImage(that.ctx);
    };
    img.src = "/canvasHax/images/" + (parseInt(Math.random() * 10) + 1) + ".jpg";
  };

  imagePlayer.prototype.drawNewImage = function(ctx) {
    var pixelData = ctx.getImageData(0, 0, this.w, this.h).data;
    var pixelCount = pixelData.length / 4;
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0,0, this.w, this.h);
    if (this.loopType === "draw") {
      this.startLoop(ctx, pixelData, pixelCount);
    } else {
      this.startSlitLoop(ctx, pixelData, pixelCount);
    }
  };

  imagePlayer.prototype.startLoop = function(ctx, pixelData, pixelCount) {
    var that = this;
    this.interval = window.setInterval(function() {
      var currentPixelPosition = that.randomPixelPosition(pixelCount);
      var currentColor = that.getFill(pixelData, currentPixelPosition);
      ctx.fillStyle = currentColor;
      ctx.strokeStyle = currentColor;
      var coords = that.getStartPosition(currentPixelPosition);
      var x = coords[0];
      var y = coords[1];
      that.draw(ctx, x, y);
    }, 5);
  };

  imagePlayer.prototype.getStartPosition = function(currentPixelPosition){
    var x = that.w;
    var y = that.h;
    switch(that.elementStart) {
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
      x = actualPixel % that.w;
      y = actualPixel / that.h;
      break;
    }
    return [x, y];
  };

  imagePlayer.prototype.randomPixelPosition = function(pixelCount) {
    return parseInt(Math.random() * pixelCount , 10) * 4;
  };

  imagePlayer.prototype.getFill = function(pixelData, currentPixelPosition) {
    var r = pixelData[currentPixelPosition];
    var g = pixelData[currentPixelPosition + 1];
    var b = pixelData[currentPixelPosition + 2];
    return "rgba(" + r + "," + g + "," + b + "," + this.alpha + ")";
  };

  imagePlayer.prototype.draw = function(ctx, x, y) {
    for(var i = 0; i < this.numElements; i++) {
      this.drawShape(ctx, x, y, this.elementSize * Math.random());
      x += (Math.random() * 2 - 1) * this.distance;
      y += (Math.random() * 2 - 1) * this.distance;
      // if (x < 0 - this.elementSize || y < 0 - this.elementSize ||
      //     x > this.w + this.elementSize || y > this.h + this.elementSize) {
      //   break;
      // }
    }
  };

//OK what if the string is a key and the value is the function?
  imagePlayer.prototype.drawShape = function(ctx, x, y, size) {
    switch(this.strokeType) {
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
//THESE THREE: WHERE DO THEY GO? object-agnostic...and stuff.
  imagePlayer.prototype.drawCircle = function(ctx, x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI, false);
    ctx.fill();
  };

  imagePlayer.prototype.drawSquare = function(ctx, x, y, size) {
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
  };

  imagePlayer.prototype.drawRandom = function(ctx, x, y, size) {
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

  imagePlayer.prototype.drawLine = function(ctx, x, y, size) {
    var lengths = [Math.random() * size, Math.random() * size * -1, 0];
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + lengths[parseInt(Math.random() * 3, 10)], y + lengths[parseInt(Math.random() * 3, 10)]);
    ctx.stroke();
  };

  imagePlayer.prototype.installListeners = function() {
    var that = this;
    $("#alpha").change(function(e) {
      that.alpha = $(e.target).val();
    });

    $("#circ-size").change(function(e) {
      that.elementSize = $(e.target).val();
    });

    $("#circ-move").change(function(e) {
      that.distance = $(e.target).val();
    });

    $("#num-circles").change(function(e) {
      that.numElements = $(e.target).val();
    });

    $("input:radio[name=loop-type]").change(function(e) {
      e.preventDefault();
      that.loopType = $(event.target).val();
    });

    $("input:radio[name=start-position]").change(function(e) {
      e.preventDefault();
      that.elementStart = $(event.target).val();
    });

    $("input:radio[name=stroke-type]").change(function(e) {
      e.preventDefault();
      that.strokeType = $(event.target).val();
    });

    $("#save").click(function(e) {
      e.preventDefault();
      that.canvas.toBlob(function(blob) {
        saveAs(blob, "ImagePlayer.png");
      });
    });

    $("#gif").click(function(e) {
      e.preventDefault();
      $("#gif").text("creating...");
      that.createGIF();
    });

    $('#imageLoader').change(function(e) {
      e.preventDefault();
      that.handleImage(e);
    });
  };

  imagePlayer.prototype.handleImage = function(e) {
    var that = this;
    var reader = new FileReader();
    reader.onload = function(event) {
      var img = new Image();
      img.onload = function() {
        //THIS SHOULD BE ITS OWN FUNCTION AW YEAH
        //GETS PASSED THE IMAGE AND THE CANVAS OBJECTII THING.
        //ONLY NEEDS THE CANVAS CORE ATTRS NOT THE UI.
        var imgW = img.width;
        var imgH = img.height;
        that.ctx.drawImage(img, 0, 0, that.w, that.h);
        that.currImgCtx.drawImage(img, 0, 0, imgW, imgH, 0, 0, 50, 50);
        if(that.interval) {clearInterval(that.interval);}
        that.drawNewImage(that.ctx);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  imagePlayer.prototype.createGIF = function() {
    var that = this;
    var framesAdded = 0;
    var frames = 6;
    var ag = new Animated_GIF({ workerPath: '/canvasHax/vendor/Animated_GIF.worker.js' });
    var gifButton = $("#gif");
    ag.setSize(500, 500);
    ag.setDelay(100);

    var GifInterval = window.setInterval(function() {
      var img = document.createElement('img');
      img.src = that.canvas.toDataURL();
      ag.addFrame(img);
      framesAdded ++;
      gifButton.text(frames - framesAdded + "...");
      if (framesAdded >= frames) {
        clearInterval(GifInterval);
        var animatedImage = document.createElement('img');
        ag.getBase64GIF(function(image) {
          animatedImage.src = image;
          document.body.appendChild(animatedImage);
          gifButton.text("Create Gif");
        });
      }
    }, 1000);
  };













  imagePlayer.prototype.startSlitLoop = function(ctx, pixelData, pixelCount){
    var that = this;
    this.interval = window.setInterval(function() {
      var startingPixelPosition = that.randomRowStart(pixelCount);
      var colors = that.getSlitColors(pixelData, startingPixelPosition);
      that.drawSlits(ctx, colors);
    }, 50);
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
    return colors;
  };


})(this);


$(function() {
  var canvas = document.getElementById('imageCanvas');
  var currImgCanvas = document.getElementById('currentImage');
  new imagePlayer(canvas, currImgCanvas).play();
});
