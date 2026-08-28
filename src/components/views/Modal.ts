import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected contentElement: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);

		this.contentElement =
			ensureElement<HTMLElement>(
				'.modal__content',
				container
			);

		this.closeButton =
			ensureElement<HTMLButtonElement>(
				'.modal__close',
				container
			);

		// Закрытие по крестику
		this.closeButton.addEventListener(
			'click',
			() => {
				this.events.emit('modal:close');
			}
		);

		// Закрытие по клику на оверлей
		this.container.addEventListener(
			'click',
			(event) => {
				if (
					event.target === this.container
				) {
					this.events.emit(
						'modal:close'
					);
				}
			}
		);
	}

	set content(value: HTMLElement) {
		this.contentElement.replaceChildren(
			value
		);
	}

	open(): void {
		this.container.classList.add(
			'modal_active'
		);
	}

	close(): void {
		this.container.classList.remove(
			'modal_active'
		);
	}
}