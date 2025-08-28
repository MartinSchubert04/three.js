import "./style.css";
import { createStats } from "./components/viewStats.js";
import { getStars } from "./components/Stars.js";
import { getBackground } from "./components/background.js";
import { planetData } from "./components/Data.js";
import { Planet } from "./components/Planet.js";

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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const sunLight = new THREE.PointLight(0xffffff, 100000);

// const ambientLight = new THREE.AmbientLight(/*0x404040*/ 0xffffff, 1); // color, intensidad

//const direcLight = new THREE.DirectionalLight(0xffffff);
//scene.add(direcLight);
//direcLight.position.setX(-50)

const lightHelper = new THREE.PointLightHelper(sunLight);
scene.add(lightHelper);

const gridHelper = new THREE.GridHelper(1000, 50);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

// getStars(scene, 10000, 200, 500);
getBackground(scene, "/assets/background/black.png");

const SolarSytem = new THREE.Group();

const planets = {};
for (const key in planetData) {
  planets[key] = new Planet({
    radius: planetData[key].radius,
    mass: planetData[key].mass,
    texturePath: planetData[key].texturePath,
    position: planetData[key].position,
    type: key === "sun" ? "basic" : "standard",
    hasRings: planetData[key].hasRings || false,
  });

  SolarSytem.add(planets[key]);
}

const lightText = new THREE.TextureLoader().load(
  "/assets/earth/earthLights.jpg"
);
const earthLightMat = new THREE.MeshBasicMaterial({
  map: lightText,
  blending: THREE.AdditiveBlending,
  opacity: 0.8,
});

const earthLight = new THREE.Mesh(
  new THREE.IcosahedronGeometry(planets.earth.radius, planets.earth.segments),
  earthLightMat
);
// CLOUDS
// const cloudText = new THREE.TextureLoader().load(
//   "/assets/earth/earthCloudMap.jpg"
// );
// const cloudMat = new THREE.MeshStandardMaterial({
//   map: cloudText,
//   blending: THREE.AdditiveBlending,
// });

// const earthCloud = new THREE.Mesh(
//   new THREE.IcosahedronGeometry(planets.earth.radius, planets.earth.segments),
//   cloudMat
// );

planets.earth.add(earthLight);

planets.earth.rotateZ((23.4 * Math.PI) / 180);

scene.add(SolarSytem, sunLight);

let prevTime = performance.now();
let G = 2;
let timeScale = 1;

SolarSytem.children.forEach((planet) => {
  if (
    planet.setOrbitalSpeed &&
    planet != planets.sun &&
    planet != planets.moon
  ) {
    planet.setOrbitalSpeed(planets.sun, G);
  }
  if (planet == planets.moon) {
    planet.setOrbitalSpeed(planets.earth, G);
  }
});

function setupControls() {
  document.getElementById("timeScale").addEventListener("input", (e) => {
    timeScale = parseFloat(e.target.value);
    document.getElementById("timeValue").textContent = timeScale + "x";
  });

  document.getElementById("gravity").addEventListener("input", (e) => {
    G = parseFloat(e.target.value);
    document.getElementById("gravityValue").textContent = G;
  });
}
setupControls();
function animate() {
  stats.begin(); // empieza medición

  const currentTime = performance.now();
  let dt = (currentTime - prevTime) / 1000; // en segundos
  prevTime = currentTime;

  requestAnimationFrame(animate);

  planets.earth.rotation.y += 0.01;

  if (dt > 0.05) dt = 0.05;

  // aplicar tu factor de aceleración del tiempo
  const scaledDt = dt * timeScale;

  // Rotaciones opcionales

  SolarSytem.children.forEach((planet) => {
    if (
      planet.updatePhysics &&
      planet != planets.sun &&
      planet != planets.moon
    ) {
      planet.updatePhysics(scaledDt, /*SolarSytem.children*/ [planets.sun], G);
    }
    if (planet == planets.moon) {
      planet.updatePhysics(scaledDt, [planets.earth], G);
    }
  });

  controls.update();

  renderer.render(scene, camera);

  stats.end(); // termina medición

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

animate();
