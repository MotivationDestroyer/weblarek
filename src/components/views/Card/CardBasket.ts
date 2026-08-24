import { Card } from '../Card';
import { IProduct } from '../../../types';
import { EventEmitter } from '../../base/EventEmitter';

export class CardBasket extends Card {
	protected index: HTMLElement;
	protected deleteButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		events: EventEmitter
	) {
		super(container, events);

		this.index = container.querySelector(
			'.basket__item-index'
		) as HTMLElement;

		this.deleteButton = container.querySelector(
			'.basket__item-delete'
		) as HTMLButtonElement;

		this.deleteButton.addEventListener('click', () => {
			this.events.emit(
				'basket:remove',
				this.productId
			);
		});
	}

	private productId = '';

	render(data: IProduct): HTMLElement {
		this.productId = data.id;

		this.index.textContent = '1';

		this.title.textContent = data.title;

		this.price.textContent =
			data.price !== null
				? `${data.price} синапсов`
				: 'Бесценно';

		return this.container;
	}

	setIndex(index: number): void {
		this.index.textContent = String(index);
	}
}