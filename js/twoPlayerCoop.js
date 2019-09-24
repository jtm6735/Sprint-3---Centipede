// 
"use strict"

// Imports the given functions from the other named js files
// These imports only work because the imports recieve because the functions 
// in the other files are being exported.
import{createMushroomSprites,createPlayerSprite,fireBullets,createCentipede} from './classes.js';
import{getMouse} from './utilities.js';
import{aabbCollision} from './collision.js';

// Exporting our own init function into the main.html so that
// is ran when the window opens
export{init};

// Const variables are set, these variables will never
// change. These variables are essentially what control
// the properites or elements of the canvas.
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const screenWidth = 1200;
const screenHeight = 800;

// This const will save our game states
// We will be able to access these GameStates 
// later in the code.
const GameState=Object.freeze({
    START: Symbol("START"),
    MAIN: Symbol("MAIN"),
    PAUSED: Symbol("PAUSED")
    
});

// The const will save keycodes
// for buttons on the keyboard.
const keyboard = Object.freeze({
	SPACE: 		32,
	LEFT: 		37, 
	UP: 		38, 
	RIGHT: 		39, 
	DOWN: 		40,
    A:          65,
    D:          68,
    S:          83,
    W:          87,
    ENTER:      13,
    ONE:        49
});

const keys = [];

// These are the local variables
// that will be used throughtout
// the main.js.
let backgroundSound;
let laserSound;
let hitSound;
let shipFire;
let gameState = GameState.START;
let backGroundImage = new Image();
let imageData;
let mushrooms = [];
let bullets = [];
let secondBullets = [];
let centipedes = [];
let currentLevel = 1;
let player;
let secondController;
let totalScore;
let levelScore;
let cageCount;
let margin = 50;
let rand;
let counter=10;
let delta=0;
let lastFrameTimeMS = 0;
let score;
let score2;
let isPaused=null;

// The two, rect and rectS, will be used 
// to check the screensize which the objects are in.
let rect = {left: margin, top: margin, width: screenWidth - margin*2, height: screenHeight-margin*2};
let rectS = {left: margin, top: margin, width: screenWidth - margin*2, height: screenHeight-margin*3};



// The init function is used to initialize
// elements as soon as the window opens.
// Information regarding the backgroundImage
// and sound are set in the init. The init
// is also where we create the initial centipede
// and mushrooms in their own seperate arrays.
function init(argImageData){
    backGroundImage.src = "images/backgroundGame2-02PS.png";
    
    //backgroundSound= new sound("audio/komiku58.mp3");   
    //laserSound = new sound("audio/laser1.wav");
    //hitSound = new sound("audio/attack_hit.mp3");
    
    imageData = argImageData;
    score = 0;
    isPaused=window;
    isPaused.onblur=paused;
    isPaused.onfocus=play;
    
    // This will set the player to have a create using the
    // parameters given in the function
    player = createPlayerSprite(rectS,40,40,.4,"images/sunturt.png");
    secondController = createPlayerSprite(rectS,40,40,.4,"images/blueturt.png");
    
    spawnCentipedes();
    
    // Spawns the initial set of mushrooms.
    spawnMushrooms();
    


    // Enables the canvas to be clickable
    // with the doMousedown.
    canvas.onmousedown = doMousedown;
    loop();
}

// The loop function will run the animation
// for the program. Because of this, the loop
// also deals with the delta time which controls
// the movement of the objects. Lastly, the hud is redrawn
// in the loop so that multiple objects are not
// repeatedly drawn on screen
function loop(timestamp){
	requestAnimationFrame(loop);
    delta=timestamp-lastFrameTimeMS;
    lastFrameTimeMS=timestamp;
    drawHUD(ctx);
   
}

