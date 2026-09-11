import { defineStore } from 'pinia';
import type { SceneDisplayMode, SceneElement, SceneSnapshot, SceneTool } from '@/types/scene';

export const useSceneStore = defineStore('scene', {
	state: () => ({
		ready: false,
		scene: { // параметры сцены
			width: 0, // Пока нету <svg>, мы не можем знать размеры сцены
			height: 0,
		},
		camera: { // параметры камеры (viewBox)
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			scale: 1,
			minScale: 0.1,
			stepScale: 0.2,
		},
		cursor: { x: 0, y: 0 }, // координаты курсора на холсте

		elements: [] as SceneElement[], // элементы сцены
		selectedIds: [] as string[], // выбранные элементы
		editableId: null as string | null, // редактируемый элемент
		displayMode: 'OUTLINE' as SceneDisplayMode,
		activeTool: null as SceneTool | null, // Заряд курсора (rect, line, circle, ellipse, image, path)
		// context вычисляется в useSceneContext
		// draftElement: null, // Новый элемент в процессе рисования

		history: [] as SceneSnapshot[],
		historyCursor: -1,

		settings: {
			grid: true,
		},
	}),
});
