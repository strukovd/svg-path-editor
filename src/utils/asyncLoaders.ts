import { defineAsyncComponent, type Component } from 'vue';

const panelModules = import.meta.glob<{ default: Component }>('../components/common/scene/panels/*.vue');
const panelComponentCache = new Map<string, Component>();

export function loadPanelComponent(key: string) {
	const cached = panelComponentCache.get(key);
	if (cached) return cached;

	const file = `../components/common/scene/panels/${key}.vue`;
	const loader = panelModules[file];

	if (!loader) return null;

	const component = defineAsyncComponent(loader);
	panelComponentCache.set(key, component);
	return component;
}
