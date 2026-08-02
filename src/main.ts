import './scss/styles.scss';

import { Api } from './components/base/Api';
import { LarekApi } from './components/Api/LarekApi';
import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Order } from './components/models/Order';
import { API_URL } from './utils/constants';


const api = new Api(API_URL);

const larekApi = new LarekApi(api);

const productsModel = new Products();
const basketModel = new Basket();
const orderModel = new Order();

larekApi
    .getProducts()
    .then((data) => {
        productsModel.setItems(data.items);

        console.log('Каталог товаров:', productsModel.getItems());

        basketModel.addItem(data.items[0]);
        basketModel.addItem(data.items[1]);

        console.log('Корзина:', basketModel.getItems());
        console.log('Общая стоимость:', basketModel.getTotal());

        orderModel.setOrder({
            payment: 'тестовая оплата',
            address: 'Муром',
            email: 'test@test.ru',
            phone: '+79999999999',
            items: basketModel.getItems().map(item => item.id),
            total: basketModel.getTotal(),
        });

        console.log('Заказ:', orderModel.getOrder());
    })
    .catch(console.error);