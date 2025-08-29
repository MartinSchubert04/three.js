import * as THREE from "three";
import { TextureLoaderManager } from "../managers/TextureLoaderManager.ts";
import type { PlanetProperties } from "../data/PlanetProperties.ts";

const textHandler = new TextureLoaderManager();

interface PlanetOptions {
	radius: number;
	mass: number;
	velocity?: THREE.Vector3;
	segments?: number;
	texturePath?: string;
	type?: string;
	position?: THREE.Vector3;
	initialPosition?: THREE.Vector3;
	rotationAxis?: THREE.Vector3;
	rotationSpeed?: number;
	hasRings?: boolean;
	properties?: any[];
}

export class Planet extends THREE.Group {
	mesh: THREE.Mesh;
	radius: number;
	mass: number;
	velocity: THREE.Vector3;
	segments: number;
	texturePath?: string;
	type: string;
	position: THREE.Vector3;
	rotationAxis: THREE.Vector3;
	rotationSpeed: number;
	hasRings: boolean;
	properties: PlanetProperties[];

	constructor({
		radius = 10,
		mass,
		velocity = new THREE.Vector3(0, 0, 0),
		segments = 64,
		texturePath,
		type = "standard",
		position = new THREE.Vector3(0, 0, 0),
		rotationAxis = new THREE.Vector3(0, 1, 0),
		rotationSpeed = 0.01,
		hasRings = false,
		properties = [],
	}: PlanetOptions) {
		super();

		this.radius = radius;
		this.mass = mass;
		this.velocity = velocity;
		this.segments = segments;
		this.texturePath = texturePath;
		this.type = type;
		this.position = position;
		this.rotationAxis = rotationAxis;
		this.rotationSpeed = rotationSpeed;
		this.hasRings = hasRings;
		this.properties = properties;

		const material = textHandler.createMaterial(texturePath, type);

		/*
		this.properties.forEach((prop) => {
			prop.addProperty(this);
		});
		*/

		if (hasRings) {
			this.addRings();
		}

		this.mesh = new THREE.Mesh(
			new THREE.IcosahedronGeometry(this.radius, this.segments),
			material
		);

		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;

		this.add(this.mesh);

		this.position.copy(position);
	}

	// Método para animar (rotación simple)
	updateRotation() {
		this.mesh.rotateOnAxis(this.rotationAxis, this.rotationSpeed);
	}

	updatePhysics(dt: number, attractors: Planet[], G = 2) {
		attractors.forEach((attractor) => {
			if (attractor !== this) {
				const rVec = new THREE.Vector3().subVectors(
					this.position,
					attractor.position
				);
				const distance = rVec.length();
				const force = rVec
					.normalize()
					.multiplyScalar(
						(-G * attractor.mass * this.mass) /
							(distance * distance)
					);

				// Aceleración y movimiento
				const acc = force.clone().divideScalar(this.mass);
				this.velocity.add(acc.multiplyScalar(dt));
			}
		});

		this.position.add(this.velocity.clone().multiplyScalar(dt));
	}

	calculateOrbitalSpeed(attractor: Planet, G: number): number {
		const distance = Math.sqrt(
			(attractor.position.x - this.position.x) ** 2 +
				(attractor.position.y - this.position.y) ** 2
		);
		return Math.sqrt((G * attractor.mass) / distance);
	}

	setOrbitalSpeed(
		attractor: Planet,
		G: number,
		axis: THREE.Vector3 = new THREE.Vector3(0, 1, 0)
	) {
		const speed = this.calculateOrbitalSpeed(attractor, G);
		const rVec = new THREE.Vector3()
			.subVectors(this.position, attractor.position)
			.normalize();

		this.velocity.copy(
			new THREE.Vector3()
				.crossVectors(axis, rVec)
				.normalize()
				.multiplyScalar(speed)
		);
	}

	addRings() {
		const textureLoader = new THREE.TextureLoader();
		const ringTexture = textureLoader.load(
			"/assets/saturn/saturnringcolor.jpg"
		);

		const ringGeometry = new THREE.RingGeometry(
			this.radius * 1.5,
			this.radius * 2.5,
			32
		);
		const ringMaterial = new THREE.MeshLambertMaterial({
			map: ringTexture,
			transparent: true,
			opacity: 0.7,
			side: THREE.DoubleSide,
		});

		const pos = ringGeometry.attributes.position;
		const uv = new Float32Array(pos.count * 2);

		for (let i = 0; i < pos.count; i++) {
			const x = pos.getX(i);
			const y = pos.getY(i);
			const r = Math.sqrt(x * x + y * y);

			// Normalizar r al rango [0,1]
			uv[i * 2] = r / (this.radius * 2.5);
			uv[i * 2 + 1] = 0.5; // no nos importa el eje Y de la textura
		}

		ringGeometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));

		const rings = new THREE.Mesh(ringGeometry, ringMaterial);
		rings.rotation.x = Math.PI / 2;

		this.add(rings);
	}
}
