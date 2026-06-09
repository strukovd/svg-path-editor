// useEditorZoom.ts
import { reactive, ref } from 'vue';
import { useEditorStore } from '@/stores/EditorStore';

interface ZoomOptions {
	initialWidth: number;
	initialHeight: number;
	minScale?: number;
	stepScale?: number;
	// onViewportChange?: () => void; // Тот самый IoC-колбэк
}

export function useEditorZoom(options: ZoomOptions = { initialWidth: 0, initialHeight: 0 }) {
	const s = useEditorStore();
	const {
		initialWidth,
		initialHeight,
		minScale = 0.1,
		stepScale = 0.2,
	} = options;

	// Логика округления инкапсулирована внутри модуля
	function round(value: number, digits = 4): number {
		if (s.scale < 1) return value;
		return Number(value.toFixed(digits));
	}

	function onWheel(e: WheelEvent) {
		if (!e.altKey) {
			return;
		}

		if(!s.editor.width) {
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
		const factor = Math.pow(1 + stepScale, direction); // 

		const newWidth = Math.max(minScale, s.camera.width * factor);
		const newHeight = Math.max(minScale, s.camera.height * factor);

		// Масштабируем относительно точки под курсором
		const newViewPortX = pointerX - (pointerX - s.camera.x) * (newWidth / s.camera.width);
		const newViewPortY = pointerY - (pointerY - s.camera.y) * (newHeight / s.camera.height);

		// Записываем обновленные состояния
		s.camera.x = round(newViewPortX);
		s.camera.y = round(newViewPortY);
		s.camera.width = round(newWidth);
		s.camera.height = round(newHeight);

		// Обновляем значение текущего scale
		s.scale = s.camera.width / s.editor.width;

		// Вызываем внешнее уведомление (IoC), если кто-то подписался
		// if (onViewportChange) {
		// 	onViewportChange();
		// }
	}

	return {
		onWheel,
	};
}
