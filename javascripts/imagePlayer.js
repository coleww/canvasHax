(function(root) {
  var imagePlayer = root.imagePlayer = function(canvas, currImageCanvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.currImgCtx = currImageCanvas.getContext('2d');
    this.w = canvas.width;
    this.h = canvas.height;
    this.interval = undefined;
    // /\ canvas junk     \/ attrs
    this.elementSize = 5;
    this.alpha = 1;
    this.elementStart = "origin";
    this.strokeType = "circle";
    this.distance = 5;
    this.numElements = 5;
  };

  imagePlayer.prototype.play = function() {
    this.installListeners();
    this.drawDefault(this.ctx, this.currImgCtx);
  };

  imagePlayer.prototype.drawDefault = function(ctx, currImgCtx) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0,0, this.w, this.h);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font="250px Helvetica";
    ctx.fillText(" hire",-25,250);
    ctx.fillText(" me",-25,450);
    currImgCtx.drawImage(this.canvas, 0, 0, this.w, this.h, 0, 0, 50, 50);
    this.drawNewImage(ctx);
  };

  imagePlayer.prototype.drawNewImage = function(ctx) {
    var pixelData = ctx.getImageData(0, 0, this.w, this.h).data;
    var pixelCount = pixelData.length / 4;
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0,0, this.w, this.h);
    this.startLoop(ctx, pixelData, pixelCount);
  };

  imagePlayer.prototype.startLoop = function(ctx, pixelData, pixelCount) {
    var that = this;
    this.interval = window.setInterval(function() {
      var currentPixelPosition = that.randomPixelPosition(pixelCount);
      ctx.fillStyle = that.getFill(pixelData, currentPixelPosition);

      var x = that.w;
      var y = that.h;

      //COULD be a method that gets passed w, h, currentPP
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

      that.draw(ctx, x, y);
    }, 5);
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
      if (x < 0 - this.elementSize || y < 0 - this.elementSize ||
          x > this.w + this.elementSize || y > this.h + this.elementSize) {
        break;
      }
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
    var ag = new Animated_GIF({ workerPath: 'javascripts/Animated_GIF.worker.js' });
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

})(this);


$(function() {
  var canvas = document.getElementById('imageCanvas');
  var currImgCanvas = document.getElementById('currentImage');
  new imagePlayer(canvas, currImgCanvas).play();
});
