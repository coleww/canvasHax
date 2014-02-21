# Abstract Image Player

A Javascript app that takes an image, picks a random pixel from the image, gets the color value of that pixel, then draws some colored shapes, and then repeats the process.

Can draw from the original position of the pixel, from the center, or from a random location.

Draws circles, squares, random quadrilaterals, or lines.

Default settings will draw an approximation of the original image, but if you push the settings around it has some interesting effects.

User can save a frame of the image, or create an animated gif.

[Play with it](http://coleww.github.io/canvasHax/)


TODO:

Slit Scan mode: add vertical/horizontal selector, stroke width...?

Improve GUI so it swaps between drawing shapes and drawing slits
--thus also tweak the imagePlayer code so that it keeps a copy of the current image
--Backbone? or just some jQuery spaghetti...
--OH DUH 2 menus which have css toggles for visibility and which reboot the image player thing on click.

SHAPES: draw triangles.
