console.clear();
let permissionGranted = false;
let cx, cy;
let sensorSelect;

initialized = false;
var mic, recorder, player;

var Sensor = {
    move : 0,
    shake : 1,
    turn : 2,
    collide: 3,
    loop : 4
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
 
    sensorSelect = createSelect();
    sensorSelect.position(120, 85);
    sensorSelect.option('揺れた');
    sensorSelect.option('振られた');
    sensorSelect.option('ひっくり返った');
    sensorSelect.option('ぶつかった');
    sensorSelect.option('ループ再生');
    sensorSelect.changed(sensoorSelectEvent);

    effectSelect = createSelect();
    effectSelect.position(120, 105);
    effectSelect.option('なし');
    effectSelect.option('お風呂場');
    effectSelect.option('やまびこ');
    effectSelect.changed(effectSelectEvent);

}

function draw() {

    if (!permissionGranted) return;

    textSize(12);
    fill(255);
    text("再生のタイミング", 5, 21);

    textSize(12);
    fill(255);
    text("音の効果", 5, 40);
    const dx = constrain(rotationY, -3, 3);
    const dy = constrain(rotationX, -3, 3);
    cx = dx;
    cy = dy;
    noStroke()
    fill(0, 0, 255)
    ellipse(constrain(cx, 0, windowWidth), constrain(cy, 0, windowHeight), 15, 15);
}

function sensoorSelectEvent() {
    let item = sensorSelect.value();

    if(item == "揺れた"){
        currentSensor = Sensor.move;
    } else if (item == "振られた") {
        currentSensor = Sensor.shake;
    } else if (item == "ひっくり返った") {
        currentSensor = Sensor.turn;
    }　else if (item == "ループ再生") {
        currentSensor = Sensor.loop;
    }

  }


function effectSelectEvent() {
    let item = effectSelect.value();

    if(item == "お風呂場"){
        currentEffect = Effect.reverb;
        player.connect(reverb);
    } else if (item == "やまびこ") {
        currentEffect = Effect.reverb;
        player.connect(delay);
    } else {
        currentEffect = Effect.non;
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

    if (recorder.state == "started") {
        var data = await recorder.stop();
        var blobUrl = URL.createObjectURL(data);
        player = new Tone.Player(blobUrl, () => {
            playBtn.disabled = false;
        }).toDestination();
        recBtn.innerHTML = '<img src="assets/rec.png" height ="60" width="60" />';
    } else {
        recorder.start();
        recBtn.innerHTML = '<img src="assets/recstop.png" height ="60" width="60" />';
    }
});

// Play / Stop
playBtn.addEventListener("click", () => {
    if (player.state == "started") {
        player.stop();
        playBtn.innerHTML = '<img src="assets/play.png" height ="60" width="60" />';
    } else {
        player.start();
        playBtn.innerHTML = '<img src="assets/playstop.png" height ="60" width="60" />';
    }
});
