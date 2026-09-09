import { defineStore } from 'pinia';
import { updateElementBox } from '@/lib/scene/elements';
import type { SceneElement, SceneMode, SceneSnapshot, SceneTool } from '@/types/scene';
import type { SceneBox } from '@/types/scene-entity';
/*
TODO: Плыву сейчас в этих состояниях, нужно досконально разобраться:
	- Когда редактируется элемент (и у него обрамление) это как режим, и на что он влияет?
	- Если элемент выбран (и у него обрамление), но не редактируется, на что он влияет (конфликтует ли с редактируемым)?
	- Режим возбужденного курсора, когда клик ставит новый элемент
	как это связано с теми режимами - выледения, редактирования и пр..
	нужно ли их вообще связывать или ввести новые свойства:
	activeTool: null as SceneTool | null, // активный инструмент (rect, line, circle, ellipse, image, path)
	activeElementId: null as string | null, // активный элемент (выделенный или редактируемый)
	и как он будет дружить с имеющимися режимами.
	ОБДУМАТЬ ЭТО.
*/


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
		selectedIds: [] as string[], // выбранные элементы TODO: разобрать логику, может быть поле не логичное
		editableId: null as string | null, // редактируемый элемент TODO: разобрать логику, может быть поле не логичное
		mode: 'select' as SceneMode, // режим сцены (select, transform, edit, draw) TODO: разобрать логику, может быть поле не логичное
		tool: null as SceneTool | null,
		history: [] as SceneSnapshot[],
		historyCursor: -1,

		settings: {
			grid: true,
		},
	}),
	getters: {
		selectedElements(state): SceneElement[] {
			return state.elements.filter(el => state.selectedIds.includes(el.id));
		},

		editableElement(state): SceneElement | null {
			return state.elements.find(el => el.id === state.editableId) || null;
		},
	},
	actions: {
		clientToWorld(clientX: number, clientY: number, svgElement: SVGSVGElement | null): { x: number; y: number } {
			if (!svgElement) return { x: 0, y: 0 };

			const rect = svgElement.getBoundingClientRect();
			const x = this.camera.x + (clientX - rect.left) * (this.camera.width / rect.width);
			const y = this.camera.y + (clientY - rect.top) * (this.camera.height / rect.height);

			return { x, y };
		},

		ensureInitialized() {
			if (this.elements.length > 0) return;

			this.elements = [];
			this.selectedIds = [];
			this.editableId = null;
			this.mode = 'select';
			this.tool = null;
		},

		// Метод, который будет вызываться из компонента холста при перемещении мыши
		updateCursor(clientX: number, clientY: number, svgElement: SVGSVGElement | null) {
			const { x, y } = this.clientToWorld(clientX, clientY, svgElement);
			this.cursor.x = Math.round(x);
			this.cursor.y = Math.round(y);
		},

		selectElement(id: string | null) {
			if (!id) {
				this.selectedIds = [];
				this.editableId = null;
				this.mode = 'select';
				return;
			}

			this.selectedIds = [id];
			this.editableId = null;
			this.mode = 'transform';
		},

		setEditable(id: string | null) {
			this.editableId = id;
			this.selectedIds = id ? [id] : [];
			this.mode = id ? 'edit' : 'select';
		},

		setTool(tool: SceneTool | null) {
			this.tool = tool;
			this.editableId = null;
			this.mode = tool ? 'draw' : 'select';
		},

		updateElementBox(id: string, box: SceneBox) {
			const index = this.elements.findIndex(el => el.id === id);
			if (index === -1) return;

			this.elements[index] = updateElementBox(this.elements[index], box);
		},

		setElementOpacity(id: string, opacity: number) {
			const element = this.elements.find(el => el.id === id);
			if (!element) return;

			element.attrs.opacity = opacity;
		},

		toggleElementLock(id: string) {
			const element = this.elements.find(el => el.id === id);
			if (!element) return;

			element.attrs.locked = !element.attrs.locked;
		},

		removeElement(id: string) {
			this.elements = this.elements.filter(el => el.id !== id);
			this.selectedIds = this.selectedIds.filter(selectedId => selectedId !== id);
			if (this.editableId === id) {
				this.editableId = null;
				this.mode = this.selectedIds.length ? 'transform' : 'select';
			}
		},
	},
});
