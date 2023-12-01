<template>
	<header>

	</header>
	<main class="main-screen">
		<section id="tool-bar">
			circle
			line
			figure
			...
		</section>
		<div id="workspace">
			<EditorComponent></EditorComponent>
		</div>
		<aside id="props-bar">
			<section id="path-string">
				<textarea id="" cols="30" rows="10"></textarea>
			</section>
			<section>
				<div style="margin: 0 .6em;">
					<div style="
						display: inline-block;
						font-size: 0.7em;
						background: darkviolet;
						color: whitesmoke;
						line-height: 1.6em;
						padding: 0 0.6em;
						border-radius: 4px;
						margin-right: .8em;
					">path</div>
					<div style="
						display: inline-block;
						font-size: .7em;
						color: #777;
					">#star</div>
				</div>

				<div style="margin: 0 .6em;">
					<div style="
						display: inline-block;
						font-size: 0.7em;
						background: #177fd1;
						color: whitesmoke;
						line-height: 1.6em;
						padding: 0 0.6em;
						border-radius: 4px;
						margin-right: .8em;
					">group</div>
					<div style="
						display: inline-block;
						font-size: .7em;
						color: #777;
					">#car</div>
				</div>
			</section>
		</aside>
	</main>
	<footer>

	</footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EditorComponent from '@/components/Editor/EditorComponent.vue';

export default defineComponent({
	components: {
		EditorComponent
	}
});
</script>

<style lang="scss">
	.main-screen {
		display: flex;

		#tool-bar {

		}
		#workspace {
			flex:auto 1 0;
		}
		#path-string {

		}
	}
</style>
