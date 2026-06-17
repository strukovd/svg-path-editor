<template>
	<section id="scene-section">
		<svg
			:style="{visibility: s.ready?'visible':'hidden'}"
			id="scene"
			ref="sceneElement"
			:viewBox="viewBox"
			@mousedown="activate"
			@wheel.prevent="onWheel"
			@resize="()=>{ console.log(`resize`); }"
		>
			<defs>
				<!-- Тут определять градиенты, анимации, и прочее на которое будут ссылатся элементы -->
			</defs>
			<SceneGrid/>
			<SceneReferenceImage/>
			<g class="active-path">
				<path
					v-if="activePathD"
					:d="activePathD"
					class="shape"
					fill="#ffffff22"
					stroke="#ffffff"
					:stroke-width="grid.crossLineThickness * grid.baseLineThickness * s.camera.scale"
				/>
	
				<!-- Контрольные линии -->
				<g class="control-lines">
					<line
						v-for="ctrl of controlPoints"
						:key="`ctrl-line-${ctrl.itemReference.getType()}-${ctrl.x}-${ctrl.y}`"
						class="control-line"
						:x1="ctrl.relations[0]?.x ?? ctrl.x"
						:y1="ctrl.relations[0]?.y ?? ctrl.y"
						:x2="ctrl.x"
						:y2="ctrl.y"
						vector-effect="non-scaling-stroke"
						:stroke-width="grid.baseLineThickness"
					/>
				</g>
	
				<!-- Контрольные точки -->
				<g class="control-points">
					<circle
						v-for="ctrl of controlPoints"
						:key="`ctrl-${ctrl.itemReference.getType()}-${ctrl.x}-${ctrl.y}`"
						class="control-point"
						:cx="ctrl.x"
						:cy="ctrl.y"
						:r="pointRadius"
						vector-effect="non-scaling-stroke"
						@mousedown.stop.prevent="startDragPoint(ctrl, $event)"
					/>
				</g>
	
				<!-- Вершины -->
				<g class="points">
					<circle
						v-for="pt of anchorPoints"
						:key="`pt-${pt.x}-${pt.y}`"
						class="anchor-point"
						:cx="pt.x"
						:cy="pt.y"
						:r="pointRadius"
						vector-effect="non-scaling-stroke"
						@mousedown.stop.prevent="startDragPoint(pt, $event)"
					/>
				</g>
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
import { computed, defineComponent, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useSceneStore } from '@/stores/SceneStore.ts';
import { AnchorPoint, ControlPoint } from '@/lib/svg';
import { useSceneGrid } from '../../../composables/useSceneGrid.ts';
import { useSceneZoom } from '@/composables/useSceneZoom.ts';
import { useSceneMover } from '@/composables/useSceneMover.ts';
import SceneGrid from './SceneGrid.vue';
import SceneReferenceImage from './SceneReferenceImage.vue';
const s = useSceneStore();
const sceneGrid = useSceneGrid();

const grid = sceneGrid.grid;
const onWheel = useSceneZoom().onWheel;
const activate = useSceneMover().activate;




const pSceneElement = useTemplateRef<SVGSVGElement>('sceneElement');
let resizeObs: ResizeObserver | null = null;
const moveDeltaX = ref(0);
const moveDeltaY = ref(0);
// const moveRafId = ref<number | null>(null);
const draggedPoint = ref<AnchorPoint | ControlPoint | null>(null);
const dragMoveHandler = ref<((e: MouseEvent) => void) | null>(null);
const dragUpHandler = ref<((e: MouseEvent) => void) | null>(null);


function init() {
	if( !pSceneElement.value ) {
		console.error('pSceneElement is null');
		return;
	}

	const BASE_SCALE = 1; // this.camera.width / this.editorWidth
	// Инициализируем размер вьюпорта равным размеру svg, что бы не было проблем со скроллингом
	s.camera.scale = BASE_SCALE;
	s.camera.height = s.scene.height = Math.trunc(pSceneElement.value.height.baseVal.value); // высота
	s.camera.width = s.scene.width = Math.trunc(pSceneElement.value.width.baseVal.value); // ширина

	initResizeObs();
	s.ready = true;
}
function initResizeObs() {
	// Создаем наблюдатель за изменениями размера svg элемента
	resizeObs = new ResizeObserver((entries) => {
		for (const entry of entries) {
			s.camera.height = Number( entry.contentRect.height.toFixed(2) );
			s.camera.width = Number( entry.contentRect.width.toFixed(2) );
		}
	});
	resizeObs.observe(pSceneElement.value!);
}

onMounted(() => {
	init();
});

// onUnmounted(() => {
// 	resizeObserver.unobserve(pSceneElement.value);
// 	if (moveRafId !== null) {
// 		cancelAnimationFrame(moveRafId);
// 	}
// });



const viewBox = computed(() => {
	return `${s.camera.x} ${s.camera.y} ${s.camera.width} ${s.camera.height}`;
});


const pointRadius = computed(() => {
	return 3 * s.camera.scale; // Math.max(3 * this.camera.scale, 3);
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
	const left = s.camera.x;
	const top = s.camera.y;
	const right = left + s.camera.width;
	const bottom = top + s.camera.height;
	return { left, top, right, bottom };
});


// function startDragPoint(pt: AnchorPoint | ControlPoint, e: MouseEvent) {
// 	const draggedPoint = pt;
// 	const dragMoveHandler = (evt: MouseEvent) => dragPoint(evt);
// 	const dragUpHandler = () => stopDragPoint();
// 	document.addEventListener('mousemove', dragMoveHandler);
// 	document.addEventListener('mouseup', dragUpHandler);
// }
// function dragPoint(e: MouseEvent) {
// 	if (!draggedPoint) return;
// 	const pos = s.clientToWorld(e.clientX, e.clientY, e.currentTarget as SVGSVGElement);
// 	s.updateActivePath(path => {
// 		path.setLocation(draggedPoint as any, pos);
// 	}, false);
// }
// function stopDragPoint() {
// 	if (draggedPoint) {
// 		// финализируем шаг в историю
// 		s.pushHistory();
// 	}
// 	draggedPoint = null;
// 	if (dragMoveHandler) {
// 		document.removeEventListener('mousemove', this.dragMoveHandler);
// 		dragMoveHandler = null;
// 	}
// 	if (dragUpHandler) {
// 		document.removeEventListener('mouseup', this.dragUpHandler);
// 		dragUpHandler = null;
// 	}
// }

// MOVING
// RESIZING
// ROTATING
// SCALING
</script>

<style lang="scss">
#scene-section {
	#scene {
		user-select: none;
		width:100%;
		background-color: var(--scene-color);
		height:100vh;

		.active-path {
			.shape {
				fill: #ffffff11;
				stroke: #ffffff;
			}
			.points .anchor-point {
				fill: #2e2e2e;
				stroke: transparent;
				stroke-width:10px;
				cursor: pointer;
				&:hover {
					fill: #0091bd;
				}
				&.active {
					fill: #0091bd;
				}
			}
			.control-points .control-point {
				fill: #00c2ff;
				stroke: transparent;
				stroke-width:10px;
				cursor: pointer;
				&:hover {
					fill: #0091bd;
				}
				&.active {
					fill: #0091bd;
				}
			}
			.control-lines .control-line {
				stroke: #00c2ff;
				stroke-dasharray: 4 4;
			}
		}
	}
}
</style>
