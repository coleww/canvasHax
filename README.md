# Abstract Image Player

A Javascript app that takes an image, picks a random pixel from the image, gets the color value of that pixel, then draws some colored shapes, and then repeats the process.

Can draw from the original position of the pixel, from the center, or from a random location.

Draws circles, squares, random quadrilaterals, or lines.

Default settings will draw an approximation of the original image, but if you push the settings around it has some interesting effects.

User can save a frame of the image, or create an animated gif.

[Play with it](http://coleww.github.io/canvasHax/)

The "brain" behind this app is also used by a node bot which [posts to Tumblr](http://www.gif-ebooks.tumblr.com)

TODO:

Split JS logic out into multiple files
Maybe move some of the drawing logic into a canvas library?
Abstract away any magic numbers that were hardcoded

SHAPES: draw triangles...octagons...ummm....
