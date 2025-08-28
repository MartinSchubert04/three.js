import * as THREE from "three";

export function getStars(numStars = 5000, minRadius = 2000, maxRadius = 8000) {
	const geometry = new THREE.BufferGeometry();
	const positions = new Float32Array(numStars * 3);
	const colors = new Float32Array(numStars * 3);

	for (let i = 0; i < numStars; i++) {
		// Generar posición esférica aleatoria fuera del radio mínimo
		const phi = Math.random() * Math.PI * 2; // Ángulo horizontal (0 a 2π)
		const theta = Math.acos(2 * Math.random() - 1); // Ángulo vertical (distribución uniforme en esfera)

		// Distancia aleatoria entre minRadius y maxRadius
		const radius = minRadius + Math.random() * (maxRadius - minRadius);

		// Convertir coordenadas esféricas a cartesianas
		positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi); // x
		positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi); // y
		positions[i * 3 + 2] = radius * Math.cos(theta); // z

		// Colores de estrellas variados (blanco a azul con algunos rojizos)
		const color = new THREE.Color();
		const starType = Math.random();

		if (starType < 0.7) {
			// Estrellas blanco-azuladas (mayoría)
			color.setHSL(
				0.6 + Math.random() * 0.1, // Azul-blanco
				0.2 + Math.random() * 0.3,
				0.7 + Math.random() * 0.3
			);
		} else if (starType < 0.9) {
			// Estrellas amarillo-blancas
			color.setHSL(
				0.1 + Math.random() * 0.1, // Amarillo
				0.3 + Math.random() * 0.4,
				0.6 + Math.random() * 0.4
			);
		} else {
			// Estrellas rojizas (menos comunes)
			color.setHSL(
				0.0 + Math.random() * 0.05, // Rojo
				0.5 + Math.random() * 0.3,
				0.5 + Math.random() * 0.3
			);
		}

		colors[i * 3] = color.r;
		colors[i * 3 + 1] = color.g;
		colors[i * 3 + 2] = color.b;
	}

	geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

	const material = new THREE.PointsMaterial({
		size: 2,
		vertexColors: true,
		transparent: true,
		opacity: 0.8,
	});

	return new THREE.Points(geometry, material);
}
