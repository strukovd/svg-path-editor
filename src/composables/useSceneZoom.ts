import { useSceneStore } from '@/stores/SceneStore';


export function useSceneZoom() {
	const s = useSceneStore();

	function round(value: number, digits = 4): number {
		if (s.camera.scale < 1) return value;
		return Number(value.toFixed(digits));
	}

	function onWheel(e: WheelEvent) {
		if (!e.altKey) {
			return;
		}

		if(!s.scene.width) {
			console.error(`Ширина редактора не определена`);
			return;
		}

		const svgElement = e.currentTarget as SVGSVGElement;
		if(!svgElement) return;

		const rect = svgElement.getBoundingClientRect();
		// Расчет точки под курсором в мировых координатах
		const pointerX = s.camera.x + (e.clientX - rect.left) * (s.camera.width / rect.width);
		const pointerY = s.camera.y + (e.clientY - rect.top) * (s.camera.height / rect.height);

		const direction = Math.sign(e.deltaY) || 1; // 
		const factor = Math.pow(1 + s.camera.stepScale, direction); // 

		const newWidth = Math.max(s.camera.minScale, s.camera.width * factor);
		const newHeight = Math.max(s.camera.minScale, s.camera.height * factor);

		// Масштабируем относительно точки под курсором
		const newViewPortX = pointerX - (pointerX - s.camera.x) * (newWidth / s.camera.width);
		const newViewPortY = pointerY - (pointerY - s.camera.y) * (newHeight / s.camera.height);

		// Записываем обновленные состояния
		s.camera.x = round(newViewPortX);
		s.camera.y = round(newViewPortY);
		s.camera.width = round(newWidth);
		s.camera.height = round(newHeight);

		// Обновляем значение текущего scale
		s.camera.scale = s.camera.width / s.scene.width;
	}

	return {
		onWheel,
	};
}
