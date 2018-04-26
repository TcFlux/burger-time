var BurgerBarrage = BurgerBarrage || {};

BurgerBarrage.Game = function(){};

BurgerBarrage.Game.prototype = {
  create: function(){
    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('tiles', 'gameTiles');
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');
    // this.map.setCollisionBetween([0, 200], true, 'blockedLayer', false);
    this.backgroundLayer.resizeWorld();
  }
};
