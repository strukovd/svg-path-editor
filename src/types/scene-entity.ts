export type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se';

export interface SceneBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface SceneEntityCapabilities {
	move?: boolean;
	resize?: boolean;
	opacity?: boolean;
	lock?: boolean;
	remove?: boolean;
}
