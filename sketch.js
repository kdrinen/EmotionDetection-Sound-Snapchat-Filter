var ctracker;
var ec;
var emotionData;
var mic;
var amp;
var song;
var k=5/8;
var angle = 0.0;

var volhistory = [];


function setup() {
    // setup camera capture
    var videoInput = createCapture();
    imageMode(CENTER)
    videoInput.size(400, 300);
    videoInput.position(500, 330);

    // setup canvas
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.position(500, 330);
    // setup tracker
    ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.start(videoInput.elt);
    noStroke();
    //set up mic
    angleMode(DEGREES);
    mic = new p5.AudioIn();
    mic.start();
    amp = new p5.Amplitude();

    ec = new emotionClassifier() //from the emiton_classifier.js
    ec.init(emotionModel) //from the emotionmodel.js file attached in index.js
    emotionData = ec.getBlank();
    // console.log(emotionData);

}

function draw() {
    clear();
    // get array of face marker positions [x, y] format
    var positions = ctracker.getCurrentPosition(); // for the positioning of the face
    var cp = ctracker.getCurrentParameters(); //for the detection of the emotion
    var emotionData = ec.meanPredict(cp); //for the guess at what emotion

    if(emotionData){
  // console.log('angry:' + emotionData[0].value)
  if(emotionData[0].value > 0.4){
    fill(153, 6, 0);
  }
  // console.log('sad:' + emotionData[1].value)
  if(emotionData[1].value > 0.4){
    fill(121, 191, 204);
  }
  // console.log('surprised:' + emotionData[2].value)
  if(emotionData[2].value > 0.4){
    fill(255, 173, 0);
  }
  // console.log('happy:' + emotionData[3].value)
  if(emotionData[3].value > 0.4){
    fill(254, 255, 24);
  }
}

for (var i = 0; i < emotionData.length; i++) {
  if(emotionData[i].value > 0.4){
    // console.log(emotionData[i].emotion);
  }

}

  //sound
  var vol = mic.getLevel();
  volhistory.push(vol);
  stroke(0);
  strokeWeight(3)

  for (var p = 0; p < positions.length; p++) {
        soundCircle(0, positions[27][0], positions[27][1])
        soundCircle(0, positions[32][0], positions[32][1])
    }
    // console.log(positions[27]);



}

function soundCircle(r,x,y){
    push()
    translate(x,y)
    beginShape()
    for (var i = 0; i < 360; i++){
      var r = map(volhistory[i],0,1,10,35);
      var x = r * cos(i);
      var y = r * sin(i);
      vertex(x, y);
    }
    endShape();
    pop()
    // console.log(x,y);

    if (volhistory.length > 360){
      volhistory.splice(0,1);
    }

}
