import utils from "./utils";
import { gsap } from "gsap";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
console.log(gsap);

canvas.width = innerWidth;
canvas.height = innerHeight;

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];
const glowColor = "rgba(30, 144, 255, 0.5)";
const handleWidth = 30;
const handleHeight = 50;
let angle = 0;
let active = false;
const particleCount = 195 + handleHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};
const center = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

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
addEventListener("click", () => {
  active = !active;
  console.log(active);
});
addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

// Objects
class Particle {
  constructor(x, y, radius, color, distFromCenter) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.distFromCenter = distFromCenter;
    this.blur = 5;
    // this.alpha = 0;
  }

  draw() {
    c.save();
    // c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.shadowBlur = this.blur;
    c.shadowColor = glowColor;
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update(on) {
    this.draw();
    if (this.distFromCenter < handleHeight) {
      this.color =
        (this.distFromCenter > 10 && this.distFromCenter < 25) ||
        (this.distFromCenter > 40 && this.distFromCenter < 45)
          ? "#262525"
          : "#A9A9A9";
      this.radius = 5;
      this.blur = 0;
    }
    // if (on && particles.length < particleCount) {
    //   particles.push(
    //     new Particle(center.x, center.y, 3, "#ffff", this.distFromCenter + 1)
    //   );
    // }
    // console.log(particles);
    this.x = center.x + this.distFromCenter * Math.cos(angle);
    this.y =
      center.y + handleHeight / 2 + this.distFromCenter * Math.sin(angle);
  }
}

// Implementation
let particles;
function init() {
  particles = [];

  for (let i = 0; i < particleCount; i++) {
    let dist;
    // console.log(i < handleHeight);
    i < handleHeight ? (dist = i) : (dist = handleHeight);
    const x = center.x + dist * Math.cos(0);
    const y = center.y + handleHeight / 2 + dist * Math.sin(0);
    particles.push(
      new Particle(
        x,
        y,
        3,
        i < particleCount - 1 ? "#ffff" : "rgba(30, 144, 255, 0.25)",
        i
      )
    );
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update(active);
  });

  // const handleWidth = 30;
  // const handleHeight = 200;
  // const bladeWidth = 10;
  // const bladeHeight = 300;
  // const glowColor = "rgba(0,255,255,0.5)"; // Cyan glow

  // // Draw handle (rectangle)
  // c.fillStyle = "silver";
  // c.fillRect(
  //   center.x - handleWidth / 2,
  //   center.y - handleHeight / 2,
  //   handleWidth,
  //   handleHeight
  // );

  // // Draw blade (glowing effect)
  // c.shadowBlur = 20;
  // c.shadowColor = glowColor;
  // c.fillStyle = glowColor;
  // c.fillRect(
  //   center.x - bladeWidth / 2,
  //   center.y - bladeHeight / 2,
  //   bladeWidth,
  //   bladeHeight
  // );
}

init();
animate();
