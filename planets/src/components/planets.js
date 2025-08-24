import * as THREE from "three";

export function getPlanet({
  scene,
  texturePath,
  normalPath,
  radius,
  segments = 64,
  bumpScale = 1,
  clouding = false,
  cloudPath = null,
  specularPath = null,
}) {
  const planetTexture = new THREE.TextureLoader().load(texturePath);
  const planetBump = new THREE.TextureLoader().load(normalPath);
  // const specularMap = new THREE.TextureLoader().load(specularPath); // océanos brillantes

  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, segments), // radio, segmentos ancho, segmentos alto
    new THREE.MeshPhongMaterial({
      map: planetTexture,
      normalMap: planetBump,
      bumpScale: bumpScale,
      // specularMap: specularMap,
      // specular: new THREE.Color(0x333333), // controla brillo especular
    })
  );

  scene.add(planet);

  if (clouding == true) {
    const cloudMap = new THREE.TextureLoader().load(cloudPath);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudMap,
      transparent: true,
      opacity: 0.4, // ajustá la densidad
      depthWrite: false, // mejora visual al solaparse
    });

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(202, 64, 64), // +2 de radio para que envuelva
      cloudMaterial
    );
    scene.add(clouds);
  }
}
