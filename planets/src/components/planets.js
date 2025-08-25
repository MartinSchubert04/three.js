import * as THREE from "three";

export function getPlanet({
  radius,
  texturePath,
  type,
  normalPath = null,
  segments = 64,
  bumpScale = 1,
  clouding = false,
  cloudPath = null,
  specularPath = null,
}) {
  const planetTexture = new THREE.TextureLoader().load(texturePath);
  if (normalPath) {
    const planetBump = new THREE.TextureLoader().load(normalPath);
  }
  // const specularMap = new THREE.TextureLoader().load(specularPath); // océanos brillantes


  let material;

  if (type == "basic") {
    material = new THREE.MeshBasicMaterial({
      map: planetTexture,
      color: 0xffffff,
    });
  }

  if (type == "standard") {
    material = new THREE.MeshStandardMaterial({
      map: planetTexture,
      color: 0xffffff,
    });
  }

  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, segments), material
    
  );

  if (clouding == true) {
    const cloudMap = new THREE.TextureLoader().load(cloudPath);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudMap,
      transparent: true,
      opacity: 0.4, // ajustá la densidad
      depthWrite: false, // mejora visual al solaparse
    });

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(radius + 2, 64, 64), // +2 de radio para que envuelva
      cloudMaterial
    );
    scene.add(clouds);
  }


  return planet;
}
