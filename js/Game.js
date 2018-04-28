var BurgerBarrage = BurgerBarrage || {};

BurgerBarrage.Game = function(){};

const startingInventory = {
  uncookedMeat: false,
  lettuce: false,
  cheese: false,
  ketchup: false,
  bun: false,
  cookedMeat: false,
  cookPercent: 0,
  pokeball: false
};

const generateBool = () => {
  if (Math.round(Math.random())) {
    return true;
  } else {
    return false;
  }
}
const powerUps = ['pokeball', 'health']

const randomX = () => (Math.random() * 544 + 32);

const randomY = () => (Math.random() * 320 + 96);

let bouncy = false;
const bouncify = () => {
  bouncy = true;
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
    //hp
    this.HP = 100;

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

    //enemies
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;

    //player  controls
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.cursors.space = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.cursors.w = this.input.keyboard.addKey(Phaser.Keyboard.W);
    this.cursors.a = this.input.keyboard.addKey(Phaser.Keyboard.A);
    this.cursors.s = this.input.keyboard.addKey(Phaser.Keyboard.S);
    this.cursors.d = this.input.keyboard.addKey(Phaser.Keyboard.D);

    //projectiles
    this.projectiles = this.game.add.group();
    this.projectiles.enableBody = true;
    this.game.physics.arcade.enable(this.projectiles);
  },
  generateRandomPowerUp: function(){
    this.items.create(randomX(), randomY(), powerUps[Math.floor(Math.random() * powerUps.length)])
  },
  createEnemy: function(){
    const enemy = this.enemies.create(randomX(), randomY(), 'creepyGuy');
    this.game.physics.arcade.enable(enemy);
    enemy.body.velocity.setTo(100, 100);
    enemy.body.bounce.set(1);
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
      ketchup: this.inventoryIcons.children[4],
      pokeball: this.inventoryIcons.children[6]
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
  collect: function(player, item){
    const name = item.key;
    if (name === 'health') {
      item.destroy();
      this.HP += 15;
    }
    else if (!this.inventory[name]) {
      if (name === 'uncookedMeat' && this.inventory.cookedMeat === true) {
      //do nothing
      } else {
        this.inventory[name] = true;
        this.invIcons[name].visible = true;
        if (name === 'pokeball') {
          item.destroy();
        }
      }
    }
  },
  dropBurger: function(){
    if (this.checkObjEquality(this.inventory, this.goal)) {
      this.inventory = {...startingInventory};
      this.hideIcons(this.inventoryIcons);
      this.points += 100;
      console.log(this.points);
      this.generateGoal();
      this.createEnemy();
      this.generateRandomPowerUp();
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
      this.cookingBar.width = 0;
      this.hideIcons(this.inventoryIcons);
    }
  },
  takeDamage() {
    this.HP--;
    console.log('HP:', this.HP);
    if (this.HP === 0) {
      alert(`GAME OVER!!!! Your score was ${this.points}`)
    }
  },
  throw: function(){
    if (this.inventory.pokeball){
      this.inventory.pokeball = false;
      this.invIcons.pokeball.visible = false;
      const pokeball = this.projectiles.create(this.player.x, this.player.y, 'pokeball');
      this.game.physics.arcade.enable(pokeball);
      this.game.physics.arcade.moveToPointer(pokeball, 300);
      setTimeout(() => {
        pokeball.destroy();
      }, 3000);
    }
  },
  enemyHit: function(enemy, projectile){
    enemy.destroy();
    projectile.destroy();
  },
  destroyProjectile: function(projectile, layer){
    console.log(projectile)
    console.log(layer)
    projectile.destroy();
  },
  update: function(){
    //Movement
    let speedX = 0;
    let speedY = 0;
    if (this.cursors.w.isDown) {
      speedY -= 100;
    }
    if (this.cursors.s.isDown) {
      speedY += 100;
    }
    if (this.cursors.a.isDown) {
      speedX -= 100;
    }
    if (this.cursors.d.isDown) {
      speedX += 100;
    }
    if (this.game.input.activePointer.isDown) {
      this.throw();
    }
    this.player.body.velocity.y = speedY * multiplier;
    this.player.body.velocity.x = speedX * multiplier;
    //player collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    //enemy collisions with walls
    this.game.physics.arcade.collide(this.enemies, this.blockedLayer);
    //pokeball with enemies
    this.game.physics.arcade.collide(this.enemies, this.projectiles, this.enemyHit, null, this);
    //pokeball with walls
    // this.game.physics.arcade.collide(this.projectiles, this.blockedLayer, this.destroyProjectile, null, this);
    //Pickup items
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    //drop burger in hole
    this.game.physics.arcade.overlap(this.player, this.hole, this.dropBurger, null, this);
    //cook dat meat
    this.game.physics.arcade.overlap(this.player, this.stove, this.cookMeat, null, this);
    //Garbage!!!
    this.game.physics.arcade.overlap(this.player, this.trash, this.trashInventory, null, this);
    //Ouch!
    this.game.physics.arcade.overlap(this.player, this.enemies, this.takeDamage, null, this);
    //Bouncy
    if (bouncy) {
      this.game.physics.arcade.collide(this.player, this.enemies, this.takeDamage, null, this);
    }
    //enemy bounce
    if (this.points > 500) {
      this.game.physics.arcade.collide(this.enemies, this.enemies);
    }
  },
};
