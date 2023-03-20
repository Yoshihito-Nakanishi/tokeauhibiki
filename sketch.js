console.clear();

initialized = false;
var mic, recorder, player;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL); // canvasの生成
    background(0);
}

function draw() {
    background(200);
    //rotateZ(radians(rotationZ));
    rotateX(radians(rotationX));
    //rotateY(radians(rotationY));
    box(200, 200, 200);
    
    if (typeof DeviceMotionEvent.requestPermission === 'function' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      // iOS 13+
      askButton = createButton('Permission');
      askButton.size(windowWidth * 6 / 8, windowHeight / 8);
      askButton.position(windowWidth / 2 - drumButton.width / 2, windowHeight / 2);
      askButton.mousePressed(() => {
        DeviceMotionEvent.requestPermission()
          .then(response => {
            if (response === 'granted') {
              window.addEventListener('devicemotion', deviceMotionHandler, true);
            }
          });
  
        DeviceOrientationEvent.requestPermission()
          .then(response => {
            if (response === 'granted') {
              window.addEventListener('deviceorientation', deviceTurnedHandler, true)
            }
          })
          .catch(console.error)
  
      })
    }
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
