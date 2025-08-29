import * as THREE from "three";

export function getBackground(backgroundImg: string) {
	const texture = new THREE.TextureLoader().load(backgroundImg);

	const geometry = new THREE.SphereGeometry(1000, 60, 40);

	const material = new THREE.MeshBasicMaterial({
		map: texture,
		side: THREE.BackSide, // suficiente para ver la textura interna
	});

	return new THREE.Mesh(geometry, material);
}
