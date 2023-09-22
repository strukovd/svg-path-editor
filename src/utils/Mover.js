class Mover {
	static context = null;

	static activate(e) { // onMouseDown
		// Убедимся что тянется не дочерний элемент и блок позиционирован абсолютно
		if(e.target == e.currentTarget ) { // && e.target.style.position == 'absolute') {
			document.body.style.cursor = 'grabbing';

			// Запечатляем положение курсора
			const x = parseInt( e.target.style.left.replace(/[^\d\-]*/g, '') );
			const y = parseInt( e.target.style.top.replace(/[^\d\-]*/g, '') );

			// Сохраняем данные перетаскиваемого элемента, хранятся пока не будет отпущен курсор
			Mover.context = {
				target: e.target,
				x: isNaN( x ) ? 0 : x,
				y: isNaN( y ) ? 0 : y,
				cursorX: e.x,
				cursorY: e.y
			};

			// Повесить на текущий блок событие move и deactivate
			document.addEventListener("mousemove", Mover.move);
			document.addEventListener("mouseup", Mover.deactivate);
			// e.target.addEventListener("mouseout", Mover.deactivate); // TODO:
		}
	}


	static move(e) {
		console.log(e);


		if(Mover.context.target) {
			// К предыдущей позиции блока прибавляем разницу
			// Mover.context.x += e.x - Mover.context.cursorX;
			// Mover.context.y += e.y - Mover.context.cursorY;

			Mover.context.x += e.movementX;
			Mover.context.y += e.movementY;
			Mover.context.target.style.left = `${Mover.context.x}px`;
			Mover.context.target.style.top = `${Mover.context.y}px`;
		}

		Mover.context.cursorY = e.y;
		Mover.context.cursorX = e.x;
	}


	static deactivate(e) { // onMouseUp
		document.removeEventListener("mousemove", Mover.move);
		document.removeEventListener("mouseup", Mover.deactivate);
		// Mover.actorData.element.removeEventListener("mouseout", Mover.deactivate); // TODO:
		document.body.style.cursor = '';
		Mover.context = null;
	}
}
