<template>
	<footer id="footer-bar">
		<div v-for="item of footerItems" :key="item.key"
			:class="[
				'footer-bar-item',
				`item-${item.key.toLowerCase()}`,
				{ 'is-clickable': !!item.action }
			]"
			@click="item.action?.()"
		>
			<component :is="loadFooterComponent(item.key)"/>
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

	.footer-bar-item {
		display: inline-flex;
		align-items: center;
		height: 100%;
		padding: 0 8px;
		box-sizing: border-box;

		&.item-mode {
			padding: 0;
		}

		&.is-clickable {
			cursor: pointer;
			transition: background-color 0.15s ease;

			&:hover {
				background-color: var(--color-bg-hover, rgba(255, 255, 255, 0.1));
			}
		}
	}
}
</style>
