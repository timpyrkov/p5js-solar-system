const CANVAS_W = 1200;
const CANVAS_H = 800;
const SUN_X = CANVAS_W / 2;
const SUN_Y = CANVAS_H / 2;

const planets = [
  { name: 'MERCURY', orbit: [74, 52], size: 8, speed: 1.55, phase: 4.0, colors: ['#d6c5aa', '#6e665f'], moons: [] },
  { name: 'VENUS', orbit: [126, 88], size: 14, speed: 1.2, phase: 5.0, colors: ['#f3cf83', '#a96f3b'], moons: [] },
  { name: 'EARTH', orbit: [184, 127], size: 15, speed: 1, phase: 0.15, colors: ['#76c9dc', '#27609b'], moons: [{ name: 'Moon', distance: 24, size: 4, speed: 3.1, phase: 1 }] },
  { name: 'MARS', orbit: [243, 168], size: 11, speed: .81, phase: 2.95, colors: ['#ee8a5e', '#8c3e2d'], moons: [{ name: 'Phobos', distance: 19, size: 2.5, speed: 4.4, phase: 0 }, { name: 'Deimos', distance: 26, size: 2, speed: 3.2, phase: 2.2 }] },
  { name: 'JUPITER', orbit: [315, 217], size: 30, speed: .44, phase: 4.75, colors: ['#ecd0a7', '#9f6951'], moons: [{ name: 'Io', distance: 41, size: 3.5, speed: 3.5, phase: 0 }, { name: 'Europa', distance: 49, size: 3, speed: 2.8, phase: 1.5 }, { name: 'Ganymede', distance: 58, size: 4.2, speed: 2.1, phase: 3 }, { name: 'Callisto', distance: 67, size: 3.8, speed: 1.65, phase: 4.4 }] },
  { name: 'SATURN', orbit: [385, 265], size: 27, speed: .325, phase: 1.25, colors: ['#f0d38f', '#aa8054'], ring: true, moons: [{ name: 'Enceladus', distance: 43, size: 2.4, speed: 2.8, phase: 2.1 }, { name: 'Titan', distance: 52, size: 4.3, speed: 2, phase: .4 }, { name: 'Rhea', distance: 61, size: 2.8, speed: 1.5, phase: 3.4 }] },
  { name: 'URANUS', orbit: [453, 311], size: 21, speed: .23, phase: 3.7, colors: ['#a5edf0', '#4b9cac'], moons: [{ name: 'Umbriel', distance: 31, size: 2.6, speed: 2.7, phase: 2.5 }, { name: 'Titania', distance: 39, size: 3, speed: 2.1, phase: 1 }, { name: 'Oberon', distance: 47, size: 2.8, speed: 1.6, phase: 4 }] },
  { name: 'NEPTUNE', orbit: [518, 356], size: 20, speed: .18, phase: .55, colors: ['#729dff', '#2348a1'], moons: [{ name: 'Triton', distance: 36, size: 3.2, speed: -1.9, phase: 2 }] }
];

const dwarfPlanets = [
  { name: 'PLUTO', orbit: [545, 374], size: 7, speed: .145, phase: 2.35, color: '#d7b99b', moon: { name: 'Charon', distance: 13, size: 3, speed: 2.2 } },
  { name: 'HAUMEA', orbit: [558, 382], size: 5, speed: .125, phase: 4.15, color: '#d7e2e9' },
  { name: 'MAKEMAKE', orbit: [570, 390], size: 5.5, speed: .11, phase: 5.55, color: '#c98f72' },
  { name: 'ERIS', orbit: [582, 397], size: 5.5, speed: .09, phase: .25, color: '#d9d5ce' }
];

let stars = [];
let asteroids = [];
let kuiperObjects = [];
let running = true;
let labelsVisible = true;
let elapsed = 0;
let speedScale = 1;
let labelScale = 1;

