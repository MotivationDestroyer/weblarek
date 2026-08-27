import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class Modal
	extends Component<HTMLElement> {

	protected content: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		events: EventEmitter
	) {
		super(container);

		this.content = container.querySelector(
			'.modal__content'
		) as HTMLElement;

		this.closeButton = container.querySelector(
			'.modal__close'
		) as HTMLButtonElement;

		this.closeButton.addEventListener(
			'click',
			() => {
				events.emit('modal:close');
			}
		);
	}

	open(): void {
		this.container.classList.add(
			'modal_active'
		);
	}

	close(): void {
		this.container.classList.remove(
			'modal_active'
		);
	}

	render(
		data: HTMLElement
	): HTMLElement {
		this.content.replaceChildren(data);

		return this.container;
	}
}