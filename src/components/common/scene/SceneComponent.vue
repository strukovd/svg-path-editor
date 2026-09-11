<template>
	<section id="scene-section">
		<svg
			:style="{visibility: sceneStore.ready?'visible':'hidden'}"
			id="scene"
			ref="sceneElement"
			:viewBox="viewBox"
			@mousedown="activate"
			@wheel.prevent="onWheel"
			@mousemove="updateCursor($event.clientX, $event.clientY, pSceneElement)"
			@resize="()=>{ console.log(`resize`); }"
		>
			<defs>
				<!-- Тут определять градиенты, анимации, и прочее на которое будут ссылатся элементы -->
			</defs>
			<SceneGrid/>
			<SceneReferenceImage/>

			<g class="elements">
				<ElementComponent
					v-for="element of sceneStore.elements"
					:key="element.id"
					:element="element"
					:selected="isSelected(element.id)"
					@select="selectElement"
				/>
			</g>

			<g class="transform-layer">
				<SceneEntityBox
					v-if="context.type === 'SELECTION' && selectedBox && selectedElement"
					:box="selectedBox"
					:active="true"
					:locked="selectedElement.attrs.locked === true"
					:opacity="Number(selectedElement.attrs.opacity ?? 1)"
					@select="selectElement(selectedElement.id)"
					@change-box="changeSelectedBox"
					@change-opacity="opacity => setElementOpacity(selectedElement!.id, opacity)"
					@toggle-lock="toggleElementLock(selectedElement.id)"
					@remove="removeElement(selectedElement.id)"
				/>
			</g>

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
import type { SceneBox } from '@/types/scene-entity';
import { useSceneZoom } from '@/composables/scene/useSceneZoom.ts';
import { useSceneMover } from '@/composables/scene/useSceneMover.ts';
import SceneEntityBox from './SceneEntityBox.vue';
import SceneGrid from './SceneGrid.vue';
import SceneReferenceImage from './SceneReferenceImage.vue';
import { useSceneCalibrator } from '@/composables/scene/useSceneCalibrator.ts';
import { useSceneDemoSeeds } from '@/composables/scene/useSceneDemo.ts';
import { useSceneContext } from '@/composables/scene/useSceneContext.ts';
import { useSceneElements } from '@/composables/scene/useSceneElements.ts';
import { useSceneMouse } from '@/composables/scene/useSceneMouse.ts';
import { useSceneSelection } from '@/composables/scene/useSceneSelection.ts';
import ElementComponent from './ElementComponent.vue';
const sceneStore = useSceneStore();

const pSceneElement = useTemplateRef<SVGSVGElement>('sceneElement');
const onWheel = useSceneZoom().onWheel;
const activate = useSceneMover().activate;
const { context } = useSceneContext();
const { selectedElement, selectedBox, isSelected, selectElement } = useSceneSelection();
const { updateElementBox, setElementOpacity, toggleElementLock, removeElement } = useSceneElements();
const { updateCursor } = useSceneMouse();

useSceneCalibrator(pSceneElement);
useSceneDemoSeeds().injectDemoData();

function init() {
	if (!pSceneElement.value) {
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

function changeSelectedBox(box: SceneBox) {
	if (!selectedElement.value) return;
	updateElementBox(selectedElement.value.id, box);
}
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

		.elements {
			.element {
				cursor: pointer;

				&.selected {
					stroke: #00c2ff;
				}
			}

			.line {
				fill: none;
			}
		}

		.transform-layer {
			.scene-entity-box {
				pointer-events: all;
			}
		}
	}
}
</style>
