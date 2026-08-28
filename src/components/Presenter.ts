import {
	IProduct,
	TPayment
} from '../types';

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

import { OrderForm } from './views/Form/OrderForm';
import { ContactsForm } from './views/Form/ContactsForm';
import { Success } from './views/Success';


export class Presenter {
	private cardPreview: CardPreview;
	private orderForm: OrderForm;
	private contactsForm: ContactsForm;
	private success: Success;

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
		private cardBasketTemplate: HTMLTemplateElement,
		private orderTemplate: HTMLTemplateElement,
		private contactsTemplate: HTMLTemplateElement,
		private successTemplate: HTMLTemplateElement
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
					{
						id: product.id
					}
				);
			}
		);


		const orderClone =
			this.orderTemplate.content
				.firstElementChild!
				.cloneNode(true) as HTMLElement;

		this.orderForm = new OrderForm(
			orderClone,
			this.events
		);


		const contactsClone =
			this.contactsTemplate.content
				.firstElementChild!
				.cloneNode(true) as HTMLElement;

		this.contactsForm = new ContactsForm(
			contactsClone,
			this.events
		);


		const successClone =
			this.successTemplate.content
				.firstElementChild!
				.cloneNode(true) as HTMLElement;

		this.success = new Success(
			successClone,
			this.events
		);

		this.events.on<IProduct[]>(
			'products:changed',
			(items) => {
				this.renderCatalog(items);
			}
		);


		this.events.on<{ id: string }>(
			'card:select',
			({ id }) => {
				this.productsModel.setPreview(id);
			}
		);

		this.events.on<IProduct>(
			'preview:changed',
			(product) => {
				this.showPreview(product.id);
			}
		);

		this.events.on<{ id: string }>(
			'card:action',
			({ id }) => {
				const product =
					this.productsModel.getItem(id);

				if (!product) {
					return;
				}

				if (
					this.basketModel.hasItem(id)
				) {
					this.basketModel.removeItem(id);
				} else {
					this.basketModel.addItem(product);
				}

				this.modal.close();
			}
		);


		this.events.on(
			'modal:close',
			() => {
				this.modal.close();
			}
		);


		this.events.on(
			'basket:changed',
			() => {
				this.updateBasket();
			}
		);

		this.events.on(
			'basket:open',
			() => {
				this.modal.render({
					content:
						this.basketView.render()
				});

				this.modal.open();
			}
		);

		this.events.on<{ id: string }>(
			'basket:remove',
			({ id }) => {
				this.basketModel.removeItem(id);
			}
		);

		this.events.on(
			'basket:order',
			() => {
				this.openOrderForm();
			}
		);


		this.events.on<{
			payment: TPayment;
			email: string;
			phone: string;
			address: string;
		}>(
			'buyer:changed',
			(buyer) => {

				this.orderForm.render(
					buyer
				);

				this.contactsForm.render(
					buyer
				);

				this.validateOrder();
				this.validateContacts();
			}
		);


		this.events.on<{
			payment: TPayment;
		}>(
			'order:payment',
			({ payment }) => {

				this.buyerModel.setBuyer({
					payment
				});
			}
		);

		this.events.on<{
			address: string;
		}>(
			'order:address',
			({ address }) => {

				this.buyerModel.setBuyer({
					address
				});
			}
		);

		this.events.on(
			'order:submit',
			() => {

				const errors =
					this.buyerModel.validate();

				const orderErrors: string[] = [];

				if (errors.payment) {
					orderErrors.push(
						errors.payment
					);
				}

				if (errors.address) {
					orderErrors.push(
						errors.address
					);
				}

				if (
					orderErrors.length > 0
				) {
					this.orderForm.setErrors(
						orderErrors.join(', ')
					);

					return;
				}

				this.orderForm.setErrors(
					''
				);

				this.modal.render({
					content:
						this.contactsForm.render(
							this.buyerModel.getBuyer()
						)
				});
			}
		);


		this.events.on<{
			email: string;
		}>(
			'contacts:email',
			({ email }) => {

				this.buyerModel.setBuyer({
					email
				});
			}
		);

		this.events.on<{
			phone: string;
		}>(
			'contacts:phone',
			({ phone }) => {

				this.buyerModel.setBuyer({
					phone
				});
			}
		);

		this.events.on(
			'contacts:submit',
			() => {
				this.submitOrder();
			}
		);

		this.events.on(
			'success:close',
			() => {
				this.modal.close();
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

		const cards =
			items.map((item) => {

				const clone =
					this.cardCatalogTemplate.content
						.firstElementChild!
						.cloneNode(true) as HTMLElement;

				const card =
					new CardCatalog(
						clone,
						() => {

							this.events.emit(
								'card:select',
								{
									id: item.id
								}
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

		const buttonText =
			this.basketModel.hasItem(
				product.id
			)
				? 'Удалить из корзины'
				: 'В корзину';

		const buttonDisabled =
			product.price === null;

		this.modal.render({
			content:
				this.cardPreview.render({
					...product,
					buttonText,
					buttonDisabled
				})
		});

		this.modal.open();
	}

	private updateBasket(): void {

		const items =
			this.basketModel.getItems();

		const cards =
			items.map(
				(item, index) => {

					const clone =
						this.cardBasketTemplate.content
							.firstElementChild!
							.cloneNode(true) as HTMLElement;

					const card =
						new CardBasket(
							clone,
							() => {

								this.events.emit(
									'basket:remove',
									{
										id: item.id
									}
								);

							}
						);

					return card.render({
						...item,
						index: index + 1
					});
				}
			);

		this.basketView.render({
			items: cards,
			total:
				this.basketModel.getTotal()
		});
	}


	private openOrderForm(): void {

		this.modal.render({
			content:
				this.orderForm.render(
					this.buyerModel.getBuyer()
				)
		});

		this.validateOrder();

		this.modal.open();
	}


	private validateOrder(): void {

		const errors =
			this.buyerModel.validate();

		const orderErrors: string[] = [];

		if (errors.payment) {
			orderErrors.push(
				errors.payment
			);
		}

		if (errors.address) {
			orderErrors.push(
				errors.address
			);
		}

		this.orderForm.setErrors(
			orderErrors.join(', ')
		);
	}


	private validateContacts(): void {

		const errors =
			this.buyerModel.validate();

		const contactErrors: string[] = [];

		if (errors.email) {
			contactErrors.push(
				errors.email
			);
		}

		if (errors.phone) {
			contactErrors.push(
				errors.phone
			);
		}

		this.contactsForm.setErrors(
			contactErrors.join(', ')
		);
	}

	private submitOrder(): void {

		const errors =
			this.buyerModel.validate();

		if (
			Object.keys(errors).length > 0
		) {
			this.validateContacts();
			return;
		}

		const buyer =
			this.buyerModel.getBuyer();

		const order = {
			...buyer,

			items:
				this.basketModel
					.getItems()
					.map(
						(item) => item.id
					),

			total:
				this.basketModel.getTotal()
		};

		console.log(
			'Отправляем заказ:',
			order
		);

		this.api
			.orderProducts(order)
			.then((result) => {

				this.modal.render({
					content:
						this.success.render({
							total: result.total
						})
				});

				this.modal.open();

				this.basketModel.clear();
				this.buyerModel.clear();

			})
			.catch((error) => {

				console.error(
					'Ошибка при оформлении заказа:',
					error
				);

			});
	}
}
