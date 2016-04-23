/*App.js
 * This file contains class constructors, superclasses, subclasses
 * and instances that will create the different elements in the game
 * including player, enemies, collectible items, finish line (star)
 * and their corresponding methods.
 */

/**
 * Represents an Enemy
 * @constructor
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} speed - The enemy's speed
 * @param {string} axis  - axis on which the enemy will move
 */
var Enemy = function(x, y, speed, axis) {
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.axis = axis;
};

/**
 * Represents a Bug
 * @constructor
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} speed - The bug's speed
 * @param {string} axis  - axis on which the bug will move
 */
var Bug = function(x, y, speed, axis) {
	//Sprite
	if (axis == 'y') {
		this.sprite = 'images/enemy-bug-vertical.png';
	} else {
		this.sprite = 'images/enemy-bug-horizontal.png';
	}
	this.description = 'bug';
	//Call superclass
	Enemy.call(this, x, y, speed, axis);
};

//Delegate failed lookups in Bug.prototype to Enemy.prototype (Subclass prototype delegation)
Bug.prototype = Object.create(Enemy.prototype);

Bug.prototype.constructor= Bug;

/**
 * Represents a Spider
 * @constructor
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} speed - The spider's speed
 * @param {string} axis  - axis on which the spider will move
 */
var Spider = function(x, y, speed, axis) {
	this.sprite = 'images/spider.png';
	this.description = 'spider';
	//Call superclass
	Enemy.call(this, x, y, speed, axis);
};

//Delegate failed lookups in Spider.prototype to Enemy.prototype (Subclass prototype delegation)
Spider.prototype = Object.create(Enemy.prototype);

Spider.prototype.constructor= Spider;

/**
 * Represents a Snake
 * @constructor
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} speed - The snake's speed
 * @param {string} axis  - axis on which the snake will move
 */
var Snake = function(x, y, speed, axis) {
	this.sprite = 'images/snake-ver.png';
	this.description = 'snake';
	//Call superclass
	Enemy.call(this, x, y, speed, axis);
};

//Delegate failed lookups in Snake.prototype to Enemy.prototype (Subclass prototype delegation)
Snake.prototype = Object.create(Enemy.prototype);

Snake.prototype.constructor= Snake;

/**
 * Represents a Frog
 * @constructor
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} speed - The frog's speed
 * @param {string} axis  - axis on which the frog will move
 */
var Frog = function(x, y, speed, axis) {
	this.sprite = 'images/frog.png';
	this.description = 'frog';
	//Call superclass
	Enemy.call(this, x, y, speed, axis);
};

//Delegate failed lookups in Frog.prototype to Enemy.prototype (Subclass prototype delegation)
Frog.prototype = Object.create(Enemy.prototype);

Frog.prototype.constructor= Frog;


/**
 * Method to update the enemy's position to make it move on the canvas. First, it determines if
 * the enemy moves horizontally or vertically and then it updates the corresponding coordinate. If the enemy
 * reaches a specific breakpoint (>700px if it moves vertically and >900px if it moves horizontally)
 * it resets the enemy's location to its initial coordinates.
 * @param {number} dt - delta time between ticks to ensure the game runs at the same speed for all computers
 */
Enemy.prototype.update = function(dt) {
	var delta = this.speed * dt;

	if (this.axis == 'y') {
		this.y = this.y + delta;
		if (this.y > 700) {
			this.reset();
		}
	} else {
		this.x = this.x + delta;
		if (this.x > 900) {
			this.reset();
		}
	}
};

/**
 * Method to reset the enemy's coordinates once it reaches
 * the end of the canvas (vertically or horizontally)
 */
Enemy.prototype.reset = function() {
	if (this.axis == 'y') {
		this.y = 50;
	} else {
		this.x = 800;
	}
};

/**
 * Method to draw the enemy on the screen. If the enemy is a "bug",
 * keep its original width and height, if not, set a specific width (100px) and height (100px).
 */
Enemy.prototype.render = function() {
	if (this.description == 'bug') {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	} else {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 100, 100);
	}
};

//ENEMY INSTANCES

