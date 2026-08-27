import { IBuyer } from '../../../types';
import { EventEmitter } from '../../base/Events';
import { Form } from '../Form';

export class ContactsForm extends Form<IBuyer> {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(
		container: HTMLElement,
		events: EventEmitter
	) {
		super(container);

		this.emailInput = container.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;

		this.phoneInput = container.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;

		this.emailInput.addEventListener(
			'input',
			() => {
				events.emit(
					'contacts:email',
					{ email: this.emailInput.value }
				);
			}
		);

		this.phoneInput.addEventListener(
			'input',
			() => {
				events.emit(
					'contacts:phone',
					{ phone: this.phoneInput.value }
				);
			}
		);

		this.form.addEventListener(
			'submit',
			(event) => {
				event.preventDefault();

				events.emit(
					'contacts:submit'
				);
			}
		);
	}

	render(
		data: Partial<IBuyer>
	): HTMLElement {
		if (data.email !== undefined) {
			this.emailInput.value =
				data.email;
		}

		if (data.phone !== undefined) {
			this.phoneInput.value =
				data.phone;
		}

		return this.container;
	}

	setErrors(errors: string): void {
		this.errors.textContent = errors;

		this.submitButton.disabled =
			Boolean(errors);
	}
}