import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/Api/LarekApi';

import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { BasketView } from './components/BasketView';

import { Presenter } from './components/Presenter';
import { Counter } from './components/HeaderCounter';

import { API_URL } from './utils/constants';

import { ensureElement } from './utils/utils';

const api = new Api(API_URL);

const larekApi = new LarekApi(api);

const events = new EventEmitter();


const productsModel =
	new Products(events);

const basketModel =
	new Basket(events);

const buyerModel =
	new Buyer(events);


const galleryElement = ensureElement<HTMLElement>('.gallery');;

const modalElement =ensureElement<HTMLElement>('#modal-container');


const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

const orderTemplate = ensureElement<HTMLTemplateElement>('#order');

const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const successTemplate = ensureElement<HTMLTemplateElement>('#success');


const gallery =
	new Gallery(
		galleryElement
	);

const modal =
	new Modal(
		modalElement,
		events
	);


const basketClone =
	basketTemplate.content
		.firstElementChild!
		.cloneNode(true) as HTMLElement;

const basketView =
	new BasketView(
		basketClone,
		events
	);


const headerElement = ensureElement<HTMLElement>('.header');

const counter = new Counter(
	headerElement,
	events
);

const presenter =
	new Presenter(
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
		cardBasketTemplate,
		orderTemplate,
		contactsTemplate,
		successTemplate,
		counter
	);

presenter.init();