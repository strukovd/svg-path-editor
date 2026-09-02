<template>
	<section id="elements-panel">
		<div v-for="element of sceneStore.elements" :key="element.id" class="element">
			<span class="props-badge props-badge--path">{{ element.type }}</span>
			<span class="props-id">#{{ element.id }}</span>
		</div>

		<div class="element">
			<span class="props-badge props-badge--path">path</span>
			<span class="props-id">#star</span>
		</div>
		<div class="element">
			<span class="props-badge props-badge--group">group</span>
			<span class="props-id">#car</span>
		</div>
	</section>
</template>

<script lang="ts" setup>
import { useSceneStore } from '@/stores/SceneStore';
const sceneStore = useSceneStore();
</script>

<style lang="scss">
#elements {
	
}
</style>
