import {Common} from "../../utils/common.js";
import {CustomHttp} from "../../services/custom-http.js";
import config from "../../../config/config.js";

export class Charges {

    constructor() {
        this.modal = null;
        this.plusBtn = document.getElementsByClassName('plus')[0];
        this.url = '#/createCharges';
        this.chargesCategories = null;

        this.init();
    }

    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/expense');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.chargesCategories = result;
            }
        } catch (error) {
            return console.log(error);
        }
        this.showCategories();
    }

    showCategories() {
        const chargesItemsElement = document.getElementById('charges-items');

        if (this.chargesCategories && this.chargesCategories.length > 0) {
            this.chargesCategories.forEach(category => {
                const chargesItemElement = document.createElement('div');
                chargesItemElement.className = 'income-item border rounded-3';

                const itemTitleElement = document.createElement('h2');
                itemTitleElement.className = 'item-title mb-2 fs-3';
                itemTitleElement.innerText = category.title;

                const itemButtonsElement = document.createElement('div');
                itemButtonsElement.className = 'item-buttons';

                const buttonEditElement = document.createElement('button');
                buttonEditElement.className = 'btn btn-primary me-2 edit';
                buttonEditElement.innerText = 'Редактировать';
                buttonEditElement.setAttribute('data-id', category.id);
                buttonEditElement.setAttribute('category-name', category.title);

                const buttonDeleteElement = document.createElement('button');
                buttonDeleteElement.className = 'btn btn-danger delete';
                buttonDeleteElement.innerText = 'Удалить';
                buttonDeleteElement.setAttribute('data-bs-toggle', 'modal');
                buttonDeleteElement.setAttribute('data-bs-target', '#modal');
                buttonDeleteElement.setAttribute('data-id', category.id);
                buttonDeleteElement.setAttribute('category-name', category.title);

                itemButtonsElement.appendChild(buttonEditElement);
                itemButtonsElement.appendChild(buttonDeleteElement);

                chargesItemElement.appendChild(itemTitleElement);
                chargesItemElement.appendChild(itemButtonsElement);

                chargesItemsElement.appendChild(chargesItemElement);
            })

            const chargesItemAdd = document.getElementById('add');
            chargesItemsElement.appendChild(chargesItemAdd);
        }

        this.editCharges();
        // this.deleteCategory();
        Common.deleteCategory('/categories/expense/');
        this.createCharges();

    }

    editCharges() {
        const editBtn = document.getElementsByClassName('edit');

        Array.from(editBtn).forEach(btn => {
            btn.onclick = function (e) {
                localStorage.setItem('categoryChargesId', e.target.getAttribute('data-id'));
                localStorage.setItem('chargesCategory', e.target.getAttribute('category-name'));
                location.href = '#/editCharges';
            }
        })
    }


    createCharges() {
        Common.move(this.plusBtn, this.url);
    }
}
