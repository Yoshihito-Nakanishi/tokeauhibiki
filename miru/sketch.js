
var mic, fft, reverb;

function setup() {
    createCanvas(displayWidth, displayHeight);
    noFill();

    // カラーモードの指定方法をHSB(hue, saturation, brightness) に
    colorMode(HSB, 255);

    // 四角形の描画位置指定を中央の座標に設定
    rectMode(CENTER);

    //オーディオ入力の設定
    mic = new p5.AudioIn();
    mic.start();

    //FFTの設定
	fft = new p5.FFT(0.8, 256);
    fft.setInput(mic);
    getAudioContext().suspend();

}

function draw() {
    background(0);

    //FFT結果の描画
    var spectrum = fft.analyze();

    for (var i = 0; i < spectrum.length; i++) {

        // 描画色を設定
        let hue = map(i, 0, spectrum.length - 1, 0, 255);
        fill(hue, 255, 255);

        // 周波数の帯域順にグラフを描画する
        var x = map(i, 0, spectrum.length, 0, displayWidth);
        var h = -displayHeight + map(spectrum[i], 0, 255, displayHeight, 0);
        rect(x, displayHeight, displayWidth / spectrum.length, h);

    }
}


function touchStarted() {
    userStartAudio();
}