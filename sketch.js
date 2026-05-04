var mode = 0;
var loadMainScreen

function preload(){
  sleeping = loadImage('20240823_163722.jpeg')
  wakeup = loadImage('wake up.png')
  canon = loadImage('canon.jpg')
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  splash = new Splash();
}

function draw() {
  if (mouseIsPressed == true && splash.update() == true) {
    mode = 1;
  }
  
  if (mode == 1) {
    splash.hide();
    background(220)
    
    // your code here
    
    sleeping.resize(0,windowHeight)
    image(sleeping, (windowWidth-sleeping.width)/2, 0)
    
    wakeup.resize(0,windowHeight/3)
    image(wakeup, (windowWidth-wakeup.width)/2, 0)

    
    
    if(loadMainScreen == 1){
      canon.resize(0,windowHeight)
    image(canon, (windowWidth-canon.width)/2, 0)
    }
      
    
    
  }
}

function mousePressed() {

  let bx = (windowWidth/2)-275;
  let by = (windowHeight/4)-75;
  let bw = 570;
  let bh = 150;
  
  console.log(bx)
  
  if (mouseX > bx && mouseX < bx + bw 
       && mouseY > by && mouseY < by + bh
     ) {
     
   loadMainScreen = 1
    
  }
}


