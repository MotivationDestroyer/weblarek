import {
	IBuyer,
	TBuyerErrors,
} from '../../types';

import { EventEmitter } from '../base/Events';

export class Buyer {
	private buyer: IBuyer = {
		payment: null,
		email: '',
		phone: '',
		address: '',
	};

	constructor(private events: EventEmitter) {}

	setBuyer(data: Partial<IBuyer>): void {
		this.buyer = {
			...this.buyer,
			...data,
		};

		this.events.emit(
			'buyer:changed',
			this.getBuyer()
		);
	}

	getBuyer(): IBuyer {
		return this.buyer;
	}

	clear(): void {
		this.buyer = {
			payment: null,
			email: '',
			phone: '',
			address: '',
		};

		this.events.emit(
			'buyer:changed',
			this.getBuyer()
		);
	}

	validate(): TBuyerErrors {
		const errors: TBuyerErrors = {};

		if (!this.buyer.payment) {
			errors.payment =
				'Выберите способ оплаты';
		}

		if (!this.buyer.address.trim()) {
			errors.address =
				'Введите адрес';
		}

		if (!this.buyer.email.trim()) {
			errors.email =
				'Введите email';
		}

		if (!this.buyer.phone.trim()) {
			errors.phone =
				'Введите телефон';
		}

		return errors;
	}
}