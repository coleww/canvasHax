var v = document.querySelector("#videoElement");

navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia ||
                         navigator.oGetUserMedia;

if (navigator.getUserMedia) {
  navigator.getUserMedia({video: true}, function(stream) {
    v.src = window.URL.createObjectURL(stream);
  },
  function(errors) {
    console.log(errors, "wat");
  });
}

$(function(){
  var hiddenCanvas = document.getElementById("hiddencanvas");
  var hiddenContext = hiddenCanvas.getContext("2d");
  var w = hiddenCanvas.width;
  var h = hiddenCanvas.height;

  $("#picturebtn").on("click", function(){
    hiddenContext.drawImage(v, 0,0, w, h);
    var pixeldata = hiddenContext.getImageData(0, 0, w, h).data;

    $("#pixelContainer").empty();

    for(var i = 0; i < pixeldata.length; i+=20){
      var r = pixeldata[i];
      var g = pixeldata[i + 1];
      var b = pixeldata[i + 2];
      var color = "rgb(" + r + "," + g + "," + b + ")";
      var pixel = $("<div class='pixel'></div>");
      pixel.addClass("pixel").css("background-color", color);
      $("#pixelContainer").append(pixel);
    }
  });
});
