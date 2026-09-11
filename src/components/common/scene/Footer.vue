<template>
	<footer id="footer-bar">
		<div v-for="item of footerItems" :key="item.key"
			:class="[
				'indicator',
				`item-${item.key.toLowerCase()}`,
				{ 'clickable': item.clickable }
			]"
			@click="item.action?.()"
		>
			<div v-if="item.key === 'spacer'" class="spacer"></div>
			<div v-else-if="item.key === 'separator'" class="separator"></div>
			<component v-else :is="loadFooterComponent(item.key)"/>
		</div>
	</footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores';
import { loadFooterComponent } from '@/utils/asyncLoaders';
const appStore = useAppStore();
const footerItems = computed(() => appStore.footer.items);
</script>

<style lang="scss">
#footer-bar {
	display: flex;
	align-items: center;
	justify-content: flex-start; /* Или space-between, если добавите alignment */
	user-select: none;
	height: 28px; /* Типичная высота для статус-баров в редакторах */

	.indicator {
		display: inline-flex;
		align-items: center;
		height: 100%;
		padding: 0 8px;
		box-sizing: border-box;

		&:first-child, &:last-child {
			padding: 0;
		}
		&:has(.spacer) {
			flex: 1 1 auto;
		}

		.separator {
			width: 1px;
			height: 100%;
			background-color: var(--color-bg-hover, rgba(255, 255, 255, 0.1));
		}

		&.clickable {
			cursor: pointer;
			transition: background-color 0.15s ease;

			&:hover {
				background-color: var(--color-bg-hover, rgba(255, 255, 255, 0.1));
			}
		}
	}
}
</style>
