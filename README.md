# Abstract Image Player

A Javascript app that takes an image, picks a random pixel from the image, gets the color value of that pixel, then draws some colored shapes, and then repeats the process.

Can draw from the original position of the pixel, from the center, or from a random location.

Draws circles, squares, random quadrilaterals, or lines.

Default settings will draw an approximation of the original image, but if you push the settings around it has some interesting effects.

User can save a frame of the image, or create an animated gif.

[Play with it](http://coleww.github.io/canvasHax/)

This code is also used by a node bot which [posts to Tumblr](http://www.gif-ebooks.tumblr.com)



TODO/BUGS/TECHNICAL DEBT:

getFill is the only logic shared between shapes and slit mode ATM.
-do inheritance once a third mode is added.
-check modes for potential abstractions.

UI listener installation is kind of horrendous?

Abstract away any magic numbers that were hardcoded. Should work same no matter what canvas w/h are.

SHAPES: draw triangles...octagons...ummm....

IMAGES: improve the default group of images. Go for maximum variety of colors/etc. LOW FILE SIZE!

shapesMode: LINES: set ctx.lineWidth to be a remapping of size to ???

SLITS: converge mode. Fix the weird vetruvian man thing. Shuffle up which corner gets drawn when?

ERROR: figure out why the node bot sometimes creates non animated gifs (random origin setting is a likely culprit)
//Is the node bot just making >1mb images or something?

ADD STYLING TO THE PAGE WTF
