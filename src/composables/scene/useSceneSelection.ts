import { computed } from 'vue';
import { getElementBox } from '@/lib/scene/elements';
import { useSceneStore } from '@/stores/SceneStore';

export function useSceneSelection() {
	const sceneStore = useSceneStore();

	const selectedElements = computed(() => {
		return sceneStore.elements.filter(element => sceneStore.selectedIds.includes(element.id));
	});

	const selectedElement = computed(() => {
		return selectedElements.value.length === 1 ? selectedElements.value[0] : null;
	});

	const selectedBox = computed(() => {
		return selectedElement.value ? getElementBox(selectedElement.value) : null;
	});

	const editableElement = computed(() => {
		return sceneStore.elements.find(element => element.id === sceneStore.editableId) || null;
	});

	function isSelected(id: string) {
		return sceneStore.selectedIds.includes(id);
	}

	function selectElement(id: string | null) {
		sceneStore.selectedIds = id ? [id] : [];
		sceneStore.editableId = null;
	}

	return {
		selectedElements,
		selectedElement,
		selectedBox,
		editableElement,
		isSelected,
		selectElement,
	};
}
