import * as THREE from "three";

type MaterialType = "basic" | "standard";

interface MaterialOptions {
	roughness?: number;
	metalness?: number;
	blending?: THREE.Blending;
}

export class TextureLoaderManager {
	private loader: THREE.TextureLoader;
	private textures: Record<string, THREE.Texture>;

	constructor() {
		this.loader = new THREE.TextureLoader();
		this.textures = {};
	}

	/**
	 * Devuelve una textura cargada. Si ya está en cache, la reutiliza.
	 * @param path Ruta del archivo de textura
	 */
	getTexture(path: string): THREE.Texture {
		if (this.textures[path]) {
			return this.textures[path];
		}
		const texture = this.loader.load(path);
		this.textures[path] = texture;
		return texture;
	}

	/**
	 * Crea un material según el tipo indicado
	 * @param path Ruta de la textura
	 * @param type "basic" o "standard"
	 * @param color Color del material
	 * @param options Opciones para MeshStandardMaterial
	 */
	createMaterial(
		path: string,
		type: MaterialType = "standard",
		color: number = 0xffffff,
		options: MaterialOptions = {}
	): THREE.Material {
		if (type === "basic") return this.createBasicMaterial(path, color);
		return this.createStandardMaterial(path, color, options);
	}

	private createBasicMaterial(
		path: string,
		color: number = 0xffffff
	): THREE.MeshBasicMaterial {
		const texture = this.getTexture(path);
		return new THREE.MeshBasicMaterial({
			map: texture,
			color: color,
		});
	}

	private createStandardMaterial(
		path: string,
		color: number = 0xffffff,
		options: MaterialOptions = {}
	): THREE.MeshStandardMaterial {
		const texture = this.getTexture(path);
		return new THREE.MeshStandardMaterial({
			map: texture,
			color: color,
			roughness: options.roughness ?? 0.7,
			metalness: options.metalness ?? 0.1,
			blending: options.blending ?? THREE.NormalBlending,
		});
	}
}

// Instancia global para reutilizar texturas
export const textureManager = new TextureLoaderManager();
