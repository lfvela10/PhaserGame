// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var won = false;
var currentScore = 0;
var winningScore = 100;
var background;
var blackholeCount = 0;
var timer = 20;
var kyloScore;
var reloadButton;


// create a single animated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
} // ends create function

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  // saber at center
  createItem(425, 300, 'lightsaber');
  //m-left   lr    du
  createItem(130, 358, 'lightsaber');
  //m left
  createItem(200, 370, 'blackhole');
  //l left
  createItem(130, 510, 'blackhole');
  // l - l center
  createItem(350, 480, 'kylo');
  //center
  createItem(390, 200, 'blackhole');
  //lower right
  createItem(500, 370, 'blackhole');
  //top left
  createItem(200, 00, 'lightsaber');
  //top middle
  createItem(600, 10, 'lightsaber');
  //middleRight
  createItem(700, 300, 'lightsaber');
    
    
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  // top left       x    y
  platforms.create(130, 120, 'platform');
    //top right
  platforms.create(550, 165, 'platform');
    //right and away
  platforms.create(800, 320, 'platform1');
  platforms.create(650, 440, 'platform1');
  platforms.create(100, 450, 'platform1');
  platforms.setAll('body.immovable', true);
    
}



// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(600, 400, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
  
}

// when the player collects an item on the screen
function itemHandler(player, item) {
  item.kill();
  if (item.key === 'blackhole')
      {
        blackholeCount++;
      }
  else if (item.key === 'lightsaber') 
      {
          currentScore = currentScore + 20;
      }
  else if (item.key === 'kylo') 
     {
        kyloScore = Math.floor(Math.random() * (200 - (-100) + 1)) + (-100);
         
         if(kyloScore < 0)
             {
                 blackholeCount = 3;
                 player.visible = false;
                 losingMessage.text = "Chose the dark side, you did.";
                 items.visible = false;
                 
             }
         else if(kyloScore > 100)
             {
                currentScore = winningScore;
                
             }
     }
    
    
    if (currentScore === winningScore) 
        {
            createBadge();
           
        }
  
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(900, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
  
  // before the game begins
  function preload() {
   
   game.load.image('background', 'space.jpg');
      
    
    
    //Load images
    game.load.image('platform', 'TheMoon.png');
    game.load.image('platform1', 'laser.png');
    
    //Load spritesheets
    game.load.spritesheet('player','littleBuddy.png', 85, 85);
    game.load.spritesheet('lightsaber', 'lightsaber.png',96, 94);
    game.load.spritesheet('blackhole', 'blackhole2.png', 127, 78);
    game.load.spritesheet('badge', 'badge.png', 160, 160);
    game.load.spritesheet('kylo', 'kylosaber.png', 96,92);
      
       
  }

  // initial game set up
  function create() {
      
    background = game.add.tileSprite(0, 0, 900, 600, 'background');
    player = game.add.sprite(50, 600, 'player');
    player.animations.add('walk');
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;
    game.state.add('Boot', game.Boot);
   
    addItems();
    addPlatforms();
   

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "#FFFF00" });
    
    losingMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "#FFFF00" });
    winningMessage.anchor.setTo(0.5, 1);
    losingMessage.anchor.setTo(0.5, 1);
      
    
     
  }

  // while the game is running
  function update() {
      
    
    text.text = "SCORE: " + currentScore;
      
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = - 1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
    }
    
    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
      player.body.velocity.y = -400;
    }
    // when the player winw the game
    if (won) 
    {
       winningMessage.text = "BB-8 is on his way back\n      to the resistance!!!";
       player.visible = false;
       items.visible = false;
        
       if (jumpButton.isDown)
           {
               document.location.reload(true);
           }
    
        
    }
      if(blackholeCount == 3 && kyloScore >= 0)
      {
          player.visible = false;
          losingMessage.text = "You sent BB-8 through\ntoo many blackholes!!!";
          items.visible = false;
          
          if (jumpButton.isDown)
           {
               document.location.reload(true);
           }
          
      }
      
      if(kyloScore < 0)
        {
            if(jumpButton.isDown)
            {
               document.location.reload(true);
            }
        }
      
      
  }

  function render() {
    

  }

};
