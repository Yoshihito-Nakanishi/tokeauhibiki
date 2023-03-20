console.clear();
let permissionGranted = false;
let cx, cy;

initialized = false;
var mic, recorder, player;

function setup() {
    createCanvas(windowWidth, windowHeight);


    if (/iPhone|iPad|/i.test(navigator.userAgent)) {
        // is mobile..
        console.log("is iOS")
    }

    if (/Android/i.test(navigator.userAgent)) {
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
}

function draw() {
    background(200);
    if (!permissionGranted) return;
    const dx = constrain(rotationY, -3, 3);
    const dy = constrain(rotationX, -3, 3);
    cx += dx;
    cy += dy;
  
    ellipse(cx, cy, 50, 50);
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
  
  function deviceMoved(){
    
  }
  
  function deviceTurned(){
    
  }
  
  function deviceShaken(){
    
  }

// bind the interface
const recBtn = document.getElementById("start_btn");
const playBtn = document.getElementById("play_btn");

// Disable the rec button if UserMedia is not supported
recBtn.disabled = !Tone.UserMedia.supported;

// Rec / Stop
recBtn.addEventListener("click", async () => {
    Tone.context.resume(); // https://github.com/Tonejs/Tone.js/issues/341

    //   Initlization
    if (!initialized) {
        mic = new Tone.UserMedia();
        recorder = new Tone.Recorder();
        mic.connect(recorder);
        mic.open();
        initialized = true;
    }

    if (recBtn.innerText == "Stop") {
        var data = await recorder.stop();
        var blobUrl = URL.createObjectURL(data);
        player = new Tone.Player(blobUrl, () => {
            playBtn.disabled = false;
        }).toDestination();
        recBtn.innerText = "Record";
    } else {
        recorder.start();
        recBtn.innerText = "Stop";
    }
});

// Play / Stop
playBtn.addEventListener("click", () => {
    if (playBtn.innerText == "Stop") {
        player.stop();
        playBtn.innerText = "Play";
    } else {
        player.start();
        playBtn.innerText = "Stop";
    }
});
