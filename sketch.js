const frmLen = 60;
let initPoints = [];
let points = [];
let wave = [];

// Variables for the moving ellipse
let position; // Variable to store the position of the ellipse as a vector
let velocity; // Vector to store the velocity direction of the ellipse
let angle = 0.0; // Angle for the sine wave calculation
let amplitude = 20; // Height of the wave
let speed = 0.05; // How fast the wave moves
let movementSpeed = 1; // Constant speed for the ball's movement

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  stroke(255);
  strokeWeight(12);
  pixelDensity(1);

  // Initialize moving ellipse
  position = createVector(width / 2, height / 2);
  velocity = p5.Vector.random2D();
  velocity.setMag(movementSpeed);

  randomSeed(70);
  for (let i = 0; i < 36; i++) {
    initPoints.push(createVector(random(width), random(height)));
  }

  for (let f = 0; f < frmLen; f++) {
    points.push([]);
    for (let i = 0; i < initPoints.length; i++) {
      let pX = 50 * sin(f * 360 / frmLen + 6 * initPoints[i].x) + initPoints[i].x;
      let pY = 50 * cos(f * 360 / frmLen + 6 * initPoints[i].y) + initPoints[i].y;
      points[f].push(createVector(pX, pY));
    }
  }

  // Precompute wave frames based on original logic for visual effect
  for (let f = 0; f < frmLen; f++) {
    wave.push([]);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let distances = [];
        for (let i = 0; i < points[f].length; i++) {
          let d = (x - points[f][i].x) ** 2 + (y - points[f][i].y) ** 2;
          distances[i] = d;
        }
        let sorted = sort(distances);
        let noise = Math.sqrt(sorted[0]);
        let index = (x + y * width) * 4;

        // Using the original color logic to maintain visual effect
         wave[f][index+0] = waveColor(noise, 14.5, 44, 2.5);
         wave[f][index+1] = waveColor(noise, 21, 169, 2.5);
         wave[f][index+2] = waveColor(noise, 40, 225, 3.0);
         wave[f][index + 3] = 255;
      }
    }
    console.log('Generating frame data: ' + (f + 1) + '/' + frmLen);
  }
}

function draw() {
  let frameIndex = frameCount % frmLen;

  // Display the precomputed wave frame
  loadPixels();
  for (let i = 0; i < wave[frameIndex].length; i++) {
    pixels[i] = wave[frameIndex][i];
  }
  updatePixels();

  // Moving ellipse logic
  let yoffset = sin(angle) * amplitude;
  ellipse(position.x, position.y + yoffset, 50, 50);
  angle += speed;
  position.add(velocity);

  // Reverse direction if it hits the canvas edges
  if (position.x > width || position.x < 0) {
    velocity.x *= -1;
  }
  if (position.y > height || position.y < 0) {
    velocity.y *= -1;
  }
}

function waveColor(x, a, b, e) {
  if (x < 0) return b;
  else return Math.pow(x / a, e) + b;
}

