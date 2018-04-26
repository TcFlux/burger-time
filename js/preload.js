var BurgerBarrage = BurgerBarrage || {};

BurgerBarrage.Preload = function(){};

BurgerBarrage.Preload.prototype = {
  preload: function() {
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.tilemap('map', 'assets/tilemaps/Map.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('gameTiles', 'assets/tilemaps/tiles.tsx')
    this.load.image('cheese', 'assets/images/cheese.png')
    this.load.image('lettuce', 'assets/images/lettuce.png')
    this.load.image('ketchup', 'assets/images/ketchup.png')
    this.load.image('uncookedMeat', 'assets/images/uncookedMeat.png')
    this.load.image('cookedMeat', 'assets/images/cookedMeat.png');
  },
  create: function(){
    this.state.start('Game');
  }
};

