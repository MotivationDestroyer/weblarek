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

larekApi.getProducts()
	.then((data) => {
		productsModel.setItems(data.items);
	})
	.catch((error) => {
		console.error('Ошибка при получении каталога:', error);
	});