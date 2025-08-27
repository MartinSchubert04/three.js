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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


const sunLight = new THREE.PointLight(0xffffff, 2, 4000);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;

const ambientLight = new THREE.AmbientLight(/*0x404040*/ 0xffffff, 1); // color, intensidad

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



const planetData = {
  sun:     { radius: 50, mass: 2000, texturePath: "/assets/sun/sun.jpg", position: new THREE.Vector3(0, 0, 0), type: "basic" },
  mercury: { radius: 3, mass: 5, texturePath: "/assets/mercury/mercury.jpg", position: new THREE.Vector3(150, 0, 0) },
  venus:   { radius: 6, mass: 10, texturePath: "/assets/venus/venus.jpg", position: new THREE.Vector3(220, 0, 0) },
  earth:   { radius: 10, mass: 20, texturePath: "/assets/earth/earthText.jpg", position: new THREE.Vector3(300, 0, 0) },
  moon:    { radius: 2, mass: 5, texturePath: "/assets/moon/moon.jpg", position: new THREE.Vector3(340, 0, 0) },
  mars:    { radius: 8, mass: 15, texturePath: "/assets/mars/mars.jpg", position: new THREE.Vector3(450, 0, 0) },
  jupiter: { radius: 20, mass: 200, texturePath: "/assets/jupiter/jupiter.jpg", position: new THREE.Vector3(700, 0, 0) },
  saturn:  { radius: 18, mass: 150, texturePath: "/assets/saturn/saturn.jpg", position: new THREE.Vector3(900, 0, 0) },
  uranus:  { radius: 14, mass: 100, texturePath: "/assets/uranus/uranus.jpg", position: new THREE.Vector3(1100, 0, 0) },
  neptune: { radius: 14, mass: 100, texturePath: "/assets/neptune/neptune.jpg", position: new THREE.Vector3(1300, 0, 0) }
};



const SolarSytem = new THREE.Group()

const planets = {};
for (const key in planetData) {
  planets[key] = new Planet({
    radius: planetData[key].radius,
    mass: planetData[key].mass,
    texturePath: planetData[key].texturePath,
    position: planetData[key].position,
    type: key === "sun" ? "basic" : null
  });

  SolarSytem.add(planets[key])
}

planets.earth.rotateZ(23.4 * Math.PI / 180);



scene.add(SolarSytem, ambientLight, sunLight)

let prevTime = performance.now();
const G = 2
const timeScale = 200; 


SolarSytem.children.forEach( planet => {
  if (planet.setOrbitalSpeed && planet != planets.sun && planet != planets.moon) {
    planet.setOrbitalSpeed(planets.sun, G)
  }
  if (planet == planets.moon) {
    planet.setOrbitalSpeed(planets.earth, G)
  }
});

sunLight.castShadow = true;
planets.earth.castShadow = true;
planets.earth.receiveShadow = true;
renderer.shadowMap.enabled = true;

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
    if (planet.updatePhysics && planet != planets.sun && planet != planets.moon) {
      planet.updatePhysics(scaledDt, /*SolarSytem.children*/ [planets.sun], G)
    }
    if(planet == planets.moon){
      planet.updatePhysics(scaledDt, [planets.earth], G)
    }
  });

  controls.update();

  renderer.render(scene, camera);
  

  stats.end(); // termina medición
}

animate();
