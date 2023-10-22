import {Common} from "../../utils/common.js";
import {CustomHttp} from "../../services/custom-http";
import config from "../../../config/config";

export class EditCharges {

    constructor() {
        this.btnCancel = document.getElementById('cancel');
        this.btnSave = document.getElementById('save');
        this.url = '#/charges';
        this.editInput = document.getElementsByClassName('edit-input')[0];

        this.process();
        this.cancelEdition();
    }

    process() {

        const categoryName = localStorage.getItem('chargesCategory');
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
        const categoryId = localStorage.getItem('categoryChargesId');

        const result = await CustomHttp.request(config.host + '/categories/expense/' + categoryId, 'PUT', {
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
