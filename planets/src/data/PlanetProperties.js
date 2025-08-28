import * as THREE from "three";
import { textureManager } from "../managers/TextureLoaderManager.js";
import { getFresnelMat } from "./getFresnelMat.js";

export class PlanetProperties {
	addProperty() {}
}

export class CloudProp extends PlanetProperties {
	addProperty(planet) {
		if (!planet.cloudPath) return;

		const cloudMat = textureManager.createMaterial(
			planet.cloudPath,
			(options = THREE.AdditiveBlending)
		);

		const clouds = new THREE.Mesh(
			new THREE.IcosahedronGeometry(
				planet.radius + 1.003,
				planet.segments
			),
			cloudMat
		);

		planet.add(clouds);
	}
}

export class GlowProp extends PlanetProperties {
	addProperty(planet) {
		const fresnelMat = getFresnelMat();

		const glowMesh = new THREE.Mesh(
			new THREE.IcosahedronGeometry(planet.radius, planet.segments),
			fresnelMat
		);

		glowMesh.scale.setScalar(1.01);
		planet.add(glowMesh);
	}
}

export class SpecularProp extends PlanetProperties {
	addProperty(planet) {
		const cloudMat = textureManager.createMaterial(cloudPath);

		const clouds = new THREE.Mesh(
			new THREE.IcosahedronGeometry(
				planet.radius + 1.003,
				planet.segments
			),
			cloudMat
		);
		planet.add(clouds);
	}
}
