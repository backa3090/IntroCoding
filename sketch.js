// --------------------- Mode + State --------------------- 

var mode = 0;
var loadMainScreen = 0;

let phase = "sleep"; 

// --------------------- Assets --------------------- 

let SLEEP, WAKE, THINKING;
let video;

let SCREAM;

let imgA, imgB;

//  --------------------- Drums --------------------- 
let drumSounds = {
  fast: null,
  medium: null,
  slow: null
};

//  --------------------- Chord Groups --------------------- 
let chordGroup1Fast, chordGroup1Medium, chordGroup1Slow;
let chordGroup2Fast, chordGroup2Medium, chordGroup2Slow;

//  --------------------- Speech --------------------- 

let speechRec;
let tempo = null;
let chords = [];

//  --------------------- Timing --------------------- 

let bpm = 120;
let beatDuration = 500;
let measureDuration = 2000;

let startTime = 0;
let lastMeasureIndex = -1;

let triggerOffset = 20; // helps remove gap in sound between each chord to create a smooth playback

//  --------------------- U.I. --------------------- 

let bubbleX = 270;
let bubbleY = 110;

let tempoY = bubbleY + 50;

let chordStartX = bubbleX + 340;
let chordY = bubbleY - 10;
let chordSpacing = 70;

function preload(){
  SLEEP = loadImage('JamSess-Sleeping.jpg');
  WAKE = loadImage('wake up.png');
  THINKING = loadImage('Tell us what to play!.jpg');
  imgA = loadImage("JamSess-Playing1.jpg");
  imgB = loadImage("JamSess-Playing2.jpg");

  SCREAM = loadSound("JamSess-Scream.mp3");

  drumSounds.fast = loadSound("JamSess-Fast_Drums.mp3");
  drumSounds.medium = loadSound("JamSess-Medium_Drums.mp3");
  drumSounds.slow = loadSound("JamSess-Slow_Drums.mp3");

  chordGroup1Fast = {
    "I7": loadSound("JamSess-Fast_Group1_I7.mp3"),
    "ii7": loadSound("JamSess-Fast_Group1_ii7.mp3"),
    "IV7": loadSound("JamSess-Fast_Group1_IV7.mp3"),
    "V7": loadSound("JamSess-Fast_Group1_V7.mp3"),
    "Fr+6": loadSound("JamSess-Fast_Group1_Fr6.mp3"),
    "Tri": loadSound("JamSess-Fast_Group1_TS.mp3")
  };

  chordGroup2Fast = {
    "I7": loadSound("JamSess-Fast_Group2_I7.mp3"),
    "ii7": loadSound("JamSess-Fast_Group2_ii7.mp3"),
    "IV7": loadSound("JamSess-Fast_Group2_IV7.mp3"),
    "V7": loadSound("JamSess-Fast_Group2_V7.mp3"),
    "Fr+6": loadSound("JamSess-Fast_Group2_Fr6.mp3"),
    "Tri": loadSound("JamSess-Fast_Group2_TS.mp3")
  };

  chordGroup1Medium = {
    "I7": loadSound("JamSess-Medium_Group1_I7.mp3"),
    "ii7": loadSound("JamSess-Medium_Group1_ii7.mp3"),
    "IV7": loadSound("JamSess-Medium_Group1_IV7.mp3"),
    "V7": loadSound("JamSess-Medium_Group1_V7.mp3"),
    "Fr+6": loadSound("JamSess-Medium_Group1_Fr6.mp3"),
    "Tri": loadSound("JamSess-Medium_Group1_TS.mp3")
  };

  chordGroup2Medium = {
    "I7": loadSound("JamSess-Medium_Group2_I7.mp3"),
    "ii7": loadSound("JamSess-Medium_Group2_ii7.mp3"),
    "IV7": loadSound("JamSess-Medium_Group2_IV7.mp3"),
    "V7": loadSound("JamSess-Medium_Group2_V7.mp3"),
    "Fr+6": loadSound("JamSess-Medium_Group2_Fr6.mp3"),
    "Tri": loadSound("JamSess-Medium_Group2_TS.mp3")
  };

  chordGroup1Slow = {
    "I7": loadSound("JamSess-Slow_Group1_I7.mp3"),
    "ii7": loadSound("JamSess-Slow_Group1_ii7.mp3"),
    "IV7": loadSound("JamSess-Slow_Group1_IV7.mp3"),
    "V7": loadSound("JamSess-Slow_Group1_V7.mp3"),
    "Fr+6": loadSound("JamSess-Slow_Group1_Fr6.mp3"),
    "Tri": loadSound("JamSess-Slow_Group1_TS.mp3")
  };

  chordGroup2Slow = {
    "I7": loadSound("JamSess-Slow_Group2_I7.mp3"),
    "ii7": loadSound("JamSess-Slow_Group2_ii7.mp3"),
    "IV7": loadSound("JamSess-Slow_Group2_IV7.mp3"),
    "V7": loadSound("JamSess-Slow_Group2_V7.mp3"),
    "Fr+6": loadSound("JamSess-Slow_Group2_Fr6.mp3"),
    "Tri": loadSound("JamSess-Slow_Group2_TS.mp3")
  };
  
  
}

