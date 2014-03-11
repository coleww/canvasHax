(function(root){
  "use strict";
  var imagePlayer = root.imagePlayer = (root.imagePlayer || {});

  var Saver = imagePlayer.Saver = function(canvas){
    this.canvas = canvas;
  };

  Saver.prototype.saveImage = function() {
    this.canvas.toBlob(function(blob) {
      saveAs(blob, "imagePlayer.png");
    });
  };

  Saver.prototype.createGIF = function() {
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
