import { IBuyer } from '../../../types';
import { EventEmitter } from '../../base/Events';
import { Form } from '../Form';
import { ensureElement } from '../../../utils/utils';

export class ContactsForm extends Form<IBuyer> {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(
		container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);

		this.emailInput =
			ensureElement<HTMLInputElement>(
				'input[name="email"]',
				container
			);

		this.phoneInput =
			ensureElement<HTMLInputElement>(
				'input[name="phone"]',
				container
			);

		this.emailInput.addEventListener(
			'input',
			() => {
				this.events.emit(
					'contacts:email',
					{
						email: this.emailInput.value
					}
				);
			}
		);

		this.phoneInput.addEventListener(
			'input',
			() => {
				this.events.emit(
					'contacts:phone',
					{
						phone: this.phoneInput.value
					}
				);
			}
		);

		this.form.addEventListener(
			'submit',
			(event) => {
				event.preventDefault();

				this.events.emit(
					'contacts:submit'
				);
			}
		);
	}

	set email(value: string) {
		this.emailInput.value = value;
	}

	set phone(value: string) {
		this.phoneInput.value = value;
	}

	setErrors(errors: string): void {
		this.errors.textContent = errors;
		this.submitButton.disabled =
			Boolean(errors);
	}
}