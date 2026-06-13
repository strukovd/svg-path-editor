<template>
	<g class="images reference-images">
		<g class="reference-image-add" @mousedown.stop.prevent @click.stop.prevent="openFileDialog">
			<rect
				:x="panelX"
				:y="panelY"
				:width="controlSize"
				:height="controlSize"
				:rx="controlRadius"
			/>
			<text
				:x="panelX + controlSize / 2"
				:y="panelY + controlSize / 2"
				:font-size="16 * s.camera.scale"
				text-anchor="middle"
				dominant-baseline="central"
			>+</text>
		</g>

		<g
			v-for="image in images"
			:key="image.id"
			:class="['reference-image', { active: image.id === activeId, locked: image.locked }]"
			v-show="image.visible"
		>
			<image
				:href="image.href"
				:x="image.x"
				:y="image.y"
				:width="image.width"
				:height="image.height"
				:opacity="image.opacity"
				preserveAspectRatio="none"
				@mousedown.stop.prevent="startMove(image, $event)"
			/>

			<g v-if="image.id === activeId" class="reference-image-controls">
				<rect
					class="reference-image-outline"
					:x="image.x"
					:y="image.y"
					:width="image.width"
					:height="image.height"
					vector-effect="non-scaling-stroke"
				/>

				<circle
					v-for="handle in resizeHandles"
					:key="handle.name"
					class="reference-image-handle"
					:cx="handleX(image, handle.name)"
					:cy="handleY(image, handle.name)"
					:r="5 * s.camera.scale"
					vector-effect="non-scaling-stroke"
					@mousedown.stop.prevent="startResize(image, handle.name, $event)"
				/>

				<g class="reference-image-toolbar">
					<g @mousedown.stop.prevent @click.stop.prevent="changeOpacity(image, -0.1)">
						<rect :x="toolbarX(image)" :y="toolbarY(image)" :width="controlSize" :height="controlSize" :rx="controlRadius"/>
						<text :x="toolbarX(image) + controlSize / 2" :y="toolbarY(image) + controlSize / 2" :font-size="14 * s.camera.scale" text-anchor="middle" dominant-baseline="central">-</text>
					</g>
					<g @mousedown.stop.prevent @click.stop.prevent="changeOpacity(image, 0.1)">
						<rect :x="toolbarX(image) + controlStep" :y="toolbarY(image)" :width="controlSize" :height="controlSize" :rx="controlRadius"/>
						<text :x="toolbarX(image) + controlStep + controlSize / 2" :y="toolbarY(image) + controlSize / 2" :font-size="14 * s.camera.scale" text-anchor="middle" dominant-baseline="central">+</text>
					</g>
					<g @mousedown.stop.prevent @click.stop.prevent="toggleLocked(image)">
						<rect :x="toolbarX(image) + controlStep * 2" :y="toolbarY(image)" :width="controlSize" :height="controlSize" :rx="controlRadius"/>
						<text :x="toolbarX(image) + controlStep * 2 + controlSize / 2" :y="toolbarY(image) + controlSize / 2" :font-size="12 * s.camera.scale" text-anchor="middle" dominant-baseline="central">{{ image.locked ? 'L' : 'U' }}</text>
					</g>
					<g @mousedown.stop.prevent @click.stop.prevent="removeImage(image.id)">
						<rect :x="toolbarX(image) + controlStep * 3" :y="toolbarY(image)" :width="controlSize" :height="controlSize" :rx="controlRadius"/>
						<text :x="toolbarX(image) + controlStep * 3 + controlSize / 2" :y="toolbarY(image) + controlSize / 2" :font-size="13 * s.camera.scale" text-anchor="middle" dominant-baseline="central">x</text>
					</g>
				</g>
			</g>
		</g>
	</g>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useSceneStore } from '@/stores/SceneStore';

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se';

interface ReferenceImage {
	id: string;
	name: string;
	href: string;
	x: number;
	y: number;
	width: number;
	height: number;
	opacity: number;
	locked: boolean;
	visible: boolean;
}

interface DragState {
	mode: 'move' | 'resize';
	imageId: string;
	handle?: ResizeHandle;
	startX: number;
	startY: number;
	originalX: number;
	originalY: number;
	originalWidth: number;
	originalHeight: number;
	svgElement: SVGSVGElement;
}

