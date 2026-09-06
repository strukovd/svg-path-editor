<template>
	<aside id="props-bar">
		<BaseIsland v-for="panel of appStore.panels.items" :key="panel.key" :title="panel.title">
			<component :is="loadPanelComponent(panel.key)"/>
		</BaseIsland>

		<span class="props-scale">Масштаб: {{scale}}%</span>
	</aside>
</template>

<script setup lang="ts">
import { useSceneStore } from '@/stores/SceneStore';
import { computed } from 'vue';
import BaseIsland from '../base/BaseIsland.vue';
import { useAppStore } from '@/stores/AppStore.ts';
import { loadPanelComponent } from '@/utils/asyncLoaders';
const sceneStore = useSceneStore();
const appStore = useAppStore();
const scale = computed(() => Math.round((1 / sceneStore.camera.scale) * 100));
</script>

<style lang="scss">
#props-bar {
	width: 18rem;
	box-sizing: border-box;
	border-left: 1px solid color-mix(in srgb, var(--sidebar-color) 76%, white 4%);
	background: var(--sidebar-color);
	color: #e8e8ea;

	.element {
		display: flex;
		align-items: center;
		gap: .55rem;
		min-height: 1.55rem;
		padding: .15rem 0;
	}

	.props-badge {
		display: inline-flex;
		align-items: center;
		height: 1.25rem;
		padding: 0 .45rem;
		border-radius: 4px;
		color: #f4f4f5;
		font-size: .7rem;
		font-weight: 600;
		line-height: 1;

		&.props-badge--path {
			background: #6d3fc8;
		}

		&.props-badge--group {
			background: #177fd1;
		}
	}

	.props-id {
		min-width: 0;
		overflow: hidden;
		color: #9b9da3;
		font-size: .72rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.props-scale {
		display: block;
		padding: .2rem .1rem 0;
		color: #9b9da3;
		font-size: .75rem;
	}
}
</style>
