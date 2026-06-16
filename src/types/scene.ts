import { Path } from '@/lib/svg';

export type SceneElementType = 'path' | 'circle' | 'ellipse' | 'line' | 'polyline' | 'polygon' | 'rect' | 'text' | 'image' | 'g';

/**
 * Все svg состоят из базовых элементов, у которых есть id, type, name и атрибуты. У path элемента есть еще data, который содержит команды пути.
 */
export interface BaseElement {
	id: string;
	type: SceneElementType;
	name?: string;
	attrs?: Record<string, unknown>;
}

export interface PathElement extends BaseElement {
	type: 'path';
	data: Path;
}

export type SceneElement = PathElement;

export interface SerializedElement {
	id: string;
	type: SceneElementType;
	name?: string;
	attrs?: Record<string, unknown>;
	data: Record<string, unknown>;
}

export interface SceneSnapshot {
	elements: SerializedElement[];
	activeId: string | null;
}
