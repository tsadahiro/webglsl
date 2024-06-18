function preload(){
    theshader = loadShader('./shader.vert', './gradnoise.frag');
}

function setup(){
    createCanvas(800,800,WEBGL);
    noStroke();
}

function draw() {
    background(0);
    theshader.setUniform('u_resolution', [width, height]);
    theshader.setUniform("u_time", millis() / 1000.0);
    theshader.setUniform('color', [1,0,0,1]);
    shader(theshader);
    fill(0,0,0);
    rect(0,0,width,height);
}

