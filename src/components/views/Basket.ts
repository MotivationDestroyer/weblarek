import { Component } from '../base/Component';
import { EventEmitter } from '../base/EventEmitter';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected list: HTMLUListElement;
	protected totalElement: HTMLElement;
	protected orderButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		events: EventEmitter
	) {
		super(container, events);

		this.list = container.querySelector(
			'.basket__list'
		) as HTMLUListElement;

		this.totalElement = container.querySelector(
			'.basket__price'
		) as HTMLElement;

		this.orderButton = container.querySelector(
			'.basket__button'
		) as HTMLButtonElement;

		this.orderButton.addEventListener('click', () => {
			events.emit('basket:order');
		});
	}

	render(data: Partial<IBasketView>): HTMLElement {
		if (data.items) {
			this.list.replaceChildren(...data.items);
		}

		if (data.total !== undefined) {
			this.totalElement.textContent =
				`${data.total} синапсов`;
		}

		this.orderButton.disabled =
			!data.items?.length;

		return this.container;
	}
}