// Enemies our player must avoid
var Enemy = function(x, y, speed, axis) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed= speed;
    this.axis = axis;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    //A conditional to determine the correct sprite if the enemy moves 
    //vertically or horizontally
    if(axis=="y"){
        this.sprite = 'images/enemy-bug-vertical.png';
    }else{
        this.sprite = 'images/enemy-bug-horizontal.png';
    }    
    
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Determine if the enemy moves horizontally or vertically, and update the corresponding coordinate.
    // If the enemy reaches a specific coordinate (>700 if vertical and >900 if horizontal, 
    // then reset the enemy's coordinates)
    if(this.axis=="y"){
        this.y = this.y + (this.speed * dt);
        if(this.y > 700){
            this.reset();
        }
    }else{
        this.x = this.x + (this.speed * dt);
        if(this.x>900){
            this.reset();
        }
    }    
};

//Reset function for the enemies when they reach the end of the canvas
Enemy.prototype.reset = function(){
    if(this.axis=="y"){
        this.y = 50;
    }else{
        this.x = 800;
    }    
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.sprite = 'images/ant.png';
    this.x = x;
    this.y = y;
};

Player.prototype.update = function() {
    this.handleInput();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 80, 100);
};


Player.prototype.handleInput = function(key) {
    //Varying player speeds according to the surface in the corresponding level by changing the pixels
    var speed;
    //For level 1
    if(level==1){
        //Stone
        if(player.x>50 && player.x<220){ 
            speed= 50;
        //Grass
        }else if(player.x>350 && player.x<550 || player.x>600){ 
            speed= 25;
        //Water
        }else{ 
            speed= 15;
        }
    //For level 2
    }else if(speed==2){
        //Stone
        if(player.x>30 && player.x<125 || player.x>240 && player.x<450 || player.x>520 && player.x<650){
            speed= 45;
        //Grass
        }else if(player.x<30 || player.x>450 && player.x<520 || player.x>650 && player.x<850){
            speed=25;
        //Water
        }else{
            speed=15;
        }
    //For level 3
    }else{
        //Stone
        if(player.x<30 || player.x>250 && player.x<450 || player.x>800){
            speed= 50;
        //Grass
        }else if(player.x>30 && player.x<250 || player.x>800 && player<900){
            speed= 15;
        //Water
        }else{
            speed=9;
        }
    }

    //Handle input and if statements to check that the character doesn't leave the canvas
    if(key =="left"){
        if(!(this.x-speed<0)){ 
            this.x -= speed;
        }
    }else if(key == "right"){
        if(!(this.x+speed>900)){ 
            this.x += speed;
        }
    }else if(key =="up"){
        if(!(this.y-speed<20)){ 
            this.y -= speed;
        }
    }else if(key =="down"){
        if(!(this.y+speed>700)){ 
            this.y += speed;
        }
    };
};


//ENEMY INSTANCES

//Varying speeds for enemies
var slow= 20;
var medium= 60;
var fast= 150;

//Vertical enemies
var enemy1 = new Enemy(0, 20, fast, "y");       //First col
var enemy2 = new Enemy(200, 160, medium, "y");  //Third col
var enemy3 = new Enemy(300, 40, fast, "y");     //Fourth col

var enemy4 = new Enemy(400, 60, medium, "y");   //Fifth col
var enemy5 = new Enemy(400, 370, medium, "y");  //Fifth col
var enemy6 = new Enemy(500, 50, slow, "y");     //Sixth row
var enemy7 = new Enemy(500, 380, slow, "y");    //Sixth col
var enemy8 = new Enemy(600, 60, fast, "y");     //Seventh col
var enemy9 = new Enemy(700, 80, slow, "y");     //Eight col

//Horizontal enemies
var enemy10 = new Enemy(800, 10, slow, "x");    //Up
var enemy11 = new Enemy(800, 600, medium, "x"); //Middle
var enemy12 = new Enemy(800, 280, fast, "x");   //Down

//Array containing all enemies
var allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8, enemy9, enemy10, enemy11, enemy12];



//PLAYER INSTANCE

//Initial x and y coordinates
var initX= 100;
var initY= 650;

//Create player instance
var player = new Player(initX, initY);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


//Generate random coordinates
var generateRandomCoordX = function(){
    return Math.random()*(800-50)+50;
}

var generateRandomCoordY = function(){
    return Math.random()*(700-50) + 50;
}

//COLLECTIBLE ITEMS

//Superclass for collectible items (Using PseudoClassical Subclasses)
var CollectibleItem = function(x, y){
    this.x = x;
    this.y = y;
};

CollectibleItem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};


//LEAVES
var Leaf = function(x, y){
    this.sprite = 'images/leaf.png';
    this.description = "leaf";
    this.width = 70;
    this.height = 70;
    //Call superclass
    CollectibleItem.call(this, x, y);
};

//Delegate failed lookups in Leaf.prototype to CollectibleItem.prototype (Subclass prototype delegation)
Leaf.prototype = Object.create(CollectibleItem.prototype);

//Instanciate leaves
var leaf1 = new Leaf(170, 50);
var leaf2 = new Leaf(500,120);
var leaf3 = new Leaf(720,400);
var leaf4 = new Leaf(190, 510);
var leaf5 = new Leaf(10, 460);


//CHERRIES
var Cherry = function(x, y){
    this.sprite = 'images/cherry.png';
    this.description = "cherry";
    this.width = 60;
    this.height = 70;
    //Call superclass
    CollectibleItem.call(this, x, y);
};

//Delegate failed lookups in Cherry.prototype to CollectibleItem.prototype (Subclass prototype delegation)
Cherry.prototype = Object.create(CollectibleItem.prototype);

//Instanciate cherries
var cherry1 = new Cherry(300,200);
var cherry2 = new Cherry(400, 300);

//GEM
var Gem = function(x, y) {
    this.sprite = 'images/Gem Blue.png';
    this.description = "gem";
    this.width = 60;
    this.height = 100;
    //Call superclass
    CollectibleItem.call(this, x, y);
};

//Delegate failed lookups in Gem.prototype to CollectibleItem.prototype (Subclass prototype delegation)
Gem.prototype = Object.create(CollectibleItem.prototype);

//Instantiate gem
var gem1= new Gem(600,600);
var gem2= new Gem(200,200);


//General array of all collectible items in the game to loop through and check for collisions
var allCollectibleItems= [leaf1, leaf2, leaf3, leaf4, leaf5, cherry1, cherry2, gem1, gem2];


//FINISH LINE (Star)
var Star = function(x, y){
    this.sprite = 'images/Star.png';
    this.x = x;
    this.y = y;
};

//Star coordinates
var starX = 806;
var starY = 125;

//Instantiate star
var star = new Star(starX, starY);

Star.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};