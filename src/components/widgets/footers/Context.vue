<template>
	<section class="footer-context" :style="[{ backgroundColor: contextMap[currentContext].color }]" :title="contextMap[currentContext].hint">
		<!-- <span class="icon" aria-hidden="true"></span> -->
		<span class="text">{{ contextMap[currentContext].text }}</span>
	</section>
</template>

<script setup lang="ts">
/*
	Контекст нужен, что бы Scene ловила горячие клавиши
	типа Ctrl+C, Ctrl+A, Ctrl+D и понимала контекст действий.
	К примеру: Ctrl+A - выделить все элементы или точки,
	Ctrl+C\Ctrl+D - копировать\дублировать элемент или точку, и т.д.
	---
	Индикатор режима. По задумке есть следующие режимы:
	1. Режим FREE - свободный контекст сцены (конкретного фокуса нету)
		Элементы можно выделять, перетаскивать, удалять, менять их свойства и т.д.
	2. SELECTED - Есть выбранный элемент
		Горячие клавиши, панель свойств - относятся к выбранному элементу.
	3. EDITING - Режим редактирования элемента
		Все реакции клики, перетаскиевания,
		горячих клавиш относятся к редактируемому элементу.
	4. DRAFT (Необходимость еще под вопросом) - Режим редактирования нового элемента.
		Похож на режим редактирования элемента,
		но в этом случае могут быть свои нюансы,
		ведь элемент еще в процессе рисовки,
		и в случае отмены рисования поведение может отличаться,
		например удаление неполноценного элемента либо его сохранение.
	---
	Суть - в редакторе планируются горячие клавиши и панель свойств
	(такое есть во всех редакторах) но если так посудить,
	горячие клавиши (и свойства) могут быть общими,
	могут относится к конкретному выбранному элементу
	(SELECT - этот режим я еще не определился где вводить,
	но он будто напрашивается в context),
	EDIT редактируемый элемент - это уже не просто выбранный элемент,
	это элемент который выбрали и начали редактировать его точки,
	NEW - тут тоже спорно, потому что по сути это режим редактирования,
	но в то же время у ногово (только что добавленного элемента)
	могут быть свои особенности.
	---
	Для аналогии например есть Blender,
	хотя там аналогия немного другая, но там
	курсор решает кому относятся горячие клавиши.
*/
import { computed } from 'vue';
import { useSceneStore } from '@/stores/SceneStore';

const sceneStore = useSceneStore();
const contextMap = {
	FREE:		{ text: 'Сцена',			color: `#007bff`,	hint: 'Контекст сцены' },
	SELECTING:	{ text: 'Элемент',			color: `#007bff`,	hint: 'Контекст выбранного элемента' },
	EDITING:	{ text: 'Редактирование',	color: `#a72b68`,	hint: 'Контекст редактируемого элемента' },
	// DRAFT:		{ text: 'Добавление',		color: `#2e8b57`,	hint: 'Контекст редактирования нового элемента' },
};

const currentContext = computed(() => {
	if( sceneStore.editableId )
		return 'EDIT';
	// else if(  )
	// 	return 'DRAFT';
	else
		return 'FREE';
});
</script>

<style lang="scss">
.footer-context {
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
