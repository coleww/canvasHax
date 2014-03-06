(function(root){
  var imagePlayer = root.imagePlayer = (root.imagePlayer || {});

  PlayerUI = imagePlayer.PlayerUI = function(player){
    this.player = player;
    this.installListeners();
    this.installDrawListeners();
    this.installSlitListeners();
  };

  PlayerUI.prototype.installListeners = function() {
    var that = this.player;
    $("input:radio[name=loop-type]").change(function(e) {
      e.preventDefault();
      that.loopType = $(event.target).val();
      $("#slit-opts").toggleClass("hide");
      $("#draw-opts").toggleClass("hide");
      that.drawNewImage(that.img);
    });

    $("#save").click(function(e) {
      e.preventDefault();
      that.saveImage();
    });

    $("#gif").click(function(e) {
      e.preventDefault();
      that.createGIF();
    });

    $('#imageLoader').change(function(e) {
      e.preventDefault();
      that.handleImage(e);
    });
  };

  PlayerUI.prototype.installDrawListeners = function() {
    var that = this.player;
    $("#alpha").change(function(e) {
      that.alpha = $(e.target).val();
    });

    $("#shape-size").change(function(e) {
      that.elementSize = $(e.target).val();
    });

    $("#shape-move").change(function(e) {
      that.distance = $(e.target).val();
    });

    $("#num-shapes").change(function(e) {
      that.numElements = $(e.target).val();
    });

    $("input:radio[name=start-position]").change(function(e) {
      e.preventDefault();
      that.elementStart = $(event.target).val();
    });

    $("input:radio[name=stroke-type]").change(function(e) {
      e.preventDefault();
      that.strokeType = $(event.target).val();
    });
  };

  PlayerUI.prototype.installSlitListeners = function() {
    var that = this.player;
    $("#line-alpha").change(function(e) {
      that.alpha = $(e.target).val();
    });

    $("#line-width").change(function(e) {
      that.lineWidth = $(e.target).val();
    });

    $("input:radio[name=line-type]").change(function(e) {
      e.preventDefault();
      that.slitType = $(e.target).val();
    });
  };
})(this);



