import utils from "./utils";
import { gsap } from "gsap";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
console.log(gsap);

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};
const center = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};
const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];
let angle = 0;

// Event Listeners
addEventListener("mousemove", (e) => {
  gsap.to(mouse, {
    x: e.clientX - canvas.width / 2,
    y: e.clientY - canvas.height / 2,
    duration: 1.2,
  });

  angle = Math.atan2(mouse.y, mouse.x);
  // console.log(angle);
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

// Objects
class Particle {
  constructor(x, y, radius, color, distanceFromCenter) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.distanceFromCenter = distanceFromCenter;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.x = center.x + this.distanceFromCenter * Math.cos(angle);
    this.y = center.y + this.distanceFromCenter * Math.sin(angle);
  }
}

// Implementation of kught
let particles;
function init() {
  particles = [];

  for (let i = 0; i < 200; i++) {
    const x = center.x + i * Math.cos(0);
    const y = center.y + i * Math.sin(0);
    particles.push(new Particle(x, y, 5, "#1e90ff", i));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.08)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
  });
}

init();
animate();
