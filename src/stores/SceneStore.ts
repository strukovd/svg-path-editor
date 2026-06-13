import { defineStore } from 'pinia';
import { Path } from '@/lib/svg';
import type { SceneElement, SceneSnapshot, SerializedElement } from '@/types/scene';

const kDefaultPath = 'M168 200H279C282.542 200 285.932 198.756 289 197 292.068 195.244 295.23 193.041 297 190 298.77 186.959 300.002 183.51 300 179.999 299.998 176.488 298.773 173.04 297 170.001L222 41C220.23 37.96 218.067 35.7552 215 34 211.933 32.2448 207.542 31 204 31 200.458 31 197.067 32.2448 194 34 190.933 35.7552 188.77 37.96 187 41L168 74 130 9.9976C128.228 6.9578 126.068 3.7549 123 2 119.932.2451 116.542 0 113 0 109.458 0 106.068.2451 103 2 99.9323 3.7549 96.7717 6.9578 95 9.9976L2 170.001C.227 173.04.0015 176.488 0 179.999-.0015 183.51.2296 186.959 2 190 3.7704 193.04 6.9325 195.244 10 197 13.0675 198.756 16.4578 200 20 200H90C117.737 200 137.925 187.558 152 164L186 105 204 74 259 168H182L168 200ZM89 168H40L113 42 150 105 125.491 147.725C116.144 163.01 105.488 168 89 168Z';
const svgContent = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 426.722 426.722"> <path fill="red" d="M368.758,287.617c-21.18,1.309-49.047,22.476-75.924,34.649c-32.945,14.916-84.221,2.924-84.227,2.924 c7.911-3.712,40.055-11.369,46.529-14.208c34.411-15.146,31.491-46.688,15.103-46.423c-21.651,0.345-34.363,5.659-77.563,11.55 c-32.747,4.452-71.476,2.824-90.053,9.918c-26.224,10.016-68.456,77.409-68.456,77.409l65.301,63.285 c0,0,40.427-39.816,60.096-39.816c44.823,0,46.642-0.6,88.255-2.864c17.697-0.947,21.391-1.675,31.527-5.087 c53.943-18.242,111.875-66.819,112.938-72.662C394.748,292.757,379.947,286.941,368.758,287.617z"></path> <path fill="green" d="M239.811,63.419c9.084-5.406,17.193-12.917,24.35-20.545c6.033-6.422,14.008-14.662,13.145-24.183 c-0.604-6.702-6.232-10.025-12.385-10.787c-1.979-0.248-3.969-0.312-5.967-0.283c-1.342,0.019-4.057-0.339-5.108,0.683 c-2.205,2.143-4.397,4.282-6.586,6.439c-0.47-1.463-0.929-2.929-1.394-4.413c-0.274-0.874-1.047-1.211-1.91-1.087 c-6.075,0.96-12.025,2.155-18.139,1.028c-7.507-1.385-14.895-3.486-22.312-5.223c-0.853-0.206-1.65,0.256-1.917,1.085 c-0.601,1.906-1.207,3.81-1.805,5.713c-2.621-2.594-5.255-5.158-7.9-7.73c-0.627-0.601-1.492-1.91-2.438-2.068 c-1.759-0.32-3.525-0.623-5.3-0.902c-2.766-0.431-5.544-0.753-8.336-0.97c-6.132-0.477-17.21-0.58-17.552,7.905 c-0.322,13.584,11.665,24.348,20.26,33.364c5.32,5.584,11.703,12.042,15.28,19.344c-37.986,12.278-70.376,58.399-70.376,108.015 c0,57.964,27.508,73.853,89.944,73.853c62.429,0,89.933-15.889,89.933-73.853C303.297,122.215,274.742,78.721,239.811,63.419z M239.783,177.332c-2.287,3.413-5.44,6.149-9.062,8.06c-1.91,0.986-3.917,1.771-5.97,2.378c-0.291,0.098-2.97,0.826-2.97,0.826 v7.489c0,3.484-0.666,7.175-3.787,9.245c-3.411,2.241-8.458,1.572-10.99-1.688c-1.855-2.38-1.961-5.511-1.961-8.401 c0-2.192,0-6.651,0-6.651s-1.709-0.519-2.075-0.612c-1.199-0.326-2.388-0.713-3.564-1.113c-0.697-0.246-1.379-0.504-2.069-0.775 c-0.494,0.331-1.013,0.634-1.547,0.899c-0.94,0.466-1.954,0.799-2.991,0.911c-4.103,0.388-7.709-2.053-8.775-6.011 c-0.668-2.516-0.479-5.211-0.479-7.803c0-2.581-0.196-5.305,0.479-7.841c1.134-4.183,4.997-6.56,9.256-5.954 c2.002,0.277,3.811,1.262,5.039,2.868c0.648,0.839,1.116,1.811,1.452,2.801c0.312,0.938,0.54,1.897,1.157,2.681 c1.217,1.532,3.426,2.325,5.212,2.896c2.373,0.767,4.868,1.144,7.36,1.144c3.994,0,8.934-0.856,11.828-3.886 c1.975-2.083,1.24-5.711-1.486-6.654c-2.598-0.881-4.812-1.328-7.344-1.791c-2.332-0.442-4.666-0.861-6.989-1.299 c-6.391-1.172-13.042-2.759-17.736-7.583c-6.001-6.15-7.173-15.882-2.713-23.269c2.193-3.631,5.48-6.573,9.261-8.482 c1.962-0.999,4.053-1.71,6.184-2.212c0.62-0.154,0.54-0.097,0.54-0.654c0-0.47,0-0.956,0-1.444c0-2.287-0.133-4.641,0.072-6.919 c0.345-4.042,2.537-7.679,6.807-8.375c4.174-0.662,8.068,1.586,9.291,5.665c0.762,2.526,0.568,5.257,0.568,7.879 c0,1.102,0,2.201,0,3.303c0,0.101,0,0.224,0,0.328c0,0.048,1.084,0.23,1.207,0.253c0.604,0.119,1.207,0.273,1.8,0.438 c0.487,0.128,1.294,0.584,1.694,0.261c3.438-2.789,8.961-2.683,11.879,0.784c2.176,2.611,2.121,6.77,2.121,9.979 c0,2.965,0.239,6.099-0.99,8.868c-1.742,3.902-6.379,5.55-10.303,4.101c-1.918-0.689-3.509-2.124-4.412-3.952 c-0.271-0.535-0.479-1.094-0.639-1.666c-0.072-0.26-0.139-0.524-0.195-0.788c-0.197-0.127-0.401-0.249-0.613-0.355 c-0.844-0.476-1.743-0.848-2.67-1.153c-2.168-0.686-4.447-0.903-6.708-0.87c-2.086,0.028-4.213,0.204-6.206,0.815 c-2.503,0.771-6.816,3.8-3.409,6.253c2.032,1.48,4.964,1.889,7.35,2.361c2.124,0.405,4.243,0.83,6.368,1.236 c6.312,1.244,13.182,2.531,18.23,6.815c-3.438-2.91,4.596,3.847,0,0C244.05,157.175,245.365,168.973,239.783,177.332z"></path> </svg>`;

