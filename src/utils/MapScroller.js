class MapScroller {
	static context = null;

	static activate(e) { // onMouseDown
		// Убедимся что тянется не дочерний элемент и блок позиционирован абсолютно
		if(e.target == e.currentTarget ) { // && e.target.style.position == 'absolute') {
			document.body.style.cursor = 'grabbing';

			// Запечатляем положение курсора
			const x = parseInt( e.target.style.left.replace(/[^\d\-]*/g, '') );
			const y = parseInt( e.target.style.top.replace(/[^\d\-]*/g, '') );

			// Сохраняем данные перетаскиваемого элемента, хранятся пока не будет отпущен курсор
			MapScroller.context = {
				target: e.target,
				x: isNaN( x ) ? 0 : x,
				y: isNaN( y ) ? 0 : y,
				cursorX: e.x,
				cursorY: e.y
			};

			// Повесить на текущий блок событие move и deactivate
			document.addEventListener("mousemove", MapScroller.move);
			document.addEventListener("mouseup", MapScroller.deactivate);
			// e.target.addEventListener("mouseout", Mover.deactivate); // TODO:
		}
	}


	static move(e) {
		console.log(e);


		if(MapScroller.context.target) {
			// К предыдущей позиции блока прибавляем разницу
			// Mover.context.x += e.x - Mover.context.cursorX;
			// Mover.context.y += e.y - Mover.context.cursorY;

			MapScroller.context.x += e.movementX;
			MapScroller.context.y += e.movementY;
			MapScroller.context.target.style.left = `${MapScroller.context.x}px`;
			MapScroller.context.target.style.top = `${MapScroller.context.y}px`;
		}

		MapScroller.context.cursorY = e.y;
		MapScroller.context.cursorX = e.x;
	}


	static deactivate(e) { // onMouseUp
		document.removeEventListener("mousemove", MapScroller.move);
		document.removeEventListener("mouseup", MapScroller.deactivate);
		// Mover.actorData.element.removeEventListener("mouseout", Mover.deactivate); // TODO:
		document.body.style.cursor = '';
		MapScroller.context = null;
	}
}
