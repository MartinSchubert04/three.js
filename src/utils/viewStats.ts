import Stats from "stats.js";

export function createStats() {
	const stats = new Stats();
	stats.showPanel(0); // FPS
	stats.dom.style.position = "absolute";
	stats.dom.style.top = "0px";
	stats.dom.style.left = "0px";
	stats.dom.style.transform = "scale(2)"; // 2x más grande
	stats.dom.style.transformOrigin = "top left"; // para que no se desplace
	document.body.appendChild(stats.dom);
	return stats;
}
