<template>
	<svg
		id="editor"
		ref="editor"
		:viewBox="viewBox"
		@mousedown="activate"
		@wheel.prevent="onWheel"
		@resize="()=>{ console.log(`resize`); }"
	>
		<defs>
			<!-- Тут определять градиенты, анимации, и прочее на которое будут ссылатся элементы -->
		</defs>
		<g v-if="grid.enabled" class="grid">
			<!-- Две жирные линии по 0,0 сетки (Центральный крест) -->
			<line class="grid" x1="0" y1="-100%" x2="0" y2="200%" :stroke-width="grid.crossLineThickness * scale"/>
			<line class="grid" x1="-100%" y1="0" x2="200%" y2="0" :stroke-width="grid.crossLineThickness * scale"/>

			<!-- Второстепенные линии -->
			<line
				v-for="x of grid.xLines"
				:key="`x-${x}`"
				:class="[`grid`, {tick: x % grid.majorGap === 0}]"
				:x1="x"
				:y1="viewPortY - viewPortHeight * 0.5"
				:x2="x"
				:y2="viewPortY + viewPortHeight * 1.5"
				:stroke-width="getLineThickness(x, scale)"
			/>
			<line
				v-for="y of grid.yLines"
				:key="`y-${y}`"
				:class="[`grid`, {tick: y % grid.majorGap === 0}]"
				:x1="viewPortX - viewPortWidth * 0.5"
				:y1="y"
				:x2="viewPortX + viewPortWidth * 1.5"
				:y2="y"
				:stroke-width="getLineThickness(y, scale)"
			/>
		</g>

		<g class="images">

		</g>
		<g class="active-path">
			<path
				v-if="activePathD"
				:d="activePathD"
				class="shape"
				fill="#ffffff22"
				stroke="#ffffff"
				:stroke-width="grid.crossLineThickness*grid.baseLineThickness*scale"
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
			<text x="0" y="150" class="small">{{ viewBox }}</text>
			<text x="0" y="300" class="small">{{ visibleBounds }}</text>
			<!-- <path fill="#ffffff22" stroke="#ffffff" :d="activePathD"></path> -->
		</g>
	</svg>
</template>

<!--
Есть один SVG, внутри которого сначала рисуются линии (<line>, только в пределах видимости, сначала жирные 0, 0, затем остальные),
затем рисуется обыкновенный path, внутрь которого помещается провализированный код из редактора,
затем рисуются поперечные линии (<line>) (для кривых безьё),
а затем уже сами точкт (<cirle>) всех элементов (линий, безьё, arc, и прочее)
-->

<script lang="ts">
import { defineComponent } from 'vue';
import { useEditorStore } from '@/stores/EditorStore';
import { AnchorPoint, ControlPoint } from '@/lib/svg';
import { useEditorGrid } from '../../../composables/useEditorGrid';

