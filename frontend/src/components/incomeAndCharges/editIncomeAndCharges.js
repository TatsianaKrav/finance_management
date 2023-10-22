import {Common} from "../../utils/common.js";
import {CustomHttp} from "../../services/custom-http.js";
import config from "../../../config/config.js";

export class EditIncomeAndCharges {

    constructor() {
        this.btnCreate = document.getElementById('create');
        this.btnCancel = document.getElementById('cancel');
        this.url = '#/incomeAndCharges';
        let editingOperation = localStorage.getItem('editingOperation');
        this.editingOperation = JSON.parse(editingOperation);
        this.inputType = document.getElementById('inputType');
        this.dateInput = document.getElementById('inputDate');
        this.categoryInput = document.getElementById('inputCategory');
        this.amountInput = document.getElementById('inputAmount');
        this.commentInput = document.getElementById('inputComment');
        this.operation = null;
        this.incomeCategories = null;
        this.chargesCategories = null;
        this.date = null;

        this.init();
        this.cancelCreation();
    }

    init() {

        if (this.editingOperation.type === 'expense') {
            this.inputType.value = 'расход';
            this.operation = 'expense';
        } else if (this.editingOperation.type === 'income') {
            this.inputType.value = 'доход';
            this.operation = "income";
        }
        this.getCategories();

        this.categoryInput.onchange = (e) => {
            this.categoryId = e.target.value;
        }

        this.amountInput.value = this.editingOperation.amount + '$';
        this.amountInput.onclick = () => {
            this.amountInput.type = 'number';
        }

        this.amountInput.onblur = () => {
            this.amountInput.type = 'text';
            this.amountInput.value = this.amountInput.value + '$';
        }

        let date = this.editingOperation.date.split('.');
        let modifiedDate = date.reverse();
        modifiedDate = modifiedDate.join('-');
        this.date = modifiedDate;

        this.dateInput.type = 'text';
        this.dateInput.value = this.editingOperation.date;

        this.dateInput.onclick = () => {
            this.dateInput.type = 'date';
        }

        this.dateInput.onchange = (e) => {
            this.date = e.target.value;
        }

        this.commentInput.value = this.editingOperation.comment;
        this.commentInput.onchange = (e) => {
            this.commentInput.value = e.target.value;
        }

        this.updateOperation();
    }

    async getCategories() {
        this.incomeCategories = await CustomHttp.request(config.host + '/categories/income');
        this.chargesCategories = await CustomHttp.request(config.host + '/categories/expense');

        if (this.operation === "income") {
            this.incomeCategories.forEach(item => {
                const option = document.createElement('option');
                option.text = item.title;
                option.value = item.id;
                this.categoryInput.appendChild(option);
            })
        } else if (this.operation === "expense") {
            this.chargesCategories.forEach(item => {
                const option = document.createElement('option');
                option.text = item.title;
                option.value = item.id;
                this.categoryInput.appendChild(option);
            })
        }


        const result = Array.from(this.categoryInput.options).find(option => option.text === this.editingOperation.category);
        if (result) {
            result.selected = true;
            this.categoryId = this.categoryInput.value;
        } else {
            console.log('ошибка');
        }
    }

    updateOperation() {
        this.btnCreate.onclick = async () => {
            const result = await CustomHttp.request(config.host + '/operations/' + this.editingOperation.id, 'PUT', {
                "type": this.operation,
                "amount": +(this.amountInput.value.split('$')[0]),
                "date": this.date,
                "comment": this.commentInput.value,
                "category_id": +(this.categoryInput.value)
            });
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
            }
            location.href = '#/incomeAndCharges';
        }
    }

    cancelCreation() {
        Common.move(this.btnCancel, this.url);
    }
}

