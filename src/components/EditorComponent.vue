<template>
	<svg id="editor">
		<g class="grid">
			<line class="grid ng-star-inserted"
				x1="-2.1085" y1="0"
				x2="86.5915" y2="0"
				strokeWidth="strokeWidth"></line>
		</g>
		<g class="fill-path">

		</g>
		<g class="control-points">

		</g>
		<g class="points">

		</g>
	</svg>
</template>

<!--
Есть один SVG, внутри которого сначала рисуются линии (<line>, только в пределах видимости, сначала жирные 0, 0, затем остальные),
затем рисуется обыкновенный path, внутрь которого помещается провализированный код из редактора,
затем рисуются поперечные линии (<line>) (для кривых безьё),
а затем уже сами точкт (<cirle>) всех элементов (линий, безьё, arc, и прочее)
-->

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	data() {
		return {
			xGrid: [],
			yGrid: [],

			viewPortX: 0,
			viewPortY: 0,
			viewPortWidth: 0,
			viewPortHeight: 0,
		};
	},
	computed: {
		strokeWidth() {
			// return this.cfg.viewPortWidth / this.canvasWidth
			return 1;
		}
	},
	methods: {
		m() {
			this.strokeWidth.toFixed();
		}
	}
});
</script>

<style scoped lang="scss">
#editor {
	width:100%;
}
</style>
