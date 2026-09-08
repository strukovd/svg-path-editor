<template>
	<section id="elements-panel">
		<div v-for="element of sceneStore.elements" :key="element.id" class="element">
			<span class="badge badge-path">{{ element.type }}</span>
			<span class="id">#{{ element.id }}</span>
		</div>

		<!-- <div class="element">
			<span class="badge badge-group">group</span>
			<span class="id">#car</span>
		</div> -->
	</section>
</template>

<script lang="ts" setup>
import { useSceneStore } from '@/stores/SceneStore';
const sceneStore = useSceneStore();
</script>

<style lang="scss">
#elements-panel {
	.element {
		display: flex;
		align-items: center;
		gap: .55rem;
		min-height: 1.55rem;
		padding: .15rem 0;

		.badge {
			display: inline-flex;
			align-items: center;
			height: 1.25rem;
			padding: 0 .45rem;
			border-radius: 4px;
			color: #f4f4f5;
			font-size: .7rem;
			font-weight: 600;
			line-height: 1;

			&.badge-path {
				background: #6d3fc8;
			}

			&.badge-group {
				background: #177fd1;
			}
		}

		.id {
			min-width: 0;
			overflow: hidden;
			color: #9b9da3;
			font-size: .72rem;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}
</style>