// The function drawHUD has three different 
// states on it which vary depending on which GameState 
// is being accessed.
function drawHUD(ctx){

    ctx.save();
    switch(gameState){
        // In the GameState.Start, text is drawn
        // in order to show off what the title screen
        // is.
    
        case GameState.START:
            ctx.save();
            ctx.fillStyle = "black";
            ctx.rect(0,0,1200,800);
            ctx.fill();
            ctx.restore();
            fillText(ctx,"Loading...",screenWidth/2, screenHeight/2, "36pt 'Press Start 2P', cursive", "black");
            strokeText(ctx,"Loading...",screenWidth/2, screenHeight/2, "36pt 'Press Start 2P', cursive", "white", 2);
            setTimeout(changeScene,500)
            break;
        
        // In the GameState.Main, we will be checking
        // the key daemons in order to have fluid motion.
        // This is accomplished by using key daemons similar
        // to how one would use a bool. This allows for multiple
        // inputs to be recording at once without stuttering movement
        case GameState.MAIN:

            
           ctx.shadowColor = "black";
           ctx.shadowBlur = 5;
            

	       if (keys[keyboard.DOWN]){
                if(player.y+player.height+player.dy<=800){
                    player.dy=player.speed;
                    console.log(keyboard.DOWN);
                    console.log(player.speed);
                }       
            }
            else if(keys[keyboard.UP]){
                if(player.y >= 600){
                    player.dy=-player.speed; 
                    console.log(player.speed);
                }
            }
            else{
                player.dy=0;        
            }
            if(keys[keyboard.LEFT]){
                if(player.x>=0){
                    player.dx=-player.speed; 
                    console.log(player.speed);
                }
            }
            else if(keys[keyboard.RIGHT]){
                if(player.x+player.width+player.dx<= 1200){
                    player.dx=player.speed;
                    console.log(player.speed);
                }
            }
            else{
                player.dx=0;        
            }

            /* --- */
        
            
            if (keys[keyboard.S]){
                if(secondController.y+secondController.height+secondController.dy<=800){
                    secondController.dy=secondController.speed;
                    console.log(keyboard.S);
                    console.log(secondController.speed);
                }       
            }
            else if(keys[keyboard.W]){
                if(secondController.y >= 600){
                    secondController.dy=-secondController.speed; 
                    console.log(keyboard.W);
                    console.log(secondController.speed);
                }
            }
            else{
                secondController.dy=0;        
            }
            if(keys[keyboard.A]){
                if(secondController.x>=0){
                    secondController.dx=-secondController.speed; 
                    console.log(keyboard.A);
                    console.log(secondController.speed);
                }
            }
            else if(keys[keyboard.D]){
                if(secondController.x+secondController.width+secondController.dx<= 1200){
                    secondController.dx=secondController.speed;
                    console.log(keyboard.D);
                    console.log(secondController.speed);
                }
            }
            else{
                secondController.dx=0;        
            }
            
            
            
            // The background image is constantly beign redrawn
            // so that multiple images are not left on the screen
            // where images have already passed over.
            
            ctx.save();
            ctx.drawImage(backGroundImage,0,0);
            ctx.restore();
            
            
            
            //ctx.save();
            // Loading into the second screen solely
            // The loop will make it so that the 
            // song will loop on end.
            //backgroundSound.loop=true;
            //backgroundSound.play();
            //ctx.restore();
            
            
            // This text keeps track of the player's score
            // in the upper left hand corner
            fillText(ctx,"Score: " + score, 50, 30, "20pt 'Press Start 2P', cursive", "black");
            strokeText(ctx,"Score: " + score,50, 30, "20pt 'Press Start 2P', cursive", "white", 1);
            
            // In the initial run of the MAIN gameState,
            // the mushrooms are drawn onto the screen
            ctx.save();
            for(let m of mushrooms){
                m.draw(ctx);
            }
            ctx.restore();
            
            // These checks are here to check if the player's
            // avatar hits the boundaries of the box. If so,
            // the player will bounce back in the opposite direction
            // of which they hit the box.
            if(player.x+player.width+player.dx>= 1210){
                player.dx = -player.speed/2;
            }
            if(player.x <= -10){
                player.dx = player.speed/2;
            }
            if(player.y <= 580){
                player.dy = player.speed/2;
            }
            if(player.y+player.height+player.dy >= 810){
                player.dy = -player.speed/2;
            }
            player.draw(ctx);
            
            // These checks are here to check if the player's
            // avatar hits the boundaries of the box. If so,
            // the player will bounce back in the opposite direction
            // of which they hit the box.
            if(secondController.x+secondController.width+secondController.dx>= 1210){
                secondController.dx = -secondController.speed/2;
            }
            if(secondController.x <= -10){
                secondController.dx = secondController.speed/2;
            }
            if(secondController.y <= 580){
                secondController.dy = secondController.speed/2;
            }
            if(secondController.y+secondController.height+secondController.dy >= 810){
                secondController.dy = -secondController.speed/2;
            }
            secondController.draw(ctx);
            

            // Bullets are drawn and moved
            // in coordinance with delta time.
            // There is a boundary check for
            // the bullets where if they hit the top,
            // the bullets are removed from their array
            ctx.save();
            for(let x of bullets){
                x.draw(ctx);
                x.dy=-x.speed;
                x.update(delta);
                    if(x.y <= 0){
                        remove(bullets,x);
                    }
            }
            ctx.restore();
            
            ctx.save();
            for(let x of secondBullets){
                x.draw(ctx);
                x.dy=-x.speed;
                x.update(delta);
                    if(x.y <= 0){
                        remove(secondBullets,x);
                    }
            }
            ctx.restore();
            
            // The centipedes are drawn into an array.
            // In these lines of code, the centipede goes
            // through multiple checks regarding if it is
            // hitting a wall. When the centipede hits the wall,
            // its image is changed in order to match the new direction
            // it is facing. The centipede also speeds up, to a certain
            // limit whenever it hits a wall.
            ctx.save();
            for(let c of centipedes){
                c.draw(ctx);
                c.dx = c.speed;
                if(c.x+c.width+c.dx >=1200){
                    let reverse = new Image();
                    reverse.src ="images/images/bottleLeft.png";
                    c.x =1150;
                    c.y=c.y+20;
                    if(c.speed<=.48){
                        //c.speed *= 1.08; 
                    }
                    c.speed = -c.speed;
                    if(c.boolValue==false){
                         c.image =reverse;
                         c.boolValue=true;
                    }
                }
                if(c.x+c.dx<= 0){
                    let forward = new Image();
                    forward.src="images/bottleRight.png";
                    c.x=10;
                    c.y=c.y+20;
                    if(c.speed>= -.48){
                        //c.speed *= 1.08; 
                    }
                    c.speed = -c.speed;
                    if(c.boolValue==true){
                        c.image =forward;
                        c.boolValue=false;
                    }
                }
                if(c.y+c.height+c.dy>=800){
                    c.y= 20;
                }
                c.update(delta);    
            }
            
            // These combined for loops check for the collision
            // between any centipede and bullet. Using aabb collision,
            // if any of the two objects collide with one another, both
            // objects are removed from their respective array and a sound effect
            // is played in order to signal the collision. A counter is used to 
            // the number of centipedes spawned each time the array of centipedes
            // is cleared out.
            for(let x of centipedes){
                for(let y of bullets){
                    if(aabbCollision(x.x,y.x,x.y,y.y,x.width,y.width,x.height,y.height)){
                        /*hitSound.play();*/
                        remove(bullets, y);
                        remove(centipedes, x);
                        mushrooms.push(createMushroomSprites(rectS,x.x,x.y,20,20,"images/fish.png"));
                        score += 20;
                        if(centipedes.length <= 0){
                            spawnMushrooms();
                            for(let i = 0; i <counter ; i++){
                                centipedes.push(createCentipede(rectS,(300-(i*24)),60, x.speed=x.speed+.005, "images/bottleRight.png",false));   
                            }
                            counter+=2;
                        } 
                    }
                }
            }
            
            for(let x of centipedes){
                for(let y of secondBullets){
                    if(aabbCollision(x.x,y.x,x.y,y.y,x.width,y.width,x.height,y.height)){
                        /*hitSound.play();*/
                        remove(secondBullets, y);
                        remove(centipedes, x);
                        mushrooms.push(createMushroomSprites(rectS,x.x,x.y,20,20,"images/fish.png"));
                        score += 20;
                        if(centipedes.length <= 0){
                            spawnMushrooms();
                            for(let i = 0; i <counter ; i++){
                                centipedes.push(createCentipede(rectS,(300-(i*24)),60, x.speed=x.speed+.005, "images/bottleRight.png",false));   
                            }
                            counter+=2;
                        } 
                    }
                }
            }
            
            // These combined for loops, like the prior one, checks 
            // for aabb collision with the mushrooms and the bullets.
            // If these objects collide, then both are destroyed and removed from
            // their arrays. No sound effect is played then these hit.
            for(let x of mushrooms){
                for(let y of bullets){
                    if(aabbCollision(x.x,y.x,x.y,y.y,x.width,y.width,x.height,y.height)){
                        remove(bullets, y);
                        remove(mushrooms, x);
                    }
                }
            }
            
            for(let x of mushrooms){
                for(let y of secondBullets){
                    if(aabbCollision(x.x,y.x,x.y,y.y,x.width,y.width,x.height,y.height)){
                        remove(secondBullets, y);
                        remove(mushrooms, x);
                    }
                }
            }
            
            // These combined for loops check for the collision between the
            // centipedes and the mushrooms. Similar to the boundary check above,
            // if a centipede htis a mushroom, it will turn the opposite direction it
            // came and start moving that way. 
            for(let x of centipedes){
                for(let y of mushrooms){
                    if(aabbCollision(x.x,y.x,x.y,y.y,x.width,y.width,x.height,y.height)){
                        x.speed = -x.speed;
                        x.y = x.y + 20;
                        if(x.boolValue == false){
                            let reverse = new Image();
                            reverse.src ="images/bottleLeft.png";
                            x.image = reverse;
                            x.boolValue = true;
                        }
                        else if(x.boolValue==true){
                            let forward = new Image();
                            forward.src="images/bottleRight.png";
                            x.image=forward;
                            x.boolValue = false;
                        }
                    }
                }
            }
            
            // This for loop checks for a collision between any centipede object
            // and the pleyer's spaceship avatar. If there is a collision,
            // the player dies and is sent to the game over screen.
            for (let x of centipedes){
                if(aabbCollision(player.x,x.x,player.y,x.y,player.width,x.width,player.height,x.height)){
                    document.location.href = "./gameOver.html";
                }
            }
            for (let x of centipedes){
                if(aabbCollision(secondController.x,x.x,secondController.y,x.y,secondController.width,x.width,secondController.height,x.height)){
                    document.location.href = "./gameOver.html";
                }
            }
            ctx.restore(); 
            player.update(delta);
            secondController.update(delta);
            break;
            
        // This gameState is accesssed by clicking off the 
        // window of the game. On this screen, the palyer will be 
        // greeted with text saying that they are on the loading screen.
        case GameState.PAUSED:
            ctx.shadowColor = "black";
            ctx.shadowBlur = 15;
            /*
            backgroundSound.stop();
            */
            ctx.save();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.save();
            ctx.fillStyle = "#589CFF";
            ctx.rect(0,0,1200,800);
            ctx.fill();
            ctx.restore();
            fillText(ctx,"Paused",screenWidth/2, screenHeight/2, "36pt 'Press Start 2P', cursive", "red");
            strokeText(ctx,"Paused",screenWidth/2, screenHeight/2, "36pt 'Press Start 2P', cursive", "white", 2);
            ctx.restore();
            break;

        default:
            throw new Error(MyErrors.drawHUDswitch);
            
    }
    ctx.restore();
}

