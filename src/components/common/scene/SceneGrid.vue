<template>
	<g v-if="grid.enabled" class="grid">
		<!-- Две жирные линии по 0,0 сетки (Центральный крест) -->
		<line class="grid" x1="0" y1="-100%" x2="0" y2="200%" :stroke-width="grid.crossLineThickness * s.camera.scale"/>
		<line class="grid" x1="-100%" y1="0" x2="200%" y2="0" :stroke-width="grid.crossLineThickness * s.camera.scale"/>

		<!-- Второстепенные линии -->
		<line
			v-for="x of grid.xLines"
			:key="`x-${x}`"
			:class="[`grid`, {tick: x % grid.majorGap === 0}]"
			:x1="x"
			:y1="s.camera.y - s.camera.height * 0.5"
			:x2="x"
			:y2="s.camera.y + s.camera.height * 1.5"
			:stroke-width="getLineThickness(x, s.camera.scale)"
		/>
		<line
			v-for="y of grid.yLines"
			:key="`y-${y}`"
			:class="[`grid`, {tick: y % grid.majorGap === 0}]"
			:x1="s.camera.x - s.camera.width * 0.5"
			:y1="y"
			:x2="s.camera.x + s.camera.width * 1.5"
			:y2="y"
			:stroke-width="getLineThickness(y, s.camera.scale)"
		/>
	</g>
</template>

<script lang="ts" setup>
import { useSceneStore } from '@/stores/SceneStore';
import { useSceneGrid } from '../../../composables/scene/useSceneGrid';

const s = useSceneStore();
const { grid, getLineThickness } = useSceneGrid();
</script>

<style lang="scss">
g.grid {
	stroke: #353536;
	// stroke-width: 1px;
	// stroke-opacity: 0.5;
}
</style>
