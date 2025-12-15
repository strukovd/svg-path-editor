<template>
	<header>

	</header>
	<main class="main-screen">
		<section id="tool-bar">
			<div>circle</div>
			<div>line</div>
			<div>figure</div>
			<div>path</div>
			<div title="moveto (move from one point to another point)">M</div>
			<div title="lineto (create a line)">L</div>
			<div title="horizontal lineto (create a horizontal line)">H</div>
			<div title="vertical lineto (create a vertical line)">V</div>
			<div title="curveto (create a curve)">C</div>
			<div title="smooth curveto (create a smooth curve)">S</div>
			<div title="quadratic Bézier curve (create a quadratic Bézier curve)">Q</div>
			<div title="smooth quadratic Bézier curveto (create a smooth quadratic Bézier curve)">T</div>
			<div title="elliptical Arc (create a elliptical arc)">A</div>
			<div title="closepath (close the path)">Z</div>
			...<br>
		</section>
		<div id="workspace">
			<EditorComponent></EditorComponent>
		</div>
		<PropsBar/>
	</main>
	<footer>

	</footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EditorComponent from '@/components/common/Editor/EditorComponent.vue';
import PropsBar from '../common/Editor/PropsBar.vue';

export default defineComponent({
	components: { EditorComponent, PropsBar }
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
