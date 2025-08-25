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

camera.position.set(5, 5, 70);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 5, 16, 100);
const material = new THREE.MeshStandardMaterial({});
const torus = new THREE.Mesh(geometry, material);
torus.position.set(20, 5, 5);

const pointLight = new THREE.PointLight(0xffffff);
// pointLight.position.set(10, 10, 10);

const ambienLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambienLight);

const direcLight = new THREE.DirectionalLight(0xffffff);
scene.add(direcLight);
direcLight.position.setX(-50)

const lightHelper = new THREE.DirectionalLightHelper(direcLight);
scene.add(lightHelper);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

scene.add(torus);
scene.add(pointLight);

const controls = new OrbitControls(camera, renderer.domElement);

// getStars(scene, 10000, 200, 500);
getBackground(scene, "/assets/bg.png");


const earthGroup = new THREE.Group();
const earth = getPlanet({
  radius: 10,
  texturePath: "/assets/earth/earthText.jpg",
  type: "standard"
});

earthGroup.add(earth);
scene.add(earthGroup);

earthGroup.rotateZ(23.4 * Math.PI / 180);



const sunGroup = new THREE.Group()


const sun = getPlanet({
  radius: 100,
  texturePath: "/assets/sun/sunmap.jpg",
  type: "basic"
})


sunGroup.add(sun);
sunGroup.position.setX(-150);
scene.add(sunGroup);



function animate() {
  stats.begin(); // empieza medición

  requestAnimationFrame(animate);

  torus.rotation.x += 0.001;
  torus.rotation.y += 0.001;
  torus.rotation.z += 0.001;

  earthGroup.rotation.y += 0.01;

  controls.update();

  renderer.render(scene, camera);

  stats.end(); // termina medición
}

animate();
