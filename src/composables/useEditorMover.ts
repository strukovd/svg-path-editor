import { useEditorStore } from '@/stores/EditorStore';


export function useEditorMover() {
	const s = useEditorStore();

	// Накапливаемые смещения для rAF
	let moveDeltaX = 0;
	let moveDeltaY = 0;
	let moveRafId: number | null = null;

	// Главная функция-активатор, которая вешается на mousedown в HTML шаблоне
	function activate(e: MouseEvent) {
		if (!e.target) return;
		// Меняем курсор на "кулак"
		(e.target as any).style.cursor = 'grabbing';
		// Вешаем глобальные события движения и отпускания
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	}

	// Системные обработчики, которые будут гоняться по документу
	function onMouseMove(e: MouseEvent) {
		moveCamera(e.movementX, e.movementY);
	}

	function onMouseUp(e: MouseEvent) {
		// Удаляем слушатели с документа при отпускании кнопки мыши
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
		// Возвращаем дефолтный курсор элементу, который тащили
		if (e.target) {
			(e.target as any).style.cursor = '';
		}
		// Если был rAF в очереди — отменяем его, так как движение завершено
		if (moveRafId !== null) {
			cancelAnimationFrame(moveRafId);
			moveRafId = null;
		}
	}

	function moveCamera(dx: number, dy: number) {
		// Корректируем скорость сдвига на основе текущего масштаба
		moveDeltaX += dx * s.camera.scale;
		moveDeltaY += dy * s.camera.scale;

		if (moveRafId === null) { // Если rAF ещё не запущен, запустим
			// Накапливаем смещение и применяем одним кадром через rAF для более плавного панорамирования.
			moveRafId = requestAnimationFrame(() => {
				const camera = s.camera;
				// Сдвигаем координаты камеры холста
				camera.x = round(camera.x - moveDeltaX);
				camera.y = round(camera.y - moveDeltaY);
				// Сбрасываем накопители кадра
				moveDeltaX = 0;
				moveDeltaY = 0;
				moveRafId = null;
			});
		}
	}

	// Округление, аналогичное Zoom (использует текущий масштаб из Pinia)
	function round(value: number, digits = 4): number {
		if (s.camera.scale < 1) return value; // Если масштаб увеличен (меньше 1), то не округляем (иначе баги)
		return Number(value.toFixed(digits)); // при 100% и отдалении - округляем, просто для сокращения длинных чисел
	}


	return {
		activate,
	};
}
