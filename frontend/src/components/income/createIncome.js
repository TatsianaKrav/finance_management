import {Common} from "../../utils/common.js";
import {CustomHttp} from "../../services/custom-http.js";
import config from "../../../config/config.js";

export class CreateIncome {
    constructor() {
        this.btnCancel = document.getElementById('cancel');
        this.btnCreate = document.getElementById('create');
        this.urlIncome = '#/income';
        this.createInput = document.getElementsByClassName('create-input')[0];

        this.process();
        this.cancelCreation()

    }

    process() {
        this.createInput.onchange = () => {
            if (this.createInput.value && this.createInput.value !== '') {
                this.btnCreate.onclick = () => {
                    this.createCategoryIncome();
                }
            } else {
                console.log("Ошибка");
            }
        }
    }

    async createCategoryIncome() {

        const result = await CustomHttp.request(config.host + '/categories/income', 'POST', {
            "title": this.createInput.value,
        });
        if (result) {
            if (result.error) {
                throw new Error(result.error);
            }
        }
        console.log("Категория успешно создана");
        location.href = '#/income';
    }

    cancelCreation() {
        Common.move(this.btnCancel, this.urlIncome);
    }
}
