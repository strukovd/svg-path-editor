// export type SceneMode =
// 	'select' // выбор элементов
// 	| 'transform'
// 	| 'edit'
// 	| 'draw';
export type SceneTool = 'rect' | 'line' | 'circle' | 'ellipse' | 'image' | 'path';
export type SceneElementType = SceneTool | 'polyline' | 'polygon' | 'text' | 'g';

export interface SceneElementAttrs {
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	opacity?: number;
	visible?: boolean;
	locked?: boolean;
	[key: string]: unknown;
}

export interface BaseElement {
	id: string;
	type: SceneElementType;
	name?: string;
	attrs: SceneElementAttrs;
}

export interface RectElement extends BaseElement {
	type: 'rect';
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface LineElement extends BaseElement {
	type: 'line';
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

export interface CircleElement extends BaseElement {
	type: 'circle';
	cx: number;
	cy: number;
	r: number;
}

export interface EllipseElement extends BaseElement {
	type: 'ellipse';
	cx: number;
	cy: number;
	rx: number;
	ry: number;
}

export interface ImageElement extends BaseElement {
	type: 'image';
	href: string;
	x: number;
	y: number;
	width: number;
	height: number;
	preserveAspectRatio?: string;
}

export type SceneElement =
	| RectElement
	| LineElement
	| CircleElement
	| EllipseElement
	| ImageElement;

export interface SceneSnapshot {
	elements: SceneElement[];
	selectedIds: string[];
	editableId: string | null;
	mode: any;
	tool: SceneTool | null;
}
