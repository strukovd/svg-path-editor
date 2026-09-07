<template>
	<!-- Компонент полностью независим и сам стилизует внутренности -->
	<div class="footer-coords">
		<span class="coord-axis">X:</span>
		<span class="coord-value">{{ sceneStore.cursor.x }}</span>
		<span class="coord-axis">Y:</span>
		<span class="coord-value">{{ sceneStore.cursor.y }}</span>
	</div>
</template>

<script setup lang="ts">
import { useSceneStore } from '@/stores/SceneStore';

const sceneStore = useSceneStore();
</script>

<style scoped>
.footer-coords {
	display: flex;
	gap: 6px;
	font-family: monospace; /* Моноширинный шрифт предотвращает "тряску" текста при смене цифр */
	font-size: 12px;
	color: var(--footer-text-muted, #888888);
}

.coord-axis {
	color: var(--color-accent, #569cd6); /* Подсветка осей, как в IDE */
	font-weight: bold;
}

.coord-value {
	color: var(--footer-text-light, #ffffff);
	min-width: 40px; /* Фиксированная минимальная ширина, чтобы текст не прыгал */
}
</style>
