import { Component } from './base/Component';

interface ICounter {
	counter: number;
}

export class Counter extends Component<ICounter> {
	protected basketButton: HTMLButtonElement;
	protected basketCounter: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this.basketButton = container.querySelector(
			'.header__basket'
		) as HTMLButtonElement;

		this.basketCounter = container.querySelector(
			'.header__basket-counter'
		) as HTMLElement;
	}

	set counter(value: number) {
		this.basketCounter.textContent = String(value);
	}

	get button(): HTMLButtonElement {
		return this.basketButton;
	}
}