// @/composables/scene/useSceneCalibrator.ts
import { onMounted, onUnmounted, type Ref } from 'vue';
import { useSceneStore } from '@/stores/SceneStore';

/*
	Композабл следит за размерами SVG-элемента сцены
	и обновляет размеры камеры и сцены в сторе.
	Иначе пропорции сцены будут искривлены.
*/
export function useSceneCalibrator(pSceneElement: Ref<SVGSVGElement | null>) {
	const sceneStore = useSceneStore();
	let resizeObs: ResizeObserver | null = null;

	function initResizeObs() {
		if (!pSceneElement.value) return;

		// Создаем наблюдатель за изменениями размера svg элемента
		resizeObs = new ResizeObserver((entries) => {
			for (const entry of entries) { // для каждого наблюдаемого элемента (у нас один)
				const newHeight = Math.round(entry.contentRect.height);
				const newWidth = Math.round(entry.contentRect.width);

				// Защита от лишних апдейтов Vue
				if (sceneStore.camera.height !== newHeight) {
					sceneStore.camera.height = newHeight;
				}
				if (sceneStore.camera.width !== newWidth) {
					sceneStore.camera.width = newWidth;
				}
			}
		});

		// Отслеживаем родительский элемент или сам SVG
		const target = pSceneElement.value.parentElement || pSceneElement.value;
		resizeObs.observe(target);
	}

	onMounted(() => {
		initResizeObs();
	});

	onUnmounted(() => {
		if (resizeObs) {
			resizeObs.disconnect(); // Намного надежнее, чем unobserve, чистит всё сразу
			resizeObs = null;
		}
	});
}
