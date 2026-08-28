import { IBuyer, TPayment } from '../../../types';
import { EventEmitter } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { Form } from '../Form';

export class OrderForm extends Form<IBuyer> {
	protected paymentButtons: HTMLButtonElement[];
	protected addressInput: HTMLInputElement;

	constructor(
		container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);

		this.paymentButtons = [
			ensureElement<HTMLButtonElement>(
				'button[name="card"]',
				container
			),
			ensureElement<HTMLButtonElement>(
				'button[name="cash"]',
				container
			),
		];

		this.addressInput =
			ensureElement<HTMLInputElement>(
				'input[name="address"]',
				container
			);

		this.paymentButtons.forEach((button) => {
			button.addEventListener(
				'click',
				() => {
					const payment: TPayment =
						button.name === 'card'
							? 'online'
							: 'offline';

					this.events.emit(
						'order:payment',
						{ payment }
					);
				}
			);
		});

		this.addressInput.addEventListener(
			'input',
			() => {
				this.events.emit(
					'order:address',
					{
						address:
							this.addressInput.value,
					}
				);
			}
		);

		this.form.addEventListener(
			'submit',
			(event) => {
				event.preventDefault();

				this.events.emit(
					'order:submit'
				);
			}
		);
	}

	set payment(value: TPayment) {
		this.paymentButtons.forEach(
			(button) => {
				const active =
					(value === 'online' &&
						button.name === 'card') ||
					(value === 'offline' &&
						button.name === 'cash');

				button.classList.toggle(
					'button_alt-active',
					active
				);
			}
		);
	}

	set address(value: string) {
		this.addressInput.value = value;
	}

	setErrors(errors: string): void {
		this.errors.textContent = errors;
		this.submitButton.disabled =
			Boolean(errors);
	}
}
