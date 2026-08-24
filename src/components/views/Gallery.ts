import { Component } from '../base/Component';
import { EventEmitter } from '../base/EventEmitter';

interface IGallery {
	items: HTMLElement[];
}

export class Gallery
	extends Component<IGallery> {

	constructor(
		container: HTMLElement,
		events: EventEmitter
	) {
		super(container, events);
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