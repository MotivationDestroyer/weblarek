import { Component } from '../base/Component';
import { EventEmitter } from '../base/EventEmitter';

interface ISuccess {
	total: number;
}

export class Success
	extends Component<ISuccess> {

	protected description: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		events: EventEmitter
	) {
		super(container, events);

		this.description = container.querySelector(
			'.order-success__description'
		) as HTMLElement;

		this.closeButton = container.querySelector(
			'.order-success__close'
		) as HTMLButtonElement;

		this.closeButton.addEventListener(
			'click',
			() => {
				events.emit('success:close');
			}
		);
	}

	render(data: ISuccess): HTMLElement {
		this.description.textContent =
			`Списано ${data.total} синапсов`;

		return this.container;
	}
}