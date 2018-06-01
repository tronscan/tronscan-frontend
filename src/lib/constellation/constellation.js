export class Star {
  constructor(constellation) {
    this.x = random(0 + constellation.starRadius, constellation.canvas.width - constellation.starRadius);
    this.y = random(0 + constellation.starRadius, constellation.canvas.height - constellation.starRadius);
    this.r = constellation.starRadius * random(1 - constellation.starRadiusJitter, 1 + constellation.starRadiusJitter);
    this.context = constellation.context;
    this.hue = constellation.foregroundHue + random(1, 360) * constellation.foregroundHueJitter * plusOrMinus();
    this.saturation = constellation.foregroundSaturation * random(1 - constellation.foregroundSaturationJitter, 1 + constellation.foregroundSaturationJitter);
    this.lightness = constellation.foregroundLightness * random(1 - constellation.foregroundLightnessJitter, 1 + constellation.foregroundLightnessJitter);
    this.opacity = 100;
    this.constellation = constellation;
    this.vx = constellation.starVelocity * random(1 - constellation.starVelocityJitter, 1 + constellation.starVelocityJitter) * plusOrMinus();
    this.vy = constellation.starVelocity * random(1 - constellation.starVelocityJitter, 1 + constellation.starVelocityJitter) * plusOrMinus();
  }

  connections() {
    var neighbors = [];
    var t;
    for (var i = 0; i < this.constellation.stars.length; i++) {
      if (
        this.constellation.stars[i] !== this &&
        Math.abs(this.x - this.constellation.stars[i].x) < this.constellation.connectionRadius &&
        Math.abs(this.y - this.constellation.stars[i].y) < this.constellation.connectionRadius
      ) {
        neighbors.push(this.constellation.stars[i]);
      }
    }
    this.opacity = neighbors.length / 10;
    for (var i = 0; i < neighbors.length; i++) {
      t = this.constellation.connectionOpacity;
      if (
        Math.abs(this.x - this.constellation.mx) < this.constellation.revealRadius &&
        Math.abs(this.y - this.constellation.my) < this.constellation.revealRadius
      ) {
        t += 1 - ((Math.abs(this.x - this.constellation.mx) + Math.abs(this.y - this.constellation.my)) / 2) / this.constellation.revealRadius;
      }
      this.context.beginPath();
      this.context.moveTo(this.x, this.y);
      this.context.lineTo(neighbors[i].x, neighbors[i].y);
      this.context.strokeStyle = 'hsla(' + this.hue + ',' + this.saturation + '%,' + this.lightness + '%,' + t + ')';
      this.context.lineWidth = this.constellation.connectionWidth;
      this.context.stroke();
      this.context.closePath();
    }

  }

  move() {
    if (this.x <= 0 + this.r || this.x >= this.constellation.canvas.width) this.vx = -this.vx;
    if (this.y <= 0 + this.r || this.y >= this.constellation.canvas.height) this.vy = -this.vy;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    this.move();
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.context.fillStyle = 'hsla(' + this.hue + ',' + this.saturation + '%,' + this.lightness + '%,' + (0.1 + this.opacity) + ')';
    this.context.fill();
    this.context.closePath();
  }
}

class Constellation {
  constructor(elementID,
              starDensity,
              starRadius,
              starRadiusJitter,
              starVelocity,
              starVelocityJitter,
              connectionRadius,
              connectionWidth,
              connectionOpacity,
              revealRadius,
              backgroundHue,
              backgroundSaturation,
              backgroundLightness,
              foregroundHue,
              foregroundSaturation,
              foregroundLightness,
              foregroundHueJitter,
              foregroundSaturationJitter,
              foregroundLightnessJitter,
              responsive) {
    constellationCount++;
    this.e = typeof elementID === 'string' ? document.getElementById(elementID) : elementID;
    this.e.innerHTML = `<canvas id="constellation-canvas-${constellationCount}"></canvas>`;
    this.canvas = document.getElementById('constellation-canvas-' + constellationCount);
    this.context = this.canvas.getContext('2d');

    this.canvas.style.backgroundColor = 'hsl(' + backgroundHue + ',' + backgroundSaturation + '%,' + backgroundLightness + '%)';
    this.canvas.style.display = 'block';

    this.starDensity = starDensity;
    this.starRadius = starRadius;
    this.starRadiusJitter = starRadiusJitter;
    this.starVelocity = starVelocity;
    this.starVelocityJitter = starVelocityJitter;
    this.connectionRadius = connectionRadius;
    this.connectionWidth = connectionWidth;
    this.connectionOpacity = connectionOpacity;
    this.revealRadius = revealRadius;
    this.foregroundHue = foregroundHue;
    this.foregroundSaturation = foregroundSaturation;
    this.foregroundLightness = foregroundLightness;
    this.foregroundHueJitter = foregroundHueJitter;
    this.foregroundSaturationJitter = foregroundSaturationJitter;
    this.foregroundLightnessJitter = foregroundLightnessJitter;
    this.responsive = responsive;
    this.mouseInteractions = true;
    this.mx = 0;
    this.my = 0;
    this.resize();
    this.fill();

  }

