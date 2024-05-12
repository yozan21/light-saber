import utils from "./utils";
import * as dat from "dat.gui";
import { gsap } from "gsap";
import { Howl, Howler } from "howler";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const gui = new dat.GUI();
// console.log(sound);

canvas.width = innerWidth;
canvas.height = innerHeight;

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];
const glowColor = "rgba(30, 144, 255, 0.5)";
const handleWidth = 30;
const handleHeight = 50;
let angle = -Math.PI / 2;
let active = false;
const particleCount = 195 + handleHeight;
let prevAngle = angle;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};
const center = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

const sound = {
  closeMvmtSound: true,
};

const audio = {
  On: new Howl({
    src: "../audio/start.mp3",
  }),
  Off: new Howl({
    src: "../audio/stop-2.mp3",
  }),
  LMov: new Howl({
    src: "../audio/long.mp3",
  }),
  MMov: new Howl({
    src: "../audio/medium.mp3",
  }),
  SMov: new Howl({
    src: "../audio/short.mp3",
  }),
};

gui.add(sound, "closeMvmtSound").onChange((a) => {
  sound.closeMvmtSound = a;
});
// Event Listeners
addEventListener("mousemove", (e) => {
  gsap.to(mouse, {
    x: e.clientX - canvas.width / 2,
    y: e.clientY - canvas.height / 2,
    duration: 1.2,
  });

  angle = Math.atan2(mouse.y, mouse.x);
  if (active && sound.closeMvmtSound) {
    const angDiff = Math.abs(angle - prevAngle);
    // console.log(angDiff > 0.9);
    if (angDiff > 0.5 && !audio.LMov.playing()) {
      audio.LMov.play();
    } else if (
      angDiff > 0.05 &&
      (!audio.MMov.playing() || !audio.LMov.playing())
    ) {
      // Howler.stop();
      audio.MMov.play();
    }
    // else if (angDiff > 0.09) audio.SMov.play();
    prevAngle = angle;
  }
});
addEventListener("click", () => {
  active = !active;
  if (active) audio.On.play();
  else audio.Off.play();
  // console.log(active);
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
    if (on) this.draw();
    if (this.distFromCenter < handleHeight) {
      this.draw();
      this.color =
        (this.distFromCenter > 10 && this.distFromCenter < 25) ||
        (this.distFromCenter > 40 && this.distFromCenter < 45)
          ? "#333333"
          : "#D9DADB";
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
    // i < handleHeight ? (dist = i) : (dist = handleHeight);
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

  particles.forEach((particle, i) => {
    // if (!active && i < handleHeight) particle.update(active);
    // else if (active)
    particle.update(active);
  });
}

init();
animate();
