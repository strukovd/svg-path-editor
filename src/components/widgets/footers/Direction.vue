<template>
	<section class="footer-direction" aria-label="Ограничение направления перемещения">
		<span class="option active" title="Свободное перемещение">
			<i class="icon free" aria-hidden="true"></i>
		</span>
		<span class="option" title="Перемещение по горизонтали">
			<i class="icon horizontal" aria-hidden="true"></i>
		</span>
		<span class="option" title="Перемещение по вертикали">
			<i class="icon vertical" aria-hidden="true"></i>
		</span>
	</section>
</template>

<script setup lang="ts">
/*
	Индикатор направления перетаскивания.
	Задумка такова: при нажатии X | Y режим перетаскивания (по аналогии с Blender)
	переключается на соответствующий (горизонтальное/вертикальное).
	А индикатор показывает текущий режим.
	По умолч. без ограничений направления.
	*После перетаскивания можно возвращать в свободное перемещение.
*/
</script>

<style lang="scss">
.footer-direction {
	display: inline-flex;
	align-items: center;
	gap: .15rem;
	height: 100%;

	.option {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 3px;
		color: #8f9198;

		&.active {
			background: color-mix(in srgb, var(--primary) 28%, transparent);
			color: #69aaff;
		}

		.icon {
			position: relative;
			display: block;
			width: .7rem;
			height: .7rem;

			&::before,
			&::after {
				position: absolute;
				inset: 50% auto auto 50%;
				border-radius: 1px;
				background: currentColor;
				content: '';
				transform: translate(-50%, -50%);
			}

			&.free,
			&.horizontal {
				&::before {
					width: 100%;
					height: 2px;
				}
			}

			&.free,
			&.vertical {
				&::after {
					width: 2px;
					height: 100%;
				}
			}

			&.horizontal::after,
			&.vertical::before {
				display: none;
			}
		}
	}
}
</style>
