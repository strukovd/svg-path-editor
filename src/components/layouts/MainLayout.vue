<template>
	<header>

	</header>
	<main class="main-screen">
		<section id="tool-bar">
			circle<br>
			line<br>
			figure<br>
			path<br>
			M = moveto (move from one point to another point)
			L = lineto (create a line)
			H = horizontal lineto (create a horizontal line)
			V = vertical lineto (create a vertical line)
			C = curveto (create a curve)
			S = smooth curveto (create a smooth curve)
			Q = quadratic Bézier curve (create a quadratic Bézier curve)
			T = smooth quadratic Bézier curveto (create a smooth quadratic Bézier curve)
			A = elliptical Arc (create a elliptical arc)
			Z = closepath (close the path)
			...<br>
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
			max-width:3em;
		}
		#workspace {
			flex:auto 1 0;
		}
		#path-string {

		}
	}
</style>
