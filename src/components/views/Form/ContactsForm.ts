import { EventEmitter } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { Form, IForm } from '../Form';

interface IContactsForm extends IForm {
	email: string;
	phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(
		container: HTMLFormElement,
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

		this.container.addEventListener(
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
}