  fill() {
    this.stars = new Array();
    for (var i = 0; i < this.numberOfStars; i++) {
      this.stars.push(new Star(this));
    }
  }

  mouse(evt) {
    var rect = this.canvas.getBoundingClientRect();
    this.mx = evt.clientX - rect.left;
    this.my = evt.clientY - rect.top;
  }

  resize() {
    if (this.responsive) {
      this.canvas.width = this.e.offsetWidth;
      this.canvas.height = this.e.offsetHeight;
      this.numberOfStars = this.starDensity * (this.e.offsetWidth * this.e.offsetHeight) / 5000;
      this.fill();
    }
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let star of this.stars) {
      star.connections();
    }
    for (let star of this.stars) {
      star.draw();
    }
  }
}

var constellationCount = 0;
var constellationPresets = [
  {
    name: "default",
    properties: [2, 1, 0.5, 0.03, 0.1, 70, 0.5, 0.1, 100, 0, 0, 2, 0, 0, 30, 0, 0, 0.2, true]
  },
  {
    name: "Starry Night",
    properties: [1, 1, 0.5, 0.2, 0.2, 70, 1, 0.02, 100, 240, 50, 2, 200, 30, 70, 0, 0, 0, true]
  },
  {
    name: "Hot Sparks",
    properties: [5, 0.5, 0.1, 0.05, 0.5, 30, 0.5, 0, 120, 0, 100, 2, 15, 100, 60, 0.1, 0, 0, true]
  },
  {
    name: "Flying Stuff",
    properties: [3, 0.5, 0, 0.2, 0.3, 20, 2, 1, 250, 141, 89, 79, 0, 0, 100, 0, 0, 0, true]
  },
  {
    name: "Clown Car",
    properties: [1, 10, 0.5, 0.2, 0.5, 70, 3, 0.02, 100, 100, 100, 100, 200, 80, 70, 5, 0, 0, true]
  },
  {
    name: "Love Is In The Air",
    properties: [2, 10, 0.5, 0.2, 0.2, 90, 1.5, 0.05, 100, 320, 100, 95, 320, 80, 90, 0.05, 0, 0.04, true]
  },
  {
    name: "Azure Pop",
    properties: [1, 1, 0.5, 0.2, 0.2, 90, 0.5, 0.05, 100, 179, 46, 93, 307, 79, 58, 0, 0, 0, true]
  },
  {
    name: "Fresh Turboscent",
    properties: [1, 1, 0.5, 0.2, 0.2, 90, 0.5, 0.1, 100, 187, 78, 31, 61, 25, 80, 0, 0, 0, true]
  },
  {
    name: "Man of Steel",
    properties: [1, 1, 0.5, 0.2, 0.2, 90, 0.5, 0.3, 100, 233, 94, 10, 358, 98, 24, 0, 0, 0, true]
  }
];
let instances = [];

// CONSTELLATION CONSTRUCTORS

export function constellation(elementID) {
  constellationPreset(elementID, 'default');
}

function constellationFull(elementID, starDensity, starRadius, starRadiusJitter, starVelocity, starVelocityJitter, connectionRadius, connectionWidth, connectionOpacity, revealRadius, backgroundHue, backgroundSaturation, backgroundLightness, foregroundHue, foregroundSaturation, foregroundLightness, foregroundHueJitter, foregroundSaturationJitter, foregroundLightnessJitter, responsive) {
  instances.push(new Constellation(elementID, starDensity, starRadius, starRadiusJitter, starVelocity, starVelocityJitter, connectionRadius, connectionWidth, connectionOpacity, revealRadius, backgroundHue, backgroundSaturation, backgroundLightness, foregroundHue, foregroundSaturation, foregroundLightness, foregroundHueJitter, foregroundSaturationJitter, foregroundLightnessJitter, responsive));
}

