import {
	IBuyer,
	TPayment,
} from '../../../types';

import { EventEmitter } from '../../base/EventEmitter';
import { Form } from '../Form';

export class OrderForm extends Form<IBuyer> {
	protected cardButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;
	protected addressInput: HTMLInputElement;

	constructor(
		container: HTMLElement,
		events: EventEmitter
	) {
		super(container, events);

		this.cardButton = container.querySelector(
			'button[name="card"]'
		) as HTMLButtonElement;

		this.cashButton = container.querySelector(
			'button[name="cash"]'
		) as HTMLButtonElement;

		this.addressInput = container.querySelector(
			'input[name="address"]'
		) as HTMLInputElement;

		this.cardButton.addEventListener(
			'click',
			() => {
				events.emit(
					'order:payment',
					'online' as TPayment
				);
			}
		);

		this.cashButton.addEventListener(
			'click',
			() => {
				events.emit(
					'order:payment',
					'offline' as TPayment
				);
			}
		);

		this.addressInput.addEventListener(
			'input',
			() => {
				events.emit(
					'order:address',
					this.addressInput.value
				);
			}
		);

		this.form.addEventListener(
			'submit',
			(event) => {
				event.preventDefault();

				events.emit('order:submit');
			}
		);
	}

	render(
		data: Partial<IBuyer>
	): HTMLElement {
		if (data.payment) {
			this.cardButton.classList.toggle(
				'button_alt-active',
				data.payment === 'online'
			);

			this.cashButton.classList.toggle(
				'button_alt-active',
				data.payment === 'offline'
			);
		}

		if (data.address !== undefined) {
			this.addressInput.value =
				data.address;
		}

		return this.container;
	}

	setErrors(errors: string): void {
		this.errors.textContent = errors;

		this.submitButton.disabled =
			Boolean(errors);
	}
}