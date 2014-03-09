(function(root){
  var imagePlayer = root.imagePlayer = (root.imagePlayer || {});

  var walkerMode = imagePlayer.walkerMode = function(ctx, w, h){
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.walkers = [];
    this.settings = {
      numWalkers: 100,
      walkerLength: 25,
      numQuads: 1,
      walkerSize: 25,
      alpha: 1
    };
  };

//WHOA! this should take options hash for each walker?
  walkerMode.prototype.generateWalkers = function(pixelArray){
    for(var i = 0; i < this.settings.numWalkers; i ++){
      var pixel = pixelArray.randomPixel();
      var fillColor = pixelArray.getColor(pixel);
      this.walkers.push(new randomWalker(fillColor, this.settings.walkerLength, this.w, this.h));
    }
  };//HOLY HELL COULD DRAW "PIXELS" IMAGE THEN THE IMAGE STARTS MOVING AROUND WOWEE!

  walkerMode.prototype.playLoop = function(){
    var that = this;
    this.walkers.forEach(function(walker, index, walkers){
      walker.move();
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
    this.ctx.fillStyle = w1.fillColor;
    this.ctx.beginPath();
    this.ctx.moveTo(w1.xpos, w1.ypos);
    this.ctx.lineTo(w1.x2pos, w1.y2pos);
    this.ctx.lineTo(w2.xpos, w2.ypos);
    // this.ctx.lineTo(w1.xpos, w1.ypos);
    this.ctx.fill();

    this.ctx.fillStyle = w2.fillColor;
    this.ctx.beginPath();
    this.ctx.moveTo(w2.xpos, w2.ypos);
    this.ctx.lineTo(w2.x2pos, w2.y2pos);
    this.ctx.lineTo(w1.xpos, w1.ypos);
    // this.ctx.lineTo(w2.xpos, w2.ypos);


    this.ctx.fill();

  };


///////////////////////////////////////////////////////////////////////////////////////////
//about time to make my own JS library of canvas hax.
//about time to learn radians/degrees too.
//about time for a lotta things.
//about time to see if there is javascript perlin noise
//duh there has to be there is JSeverything.
//OPTIONS HASH YO!
  var randomWalker = root.randomWalker = function(fillColor, elSize, w, h, x, y){
    this.fillColor = fillColor;
    this.elSize = elSize;
    this.dirs = [-1, 0, 1];
    this.w = w;
    this.h = h;
    if (x === undefined || y === undefined){
      this.xpos = Math.floor(Math.random() * w);
      this.ypos = Math.floor(Math.random() * h);
    } else {
      this.xpos = x;
      this.ypos = y;
    }

    this.setRandomDirection();
    this.move();//so x2y2 get set. it's lame, i know.
  };

  randomWalker.prototype.move = function(){

//random random
    // this.xpos += this.dirs.sample();
    // this.ypos += this.dirs.sample();

//liney random
    this.xpos += this.xdir;
    this.ypos += this.ydir;
    this.x2pos = this.xpos + this.xdir * this.elSize;
    this.y2pos = this.ypos + this.ydir * this.elSize;


    if (this.xpos < 0 || this.xpos > this.w){
      this.xdir *= -1;

    }
    if (this.ypos < 0 || this.ypos > this.h){
      this.ydir *= -1;
    }
    //IF X OR Y IS OUTTA BOUNDS, BOUNCE BACK OR REAPPEAR
  };

  randomWalker.prototype.setRandomDirection = function(){
    this.xdir = this.dirs.sample();
    this.ydir = this.dirs.sample();
    if(this.xdir === 0 && this.ydir === 0){
      this.setRandomDirection();
    }
  };

  randomWalker.prototype.mark = function(ctx){
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.beginPath();
    ctx.arc(this.xpos, this.ypos, 5, 0, 2 * Math.PI, false);
    ctx.fill();
    //DRAW TO CTX. MAYBE ERASE TOO. WHATEVER.
    //maybe the walker walks and another thing takes its values to draw? ehhhh
  };

  randomWalker.prototype.intersectsWith = function(otherWalker){
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
