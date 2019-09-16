export {getMouse};

// This function will return the mouse's
// position on the page. The mouse is recorded
// in this way so that clicking on screen with
// getMouse will only work when the user clicks
// on the canvas.
function getMouse(e){
    var mouse = {};
    mouse.x = e.pageX - e.target.offsetLeft;
    mouse.y = e.pageY - e.target.offsetWidth;
    return mouse;
}