console.clear();
let permissionGranted = false;
let cx, cy;
let sensorSelect;

initialized = false;
var mic, recorder, player;

var Sensor = {
    move : 0,
    shake : 1,
    turn : 2
};

var Effect = {
    non: 0,
    reverb : 1,
    delay : 2
};

var currentSensor = Sensor.shake;
var currentEffect = Effect.non;

const reverb = new Tone.Freeverb(0.8,500).toMaster();
const delay = new Tone.Delay(0.1).toDestination();

function setup() {
    createCanvas(displayWidth, displayHeight);

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

    setMoveThreshold(1);
    setShakeThreshold(30);

    // let recButton = createButton("record");
    // recButton.style("font-size", "18px");
    // recButton.center();
    // recButton.mousePressed(recBtn);
 
    sensorSelect = createSelect();
    sensorSelect.position(120, 40);
    sensorSelect.option('move');
    sensorSelect.option('shake');
    sensorSelect.option('turn');
    sensorSelect.changed(sensoorSelectEvent);

    effectSelect = createSelect();
    effectSelect.position(120, 60);
    effectSelect.option('non');
    effectSelect.option('reverb');
    effectSelect.option('delay');
    effectSelect.changed(effectSelectEvent);

}

function draw() {

    if (!permissionGranted) return;

    textSize(12);
    fill(0);
    text("再生のタイミング", 5, 21);

    textSize(12);
    fill(0);
    text("音の効果", 5, 40);
    // const dx = constrain(rotationY, -3, 3);
    // const dy = constrain(rotationX, -3, 3);
    // cx += dx;
    // cy += dy;
  
    // ellipse(constrain(cx, 0, windowWidth), constrain(cy, 0, windowHeight), 50, 50);


}

function sensoorSelectEvent() {
    let item = sensorSelect.value();

    if(item == "move"){
        currentSensor = Sensor.move;
    } else if (item == "shake") {
        currentSensor = Sensor.shake;
    } else if (item == "turn") {
        currentSensor = Sensor.turn;
    }

  }


function effectSelectEvent() {
    let item = effectSelect.value();

    if(item == "reverb"){
        currentEffect = Effect.reverb;
    } else if (item == "delay") {
        currentEffect = Effect.reverb;
    } else {

    }

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
    console.log("moved");
    if(player == "undefined")return;
    if(currentSensor == Sensor.move)return;

    if (player.state != "started"){
        player.start();
    }
  }
  
  function deviceTurned(){
      console.log("turned");
      if(player == "undefined")return;
      if(currentSensor == Sensor.turn)return;

      if (player.state != "started"){
          player.start();
      }
  }
  
  function deviceShaken(){
      console.log("shaked");
      if(player == "undefined")return;
      if(currentSensor == Sensor.shaked)return;

      if (player.state != "started"){
          player.start();
      }
  }
  
//   function deviceCollided(){
//       console.log("collide")
//       if(player == "undefined")return;
//       if (player.state != "started"){
//           player.start();
//       }
//   }

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
        player.connect(reverb);
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
