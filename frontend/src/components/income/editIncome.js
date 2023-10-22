import {Common} from "../../utils/common.js";
import {CustomHttp} from "../../services/custom-http.js";
import config from "../../../config/config.js";

export class EditIncome {
    constructor() {
        this.btnCancel = document.getElementById('cancel');
        this.btnSave = document.getElementById('save');
        this.url = '#/income';
        this.editInput = document.getElementsByClassName('edit-input')[0];

        this.process();
        this.cancelEdition();
    }

    process() {
        const categoryName = localStorage.getItem('incomeCategory');
        if (categoryName) {
            this.editInput.value = categoryName;
        } else {
            this.editInput.value = 'no name category';
        }

        this.btnSave.onclick = () => {
            this.saveEditing();
        }
    }


    async saveEditing() {
        const categoryId = localStorage.getItem('incomeCategoryId');

        const result = await CustomHttp.request(config.host + '/categories/income/' + categoryId, 'PUT', {
            "title": this.editInput.value,
        });
        if (result) {
            if (result.error) {
                throw new Error(result.error);
            }
        }

        location.href = this.url;
    }


    cancelEdition() {
        Common.move(this.btnCancel, this.url);
    }
}
