import { Component } from './base/Component';
import { EventEmitter } from './base/Events';
import { ensureElement } from '../utils/utils';

interface ICounter {
	counter: number;
}

export class Counter extends Component<ICounter> {
	protected basketButton: HTMLButtonElement;
	protected basketCounter: HTMLElement;

	constructor(
		container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);

		this.basketButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);

		this.basketCounter = ensureElement<HTMLElement>(
			'.header__basket-counter',
			container
		);

		this.basketButton.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.basketCounter.textContent = String(value);
	}
}