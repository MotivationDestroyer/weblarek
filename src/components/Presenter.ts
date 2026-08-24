import { IProduct } from '../types';
import { EventEmitter } from './base/EventEmitter';
import { LarekApi } from './Api/LarekApi';

import { Products } from './models/Products';
import { Basket } from './models/Basket';
import { Buyer } from './models/Buyer';

import { CardCatalog } from './views/Card/CardCatalog';
import { CardPreview } from './views/Card/CardPreview';
import { CardBasket } from './views/Card/CardBasket';

import { Gallery } from './views/Gallery';
import { Modal } from './views/Modal';
import { BasketView } from './BasketView';

export class Presenter {
	constructor(
		private events: EventEmitter,
		private api: LarekApi,
		private productsModel: Products,
		private basketModel: Basket,
		private buyerModel: Buyer,
		private gallery: Gallery,
		private modal: Modal,
		private basketView: BasketView,
		private cardCatalogTemplate: HTMLTemplateElement,
		private cardPreviewTemplate: HTMLTemplateElement,
		private cardBasketTemplate: HTMLTemplateElement
	) {
		this.events.on('card:select', (id) => {
			this.showPreview(id as string);
		});

		this.events.on('modal:close', () => {
			this.modal.close();
		});

		this.events.on('card:buy', (id) => {
			const product = this.productsModel.getItem(id as string);

			if (!product) {
				return;
			}

            this.basketModel.addItem(product);

            this.modal.close();

            this.updateBasket();

            this.events.emit('basket:changed');
		});

		this.events.on('basket:open', () => {
			this.updateBasket();

			this.modal.render(
				this.basketView.render()
			);

			this.modal.open();
		});

		this.events.on('basket:remove', (id) => {
			this.basketModel.removeItem(id as string);

            this.updateBasket();

            this.events.emit('basket:changed');
		});
	}

	init(): void {
		this.loadProducts();
		this.updateBasket();
	}

	private loadProducts(): void {
		this.api
			.getProducts()
			.then((data) => {
				this.productsModel.setItems(data.items);

				this.renderCatalog(data.items);
			})
			.catch((error) => {
				console.error(
					'Ошибка при загрузке товаров:',
					error
				);
			});
	}

	private renderCatalog(items: IProduct[]): void {
		const cards = items.map((item) => {
			const clone =
				this.cardCatalogTemplate.content
					.firstElementChild!
					.cloneNode(true) as HTMLElement;

			const card = new CardCatalog(
				clone,
				this.events
			);

			return card.render(item);
		});

		this.gallery.render({
			items: cards,
		});
	}

	private showPreview(id: string): void {
		const product = this.productsModel.getItem(id);

		if (!product) {
			return;
		}

		const clone =
			this.cardPreviewTemplate.content
				.firstElementChild!
				.cloneNode(true) as HTMLElement;

		const card = new CardPreview(
			clone,
			this.events
		);

		this.modal.render(
			card.render(product)
		);

		this.modal.open();
	}

	private updateBasket(): void {
		const items = this.basketModel.getItems();

		const cards = items.map((item, index) => {
			const clone =
				this.cardBasketTemplate.content
					.firstElementChild!
					.cloneNode(true) as HTMLElement;

			const card = new CardBasket(
				clone,
				this.events
			);

			const element = card.render(item);

			card.setIndex(index + 1);

			return element;
		});

		this.basketView.items = cards;
		this.basketView.total = this.basketModel.getTotal();
	}
}