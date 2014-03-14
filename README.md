# Abstract Image Player

A Javascript art app.

You can [play with it](http://coleww.github.io/canvasHax/),
or check out this node bot which uses the code to [post GIFs to Tumblr](http://www.gif-ebooks.tumblr.com).

!["art"](./example.gif)

TODO: pixelator mode.

TO RUN IT:
0. change "/canvasHax/images/" to "/images/" on line 28 of imagePlayer.js
0. npm install
0. grunt concat
0. grunt uglify:js
0. grunt cssmin:css

* imagePlayerUI jQueries the dom UI to the player and it's modes.
* imageSaver handles the save events
* imagePlayer loads images, grabs their pixels, and starts an interval which passes the pixels to one of the modes for rendering each turn.
* each mode takes a ctx, width, and height of a canvas as it's constructor arguments, and it also has a playLoop function which takes pixels and draws to the canvas. beyond that each mode decides what to draw differently and makes certain paramters open to user control.
* pixel, and pixelArray abstract a bit of the awfulness of working with pixel data from the canvas, and randomWalker just randomly walks. eventually they will get namespaced into a library of my most used canvas hacks, along with anything else I can abstract out of this project.
