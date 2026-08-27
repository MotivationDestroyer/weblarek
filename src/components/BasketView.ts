import { Component } from './base/Component';
import { EventEmitter } from './base/Events';

export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class BasketView extends Component<IBasketView> {
	private list: HTMLElement;
	private price: HTMLElement;
	private button: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		events: EventEmitter
	) {
		super(container);

		this.list = container.querySelector(
			'.basket__list'
		) as HTMLElement;

		this.price = container.querySelector(
			'.basket__price'
		) as HTMLElement;

		this.button = container.querySelector(
			'.basket__button'
		) as HTMLButtonElement;

		this.button.addEventListener('click', () => {
			events.emit('basket:order');
		});
	}

	set items(items: HTMLElement[]) {
		this.list.replaceChildren(...items);
		this.button.disabled = items.length === 0;
	}

	set total(value: number) {
		this.price.textContent = `${value} синапсов`;
	}
}