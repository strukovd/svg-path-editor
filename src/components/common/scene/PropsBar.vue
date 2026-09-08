<template>
	<aside id="props-bar">
		<BaseIsland v-for="panel of appStore.panels.items" :key="panel.key" :title="panel.title">
			<component :is="loadPanelComponent(panel.key)"/>
		</BaseIsland>
	</aside>
</template>

<script setup lang="ts">
import BaseIsland from '../base/BaseIsland.vue';
import { useAppStore } from '@/stores/AppStore.ts';
import { loadPanelComponent } from '@/utils/asyncLoaders';
const appStore = useAppStore();
</script>

<style lang="scss">
#props-bar {
	width: 18rem;
	box-sizing: border-box;
	border-left: 1px solid color-mix(in srgb, var(--sidebar-color) 76%, white 4%);
	background: var(--sidebar-color);
	color: #e8e8ea;

	// .props-scale {
	// 	display: block;
	// 	padding: .2rem .1rem 0;
	// 	color: #9b9da3;
	// 	font-size: .75rem;
	// }
}
</style>
