import {
	IBuyer,
	IOrder,
	IProduct,
	TPayment
} from '../types';

import { EventEmitter } from './base/Events';
import { LarekApi } from './Api/LarekApi';

import { Products } from './models/Products';
import { Basket } from './models/Basket';
import { Buyer } from './models/Buyer';

import {
	CardCatalog,
	ICardCatalog
} from './views/Card/CardCatalog';

import {
	CardPreview,
	ICardPreview
} from './views/Card/CardPreview';

import {
	CardBasket,
	ICardBasket
} from './views/Card/CardBasket';

import { Gallery } from './views/Gallery';
import { Modal } from './views/Modal';
import { BasketView } from './BasketView';

import { OrderForm } from './views/Form/OrderForm';
import { ContactsForm } from './views/Form/ContactsForm';
import { Success } from './views/Success';
import { Counter } from './HeaderCounter';

import { CDN_URL } from '../utils/constants';

import { cloneTemplate } from '../utils/utils';

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
		private successTemplate: HTMLTemplateElement,
		private counter: Counter
	) {

		const previewClone = cloneTemplate<HTMLElement>(this.cardPreviewTemplate)

		this.cardPreview = new CardPreview(
			previewClone,
			this.events
		);
		const orderClone = cloneTemplate<HTMLFormElement>(this.orderTemplate);

		this.orderForm = new OrderForm(
			orderClone,
			this.events
		);

		const contactsClone = cloneTemplate<HTMLFormElement>(this.contactsTemplate);

		this.contactsForm =
			new ContactsForm(
				contactsClone,
				this.events
			);


		const successClone = cloneTemplate<HTMLElement>(this.successTemplate);

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

		this.events.on(
			'card:action',
			() => {
				const product =
					this.productsModel.getPreview();

				if (!product) {
					return;
				}

				if (this.basketModel.hasItem(product.id)) {
					this.basketModel.removeItem(product.id);
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

		this.events.on<IBuyer>(
			'buyer:changed',
			(buyer) => {
				this.orderForm.render({
					...buyer,
					error: ''
				});

				this.contactsForm.render({
					...buyer,
					error: ''
				});

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

        const orderErrors: string[] =
            [];

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

        if (orderErrors.length > 0) {
            this.orderForm.render({
                ...this.buyerModel.getBuyer(),
                error: orderErrors.join(', ')
            });

            return;
        }

        this.modal.render({
            content:
                this.contactsForm.render({
                    ...this.buyerModel.getBuyer(),
                    error: ''
                })
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
		this.events.on(
		'basket:changed',
		() => {
			this.updateBasket();

			this.counter.render({
				counter: this.basketModel.getCount()
			});
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
		const cards = items.map(
			(item) => {
				const clone =
						cloneTemplate<HTMLElement>(
							this.cardCatalogTemplate
						);

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

				const cardData:
					ICardCatalog = {
					...item,

					image: {
						src: CDN_URL + item.image,
						alt: item.title
					}
				};

				return card.render(
					cardData
				);
			}
		);

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

		const previewData:
			ICardPreview = {
			...product,

			image: {
				src: CDN_URL + product.image,
				alt: product.title
			},

			buttonText:
            product.price === null
                ? 'Недоступно'
                : this.basketModel.hasItem(product.id)
                    ? 'Удалить из корзины'
                    : 'В корзину',
        

			buttonDisabled:
				product.price === null
		};

		this.modal.render({
			content:
				this.cardPreview.render(
					previewData
				)
		});

		this.modal.open();
	}


	private updateBasket(): void {
		const items =
			this.basketModel.getItems();

		const cards = items.map(
			(item, index) => {
				const clone =
						cloneTemplate<HTMLElement>(
							this.cardBasketTemplate
						);

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

				const cardData:
					ICardBasket = {
					...item,
					index: index + 1
				};

				return card.render(
					cardData
				);
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
            this.orderForm.render({
                ...this.buyerModel.getBuyer(),
                error: ''
            })
		});

		this.validateOrder();

		this.modal.open();
	}

	private validateOrder(): void {
		const errors =
			this.buyerModel.validate();

		const orderErrors: string[] =
			[];

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

		this.orderForm.render({
			...this.buyerModel.getBuyer(),
			error: orderErrors.join(', ')
		});
	}

	private validateContacts(): void {
		const errors =
			this.buyerModel.validate();

		const contactErrors: string[] =
			[];

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

		this.contactsForm.render({
			...this.buyerModel.getBuyer(),
			error: contactErrors.join(', ')
		});
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

		const order: IOrder = {
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

		this.api
			.orderProducts(order)
			.then((result) => {
				this.modal.render({
					content:
						this.success.render({
							total:
								result.total
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
