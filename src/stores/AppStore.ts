import { List } from '@/utils/colletions';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export type LayoutItem = {
	key: string;
	icon?: string;
	title?: string;
	isCollapsed?: boolean;
	action?: () => void;
};
export type SidePanel = LayoutItem;
export type FooterPanel = LayoutItem;

export const useAppStore = defineStore('app', () => {
	const loading = ref(true);
	const menu = List([]);
	const panels = List<SidePanel>([ // видимые панели справа
		{ key: 'Elements', title: 'Elements' },
		{ key: 'Properties', title: 'Properties' },
		{ key: 'Path', title: 'Path' },
	]);
	const footer = List<FooterPanel>([ // видимые панели снизу
		{ key: 'Mode' }, // Design / Animation
		{ key: 'Direction' }, // ограничение направления перемещения
		{ key: 'Status' }, // активный инструмент ??
		{ key: 'Coords' }, // координаты курсора на холсте
		{ key: 'Zoom' }, // масштаб сцены
		{ key: 'Grid' }, // сетка
		{ key: 'SelectionInfo' }, // инфа о выделенном
		{ key: 'SyncStatus' }, // инфа о синхронизации
	]);

	return {
		loading,
		menu,
		panels,
		footer,
	};
});
