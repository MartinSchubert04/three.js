import "./style.css";
import { createStats } from "./utils/viewStats.js";
import { getStars } from "./objects/Stars.js";
import { getBackground } from "./objects/background.js";
import { planetData } from "./data/Data.js";
import { Planet } from "./objects/Planet.ts";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 🟢 Stats.js
const stats = createStats();
const scene = new THREE.Scene();

// 🟢 Cámara
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	10000
);
camera.position.set(0, 300, 500);

// 🟢 Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector<HTMLCanvasElement>("#bg")!,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 🟢 Luces
const sunLight = new THREE.PointLight(0xffffff, 100000);
const lightHelper = new THREE.PointLightHelper(sunLight);
scene.add(lightHelper);

const gridHelper = new THREE.GridHelper(1000, 50);
scene.add(gridHelper);

// 🟢 OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// getStars(scene, 10000, 200, 500);
getBackground(scene, "/assets/background/black.png");

// 🟢 Sistema Solar
const SolarSytem = new THREE.Group();

const planets: Record<string, Planet> = {};
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

// 🟢 Luces nocturnas en la Tierra
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

planets.earth.add(earthLight);
planets.earth.rotateZ((23.4 * Math.PI) / 180);

// Añadir al sistema solar
scene.add(SolarSytem, sunLight);

// 🟢 Variables de simulación
let prevTime = performance.now();
let G = 2;
let timeScale = 1;

// Configurar velocidades orbitales iniciales
SolarSytem.children.forEach((planet) => {
	if (
		planet instanceof Planet &&
		planet.setOrbitalSpeed &&
		planet !== planets.sun &&
		planet !== planets.moon
	) {
		planet.setOrbitalSpeed(planets.sun, G);
	}
	if (planet === planets.moon && planet instanceof Planet) {
		planet.setOrbitalSpeed(planets.earth, G);
	}
});

// 🟢 UI de controles
function setupControls() {
	document.getElementById("timeScale")?.addEventListener("input", (e) => {
		const target = e.target as HTMLInputElement;
		timeScale = parseFloat(target.value);
		document.getElementById("timeValue")!.textContent = timeScale + "x";
	});

	document.getElementById("gravity")?.addEventListener("input", (e) => {
		const target = e.target as HTMLInputElement;
		G = parseFloat(target.value);
		document.getElementById("gravityValue")!.textContent = G.toString();
	});
}
setupControls();

// 🟢 Loop de animación
function animate() {
	stats.begin();

	const currentTime = performance.now();
	let dt = (currentTime - prevTime) / 1000; // en segundos
	prevTime = currentTime;

	requestAnimationFrame(animate);

	planets.earth.rotation.y += 0.01;

	if (dt > 0.05) dt = 0.05;
	const scaledDt = dt * timeScale;

	SolarSytem.children.forEach((planet) => {
		if (planet instanceof Planet) {
			if (planet !== planets.sun && planet !== planets.moon) {
				planet.updatePhysics(scaledDt, [planets.sun], G);
			}
			if (planet === planets.moon) {
				planet.updatePhysics(scaledDt, [planets.earth], G);
			}
		}
	});

	controls.update();
	renderer.render(scene, camera);

	stats.end();

	// Responsive resize
	window.addEventListener("resize", () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}

animate();
