'use strict';

const particleCount = 20;
const particlePropCount = 11;
const particlePropsLength = particleCount * particlePropCount;
const baseTTL = 100;
const rangeTTL = 900;
const baseSpeed = 0.1;
const rangeSpeed = .8;
const baseSize = 2;
const rangeSize = 2;
const baseHue = 300;
const rangeHue = 100;
const noiseSteps = 8;
const xOff = 0.0005;
const yOff = 0.005;
const zOff = 0.0005;
const backgroundColor = 'rgba(255, 0, 0, 0.000001)';


let container;
let canvas;
let ctx;
let center;
let gradient;
let tick;
let particleProps;
let positions;
let velocities;
let lifeSpans;
let speeds;
let sizes;
let hues;

function setup() {
	createCanvas();
  resize();
  initParticles();
	draw();
}

function initParticles() {
  tick = 0;
  particleProps = new Float32Array(particlePropsLength);
  
  for (let i = 0; i < particlePropsLength; i += particlePropCount) {
    initParticle(i);
  }
}

function initParticle(i) {
  let theta, x, y, vx, vy, life, ttl, speed, size, hue, lig, sat;

  x = rand(canvas.a.width);
  y = rand(canvas.a.height);
  theta = angle(x, y, center[0], center[1]);
  vx = cos(theta) * 2;
  vy = sin(theta) * 3;
  life = 0;
  ttl = baseTTL + rand(rangeTTL);
  speed = baseSpeed + rand(rangeSpeed);
  size = baseSize + rand(rangeSize);

    // console.log(baseHue+rand(rangeHue))

  if(baseHue+(Math.random()*rangeHue) > 366 ){
    hue = 60;
    sat = 100;
    lig = 50;
    // console.log('yellow');
  }
  else if(baseHue+(Math.random()*rangeHue) < 333 ){
    hue = 300;
    sat = 100;
    lig = 50;
    // console.log('megenta');


  }
  else{
    hue = 181;
    sat = 100;
    lig = 50;
    // console.log('cyan');

  };


  particleProps.set([x, y, vx, vy, life, ttl, speed, size, hue, lig, sat], i);
}

function drawParticles() {
  let i;

  for (i = 0; i < particlePropsLength; i += particlePropCount) {
    updateParticle(i);
  }
}

function updateParticle(i) {
  let i2=1+i, i3=2+i, i4=3+i, i5=4+i, i6=5+i, i7=6+i, i8=7+i, i9=8+i, i10=9+i, i11=10+i;
  let x, y, theta, vx, vy, life, ttl, speed, x2, y2, size, hue, lig, sat;

  x = particleProps[i];
  y = particleProps[i2];
  theta = angle(x, y, center[0], center[1]) + 0.75 * HALF_PI;
  vx = lerp(particleProps[i3], 10 * cos(theta), 0.05);
  vy = lerp(particleProps[i4], 5 * sin(theta), 0.05);
  life = particleProps[i5];
  ttl = particleProps[i6];
  speed = particleProps[i7];
  x2 = x + vx * speed;
  y2 = y + vy * speed;
  size = particleProps[i8];
  hue = particleProps[i9];
 lig = particleProps[i10];
 sat = particleProps[i11];
  drawParticle(x, y, theta, life, ttl, size, hue,lig,sat);

  life+=3;

  particleProps[i] = x2;
  particleProps[i2] = y2;
  particleProps[i3] = vx;
  particleProps[i4] = vy;
  particleProps[i5] = life;

  life > ttl && initParticle(i);
}

function drawParticle(x, y, theta, life, ttl, size, hue,lig,sat) {
  let xRel = x - (0.5 * size), yRel = y - (0.5 * size);
  
  ctx.a.save();
  ctx.a.lineCap = 'round';
  ctx.a.lineWidth = 7;
  ctx.a.strokeStyle = `hsla(${hue},${sat}%,${lig}%,${fadeInOut(life, ttl)})`;
  ctx.a.beginPath();
  ctx.a.translate(xRel, yRel);
  ctx.a.rotate(theta);
  ctx.a.translate(-xRel, -yRel);
  ctx.a.ellipse(xRel, yRel, size, size/2.2, Math.PI / 4, 0, 2 * Math.PI);
  ctx.a.stroke();
  ctx.a.closePath();
  ctx.a.restore();
}

function createCanvas() {
  container = document.querySelector('.content--canvas');
	canvas = {
		a: document.createElement('canvas'),
		b: document.createElement('canvas')
	};
	canvas.b.style = `
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	`;
	container.appendChild(canvas.b);
	ctx = {
		a: canvas.a.getContext('2d'),
		b: canvas.b.getContext('2d')
  };
  center = [];
}

function resize() {
	const { innerWidth, innerHeight } = window;
	
	canvas.a.width = innerWidth;
  canvas.a.height = innerHeight;

  ctx.a.drawImage(canvas.b, 0, 0);

	canvas.b.width = innerWidth;
  canvas.b.height = innerHeight;
  
  ctx.b.drawImage(canvas.a, 0, 0);

  center[0] = 0.5 * canvas.a.width;
  center[1] = 0.5 * canvas.a.height;
}

function renderGlow() {
 

  ctx.b.save();
  ctx.b.filter = 'blur(5px) ';
  ctx.b.drawImage(canvas.a, 0, 0);
  ctx.b.restore();


  ctx.b.save();
  ctx.b.filter = 'blur(1.25px) ';
  ctx.b.globalCompositeOperation = 'lighter';
  ctx.b.drawImage(canvas.a, 0, 0);
  ctx.b.restore();

   ctx.b.save();
  ctx.b.filter = 'blur(.6px) ';
  ctx.b.globalCompositeOperation = 'lighter';
  ctx.b.drawImage(canvas.a, 0, 0);
  ctx.b.restore();
}

function render() {
  ctx.b.save();
  ctx.b.globalCompositeOperation = 'lighter';
  ctx.b.drawImage(canvas.a, 0, 0);
  ctx.b.restore();
}

function draw() {
  tick++;

  ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
  var my = ctx.b.createLinearGradient(10, 310, 110, 50);
  my.addColorStop(0.5, "#00203FFF");
  // my.addColorSt÷op(1, "#2B86C5");
  my.addColorStop(0.5, "#ADEFD1FF");

  ctx.b.fillStyle = my;
  ctx.b.fillRect(0, 0, canvas.a.width, canvas.a.height);

  drawParticles();
  renderGlow();
  render();

	window.requestAnimationFrame(draw);
}
window.addEventListener('load', setup);
window.addEventListener('resize', resize);