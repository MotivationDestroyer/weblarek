import {Card} from '../Card';
import { IProduct } from "../../../types";

export class CardCatalog extends Card {
	render(data: IProduct): HTMLElement {
		this.category.textContent = data.category;
		this.title.textContent = data.title;
		this.price.textContent = data.price !== null
			? `${data.price} синапсов`
			: 'Бесценно';

		this.setImage(this.image, data.image, data.title);

		return this.container;
	}
}