function setup() {
  const canvas = createCanvas(CANVAS_W, CANVAS_H);
  canvas.parent('canvas-container');
  pixelDensity(1);
  textFont('DM Mono');
  for (let i = 0; i < 240; i++) {
    stars.push({ x: random(width), y: random(height), size: random(.4, 1.7), alpha: random(35, 170), pulse: random(TWO_PI) });
  }
  randomSeed(28);
  for (let i = 0; i < 420; i++) {
    asteroids.push({ radius: random(263, 296), ratio: random(.675, .705), angle: random(TWO_PI), speed: random(.38, .58), size: random(.65, 2.2), alpha: random(45, 155) });
  }
  for (let i = 0; i < 560; i++) {
    kuiperObjects.push({ radius: random(536, 598), ratio: random(.675, .705), angle: random(TWO_PI), speed: random(.07, .16), size: random(.55, 1.85), alpha: random(22, 100) });
  }
  const speedControl = document.getElementById('speed-control');
  const labelControl = document.getElementById('label-control');
  if (labelControl) labelControl.max = 5;
  speedControl.addEventListener('input', () => {
    speedScale = Number(speedControl.value);
    document.getElementById('speed-value').value = `${speedScale.toFixed(1)}×`;
  });
  labelControl.addEventListener('input', () => {
    labelScale = Number(labelControl.value);
    document.getElementById('label-value').value = `${round(labelScale * 100)}%`;
  });
}

function draw() {
  background(3, 7, 17);
  if (running) elapsed += min(deltaTime, 40) / 1000 * speedScale;
  drawSpace();
  drawBelts();
  drawOrbits();
  drawSun();
  planets.forEach(drawPlanet);
  drawDwarfPlanets();
  drawInterface();
}

function drawSpace() {
  noStroke();
  for (const star of stars) {
    const shimmer = sin(elapsed * .9 + star.pulse) * 25;
    fill(205, 220, 255, star.alpha + shimmer);
    circle(star.x, star.y, star.size);
  }
  drawingContext.save();
  drawingContext.globalCompositeOperation = 'screen';
  for (let i = 0; i < 4; i++) {
    fill(30, 55, 100, 7);
    ellipse(SUN_X + (i - 1.5) * 170, SUN_Y, 570, 300);
  }
  drawingContext.restore();
}

function drawBelts() {
  noStroke();
  for (const asteroid of asteroids) {
    const angle = asteroid.angle + elapsed * asteroid.speed * .18;
    const x = SUN_X + cos(angle) * asteroid.radius;
    const y = SUN_Y + sin(angle) * asteroid.radius * asteroid.ratio;
    fill(181, 164, 140, asteroid.alpha);
    circle(x, y, asteroid.size);
  }
  for (const object of kuiperObjects) {
    const angle = object.angle + elapsed * object.speed * .18;
    const x = SUN_X + cos(angle) * object.radius;
    const y = SUN_Y + sin(angle) * object.radius * object.ratio;
    fill(151, 177, 202, object.alpha);
    circle(x, y, object.size);
  }
  const ceresAngle = elapsed * .5 * .18 + 3.45;
  const ceresX = SUN_X + cos(ceresAngle) * 279;
  const ceresY = SUN_Y + sin(ceresAngle) * 192;
  fill('#b9aea0');
  circle(ceresX, ceresY, 7);
  if (labelsVisible) drawLabel('CERES', ceresX, ceresY + 12, '#b9aea0', true);
}

function drawOrbits() {
  noFill();
  strokeWeight(1);
  planets.forEach((planet, index) => {
    stroke(115, 141, 180, index % 2 ? 24 : 34);
    ellipse(SUN_X, SUN_Y, planet.orbit[0] * 2, planet.orbit[1] * 2);
  });
}

function drawSun() {
  drawingContext.save();
  drawingContext.shadowColor = '#ffb537';
  drawingContext.shadowBlur = 55;
  noStroke();
  fill(255, 166, 46, 28);
  circle(SUN_X, SUN_Y, 112 + sin(elapsed * 1.8) * 5);
  drawingContext.shadowBlur = 25;
  for (let diameter = 76; diameter > 10; diameter -= 3) {
    const amount = map(diameter, 76, 10, 0, 1);
    fill(lerpColor(color('#f59d25'), color('#fff8c7'), amount));
    circle(SUN_X, SUN_Y, diameter);
  }
  drawingContext.restore();
  if (labelsVisible) drawLabel('SUN', SUN_X, SUN_Y + 61, '#ffd178', true);
}

