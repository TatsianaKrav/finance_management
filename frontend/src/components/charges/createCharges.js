import {Common} from "../../utils/common.js";
import {CustomHttp} from "../../services/custom-http.js";
import config from "../../../config/config.js";

export class CreateCharges {
    constructor() {
        this.btnCancel = document.getElementById('cancel');
        this.btnCreate = document.getElementById('create');
        this.urlCharges = '#/charges';
        this.createInput = document.getElementsByClassName('create-input')[0];

        this.process();
        this.cancelCreation();
    }

    process() {
        this.createInput.onchange = () => {
            if (this.createInput.value && this.createInput.value !== '') {
                this.btnCreate.onclick = () => {
                    this.createCategoryCharges();
                }
            } else {
                console.log("Ошибка");
            }
        }
    }


    async createCategoryCharges() {

        const result = await CustomHttp.request(config.host + '/categories/expense', 'POST', {
            "title": this.createInput.value,
        });
        if (result) {
            if (result.error) {
                throw new Error(result.error);
            }
        }
        console.log("Категория успешно создана");
        location.href = '#/charges';
    }

    cancelCreation() {
        Common.move(this.btnCancel, this.urlCharges);
    }
}
