import { IProduct } from '../../../types';
import { EventEmitter } from '../../base/EventEmitter';
import { Card } from '../Card';

export class CardCatalog extends Card {
	protected category: HTMLElement;
	protected image: HTMLImageElement;
	protected productId = '';

	constructor(
		container: HTMLElement,
		events: EventEmitter
	) {
		super(container, events);

		this.category = container.querySelector(
			'.card__category'
		) as HTMLElement;

		this.image = container.querySelector(
			'.card__image'
		) as HTMLImageElement;

		this.container.addEventListener('click', () => {
			events.emit('card:select', this.productId);
		});
	}

	render(data: IProduct): HTMLElement {
		this.productId = data.id;

		this.category.textContent = data.category;
		this.title.textContent = data.title;

		this.price.textContent =
			data.price !== null
				? `${data.price} синапсов`
				: 'Бесценно';

		this.setImage(
			this.image,
			data.image,
			data.title
		);

		return this.container;
	}
}