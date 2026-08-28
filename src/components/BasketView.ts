import { Component } from './base/Component';
import { EventEmitter } from './base/Events';
import { ensureElement } from '../utils/utils';

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
		protected events: EventEmitter
	) {
		super(container);

		this.list = ensureElement<HTMLElement>(
			'.basket__list',
			container
		);

		this.price = ensureElement<HTMLElement>(
			'.basket__price',
			container
		);

		this.button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		this.button.addEventListener('click', () => {
			this.events.emit('basket:order');
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