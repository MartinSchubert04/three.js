import * as THREE from "three";

export class Planet extends THREE.Group {
  constructor({
    radius = 10,
    mass,
    velocity = new THREE.Vector3(0,0,0),
    segments = 64,
    texturePath,
    type = "standard",
    position = new THREE.Vector3(0, 0, 0),
    rotationAxis = new THREE.Vector3(0, 1, 0),
    rotationSpeed = 0.01,
  }) {

    super()

    this.radius = radius;
    this.mass = mass;
    this.velocity = velocity;
    this.segments = segments;
    this.texturePath = texturePath;
    this.type = type;
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
        roughness: 0.7,  // Superficie más realista
        metalness: 0.1,  // Menos metálico
      });
    }

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, this.segments, this.segments),
      material
    );

    this.add(this.mesh);

    this.position.copy(position);
  }

  // Método para animar (rotación simple)
  updateRotation() {
    this.mesh.rotateOnAxis(this.rotationAxis, this.rotationSpeed);
  }

  updatePhysics(dt, attractors, G = 2) {

    attractors.forEach( attractor => {

      if (attractor != this){
        const rVec = new THREE.Vector3().subVectors(this.position, attractor.position);
        const distance = rVec.length();
        const force = rVec.normalize().multiplyScalar(-G * attractor.mass * this.mass / (distance*distance));
      // Aceleración y movimiento
        const acc = force.clone().divideScalar(this.mass);
        this.velocity.add(acc.multiplyScalar(dt));
      }
    });
    
    this.position.add(this.velocity.clone().multiplyScalar(dt));
  }

  calculateOrbitalSpeed(attractor, G) {
    const distance = Math.sqrt((attractor.position.x - this.position.x)**2 + (attractor.position.y - this.position.y)**2);
    const orbitalSpeed = Math.sqrt(G * attractor.mass / distance);

    return orbitalSpeed
  }

  setOrbitalSpeed(attractor, G, axis = new THREE.Vector3(0,1,0)) {
    const speed = this.calculateOrbitalSpeed(attractor, G);
    const rVec = new THREE.Vector3().subVectors(this.position, attractor.position).normalize();
    // Crear vector perpendicular al radio para dirección de velocidad circular
    this.velocity.copy(new THREE.Vector3().crossVectors(axis, rVec).normalize().multiplyScalar(speed));
  }
}
