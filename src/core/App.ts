import * as THREE from "three";
import { createStats } from "../utils/viewStats";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { getBackground } from "../objects/Background";
import { Planet } from "../objects/Planet";
import { planetData } from "../data/Data";

export class App {
	public renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector<HTMLCanvasElement>("#bg")!,
	});
	public scene = new THREE.Scene();
	public camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		10000
	);

	public controls = new OrbitControls(this.camera, this.renderer.domElement);

	public stats: Stats = createStats();
	public SolarSystem = new THREE.Group();
	public G = 2;
	public planets: Record<string, Planet> = {};

	constructor() {
		this.setUpRenderer();
		this.setUpCamera();
		this.setUpLight();
		this.setUpPlanets();

		this.run();
	}

	setUpRenderer() {
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}

	setUpCamera() {
		this.camera.position.set(0, 300, 500);
	}

	setUpLight() {
		const sunLight = new THREE.PointLight(0xffffff, 1000000);
		const lightHelper = new THREE.PointLightHelper(sunLight);
		this.scene.add(lightHelper, sunLight);
	}

	setUpPlanets() {
		const background = getBackground("/assets/background/black.png");

		for (const key in planetData) {
			this.planets[key] = new Planet({
				radius: planetData[key].radius,
				mass: planetData[key].mass,
				texturePath: planetData[key].texturePath,
				position: planetData[key].position,
				type: key === "sun" ? "basic" : "standard",
				hasRings: planetData[key].hasRings || false,
			});

			this.SolarSystem.add(this.planets[key]);
		}

		this.SolarSystem.children.forEach((planet) => {
			if (
				planet instanceof Planet &&
				planet.setOrbitalSpeed &&
				planet !== this.planets.sun &&
				planet !== this.planets.moon
			) {
				planet.setOrbitalSpeed(this.planets.sun, this.G);
			}
			if (planet === this.planets.moon && planet instanceof Planet) {
				planet.setOrbitalSpeed(this.planets.earth, this.G);
			}
		});

		this.scene.add(background, this.SolarSystem);
	}

	run() {
		let prevTime = performance.now();
		let timeScale = 1;

		const animate = () => {
			this.stats.begin();

			const currentTime = performance.now();
			let dt = (currentTime - prevTime) / 1000; // en segundos
			prevTime = currentTime;

			requestAnimationFrame(animate);

			// this.planets.earth.rotation.y += 0.01;

			if (dt > 0.05) dt = 0.05;
			const scaledDt = dt * timeScale;

			this.SolarSystem.children.forEach((planet) => {
				if (planet instanceof Planet) {
					if (
						planet !== this.planets.sun &&
						planet !== this.planets.moon
					) {
						planet.updatePhysics(
							scaledDt,
							[this.planets.sun],
							this.G
						);
					}
					if (planet === this.planets.moon) {
						planet.updatePhysics(
							scaledDt,
							[this.planets.earth],
							this.G
						);
					}
				}
			});

			this.controls.update();
			this.renderer.render(this.scene, this.camera);

			this.stats.end();

			// Responsive resize
			window.addEventListener("resize", () => {
				this.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.updateProjectionMatrix();
				this.renderer.setSize(window.innerWidth, window.innerHeight);
			});
		};

		animate();
	}
}

new App();
