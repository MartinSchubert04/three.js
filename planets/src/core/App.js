import * as THREE from "three";

class App {
	constructor() {
		const scene = new THREE.Scene();

		this.setUpRenderer();
		this.setUpCamera();
		this.setUpLight();
		this.setUpControls();

		this.Render();
	}

	setUpRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			canvas: document.querySelector("#bg"),
		});

		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	setUpCamera() {
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			10000
		);

		camera.position.set(0, 300, 500);
	}

	setUpControls() {
		this.controls = new OrbitControls(camera, renderer.domElement);
	}

	Render() {
		this.renderer.render(scene, camera);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}
}
