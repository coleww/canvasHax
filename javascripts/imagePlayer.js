(function(root) {
  //where does this belong?
  //hacks.js with Array.prototype.getFill?
  //UGH! write a pixelArray class with proper get methods!!!!!
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

    this.loopType = "shapes";
    this.modes = {
      shapes: new imagePlayer.shapeMode(this.ctx, this.w, this.h),
      slits: new imagePlayer.slitMode(this.ctx, this.w, this.h)
    };
  };

  Player.prototype.play = function() {
    //maybe construct the UI object here?
    this.loadAndDraw(this.pickRandomImage());
  };

  Player.prototype.loadAndDraw = function(imgSource) {
    var that = this;
    var img = new Image();
    img.onload = function() {
      that.drawNewImage(img);
    };
    img.src = imgSource;
  };

  Player.prototype.pickRandomImage = function() {
    return "/images/" + (Math.floor(Math.random() * 10) + 1) + ".jpg";
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

    if(this.interval) {
      clearInterval(this.interval);
    }
    this.startLoop(pixelData, pixelCount);
  };

  Player.prototype.startLoop = function(pixelData, pixelCount) {
    var that = this;
    this.interval = window.setInterval(function() {
      that.modes[that.loopType].playLoop(pixelData, pixelCount);
    }, 5);
  };
})(this);
