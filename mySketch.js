let mic, recorder, soundFile;
let isUserStarted = false;
let canvas;
var fft;

var State = {
	  userPermission : 0,
    waiting : 1,
    recording : 2,
    recorded : 3,
		playing : 4
};

var currentState = State.userPermission;

function setup() {
	getAudioContext().suspend();
	  soundFormats('mp3', 'ogg');

    canvas = createCanvas(windowWidth, windowHeight);
	
		colorMode(HSB, 255);
	// 四角形の描画位置指定を中央の座標に設定
	rectMode(CENTER);
		// 枠を描画しない
  noStroke();
    background(0);

    // p5.AudioInオブジェクトを作成
    mic = new p5.AudioIn();
	
    // p5.SoundRecorderオブジェクトを作成
    recorder = new p5.SoundRecorder();
  
	// 空のp5.SoundFileオブジェクトを作成。録音した音の再生に使用する
    soundFile = new p5.SoundFile();
	  // getAudioContext().suspend();
 
	// fftで解析
  fft = new p5.FFT(0.8, 128);


}

function draw(){
	
  background(0);

	if (currentState == State.userPermission) {
		fill(255);
    	text('タップして録音を許可！', windowWidth/2, windowHeight/4);
	} else if (currentState == State.waiting) {
		fill(255);
        text('タップして録音を開始！', windowWidth/2, windowHeight/4);
	} else if (currentState == State.recording){
		    fill(255);
        text('タップして録音を終了！', windowWidth/2, windowHeight/4);
				drawSpectrum();
	} else if (currentState == State.recorded) {
		    fill(255);
        text('タップして再生&保存', windowWidth/2, windowHeight/4);
	} else if (currentState == State.playing){
				    fill(255);
		        text('もう一度録音する', windowWidth/2, windowHeight/4);
				drawSpectrum();
	}
	
}

function drawSpectrum(){
		//スペクトルを描画
	var spectrum = fft.analyze();
	for (var i = 0; i < spectrum.length; i++) {

		// 描画色を設定
		let hue = map(i, 0, spectrum.length - 1, 0, 255);
		fill(hue, 255, 150);

		// 周波数の帯域順にグラフを描画する
		var x = map(i, 0, spectrum.length, 0, windowWidth);
		var h = -windowHeight + map(spectrum[i], 0, 255, windowHeight, 0);
		rect(x, windowHeight, windowWidth / spectrum.length, h);

  }
}

function touchStarted() {
    if (!isUserStarted) {
        userStartAudio().then(() => {
            // オーディオ入力処理を開始
            mic.start();
            // マイクをレコーダーに接続
            recorder.setInput(mic);
            canvas.mousePressed(recordAndSave)
					  currentState = State.waiting;
        });
        isUserStarted = true;
    }
}

function recordAndSave() {

    if (currentState == State.waiting && mic.enabled) {
				fft.setInput(mic);
        recorder.record(soundFile);
        currentState = State.recording;
    }
    else if (currentState == State.recording) {
			  fft.setInput(soundFile);
        recorder.stop();
        currentState = State.recorded;
    }
    else if (currentState == State.recorded) {
        soundFile.play();
        saveSound(soundFile, 'recorded.wav');
        currentState = State.playing;
    } else if (currentState == State.playing) {
        currentState = State.waiting;
    }
}