const s = useSceneStore();
const images = ref<ReferenceImage[]>([]);
const activeId = ref<string | null>(null);
const dragState = ref<DragState | null>(null);
const resizeHandles: Array<{ name: ResizeHandle }> = [
	{ name: 'nw' },
	{ name: 'ne' },
	{ name: 'sw' },
	{ name: 'se' },
];

const controlSize = computed(() => 26 * s.camera.scale);
const controlStep = computed(() => 30 * s.camera.scale);
const controlRadius = computed(() => 4 * s.camera.scale);
const panelX = computed(() => s.camera.x + 12 * s.camera.scale);
const panelY = computed(() => s.camera.y + 12 * s.camera.scale);

function makeId() {
	return `ref_${Math.random().toString(36).slice(2, 10)}`;
}

function getSceneSvg(target: EventTarget | null): SVGSVGElement | null {
	if (target instanceof SVGSVGElement) {
		return target;
	}
	if (target instanceof SVGElement) {
		return target.ownerSVGElement;
	}
	return document.getElementById('scene') as SVGSVGElement | null;
}

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function openFileDialog() {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = 'image/*';
	input.multiple = true;
	input.addEventListener('change', () => {
		void addFiles(input.files, null);
	});
	input.click();
}

async function addFiles(fileList: FileList | File[] | null, origin: { x: number; y: number } | null) {
	if (!fileList) return;

	for (const file of Array.from(fileList)) {
		if (!file.type.startsWith('image/')) continue;
		await addImageFromFile(file, origin);
	}
}

async function addImageFromFile(file: File, origin: { x: number; y: number } | null) {
	const href = URL.createObjectURL(file);
	const size = await readImageSize(href);
	const maxWidth = Math.max(120, s.camera.width * 0.35);
	const scale = Math.min(1, maxWidth / size.width);
	const width = Math.max(40, size.width * scale);
	const height = Math.max(40, size.height * scale);
	const x = origin ? origin.x : s.camera.x + (s.camera.width - width) / 2;
	const y = origin ? origin.y : s.camera.y + (s.camera.height - height) / 2;

	const image: ReferenceImage = {
		id: makeId(),
		name: file.name,
		href,
		x,
		y,
		width,
		height,
		opacity: 0.65,
		locked: false,
		visible: true,
	};

	images.value.push(image);
	activeId.value = image.id;
}

function readImageSize(src: string): Promise<{ width: number; height: number }> {
	return new Promise((resolve) => {
		const image = new Image();
		image.onload = () => resolve({ width: image.naturalWidth || 200, height: image.naturalHeight || 200 });
		image.onerror = () => resolve({ width: 200, height: 200 });
		image.src = src;
	});
}

function startMove(image: ReferenceImage, e: MouseEvent) {
	activeId.value = image.id;
	if (image.locked) return;

	const svgElement = getSceneSvg(e.currentTarget);
	if (!svgElement) return;

	const start = s.clientToWorld(e.clientX, e.clientY, svgElement);
	dragState.value = {
		mode: 'move',
		imageId: image.id,
		startX: start.x,
		startY: start.y,
		originalX: image.x,
		originalY: image.y,
		originalWidth: image.width,
		originalHeight: image.height,
		svgElement,
	};

	document.addEventListener('mousemove', drag);
	document.addEventListener('mouseup', stopDrag);
}

function startResize(image: ReferenceImage, handle: ResizeHandle, e: MouseEvent) {
	activeId.value = image.id;
	if (image.locked) return;

	const svgElement = getSceneSvg(e.currentTarget);
	if (!svgElement) return;

	const start = s.clientToWorld(e.clientX, e.clientY, svgElement);
	dragState.value = {
		mode: 'resize',
		imageId: image.id,
		handle,
		startX: start.x,
		startY: start.y,
		originalX: image.x,
		originalY: image.y,
		originalWidth: image.width,
		originalHeight: image.height,
		svgElement,
	};

	document.addEventListener('mousemove', drag);
	document.addEventListener('mouseup', stopDrag);
}

function drag(e: MouseEvent) {
	const state = dragState.value;
	if (!state) return;

	const image = images.value.find(it => it.id === state.imageId);
	if (!image) return;

	const current = s.clientToWorld(e.clientX, e.clientY, state.svgElement);
	const dx = current.x - state.startX;
	const dy = current.y - state.startY;

	if (state.mode === 'move') {
		image.x = state.originalX + dx;
		image.y = state.originalY + dy;
		return;
	}

	resizeImage(image, state, dx, dy);
}

