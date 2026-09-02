import { reactive } from 'vue';

export const List = <T>(initialItems: T[]) => {
	return reactive({
		items: initialItems, // остаётся реактивным

		add(item: T) { this.items.push(item); },
		remove(item: T) {
			const index = this.items.indexOf(item);
			if (index !== -1) this.items.splice(index, 1);
		},
		has(item: T): boolean { return this.items.includes(item); },
		clear() { this.items.length = 0; } // Самый быстрый способ очистить массив во Vue без потери реактивности
	});
};
