var BurgerBarrage = BurgerBarrage || {};

BurgerBarrage.Game = function(){};

const spaceBarListener = 

BurgerBarrage.Game.prototype = {
  create: function(){
    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('tiles', 'gameTiles');
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');
    this.map.setCollisionBetween(1, 200, true, 'blockedLayer');
    this.backgroundLayer.resizeWorld();
    this.inventory = {};
    //create items
    this.createItems()
    
    //create hole
    const holeObj = this.findObjectsByType('hole', this.map, 'objectsLayer');
    this.hole = this.game.add.sprite(holeObj[0].x - 12, holeObj[0].y - 34, 'hole');
    this.game.physics.arcade.enable(this.hole);
    console.log(this.hole);

    //player
    const playerObj = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
    this.player = this.game.add.sprite(playerObj[0].x, playerObj[0].y, 'player');
    this.game.physics.arcade.enable(this.player);
    
    //player  controls
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.cursors.space = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  createItems: function() {
    //create items
    this.items = this.game.add.group();
    this.items.enableBody = true;
    let item;    
    let result = this.findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.items);
    }, this);
  },
  findObjectsByType: function(type, map, layer){
    const result = [];
    map.objects[layer].forEach((element) => {
      if (element.properties.type === type) {
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  },
  createFromTiledObject: function(element, group){
    const sprite = group.create(element.x, element.y, element.properties.sprite);
    Object.keys(element.properties).forEach((key) => {
      sprite[key] = element.properties[key];
    })
  },
  update: function(){
    //Movement
    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;
    if (this.cursors.up.isDown) {
      this.player.body.velocity.y -= 100;
    }
    if (this.cursors.down.isDown) {
      this.player.body.velocity.y += 100;
    }
    if (this.cursors.left.isDown) {
      this.player.body.velocity.x -= 100;
    }
    if (this.cursors.right.isDown) {
      this.player.body.velocity.x += 100;
    }
    if (this.cursors.space.isDown) {
      this.player.body.velocity.y *= 2;
      this.player.body.velocity.x *= 2;
    }
    //player collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    //Pickup items
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    //drop burger in hole
    this.game.physics.arcade.overlap(this.player, this.hole, this.dropBurger, null, this);
  },
    collect: function(player, item){
      const name = item.key;
      if (!this.inventory[name]) {
        this.inventory[name] = true
        console.log('INVENTORY', this.inventory)
        item.destroy();
      }
    },
    dropBurger: function(player, hole){
      //
      console.log("nc")
    }
};
