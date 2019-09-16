"use strict";
export{createMushroomSprites,createPlayerSprite,fireBullets,createCentipede};

// The baseSprite class will act as the 
// original sprite class for all the other
// classes to be based off of.
class BaseSprite{
    constructor(x,y,width,height,speed,image){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.speed=speed;
        this.image=image;

        // The dx and dy will be used
        // in order to move the given object(s)
		this.dx = 0;
		this.dy = 0;
	}
    
    // The update uses delta time in order
    // to calculate the movement of an object.
	update(dt){
		this.x += this.dx * dt;
		this.y += this.dy * dt;
	}

    // Draw will be used to draw the actual
    // sprite onto the canvas passed in.
    draw(ctx){
        ctx.save();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

// The centipede class will extend off
// of the baseSprite class and will require
// a super. Centipede will be given a new variable
// that will function as a bool that helps to
// determine the sprite image used for direction.
class Centipede extends BaseSprite{
    constructor(x,y,width,height,speed,image,faceBool){
        super(x,y,width,height,speed,image);
        this.dx = 0;
        this.dy = 0;
        this.boolValue=faceBool;
    }
    
    // The update uses delta time in order
    // to calculate the movement of a centipede.
    update(dt){
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    }
    
    // Draw will be used to draw the actual
    // centipede sprite onto the canvas passed in.
    draw(ctx){
        ctx.save();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

// Creates a mushroom using the baseSprite properties
// as an outline for generation.
function createMushroomSprites(rect = {left: 0,top: 0,width: 300,height: 300},x,y,width,height,url){
    let image = new Image();
    image.src = url;
    let mushroom= new BaseSprite(x,y,width,height,0,image)
    return mushroom;
}

// Creates the player avatar using the baseSprite properties
// as an outline for generation.
function createPlayerSprite(rect={left: 0,top: 0,width: 300,height: 300},width,height,speed,url){
    let image = new Image();
    image.src = url; 
    let ship = new BaseSprite(300,650,width,height,speed,image);
    return ship;
}

// Creates the bullets shotusing the baseSprite properties
// as an outline for generation.
function fireBullets(rect={left: 0,top: 0,width: 300,height: 300},x,y,speed,url){
    let image = new Image();
    image.src = url; 
    let bullet = new BaseSprite(x,y,10,10,speed,image);
    return bullet;
}

// Creates a centipede using the baseSprite properties
// as an outline for generation.
function createCentipede(rect={left: 0,top: 0,width: 300,height: 300}, x,y, speed, url,boolean){
        let image = new Image();
        image.src = url;
        let newCentipede = new Centipede(x,y,30,20,speed,image,boolean);
        return newCentipede;
}