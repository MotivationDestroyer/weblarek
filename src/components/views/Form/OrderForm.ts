import { TPayment } from '../../../types';
import { EventEmitter } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { Form, IForm } from '../Form';

interface IOrderForm extends IForm {
	payment: TPayment | null;
	address: string;
}

export class OrderForm extends Form<IOrderForm> {
	protected addressInput: HTMLInputElement;
	protected onlineButton: HTMLButtonElement;
	protected offlineButton: HTMLButtonElement;

	constructor(
		container: HTMLFormElement,
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

		this.container.addEventListener(
			'submit',
			(event) => {
				event.preventDefault();

				this.events.emit(
					'order:submit'
				);
			}
		);
	}

	set payment(value: TPayment | null) {
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
}
