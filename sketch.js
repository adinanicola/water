const frmLen = 60;
let initPoints = [];
let points = [];
let wave = [];

// Variables for the moving ellipse
let balls = []; 
let intersecting = false;


function setup() {
  createCanvas(400, 400);
  pixelDensity(1);

  for (let i = 0; i < 2; i++) {
    balls.push({
      position: createVector(random(width), height / 2),
      velocity: p5.Vector.random2D().setMag(random(0.5, 0.8)),
      amplitude: random(10, 30),
      angularVelocity: random(0.02, 0.1),
      angle: 0,
    });
  }

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

  intersecting = checkIntersection(balls[0], balls[1]); // Check if balls are intersecting

  balls.forEach((ball, index) => {
    let yOffset = sin(ball.angle) * ball.amplitude;
    ball.position.add(ball.velocity);
    boundaryCheck(ball);

     // Change fill based on intersection
     if (intersecting) {
      fill(186, 163, 63, 100);
    } else {
      fill(186, 163, 63);
    }

    noStroke();
    ellipse(ball.position.x, ball.position.y + yOffset, 80, 80);
    ball.angle += ball.angularVelocity;
  });
}

function boundaryCheck(ball) {
  if (ball.position.x > width || ball.position.x < 0) {
    ball.velocity.x *= -1;
    ball.position.x = constrain(ball.position.x, 0, width);
  }
  if (ball.position.y > height || ball.position.y < 0) {
    ball.velocity.y *= -1;
    ball.position.y = constrain(ball.position.y, 0, height);
  }
}

// Function to check if balls are intersecting
function checkIntersection(ball1, ball2) {
  let distance = dist(ball1.position.x, ball1.position.y, ball2.position.x, ball2.position.y);
  return distance < 80; // Since the diameter is 40, radius is 20, and we're checking for 2 radii
}


function waveColor(x, a, b, e) {
  if (x < 0) return b;
  else return Math.pow(x / a, e) + b;
}
