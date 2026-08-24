import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/EventEmitter';
import { LarekApi } from './components/Api/LarekApi';

import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';

import { BasketView } from './components/BasketView';

import { Presenter } from './components/Presenter';

import { API_URL } from './utils/constants';


const api = new Api(API_URL);
const larekApi = new LarekApi(api);


const events = new EventEmitter();


const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);


const galleryElement = document.querySelector(
	'.gallery'
) as HTMLElement;

const modalElement = document.querySelector(
	'#modal-container'
) as HTMLElement;


const cardCatalogTemplate =
	document.querySelector(
		'#card-catalog'
	) as HTMLTemplateElement;

const cardPreviewTemplate =
	document.querySelector(
		'#card-preview'
	) as HTMLTemplateElement;

const cardBasketTemplate =
	document.querySelector(
		'#card-basket'
	) as HTMLTemplateElement;

const basketTemplate =
	document.querySelector(
		'#basket'
	) as HTMLTemplateElement;


const gallery = new Gallery(
	galleryElement,
	events
);

const modal = new Modal(
	modalElement,
	events
);


const basketClone =
	basketTemplate.content
		.firstElementChild!
		.cloneNode(true) as HTMLElement;

const basketView = new BasketView(
	basketClone,
	events
);


const basketButton =
	document.querySelector(
		'.header__basket'
	) as HTMLButtonElement;

const basketCounter =
	document.querySelector(
		'.header__basket-counter'
	) as HTMLElement;

basketButton.addEventListener('click', () => {
	events.emit('basket:open');
});

events.on('basket:changed', () => {
	basketCounter.textContent =
		String(basketModel.getCount());
});


const presenter = new Presenter(
	events,
	larekApi,
	productsModel,
	basketModel,
	buyerModel,
	gallery,
	modal,
	basketView,
	cardCatalogTemplate,
	cardPreviewTemplate,
	cardBasketTemplate
);


presenter.init();