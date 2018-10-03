// Hello.
//
// This is JSHint, a tool that helps to detect errors and potential
// problems in your JavaScript code.
//
// To start, simply enter some JavaScript anywhere on this page. Your
// report will appear on the right side.
//
// Additionally, you can toggle specific options in the Configure
// menu.

//*****ENEMIES our player must avoid*************************
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (score === 100 || lives === 0) {
        this.movement(0,0,0);
    } else {this.movement(.5, .3, 1);}
    this.x * dt;
    this.y * dt;
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};


//Method that controls the movement of the enemy across the screen.
Enemy.prototype.movement = function(spd1, spd2, spd3) {
    if (this.x < 505) {
        allEnemies[0].x += spd1;
        allEnemies[1].x += spd2;
        allEnemies[2].x += spd3;
    } else {this.x = -101;}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    allEnemies[0].y = 63;
    allEnemies[1].y = 146;
    allEnemies[2].y = 229;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.update();
};

//***************************************************************
//********PLAYER*************************************************

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 395;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// var victory = document.querySelector('.scoreboard-content p');
Player.prototype.update = function(dt) {
    this.stayInBounds();
    this.y * dt;
    this.x * dt;
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

//Method called by the arrow key event-listener to move the player.
Player.prototype.handleInput = function(e) {
    if (e === 'up') {
        this.y -= 83;
        if (this.y === -20) {
        this.victory();
        scoreBoard();
        }
    } else if (e === 'down') {
        this.y += 83;
    } else if (e === 'left') {
        this.x -= 101;
    } else if (e === 'right') {
        this.x += 101;
    }
};

//Method called by update() that prevents the player from exiting the screen.
Player.prototype.stayInBounds = function() {
    if (this.x < 0) {
        this.x = 0;
    } else if (this.y < -20) {
        this.y = -20;
    } else if (this.x > 404) {
        this.x = 404;
    } else if (this.y > 395) {
        this.y = 395;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemy = new Enemy();
var allEnemies = [];
var player = new Player();

//Fills the allEnemies array with Enemy subclasses.
for (var i = 0;i < 3; i++) {
    allEnemies.push(Object.create(enemy));
}

//Method called by the victory() method, and checkCollisions() 
//to reset the player back to the starting position.
Player.prototype.startingPosition = function() {
    this.x = 202;
    this.y = 395;
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});



//Method called from the update().engine.js that checks for enemy/player collisions.
Player.prototype.checkCollisions = function() {
    allEnemies.forEach(function(enemy) {
            var calc = player.x - enemy.x;
            if (calc < 80 && calc >= -52 && enemy.y === player.y) {
                player.startingPosition();
                loseLives();
            }
        });
};


//*******************************************************************************
//*******SCOREBOARD & RELOAD*****************************************************

//Method called by handleInput method that displays a message on the scoreboard 
//for making it to the water.
Player.prototype.victory = function() {
    setTimeout(function(){
        player.startingPosition();
        victoryMessage.style.display='none';
    }, 500);
};

//Function called handleInput that adds points to the score each
//time the player makes it to the water.
var score = 0;
var yourScore = document.querySelector('.your-score');
var victoryMessage = document.querySelector('.victory');

function scoreBoard() {
    score +=10;
    yourScore.textContent = score;
    if (score === 100) {
        youWin();
    }else {victoryMessage.style.display='inline-block';}
    return score;
}

//Function called by checkCollisions() that decrements a life if a 
//collision is detected, and sends to youLose() if lives reach zero.
var lives = 3;
var yourLives = document.querySelector('.your-lives');
var gameOver = document.querySelector('.game-over');
var livesDisplay = document.querySelector('.lives');

function loseLives() {
    lives -=1;
    livesDisplay.style.background = 'red';
    setTimeout(function() {
        livesDisplay.style.background = 'none';
    }, 500);
    yourLives.textContent = lives;
    if (lives === 0) {
        youLose();
    } else {return lives;}
}

//Function called by youLose() & youWin() that resets the game and scoreboard.
var youWinMessage = document.querySelector('.you-win');
function reload() {
    score = 0;
    lives = 3;
    playAgain.style.visibility = 'hidden';
    gameOver.style.display = 'none';
    yourScore.textContent = 0;
    yourLives.textContent = 3;
    youWinMessage.style.display = 'none';
    allEnemies.forEach(function(enemy) {
        enemy.x = -101;
    });
}

//Event Listener for the Play Again Button, calls reset() if clicked.
var playAgain = document.querySelector('.play-again-button');
playAgain.addEventListener('click', function() {
    reload();
});

//Function called by scoreBoard() to display yo win message 
// and play again button.
function youWin() {
    youWinMessage.style.display = 'inline-block';
    playAgain.style.visibility = 'visible';
}

//Function called by loseLives() to display game over message
//and play again button.
function youLose() {
    gameOver.style.display = 'inline-block';
    playAgain.style.visibility = 'visible';
}


//   6/5/2018





