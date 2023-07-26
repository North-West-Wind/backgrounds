import './style.css'
import * as THREE from "three";
import { init, resize, addBlock, addStar } from "./js/script/utils";

var cooldown = 0;
var cubes = [];
var stars = [];

const { scene, camera, renderer } = init("bg");
camera.position.set(-50, 25, 40);
camera.rotation.set(-0.8015906, -0.2350606, -0.0999803);

const pointLight = new THREE.PointLight(0xffffff, 0.4, 0, 2);
pointLight.position.set(-50, 15, 0);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

for (let i = 0; i < 5000; i++) stars = addStar(stars);

function animate() {
  requestAnimationFrame(animate);

  for (let i = 0; i < cubes.length; i++) {
    const cube = cubes[i];
    cube.translateX(-1.5);
    if (cube.position.x < -200) {
      scene.remove(cube);
      cubes.splice(i, 1);
    }
  }

  for (const star of stars) {
    star.translateX(-4);
    if (star.position.x < -500) {
      star.position.set(500, THREE.MathUtils.randFloatSpread(1000), THREE.MathUtils.randFloatSpread(1000));
    }
  }

  if (!cooldown && cubes.length < 60 && Math.random() < 0.04) {
    cubes = addBlock(cubes);
    cooldown = 40;
  }
  if (cooldown > 0) cooldown--;
  else if (cooldown < 0) cooldown = 0;
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", (e) => {
  resize(camera, renderer);
});