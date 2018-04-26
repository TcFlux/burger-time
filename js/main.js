var BurgerBarrage = BurgerBarrage || {};

BurgerBarrage.game = new Phaser.Game(800, 600, Phaser.AUTO, '');
 
BurgerBarrage.game.state.add('Boot', BurgerBarrage.Boot);
BurgerBarrage.game.state.add('Preload', BurgerBarrage.Preload);
BurgerBarrage.game.state.add('Game', BurgerBarrage.Game);
 
BurgerBarrage.game.state.start('Boot');