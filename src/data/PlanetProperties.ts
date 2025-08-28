import * as THREE from "three";
import { textureManager } from "../managers/TextureLoaderManager";
import { getFresnelMat } from "./getFresnelMat";
import { Planet } from "../objects/Planet";

export interface PlanetProperties {
	addProperty(planet: Planet): void;
}

export class CloudProp implements PlanetProperties {
	addProperty(planet: Planet): void {
		if (!(planet as any).cloudPath) return;

		const cloudMat = textureManager.createMaterial(
			(planet as any).cloudPath,
			"standard",
			0xffffff,
			{ blending: THREE.AdditiveBlending }
		);

		const clouds = new THREE.Mesh(
			new THREE.IcosahedronGeometry(
				planet.radius + 1.003,
				planet.segments
			),
			cloudMat
		);

		clouds.scale.setScalar(1.01);
		planet.add(clouds);
	}
}

export class GlowProp implements PlanetProperties {
	addProperty(planet: Planet): void {
		const fresnelMat = getFresnelMat();

		const glowMesh = new THREE.Mesh(
			new THREE.IcosahedronGeometry(planet.radius, planet.segments),
			fresnelMat
		);

		glowMesh.scale.setScalar(1.01);
		planet.add(glowMesh);
	}
}

export class SpecularProp implements PlanetProperties {
	addProperty(planet: Planet): void {
		if (!(planet as any)) return;

		const specMat = textureManager.createMaterial(
			(planet as any).cloudPath,
			"standard",
			0xffffff,
			{ blending: THREE.AdditiveBlending }
		);

		const clouds = new THREE.Mesh(
			new THREE.IcosahedronGeometry(
				planet.radius + 1.003,
				planet.segments
			),
			specMat
		);

		clouds.scale.setScalar(1.01);
		planet.add(clouds);
	}
}