//Varying speeds for enemies
var slow = 60;
var medium = 90;
var fast = 180;


//Vertical enemies
var enemy1 = new Bug(0, 20, fast, 'y');        //First col
var enemy2 = new Snake(200, 160, medium, 'y'); //Third col
var enemy3 = new Spider(300, 40, fast, 'y');   //Fourth col

var enemy4 = new Frog(400, 60, medium, 'y');   //Fifth col
var enemy5 = new Snake(400, 370, medium, 'y'); //Fifth col
var enemy6 = new Spider(500, 50, slow, 'y');   //Sixth col
var enemy7 = new Bug(500, 380, slow, 'y');     //Sixth col
var enemy8 = new Frog(600, 60, fast, 'y');     //Seventh col
var enemy9 = new Bug(700, 80, slow, 'y');      //Eighth col

//Horizontal enemies
var enemy10 = new Bug(800, 10, slow, 'x');     //Up
var enemy11 = new Bug(800, 600, medium, 'x');  //Middle
var enemy12 = new Bug(800, 280, fast, 'x');    //Down

//Array containing all enemies
var allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8, enemy9, enemy10, enemy11, enemy12];


//PLAYER

/**
 * Represents a Player
 * @constructor
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
var Player = function(x, y) {
	this.sprite = 'images/ant.png';
	this.x = x;
	this.y = y;
};

/**
 * Method to update the player's location on the screen by updating its coordinates according to the speed
 * and checking that if it takes another step, it won't leave the canvas.
 * @param {string} key - The description of the key pressed on the keyboard
 * @param {number} speed - the player's speed in that particular terrain (stone, water, grass)
 */
Player.prototype.update = function(key, speed) {
	if (key == 'left') {
		if (this.x - speed > 0) {
			this.x -= speed;
		}
	} else if (key == 'right') {
		if (this.x + speed < 900) {
			this.x += speed;
		}
	} else if (key == 'up') {
		if (this.y - speed > 23) {
			this.y -= speed;
		}
	} else if (key == 'down') {
		if (this.y + speed < 700) {
			this.y += speed;
		}
	}
};

/**
 * Method to render player on the screen
 */
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 80, 100);
};

/**
 * Method to handle keyboard input and move the player around with varying speeds depending on the surface its in,
 * (stone, grass or water). Checks the input and then calls the player's update method to update
 * the character's location on the screen every time a key is pressed
 * @param {string} key - description of the key pressed on the keyboard
 * @param {number} currentLevel
 */
Player.prototype.handleInput = function(key, currentLevel) {
	//Varying player speeds according to the surface in the corresponding level
	var speed;
	//For level 1
	if (currentLevel == 1) {
		//Stone
		if (this.x > 50 && this.x < 220) {
			speed = 70;
		//Grass
		} else if (this.x > 350 && this.x < 550 || this.x > 600) {
			speed = 45;
		//Water
		} else {
			speed = 25;
		}
	//For level 2
	} else if (currentLevel == 2) {
		//Stone
		if (this.x > 60 && this.x < 170 || this.x > 240 && this.x < 450 || this.x > 520 && this.x < 650) {
			speed = 85;
		//Grass
		} else if (this.x < 60 || this.x > 450 && this.x < 520 || this.x > 650 && this.x < 850) {
			speed = 55;
		//Water
		} else {
			speed = 35;
		}
	//For level 3
	} else if (currentLevel == 3) {
		//Stone
		if (this.x < 30 || this.x > 250 && this.x < 450 || this.x > 800) {
			speed = 80;
		//Grass
		} else if (this.x > 30 && this.x < 250 || this.x > 800 && this.x < 900) {
			speed = 65;
		//Water
		} else {
			speed = 30;
		}
	}

	this.update(key, speed);
};

/**
 * Method to reset the player's coordinates.
 */
Player.prototype.reset = function() {
	this.x = 100;
	this.y = 650;
};

//PLAYER INSTANCE

//Create player instance
var player = new Player(100, 650);


// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down',
	};
	player.handleInput(allowedKeys[e.keyCode], level);
});

/**
 * Generates a random X coordinate withing a range
 * @returns {number} A random number between 50 (included) and 800 (excluded)
 */
