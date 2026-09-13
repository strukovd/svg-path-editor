<template>
	<nav id="app-menu" ref="menuElement" aria-label="Главное меню" @keydown.esc.stop="close">
		<ul class="root" role="menubar">
			<li
				v-for="item of appStore.menu.items"
				:key="item.key"
				class="entry"
				role="none"
				@mouseenter="switchOpenMenu(item)"
			>
				<button
					type="button"
					class="trigger"
					:class="{ active: openedKey === item.key }"
					role="menuitem"
					:aria-expanded="item.children ? openedKey === item.key : undefined"
					:aria-haspopup="item.children ? 'menu' : undefined"
					@click.stop="activateRootItem(item)"
				>
					{{ item.title || item.key }}
				</button>

				<ul v-if="item.children && openedKey === item.key" class="popup" role="menu">
					<AppMenuItem
						v-for="child of item.children.items"
						:key="child.key"
						:item="child"
						:checked-keys="checkedKeys"
						@select="selectItem"
					/>
				</ul>
			</li>
		</ul>
	</nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useAppMenu } from '@/composables/app/useAppMenu';
import { useAppStore, type MenuItem } from '@/stores/AppStore';
import AppMenuItem from './AppMenuItem.vue';

const appStore = useAppStore();
const { checkedKeys, execute } = useAppMenu();
const menuElement = ref<HTMLElement | null>(null);
const openedKey = ref<string | null>(null);

function activateRootItem(item: MenuItem) {
	if (item.children) {
		openedKey.value = openedKey.value === item.key ? null : item.key;
		return;
	}

	selectItem(item);
}

function switchOpenMenu(item: MenuItem) {
	if (openedKey.value && item.children) {
		openedKey.value = item.key;
	}
}

function selectItem(item: MenuItem) {
	execute(item);
	close();
}

function close() {
	openedKey.value = null;
}

function onDocumentPointerDown(event: PointerEvent) {
	if (!menuElement.value?.contains(event.target as Node)) {
		close();
	}
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown));
onUnmounted(() => document.removeEventListener('pointerdown', onDocumentPointerDown));
</script>

<style lang="scss">
#app-menu {
	position: relative;
	z-index: 20;
	height: 32px;
	border-bottom: 1px solid color-mix(in srgb, var(--sidebar-color) 72%, white 28%);
	background: var(--sidebar-color);
	color: #f4f4f5;
	font-size: .82rem;
	user-select: none;

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	button {
		border: 0;
		font: inherit;
		color: inherit;
		cursor: default;
	}

	.root {
		display: flex;
		align-items: stretch;
		height: 100%;
		padding: 0 .35rem;

		>.entry {
			position: relative;

			>.trigger {
				height: 100%;
				padding: 0 .75rem;
				background: transparent;

				&:hover,
				&.active {
					background: color-mix(in srgb, var(--sidebar-color) 72%, white 28%);
				}

				&:focus-visible {
					outline: 1px solid var(--primary);
					outline-offset: -2px;
				}
			}

			>.popup {
				position: absolute;
				top: 100%;
				left: 0;
				min-width: 220px;
				padding: .3rem;
				border: 1px solid color-mix(in srgb, var(--sidebar-color) 64%, white 36%);
				background: #292929;
				box-shadow: 0 8px 20px rgba(0, 0, 0, .32);

				.entry {
					position: relative;

					.item {
						display: grid;
						grid-template-columns: 1.1rem minmax(0, 1fr) 1rem;
						align-items: center;
						width: 100%;
						min-height: 30px;
						padding: .25rem .4rem;
						background: transparent;
						text-align: left;

						&:hover,
						&:focus-visible {
							outline: 0;
							background: var(--primary);
						}

						.marker {
							font-weight: 600;
							text-align: center;
						}

						.label {
							white-space: nowrap;
						}

						.arrow {
							font-size: 1rem;
							text-align: right;
						}
					}

					.submenu {
						display: none;
						position: absolute;
						top: -.3rem;
						left: 100%;
						min-width: 190px;
						padding: .3rem;
						border: 1px solid color-mix(in srgb, var(--sidebar-color) 64%, white 36%);
						background: #292929;
						box-shadow: 0 8px 20px rgba(0, 0, 0, .32);
					}

					&.branch:hover,
					&.branch:focus-within {
						>.submenu {
							display: block;
						}
					}
				}
			}
		}
	}
}
</style>
