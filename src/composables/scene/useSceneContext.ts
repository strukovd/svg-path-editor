import { computed } from 'vue';
import { useSceneStore } from '@/stores/SceneStore';

export type SceneContext =
	| { type: 'SCENE' }
	| { type: 'SELECTION'; elementIds: string[] }
	| { type: 'ELEMENT_EDIT'; elementId: string };

export function useSceneContext() {
	const sceneStore = useSceneStore();

	// Если есть выбранные элементы - контекст выбора
	// Если есть редактируемый элемент - контекст редактирования
	// Иначе контекст сцены

	const context = computed<SceneContext>(() => {
		if (sceneStore.editableId) {
			return {
				type: 'ELEMENT_EDIT',
				elementId: sceneStore.editableId,
			};
		}

		if (sceneStore.selectedIds.length) {
			return {
				type: 'SELECTION',
				elementIds: sceneStore.selectedIds,
			};
		}

		return { type: 'SCENE' };
	});

	return {
		context,
	};
}