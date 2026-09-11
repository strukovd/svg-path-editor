import { useSceneStore } from '@/stores/SceneStore';

export function useSceneMouse() {
	const sceneStore = useSceneStore();

	function clientToWorld(clientX: number, clientY: number, svgElement: SVGSVGElement | null) {
		if (!svgElement) return { x: 0, y: 0 };

		const rect = svgElement.getBoundingClientRect();
		const x = sceneStore.camera.x + (clientX - rect.left) * (sceneStore.camera.width / rect.width);
		const y = sceneStore.camera.y + (clientY - rect.top) * (sceneStore.camera.height / rect.height);

		return { x, y };
	}

	function updateCursor(clientX: number, clientY: number, svgElement: SVGSVGElement | null) {
		const { x, y } = clientToWorld(clientX, clientY, svgElement);
		sceneStore.cursor.x = Math.round(x);
		sceneStore.cursor.y = Math.round(y);
	}

	return {
		clientToWorld,
		updateCursor,
	};
}
