(function(root){
  var imagePlayer = root.imagePlayer = (root.imagePlayer || {});

  PlayerUI = imagePlayer.PlayerUI = function(player, saver){
    this.player = player;
    this.saver = saver;
    this.installListeners();
    this.installObjectListeners(player.modes.shapes);
    this.installSlitListeners(player.modes.slits);
    //better way to do this?
    //slightly better: create one method that installs all listeners?
  };

  PlayerUI.prototype.installListeners = function() {
    var player = this.player;
    var saver = this.saver;
    var $slitOpts = $("#slits-opts");
    var $shapesOpts = $("#shapes-opts");
    var $walkerOpts = $("#walkers-opts");

    $("input:radio[name=loop-type]").change(function(e) {
      var newType = $(e.target).val();
      player.loopType = newType;
      $slitOpts.addClass("hide");
      $shapesOpts.addClass("hide");
      $walkerOpts.addClass("hide");
      $("#" + newType + "-opts").removeClass("hide");
      //would running a case switch be faster than jquerying for the thing?
      player.drawNewImage(player.img);
      //LOD violations up in here :(
    });

    $("#save").click(function(e) {
      saver.saveImage();
    });

    $("#gif").click(function(e) {
      saver.createGIF();
    });

    $('#imageLoader').change(function(e) {
      player.handleImage(e);
    });
  };

  PlayerUI.prototype.installObjectListeners = function(shapeMode) {
    $("#alpha").change(function(e) {
      shapeMode.settings.alpha = $(e.target).val();
    });

    $("#shape-size").change(function(e) {
      shapeMode.settings.elementSize = $(e.target).val();
    });

    $("#shape-move").change(function(e) {
      shapeMode.settings.distance = $(e.target).val();
    });

    $("#num-shapes").change(function(e) {
      shapeMode.settings.numElements = $(e.target).val();
    });

    $("input:radio[name=start-position]").change(function(e) {
      shapeMode.settings.elementStart = $(e.target).val();
    });

    $("input:radio[name=stroke-type]").change(function(e) {
      shapeMode.settings.drawShape = $(e.target).val();
    });
  };

  PlayerUI.prototype.installSlitListeners = function(slitMode) {
    $("#line-alpha").change(function(e) {
      slitMode.settings.alpha = $(e.target).val();
    });

    $("#line-width").change(function(e) {
      slitMode.settings.lineWidth = $(e.target).val();
    });

    $("input:radio[name=line-type]").change(function(e) {
      slitMode.settings.slitType = $(e.target).val();
    });
  };
})(this);
