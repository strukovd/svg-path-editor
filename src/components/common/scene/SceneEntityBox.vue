<template>
	<g :class="['scene-entity-box', { active, locked }]" @mousedown.stop.prevent="startMove">
		<slot/>

		<g v-if="active" class="scene-entity-controls">
			<rect
				class="scene-entity-outline"
				:x="box.x"
				:y="box.y"
				:width="box.width"
				:height="box.height"
				vector-effect="non-scaling-stroke"
			/>

			<circle
				v-for="handle in resizeHandles"
				v-if="canResize"
				:key="handle"
				class="scene-entity-handle"
				:cx="handleX(handle)"
				:cy="handleY(handle)"
				:r="5 * s.camera.scale"
				vector-effect="non-scaling-stroke"
				@mousedown.stop.prevent="startResize(handle, $event)"
			/>

			<g class="scene-entity-toolbar">
				<g v-if="canChangeOpacity" @mousedown.stop.prevent @click.stop.prevent="emitOpacityChange(-0.1)">
					<rect :x="toolbarX" :y="toolbarY" :width="controlSize" :height="controlSize" :rx="controlRadius"/>
					<text :x="toolbarX + controlSize / 2" :y="toolbarY + controlSize / 2" :font-size="14 * s.camera.scale" text-anchor="middle" dominant-baseline="central">-</text>
				</g>
				<g v-if="canChangeOpacity" @mousedown.stop.prevent @click.stop.prevent="emitOpacityChange(0.1)">
					<rect :x="toolbarX + toolbarOffset('opacity-up')" :y="toolbarY" :width="controlSize" :height="controlSize" :rx="controlRadius"/>
					<text :x="toolbarX + toolbarOffset('opacity-up') + controlSize / 2" :y="toolbarY + controlSize / 2" :font-size="14 * s.camera.scale" text-anchor="middle" dominant-baseline="central">+</text>
				</g>
				<g v-if="canLock" @mousedown.stop.prevent @click.stop.prevent="emit('toggle-lock')">
					<rect :x="toolbarX + toolbarOffset('lock')" :y="toolbarY" :width="controlSize" :height="controlSize" :rx="controlRadius"/>
					<text :x="toolbarX + toolbarOffset('lock') + controlSize / 2" :y="toolbarY + controlSize / 2" :font-size="12 * s.camera.scale" text-anchor="middle" dominant-baseline="central">{{ locked ? 'L' : 'U' }}</text>
				</g>
				<g v-if="canRemove" @mousedown.stop.prevent @click.stop.prevent="emit('remove')">
					<rect :x="toolbarX + toolbarOffset('remove')" :y="toolbarY" :width="controlSize" :height="controlSize" :rx="controlRadius"/>
					<text :x="toolbarX + toolbarOffset('remove') + controlSize / 2" :y="toolbarY + controlSize / 2" :font-size="13 * s.camera.scale" text-anchor="middle" dominant-baseline="central">x</text>
				</g>
			</g>
		</g>
	</g>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue';
import { useSceneStore } from '@/stores/SceneStore';
import { moveBox, resizeBox } from '@/lib/scene/entity-box';
import type { ResizeHandle, SceneBox, SceneEntityCapabilities } from '@/types/scene-entity';

type DragMode = 'move' | 'resize';
type ToolbarAction = 'opacity-up' | 'lock' | 'remove';

interface DragState {
	mode: DragMode;
	handle?: ResizeHandle;
	startX: number;
	startY: number;
	originalBox: SceneBox;
	svgElement: SVGSVGElement;
}

const props = withDefaults(defineProps<{
	box: SceneBox;
	active?: boolean;
	locked?: boolean;
	opacity?: number;
	capabilities?: SceneEntityCapabilities;
}>(), {
	active: false,
	locked: false,
	opacity: 1,
	capabilities: () => ({
		move: true,
		resize: true,
		opacity: true,
		lock: true,
		remove: true,
	}),
});

const emit = defineEmits<{
	select: [];
	'change-box': [box: SceneBox];
	'change-opacity': [opacity: number];
	'toggle-lock': [];
	remove: [];
}>();

