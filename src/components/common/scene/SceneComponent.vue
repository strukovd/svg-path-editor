<template>
	<section id="scene-section">
		<svg
			:style="{visibility: sceneStore.ready?'visible':'hidden'}"
			id="scene"
			ref="sceneElement"
			:viewBox="viewBox"
			@mousedown="activate"
			@wheel.prevent="onWheel"
			@mousemove="sceneStore.updateCursor($event.clientX, $event.clientY, pSceneElement)"
			@resize="()=>{ console.log(`resize`); }"
		>
			<defs>
				<!-- Тут определять градиенты, анимации, и прочее на которое будут ссылатся элементы -->
			</defs>
			<SceneGrid/>
			<SceneReferenceImage/>

			<g name="debug" fill="whitesmoke">
				<text x="0" y="150">{{ viewBox }}</text>
				<text x="0" y="300">{{ visibleBounds }}</text>
			</g>
		</svg>
	</section>
</template>

<!--
Есть один SVG, внутри которого сначала рисуются линии (<line>, только в пределах видимости, сначала жирные 0, 0, затем остальные),
затем рисуется обыкновенный path, внутрь которого помещается провализированный код из редактора,
затем рисуются поперечные линии (<line>) (для кривых безьё),
а затем уже сами точкт (<cirle>) всех элементов (линий, безьё, arc, и прочее)
-->

<script lang="ts" setup>
import { computed, onMounted, useTemplateRef } from 'vue';
import { useSceneStore } from '@/stores/SceneStore';
import { useSceneZoom } from '@/composables/scene/useSceneZoom.ts';
import { useSceneMover } from '@/composables/scene/useSceneMover.ts';
import SceneGrid from './SceneGrid.vue';
import SceneReferenceImage from './SceneReferenceImage.vue';
import { useSceneCalibrator } from '@/composables/scene/useSceneCalibrator.ts';
const sceneStore = useSceneStore();

const pSceneElement = useTemplateRef<SVGSVGElement>('sceneElement');
const onWheel = useSceneZoom().onWheel;
const activate = useSceneMover().activate;

useSceneCalibrator(pSceneElement);

function init() {
	if( !pSceneElement.value ) {
		console.error('pSceneElement is null');
		return;
	}

	// const BASE_SCALE = 1;
	// sceneStore.camera.scale = BASE_SCALE;
	// Инициализируем размер сцены = размеру svg
	sceneStore.camera.height = sceneStore.scene.height = Math.trunc(pSceneElement.value.height.baseVal.value);
	sceneStore.camera.width = sceneStore.scene.width = Math.trunc(pSceneElement.value.width.baseVal.value);
	sceneStore.ready = true;
}

onMounted(() => {
	init();
});

const viewBox = computed(() => {
	return `${sceneStore.camera.x} ${sceneStore.camera.y} ${sceneStore.camera.width} ${sceneStore.camera.height}`;
});


const visiblePoints = computed(() => {
	/*
	Т.к. планируется некая структура данных (kd-tree или quad-tree)
	для хранения точек, то видимые точки получать этим computed свойством.
	Значение должно зависеть от видимой области
	Если видимая область меняется, то и массив видимых
	точек должен пересчитыватся
	*/
	return [];
});
const visibleBounds = computed(() => {
	const left = sceneStore.camera.x;
	const top = sceneStore.camera.y;
	const right = left + sceneStore.camera.width;
	const bottom = top + sceneStore.camera.height;
	return { left, top, right, bottom };
});

</script>

<style lang="scss">
#scene-section {
	/* 1. Полная автономия: компонент занимает 100% родителя, но не коксеет его */
	width: 100%;
	height: 100%;
	/* 2. Защитный барьер: запрещаем компоненту диктовать свои размеры родителю */
	min-width: 0;
	min-height: 0;
	overflow: hidden;
	/* 3. Гарантируем, что SVG внутри будет позиционироваться относительно этой секции */
	position: relative;

	#scene {
		user-select: none;
		/* 4. Абсолютное позиционирование SVG отвязывает его физический размер от потока документа.
		Теперь SVG физически НЕ МОЖЕТ растянуть родительский блок, он просто заполняет #scene-section */
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: block;
		background-color: var(--scene-color);
	}
}
</style>
