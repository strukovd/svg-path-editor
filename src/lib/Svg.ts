class Svg {
	// VirtualElement[]
	static parse(svgString: string) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgString, 'image/svg+xml');

		Array.from(doc.children).forEach((child) => {
			console.log(child.tagName);
			
		});

		// return paths;
	}
}