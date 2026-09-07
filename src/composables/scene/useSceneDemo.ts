// @/composables/scene/useSceneDemoSeeds.ts
import { useSceneStore } from '@/stores/SceneStore';
import type { SceneElement } from '@/types/scene';

const makeId = () => `el_${Math.random().toString(36).slice(2, 10)}`;


function generateDefaultElements(): SceneElement[] {
	return [
		{
			id: makeId(),
			type: 'rect',
			name: 'Rect 1',
			x: 80, y: 70, width: 180, height: 120,
			attrs: { fill: '#ffffff14', stroke: '#f4f4f5', strokeWidth: 1, visible: true, locked: false }
		},
		{
			id: makeId(),
			type: 'line',
			name: 'Line 1',
			x1: 320, y1: 90, x2: 460, y2: 210,
			attrs: { stroke: '#00c2ff', strokeWidth: 2, visible: true, locked: false }
		},
		{
			id: makeId(),
			type: 'ellipse',
			name: 'Ellipse 1',
			cx: 610, cy: 150, rx: 85, ry: 55,
			attrs: { fill: '#00c2ff22', stroke: '#00c2ff', strokeWidth: 1, visible: true, locked: false }
		}
	];
}

export function useSceneDemoSeeds() {
	const s = useSceneStore();

	function injectDemoData() {
		if (s.elements.length > 0) return;
		s.elements = generateDefaultElements();
	}

	return { injectDemoData };
}
