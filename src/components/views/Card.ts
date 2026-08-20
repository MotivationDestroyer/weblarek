import { IProduct } from "../../types";
import { Component } from "../base/Component";

export abstract class Card extends Component<IProduct> {
    constructor(container: HTMLElement) {
        super(container);
        this.category = container.querySelector('.card__category') as HTMLElement;
        this.title = container.querySelector('.card__title') as HTMLElement;
        this.price = container.querySelector('.card__price') as HTMLElement;
        this.image = container.querySelector('.card__image') as HTMLImageElement;
    }
    protected category: HTMLElement;
    protected title: HTMLElement;
    protected price: HTMLElement;
    protected image: HTMLImageElement;
}