export default defineComponent({
	name: 'EditorComponent',
	setup() {
		const editorStore = useEditorStore();
		const editorGrid = useEditorGrid();
		editorStore.ensureInitialized();
		return {
			editorStore,
			grid: editorGrid.grid,
			getLineThickness: editorGrid.getLineThickness,
			updateEditorGrid: editorGrid.updateGrid,
		};
	},
	emits: ['scale'],
	data() {
		return {
			pEditor: null as any,
			editorWidth: 0,
			editorHeight: 0,
			resizeObserver: null as any,
			moveDeltaX: 0,
			moveDeltaY: 0,
			moveRafId: null as number | null,
			draggedPoint: null as AnchorPoint | ControlPoint | null,
			dragMoveHandler: null as ((e: MouseEvent) => void) | null,
			dragUpHandler: null as ((e: MouseEvent) => void) | null,

			viewPortX: 0,
			viewPortY: 0,
			viewPortWidth: 0,
			viewPortHeight: 0,

			scale: 1,
			stepScale: 0.2,
			minScale: 0.1,
		};
	},
	computed: {
		viewBox(): string {
			return `${this.viewPortX} ${this.viewPortY} ${this.viewPortWidth} ${this.viewPortHeight}`;
			// return `${this.viewPortX} ${this.viewPortY} ${this.viewPortWidth} ${this.viewPortHeight}`;
		},

		activePathD(): string {
			const el = this.editorStore?.activeElement;
			if (el && el.type === 'path') {
				return el.data.asString();
			}
			return 'M168 200H279C282.542 200 285.932 198.756 289 197 292.068 195.244 295.23 193.041 297 190 298.77 186.959 300.002 183.51 300 179.999 299.998 176.488 298.773 173.04 297 170.001L222 41C220.23 37.96 218.067 35.7552 215 34 211.933 32.2448 207.542 31 204 31 200.458 31 197.067 32.2448 194 34 190.933 35.7552 188.77 37.96 187 41L168 74 130 9.9976C128.228 6.9578 126.068 3.7549 123 2 119.932.2451 116.542 0 113 0 109.458 0 106.068.2451 103 2 99.9323 3.7549 96.7717 6.9578 95 9.9976L2 170.001C.227 173.04.0015 176.488 0 179.999-.0015 183.51.2296 186.959 2 190 3.7704 193.04 6.9325 195.244 10 197 13.0675 198.756 16.4578 200 20 200H90C117.737 200 137.925 187.558 152 164L186 105 204 74 259 168H182L168 200ZM89 168H40L113 42 150 105 125.491 147.725C116.144 163.01 105.488 168 89 168Z';
		},

		anchorPoints(): AnchorPoint[] {
			const el = this.editorStore?.activeElement;
			if (el && el.type === 'path') {
				return el.data.targetLocations();
			}
			return [];
		},

		controlPoints(): ControlPoint[] {
			const el = this.editorStore?.activeElement;
			if (el && el.type === 'path') {
				return el.data.controlLocations();
			}
			return [];
		},

		pointRadius(): number {
			return 3 * this.scale; // Math.max(3 * this.scale, 3);
		},

		visiblePoints() {
			/*
			Т.к. планируется некая структура данных (kd-tree или quad-tree)
			для хранения точек, то видимые точки получать этим computed свойством.
			Значение должно зависеть от видимой обласи
			Если видимая область меняется, то и массив видимых
			точек должен пересчитыватся
			*/
			return [];
		},

		visibleBounds() {
			const left = this.viewPortX;
			const top = this.viewPortY;
			const right = left + this.viewPortWidth;
			const bottom = top + this.viewPortHeight;
			return { left, top, right, bottom };
		},
	},
	watch:{
		viewBox(newValue: string, oldValue: string) {
			if(this.grid.enabled) {
				this.updateGrid();
			}
		},

		scale(newValue: number, oldValue: number) {
			// TODO: убрать если вынесу параметры в pinia
			let scale = newValue ?? 0;
			if(scale) scale = Math.round((1 / scale) * 100);
			this.$emit('scale', scale);
			return scale;
		}
	},
	methods: {
		updateGrid() {
			this.updateEditorGrid({
				editorWidth: this.editorWidth,
				viewPortWidth: this.viewPortWidth,
				viewPortHeight: this.viewPortHeight,
				visibleBounds: this.visibleBounds,
				scale: this.scale,
			});
		},
		moveCamera(dx: number, dy: number) {
			// Накапливаем смещение и применяем одним кадром через rAF для более плавного панорамирования.
			this.moveDeltaX += dx * this.scale;
			this.moveDeltaY += dy * this.scale;
			// Если rAF ещё не запущен, запустим
			if (this.moveRafId === null) {
				this.moveRafId = requestAnimationFrame(() => {
					this.viewPortX = this.round(this.viewPortX - this.moveDeltaX);
					this.viewPortY = this.round(this.viewPortY - this.moveDeltaY);
					this.moveDeltaX = 0;
					this.moveDeltaY = 0;
					this.moveRafId = null;
				});
			}
		},

		onWheel(e: WheelEvent) {
			if (!e.altKey) {
				return;
			}
			const svgEl = this.$refs.editor as SVGSVGElement;
			const rect = svgEl.getBoundingClientRect();
			const pointerX = this.viewPortX + (e.clientX - rect.left) * (this.viewPortWidth / rect.width);
			const pointerY = this.viewPortY + (e.clientY - rect.top) * (this.viewPortHeight / rect.height);

			const direction = Math.sign(e.deltaY) || 1;
			const factor = Math.pow(1 + this.stepScale, direction);

			const newWidth = Math.max(this.minScale, this.viewPortWidth * factor);
			const newHeight = Math.max(this.minScale, this.viewPortHeight * factor);

			// Масштабируем относительно точки под курсором.
			const newViewPortX = pointerX - (pointerX - this.viewPortX) * (newWidth / this.viewPortWidth);
			const newViewPortY = pointerY - (pointerY - this.viewPortY) * (newHeight / this.viewPortHeight);

			this.viewPortX = this.round(newViewPortX);
			this.viewPortY = this.round(newViewPortY);
			this.viewPortWidth = this.round(newWidth);
			this.viewPortHeight = this.round(newHeight);

			// Обновляем коэффициент для перемещения (пиксель -> мировые координаты).
			if (this.editorWidth) {
				this.scale = this.viewPortWidth / this.editorWidth;
			}
		},

		clientToWorld(e: MouseEvent) {
			const svgEl = this.$refs.editor as SVGSVGElement;
			const rect = svgEl.getBoundingClientRect();
			const x = this.viewPortX + (e.clientX - rect.left) * (this.viewPortWidth / rect.width);
			const y = this.viewPortY + (e.clientY - rect.top) * (this.viewPortHeight / rect.height);
			return { x, y };
		},

		startDragPoint(pt: AnchorPoint | ControlPoint, e: MouseEvent) {
			this.draggedPoint = pt;
			this.dragMoveHandler = (evt: MouseEvent) => this.dragPoint(evt);
			this.dragUpHandler = () => this.stopDragPoint();
			document.addEventListener('mousemove', this.dragMoveHandler);
			document.addEventListener('mouseup', this.dragUpHandler);
		},
		dragPoint(e: MouseEvent) {
			if (!this.draggedPoint) return;
			const pos = this.clientToWorld(e);
			this.editorStore.updateActivePath(path => {
				path.setLocation(this.draggedPoint as any, pos);
			}, false);
		},
		stopDragPoint() {
			if (this.draggedPoint) {
				// финализируем шаг в историю
				this.editorStore.pushHistory();
			}
			this.draggedPoint = null;
			if (this.dragMoveHandler) {
				document.removeEventListener('mousemove', this.dragMoveHandler);
				this.dragMoveHandler = null;
			}
			if (this.dragUpHandler) {
				document.removeEventListener('mouseup', this.dragUpHandler);
				this.dragUpHandler = null;
			}
			this.updateGrid();
		},

		round(value: number, digits = 4): number {
			if (this.scale < 1) return value; // Если масштаб увеличен (меньше 1), то не округляем (иначе баги)
			return Number(value.toFixed(digits)); // при 100% и отдалении - округляем, просто для сокращения длинных чисел
		},

		// MOVING
		activate(e: Event) { // onMouseDown
			// Убедимся что тянется не дочерний элемент и блок позиционирован абсолютно
			if(e.target ) { // === e.currentTarget ) {
				(e.target as any).style.cursor = 'grabbing';

				// Повесить на текущий блок событие move и deactivate
				document.addEventListener("mousemove", this.move);
				document.addEventListener("mouseup", this.deactivate);
			}
		},
		move(e: MouseEvent) {
			this.moveCamera(e.movementX, e.movementY);
		},
		deactivate(e: MouseEvent) { // onMouseUp
			document.removeEventListener("mousemove", this.move);
			document.removeEventListener("mouseup", this.deactivate);
			// Mover.actorData.element.removeEventListener("mouseout", Mover.deactivate); // TODO:
			(e.target as any).style.cursor = '';
			this.stopDragPoint();
		}

		// RESIZING

		// ROTATING

		// SCALING



	},
	mounted() {
		// Инициализируем размер вьюпорта равным размеру svg, что бы не было проблем со скроллингом
		this.pEditor = this.$refs.editor as any;
		const svgHeight = this.editorHeight = Math.trunc(this.pEditor.height.baseVal.value);
		const svgWidth = this.editorWidth = Math.trunc(this.pEditor.width.baseVal.value);
		this.viewPortHeight = svgHeight;
		this.viewPortWidth = svgWidth;
		this.scale = this.viewPortWidth / this.editorWidth;
		if (this.grid.enabled) this.updateGrid();

		// Создаем наблюдатель за изменениями размера svg элемента
		this.resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				this.viewPortHeight = Number( entry.contentRect.height.toFixed(2) );
				this.viewPortWidth = Number( entry.contentRect.width.toFixed(2) );
				this.scale = this.viewPortWidth / this.editorWidth;
				if (this.grid.enabled) this.updateGrid();
			}
		});
		this.resizeObserver.observe(this.pEditor);
	},
	unmounted() {
		this.resizeObserver.unobserve(this.pEditor);
		if (this.moveRafId !== null) {
			cancelAnimationFrame(this.moveRafId);
		}
	}
});
</script>

<style lang="scss">
#editor {
	user-select: none;
	width:100%;
	background-color: var(--editor-color);
	height:100vh;

	.grid {
		stroke: #353536;
		// stroke-width: 1px;
		// stroke-opacity: 0.5;

		&.tick {
			// stroke: #353536;
			// stroke-width: 1px;
			// stroke-opacity: 0.5;
		}
	}

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
</style>
