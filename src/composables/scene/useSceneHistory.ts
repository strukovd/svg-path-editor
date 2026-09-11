// @/composables/scene/useSceneHistory.ts
import { useSceneStore } from '@/stores/SceneStore';
import type { SceneSnapshot } from '@/types/scene';
import { clonePlain } from '@/utils/helpers';

export function useSceneHistory() {
	const sceneStore = useSceneStore();
	const HISTORY_LIMIT = 100;

	// 1. Создание слепка (snapshot)
	function makeSnapshot(): SceneSnapshot {
		return {
			elements: clonePlain(sceneStore.elements),
			selectedIds: [...sceneStore.selectedIds],
			editableId: sceneStore.editableId,
			displayMode: sceneStore.displayMode,
			activeTool: sceneStore.activeTool,
		};
	}

	// 2. Восстановление из слепка
	function restoreSnapshot(snapshot: SceneSnapshot) {
		const next = clonePlain<SceneSnapshot>(snapshot);
		sceneStore.elements = next.elements;
		sceneStore.selectedIds = next.selectedIds;
		sceneStore.editableId = next.editableId;
		sceneStore.displayMode = next.displayMode;
		sceneStore.activeTool = next.activeTool;
	}


	function pushHistory() {
		const snapshot = makeSnapshot();
		// Работаем напрямую со стейтом стора
		sceneStore.history = sceneStore.history.slice(0, sceneStore.historyCursor + 1);
		sceneStore.history.push(snapshot);

		if (sceneStore.history.length > HISTORY_LIMIT) {
			sceneStore.history.shift();
		}
		sceneStore.historyCursor = sceneStore.history.length - 1;
	}

	function undo() {
		if (sceneStore.historyCursor <= 0) return;
		sceneStore.historyCursor -= 1;
		restoreSnapshot(sceneStore.history[sceneStore.historyCursor]);
	}

	function redo() {
		if (sceneStore.historyCursor >= sceneStore.history.length - 1) return;
		sceneStore.historyCursor += 1;
		restoreSnapshot(sceneStore.history[sceneStore.historyCursor]);
	}


	return { pushHistory, undo, redo };
}
