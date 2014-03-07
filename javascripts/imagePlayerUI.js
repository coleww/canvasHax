(function(root){
  var imagePlayer = root.imagePlayer = (root.imagePlayer || {});

  PlayerUI = imagePlayer.PlayerUI = function(player, saver){
    this.player = player;
    this.saver = saver;
    //should this be here? prbly not?
    //though one method that does all listeners,
    //its basically a factory?
    this.installListeners();
    this.installObjectListeners(player.modes.shapes);
    this.installSlitListeners(player.modes.slits);
  };

  PlayerUI.prototype.installListeners = function() {
    var player = this.player;
    var saver = this.saver;
    $("input:radio[name=loop-type]").change(function(e) {
      e.preventDefault();
      player.loopType = $(event.target).val();
      $("#slit-opts").toggleClass("hide");
      $("#draw-opts").toggleClass("hide");
      player.drawNewImage(player.img);
    });

    $("#save").click(function(e) {
      e.preventDefault();
      saver.saveImage();
    });

    $("#gif").click(function(e) {
      e.preventDefault();
      saver.createGIF();
    });

    $('#imageLoader').change(function(e) {
      e.preventDefault();
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
      e.preventDefault();
      shapeMode.settings.elementStart = $(event.target).val();
    });

    $("input:radio[name=stroke-type]").change(function(e) {
      e.preventDefault();
      shapeMode.settings.strokeType = $(event.target).val();
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
      e.preventDefault();
      slitMode.settings.slitType = $(e.target).val();
    });
  };
})(this);
