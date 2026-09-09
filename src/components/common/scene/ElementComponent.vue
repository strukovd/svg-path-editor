<template>
	<rect
		v-if="element.type === 'rect' && element.attrs.visible !== false"
		:class="['element', 'rect', { selected: sceneStore.selectedIds.includes(element.id) }]"
		:x="element.x"
		:y="element.y"
		:width="element.width"
		:height="element.height"
		:fill="element.attrs.fill || 'transparent'"
		:stroke="element.attrs.stroke || '#f4f4f5'"
		:stroke-width="element.attrs.strokeWidth || 1"
		:opacity="element.attrs.opacity ?? 1"
		vector-effect="non-scaling-stroke"
		@mousedown.stop.prevent="sceneStore.selectElement(element.id)"
	/>
	<line
		v-else-if="element.type === 'line' && element.attrs.visible !== false"
		:class="['element', 'line', { selected: sceneStore.selectedIds.includes(element.id) }]"
		:x1="element.x1"
		:y1="element.y1"
		:x2="element.x2"
		:y2="element.y2"
		:stroke="element.attrs.stroke || '#f4f4f5'"
		:stroke-width="element.attrs.strokeWidth || 1"
		:opacity="element.attrs.opacity ?? 1"
		vector-effect="non-scaling-stroke"
		@mousedown.stop.prevent="sceneStore.selectElement(element.id)"
	/>
	<circle
		v-else-if="element.type === 'circle' && element.attrs.visible !== false"
		:class="['element', 'circle', { selected: sceneStore.selectedIds.includes(element.id) }]"
		:cx="element.cx"
		:cy="element.cy"
		:r="element.r"
		:fill="element.attrs.fill || 'transparent'"
		:stroke="element.attrs.stroke || '#f4f4f5'"
		:stroke-width="element.attrs.strokeWidth || 1"
		:opacity="element.attrs.opacity ?? 1"
		vector-effect="non-scaling-stroke"
		@mousedown.stop.prevent="sceneStore.selectElement(element.id)"
	/>
	<ellipse
		v-else-if="element.type === 'ellipse' && element.attrs.visible !== false"
		:class="['element', 'ellipse', { selected: sceneStore.selectedIds.includes(element.id) }]"
		:cx="element.cx"
		:cy="element.cy"
		:rx="element.rx"
		:ry="element.ry"
		:fill="element.attrs.fill || 'transparent'"
		:stroke="element.attrs.stroke || '#f4f4f5'"
		:stroke-width="element.attrs.strokeWidth || 1"
		:opacity="element.attrs.opacity ?? 1"
		vector-effect="non-scaling-stroke"
		@mousedown.stop.prevent="sceneStore.selectElement(element.id)"
	/>
	<image
		v-else-if="element.type === 'image' && element.attrs.visible !== false"
		:class="['element', 'image', { selected: sceneStore.selectedIds.includes(element.id) }]"
		:href="element.href"
		:x="element.x"
		:y="element.y"
		:width="element.width"
		:height="element.height"
		:opacity="element.attrs.opacity ?? 1"
		:preserveAspectRatio="element.preserveAspectRatio || 'none'"
		@mousedown.stop.prevent="sceneStore.selectElement(element.id)"
	/>
</template>

<script lang="ts" setup>
import { useSceneStore } from '@/stores/SceneStore';
import type { SceneElement } from '@/types/scene';

const props = defineProps<{
	element: SceneElement;
}>();

const sceneStore = useSceneStore();
</script>

<style lang="scss">
#component {
	
}
</style>