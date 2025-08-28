import * as THREE from "three";
import { CloudProp, GlowProp } from "./PlanetProperties";

const cloudProp = new CloudProp();
const glowProp = new GlowProp();

export const planetData = {
	sun: {
		radius: 50,
		mass: 2000,
		texturePath: "/assets/sun/sun.jpg",
		position: new THREE.Vector3(0, 0, 0),
		type: "basic",
	},
	mercury: {
		radius: 3,
		mass: 5,
		texturePath: "/assets/mercury/mercury.jpg",
		position: new THREE.Vector3(150, 0, 0),
	},
	venus: {
		radius: 6,
		mass: 10,
		texturePath: "/assets/venus/venus.jpg",
		position: new THREE.Vector3(220, 0, 0),
	},
	earth: {
		radius: 10,
		mass: 20,
		texturePath: "/assets/earth/earthText.jpg",
		cloudPath: "/assets/earth/earthCloudMap.jpg",
		position: new THREE.Vector3(300, 0, 0),
		properties: [cloudProp, glowProp],
	},
	moon: {
		radius: 2,
		mass: 5,
		texturePath: "/assets/moon/moon.jpg",
		position: new THREE.Vector3(340, 0, 0),
	},
	mars: {
		radius: 8,
		mass: 15,
		texturePath: "/assets/mars/mars.jpg",
		position: new THREE.Vector3(450, 0, 0),
	},
	jupiter: {
		radius: 20,
		mass: 200,
		texturePath: "/assets/jupiter/jupiter.jpg",
		position: new THREE.Vector3(700, 0, 0),
	},
	saturn: {
		radius: 18,
		mass: 150,
		texturePath: "/assets/saturn/saturn.jpg",
		position: new THREE.Vector3(900, 0, 0),
		hasRings: true,
	},
	uranus: {
		radius: 14,
		mass: 100,
		texturePath: "/assets/uranus/uranus.jpg",
		position: new THREE.Vector3(1100, 0, 0),
	},
	neptune: {
		radius: 14,
		mass: 100,
		texturePath: "/assets/neptune/neptune.jpg",
		position: new THREE.Vector3(1300, 0, 0),
	},
};
