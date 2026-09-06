import { List } from '@/utils/colletions';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface EditorPanel {
	key: string;
	title: string;
}

export const useAppStore = defineStore('app', () => {
	const loading = ref(true);
	const menu = List([]); // видимые пункты меню
	const panels = List<EditorPanel>([ // видимые панели справа
		{ key: 'Elements', title: 'Elements' },
		{ key: 'Properties', title: 'Properties' },
		{ key: 'Path', title: 'Path' },
	]);
	const footer = List([`STATUS`, `COORDS`, `ZOOM`]); // видимые панели снизу

	return {
		loading,
		menu,
		panels,
		footer,
	};
});
