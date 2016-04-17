/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
	/* Predefine the variables we'll be using within this scope,
	 * create the canvas element, grab the 2D context for that canvas
	 * set the canvas elements height/width and add it to the DOM.
	 */
	var doc = global.document,
		win = global.window,
		canvas = doc.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		lastTime;

	canvas.width = 1006;
	canvas.height = 905;
	doc.body.appendChild(canvas);

	//Lives counter
	var lives = 10;

	//Score counter
	var score = 0;

	//Initial Score for each level
	var scoreLevel1 = score; //For total score to update even during level 1
	var scoreLevel2 = 0;
	var scoreLevel3 = 0;

	//Declaring totalScore variable
	var totalScore;

	//Declaring variable for Minimum Score needed to pass the level
	var minScoreToPass;

	//Declaring variable for score left to collect to pass the level
	var scoreNeeded;

	//Check collision with finish line
	var starCollision = false;

	//Declare a level variable for the first level, and set it as a global variable
	global.level = 1;

	//Max Level
	var maxLevel = 3;


	/* This function serves as the kickoff point for the game loop itself
	 * and handles properly calling the update and render methods.
	 */
	function main() {
		/* Get our time delta information which is required if your game
		 * requires smooth animation. Because everyone's computer processes
		 * instructions at different speeds we need a constant value that
		 * would be the same for everyone (regardless of how fast their
		 * computer is) - hurray time!
		 */
		var now = Date.now(),
			dt = (now - lastTime) / 1000.0;

		/* Call our update/render functions, pass along the time delta to
		 * our update function since it may be used for smooth animation.
		 */
		update(dt);
		render();

		/* Set our lastTime variable which is used to determine the time delta
		 * for the next time this function is called.
		 */
		lastTime = now;

		/* Use the browser's requestAnimationFrame function to call this
		 * function again as soon as the browser is able to draw another frame.
		 */

		/* If statement to check if the game goes on, or if the player wins or loses. If the player
		 * still has lives left and it hasn't collided with the star, keep the game loop active.
		 * If the player still has lives, has collided with the star and reached the minimum score
		 * to pass the max level, execute youWin(). Otherwise, if the player has no lives left, execute gameOver().
		 */
		if (lives > 0 && starCollision === false) {
			//Still alive
			win.requestAnimationFrame(main);
		}else if (starCollision === true) {
			youWin();
		}else {
			gameOver();
		}
	}

	/* This function does some initial setup that should only occur once,
	 * particularly setting the lastTime variable that is required for the
	 * game loop and resets the player's coordinates
	 */
	function init() {
		player.reset();
		lastTime = Date.now();
		playInitSound();
		//Start game engine
		main();
	}

	/* This function is called by main (our game loop) and itself calls all
	 * of the functions which may need to update entity's data. Based on how
	 * you implement your collision detection (when two entities occupy the
	 * same space, for instance when your character should die), you may find
	 * the need to add an additional function call here. For now, we've left
	 * it commented out - you may or may not want to implement this
	 * functionality this way (you could just implement collision detection
	 * on the entities themselves within your app.js file).
	 */
	function update(dt) {
		updateEntities(dt);
		checkCollisions();
	}

	/* This is called by the update function and loops through all of the
	 * objects within your allEnemies array as defined in app.js and calls
	 * their update() methods. It will then call the update function for your
	 * player object. These update methods should focus purely on updating
	 * the data/properties related to the object. Do your drawing in your
	 * render methods.
	 */
	function updateEntities(dt) {
		//General function to update all counters
		countersUpdate();

		//Update each enemy in allEnemies Array
		allEnemies.forEach(function(enemy) {
			enemy.update(dt);
		});

		//Update player
		player.update();
	}

	//COLLISION DETECTION

	/**
	 * Checks collision between the player and enemies, collectible items and the finish line (Star).
	 * First, I make a box that surrounds the player and then execute three separate functions to check each collisions with each one.
	 */
	function checkCollisions() {

		var playerBox = {
			'x': player.x,
			'y': player.y,
			'width': 70,
			'height': 80
		};

		checkCollisionEnemy();
		checkCollisionStar();
		checkCollisionItems();

		//FUNCTIONS TO CHECK COLLISION

			//ENEMIES

		/**
		 * Checks collision between the player and enemies. A for loop checks each enemy in allEnemies array, creating a "box"
		 * that surrounds it and then checks if the conditions for collision with the player's box declared previously are true. Depending on the type
		 * of enemy the player collides with, lives will be subtracted from the counter (2 if it collides with a spider, 1 if it collides
		 * with any other type of enemy) and four points will be substracted from the score counter, but if the score counter will be negative,
		 * it sets it to 0. Then it resets the player's coordinates to where it started.
		 */
		function checkCollisionEnemy() {
			allEnemies.forEach(function(enemy) {
				var enemyBox = {
					'x': enemy.x,
					'y': enemy.y,
					'width': 40,
					'height': 40
				};

				if (enemyBox.x < playerBox.x + playerBox.width && enemyBox.x + enemyBox.width > playerBox.x && enemyBox.y < playerBox.y + playerBox.height && enemyBox.height + enemyBox.y > playerBox.y) {

					if (enemy.description == 'spider') {
						lives -= 2;
					} else {
						lives -= 1;
					}

					if (score - 4 >= 0) {
						score -= 4;
					} else if (score - 4 < 0) {
						score = 0;
					}

					player.reset();
				}
			});
		}

		//STAR

		/**
		 * Checks collision between the player and the Star. It creates a "box" that surrounds the star, then checks if the
		 * conditions for collision between the player's box and the star's box are true. If so, if the player is on level 1,
		 * and there is more than 1 level and the player reaches the minimum score to pass to the next level, plays a sound and
		 * executes a function to move on to the next level. Else, if the player is on the max level, collides with the star, and
		 * it reaches the minimum score to pass, it sets starCollision to true so the game engine will stop and execute youWin().
	 	 * Lastly, for both cases,it resets the player's coordinates.
		 */
		function checkCollisionStar() {

			var starBox = {
				'x': STARX,
				'y': STARY,
				'width': 40,
				'height': 80
			};

			if (starBox.x < playerBox.x + playerBox.width && starBox.x + starBox.width > playerBox.x && starBox.y < playerBox.y + playerBox.height && starBox.height + starBox.y > playerBox.y) {

				if (level >= 1 && level != maxLevel && score >= minScoreToPass) {
					playInitSound();
					nextLevel();
				} else if (level == maxLevel && score >= minScoreToPass) {
					starCollision = true;
				}
				player.reset();
			}
		}

		//COLLECTIBLE ITEMS

		/**
		 * Checks collision between the player and Collectible items. Creates a "box" that surrounds the collectible item,
		 * then it checks if the condition for collision between the player's box and the collectible item's box is true.
		 * Then, it sets some conditions to add score to the counter depending on the "description" attribute of the collectible
		 * item the player collided with (if its a leaf, adds 5 to the score, if its a cherry it adds 10 to the score,
		 * if its a gem it add 30 to the score) and finally, it executes the item's update method to update its coordinates to
		 * random X and Y coordinates.
		 */
		function checkCollisionItems() {
			allCollectibleItems.forEach(function(item) {
				//Box that surrounds gem
				var itemBox = {
					'x': item.x,
					'y': item.y,
					'width': 40,
					'height': 40
				};

				//Set condition for collision with collectible item
				if (itemBox.x < playerBox.x + playerBox.width && itemBox.x + itemBox.width > playerBox.x && itemBox.y < playerBox.y + playerBox.height && itemBox.height + itemBox.y > playerBox.y) {
					//If the item is a leaf, add 5 to the score
					if (item.description == 'leaf') {
						score += 5;
					//If its a cherry, add 10 to the score
					} else if (item.description == 'cherry') {
						score += 10;
					//If its a gem, add 30 to the score
					} else if (item.description == 'gem') {
						score += 30;
					}

					item.update();
				}
			});
		}
	}

	/* This function initially draws the "game level", it will then call
	 * the renderEntities function. Remember, this function is called every
	 * game tick (or loop of the game engine) because that's how games work -
	 * they are flipbooks creating the illusion of animation but in reality
	 * they are just drawing the entire screen over and over.
	 */
	function render() {

		var numRows = 9;
		var numCols = 10;
		var row, col;
		var colImages;

		//Layout of the tiles for each level
		if (level == 1) {
			colImages = [
				'images/water-block.png', //Water
				'images/stone-block.png', //Stone
				'images/stone-block.png', //Stone
				'images/water-block.png', //Water
				'images/grass-block.png', //Grass
				'images/grass-block.png', //Grass
				'images/water-block.png', //Water
				'images/grass-block.png', //Grass
				'images/grass-block.png', //Grass
				'images/grass-block.png', //Grass
			];

		} else if (level == 2) {
			colImages = [
				'images/grass-block.png', //Grass
				'images/stone-block.png', //Stone
				'images/water-block.png', //Water
				'images/stone-block.png', //Stone
				'images/stone-block.png', //Stone
				'images/grass-block.png', //Grass
				'images/stone-block.png', //Stone
				'images/grass-block.png', //Grass
				'images/grass-block.png', //Grass
				'images/water-block.png', //Water
			];
		} else if (level == 3) {
			colImages = [
				'images/stone-block.png', //Stone
				'images/grass-block.png', //Grass
				'images/grass-block.png', //Grass
				'images/stone-block.png', //Stone
				'images/stone-block.png', //Stone
				'images/water-block.png', //Water
				'images/water-block.png', //Water
				'images/water-block.png', //Water
				'images/grass-block.png', //Grass
				'images/stone-block.png', //Stone
			];
		}


		/* Loop through the number of rows and columns we've defined above
		 * and, using the colImages array, draw the correct image for that
		 * portion of the "grid"
		 */
		for (col = 0; col < numCols; col++) {
			for (row = 0; row < numRows; row++) {
				/* The drawImage function of the canvas' context element
				 * requires 3 parameters: the image to draw, the x coordinate
				 * to start drawing and the y coordinate to start drawing.
				 * We're using our Resources helpers to refer to our images
				 * so that we get the benefits of caching these images, since
				 * we're using them over and over.
				 */
				ctx.drawImage(Resources.get(colImages[col]), col * 101, row * 83);
			}
		}

		//General function to display all counters
		countersDisplay();

		renderEntities();
	}

	/* This function is called by the render function and is called on each game
	 * tick. Its purpose is to then call the render functions you have defined
	 * on your enemy and player entities within app.js
	 */
	function renderEntities() {
		/* Loop through all of the objects within the allEnemies array and call
		 * the render function you have defined.
		 */
		allEnemies.forEach(function(enemy) {
			enemy.render();
		});

		player.render();

		//For loop to render each item in allCollectibleItems array
		allCollectibleItems.forEach(function(item) {
			item.render();
		});

		//Render star (finish line)
		star.render();
	}

	//CUSTOM FUNCTIONALITY

	/**
	 * Function to handle everything related to moving on to the next level. It sets a variable for the current level's score
	 * depending on the level the player currently in. It adds 1 to the variable "level" so the tile layout will update.
	 * It sets the variable "score" for the new level to 0, then it checks each enemy in allEnemies array and if it moves
	 * vertically, it assigns it a new random Y coordinate. Then it checks if any pair of enemies are overlapping.
	 */
	function nextLevel() {

		if (level == 1) {
			scoreLevel1 = score;
		} else if (level == 2) {
			scoreLevel2 = score;
		} else if (level == 3) {
			scoreLevel3 = score;
		}

		level += 1;

		score = 0;

		allEnemies.forEach(function(enemy) {
			if (enemy.axis == 'y') {
				enemy.y = generateRandomCoordY();
			}
		});

		checkEnemiesOverlapping();

		/**
		 * Checks if enemies are overlapping after random Y coordinates are generated. It checks each enemy in allEnemies array.
		 * If the enemy is not the first in the array (there wouldn't be a previous enemy to compare it to), if it moves in the
		 * "Y" axis and if it has the same "X" coordinate that the previous one (they are located in the same column) it checks if
		 * the absolute value of the difference between the Y coordinate of the enemy being analyzed and the previous one is less than 250px
		 * in any direction (Absolute value is used because the current enemy being analyze in the loop could be above the previous one or viceversa
		 * since the new Y coordinates are random, and their subtraction could be negative or positive). If they are less than 250px apart, assign a new
		 * random Y coordinate to the current enemy and check again, repeat the process until they are more than 250px apart.
		 */
		function checkEnemiesOverlapping() {
			for (var i = 0; i < allEnemies.length; i++) {
				if (i > 0 && allEnemies[i].axis == 'y' && allEnemies[i].x == allEnemies[i - 1].x) {
					while (Math.abs(allEnemies[i].y - allEnemies[i - 1].y) < 250) {
						allEnemies[i].y = generateRandomCoordY();
					}
				}
			}
		}
	}

	/**
	 * Displays counters on the top of the screen
	 */
	function countersDisplay() {
		ctx.font = '24px Arial';
		//Lives counter
		ctx.fillText('Lives: ' + lives, 20, 20);
		//Level counter
		ctx.fillText('Level: ' + level, 150, 20);
		//Score counter
		ctx.fillText('Current level Score: ' + score, 260, 20);
		//Score needed counter
		ctx.fillText('Score needed: ' + scoreNeeded, 560, 20);
		//Total acumulated score
		ctx.fillText('Total score: ' + totalScore, 800, 20);
	}

	/**
	 * Updates counters on the top of the screen. It clears a rectangle in the canvas where the counters are located
	 * updates the scores and variables and then it displays the counters again with the updated values.
	 */
	function countersUpdate() {
		ctx.clearRect(0, 0, 1200, 300);
		updateScores();
		countersDisplay();
	}

	/**
	 * Updates scores displayed on the counters.
	 */
	function updateScores() {

		setMinScore();
		updateScoreNeeded();
		setTotalScore();

		/**
		 * Sets a minimum score to pass each level
		 */
		function setMinScore(){
			if (level == 1) {
				minScoreToPass = 110;
			} else if (level == 2) {
				minScoreToPass = 210;
			} else if (level == 3) {
				minScoreToPass = 410;
			}
		}

		/**
		 * Updates the score the player has to collect to reach the minimum score to pass to level and if the
		 * player keeps collecting items and increasing the score beyond the minimum requirement, sets the needed score to pass the level
		 * to 0.
		 */
		function updateScoreNeeded(){
			// Update the score the player has to collect to reach the minimium score to pass the level
			if (minScoreToPass - score > 0) {
				scoreNeeded = minScoreToPass - score;
			// If scoreNeeded will be less than 0, set it to 0
			} else if (minScoreToPass - score <= 0) {
				scoreNeeded = 0;
			}
		}

		/**
		 * Sets the value for the total score counter according to the player's current level
		 */
		function setTotalScore(){
			if (level == 1) {
				totalScore = score;
			} else if (level == 2) {
				totalScore = score + scoreLevel1;
			} else if (level == 3) {
				totalScore = score + scoreLevel1 + scoreLevel2;
			}
		}
	}

	/*
	 * Resets counters
	 */
	function resetCounters() {
		lives = 10;
		score = 0;
		level = 1;
		totalScore = 0;
		scoreNeeded = 110;
	}

	/**
	 * Stops the game engine, plays a sound, shows a game over screen and adds an event listener for the user to click
	 * anywhere on the screen to restart the game. If the user clicks on the screen,
	 * an event listener handles the execution of screenclick function that restarts the game engine
	 */
	function gameOver() {
		playYouLostSound();
		setGameOverCanvas();

		/**
		 * Sets canvas properties and text for "game over" screen
		 */
		function setGameOverCanvas() {
			var mainTitleY = canvas.height / 2;

			//To update the counter
			ctx.clearRect(0, 0, 1000, 50);

			ctx.font = 'bold 60px Arial';
			ctx.fillStyle = 'red';
			ctx.shadowColor = 'black';
			ctx.shadowOffsetY = 5;

			ctx.fillText('GAME OVER', 60, mainTitleY);

			ctx.font = '30px Arial';
			ctx.shadowOffsetY = 2;
			ctx.fillText('Click anywhere to start again', 60, mainTitleY + 40);
		}

		document.addEventListener('click', screenclick);
	}

	/**
	 * Stops the game engine when the player wins, shows a "you win screen" with the total score and adds
	 * an event listener for the user to click to restart the game. If the user clicks on the screen,
	 * an event listener handles the execution of screenclick function that restarts the game engine
	 */
	function youWin() {
		playYouWinSound();
		renderEntities();
		setYouWinCanvas();

		/**
		 * Sets the canvas properties and text for "you win" screen
		 */
		function setYouWinCanvas() {
			var mainTitleY = canvas.height / 2;

			//Update the counter
			ctx.clearRect(0, 0, 1000, 50);

			ctx.font = 'bold 60px Arial';
			ctx.fillStyle = 'purple';
			ctx.shadowColor = 'black';
			ctx.shadowOffsetY = 5;

			ctx.fillText('YOU WIN! Your score is: ' + score, 80, mainTitleY);

			ctx.font = '30px Arial';
			ctx.shadowOffsetY = 2;
			ctx.fillText('Click anywhere to play again', canvas.width / 3, mainTitleY + 40);
		}

		document.addEventListener('click', screenclick);
	}

	/**
	 * Resets counters, resets shadow attributes, sets starCollission to false to make the game engine start again
	 * and removes the event listener after the function has executed (otherwise, the event listener will remain
	 * active and if the player clicks on the screen, the game will restart)
	 */
	function screenclick() {
			resetCounters();

			ctx.shadowColor = 'transparent';
			ctx.fillStyle = 'black';
			starCollision = false;

			init();
			document.removeEventListener('click', screenclick);
	}

	//ENCAPSULATING SOUND EFFECTS

	/**
	 * Plays sound if player won
	 */
	function playYouWinSound() {
		var winAudio = new Audio('sounds/round_end.wav');
		winAudio.play();
	}

	/**
	 * Plays sound if player lost
	 */
	function playYouLostSound() {
		var lostAudio = new Audio('sounds/death.wav');
		lostAudio.play();
	}

	/**
	 * Plays sound every time the game starts and when the player moves on to the next level
	 */
	function playInitSound() {
		var initAudio = new Audio('sounds/Accept.mp3');
		initAudio.play();
	}



	/* Go ahead and load all of the images we know we're going to need to
	 * draw our game level. Then set init as the callback method, so that when
	 * all of these images are properly loaded our game will start.
	 */
	Resources.load([
		'images/stone-block.png',
		'images/water-block.png',
		'images/grass-block.png',
		'images/enemy-bug-horizontal.png',
		'images/enemy-bug-vertical.png',
		'images/Gem Blue.png',
		'images/ant.png',
		'images/Selector.png',
		'images/leaf.png',
		'images/Star.png',
		'images/cherry.png',
		'images/frog.png',
		'images/snake-ver.png',
		'images/spider.png'
	]);
	Resources.onReady(init);

	/* Assign the canvas' context object to the global variable (the window
	 * object when run in a browser) so that developers can use it more easily
	 * from within their app.js files.
	 */
	global.ctx = ctx;

})(this);