// When the mouse is clicked, an action 
// will be processed depending on what 
// gameState is being used
function doMousedown(e){
    let mouse=getMouse(e);
    switch(gameState){
        // In the GameState.Start, a mouse click
        // will advance the screen to the main
        // gameplay screen.
        
        case GameState.START:
            gameState = GameState.MAIN;
            break;
        
        
        // Clicking the screen in the main state
        // will not do anything.    
        case GameState.MAIN:
            break;

        // Clicking the screen in the paused state
        // will not do anything.  
        case GameState.PAUSED:
            break;
            
        default:
            throw new Error(MyErrors.mousedownSwitch);
    }
}

// When a key is released and goes up,
// this eventListener makes sure that the
// action performed by the key is no longer
// being used.
window.onkeyup = (e) => {
    keys[e.keyCode] = false;
    e.preventDefault();
};

// This event listener will check for when the 
// spacebar is pressed. When the space bar
// is pressed, a laser noise will play and a
// bullet will be added to the array and fire out
// of the ship.

window.onkeydown = (e)=>{
    var char = String.fromCharCode(e.keyCode);
	keys[e.keyCode] = true;
    if(keys[keyboard.ENTER]){
        /*laserSound.play();*/
        bullets.push(fireBullets(rectS,player.x + 15,player.y- 10, .3, "images/net.png"));
        console.log("shot fired");
    }
    else if(keys[keyboard.SPACE]){
        secondBullets.push(fireBullets(rectS,secondController.x + 15, secondController.y - 10, .3, "images/net.png"));
    }
};


