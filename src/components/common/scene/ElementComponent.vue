<template>
	<rect
		v-if="element.type === 'rect' && element.attrs.visible !== false"
		:class="['element', 'rect', { selected }]"
		:x="element.x"
		:y="element.y"
		:width="element.width"
		:height="element.height"
		:fill="element.attrs.fill || 'transparent'"
		:stroke="element.attrs.stroke || '#f4f4f5'"
		:stroke-width="element.attrs.strokeWidth || 1"
		:opacity="element.attrs.opacity ?? 1"
		vector-effect="non-scaling-stroke"
		@mousedown.stop.prevent="emit('select', element.id)"
	/>
	<line
		v-else-if="element.type === 'line' && element.attrs.visible !== false"
		:class="['element', 'line', { selected }]"
		:x1="element.x1"
		:y1="element.y1"
		:x2="element.x2"
		:y2="element.y2"
		:stroke="element.attrs.stroke || '#f4f4f5'"
		:stroke-width="element.attrs.strokeWidth || 1"
		:opacity="element.attrs.opacity ?? 1"
		vector-effect="non-scaling-stroke"
		@mousedown.stop.prevent="emit('select', element.id)"
	/>
	<circle
		v-else-if="element.type === 'circle' && element.attrs.visible !== false"
		:class="['element', 'circle', { selected }]"
		:cx="element.cx"
		:cy="element.cy"
		:r="element.r"
		:fill="element.attrs.fill || 'transparent'"
		:stroke="element.attrs.stroke || '#f4f4f5'"
		:stroke-width="element.attrs.strokeWidth || 1"
		:opacity="element.attrs.opacity ?? 1"
		vector-effect="non-scaling-stroke"
		@mousedown.stop.prevent="emit('select', element.id)"
	/>
	<ellipse
		v-else-if="element.type === 'ellipse' && element.attrs.visible !== false"
		:class="['element', 'ellipse', { selected }]"
		:cx="element.cx"
		:cy="element.cy"
		:rx="element.rx"
		:ry="element.ry"
		:fill="element.attrs.fill || 'transparent'"
		:stroke="element.attrs.stroke || '#f4f4f5'"
		:stroke-width="element.attrs.strokeWidth || 1"
		:opacity="element.attrs.opacity ?? 1"
		vector-effect="non-scaling-stroke"
		@mousedown.stop.prevent="emit('select', element.id)"
	/>
	<image
		v-else-if="element.type === 'image' && element.attrs.visible !== false"
		:class="['element', 'image', { selected }]"
		:href="element.href"
		:x="element.x"
		:y="element.y"
		:width="element.width"
		:height="element.height"
		:opacity="element.attrs.opacity ?? 1"
		:preserveAspectRatio="element.preserveAspectRatio || 'none'"
		@mousedown.stop.prevent="emit('select', element.id)"
	/>
</template>

<script lang="ts" setup>
import type { SceneElement } from '@/types/scene';

defineProps<{
	element: SceneElement;
	selected?: boolean;
}>();

const emit = defineEmits<{
	select: [id: string];
}>();
</script>

<style lang="scss">
#component {
	
}
</style>
