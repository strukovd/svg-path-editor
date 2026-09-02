<template>
	<section id="tool-bar">
		<button type="button" class="tool" title="Circle">
			<img src="/circle.svg" alt="Circle">
		</button>
		<button type="button" class="tool" title="Line">
			<img src="/line.svg" alt="Line">
		</button>
		<button type="button" class="tool" title="Rectangle">
			<img src="/rect.svg" alt="Rectangle">
		</button>
		<button type="button" class="tool" title="Image">
			<img src="/image.svg" alt="Image">
		</button>
		<button type="button" class="tool" title="Path">
			<img src="/path.svg" alt="Path">
		</button>
		<!-- <div title="moveto (move from one point to another point)">M</div>
		<div title="lineto (create a line)">L</div>
		<div title="horizontal lineto (create a horizontal line)">H</div>
		<div title="vertical lineto (create a vertical line)">V</div>
		<div title="curveto (create a curve)">C</div>
		<div title="smooth curveto (create a smooth curve)">S</div>
		<div title="quadratic Bézier curve (create a quadratic Bézier curve)">Q</div>
		<div title="smooth quadratic Bézier curveto (create a smooth quadratic Bézier curve)">T</div>
		<div title="elliptical Arc (create a elliptical arc)">A</div>
		<div title="closepath (close the path)">Z</div> -->
		...<br>
	</section>
</template>

<script lang="ts" setup>
	
</script>

<style lang="scss">
#tool-bar {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: .45rem;
	width: 3.25rem;
	box-sizing: border-box;
	padding: .65rem .45rem;
	border-right: 1px solid color-mix(in srgb, var(--sidebar-color) 76%, white 24%);
	background: var(--sidebar-color);

	.tool {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border: 1px solid color-mix(in srgb, var(--sidebar-color) 72%, white 28%);
		border-radius: 6px;
		background: color-mix(in srgb, var(--sidebar-color) 86%, white 14%);
		cursor: pointer;
		padding: .4rem;

		&:hover {
			background: color-mix(in srgb, var(--sidebar-color) 74%, white 26%);
			border-color: color-mix(in srgb, var(--primary) 60%, white 40%);
		}

		&:focus-visible {
			outline: 1px solid var(--primary);
			outline-offset: 2px;
		}

		img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: contain;
			filter: invert(1) opacity(.86);
			pointer-events: none;
		}
	}
}
</style>