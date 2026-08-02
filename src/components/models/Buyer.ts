import { IBuyer, TBuyerErrors } from "../../types";

export class Buyer {
	private buyer: IBuyer = {
		payment: 'online',
		email: '',
		phone: '',
		address: '',
	};

	setBuyer(data: Partial<IBuyer>): void {
		this.buyer = {
			...this.buyer,
			...data,
		};
	}

	getBuyer(): IBuyer {
		return this.buyer;
	}

	clear(): void {
		this.buyer = {
			payment: 'online',
			email: '',
			phone: '',
			address: '',
		};
	}

	validate(): TBuyerErrors {
		const errors: TBuyerErrors = {};

		if (!this.buyer.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		if (!this.buyer.address.trim()) {
			errors.address = 'Введите адрес';
		}

		if (!this.buyer.email.trim()) {
			errors.email = 'Введите email';
		}

		if (!this.buyer.phone.trim()) {
			errors.phone = 'Введите телефон';
		}

		return errors;
	}
}