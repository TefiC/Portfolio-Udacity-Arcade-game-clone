## **ARCADE GAME CLONE: AN ANT'S QUEST**
------
An html5 game inspired by "frogger".

### Game Instructions
---
The game will start automatically when the screen loads. You are a poor ant collecting food for your nest to survive a hard winter, collect as many leaves and gems as you can without colliding with those mean bugs that will harm you! You have 10 lives, use them wisely.

You can move your character by pressing the `up`, `down`, `right` and `left` keys. Depending on the surface, the player will have different speeds (It will move **faster** in stone and **slower** in water). Your goal is to collect the necessary score for each level by reaching collectible items that will add to your score counter. 

Once you reach the necessary score for the level, you can walk to the star located at the top right corner of the screen and move on to the next level. 

##### Collectible items
They add to your score. 
 
* Leafs = 5
* Gems = 10
* Cherries = 30

##### Counters
* **Lives** = keeps track of your lives.
* **Level** = displays the current level you are in.
* **Score** = displays your score for your current level.
* **Score needed** = displays the score you have to collect to pass to the next level if you reach the star (not the total score across all levels, only the score collected on that particular level). 

   * _(**NOTE:** if this counter is not 0 and you reach the star, the player will go back to its initial location and you won't go to the next level, you will have to collect the missing score)_

######Minimum score collected on each level to move on to the next level:
    * Level 1 needs a minimum of 110 points.
    * Level 2 needs a minimum of 210 points.
    * Level 3 needs a minimum of 410 points.

* **Total score** = keeps track of your _total_ score across all levels.


##### Enemies
Don't collide with bugs!!! they will hurt you. Each time you do, your player will lose 1 life, 4 points and it will go back to its initial location.
. 
##### Winning and losing
If you succesfully complete all levels, a screen will appear showing your total score. If you run out of lives, you will lose and you will have to start all over again.

### Installation instructions
---- 
The game doesn't require any installations or additional software. You only have to click on `index.html` and the game will execute on your browser. 

###Bugs
----
At the moment, I'm developing an algorithm to check if two bugs are on top of each other after random Y coordinates are generates for each enemy when the player moves on to the new level.

### License and Copyright
---
* This is a Udacity project. Base code was provided. 
* Images were provided by Udacity, except [Ant](https://pixabay.com/es/hormiga-asusta-insectos-asustado-44589/), [leaves](https://pixabay.com/es/arce-oto%C3%B1o-de-la-hoja-orange-tonos-150741/) and [Cherries](https://pixabay.com/es/cereza-madre-frutas-rojo-madura-575547/) ([Pixabay.com](pixabay.com))  They are all licensed under [CC0 creative commons](https://creativecommons.org/about/cc0/)  
* Sounds were downloaded from [opengameart.org](opengameart.org)
    * [death.wav](http://opengameart.org/content/oldschool-win-and-die-jump-and-run-sounds) and [round_end.wav](http://opengameart.org/content/oldschool-win-and-die-jump-and-run-sounds) are licensed under public domain. Their autor is sauer2. 
    * [Accept.wav](http://opengameart.org/content/ui-accept-or-forward) is licensed under creative commons. Its author is 
       ViRiX (David McKee)