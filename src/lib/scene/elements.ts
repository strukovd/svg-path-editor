import type { SceneElement } from '@/types/scene';
import type { SceneBox } from '@/types/scene-entity';

export function getElementBox(element: SceneElement): SceneBox {
	switch (element.type) {
		case 'rect':
		case 'image':
			return {
				x: element.x,
				y: element.y,
				width: element.width,
				height: element.height,
			};

		case 'line':
			return {
				x: Math.min(element.x1, element.x2),
				y: Math.min(element.y1, element.y2),
				width: Math.abs(element.x2 - element.x1),
				height: Math.abs(element.y2 - element.y1),
			};

		case 'circle':
			return {
				x: element.cx - element.r,
				y: element.cy - element.r,
				width: element.r * 2,
				height: element.r * 2,
			};

		case 'ellipse':
			return {
				x: element.cx - element.rx,
				y: element.cy - element.ry,
				width: element.rx * 2,
				height: element.ry * 2,
			};
	}
}

export function updateElementBox(element: SceneElement, box: SceneBox): SceneElement {
	switch (element.type) {
		case 'rect':
		case 'image':
			return {
				...element,
				x: box.x,
				y: box.y,
				width: box.width,
				height: box.height,
			};

		case 'line':
			return {
				...element,
				x1: box.x,
				y1: box.y,
				x2: box.x + box.width,
				y2: box.y + box.height,
			};

		case 'circle': {
			const size = Math.max(box.width, box.height);
			const radius = size / 2;

			return {
				...element,
				cx: box.x + box.width / 2,
				cy: box.y + box.height / 2,
				r: radius,
			};
		}

		case 'ellipse':
			return {
				...element,
				cx: box.x + box.width / 2,
				cy: box.y + box.height / 2,
				rx: box.width / 2,
				ry: box.height / 2,
			};
	}
}
