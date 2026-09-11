<template>
	<section class="footer-context" :style="{ backgroundColor: currentContext.color }" :title="currentContext.hint">
		<!-- <span class="icon" aria-hidden="true"></span> -->
		<span class="text">{{ currentContext.text }}</span>
	</section>
</template>

<script setup lang="ts">
/*
	Контекст нужен, что бы Scene ловила горячие клавиши
	типа Ctrl+C, Ctrl+A, Ctrl+D и понимала контекст действий.
	К примеру: Ctrl+A - выделить все элементы или точки,
	Ctrl+C\Ctrl+D - копировать\дублировать элемент или точку, и т.д.
	---
	Индикатор контекста. По задумке есть следующие состояния:
	1. SCENE - свободный контекст сцены (конкретного фокуса нету)
		Элементы можно выделять, перетаскивать, удалять, менять их свойства и т.д.
	2. SELECTION - есть выбранный элемент или несколько элементов
		Горячие клавиши, панель свойств - относятся к выбранному элементу.
	3. ELEMENT_EDIT - редактирование внутренностей элемента
		Все реакции клики, перетаскиевания,
		горячих клавиш относятся к редактируемому элементу.
	4. DRAFT (необходимость еще под вопросом) - редактирование нового элемента.
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
	SELECTION относится к выбранным целым элементам,
	ELEMENT_EDIT - это уже не просто выбранный элемент,
	это элемент который выбрали и начали редактировать его точки,
	DRAFT - тут тоже спорно, потому что по сути это режим редактирования,
	но в то же время у ногово (только что добавленного элемента)
	могут быть свои особенности.
	---
	Для аналогии например есть Blender,
	хотя там аналогия немного другая, но там
	курсор решает кому относятся горячие клавиши.
*/
import { computed } from 'vue';
import { useSceneContext, type SceneContext } from '@/composables/scene/useSceneContext';

const { context } = useSceneContext();
const contextMap: Record<SceneContext['type'], { text: string; color: string; hint: string }> = {
	SCENE:			{ text: 'Сцена',			color: '#007bff', hint: 'Контекст сцены' },
	SELECTION:		{ text: 'Элемент',			color: '#007bff', hint: 'Контекст выбранных элементов' },
	ELEMENT_EDIT:	{ text: 'Редактирование',	color: '#a72b68', hint: 'Контекст редактируемого элемента' },
};

const currentContext = computed(() => contextMap[context.value.type]);
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
