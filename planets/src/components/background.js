import * as THREE from "three";

export function getBackground(scene, backgroundImg) {
  const texture = new THREE.TextureLoader().load(backgroundImg);

  const geometry = new THREE.SphereGeometry(1000, 60, 40);

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide, // suficiente para ver la textura interna
  });

  const backgroundMesh = new THREE.Mesh(geometry, material);
  scene.add(backgroundMesh);
}