var generateRandomCoordX = function() {
	return Math.random() * (800 - 50) + 50;
};

/**
 * Generates a random Y coordinate within a range
 * @returns {number} A random number between 50 (included) and 700 (excluded)
 */
var generateRandomCoordY = function() {
	return Math.random() * (700 - 50) + 50;
};

/**
* Generates a new Y coordinate within the top half of the canvas
* @returns {number} A random number between 90 and 180
*/
var generateRandomTopCoordY = function() {
	return Math.floor(Math.random() * (180 - 90 + 1)) + 90;
};

/**
* Generates a new Y coordinate within the bottom half of the canvas
* @returns {number} A random number between 400 and 450
*/
var generateRandomBottomCoordY = function() {
	return Math.floor(Math.random() * (450 - 400 + 1)) + 400;
};

//COLLECTIBLE ITEMS

/**
 * Represents a Collectible Item
 * @constructor
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
var CollectibleItem = function(x, y) {
	this.x = x;
	this.y = y;
};

/**
 * Method to render Collectible item on the screen
 */
CollectibleItem.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

/**
* Method to update a Collectible item's coordinates when the player collects them.
* It generates random X and Y coordinates and assigns it to the collectible item's
* X and Y coordinates.
*/
CollectibleItem.prototype.update = function() {
	this.x = generateRandomCoordX();
	this.y = generateRandomCoordY();
};


//LEAVES

/**
 * Represents a Leaf
 * @constructor
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
var Leaf = function(x, y) {
	this.sprite = 'images/leaf.png';
	this.description = 'leaf';
	this.width = 70;
	this.height = 70;
	//Call superclass
	CollectibleItem.call(this, x, y);
};

//Delegate failed lookups in Leaf.prototype to CollectibleItem.prototype (Subclass prototype delegation)
Leaf.prototype = Object.create(CollectibleItem.prototype);

Leaf.prototype.constructor= Leaf;

//Instantiate leaves
var leaf1 = new Leaf(170, 50);
var leaf2 = new Leaf(500, 120);
var leaf3 = new Leaf(720, 400);
var leaf4 = new Leaf(190, 510);
var leaf5 = new Leaf(10, 460);


//CHERRIES

/**
 * Represents a Cherry
 * @constructor
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
var Cherry = function(x, y) {
	this.sprite = 'images/cherry.png';
	this.description = 'cherry';
	this.width = 60;
	this.height = 70;
	//Call superclass
	CollectibleItem.call(this, x, y);
};

//Delegate failed lookups in Cherry.prototype to CollectibleItem.prototype (Subclass prototype delegation)
Cherry.prototype = Object.create(CollectibleItem.prototype);

Cherry.prototype.constructor= Cherry;

//Instantiate cherries
var cherry1 = new Cherry(300, 200);
var cherry2 = new Cherry(400, 300);

//GEM

/**
 * Represents a Gem
 * @constructor
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
var Gem = function(x, y) {
	this.sprite = 'images/Gem Blue.png';
	this.description = 'gem';
	this.width = 60;
	this.height = 100;
	//Call superclass
	CollectibleItem.call(this, x, y);
};

//Delegate failed lookups in Gem.prototype to CollectibleItem.prototype (Subclass prototype delegation)
Gem.prototype = Object.create(CollectibleItem.prototype);

Gem.prototype.constructor= Gem;

//Instantiate gems
var gem1 = new Gem(600, 600);
var gem2 = new Gem(200, 200);


//Array of all collectible items in the game to loop through and check for collisions
var allCollectibleItems = [leaf1, leaf2, leaf3, leaf4, leaf5, cherry1, cherry2, gem1, gem2];


//FINISH LINE (Star)

/**
 * Represents a Star
 * @constructor
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
var Star = function(x, y) {
	this.sprite = 'images/Star.png';
	this.x = x;
	this.y = y;
};

//Star coordinates (Constants)
var STARX = 806;
var STARY = 125;

//Instantiate star
var star = new Star(STARX, STARY);

/**
 * Method to render Star on the screen
 */
Star.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
