(function(root){
  "use strict";

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
