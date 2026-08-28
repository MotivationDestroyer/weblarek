import { IProduct } from '../../../types';
import { Card } from '../Card';
import { categoryMap } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';

export interface ICardCatalog extends IProduct {
	image: string;
}

export class CardCatalog extends Card<ICardCatalog> {
	protected categoryElement: HTMLElement;
	protected imageElement: HTMLImageElement;

	constructor(
		container: HTMLElement,
		action: () => void
	) {
		super(container);

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

		this.container.addEventListener(
			'click',
			action
		);
	}

	set category(value: string) {
		this.categoryElement.textContent = value;

		this.categoryElement.className =
			`card__category ${
				categoryMap[
					value as keyof typeof categoryMap
				]
			}`;
	}

	set image(value: string) {
		this.setImage(
			this.imageElement,
			value,
			this.title
		);
	}
}