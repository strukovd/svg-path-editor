<template>
	<svg
		id="editor"
		ref="editor"
		:viewBox="viewBox"
		@mousedown="activate"
		@resize="()=>{ console.log(`resize`); }"
	>
		<defs>
			<!-- Тут определять градиенты, анимации, и прочее на которое будут ссылатся элементы -->
		</defs>
		<g v-if="grid.enabled" class="grid">
			<!-- Две жирные линии по 0,0 сетки -->
			<line class="grid" :x1="viewPortX" :y1="0" :x2="viewPortX + viewPortWidth" :y2="0" :stroke-width="grid.crossMultiplier*grid.strokeWidth"/>
			<line class="grid" :x1="0" :y1="viewPortY" :x2="0" :y2="viewPortY + viewPortHeight" :stroke-width="grid.crossMultiplier*grid.strokeWidth"/>
			<!-- Второстепенные линии -->
			<line
				v-for="x in grid.xLines"
				:key="`x-${x}`"
				class="grid"
				:x1="x"
				:y1="viewPortY - viewPortHeight * 0.5"
				:x2="x"
				:y2="viewPortY + viewPortHeight * 1.5"
				:stroke-width="grid.strokeWidth"
			/>
			<line
				v-for="y in grid.yLines"
				:key="`y-${y}`"
				class="grid"
				:x1="viewPortX - viewPortWidth * 0.5"
				:y1="y"
				:x2="viewPortX + viewPortWidth * 1.5"
				:y2="y"
				:stroke-width="grid.strokeWidth"
			/>

			<!-- <line class="grid ng-star-inserted"
				x1="-2.1085" y1="0"
				x2="86.5915" y2="0"
				strokeWidth="strokeWidth"></line> -->
		</g>
		<g class="images">

		</g>
		<g class="fill-path"></g>
		<g class="control-points">
			<!-- Дополнительные магнитные точки -->
		</g>
		<g class="points">

		</g>


		<text x="0" y="150" class="small">{{ viewBox }}</text>
		<text x="0" y="300" class="small">{{ visibleBounds }}</text>
		<path fill="#ffffff22" stroke="#ffffff" d="M0 0 L100 100 L0 100 Z"></path>
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

export default defineComponent({
	data() {
		return {
			pEditor: null as any,
			editorWidth: 0,
			editorHeight: 0,
			resizeObserver: null as any,
			moveDeltaX: 0,
			moveDeltaY: 0,
			moveRafId: null as number | null,

			viewPortX: 0,
			viewPortY: 0,
			viewPortWidth: 0,
			viewPortHeight: 0,

			scale: 1,
			stepScale: 0.1,
			minScale: 0.1,

			grid: {
				xLines: [] as number[],
				yLines: [] as number[],
				enabled: true,
				strokeWidth: 0.5,
				spacing: 10, // базовый шаг между второстепенными линиями
				crossMultiplier: 4
			}
		};
	},
	computed: {
		viewBox(): string {
			return `${this.viewPortX} ${this.viewPortY} ${this.viewPortWidth} ${this.viewPortHeight}`;
			// return `${this.viewPortX} ${this.viewPortY} ${this.viewPortWidth} ${this.viewPortHeight}`;
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
		}
	},
	watch:{
		viewBox(newValue: string, oldValue: string) {
			if(this.grid.enabled) {
				this.updateGrid();
			}
		}
	},
	methods: {
		updateGrid() {
			const { left, right, top, bottom } = this.visibleBounds;
			const padding = 0.5; // рисуем чуть шире видимой области
			const startX = Math.floor((left - this.viewPortWidth * padding) / this.grid.spacing) * this.grid.spacing;
			const endX = Math.ceil((right + this.viewPortWidth * padding) / this.grid.spacing) * this.grid.spacing;
			const startY = Math.floor((top - this.viewPortHeight * padding) / this.grid.spacing) * this.grid.spacing;
			const endY = Math.ceil((bottom + this.viewPortHeight * padding) / this.grid.spacing) * this.grid.spacing;

			const xLines: number[] = [];
			for(let x = startX; x <= endX; x += this.grid.spacing) {
				if (x !== 0) { // нулевая рисуется отдельно как жирная
					xLines.push(x);
				}
			}
			const yLines: number[] = [];
			for(let y = startY; y <= endY; y += this.grid.spacing) {
				if (y !== 0) {
					yLines.push(y);
				}
			}
			this.grid.xLines = xLines;
			this.grid.yLines = yLines;
		},
		moveCamera(dx: number, dy: number) {
			// Накапливаем смещение и применяем одним кадром через rAF для более плавного панорамирования.
			this.moveDeltaX += dx * this.scale;
			this.moveDeltaY += dy * this.scale;
			// Если rAF ещё не запущен, запустим
			if (this.moveRafId === null) {
				this.moveRafId = requestAnimationFrame(() => {
					this.viewPortX -= this.moveDeltaX;
					this.viewPortY -= this.moveDeltaY;
					this.moveDeltaX = 0;
					this.moveDeltaY = 0;
					this.moveRafId = null;
				});
			}
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
		if (this.grid.enabled) this.updateGrid();

		// Создаем наблюдатель за изменениями размера svg элемента
		this.resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				this.viewPortHeight = Number( entry.contentRect.height.toFixed(2) );
				this.viewPortWidth = Number( entry.contentRect.width.toFixed(2) );
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
	width:100%;
	background-color: var(--editor-color);
	height:100vh;

	.grid {
		stroke: #353536;
		// stroke-width: 1px;
		// stroke-opacity: 0.5;
	}
}
</style>
