import React from "react";
import Canvas from "./Canvas";
import { DrawFunction } from "./types/misc";
import { FillMode, SineWave, drawSine } from "layered-sine-browser";

const crescent = new Image();
crescent.src = "above-clouds/crescent.svg";

// We will assign attributes during draw.
const wave1 = new SineWave(0, 0, 0.8, Math.PI * 2 * Math.random(), 0);
wave1.color = 0xcfcfcf;
wave1.fill = FillMode.DOWN;
const wave2 = new SineWave(0, 0, 0.9, Math.PI * 2 * Math.random(), 0);
wave2.color = 0xdfdfdf;
wave2.fill = FillMode.DOWN;
const wave3 = new SineWave(0, 0, 0.95, Math.PI * 2 * Math.random(), 0);
wave3.color = 0xefefef;
wave3.fill = FillMode.DOWN;
const wave4 = new SineWave(0, 0, 1, Math.PI * 2 * Math.random(), 0);
wave4.color = 0xffffff;
wave4.fill = FillMode.DOWN;

function setWavelength(wave: SineWave, wavelength: number) {
  wave.wavelength = wavelength;
  wave.waveNum = Math.PI * 2 / wave.wavelength;
}

// Update 250 times per second
var t = 0;
setInterval(() => {
  t += 0.004;
}, 0.004);

var night = !!window.location.search.replace("?", "").split("&").find(q => q.startsWith("night"));
const rotation = Math.PI * 2 * Math.random();

const App: React.FC = () => {
  const draw: DrawFunction = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (night) {
      ctx.fillStyle = "#000000dd";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    setWavelength(wave1, ctx.canvas.width * 0.175);
    setWavelength(wave2, ctx.canvas.width * 0.117);
    setWavelength(wave3, ctx.canvas.width * 0.07);
    setWavelength(wave4, ctx.canvas.width * 0.047);

    /*setWavelength(wave1, ctx.canvas.width * 0.75);
    setWavelength(wave2, ctx.canvas.width * 0.5);
    setWavelength(wave3, ctx.canvas.width * 0.3);
    setWavelength(wave4, ctx.canvas.width * 0.2);*/

    wave1.amplitude = ctx.canvas.height * 0.01;
    wave2.amplitude = ctx.canvas.height * 0.0085;
    wave3.amplitude = ctx.canvas.height * 0.006;
    wave4.amplitude = ctx.canvas.height * 0.0025;

    wave1.y = ctx.canvas.height * 0.87;
    wave2.y = ctx.canvas.height * 0.75;
    wave3.y = ctx.canvas.height * 0.66;
    wave4.y = ctx.canvas.height * 0.6;

    drawSine(wave4, ctx.canvas, t);
    drawSine(wave3, ctx.canvas, t);
    drawSine(wave2, ctx.canvas, t);
    drawSine(wave1, ctx.canvas, t);

    if (night) {
      ctx.fillStyle = "#26293baa";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    const x = ctx.canvas.width * 0.2;
    const y = ctx.canvas.height * 0.1;

    const grd = ctx.createRadialGradient(x, y, 0, x, y, ctx.canvas.width * (night ? 0.1 : 1));
    if (night) {
      grd.addColorStop(0, "#e1eaff77");
      grd.addColorStop(1, "#e1eaff00");
    } else {
      grd.addColorStop(0, "#fff6c477");
      grd.addColorStop(1, "#fff6c400");
    }

    ctx.beginPath();
    ctx.arc(x, y, ctx.canvas.width, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    const size = ctx.canvas.width * 0.05;
    if (night) {
      if (crescent.complete) {
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.drawImage(crescent, -size * 0.5, -size * 0.5, size, size);
        ctx.resetTransform();
      }
    } else {
      ctx.fillStyle = "#fffbe7";
      ctx.beginPath();
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return <div>
    <Canvas draw={draw} />
  </div>
};

export default App;