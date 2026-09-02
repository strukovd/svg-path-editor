<template>
	<header></header>
	<main class="main-screen">
		<RouterView/>
		<ToolBar/>
		<div id="workspace">
			<SceneComponent/>
		</div>
		<PropsBar/>
	</main>
	<footer>

	</footer>
</template>

<script lang="ts" setup>
import SceneComponent from '@/components/common/scene/SceneComponent.vue';
import PropsBar from '../common/scene/PropsBar.vue';
import ToolBar from '../common/scene/ToolBar.vue';
</script>

<style lang="scss">
.main-screen {
	display: flex;

	#workspace {
		flex:auto 1 0;
	}
	#path-string {

	}
}
</style>
