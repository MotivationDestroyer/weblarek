import './scss/styles.scss';

import { Api } from './components/base/Api';
import { LarekApi } from './components/Api/LarekApi';
import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { API_URL } from './utils/constants';


const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();

larekApi
	.getProducts()
	.then((data) => {
		productsModel.setItems(data.items);

		console.log('Каталог товаров:', productsModel.getItems());

		console.log(
			'Товар по id:',
			productsModel.getItem(data.items[0].id)
		);

		productsModel.setPreview(data.items[0].id);

		console.log(
			'Товар для подробного просмотра:',
			productsModel.getPreview()
		);

		basketModel.addItem(data.items[0]);
		basketModel.addItem(data.items[1]);

		console.log('Товары в корзине:', basketModel.getItems());

		console.log(
			'Общая стоимость товаров:',
			basketModel.getTotal()
		);

		console.log(
			'Количество товаров:',
			basketModel.getCount()
		);

		console.log(
			'Первый товар находится в корзине:',
			basketModel.hasItem(data.items[0].id)
		);

		basketModel.removeItem(data.items[0].id);

		console.log(
			'Корзина после удаления товара:',
			basketModel.getItems()
		);

		console.log(
			'Количество товаров после удаления:',
			basketModel.getCount()
		);

		buyerModel.setBuyer({
			payment: 'online',
			address: 'Муром',
			email: 'test@test.ru',
			phone: '+79999999999',
		});

		console.log('Данные покупателя:', buyerModel.getBuyer());
		console.log('Ошибки валидации:', buyerModel.validate());
		basketModel.clear();

		console.log(
			'Корзина после очистки:',
			basketModel.getItems()
		);
	})
	.catch((error) => {
		console.error('Ошибка при получении каталога:', error);
	});