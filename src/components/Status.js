class Status {
	static index = {};
	static counter = 0;

	constructor( { x=100, y=0, w=100, h=100}, styles={} ) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.styles = styles;
		this.target = null;

		if(!styles["background-color"]) styles["background-color"] = "#aaa"; // TODO: del

		// сгенерировать ид
		this.id = `b${++Block.counter}`;

		// сгенерировать html код
		this.html = Block.generateHtml({x,y,w,h,id:this.id}, styles);

		// зарегистрировать
		Block.index[ this.id ] = this;
	}

	show() {
		// вставить на страницу
		document.querySelector(`#desktop`).insertAdjacentHTML("beforeend", this.html);
		this.target = document.querySelector(`#${this.id}`);

		// инициализировать drag&drop
		this.target.addEventListener("mousedown", Mover.activate);

		// Возможность получения фокуса
		this.target.addEventListener("mousedown", Focus.select);

		// Возможность вызова окна свойств
		this.target.addEventListener('dblclick', ()=>{console.log('DOUBLE CLICK TO CALL PROPS');});// Props.show);
	}

	move( {offsetX=0, offsetY=0} ) {
		this.x += offsetX;
		this.y += offsetY;

		if(this.target) {
			this.target.style.left = `${this.x}px`;
			this.target.style.top = `${this.y}px`;
		}
	}

	static insert({
		x=100,
		y=0,
		w=100,
		h=100},
		styles = {})
	{
		if(!styles["background-color"]) styles["background-color"] = "#aaa";

		// сгенерировать ид
		const id = `b${++Block.counter}`;

		// сгенерировать html код
		const html = Block.generateHtml({x,y,w,h,id}, styles);

		// вставить его на страницу, в элемент относительно которого нужно
		document.querySelector(`#desktop`).insertAdjacentHTML("beforeend", html);

		// инициализировать drag&drop
		const el = document.querySelector(`#${id}`);
		el.addEventListener("mousedown", Mover.activate);

		// зарегистрировать
		const desc = {
			id: id,
			el: el,
			x,
			y
		};
	}

	static generateHtml(meta, styles) {
		let strStyles = `position:absolute;height:${meta.h}px;width:${meta.w}px;`;
		if(meta.x !== undefined) { strStyles += `left:${meta.x}px;`; }
		if(meta.y !== undefined) { strStyles += `top:${meta.y}px;`; }

		for (const styleName in styles) {
			if (Object.hasOwnProperty.call(styles, styleName)) {
				strStyles += `${styleName}:${styles[styleName]};`;
			}
		}

		const res = `<div id="${meta.id}" class="block" style="${strStyles}"></div>`;
		return res;
	}
}
