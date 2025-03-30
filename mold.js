let moldColor = "white";
let moldSize = 0.5;

class Mold {
  constructor(randomizePosition = false) {
    //Mold variables
    if (randomizePosition) {
      this.x = random(width);
      this.y = random(height);
    } else {
      this.x = random(width / 2 - 10, width / 2 + 10);
      this.y = random(height / 2 - 10, height / 2 + 10);
    }
    // this.x = random(width);
    // this.y = random(height);
    // this.x = random(width / 2 - 20, width / 2 + 20);
    // this.y = random(height / 2 - 20, height / 2 + 20);
    this.r = moldSize;

    this.heading = random(360);
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);
    this.rotAngle = 45;
    this.stop = false;

    //Sensor variables
    this.rSensorPos = createVector(0, 0);
    this.lSensorPos = createVector(0, 0);
    this.fSensorPos = createVector(0, 0);
    this.sensorAngle = 45;
    this.sensorDist = 10;
  }

  update() {
    if (this.stop) return; // Don't update if stopped

    this.vx = cos(this.heading);
    this.vy = sin(this.heading);

    //how molds move
    // Using % Modulo expression to wrap around the canvas
    this.x = (this.x + this.vx + width) % width;
    this.y = (this.y + this.vy + height) % height;

    // Get 3 sensor positions based on current position and heading
    this.getSensorPos(this.rSensorPos, this.heading + this.sensorAngle);
    this.getSensorPos(this.lSensorPos, this.heading - this.sensorAngle);
    this.getSensorPos(this.fSensorPos, this.heading);

    // Get indices of the 3 sensor positions and get the color values from those indices
    let index, l, r, f;
    index =
      4 * (d * floor(this.rSensorPos.y)) * (d * width) +
      4 * (d * floor(this.rSensorPos.x));
    r = pixels[index];

    index =
      4 * (d * floor(this.lSensorPos.y)) * (d * width) +
      4 * (d * floor(this.lSensorPos.x));
    l = pixels[index];

    index =
      4 * (d * floor(this.fSensorPos.y)) * (d * width) +
      4 * (d * floor(this.fSensorPos.x));
    f = pixels[index];

    // Compare values of f, l, and r to determine movement
    if (f > l && f > r) {
      this.heading += 0;
    } else if (f < l && f < r) {
      if (random(1) < 0.5) {
        this.heading += this.rotAngle;
      }
    } else if (l > r) {
      this.heading += -this.rotAngle;
    } else if (r > l) {
      this.heading += this.rotAngle;
    }
  }

  display() {
    noStroke();
    fill(moldColor);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  getSensorPos(sensor, angle) {
    sensor.x = (this.x + this.sensorDist * cos(angle) + width) % width;
    sensor.y = (this.y + this.sensorDist * sin(angle) + height) % height;
  }
}

// Event Listeners
document
  .getElementById("mold-color")
  .addEventListener("change", function (event) {
    moldColor = event.target.value || "white"; // Default to white if no selection
  });

document
  .getElementById("mold-size")
  .addEventListener("change", function (event) {
    let selectedSize = parseFloat(event.target.value); // Convert the selected value to a number
    if (!isNaN(selectedSize)) {
      moldSize = selectedSize; // Update global variable
    }
  });
