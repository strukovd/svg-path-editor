<template>
	<section id="wr-props-bar">
		<div id="props-bar">
			<section id="path-string">
				<textarea id="" cols="30" rows="10"></textarea>
			</section>
			<section>
				<div v-for="(element, index) of useEditorStore().elements" :key="element.id" style="margin: 0 .6em;">
					<div style=" display: inline-block; font-size: 0.7em; background: darkviolet; color: whitesmoke; line-height: 1.6em; padding: 0 0.6em; border-radius: 4px; margin-right: .8em;">{{ element.type }}</div>
					<div style=" display: inline-block; font-size: .7em; color: #777;">#{{ element.id }}</div>
				</div>

				<div style="margin: 0 .6em;">
					<div style=" display: inline-block; font-size: 0.7em; background: darkviolet; color: whitesmoke; line-height: 1.6em; padding: 0 0.6em; border-radius: 4px; margin-right: .8em;">path</div>
					<div style=" display: inline-block; font-size: .7em; color: #777;">#star</div>
				</div>
				<div style="margin: 0 .6em;">
					<div style=" display: inline-block; font-size: 0.7em; background: #177fd1; color: whitesmoke; line-height: 1.6em; padding: 0 0.6em; border-radius: 4px; margin-right: .8em;">group</div>
					<div style=" display: inline-block; font-size: .7em; color: #777;">#car</div>
				</div>
			</section>
			<footer>
				<div>
					<span>Масштаб: {{scale}}%</span>
				</div>
			</footer>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/EditorStore';
import { computed } from 'vue';
const s = useEditorStore();
const scale = computed(() => Math.round((1 / s.camera.scale) * 100));
</script>

<style lang="scss">
#wr-props-bar {
	// background-color: var(--editor-color);
	// padding:1em;

	border-radius:8px;
	background-color: var(--sidebar-color);
	padding:.5em;
	#props-bar {
		border-radius:8px;
		background-color: var(--sidebar-color);
		padding:.5em;
		// border-left: 1px solid color-mix(in srgb, var(--sidebar-color) 95%, whitesmoke 5%);
		color: whitesmoke;
	}
}
</style>