function resizeImage(image: ReferenceImage, state: DragState, dx: number, dy: number) {
	const minSize = 20 * s.camera.scale;
	let x = state.originalX;
	let y = state.originalY;
	let width = state.originalWidth;
	let height = state.originalHeight;

	if (state.handle === 'nw' || state.handle === 'sw') {
		x = state.originalX + dx;
		width = state.originalWidth - dx;
	}
	if (state.handle === 'ne' || state.handle === 'se') {
		width = state.originalWidth + dx;
	}
	if (state.handle === 'nw' || state.handle === 'ne') {
		y = state.originalY + dy;
		height = state.originalHeight - dy;
	}
	if (state.handle === 'sw' || state.handle === 'se') {
		height = state.originalHeight + dy;
	}

	if (width < minSize) {
		if (state.handle === 'nw' || state.handle === 'sw') {
			x = state.originalX + state.originalWidth - minSize;
		}
		width = minSize;
	}
	if (height < minSize) {
		if (state.handle === 'nw' || state.handle === 'ne') {
			y = state.originalY + state.originalHeight - minSize;
		}
		height = minSize;
	}

	image.x = x;
	image.y = y;
	image.width = width;
	image.height = height;
}

function stopDrag() {
	dragState.value = null;
	document.removeEventListener('mousemove', drag);
	document.removeEventListener('mouseup', stopDrag);
}

function changeOpacity(image: ReferenceImage, delta: number) {
	image.opacity = Number(clamp(image.opacity + delta, 0.1, 1).toFixed(2));
}

function toggleLocked(image: ReferenceImage) {
	image.locked = !image.locked;
}

function removeImage(id: string) {
	const image = images.value.find(it => it.id === id);
	if (image) {
		URL.revokeObjectURL(image.href);
	}
	images.value = images.value.filter(it => it.id !== id);
	if (activeId.value === id) {
		activeId.value = null;
	}
}

function handleX(image: ReferenceImage, handle: ResizeHandle) {
	return handle === 'nw' || handle === 'sw' ? image.x : image.x + image.width;
}

function handleY(image: ReferenceImage, handle: ResizeHandle) {
	return handle === 'nw' || handle === 'ne' ? image.y : image.y + image.height;
}

function toolbarX(image: ReferenceImage) {
	return image.x;
}

function toolbarY(image: ReferenceImage) {
	return image.y - controlStep.value;
}

function onDragOver(e: DragEvent) {
	const svgElement = getSceneSvg(e.target);
	if (!svgElement || !svgElement.contains(e.target as Node)) return;
	e.preventDefault();
}

function onDrop(e: DragEvent) {
	const svgElement = getSceneSvg(e.target);
	if (!svgElement || !svgElement.contains(e.target as Node)) return;
	e.preventDefault();

	const origin = s.clientToWorld(e.clientX, e.clientY, svgElement);
	void addFiles(e.dataTransfer?.files ?? null, origin);
}

function onPaste(e: ClipboardEvent) {
	const files = Array.from(e.clipboardData?.files ?? []).filter(file => file.type.startsWith('image/'));
	if (!files.length) return;
	void addFiles(files, null);
}

onMounted(() => {
	document.addEventListener('dragover', onDragOver);
	document.addEventListener('drop', onDrop);
	document.addEventListener('paste', onPaste);
});

onUnmounted(() => {
	stopDrag();
	document.removeEventListener('dragover', onDragOver);
	document.removeEventListener('drop', onDrop);
	document.removeEventListener('paste', onPaste);
	for (const image of images.value) {
		URL.revokeObjectURL(image.href);
	}
});
</script>

<style lang="scss">
.reference-images {
	.reference-image-add rect,
	.reference-image-toolbar rect {
		fill: #202124;
		stroke: #4b4d50;
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	.reference-image-add text,
	.reference-image-toolbar text {
		fill: #f4f4f5;
		pointer-events: none;
		user-select: none;
	}

	.reference-image image {
		cursor: move;
	}

	.reference-image.locked image {
		cursor: default;
	}

	.reference-image-outline {
		fill: transparent;
		stroke: #00c2ff;
		stroke-dasharray: 6 4;
		stroke-width: 1;
		pointer-events: none;
	}

	.reference-image-handle {
		fill: #00c2ff;
		stroke: #101113;
		stroke-width: 1;
		cursor: nwse-resize;
	}
}
</style>
