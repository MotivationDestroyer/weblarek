import { EventEmitter } from './EventEmitter';

export abstract class Component<T> {
	protected constructor(
		protected readonly container: HTMLElement,
		protected readonly events: EventEmitter
	) {}

	protected setImage(
		element: HTMLImageElement,
		src: string,
		alt?: string
	): void {
		if (element) {
			element.src = src;

			if (alt) {
				element.alt = alt;
			}
		}
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});

		return this.container;
	}
}