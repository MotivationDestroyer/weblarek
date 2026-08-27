import { Card } from '../Card';
import { categoryMap } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';

export class CardPreview extends Card {
	protected cardText: HTMLElement;
	protected cardButton: HTMLButtonElement;
	protected categoryElement: HTMLElement;
	protected imageElement: HTMLImageElement;

	constructor(
		container: HTMLElement,
		action: () => void
	) {
		super(container);

		this.cardText = ensureElement<HTMLElement>(
			'.card__text',
			container
		);

		this.cardButton =
			ensureElement<HTMLButtonElement>(
				'.card__button',
				container
			);

		this.categoryElement =
			ensureElement<HTMLElement>(
				'.card__category',
				container
			);

		this.imageElement =
			ensureElement<HTMLImageElement>(
				'.card__image',
				container
			);

		this.cardButton.addEventListener(
			'click',
			action
		);
	}

	set category(value: string) {
		this.categoryElement.textContent = value;

		this.categoryElement.className =
			`card__category ${categoryMap[value as keyof typeof categoryMap]}`;
	}

	set image(value: string) {
		this.setImage(
			this.imageElement,
			value,
			this.title
		);
	}

	set description(value: string) {
		this.cardText.textContent = value;
	}

	set buttonText(value: string) {
		this.cardButton.textContent = value;
	}

	set buttonDisabled(value: boolean) {
		this.cardButton.disabled = value;
	}
}