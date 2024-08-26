const RES = 2;

const X = Math.floor(window.innerWidth*RES)/RES;
const Y = Math.floor(window.innerHeight*RES)/RES;

let color = 0;

let boundXi = -2;
let boundXf = 2;
let boundYi = -2*(Y/X);
let boundYf = 2*(Y/X);

let boundXin = 0;
let boundXfn = 0;
let boundYin = 0;
let boundYfn = 0;

p5.disableFriendlyErrors = true;

let clicker = false;
function mouseClicked(){
    if(!clicker){
        boundXin = map(mouseX, 0, X, boundXi, boundXf);
        boundYfn = map(mouseY, 0, Y, boundYf, boundYi);
    }
    else{
        boundXfn = map(mouseX, 0, X, boundXi, boundXf);
        boundYin = map(mouseY, 0, Y, boundYf, boundYi);

        boundXi = boundXin;
        boundXf = boundXin + (boundYfn-boundYin)*X/Y;
        boundYi = boundYin;
        boundYf = boundYfn;
        frame();
        redraw();
    }
    clicker = !clicker;
}

function keyPressed() {
    if(keyCode === ENTER){
        saveCanvas();
    }
    if(keyCode == 67){
        color++;
    }
}

let container;
let coords;
let diverge;
function setup() {
    createCanvas(X, Y);
    pixelDensity(RES);
    loadPixels();
    noStroke();
    frameRate(60);
    container = new Array(pixels.length/2);
    coords = new Array(pixels.length/2);
    diverge = new Array(pixels.length/2);
    frame();
}

function frame(){
    console.log(`MAG: ${Math.floor(4/(boundXf-boundXi))}x\n<${boundXi},${boundYi}>\n<${boundXf},${boundYf}>`);
    for(let y=0; y<Y*RES; y++){
        for(let x=0; x<X*RES; x++){
            let i = (y*X*RES+x)*2;

            container[i] = map(x, 0, X*RES, boundXi, boundXf);
            container[i+1] = map(y, 0, Y*RES, boundYf, boundYi);

            coords[i] = map(x, 0, X*RES, boundXi, boundXf);
            coords[i+1] = map(y, 0, Y*RES, boundYf, boundYi);

            diverge[i] = 0;
            diverge[i+1] = 0;
        }
    }
}

function draw() {
    drawMandelbrot();
    // noLoop();
    fill(255);
    textFont('Courier New');
}
function drawMandelbrot(){
    let xi = 0;
    let yi = 0;
    let f = frameCount;
    for(let y=0; y<Y*RES; y++){
        for(let x=0; x<X*RES; x++){
            let i = (y*X*RES+x)*2;
            xi = container[i];
            yi = container[i+1];
            let b = 0;

            if(diverge[i+1] == 0 && Math.sqrt(Math.pow(xi, 2) + Math.pow(yi, 2))<=2){
                container[i] = Math.pow(xi, 2) - Math.pow(yi, 2) + coords[i];
                container[i+1] = 2*xi*yi + coords[i+1];
            }
            else{
                if(diverge[i+1] == 0){
                    diverge[i+1] = 1;
                    diverge[i] = f;
                }
                b = map(diverge[i], 0, f, 0, 255);
            }

            let p = (y*X*RES+x)*4;
            // let b = map(Math.sqrt(Math.pow(xi, 2) + Math.pow(yi, 2)), 0 ,, 0, 255);
            if(color%3 == 0){
                pixels[p] = b;
                pixels[p+1] = b;
                pixels[p+2] = b;
                pixels[p+3] = 255; 
            }
            else if(color%3 == 1){
                pixels[p] = map(Math.pow(b,2), 0, Math.pow(255,2), 0, 255);
                pixels[p+1] = map(Math.pow(b,3), 0, Math.pow(255,3), 0, 255);
                pixels[p+2] = b/1.2;
                pixels[p+3] = 255; 
            }
            else{
                pixels[p] = 255;
                pixels[p+1] = 255;
                pixels[p+2] = 255;
                pixels[p+3] = map(Math.sqrt(b), 0, Math.sqrt(255), 0, 255);  
            }
        }
    }
    updatePixels();
}
