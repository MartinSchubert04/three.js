import * as THREE from "three";

export class TextureLoaderManager {
  constructor() {
    // Loader compartido
    this.loader = new THREE.TextureLoader();
    // Cache de texturas
    this.textures = {};
  }

  /**
   * Devuelve una textura cargada. Si ya está en cache, la reutiliza.
   * @param {string} path - Ruta del archivo de textura
   * @returns {THREE.Texture}
   */
  getTexture(path) {
    if (this.textures[path]) {
      return this.textures[path];
    }
    const texture = this.loader.load(path);
    this.textures[path] = texture;
    return texture;
  }

  createMaterial(path, type = "standard", color = 0xffffff, options = {}) {
    if (type === "basic") return this.createBasicMaterial(path, color);
    return this.createStandardMaterial(path, color, options);
  }

  /**
   * Crea un MeshBasicMaterial con la textura indicada
   * @param {string} path
   * @param {number} color
   * @returns {THREE.MeshBasicMaterial}
   */
  createBasicMaterial(path, color = 0xffffff) {
    const texture = this.getTexture(path);
    return new THREE.MeshBasicMaterial({
      map: texture,
      color: color,
    });
  }

  /**
   * Crea un MeshStandardMaterial con la textura indicada
   * @param {string} path
   * @param {number} color
   * @param {object} options - opcionales: roughness, metalness
   * @returns {THREE.MeshStandardMaterial}
   */
  createStandardMaterial(path, color = 0xffffff, options = {}) {
    const texture = this.getTexture(path);
    return new THREE.MeshStandardMaterial({
      map: texture,
      color: color,
      roughness: options.roughness ?? 0.7,
      metalness: options.metalness ?? 0.1,
      blending: options.blending ?? THREE.NormalBlending,
    });
  }

  /**
   * Método genérico para crear material según tipo
   * @param {string} path
   * @param {string} type - "basic" o "standard"
   * @param {number} color
   * @param {object} options
   * @returns {THREE.Material}
   */
}

export const textureManager = new TextureLoaderManager();
