<template>
	<section class="footer-mode" :style="[{ backgroundColor: modeMap[currentMode].color }]" :title="modeMap[currentMode].hint">
		<span class="icon" aria-hidden="true">›‹</span>
		<span class="text">{{ modeMap[currentMode].text }}</span>
	</section>
</template>

<script setup lang="ts">
/*
	Индикатор режима. По задумке есть следующие режимы:
	1. Обычный режим сцены (не редактируется)
		Элементы можно выделять, перетаскивать, удалять, менять их свойства и т.д.
	2. Режим редактирования элемента
		Все реакции клики, перетаскиевания,
		горячих клавиш относятся к редактируемому элементу.
	3. Режим редактирования нового элемента
		Похож на режим редактирования элемента,
		но в этом случае могут быть свои нюансы,
		ведь элемент еще в процессе рисовки,
		и в случае отмены рисования поведение может отличаться,
		например удаление неполноценного элемента либо его сохранение.
*/
import { computed } from 'vue';
import { useSceneStore } from '@/stores/SceneStore';

const sceneStore = useSceneStore();
const modeMap = {
	DEFAULT:	{ text: 'Обычный',			color: `#007bff`,	hint: 'Обычный режим сцены' },
	EDIT:		{ text: 'Редактирование',	color: `#a72b68`,	hint: 'Режим редактирования элемента' },
	NEW:		{ text: 'Добавление',		color: `#2e8b57`,	hint: 'Режим редактирования нового элемента' },
};

const currentMode = computed(() => {
	if( sceneStore.editableId )
		return 'EDIT';
	// else if(  )
	// 	return 'NEW';
	else
		return 'DEFAULT';
});
</script>

<style lang="scss">
.footer-mode {
	display: inline-flex;
	align-items: center;
	gap: .35rem;
	height: 100%;
	box-sizing: border-box;
	padding: 0 .65rem;
	background: var(--primary);
	color: white;
	font-size: .75rem;
	font-weight: 500;

	>.icon {
		font-size: .9rem;
		font-weight: 700;
		line-height: 1;
	}

	>.text {
		white-space: nowrap;
	}
}
</style>
