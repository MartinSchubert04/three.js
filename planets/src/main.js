import "./style.css";
import { createStats } from "./components/viewStats.js";
import { getStars } from "./components/Stars.js";
import { getBackground } from "./components/background.js";
import { getPlanet } from "./components/planets.js";

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
camera.position.set(5, 5, 50);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 5, 16, 100);
const material = new THREE.MeshStandardMaterial({});
const torus = new THREE.Mesh(geometry, material);
torus.position.set(20, 5, 5);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(10, 10, 10);

const ambienLight = new THREE.AmbientLight(0xffffff);
scene.add(ambienLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

scene.add(torus);
scene.add(pointLight);

const controls = new OrbitControls(camera, renderer.domElement);

getStars(scene, 10000, 200, 500);
getBackground(scene, "/assets/space.jpg");
getPlanet({
  scene,
  texturePath: "/assets/earthText.jpg",
  normalPath: "/assets/earthBump.jpg",
  radius: 10,
});

function animate() {
  stats.begin(); // empieza medición

  requestAnimationFrame(animate);

  torus.rotation.x += 0.001;
  torus.rotation.y += 0.001;
  torus.rotation.z += 0.001;

  controls.update();

  renderer.render(scene, camera);

  stats.end(); // termina medición
}

animate();
