import { Component } from '../base/Component';
import { EventEmitter } from '../base/EventEmitter';

export abstract class Form<T> extends Component<T> {
	protected form: HTMLFormElement;
	protected submitButton: HTMLButtonElement;
	protected errors: HTMLElement;

	constructor(
		container: HTMLElement,
		events: EventEmitter
	) {
		super(container, events);

		this.form = container.querySelector(
			'form'
		) as HTMLFormElement;

		this.submitButton = this.form.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement;

		this.errors = this.form.querySelector(
			'.form__errors'
		) as HTMLElement;
	}
}