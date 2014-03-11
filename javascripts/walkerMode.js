(function(root){
  "use strict";
  var imagePlayer = root.imagePlayer = (root.imagePlayer || {});

  var walkerMode = imagePlayer.walkerMode = function(ctx, w, h){
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.walkers = [];
    this.settings = {
      numWalkers: 100,
      walkerSize: 25,
      numQuads: 2,
      alpha: 1
    };
  };

//WHOA! this should take options hash for each walker?
  walkerMode.prototype.generateWalkers = function(pixelArray){
    this.walkers.length = 0;
    for(var i = 0; i < this.settings.numWalkers; i ++){
      var pixel = pixelArray.randomPixel();
      this.walkers.push(new RandomWalker(pixel, this.w, this.h));
    }
  };

  walkerMode.prototype.playLoop = function(){
    var that = this;
    this.walkers.forEach(function(walker, index, walkers){
      walker.move(that.settings.walkerSize);
      // walker.mark(that.ctx);
      walkers.forEach(function(walker2, index2){
        if(walker.intersectsWith(walker2) && index !== index2) {
          // walker.setRandomDirection();
          // walker2.setRandomDirection();
          that.drawQuad(walker, walker2);
        }
      });
    });
  };
//IT COULD draw the color of the pixel at that walkers point! OPTIONS!!!!!!!!!!!!!!!!!!
  walkerMode.prototype.drawQuad = function(w1, w2){
    this.ctx.fillStyle = w1.pixel.getColor(this.settings.alpha);

    if(this.settings.numQuads > 0){
      this.ctx.beginPath();
      this.ctx.moveTo(w1.xpos, w1.ypos);
      this.ctx.lineTo(w1.x2pos, w1.y2pos);
      this.ctx.lineTo(w2.xpos, w2.ypos);
      // this.ctx.lineTo(w2.x2pos, w2.y2pos);
      this.ctx.fill();
    }
    if(this.settings.numQuads > 1){
      this.ctx.fillStyle = w2.pixel.getColor(this.settings.alpha);
      this.ctx.beginPath();
      this.ctx.moveTo(w2.xpos, w2.ypos);
      this.ctx.lineTo(w2.x2pos, w2.y2pos);
      this.ctx.lineTo(w1.xpos, w1.ypos);
      // this.ctx.lineTo(w1.x2pos, w1.y2pos);
      this.ctx.fill();
    }
  };
})(this);
