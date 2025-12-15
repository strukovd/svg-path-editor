<template>
	<section id="wr-props-bar">
		<div id="props-bar">
			<section id="path-string">
				<textarea id="" cols="30" rows="10"></textarea>
			</section>
			<section>
				<div style="margin: 0 .6em;">
					<div style=" display: inline-block; font-size: 0.7em; background: darkviolet; color: whitesmoke; line-height: 1.6em; padding: 0 0.6em; border-radius: 4px; margin-right: .8em;">path</div>
					<div style=" display: inline-block; font-size: .7em; color: #777;">#star</div>
				</div>
				<div style="margin: 0 .6em;">
					<div style=" display: inline-block; font-size: 0.7em; background: #177fd1; color: whitesmoke; line-height: 1.6em; padding: 0 0.6em; border-radius: 4px; margin-right: .8em;">group</div>
					<div style=" display: inline-block; font-size: .7em; color: #777;">#car</div>
				</div>
			</section>
		</div>
	</section>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';

	export default defineComponent({
		data() {
		return {};
		},
		methods: {},
	});
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