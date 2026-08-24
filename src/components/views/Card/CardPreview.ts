import {Card} from '../Card';
import { IProduct } from "../../../types";
import { EventEmitter } from '../../base/EventEmitter';

export class CardPreview extends Card {
	protected cardText: HTMLElement;
	protected cardButton: HTMLButtonElement;
	protected category: HTMLElement;
	protected image: HTMLImageElement;
	protected productId = '';

	constructor(
		container: HTMLElement,
		events: EventEmitter
	) {
		super(container, events);

		this.cardText = container.querySelector(
			'.card__text'
		) as HTMLElement;

		this.cardButton = container.querySelector(
			'.card__button'
		) as HTMLButtonElement;

		this.category = container.querySelector(
			'.card__category'
		) as HTMLElement;

		this.image = container.querySelector(
			'.card__image'
		) as HTMLImageElement;

		this.cardButton.addEventListener('click', () => {
			events.emit('card:buy', this.productId);
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

		this.cardText.textContent = data.description;

		this.setImage(
			this.image,
			data.image,
			data.title
		);

		this.cardButton.disabled = data.price === null;

		return this.container;
	}
}