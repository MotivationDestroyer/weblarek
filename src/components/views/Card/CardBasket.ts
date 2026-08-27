import { Card } from '../Card';
import { ensureElement } from '../../../utils/utils';

export class CardBasket extends Card {
	protected index: HTMLElement;
	protected deleteButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		action: () => void
	) {
		super(container);

		this.index = ensureElement<HTMLElement>(
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

	setIndex(index: number): void {
		this.index.textContent = String(index);
	}
}