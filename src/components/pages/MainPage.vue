<template>
	<section id="main-page">
		<header>
			<!-- TODO: Добавить menu -->
		</header>
		<main class="main-screen">
			<ToolBar/>
			<div id="workspace">
				<SceneComponent/>
			</div>
			<PropsBar/>
		</main>
		<Footer/>
	</section>
</template>

<script lang="ts" setup>
import SceneComponent from '@/components/common/scene/SceneComponent.vue';
import PropsBar from '../common/scene/PropsBar.vue';
import ToolBar from '../common/scene/ToolBar.vue';
import Footer from '../common/scene/Footer.vue';
</script>

<style lang="scss">
#main-page {
	height: 100vh;
	display: grid;
	grid-template-rows: auto 1fr auto; /* Хедер/футер по контенту (auto), а main — всё остальное (1fr)*/
	overflow: hidden;

	.main-screen {
		display: flex;
		flex-direction: row;
		height: 100%;
		overflow: hidden;

		#workspace {
			flex: 1 1 0%; /* Занимает всё оставшееся место */
			min-width: 0; /* Защита от флекс-колонок от распирания вширь (flex-box bug) */
			position: relative;
			// overflow: hidden; /* Меняем на hidden, так как SVG сам управляет размером */
			background-color: #ecf0f1;
		}
	}
}
</style>
