import { defineAsyncComponent, type Component } from 'vue';


// Статические глобы (Vite подставляет их при сборке)
const panelModules = import.meta.glob<{ default: Component }>('../components/widgets/panels/*.vue');
const footerModules = import.meta.glob<{ default: Component }>('../components/widgets/footers/*.vue');

// Универсальная фабрика загрузчиков
function createComponentLoader(
	modules: Record<string, () => Promise<{ default: Component }>>,
	basePath: string
) {
	const cache = new Map<string, Component>();

	return (filename: string) => {
		const cached = cache.get(filename);
		if (cached) return cached;

		const file = `${basePath}/${filename}.vue`;
		const loader = modules[file];
		if (!loader) return null;

		const component = defineAsyncComponent(loader);
		cache.set(filename, component);
		return component;
	};
}

export const loadPanelComponent = createComponentLoader(panelModules, '../components/widgets/panels');
export const loadFooterComponent = createComponentLoader(footerModules, '../components/widgets/footers');