class Utils {
	static calcMinStartPos(data, svgEl) {
		let minX = 0;
		let minY = 0;
		const viewBoxPadding = [20, 20, 20, 20];

		for (const status of data.layout.statuses) {
			minX = Math.min(status.x, minX);
			minY = Math.min(status.y, minY);
		}

		document.querySelector(`#canvas`).viewBox.baseVal.x = minX + viewBoxPadding[3];
		document.querySelector(`#canvas`).viewBox.baseVal.y = minY + viewBoxPadding[0];
		document.querySelector(`#canvas`).viewBox.baseVal.width = window.innerWidth + (viewBoxPadding[1] + viewBoxPadding[3]);
		document.querySelector(`#canvas`).viewBox.baseVal.height = window.innerHeight + (viewBoxPadding[2] + viewBoxPadding[0]);
	}
}

class Workspace {
	static init() {
		// Инициализировать холст (повесить основные события, нарисовать сетку)
		Canvas.create({
			el: `#canvas`,
			grid: {
				show: true
			}
		});

		// Получить данные статусов














		const colorMap = {
			"yellow":		{className: "status-blue", fillColor:"#dfe2e7", strokeColor: "#c4c7cf", textColor: "#445064"},
			"blue-gray":	{className: "status-yellow", fillColor:"#dbecfe", strokeColor: "#b7d2ee", textColor: "#164085"},
			"green":		{className: "status-green", fillColor:"#ddfdee", strokeColor: "#afecd2", textColor: "#17573d"},
		};
		const statusesById = {};
		const transitionsById = {};

		const canvas = document.querySelector(`#canvas`);
		Utils.calcMinStartPos(data, canvas);

		document.querySelector(`#canvas`).viewBox.baseVal.y;

		for (const status of data.layout.statuses) {
			statusesById[status.id] = status;

			let tag;
			if(status.initial) {
				tag = `<ellipse class="ellipse"
					cx="811.5"
					cy="82.80000000000001"
					rx="15"
					ry="15"
					fill="#c0c0c0"
					stroke="none"
					x="${status.x}"
					y="${status.y}"
					stroke-width="0"
					opacity="1"
					style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); opacity: 1; cursor: move;"
				></ellipse>`;
			}
			else {
				tag = `
				<g id="${status.id}" class="status ${colorMap[status.statusCategory.colourName].className}"
					transform="translate(${status.x}, ${status.y})"
				>
					<rect class="rect"
						x="0" y="0"
						width="${status.name.length/1.3}em"
						height="2.6em"
						r="0"
						rx="3"
						ry="3"
					></rect>

					<text class="label"
						text-anchor="start"
						x="${status.name.length/11}em"
						y="1.2em"
					>${status.name}</text>
				</g>
				<ellipse
					cx="${status.x}"
					cy="${status.y}"
					rx="3"
					ry="3"
					fill="#327df9"
					x="${status.x}"
					y="${status.y}"
				></ellipse>`;
			}

			canvas.insertAdjacentHTML(`afterbegin`, tag);
		}

		for (const transition of data.layout.transitions) {
			transitionsById[transition.id] = transition;

			// Добавим в объект статуса данные о связях
			if( !Array.isArray( statusesById[transition.sourceId]['outgoingWays'] ) ) statusesById[transition.sourceId]['outgoingWays'] = [];
			if( !Array.isArray( statusesById[transition.targetId]['incomingWays'] ) ) statusesById[transition.targetId]['incomingWays'] = [];
			statusesById[transition.sourceId]['outgoingWays'].push(transition.targetId);
			statusesById[transition.targetId]['incomingWays'].push(transition.sourceId);

			// Рисуем связи
			let tag;
			tag = `
			<g id="${transition.id}" class="status ${colorMap[transition?.statusCategory?.colourName]?.className || "status-blue"}"
				transform="translate(${transition.x}, ${transition.y})"
			>
			</g>`;

			// canvas.insertAdjacentHTML(`afterbegin`, tag);
		}

		console.log(data);
		

		// window.desktop = document.querySelector("#desktop");

		// window.desktop.addEventListener('click', (e)=>{ if(e.target == window.desktop) {Focus.unselectAll(e);} });
		// new Block({}).show();
	}
}

window.onload = Workspace.init;
