console.clear();
let permissionGranted = false;
let cx, cy;

initialized = false;
var mic, recorder, player;
var sineWave;

function setup() {

    createCanvas(displayWidth, displayHeight);
    
    if( /iPhone|iPad|/i.test(navigator.userAgent) ) {
      // is mobile..
      console.log("is iOS")
    }
  
    if( /Android/i.test(navigator.userAgent) ) {
      // is mobile..
      console.log("is android OS")
    }
  
    cx = width / 2;
    cy = height / 2;
  
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      DeviceOrientationEvent.requestPermission()
        .catch(() => {
          let button = createButton("click to allow access to sensors");
          button.style("font-size", "24px");
          button.center();
          button.mousePressed(requestAccess);
          throw error;
        })
        .then(() => {
          permissionGranted = true;
        });
    } else {
      textSize(48);
      permissionGranted = true;
    }

    sineWave = new p5.Oscillator('sine')
    sineWave.start();

    getAudioContext().suspend();

}

function requestAccess() {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response == "granted") {
          permissionGranted = true;
        } else {
          permissionGranted = false;
        }
      })
      .catch(console.error);
    this.remove();
  }
  

function draw() {

    if (!permissionGranted) return;

    const dx = constrain(rotationY, -3, 3);
    const dy = constrain(rotationX, -3, 3);

    cx += dx;
    cy += dy;

    noStroke();
    fill(0, 0, 255);
    ellipse(constrain(cx, 0, windowWidth), constrain(cy, 0, windowHeight), 50, 50);

    sineWave.freq(map(cx, 0, displayWidth, 0, 1000));
    sineWave.amp(map(cx, 0, displayHeight, 0.0, 1.0));


}

function touchStarted() {
    userStartAudio();
}