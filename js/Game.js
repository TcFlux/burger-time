var BurgerBarrage = BurgerBarrage || {};

BurgerBarrage.Game = function(){};

BurgerBarrage.Game.prototype = {
  create: function(){
    console.log("this.map")
    this.map = this.game.add.tilemap('map');
    console.log("this.map")
    this.map.addTilesetImage('interior', 'gameTiles');
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');
    this.map.setCollisionBetween(1, 200, true, 'blockedLayer');
    this.backgroundlayer.resizeWorld();
  }
};
