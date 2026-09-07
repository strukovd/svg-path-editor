import { computed, ref, shallowReactive, shallowRef, type Ref, type ShallowReactive } from 'vue';

// EntityBox будет показыватся только когда selectedElements === 1,
// если list.length > 1 то пробегаемся по всем элементам в list, находим минимальный x, минимальный y, максимальный x + width, максимальный y + height и строим одну большую рамку
const selectedElements: ShallowReactive<SelectableOptions>[] = shallowReactive([]); // список выделенных элементов (singleton\единый)


export function useSelectable({ id, selectedId }: SelectableOptions) {
	let isLocked = ref(false);

	const select = () => {
		selectedId.value = id
	}

	return {
		select
	}
}



interface SelectableOptions {
  id: string | number
  selectedId: Ref<string | number | null>
}