import type { ResizeHandle, SceneBox } from '@/types/scene-entity';

export function moveBox(box: SceneBox, dx: number, dy: number): SceneBox {
	return {
		...box,
		x: box.x + dx,
		y: box.y + dy,
	};
}

export function resizeBox(box: SceneBox, handle: ResizeHandle, dx: number, dy: number, minSize: number): SceneBox {
	let x = box.x;
	let y = box.y;
	let width = box.width;
	let height = box.height;

	if (handle === 'nw' || handle === 'sw') {
		x = box.x + dx;
		width = box.width - dx;
	}
	if (handle === 'ne' || handle === 'se') {
		width = box.width + dx;
	}
	if (handle === 'nw' || handle === 'ne') {
		y = box.y + dy;
		height = box.height - dy;
	}
	if (handle === 'sw' || handle === 'se') {
		height = box.height + dy;
	}

	if (width < minSize) {
		if (handle === 'nw' || handle === 'sw') {
			x = box.x + box.width - minSize;
		}
		width = minSize;
	}
	if (height < minSize) {
		if (handle === 'nw' || handle === 'ne') {
			y = box.y + box.height - minSize;
		}
		height = minSize;
	}

	return { x, y, width, height };
}
