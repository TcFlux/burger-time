var BurgerBarrage = BurgerBarrage || {};

BurgerBarrage.Game = function(){};

const startingInventory = {
  uncookedMeat: false,
  lettuce: false,
  cheese: false,
  ketchup: false,
  bun: false,
  cookedMeat: false,
  cookPercent: 0
};

const generateBool = () => {
  if (Math.round(Math.random())) {
    return true;
  } else {
    return false;
  }
}
BurgerBarrage.Game.prototype = {
  create: function(){
    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('tiles', 'gameTiles');
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');
    this.map.setCollisionBetween(1, 200, true, 'blockedLayer');
    this.backgroundLayer.resizeWorld();
    //points
    this.points = 0;

    //initialize inventory
    this.inventory = {...startingInventory};
    //create items
    this.createItems();
    
    //create inventory icons
    this.createInventoryIcons();
    //create goal icons
    this.createGoalIcons();
    //starting goal
    this.goal = {}
    this.generateGoal();
    
    //create hole
    this.createHole();

    //create stove
    const stoveObj = this.findObjectsByType('stove', this.map, 'objectsLayer');
    this.stove = this.game.add.sprite(stoveObj[0].x, stoveObj[0].y, 'stove');
    this.game.physics.arcade.enable(this.stove);

    //create trash
    const trashObj = this.findObjectsByType('trash', this.map, 'objectsLayer');
    this.trash = this.game.add.sprite(trashObj[0].x, trashObj[0].y, 'trash');
    this.game.physics.arcade.enable(this.trash);

    //create cooking bar
    const cookingBarObj = this.findObjectsByType('cookingBar', this.map, 'objectsLayer');
    this.cookingBar = this.game.add.sprite(cookingBarObj[0].x, cookingBarObj[0].y, 'cookingBar');
    this.cookingBarWidthRatio = this.cookingBar.width/100;
    this.cookingBar.width = 0;

    //player
    const playerObj = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
    this.player = this.game.add.sprite(playerObj[0].x, playerObj[0].y, 'player');
    this.game.physics.arcade.enable(this.player);
    
    //player  controls
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.cursors.space = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  createHole: function(){
    const holeObj = this.findObjectsByType('hole', this.map, 'objectsLayer');
    this.hole = this.game.add.sprite(holeObj[0].x - 12, holeObj[0].y - 34, 'hole');
    this.game.physics.arcade.enable(this.hole);
  },
  createItems: function() {
    //create items
    this.items = this.game.add.group();
    this.items.enableBody = true;
    let result = this.findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.items);
    }, this);
  },
  createInventoryIcons: function(){
    this.inventoryIcons = this.game.add.group();
    this.inventoryIcons.enableBody = true;
    let result = this.findObjectsByType('inventoryIcon', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.inventoryIcons);
    }, this);
    this.hideIcons(this.inventoryIcons);
    this.invIcons = {
      bun: this.inventoryIcons.children[0],
      uncookedMeat: this.inventoryIcons.children[1],
      cookedMeat: this.inventoryIcons.children[5],
      lettuce: this.inventoryIcons.children[3],
      cheese: this.inventoryIcons.children[2],
      ketchup: this.inventoryIcons.children[4]
    }
  },
  hideIcons: function(iconSet){
    iconSet.children.forEach(item => {item.visible = false})
  },
  createGoalIcons: function(){
    this.goalIcons = this.game.add.group();
    this.goalIcons.enableBody = true;
    let result = this.findObjectsByType('goalIcon', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.goalIcons);
    }, this);
    this.hideIcons(this.goalIcons);
    this.goalIconsObj = {
      bun: this.goalIcons.children[0],
      cookedMeat: this.goalIcons.children[1],
      lettuce: this.goalIcons.children[3],
      cheese: this.goalIcons.children[2],
      ketchup: this.goalIcons.children[4]
    }
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
    let speedX = 0;
    let speedY = 0;
    if (this.cursors.up.isDown) {
      speedY -= 100;
    }
    if (this.cursors.down.isDown) {
      speedY += 100;
    }
    if (this.cursors.left.isDown) {
      speedX -= 100;
    }
    if (this.cursors.right.isDown) {
      speedX += 100;
    }
    
    if (this.cursors.space.isDown) {
      //Power up!!!!
    }
    this.player.body.velocity.y = speedY * multiplier;
    this.player.body.velocity.x = speedX * multiplier;
    //player collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    //Pickup items
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    //drop burger in hole
    this.game.physics.arcade.overlap(this.player, this.hole, this.dropBurger, null, this);
    //cook dat meat
    this.game.physics.arcade.overlap(this.player, this.stove, this.cookMeat, null, this);
    //Garbage!!!
    this.game.physics.arcade.overlap(this.player, this.trash, this.trashInventory, null, this);
  },
    collect: function(player, item){
      const name = item.key;
      if (!this.inventory[name]) {
        if (name === 'uncookedMeat' && this.inventory.cookedMeat === true) {
        //do nothing
        } else {
          this.inventory[name] = true;
          this.invIcons[name].visible = true;
        }
        // item.destroy();
      }
    },
    dropBurger: function(){
      if (this.checkObjEquality(this.inventory, this.goal)) {
        this.inventory = {...startingInventory};
        this.hideIcons(this.inventoryIcons);
        this.points += 100;
        console.log(this.points);
        this.generateGoal();
      }
    },
    cookMeat: function(){
      if (this.inventory.uncookedMeat) {
        this.inventory.cookPercent++;
        this.cookingBar.width = this.cookingBarWidthRatio * this.inventory.cookPercent;
        if (this.inventory.cookPercent > 100) {
          this.inventory.uncookedMeat = false;
          this.inventory.cookedMeat = true;
          this.inventory.cookPercent = 0;
          this.cookingBar.width = 0;
          this.invIcons.uncookedMeat.visible = false
          this.invIcons.cookedMeat.visible = true
        }
      }
    },
    generateGoal: function(){
      this.goal = {
        lettuce: generateBool(),
        cheese: generateBool(),
        ketchup: generateBool(),
        bun: true,
        cookedMeat: true
      }
      for (var ingredient in this.goal){
        if (this.goal.hasOwnProperty(ingredient)){
          this.goal[ingredient] ? this.goalIconsObj[ingredient].visible = true : this.goalIconsObj[ingredient].visible = false;
        }
      }
    },
    checkObjEquality: function(inventory, goal){
      for (var ingredient in goal) {
        if (inventory[ingredient] !== goal[ingredient]) {
          return false
        }
      }
      return true;
    },
    trashInventory: function(){
      if (!this.checkObjEquality(this.inventory, startingInventory)) {
        this.inventory = {...startingInventory};
        this.hideIcons(this.inventoryIcons);
      }
    }
};
