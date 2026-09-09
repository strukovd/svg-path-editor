import { onMounted, onUnmounted, type Ref } from 'vue';
import { useSceneStore } from '@/stores/SceneStore';

// TODO: используется?? или это новая реализация для coords..

export function useCanvasMouse(svgRef: Ref<SVGSVGElement | null>) {
	// const sceneStore = useSceneStore();

	// let latestClientX = 0;
	// let latestClientY = 0;
	// let isMoving = false;
	// let rafId: number | null = null;

	// // Функция, которую мы привяжем к @mousemove в шаблоне
	// const onMouseMove = (e: MouseEvent) => {
	// 	latestClientX = e.clientX;
	// 	latestClientY = e.clientY;
	// 	isMoving = true;
	// };

	// const updateLoop = () => {
	// 	if (isMoving && svgRef.value) {
	// 		sceneStore.updateCursor(latestClientX, latestClientY, svgRef.value);
	// 		isMoving = false;
	// 	}
	// 	rafId = requestAnimationFrame(updateLoop);
	// };

	// onMounted(() => {
	// 	rafId = requestAnimationFrame(updateLoop);
	// });

	// onUnmounted(() => {
	// 	if (rafId) cancelAnimationFrame(rafId);
	// });

	// // Возвращаем только то, что нужно шаблону
	// return {
	// 	onMouseMove,
	// };
}