const s = useSceneStore();
const dragState = ref<DragState | null>(null);
const resizeHandles: ResizeHandle[] = ['nw', 'ne', 'sw', 'se'];

const controlSize = computed(() => 26 * s.camera.scale);
const controlStep = computed(() => 30 * s.camera.scale);
const controlRadius = computed(() => 4 * s.camera.scale);
const toolbarX = computed(() => props.box.x);
const toolbarY = computed(() => props.box.y - controlStep.value);

const canMove = computed(() => props.capabilities.move !== false && !props.locked);
const canResize = computed(() => props.capabilities.resize !== false && !props.locked);
const canChangeOpacity = computed(() => props.capabilities.opacity !== false);
const canLock = computed(() => props.capabilities.lock !== false);
const canRemove = computed(() => props.capabilities.remove !== false);

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

function startMove(e: MouseEvent) {
	emit('select');
	if (!canMove.value) return;

	const svgElement = getSceneSvg(e.currentTarget);
	if (!svgElement) return;

	const start = s.clientToWorld(e.clientX, e.clientY, svgElement);
	dragState.value = {
		mode: 'move',
		startX: start.x,
		startY: start.y,
		originalBox: { ...props.box },
		svgElement,
	};

	document.addEventListener('mousemove', drag);
	document.addEventListener('mouseup', stopDrag);
}

function startResize(handle: ResizeHandle, e: MouseEvent) {
	emit('select');
	if (!canResize.value) return;

	const svgElement = getSceneSvg(e.currentTarget);
	if (!svgElement) return;

	const start = s.clientToWorld(e.clientX, e.clientY, svgElement);
	dragState.value = {
		mode: 'resize',
		handle,
		startX: start.x,
		startY: start.y,
		originalBox: { ...props.box },
		svgElement,
	};

	document.addEventListener('mousemove', drag);
	document.addEventListener('mouseup', stopDrag);
}

function drag(e: MouseEvent) {
	const state = dragState.value;
	if (!state) return;

	const current = s.clientToWorld(e.clientX, e.clientY, state.svgElement);
	const dx = current.x - state.startX;
	const dy = current.y - state.startY;

	if (state.mode === 'move') {
		emit('change-box', moveBox(state.originalBox, dx, dy));
		return;
	}

	if (state.handle) {
		emit('change-box', resizeBox(state.originalBox, state.handle, dx, dy, 20 * s.camera.scale));
	}
}

function stopDrag() {
	dragState.value = null;
	document.removeEventListener('mousemove', drag);
	document.removeEventListener('mouseup', stopDrag);
}

function emitOpacityChange(delta: number) {
	emit('change-opacity', Number(clamp(props.opacity + delta, 0.1, 1).toFixed(2)));
}

function handleX(handle: ResizeHandle) {
	return handle === 'nw' || handle === 'sw' ? props.box.x : props.box.x + props.box.width;
}

function handleY(handle: ResizeHandle) {
	return handle === 'nw' || handle === 'ne' ? props.box.y : props.box.y + props.box.height;
}

function toolbarOffset(action: ToolbarAction) {
	const enabledActions: ToolbarAction[] = [];
	if (canChangeOpacity.value) {
		enabledActions.push('opacity-up');
	}
	if (canLock.value) {
		enabledActions.push('lock');
	}
	if (canRemove.value) {
		enabledActions.push('remove');
	}
	return (enabledActions.indexOf(action) + 1) * controlStep.value;
}

onUnmounted(() => {
	stopDrag();
});
</script>

<style lang="scss">
.scene-entity-box {
	.scene-entity-outline {
		fill: transparent;
		stroke: #00c2ff;
		stroke-dasharray: 6 4;
		stroke-width: 1;
		pointer-events: none;
	}

	.scene-entity-handle {
		fill: #00c2ff;
		stroke: #101113;
		stroke-width: 1;
		cursor: nwse-resize;
	}

	.scene-entity-toolbar rect {
		fill: #202124;
		stroke: #4b4d50;
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	.scene-entity-toolbar text {
		fill: #f4f4f5;
		pointer-events: none;
		user-select: none;
	}
}
</style>
