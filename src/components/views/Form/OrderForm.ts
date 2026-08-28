import { IBuyer, TPayment } from '../../../types';
import { EventEmitter } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { Form } from '../Form';


export class OrderForm extends Form<IBuyer> {
	protected addressInput: HTMLInputElement;
	protected onlineButton: HTMLButtonElement;
	protected offlineButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);

		this.addressInput =
			ensureElement<HTMLInputElement>(
				'input[name="address"]',
				container
			);

		this.onlineButton =
			ensureElement<HTMLButtonElement>(
				'button[name="card"]',
				container
			);

		this.offlineButton =
			ensureElement<HTMLButtonElement>(
				'button[name="cash"]',
				container
			);

		this.onlineButton.addEventListener(
			'click',
			() => {
				this.events.emit(
					'order:payment',
					{
						payment: 'online'
					}
				);
			}
		);

		this.offlineButton.addEventListener(
			'click',
			() => {
				this.events.emit(
					'order:payment',
					{
						payment: 'offline'
					}
				);
			}
		);

		this.addressInput.addEventListener(
			'input',
			() => {
				this.events.emit(
					'order:address',
					{
						address:
							this.addressInput.value
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
		this.onlineButton.classList.toggle(
			'button_alt',
			value !== 'online'
		);

		this.offlineButton.classList.toggle(
			'button_alt',
			value !== 'offline'
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
