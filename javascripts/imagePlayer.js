(function(root) {
  "use strict";
  var imagePlayer = root.imagePlayer = (root.imagePlayer || {});
  var Player = imagePlayer.Player = function(canvas, currImageCanvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.currImgCtx = currImageCanvas.getContext('2d');
    this.w = canvas.width;
    this.h = canvas.height;
    this.interval = undefined;
    this.img = undefined;

    this.loopType = "shapes";
    this.modes = {
      shapes: new imagePlayer.shapeMode(this.ctx, this.w, this.h),
      slits: new imagePlayer.slitMode(this.ctx, this.w, this.h),
      walkers: new imagePlayer.walkerMode(this.ctx, this.w, this.h)
    };
  };

  Player.prototype.play = function() {
    //maybe construct the UI object here?
    this.loadAndDraw(this.pickRandomImage());
  };

  Player.prototype.pickRandomImage = function() {
    return "/canvasHax/images/" + (Math.floor(Math.random() * 20) + 1) + ".jpg";
  };//

  Player.prototype.loadAndDraw = function(imgSource) {
    var that = this;
    var img = new Image();
    img.onload = function() {
      that.drawNewImage(img);
    };
    img.src = imgSource;
  };

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
    var pixelArray = new PixelArray(this.ctx, this.w, this.h);

    //walkers need to know their color
    this.modes["walkers"].generateWalkers(pixelArray);

//option to clear on restart? GRAB from currImgCtx, 100X100 limit to things?
    this.ctx.fillStyle = "rgb(0, 0, 0)";
    this.ctx.fillRect(0,0, this.w, this.h);

    if(this.interval) {
      clearInterval(this.interval);
    }
    var that = this;
    this.interval = window.setInterval(function() {
      that.modes[that.loopType].playLoop(pixelArray);
    }, 5);
  };
})(this);
