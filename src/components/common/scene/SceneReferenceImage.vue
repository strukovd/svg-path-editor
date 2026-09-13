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
			<SceneEntityBox
				:box="getImageBox(image)"
				:active="image.id === activeId"
				:locked="image.locked"
				:opacity="image.opacity"
				@select="activeId = image.id"
				@change-box="box => setImageBox(image, box)"
				@change-opacity="opacity => image.opacity = opacity"
				@toggle-lock="image.locked = !image.locked"
				@remove="removeImage(image.id)"
			>
				<image
					:href="image.href"
					:x="image.x"
					:y="image.y"
					:width="image.width"
					:height="image.height"
					:opacity="image.opacity"
					preserveAspectRatio="none"
				/>
			</SceneEntityBox>
		</g>
	</g>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useSceneMouse } from '@/composables/scene/useSceneMouse';
import { useSceneStore } from '@/stores/SceneStore';
import type { SceneBox } from '@/types/scene-entity';
import SceneEntityBox from './SceneEntityBox.vue';

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

const s = useSceneStore();
const { clientToWorld } = useSceneMouse();
const images = ref<ReferenceImage[]>([]);
const activeId = ref<string | null>(null);

const controlSize = computed(() => 26 * s.camera.scale);
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

function getImageBox(image: ReferenceImage): SceneBox {
	return {
		x: image.x,
		y: image.y,
		width: image.width,
		height: image.height,
	};
}

function setImageBox(image: ReferenceImage, box: SceneBox) {
	image.x = box.x;
	image.y = box.y;
	image.width = box.width;
	image.height = box.height;
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

function onDragOver(e: DragEvent) {
	const svgElement = getSceneSvg(e.target);
	if (!svgElement || !svgElement.contains(e.target as Node)) return;
	e.preventDefault();
}

function onDrop(e: DragEvent) {
	const svgElement = getSceneSvg(e.target);
	if (!svgElement || !svgElement.contains(e.target as Node)) return;
	e.preventDefault();

	const origin = clientToWorld(e.clientX, e.clientY, svgElement);
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
	.reference-image-add rect {
		fill: #202124;
		stroke: #4b4d50;
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	.reference-image-add text {
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
}
</style>
