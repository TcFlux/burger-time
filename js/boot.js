const BurgerBarrage = BurgerBarrage || {};

BurgerBarrage.Boot = function(){};

BurgerBarrage.Boot.prototype = {
  preload: function() {
    //loading message
  },
  create: function() {
    this.game.stage.backgroundColor = '#fff';
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.physics.startSystem(Phaser.Physics.Arcade);
    this.state.start('Preload');
  }
}