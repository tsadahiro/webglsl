function preload(){
    //theshader = loadShader('./shader.vert', './gradnoise.frag');
    theshader = loadShader('./shader.vert', './test.frag');
}

var mx=0;
var my=0;
var clickedTime;

function setup(){
    createCanvas(800,800,WEBGL);
    noStroke();
    clickedTime = millis() / 1000;
}

function draw() {
    background(0);
    theshader.setUniform('u_resolution', [width, height]);
    theshader.setUniform("u_time", millis() / 1000.0 - clickedTime);
    theshader.setUniform('color', [1,0,0,1]);
    shader(theshader);
    fill(0,0,0);
    rect(0,0,width,height);
    theshader.setUniform('mouse', [mx,my]);
}

function mouseClicked(){
    mx = mouseX;
    my = mouseY;
    clickedTime = millis() / 1000;
}

