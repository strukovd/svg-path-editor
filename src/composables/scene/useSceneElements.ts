import { updateElementBox as applyElementBox } from '@/lib/scene/elements';
import { useSceneStore } from '@/stores/SceneStore';
import type { SceneBox } from '@/types/scene-entity';

export function useSceneElements() {
	const sceneStore = useSceneStore();

	function updateElementBox(id: string, box: SceneBox) {
		const index = sceneStore.elements.findIndex(element => element.id === id);
		if (index === -1) return;

		sceneStore.elements[index] = applyElementBox(sceneStore.elements[index], box);
	}

	function setElementOpacity(id: string, opacity: number) {
		const element = sceneStore.elements.find(element => element.id === id);
		if (!element) return;

		element.attrs.opacity = opacity;
	}

	function toggleElementLock(id: string) {
		const element = sceneStore.elements.find(element => element.id === id);
		if (!element) return;

		element.attrs.locked = !element.attrs.locked;
	}

	function removeElement(id: string) {
		sceneStore.elements = sceneStore.elements.filter(element => element.id !== id);
		sceneStore.selectedIds = sceneStore.selectedIds.filter(selectedId => selectedId !== id);

		if (sceneStore.editableId === id) {
			sceneStore.editableId = null;
		}
	}

	return {
		updateElementBox,
		setElementOpacity,
		toggleElementLock,
		removeElement,
	};
}