function setup() { 
  createCanvas(windowWidth, windowHeight);
  splash = new Splash();

  video = createVideo("playing.mp4");
  video.hide();

  setupSpeech();
}

function draw() {
  if (mouseIsPressed == true && splash.update() == true) {
    mode = 1;
  }
  
  if (mode == 1) {
    splash.hide();
    background(220);

 
    if (phase === "sleep") {
      SLEEP.resize(0,windowHeight);
      image(SLEEP, (windowWidth-SLEEP.width)/2, 0);
      
      WAKE.resize(0,windowHeight/3);
      image(WAKE, (windowWidth-WAKE.width)/2, 0);

      if(loadMainScreen == 1){
        THINKING.resize(0,windowHeight);
        image(THINKING, (windowWidth-THINKING.width)/2, 0);
      }
    }
    
    if (phase === "thinking") {
      THINKING.resize(0,windowHeight);
      image(THINKING, (windowWidth-THINKING.width)/2, 0);

      drawTempoUI();
      drawChordSlots();
    }

    if (phase === "playing") {
    drawBPMVisuals();
    runSequencer();
}
  }
}

function mousePressed() {

  let bx = (windowWidth/2)-275;
  let by = (windowHeight/4)-75;
  let bw = 570;
  let bh = 150;

  if (mode == 1 && phase === "sleep") {
    if (mouseX > bx && mouseX < bx + bw 
         && mouseY > by && mouseY < by + bh) {
      
      loadMainScreen = 1;

      SCREAM.play();

      setTimeout(() => {
        phase = "thinking";
        startListening();
      }, 1200);
    }
  }
}

//  --------------------- Speech --------------------- 

function setupSpeech() {
  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  speechRec.continuous = true;
  speechRec.interimResults = false;
}

function startListening() {
  speechRec.start();
}

