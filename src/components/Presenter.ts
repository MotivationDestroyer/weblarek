import { IProduct } from '../types';
import { EventEmitter } from './base/Events';
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
	private cardPreview: CardPreview;

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
		const previewClone =
			this.cardPreviewTemplate.content
				.firstElementChild!
				.cloneNode(true) as HTMLElement;

		this.cardPreview = new CardPreview(
			previewClone,
			() => {
				const product =
					this.productsModel.getPreview();

				if (!product) {
					return;
				}

				this.events.emit(
					'card:action',
					{ id: product.id }
				);
			}
		);

		// Выбор карточки товара
		this.events.on<{ id: string }>(
			'card:select',
			({ id }) => {
				this.productsModel.setPreview(id);
				this.showPreview(id);
			}
		);

		// Действие с товаром в предпросмотре
		this.events.on<{ id: string }>(
			'card:action',
			({ id }) => {
				const product =
					this.productsModel.getItem(id);

				if (!product) {
					return;
				}

				if (this.basketModel.hasItem(id)) {
					this.basketModel.removeItem(id);
				} else {
					this.basketModel.addItem(product);
				}

				this.modal.close();
			}
		);

		// Закрытие модального окна
		this.events.on(
			'modal:close',
			() => {
				this.modal.close();
			}
		);

		// Корзина изменилась — обновляем представление
		this.events.on(
			'basket:changed',
			() => {
				this.updateBasket();
			}
		);

		// Открытие корзины
		this.events.on(
			'basket:open',
			() => {
				this.modal.render(
					this.basketView.render()
				);

				this.modal.open();
			}
		);

		// Удаление товара из корзины
		this.events.on<{ id: string }>(
			'basket:remove',
			({ id }) => {
				this.basketModel.removeItem(id);
			}
		);
	}

	init(): void {
		this.loadProducts();
		this.updateBasket();
	}

	private loadProducts(): void {
		this.api
			.getProducts()
			.then((data) => {
				this.productsModel.setItems(
					data.items
				);

				this.renderCatalog(
					data.items
				);
			})
			.catch((error) => {
				console.error(
					'Ошибка при загрузке товаров:',
					error
				);
			});
	}

	private renderCatalog(
		items: IProduct[]
	): void {
		const cards = items.map((item) => {
			const clone =
				this.cardCatalogTemplate.content
					.firstElementChild!
					.cloneNode(true) as HTMLElement;

			const card = new CardCatalog(
				clone,
				() => {
					this.events.emit(
						'card:select',
						{ id: item.id }
					);
				}
			);

			return card.render(item);
		});

		this.gallery.render({
			items: cards
		});
	}

	private showPreview(
		id: string
	): void {
		const product =
			this.productsModel.getItem(id);

		if (!product) {
			return;
		}

		this.cardPreview.buttonText =
			this.basketModel.hasItem(product.id)
				? 'Удалить из корзины'
				: 'В корзину';

		this.cardPreview.buttonDisabled =
			product.price === null;

		this.modal.render(
			this.cardPreview.render(product)
		);

		this.modal.open();
	}

	private updateBasket(): void {
		const items =
			this.basketModel.getItems();

		const cards = items.map(
			(item, index) => {
				const clone =
					this.cardBasketTemplate.content
						.firstElementChild!
						.cloneNode(true) as HTMLElement;

				const card = new CardBasket(
					clone,
					() => {
						this.events.emit(
							'basket:remove',
							{ id: item.id }
						);
					}
				);

				const element =
					card.render(item);

				card.setIndex(index + 1);

				return element;
			}
		);

		this.basketView.render({
			items: cards,
			total: this.basketModel.getTotal()
		});
	}
}