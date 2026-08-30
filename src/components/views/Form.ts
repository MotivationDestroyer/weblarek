import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IForm {
	error: string;
}

export abstract class Form<T extends IForm>
	extends Component<T> {

	protected submitButton: HTMLButtonElement;
	protected errors: HTMLElement;

	constructor(
		protected container: HTMLFormElement
	) {
		super(container);

		this.submitButton =
			ensureElement<HTMLButtonElement>(
				'button[type="submit"]',
				container
			);

		this.errors =
			ensureElement<HTMLElement>(
				'.form__errors',
				container
			);
	}

	set error(value: string) {
		this.errors.textContent = value;

		this.submitButton.disabled =
			Boolean(value);
	}
}