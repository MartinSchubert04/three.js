import * as THREE from "three";

export class Planet extends THREE.Group {
	constructor({
		radius,
		mass,
		segments = 64,
		texturePath,
		type = "standard",
		position = new THREE.Vector3(0, 0, 0),
		rotationAxis = new THREE.Vector3(0, 1, 0),
		rotationSpeed = 0.01,
	}) {
		super();

		this.radius = radius;
		this.mass = mass;
		this.segments = segments;
		this.texturePath = texturePath;
		this.type = type;
		this.position = position;
		this.rotationAxis = rotationAxis;
		this.rotationSpeed = rotationSpeed;

		// Loader compartido
		const textureLoader = new THREE.TextureLoader();
		const texture = texturePath ? textureLoader.load(texturePath) : null;

		// Definir material
		let material;
		if (type === "basic") {
			material = new THREE.MeshBasicMaterial({
				map: texture,
				color: 0xffffff,
			});
		} else {
			material = new THREE.MeshStandardMaterial({
				map: texture,
				color: 0xffffff,
			});
		}

		// Crear malla
		this.mesh = new THREE.Mesh(
			new THREE.SphereGeometry(this.radius, this.segments, this.segments),
			material
		);

		this.mesh.position.copy(this.position);

		this.add(mesh);
		this.mesh = mesh;
	}

	// Método para añadir a la escena
	addToScene(scene) {
		scene.add(this.mesh);
	}

	// Método para animar (rotación simple)
	update() {
		this.mesh.rotateOnAxis(this.rotationAxis, this.rotationSpeed);
	}
}