function gotSpeech() {

  if (speechRec.resultValue == false) {
    return;
  }

  let spoken = speechRec.resultString.toLowerCase();

  if (tempo == null) {

    if (spoken.includes("fast")) {
      tempo = "fast";
    }
    else if (spoken.includes("medium")) {
      tempo = "medium";
    }
    else if (spoken.includes("slow")) {
      tempo = "slow";
    }
  }

  if (chords.length < 4) {

    if (
      spoken.includes("tritone") ||
      spoken.includes("tritone sub") ||
      spoken.includes("tri tone sub")
    ) {
      chords.push("Tri");
    }

    else if (
      spoken.includes("french") ||
      spoken.includes("french augmented six") ||
      spoken.includes("f r plus 6")
    ) {
      chords.push("Fr+6");
    }

    else if (
      spoken.includes("five") ||
      spoken.includes("5") ||
      spoken.includes("five seven")
    ) {
      chords.push("V7");
    }

    else if (
      spoken.includes("four") ||
      spoken.includes("4") ||
      spoken.includes("four seven")
    ) {
      chords.push("IV7");
    }

    else if (
      spoken.includes("two") ||
      spoken.includes("2") ||
      spoken.includes("two seven")
    ) {
      chords.push("ii7");
    }

    else if (
      spoken.includes("one") ||
      spoken.includes("1") ||
      spoken.includes("one seven")
    ) {
      chords.push("I7");
    }
  }

  if (tempo == "fast" || tempo == "medium" || tempo == "slow") {

  if (chords.length == 4) {

    speechRec.stop();

    if (tempo == "fast") {
      bpm = 120;
    }
    else if (tempo == "medium") {
      bpm = 90;
    }
    else if (tempo == "slow") {
      bpm = 60;
    }

    beatDuration = 60000 / bpm;
    measureDuration = beatDuration * 4;

    startTransport();

    phase = "playing";
  }
 }
}

//  --------------------- Transport --------------------- 

function startTransport() {
  startTime = millis();
  lastMeasureIndex = -1;

  drumSounds[tempo].loop();
}

//  --------------------- Sequencer --------------------- 

function runSequencer() {
  let currentTime = millis() - startTime;
  let measureIndex = floor((currentTime + triggerOffset) / measureDuration);

  if (measureIndex < 4) {

    if (measureIndex > lastMeasureIndex) {

      lastMeasureIndex = measureIndex;

      let g1;
      let g2;

      if (tempo == "fast") {
        g1 = chordGroup1Fast;
        g2 = chordGroup2Fast;
      } 
      else if (tempo == "medium") {
        g1 = chordGroup1Medium;
        g2 = chordGroup2Medium;
      } 
      else {
        g1 = chordGroup1Slow;
        g2 = chordGroup2Slow;
      }

      let chord = chords[measureIndex];

      let sound;

      if (measureIndex < 3) {
        sound = g1[chord];
      } 
      else {
        sound = g2[chord];
      }

      if (sound) {
        sound.play();
      }
    }
  }

  // Return to Thinking
  if (measureIndex >= 4) {

    drumSounds[tempo].stop();

    tempo = null;
    chords = [];

    lastMeasureIndex = -1;

    phase = "thinking";

    startListening();
  }
}

//  --------------------- U.I. --------------------- 

function drawTempoUI() {
  let options = ["fast", "medium", "slow"];

  let positions = [
    { x: bubbleX + 200, y: bubbleY + 110 },   // FAST (bottom)
    { x: bubbleX + 200, y: bubbleY + 75},   // MEDIUM (middle)
    { x: bubbleX + 200, y: bubbleY + 40 }    // SLOW (top)
  ];

  for (let i = 0; i < options.length; i++) {
    let pos = positions[i];

    // Only draw rectangle if selected
    if (tempo === options[i]) {
      noFill();
      stroke(0);
      strokeWeight(3);
      rect(pos.x - 10, pos.y - 15, 100, 30);
    }
  }
}

function drawChordSlots() {
  textAlign(CENTER, CENTER);   
  textSize(24);                
  
  for (let i = 0; i < 4; i++) {
    let x = chordStartX + i * chordSpacing;

    noFill();
    stroke(0);
    rect(x, chordY, 60, 60);

    if (chords[i]) {
      fill(0);
      text(chords[i], x + 30, chordY + 30); 
    }
  }
}

function drawBPMVisuals() {
  let currentTime = millis() - startTime;

  // Switch Every Beat
  let beatIndex = floor(currentTime / beatDuration);

  let currentImage;

  if (beatIndex % 2 == 0) {
    currentImage = imgA;
  }
  else {
    currentImage = imgB;
  }

  image(currentImage, 0, 0, windowWidth, windowHeight);
}