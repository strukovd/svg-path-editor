<template>
	<section :class="['base-island', { collapsed: isCollapsed }]">
		<header v-if="hasHeader" @click="toggle">
			<button class="toggle" type="button">
				<span class="chevron">›</span>
			</button>
			<div class="title">
				<span>{{ title ?? '' }}</span>
			</div>
			<div v-if="$slots.actions" class="actions">
				<slot name="actions"></slot>
			</div>
		</header>

		<div v-show="!isCollapsed" class="content">
			<slot name="default"></slot>
		</div>
	</section>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots } from 'vue';

const props = withDefaults(defineProps<{
	title?: string;
}>(), {});

const slots = useSlots();

const isCollapsed = ref(false);
const hasHeader = computed(() => props.title || Boolean(slots.actions));

function toggle() {
	isCollapsed.value = !isCollapsed.value;
}
</script>

<style lang="scss">
.base-island {
	--island-bg: none; // color-mix(in srgb, var(--sidebar-color, #222222) 92%, black 5%);
	--island-border: color-mix(in srgb, var(--sidebar-color, #222222) 76%, white 8%);
	--island-text: #e8e8ea;
	--island-muted: #9b9da3;
	--island-control: #2c2d30;
	--island-control-border: #42444a;

	overflow-y: auto;
	border-radius: 4px;
	background: var(--island-bg);
	color: var(--island-text);

	header {
		display: flex;
		align-items: center;
		min-height:2.25rem;
		padding:0 .8rem;
		border-bottom:1px solid color-mix(in srgb, var(--island-border) 72%, transparent);
		gap:.3rem;
		user-select: none;
		cursor: pointer;
		transition: background .12s ease, color .12s ease;
		&:hover {
			background: var(--island-control);
			color: var(--island-text);
		}

		.toggle {
			flex: 0 0 auto;
			border: 0;
			border-radius: 4px;
			background: transparent;
			color: var(--island-muted);
			padding:0 .5rem;
			&:hover {
				background: var(--island-control);
				color: var(--island-text);
			}
			&:focus-visible {
				outline: 1px solid var(--primary, #007bff);
				outline-offset: 1px;
			}

			.chevron {
				display: block;
				font-size: 1.3rem;
				line-height: 1;
				transform: rotate(90deg);
				transition: transform .12s ease;
			}
		}

		.title {
			flex: 1 1 auto;
			color: var(--island-text);
			font-size: .78rem;
			font-weight: 600;
			line-height: 1.2;
		}

		.actions {
			display: flex;
			align-items: center;
			gap: .25rem;
			flex: 0 0 auto;
		}
	}

	.content {
		padding: .65rem;

		// input,
		// select,
		// textarea {
		// 	width: 100%;
		// 	box-sizing: border-box;
		// 	border: 1px solid var(--island-control-border);
		// 	border-radius: 6px;
		// 	background: color-mix(in srgb, var(--scene-color, #1e1e1e) 88%, white 12%);
		// 	color: var(--island-text);
		// 	font: inherit;
		// }

		// textarea {
		// 	min-height: 8rem;
		// 	resize: vertical;
		// 	padding: .55rem;
		// 	line-height: 1.4;
		// }

		// input,
		// select {
		// 	height: 1.9rem;
		// 	padding: 0 .5rem;
		// }

		// input,
		// select,
		// textarea {
		// 	&:focus {
		// 		border-color: var(--primary, #007bff);
		// 		outline: none;
		// 	}
		// }

		// button {
		// 	display: flex;
		// 	align-items: center;
		// 	justify-content: center;
		// 	min-height: 1.8rem;
		// 	border: 1px solid var(--island-control-border);
		// 	border-radius: 6px;
		// 	background: var(--island-control);
		// 	color: var(--island-text);
		// 	cursor: pointer;
		// }
	}

	&.collapsed {
		header {
			border-bottom-color: transparent;

			.toggle {
				.chevron {
					transform: rotate(0deg);
				}
			}
		}
	}
}
</style>
