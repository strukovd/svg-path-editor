class Canvas {
	static pCanvas = null;

	/**
	 * @param {Object} config
	 * @param {String} config.el
	 * @param {Object} config.grid
	 * @param {Boolean} config.grid.show
	 * @param {Number} config.grid.size
	 */
	static create({el, grid}) {
		Canvas.pCanvas = document.querySelector(`#canvas`);
		Canvas.pCanvas.addEventListener(`mousedown`, MapScroller.activate);
	}

	static setPosition() {

	}

	static setZoom(percent) {

	}
}