// This function will be used to write 
// text along the canvas when needed.
// The parameters passed in will be used
// to set the settings of the text.
function fillText(ctx,string,x,y,css,color){
    ctx.save();
    ctx.font = css;
    ctx.fillStyle = color;
    ctx.fillText(string,x,y);
    ctx.restore();
}

// This function acts as a follow up 
// to the fillText function. The text
// made in this function will act as 
// the stroke to the text written in
// the fillText function.
function strokeText(ctx,string,x,y,css,color,lineWidth){
    ctx.save();
    ctx.font = css;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.strokeText(string,x,y);
    ctx.restore();
}

// This funciton is called in order to
// remove an object from an array. This 
// function will be called during
// the collision checks
function remove(array, element){
    const item = array.indexOf(element);
    array.splice(item, 1);
}

// This function is used to get a random
// number using a given parameter
// as a maximum number for generation
function getRandom(max){
    return Math.floor(Math.random() * Math.floor(max));
}

// This function gives information in order
// for sound to be played. Within this function,
// the song is given two more functions, play
// and stop

/*
function sound(source){
    this.sound = document.createElement("audio");
    this.sound.src =source;
    document.body.appendChild(this.sound);
    this.play=function(){
        this.sound.play();
    }
    this.stop=function(){
        this.sound.pause();
    }
}
*/
// The paused and play functions are
// to be used in accordinance with
// when the player clicks on and off
// of the window. Clicking off the
// window will lead the user to the
// gameState while clicking back on the
// window will put the player back in
// the main gameState.
function paused(){
    gameState=GameState.PAUSED;
}
function play(){
    gameState=GameState.MAIN;
}

// This function runs a two dimensional
// for loop in order to spawn mushrooms
// in a grid like fashion. A random number
// is used to determine if a mushroom is 
// spawned in a given point on the screen.
function spawnMushrooms(){
    for(let i=60;i<1160;i+=20){
        for(let j=100;j<600;j+=20){
            rand = getRandom(50);
            if(rand>45){
                mushrooms.push(createMushroomSprites(rectS,i,j,20,20,"images/fish.png")); 
            }    
        }
    }
}

function spawnCentipedes(){
        // Spawns an intial ten centipedes
    // into the game using [i] to position
    // them in a line.
    for(let i=0;i<10;i++){
        centipedes.push(createCentipede(rectS,(300-(i*30)),60, .3, "images/bottleRight.png",false));
        console.log("Centipede Spawned " + i);
    }
}

function changeScene(){
    gameState = GameState.MAIN;
}