export function constellationPreset(elementID, presetName) {
  var preset = presetLookup(presetName, constellationPresets);
  instances.push(new Constellation(
    elementID,
    preset.properties[0],
    preset.properties[1],
    preset.properties[2],
    preset.properties[3],
    preset.properties[4],
    preset.properties[5],
    preset.properties[6],
    preset.properties[7],
    preset.properties[8],
    preset.properties[9],
    preset.properties[10],
    preset.properties[11],
    preset.properties[12],
    preset.properties[13],
    preset.properties[14],
    preset.properties[15],
    preset.properties[16],
    preset.properties[17],
    preset.properties[18]
  ));
}

function constellationRandom(elementID) {
  constellationPreset(elementID, 'random');
}

function constellationHue(elementID, hue) {
  var defaultPreset = presetLookup('default', constellationPresets);
  var preset = {
    name: 'hue',
    properties: [defaultPreset.properties[0], defaultPreset.properties[1], defaultPreset.properties[2], defaultPreset.properties[3], defaultPreset.properties[4], defaultPreset.properties[5], defaultPreset.properties[6], 0.05, defaultPreset.properties[8], hue, 100, 2, hue, 70, 50, 0.05, 0, 0, true]
  };
  instances.push(new Constellation(elementID, preset.properties[0], preset.properties[1], preset.properties[2], preset.properties[3], preset.properties[4], preset.properties[5], preset.properties[6], preset.properties[7], preset.properties[8], preset.properties[9], preset.properties[10], preset.properties[11], preset.properties[12], preset.properties[13], preset.properties[14], preset.properties[15], preset.properties[16], preset.properties[17], preset.properties[18]));
}


export function clearConstellations() {
  instances = [];
}

function constellationHSL(elementID, bhue, bsat, blig, fhue, fsat, flig) {
  var defaultPreset = presetLookup('default', constellationPresets);
  var preset = {
    name: 'hue',
    properties: [defaultPreset.properties[0], defaultPreset.properties[1], defaultPreset.properties[2], defaultPreset.properties[3], defaultPreset.properties[4], defaultPreset.properties[5], defaultPreset.properties[6], 0.05, defaultPreset.properties[8], bhue, bsat, blig, fhue, fsat, flig, 0.07, 0, 0, true]
  };
  instances.push(new Constellation(elementID, preset.properties[0], preset.properties[1], preset.properties[2], preset.properties[3], preset.properties[4], preset.properties[5], preset.properties[6], preset.properties[7], preset.properties[8], preset.properties[9], preset.properties[10], preset.properties[11], preset.properties[12], preset.properties[13], preset.properties[14], preset.properties[15], preset.properties[16], preset.properties[17], preset.properties[18]));
}

function presetLookup(presetName, presetsCollection) {
  if (presetName === 'random') {
    return {
      name: 'random',
      properties: [
        random(0.5, 2),
        random(0.5, 2),
        random(0, 0.99),
        random(0.01, 0.5),
        random(0, 1),
        random(20, 100),
        random(0.1, 5),
        random(0, 0.01),
        random(50, 200),
        random(0, 360),
        random(0, 100),
        random(0, 100),
        random(0, 360),
        random(0, 100),
        random(0, 100),
        random(0, 1),
        random(0, 1),
        random(0, 1),
        true
      ]
    };
  }
  var found = false;
  var index = 0;
  for (var i = 0; i < presetsCollection.length; i++) {
    if (presetsCollection[i].name === presetName) {
      found = true;
      index = i;
    }
  }
  if (found) return presetsCollection[index];
  else return presetsCollection[0];
}

// EVENT LISTENERS
function isVisible(e) {
  return !!( e.offsetWidth || e.offsetHeight || e.getClientRects().length );
}

function drawAll() {
  for (let instance of instances) {
    instance.draw();
  }

  // setTimeout(drawAll, 16);

  requestAnimationFrame(drawAll);
}

drawAll();

window.addEventListener('mousemove', function (evt) {
  for (let instance of instances) {
    if (instance.mouseInteractions) {
      instance.mouse(evt);
    }
  }
}, false);

window.addEventListener('resize', function () {
  for (let instance of instances) {
    if (instance.responsive) {
      instance.resize();
    }
  }
}, false);


// HELPERS

function random(min, max) {
  return min + Math.random() * (max - min);
}

function plusOrMinus() {
  if (Math.random() > 0.5) return -1;
  else return 1;
}
