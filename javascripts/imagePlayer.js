(function(root) {
  Array.prototype.sample = function(){
    return this[Math.floor(Math.random() * this.length)];
  };

  var imagePlayer = root.imagePlayer = (root.imagePlayer || {});

  var Player = imagePlayer.Player = function(canvas, currImageCanvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.currImgCtx = currImageCanvas.getContext('2d');
    this.w = canvas.width;
    this.h = canvas.height;
    this.interval = undefined;
    this.img = undefined;
    // /\ canvas junk
//maybe options objects?
    //\/ draw opts
    this.loopType = "draw";
    this.elementSize = 5;
    this.alpha = 1;
    this.elementStart = "origin";
    this.strokeType = "circle";
    this.distance = 5;
    this.numElements = 5;

    //slit opts
    this.lineWidth = 1;
    this.slitType = "vertical";
  };

//KICKOFF LOGICS
  Player.prototype.play = function() {
    //maybe construct the UI object here?
    this.loadAndDraw(this.pickRandomImage());
  };
  //CAN THIS BRO GET ADDED TO DRAWNEWIMAGE??????????????????????????????????????????//
  Player.prototype.loadAndDraw = function(imgSource) {
    var that = this;
    var img = new Image();
    img.onload = function() {
      that.drawNewImage(img);
    };
    img.src = imgSource;
  };

  Player.prototype.pickRandomImage = function() {
    return "/images/" + (parseInt(Math.random() * 10) + 1) + ".jpg";
  };///canvasHax

  Player.prototype.handleImage = function(e) {
    var that = this;
    var reader = new FileReader();
    reader.onload = function(event) {
      that.loadAndDraw(event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  Player.prototype.drawNewImage = function(img) {
    this.img = img;

    this.ctx.drawImage(img, 0, 0, this.w, this.h);
    this.currImgCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 100, 100);

    var pixelData = this.ctx.getImageData(0, 0, this.w, this.h).data;
    var pixelCount = pixelData.length / 4;

    this.ctx.fillStyle = "rgb(0, 0, 0)";
    this.ctx.fillRect(0,0, this.w, this.h);

    if(this.interval) {clearInterval(this.interval);}
    if (this.loopType === "draw") {
      this.startDrawLoop(this.ctx, pixelData, pixelCount);
    } else {
      this.startSlitLoop(this.ctx, pixelData, pixelCount);
    }
  };

//DRAW LOOP LOGIC!!!!!!!!!!!!!!!!!!!!!!!!!
  Player.prototype.startDrawLoop = function(ctx, pixelData, pixelCount) {
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

  Player.prototype.getStartPosition = function(currentPixelPosition){
    var x = this.w;
    var y = this.h;
    switch(this.elementStart) {
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

  Player.prototype.randomPixelPosition = function(pixelCount) {
    return parseInt(Math.random() * pixelCount , 10) * 4;
  };

  Player.prototype.getFill = function(pixelData, currentPixelPosition) {
    var r = pixelData[currentPixelPosition];
    var g = pixelData[currentPixelPosition + 1];
    var b = pixelData[currentPixelPosition + 2];
    return "rgba(" + r + "," + g + "," + b + "," + this.alpha + ")";
  };

  Player.prototype.draw = function(ctx, x, y) {
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

  Player.prototype.drawShape = function(ctx, x, y, size) {
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

  Player.prototype.drawCircle = function(ctx, x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI, false);
    ctx.fill();
  };

  Player.prototype.drawSquare = function(ctx, x, y, size) {
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
  };

  Player.prototype.drawRandom = function(ctx, x, y, size) {
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

  Player.prototype.drawLine = function(ctx, x, y, size) {
    var lengths = [Math.random() * size, Math.random() * size * -1, 0];
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + lengths.sample(), y + lengths.sample());
    ctx.stroke();
  };

//THE SLIT DRAWING LOGIC!!!!!!!!!!!!!!!!!!
  Player.prototype.startSlitLoop = function(ctx, pixelData, pixelCount) {
    var that = this;
    this.interval = window.setInterval(function() {
      var colors = that.getColors(pixelCount, pixelData);
      that.ctx.lineWidth = that.lineWidth;
      that.drawSlits(ctx, colors);
    }, 50);
  };

  Player.prototype.drawSlits = function(ctx, colors) {
    // instead of 500, this.width + this.linewidth
    for(var i = 0; i < 550; i += parseInt(this.lineWidth, 10)) {
      ctx.strokeStyle = colors[i];
      ctx.beginPath();
      if (this.slitType === "horizontal") {
        ctx.moveTo(0, i);
        ctx.lineTo(500, i);
      } else if (this.slitType === "vertical") {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 500);
      } else {
        ctx.moveTo(0, i);
        ctx.lineTo(250, 250);
        ctx.strokeStyle = colors[i+500];
        ctx.moveTo(i, 0);
        ctx.lineTo(250, 250);
        ctx.strokeStyle = colors[i];
        ctx.moveTo(500, i);
        ctx.lineTo(250, 250);
        ctx.strokeStyle = colors[i+500];
        ctx.moveTo(i, 500);
        ctx.lineTo(250, 250);
      }
      ctx.stroke();
    }
  };

  Player.prototype.getColors = function(pixelCount, pixelData) {
    var startingPixelPosition;
    if (this.slitType === "horizontal") {
      startingPixelPosition = this.randomColStart(pixelCount);
      return this.getColColors(pixelData, startingPixelPosition);
    } else if (this.slitType === "vertical") {
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

  Player.prototype.randomRowStart = function(pixelCount) {
    //presuming a square canvas
    //ABSTRACT THIS FOOL!
    var rowCount = Math.sqrt(pixelCount);
    var startPixel = rowCount * parseInt(Math.random() * rowCount, 10) * 4;
    return startPixel;
  };

  Player.prototype.getRowColors = function(pixelData, startPosition) {
    var colors = [];
    //2000 magic number, this.h * 4 instead?
    for(var i = 0; i < 2000; i+= 4){
      colors.push(this.getFill(pixelData, startPosition + i));
    }
    return colors;
  };

  Player.prototype.randomColStart = function(pixelCount) {
    var colCount = Math.sqrt(pixelCount);
    var startPixel = parseInt(Math.random() * colCount) * 4;
    return startPixel;
  };

  Player.prototype.getColColors = function(pixelData, startPosition) {
    var colors = [];
    //start position is btwn 0 and 500 (*4)
    for(var i = 0; i < pixelData.length; i+= 2000){
      colors.push(this.getFill(pixelData, startPosition + i));
    }
    return colors;
  };

//UI LISTENER INSTALLLLLLATION!
//OH this could get passed an image player?
//70 lines of jquery listeners :/


//IMAGE SAVING LOGICS
  Player.prototype.saveImage = function() {
    this.canvas.toBlob(function(blob) {
      saveAs(blob, "Player.png");
    });
  };

  Player.prototype.createGIF = function() {
    var that = this;
    var framesAdded = 0;
    var frames = 6;
    var ag = new Animated_GIF({
      workerPath: '/canvasHax/vendor/Animated_GIF.worker.js'
    });
    var gifButton = $("#gif");
    gifButton.text("creating...");
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
  var ip = new imagePlayer.Player(canvas, currImgCanvas);
  new imagePlayer.PlayerUI(ip);
  ip.play();
});