function drawPlanet(planet) {
  const angle = elapsed * planet.speed * .18 + planet.phase;
  const x = SUN_X + cos(angle) * planet.orbit[0];
  const y = SUN_Y + sin(angle) * planet.orbit[1];

  drawMoons(planet, x, y);
  if (planet.ring) drawRing(x, y, planet.size, true);

  drawingContext.save();
  drawingContext.shadowColor = planet.colors[0];
  drawingContext.shadowBlur = 8;
  noStroke();
  for (let diameter = planet.size * 2; diameter > 1; diameter -= 2) {
    const amount = map(diameter, planet.size * 2, 1, 0, 1);
    fill(lerpColor(color(planet.colors[1]), color(planet.colors[0]), amount));
    circle(x, y, diameter);
  }
  drawingContext.restore();

  stroke(255, 255, 255, 34);
  strokeWeight(1);
  line(x - planet.size * .55, y - planet.size * .6, x + planet.size * .15, y - planet.size * .85);
  if (planet.ring) drawRing(x, y, planet.size, false);
  if (labelsVisible) drawLabel(planet.name, x, y + planet.size + 16, '#d8deea', true);
}

function drawMoons(planet, planetX, planetY) {
  planet.moons.forEach((moon, index) => {
    const moonAngle = elapsed * moon.speed * .55 + moon.phase;
    const moonX = planetX + cos(moonAngle) * moon.distance;
    const moonY = planetY + sin(moonAngle) * moon.distance * .58;
    noFill();
    stroke(180, 195, 220, 26);
    ellipse(planetX, planetY, moon.distance * 2, moon.distance * 1.16);
    noStroke();
    fill(208, 213, 219);
    circle(moonX, moonY, moon.size * 2);
    if (labelsVisible) drawLabel(moon.name, moonX + 6, moonY - 6 - index * 2, '#7f899b', false);
  });
}

function drawDwarfPlanets() {
  dwarfPlanets.forEach(dwarf => {
    const angle = elapsed * dwarf.speed * .18 + dwarf.phase;
    const x = SUN_X + cos(angle) * dwarf.orbit[0];
    const y = SUN_Y + sin(angle) * dwarf.orbit[1];
    noFill();
    stroke(130, 160, 190, 15);
    ellipse(SUN_X, SUN_Y, dwarf.orbit[0] * 2, dwarf.orbit[1] * 2);
    noStroke();
    fill(dwarf.color);
    circle(x, y, dwarf.size * 2);
    if (dwarf.moon) {
      const moonAngle = elapsed * dwarf.moon.speed * .55;
      const moonX = x + cos(moonAngle) * dwarf.moon.distance;
      const moonY = y + sin(moonAngle) * dwarf.moon.distance * .58;
      fill('#aeb4bc');
      circle(moonX, moonY, dwarf.moon.size * 2);
      if (labelsVisible) drawLabel(dwarf.moon.name, moonX + 5, moonY - 6, '#7f899b', false);
    }
    if (labelsVisible) drawLabel(dwarf.name, x, y + dwarf.size + 13, '#c6d0dc', true);
  });
}

function drawRing(x, y, size, behind) {
  noFill();
  strokeWeight(behind ? 5 : 2);
  stroke(218, 190, 133, behind ? 85 : 145);
  if (behind) arc(x, y, size * 3.05, size * .9, PI, TWO_PI);
  else arc(x, y, size * 3.05, size * .9, 0, PI);
}

function drawLabel(label, x, y, labelColor, primary) {
  noStroke();
  fill(labelColor);
  textAlign(primary ? CENTER : LEFT, CENTER);
  textSize((primary ? 9 : 7) * labelScale);
  textStyle(primary ? BOLD : NORMAL);
  text(label, x, y);
}

function drawInterface() {
  noStroke();
  fill(255, 255, 255, 45);
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  textSize(8);
  text(`SIMULATION TIME  ${elapsed.toFixed(1).padStart(6, '0')} S`, 22, 20);
  textAlign(RIGHT, TOP);
  text(running ? '●  LIVE ORBIT' : 'Ⅱ  PAUSED', width - 22, 20);
}

function keyPressed() {
  if (key === ' ') running = !running;
  if (key === 'l' || key === 'L') labelsVisible = !labelsVisible;
  return false;
}
