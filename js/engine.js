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

    canvas.width = 1006; //ORIGINAL 505
    canvas.height = 905; //ORIGINAL 606
    doc.body.appendChild(canvas);

    //Defining important variables 

    //Life counter
    var lives= 10;

    //Score counter
    var score = 0;

    //Initial Score for each level
    var scoreLevel1= score; //For total score to update even during level 1
    var scoreLevel2= 0;
    var scoreLevel3= 0;

    //Declaring totalScore variable
    var totalScore;

    //Declaring variable for Minimum Score needed to pass the level
    var minScoreToPass;

    //Declaring variable for score left to collect to pass the level
    var scoreNeeded;
   
    //Check collision with finish line
    var starCollision = false;

    //Create a level variable for the initial level, and set it as a global variable
    global.level=1; 

    //Max Level
    var maxLevel=3;    


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

         /* If statement to check if the game goes on if the player wins or loses. If there player 
         * still has lives left and it hasn't collided with the star, keep the game loop active. 
         * If the player still has lives, has collided with the star and reached the minimum score 
         * to pass the max level, execute youWin(). Otherwise, if the player has no lives left, execute gameOver().
         */
        if(lives>0 && starCollision==false){
            //Still alive
            win.requestAnimationFrame(main);
        }else if(starCollision==true){
            //You win
            youWin();
        }else{
            //Game over
            gameOver();
        }
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        //Play sound
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
    function checkCollisions() {

        //Box that surrounds the player
        var playerBox={
            "x": player.x,
            "y": player.y,
            "width": 70,
            "height": 80
        };

        //Check collision with each enemy, each collectible item and finish line(star).
        checkCollisionEnemy();
        checkCollisionStar();
        checkCollisionItems();


        //FUNCTIONS TO CHECK COLLISION

        //ENEMIES
        function checkCollisionEnemy(){
            //For loop to check collisions with each enemy
            allEnemies.forEach(function(enemy){
                //Surrounding box for each enemy
                var enemyBox={
                    "x": enemy.x,
                    "y": enemy.y,
                    "width": 40,
                    "height": 40
                }

                //Setting condition for collision with enemy 
                if(enemyBox.x<playerBox.x+playerBox.width && enemyBox.x+ enemyBox.width> playerBox.x && enemyBox.y<playerBox.y+playerBox.height && enemyBox.height+enemyBox.y>playerBox.y) {
                    //Subtract one life from the counter
                    lives-=1;
                    //Subtract 4 points from the score for each collision with an enemy 
                    //(if the counter will be negative, set score to 0)
                    if(score-4>=0){
                        score-=4;
                    }else if(score-4<0){
                        score==0;
                    }
                    //Reset player's coordinates    
                    reset();
                }
            });
        }

        //STAR        
        function checkCollisionStar(){
            //Box that surrounds star
            var starBox={
                "x": starX,
                "y": starY,
                "width": 40,
                "height": 80
            }

            //Check collision with star

            //Set conditions for collision with the star
            if(starBox.x<playerBox.x+playerBox.width && starBox.x+ starBox.width> playerBox.x && starBox.y<playerBox.y+playerBox.height && starBox.height+starBox.y>playerBox.y){

                //If the player is on level 1, there is more than 1 level and the player reaches the minimum score to pass.
                if(level>=1 && level!=maxLevel && score>=minScoreToPass){
                    //Play sound 
                    playInitSound()
                    
                    //Move on to the next level
                    nextLevel();                
                    
                //Else if the player is on the max level, collides with the star and reaches the minimum 
                //score to pass, set starCollision to true
                }else if(level==maxLevel && score>=minScoreToPass){
                    starCollision = true;            
                }

                //Reset player's coordinates for both cases            
                reset();
            }
        }

        //COLLECTIBLE ITEMS
        function checkCollisionItems(){
            allCollectibleItems.forEach(function(item){
                //Box that surrounds gem 
                var itemBox={
                    "x": item.x,
                    "y": item.y,
                    "width": 40,
                    "height": 40
                } 

                //Set condition for collision with collectible item
                if(itemBox.x<playerBox.x+playerBox.width && itemBox.x+ itemBox.width> playerBox.x && itemBox.y<playerBox.y+playerBox.height && itemBox.height+itemBox.y>playerBox.y) {
                    //If the item is a leaf, add 5 to the score
                    if(item.description=="leaf"){
                        score += 5;
                    //If its a cherry, add 10 to the score
                    }else if(item.description=="cherry"){
                        score += 10;
                    //If its a gem, add 30 to the score
                    }else if(item.description=="gem"){
                        score += 30;
                    }   

                    //After collision, generate random X and Y coordinates for the item
                    item.x = generateRandomCoordX();
                    item.y = generateRandomCoordY();
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
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var numRows = 9;
        var numCols = 10;
        var row, col;

        //Define the layout of the tiles for each particular level
        if(level==1){
            var colImages = [
                    'images/water-block.png',   //Water
                    'images/stone-block.png',   //Stone
                    'images/stone-block.png',   //Stone
                    'images/water-block.png',   //Water
                    'images/grass-block.png',   //Grass
                    'images/grass-block.png',   //Grass
                    'images/water-block.png',   //Water
                    'images/grass-block.png',   //Grass
                    'images/grass-block.png',   //Grass
                    'images/grass-block.png',   //Grass                      
                ]

        }else if(level==2){
            var colImages = [
                    'images/grass-block.png',   //Grass 
                    'images/stone-block.png',   //Stone
                    'images/water-block.png',   //Water
                    'images/stone-block.png',   //Stone 
                    'images/stone-block.png',   //Stone  
                    'images/grass-block.png',   //Grass
                    'images/stone-block.png',   //Stone  
                    'images/grass-block.png',   //Grass   
                    'images/grass-block.png',   //Grass  
                    'images/water-block.png',   //Water                     
                ]
        }else if(level==3){
            var colImages = [
                    'images/stone-block.png',   //Stone  
                    'images/grass-block.png',   //Grass 
                    'images/grass-block.png',   //Grass 
                    'images/stone-block.png',   //Stone    
                    'images/stone-block.png',   //Stone      
                    'images/water-block.png',   //Water 
                    'images/water-block.png',   //Water    
                    'images/water-block.png',   //Water     
                    'images/grass-block.png',   //Grass     
                    'images/stone-block.png',   //Stone                        
                ]
        }
               

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
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
        allCollectibleItems.forEach(function(item){
            item.render();
        });
        
        //Render star (finish line)
        star.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // Reset character's x and y coordinates to their initial values
        player.x= initX;
        player.y = initY;
    }

    //CUSTOM FUNCTIONALITY


    //New level
    function nextLevel() {
        //Set variable for the current level's score
                if(level==1){
                    scoreLevel1= score;
                }else if(level==2){
                    scoreLevel2= score;
                }else if(level==3){ 
                    scoreLevel3= score;
                }

                //Add 1 to "Level" variable
                level += 1;

                //Reset score to 0
                score = 0;

                //Set vertical enemy's y coordinates to a random number between 50 and 700
                allEnemies.forEach(function(enemy){                    
                    if(enemy.axis=="y"){
                        enemy.y = generateRandomCoordY();
                    } 
                })

    }

    //Display counter
    function countersDisplay() {
        ctx.font ="24px Arial";
        //Lives counter
        ctx.fillText("Lives: "+ lives, 20, 20);
        //Level counter
        ctx.fillText("Level: "+ level, 150, 20);
        //Score counter
        ctx.fillText("Current level Score: "+ score, 260, 20);        
        //Score needed counter
        ctx.fillText("Score needed: "+ scoreNeeded, 560, 20);
        //Total acumulated score
        ctx.fillText("Total score: "+ totalScore, 800, 20);
    }

    //Update counters
    function countersUpdate(){
        //Clear a reactangle where the counters are located
        ctx.clearRect(0,0,1200,300);

        updateScores();

        //Display them again with their updated values
        countersDisplay();
    }

    function updateScores() {
        //Set a minumum score to pass the level
        if(level==1){
            minScoreToPass = 110;
        }else if(level==2){
            minScoreToPass = 210;
        }else if(level==3){
            minScoreToPass = 410;
        }

        //Update the score the player has to collect to reach the minimium score to pass the level
        if(minScoreToPass - score>0){
            scoreNeeded = minScoreToPass - score;
        //If scoreNeeded will be less than 0, set it to 0
        }else if(minScoreToPass - score<=0){
            scoreNeeded = 0;
        }

        //Set the value for totalScore (In level1, it updates automatically through score, 
        //in level 2 and 3 it depends on score and the previous level's score)
        if(level==1){
            totalScore= score;
        }else if(level==2){
            totalScore = score + scoreLevel1
        }else if(level==3){
            totalScore = score + scoreLevel1 + scoreLevel2;
        }
    }

    function resetCounters(){
        lives= 10;
        score= 0; 
        level= 1;
        totalScore= 0;
        scoreNeeded= 110;
    }

    //Encapsulating events trigerred by winning or losing


    //Game over function
    function gameOver(){
        //Play sound
        playYouLostSound();

        //Variables
        var mainTitleY= canvas.height/2;

        //To update the counter
        ctx.clearRect(0,0,1000,50);

        //Text attributes
        ctx.font= "bold 60px Arial";
        ctx.fillStyle= "red";
        ctx.shadowColor= "black";
        ctx.shadowOffsetY= 5;

        ctx.fillText("GAME OVER", 60, mainTitleY);

        ctx.font="30px Arial";
        ctx.shadowOffsetY= 2;
        ctx.fillText("Click anywhere to start again", 60, mainTitleY+40);
        
        //If the user clicks anywhere on the page, the game starts again
        document.addEventListener("click", function(){
            //Reset counters values
            resetCounters();
            //Reset shadow attributes
            ctx.shadowColor= "transparent";
            ctx.fillStyle= "black";
            init();
        });     
    }

    //YOU WIN function
    function youWin(){

        //Play sound if player wins
        playYouWinSound();

        renderEntities();
        
        //Variables
        var mainTitleY= canvas.height/2;

        //To update the counter
        ctx.clearRect(0,0,1000,50);

        //Text attributes
        ctx.font= "bold 60px Arial";
        ctx.fillStyle= "purple";
        ctx.shadowColor= "black";
        ctx.shadowOffsetY= 5;

        ctx.fillText("YOU WIN! Your score is: "+ score, 80, mainTitleY);

        ctx.font="30px Arial";
        ctx.shadowOffsetY= 2;
        ctx.fillText("Click anywhere to play again", canvas.width/3, mainTitleY+40);
        
        //If the user clicks anywhere on the page, the game starts again
        document.addEventListener("click", function(){
            //Reset counters values
            resetCounters();
            //Reset shadow attributes
            ctx.shadowColor= "transparent";
            ctx.fillStyle= "black";
            starCollision = false;
            init();
        });    
    }

    //ENCAPSULATING SOUND EFFECTS
    function playYouWinSound(){
        var winAudio = new Audio("sounds/round_end.wav");
        winAudio.play();
    }

    function playYouLostSound(){
        var lostAudio = new Audio("sounds/death.wav");
        lostAudio.play();
    }

    function playInitSound(){
        var initAudio = new Audio("sounds/Accept.mp3");
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
        'images/cherry.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;

})(this);
