<template>
	<section class="footer-zoom" title="Масштаб сцены">
		<span class="icon" aria-hidden="true"></span>
		<select :value="scale" aria-label="Масштаб сцены" @change="onChange">
			<option v-if="!zoomOptions.includes(scale)" :value="scale">{{ scale }}%</option>
			<option v-for="option of zoomOptions" :key="option" :value="option">
				{{ option }}%
			</option>
		</select>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSceneZoom } from '@/composables/scene/useSceneZoom';
import { useSceneStore } from '@/stores/SceneStore';

const sceneStore = useSceneStore();
const { setZoom } = useSceneZoom();
const zoomOptions = [25, 50, 75, 100, 125, 150, 200, 400];
const scale = computed(() => Math.round((1 / sceneStore.camera.scale) * 100));

function onChange(e: Event) {
	const select = e.currentTarget as HTMLSelectElement;
	setZoom(Number(select.value));
}
</script>

<style lang="scss">
.footer-zoom {
	display: inline-flex;
	align-items: center;
	gap: .4rem;
	height: 100%;
	color: #d4d4d6;
	font-size: .75rem;

	.icon {
		position: relative;
		display: block;
		width: .65rem;
		height: .65rem;
		box-sizing: border-box;
		border: 1.5px solid #8f9198;
		border-radius: 50%;

		&::after {
			position: absolute;
			right: -.3rem;
			bottom: -.2rem;
			width: .35rem;
			height: 1.5px;
			border-radius: 1px;
			background: #8f9198;
			content: '';
			transform: rotate(45deg);
			transform-origin: left center;
		}
	}

	select {
		width: 3.75rem;
		border: 0;
		outline: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		font-variant-numeric: tabular-nums;
		cursor: pointer;

		option {
			background: var(--sidebar-color);
			color: #d4d4d6;
		}
	}
}
</style>
