export {aabbCollision};

// A typtical funciton used for 
// checking a collision between
// two square hitboxes.
// The xPos, yPos, width, and
// height will be the passed 
// in dimensions and positions
// of the objects used and checked.
function aabbCollision(xPos, xPos2, yPos, yPos2, width, width2, height, height2){
    if(xPos < xPos2 + width2 &&
       xPos + width > xPos2 &&
       yPos < yPos2 + height2 &&
       height + yPos > yPos2){
        return true;
        console.log("collision");
    }
}