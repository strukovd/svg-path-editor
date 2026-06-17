import { defineStore } from 'pinia';
import type { SceneElement, SceneSnapshot } from '@/types/scene';


const makeId = () => `el_${Math.random().toString(36).slice(2, 10)}`;


// TODO: Переименовать store в SceneStore или вынести в AppStore
// TODO: Имя shape (или element) для списка фигур.
// TODO: Command - элементы внутри path фигуры.
// TODO: ввести папку в массив элементов, учитывать ее содержимое, и так рекурсивно.
export const useSceneStore = defineStore('scene', {
	state: () => ({
		ready: false,
		scene: {
			width: 0,
			height: 0
		},
		camera: {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			scale: 1,
			minScale: 0.1,
			stepScale: 0.2
		},

		elements: [] as SceneElement[], // Все фигуры в сцене. Объектная модель (shape или element)
		activeId: null as string | null, // ?
		history: [] as SceneSnapshot[],
		historyCursor: -1,

		settings: {
			grid: true
		}
	}),
	getters: {
		activeElement(state): SceneElement | null {
			return state.elements.find(el => el.id === state.activeId) || null;
		}
	},
	actions: {
		clientToWorld(clientX: number, clientY: number, svgElement: SVGSVGElement | null): { x: number; y: number } {
			if (!svgElement) return { x: 0, y: 0 };
			
			const rect = svgElement.getBoundingClientRect();
			const x = this.camera.x + (clientX - rect.left) * (this.camera.width / rect.width);
			const y = this.camera.y + (clientY - rect.top) * (this.camera.height / rect.height);
			
			return { x, y };
		},

		// ensureInitialized() {
			// if (this.elements.length === 0) { // Если элементов нет, добавляем 1 Path для примера
				// const defaultEl: SceneElement = {
				// 	id: makeId(),
				// 	type: 'path',
				// 	name: 'Path 1',
				// 	data: new Path(kDefaultPath),
				// 	attrs: { stroke: '#fff', fill: '#ffffff22' }
				// };
				// this.elements = [defaultEl];
				// this.activeId = defaultEl.id;
				// this.pushHistory();
			// }
		// },

		setActive(id: string | null) {
			this.activeId = id;
		},

		pushHistory() {
		},

		undo() {
		},

		redo() {
		}
	}
});
