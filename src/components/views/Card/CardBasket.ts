import { IProduct } from '../../../types';
import { Card } from '../Card';
import { ensureElement } from '../../../utils/utils';

export interface ICardBasket
	extends IProduct {
	index: number;
}

export class CardBasket
	extends Card<ICardBasket> {
	protected indexElement: HTMLElement;
	protected deleteButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		action: () => void
	) {
		super(container);

		this.indexElement =
			ensureElement<HTMLElement>(
				'.basket__item-index',
				container
			);

		this.deleteButton =
			ensureElement<HTMLButtonElement>(
				'.basket__item-delete',
				container
			);

		this.deleteButton.addEventListener(
			'click',
			action
		);
	}

	set index(value: number) {
		this.indexElement.textContent =
			String(value);
	}
}
