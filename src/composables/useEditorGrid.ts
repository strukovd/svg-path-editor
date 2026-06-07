import { reactive } from 'vue';


const BASE_LINE_THICKNESS = 0.5; // базовая толщина линий сетки
const MAJOR_LINE_THICKNESS = BASE_LINE_THICKNESS * 2; // толщина более толстых (major) линий
const CROSS_LINE_THICKNESS = BASE_LINE_THICKNESS * 4; // центральные линии в 4 раза толще обычных

const DEFAULT_LINE_GAP = 10; // расстояние между линиями сетки
const MAJOR_LINE_FREQUENCY = 5; // Частота\кратность major линий (каждая n-я линия будет толще)
const MAJOR_GAP = MAJOR_LINE_FREQUENCY * DEFAULT_LINE_GAP; // расстояние между major линиями

const isMajorLine = (n: number): boolean => {
	// Определяет является ли линия толстой (major) или тонкой (minor)
	return n % MAJOR_GAP === 0;
}

export function useEditorGrid() {
	const grid = reactive({
		xLines: [] as number[],
		yLines: [] as number[],
		enabled: true,
		majorGap: MAJOR_LINE_FREQUENCY * DEFAULT_LINE_GAP, // каждые tick линий - более толстая линия
		baseLineThickness: BASE_LINE_THICKNESS,
		baseLineGap: DEFAULT_LINE_GAP,
		crossLineThickness: CROSS_LINE_THICKNESS, // в сколько раз центральный крест жирнее обычных линий
	});

	function getLineThickness(n: number, scale: number): number {
		// Определяет является ли линия толстой (major)
		const baseWidth = grid.baseLineThickness * scale;
		if ( isMajorLine(n) ) {
			return baseWidth * 2;
		}
		return baseWidth;
	}

	function updateGrid(options: UpdateEditorGridOptions) {
		const {
			viewPortWidth,
			viewPortHeight,
			visibleBounds,
			scale,
		} = options;

		if (!viewPortWidth) {
			return;
		}

		const { left, right, top, bottom } = visibleBounds;
		const padding = 0.5; // рисуем чуть шире видимой области

		// Отключение сетки (линий будет слишком много, когда далеко)
		if (scale > 2) {
			grid.xLines = [];
			grid.yLines = [];
			return;
		}

		const startX = Math.floor((left - viewPortWidth * padding) / grid.baseLineGap) * grid.baseLineGap;
		const endX = Math.ceil((right + viewPortWidth * padding) / grid.baseLineGap) * grid.baseLineGap;
		const startY = Math.floor((top - viewPortHeight * padding) / grid.baseLineGap) * grid.baseLineGap;
		const endY = Math.ceil((bottom + viewPortHeight * padding) / grid.baseLineGap) * grid.baseLineGap;

		const xLines: number[] = [];
		for (let x = startX; x <= endX; x += grid.baseLineGap) {
			if (x !== 0) { // нулевая рисуется отдельно как жирная
				xLines.push(x);
			}
		}

		const yLines: number[] = [];
		for (let y = startY; y <= endY; y += grid.baseLineGap) {
			if (y !== 0) {
				yLines.push(y);
			}
		}

		grid.xLines = xLines;
		grid.yLines = yLines;
	}

	return {
		grid,
		getLineThickness,
		updateGrid,
	};
}


export interface EditorGridBounds {
	left: number;
	top: number;
	right: number;
	bottom: number;
}

export interface UpdateEditorGridOptions {
	editorWidth: number;
	viewPortWidth: number;
	viewPortHeight: number;
	visibleBounds: EditorGridBounds;
	scale: number;
}
