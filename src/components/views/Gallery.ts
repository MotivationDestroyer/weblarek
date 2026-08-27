import { Component } from '../base/Component';

interface IGallery {
	items: HTMLElement[];
}

export class Gallery
	extends Component<IGallery> {

	constructor(container: HTMLElement) {
		super(container);
	}

	render(
		data: Partial<IGallery>
	): HTMLElement {
		if (data.items) {
			this.container.replaceChildren(
				...data.items
			);
		}

		return this.container;
	}
}