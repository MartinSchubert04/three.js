import "./style.css";
import { createStats } from "./components/viewStats.js";
import { getStars } from "./components/Stars.js";
import { getBackground } from "./components/background.js";

import {Planet} from "./components/Planet.js";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const stats = createStats();
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(0, 300, 500);

renderer.render(scene, camera);


const sunLight = new THREE.PointLight(0xffffff, 2, 2000);
const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // color, intensidad

//const direcLight = new THREE.DirectionalLight(0xffffff);
//scene.add(direcLight);
//direcLight.position.setX(-50)

const lightHelper = new THREE.PointLightHelper(sunLight);
scene.add(lightHelper);

const gridHelper = new THREE.GridHelper(1000, 50);
scene.add(gridHelper);


const controls = new OrbitControls(camera, renderer.domElement);

// getStars(scene, 10000, 200, 500);
getBackground(scene, "/assets/background/bg.png");



const planetData = {
  earth: {radius: 20, mass: 20, texturePath: "/assets/earth/earthText.jpg", position: new THREE.Vector3(300,150,0)},
  mars: {radius: 10, mass: 10, texturePath: "/assets/mars/mars.jpg", position: new THREE.Vector3(500, -200, 0)},
  sun: {radius: 100, mass: 200, texturePath: "/assets/sun/sunmap.jpg", position: new THREE.Vector3(0, 0, 0)}
};



const SolarSytem = new THREE.Group()

const planets = {};
for (const key in planetData) {
  planets[key] = new Planet({
    radius: planetData[key].radius,
    mass: planetData[key].mass,
    texturePath: planetData[key].texturePath,
    position: planetData[key].position,
    type: key === "sun" ? "basic" : "standard"
  });

  SolarSytem.add(planets[key])
}

planets.sun.add(sunLight)
planets.earth.rotateZ(23.4 * Math.PI / 180);



scene.add(SolarSytem, ambientLight)

let prevTime = performance.now();
const G = 2
const timeScale = 600; 


SolarSytem.children.forEach( planet => {
  if (planet.setOrbitalSpeed && planet != planets.sun) {
  planet.setOrbitalSpeed(planets.sun, G)
  }
});


function animate() {
  stats.begin(); // empieza medición

  const currentTime = performance.now();
  let dt = ((currentTime - prevTime) / 1000 ); // en segundos
  prevTime = currentTime;

  requestAnimationFrame(animate);


  planets.earth.rotation.y += 0.01;

  if (dt > 0.05) dt = 0.05;

  // aplicar tu factor de aceleración del tiempo
  const scaledDt = dt * timeScale;
  
  

  // Rotaciones opcionales

  SolarSytem.children.forEach( planet => {
    if (planet.updatePhysics && planet != planets.sun) {
      planet.updatePhysics(scaledDt, SolarSytem.children, G)
    }
  });

  controls.update();

  renderer.render(scene, camera);
  

  stats.end(); // termina medición
}

animate();
