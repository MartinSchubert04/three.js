import * as THREE from "three";

export function getStars(
  scene,
  amount,
  minDistance,
  maxDistance,
  color = 0xffffff
) {
  const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starMaterial = new THREE.MeshStandardMaterial({ color: color });

  // 10.000 instancias
  const stars = new THREE.InstancedMesh(starGeometry, starMaterial, amount);
  scene.add(stars);

  const dummy = new THREE.Object3D();

  for (let i = 0; i < amount; i++) {
    dummy.position.set(
      THREE.MathUtils.randFloatSpread(minDistance, maxDistance),
      THREE.MathUtils.randFloatSpread(minDistance, maxDistance),
      THREE.MathUtils.randFloatSpread(minDistance, maxDistance)
    );
    dummy.updateMatrix();
    stars.setMatrixAt(i, dummy.matrix);
  }
}
