console.clear();
// let permissionGranted = false;
initialized = false;
var mic, recorder, player;

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


    // if (
    //     typeof DeviceOrientationEvent !== "undefined" &&
    //     typeof DeviceOrientationEvent.requestPermission === "function"
    // ) {
    //     DeviceOrientationEvent.requestPermission()
    //         .catch(() => {
    //             let button = createButton("click to allow access to sensors");
    //             button.style("font-size", "24px");
    //             button.center();
    //             button.mousePressed(requestAccess);
    //             throw error;
    //         })
    //         .then(() => {
    //             permissionGranted = true;
    //         });
    // } else {
    //     textSize(48);
    //     permissionGranted = true;
    // }

}

function draw() {
    // if (!permissionGranted) return;
}


// function requestAccess() {
//     DeviceOrientationEvent.requestPermission()
//       .then((response) => {
//         if (response == "granted") {
//           permissionGranted = true;
//         } else {
//           permissionGranted = false;
//         }
//       })
//       .catch(console.error);
//     this.remove();
// }

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
        recBtn.innerHTML = '<img src="assets/rec.png" height ="100" width="100" />';
    } else {
        recorder.start();
        recBtn.innerHTML = '<img src="assets/recstop.png" height ="100" width="100" />';
    }
});

// Play / Stop
playBtn.addEventListener("click", () => {
    console.log(player.state)
    if (player.state == "started") {
        player.stop();
        playBtn.innerHTML = '<img src="assets/play.png" height ="100" width="100" />';
    } else {
        player.start();
        playBtn.innerHTML = '<img src="assets/playstop.png" height ="100" width="100" />';
    }
});
