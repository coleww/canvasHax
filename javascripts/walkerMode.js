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


///////////////////////////////////////////////////////////////////////////////////////////
//about time to make my own JS library of canvas hax.
//about time to learn radians/degrees too.
//about time for a lotta things.
//about time to see if there is javascript perlin noise
//duh there has to be there is JSeverything.
//OPTIONS HASH YO!
  var RandomWalker = root.RandomWalker = function(pixel, w, h, x, y){
    this.pixel = pixel;
    this.dirs = [-1, 0, 1];
    this.w = w;
    this.h = h;
    this.xdir = null;
    this.ydir = null;
    this.x2pos = null;
    this.y2pos = null;
    if (x === undefined || y === undefined){
      this.xpos = Math.floor(Math.random() * w);
      this.ypos = Math.floor(Math.random() * h);
    } else {
      this.xpos = x;
      this.ypos = y;
    }

    this.setRandomDirection();
    this.move(5);//so x2y2 get set. it's lame, i know. move 5 so it sets. ugh. refactor this.
  };

  RandomWalker.prototype.move = function(distance){

//random random
    // this.xpos += this.dirs.sample();
    // this.ypos += this.dirs.sample();

//liney random
    this.xpos += this.xdir;
    this.ypos += this.ydir;
    this.x2pos = this.xpos + this.xdir * distance;
    this.y2pos = this.ypos + this.ydir * distance;


    if (this.xpos < 0 || this.xpos > this.w){
      this.xdir *= -1;

    }
    if (this.ypos < 0 || this.ypos > this.h){
      this.ydir *= -1;
    }
    //IF X OR Y IS OUTTA BOUNDS, BOUNCE BACK OR REAPPEAR
  };

  RandomWalker.prototype.setRandomDirection = function(){
    this.xdir = this.dirs.sample();
    this.ydir = this.dirs.sample();
    if(this.xdir === 0 && this.ydir === 0){
      this.setRandomDirection();
    }
  };

//DRAWS a circle at its x2, y2, and erases from x,y to x2, y2
  RandomWalker.prototype.mark = function(ctx){
    ctx.fillStyle = this.pixel.getColor();
    ctx.beginPath();
    ctx.arc(this.x2pos, this.y2pos, 5, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 25)";
    //CHANGE STROKE WIDTH WEIGHT THING?
    ctx.moveTo(this.xpos, this.ypos);
    ctx.lineTo(this.x2pos, this.y2pos);
    ctx.fill();
  };

  RandomWalker.prototype.intersectsWith = function(otherWalker){
    var x1 = this.xpos;
    var y1 = this.ypos;
    var x2 = this.x2pos;
    var y2 = this.y2pos;
    var x3 = otherWalker.xpos;
    var y3 = otherWalker.ypos;
    var x4 = otherWalker.x2pos;
    var y4 = otherWalker.y2pos;
    // args /\   generic intersects func \/
    var bx = x2 - x1;
    var by = y2 - y1;
    var dx = x4 - x3;
    var dy = y4 - y3;
    var b_dot_d_perp = bx * dy - by * dx;
    if (b_dot_d_perp === 0) {
      return false;
    }
    var cx = x3 - x1;
    var cy = y3 - y1;
    var t = (cx * dy - cy * dx) / b_dot_d_perp;
    if (t < 0 || t > 1) {
      return false;
    }
    var u = (cx * by - cy * bx) / b_dot_d_perp;
    if (u < 0 || u > 1) {
      return false;
    }
    return true;
  };
})(this);
