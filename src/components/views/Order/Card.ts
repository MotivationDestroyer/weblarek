import { IProduct } from '../../../types';
import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/EventEmitter';

export abstract class Card extends Component<IProduct> {
	protected title: HTMLElement;
	protected price: HTMLElement;

	constructor(
		container: HTMLElement,
		events: EventEmitter
	) {
		super(container, events);

		this.title = container.querySelector(
			'.card__title'
		) as HTMLElement;

		this.price = container.querySelector(
			'.card__price'
		) as HTMLElement;
	}
}