const makeId = () => `el_${Math.random().toString(36).slice(2, 10)}`;

function serializeElement(el: SceneElement): SerializedElement {
	if (el.type === 'path') {
		return {
			id: el.id,
			type: el.type,
			name: el.name,
			attrs: el.attrs,
			data: { d: el.data.asString() }
		};
	}

	return {
		id: el.id,
		type: el.type,
		name: el.name,
		attrs: el.attrs,
		data: {}
	};
}

function deserializeElement(el: SerializedElement): SceneElement {
	if (el.type === 'path') {
		const pathString = typeof el.data?.d === 'string' ? el.data.d : kDefaultPath;
		return {
			id: el.id,
			type: 'path',
			name: el.name,
			attrs: el.attrs,
			data: new Path(pathString)
		};
	}

	return {
		id: el.id,
		type: 'path',
		name: el.name,
		attrs: el.attrs,
		data: new Path(kDefaultPath)
	};
}

function serializeScene(elements: SceneElement[], activeId: string | null): SceneSnapshot {
	return {
		elements: elements.map(serializeElement),
		activeId
	};
}

function deserializeScene(snapshot: SceneSnapshot): { elements: SceneElement[]; activeId: string | null } {
	return {
		elements: snapshot.elements.map(deserializeElement),
		activeId: snapshot.activeId
	};
}

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
		activeId: null as string | null,
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

		ensureInitialized() {
			if (this.elements.length === 0) {
				const defaultEl: SceneElement = {
					id: makeId(),
					type: 'path',
					name: 'Path 1',
					data: new Path(kDefaultPath),
					attrs: { stroke: '#fff', fill: '#ffffff22' }
				};
				this.elements = [defaultEl];
				this.activeId = defaultEl.id;
				this.pushHistory();
			}
		},

		setActive(id: string | null) {
			this.activeId = id;
		},

		updateActivePath(mutator: (path: Path) => void, pushHistory = true) {
			const active = this.activeElement;
			if (!active || active.type !== 'path') return;
			mutator(active.data);
			if (pushHistory) {
				this.pushHistory();
			}
		},

		pushHistory() {
			const snapshot = serializeScene(this.elements, this.activeId);
			const cursor = this.historyCursor;
			this.history = this.history.slice(0, cursor + 1);
			this.history.push(snapshot);
			this.historyCursor = this.history.length - 1;
		},

		undo() {
			if (this.historyCursor <= 0) return;
			this.historyCursor -= 1;
			const snapshot = this.history[this.historyCursor];
			const { elements, activeId } = deserializeScene(snapshot);
			this.elements = elements;
			this.activeId = activeId;
		},

		redo() {
			if (this.historyCursor >= this.history.length - 1) return;
			this.historyCursor += 1;
			const snapshot = this.history[this.historyCursor];
			const { elements, activeId } = deserializeScene(snapshot);
			this.elements = elements;
			this.activeId = activeId;
		}
	}
});
