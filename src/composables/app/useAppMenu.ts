import { computed } from 'vue';
import { useSceneStore } from '@/stores/SceneStore';
import type { MenuItem } from '@/stores/AppStore';

export function useAppMenu() {
	const sceneStore = useSceneStore();

	const checkedKeys = computed(() => {
		return sceneStore.settings.grid ? ['Grid'] : [];
	});

	const handlers: Partial<Record<string, () => void>> = {
		Grid: () => {
			sceneStore.settings.grid = !sceneStore.settings.grid;
		},
	};

	function execute(item: MenuItem) {
		handlers[item.key]?.();
	}

	return {
		checkedKeys,
		execute,
	};
}
