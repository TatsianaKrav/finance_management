import {Common} from "../../utils/common.js";
import {CustomHttp} from "../../services/custom-http.js";
import config from "../../../config/config.js";

export class CreateIncomeAndCharges {
    constructor() {
        this.btnCancel = document.getElementById('cancel');
        this.btnCreate = document.getElementById('create');
        this.url = '#/incomeAndCharges';
        this.incomeCategories = null;
        this.chargesCategories = null;

        this.operation = null;
        this.category = null;
        this.categoryId = null;
        this.amount = null;
        this.date = null;
        this.commentInput = document.getElementById('commentInput');
        this.selectCategory = document.getElementById('selectCategory');
        this.selectType = document.getElementById('selectType');
        this.amountInput = document.getElementById('amountInput');
        this.dateInput = document.getElementById('dateInput');

        this.fields = [
            {
                id: 'selectType',
                type: 'select',
                element: null,
                valid: false
            },
            {
                id: 'selectCategory',
                type: 'select',
                element: null,
                valid: false
            },
            {
                id: 'amountInput',
                type: 'input',
                element: null,
                valid: false
            },
            {
                id: 'dateInput',
                type: 'input',
                element: null,
                valid: false
            },
            {
                id: 'commentInput',
                type: 'input',
                element: null,
                valid: false
            }
        ];

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);

            item.element.addEventListener('change', function () {
                that.validateField.call(that, item, this);
            })
        });


        Common.changeDateInput();
        this.process();
        this.cancelCreation();
    }


    validateField(field, element) {
        if (!element.value) {
            field.valid = false;
        } else {
            field.valid = true;
        }

        this.validateForm();
    }

    validateForm() {
        this.fields[0].valid = true;
        const isValid = this.fields.every(item => item.valid);

        if (isValid) {
            this.btnCreate.removeAttribute('disabled');
        } else {
            this.btnCreate.setAttribute('disabled', 'disabled');
        }
    }


    async process() {

        if (localStorage.getItem('operation') === 'доход') {
            this.selectType.options[1].selected = true;
            this.operation = 'income';

        } else if (localStorage.getItem('operation') === 'расход') {
            this.selectType.options[2].selected = true;
            this.operation = "expense";
        }

        this.selectType.onchange = (e) => {
            if (e.target.value === 'доход') {
                this.operation = 'income';
            } else if (e.target.value === 'расход') {
                this.operation = "expense";
            }

            if (this.selectCategory.options) {
                Array.from(this.selectCategory.options).forEach(item => {
                    this.selectCategory.removeChild(item);
                })
            }

            if ((this.operation === "income" && this.incomeCategories) || (this.operation === "expense" && this.chargesCategories)) {
                this.getCategories();
            } else {
                console.log('error');
            }
        }

        this.incomeCategories = await CustomHttp.request(config.host + '/categories/income');
        this.chargesCategories = await CustomHttp.request(config.host + '/categories/expense');

        if ((this.operation === "income" && this.incomeCategories) || (this.operation === "expense" && this.chargesCategories)) {
            await this.getCategories();
        } else {
            console.log('error');
        }
    }

    async getCategories() {
        if (this.operation === "income") {
            this.incomeCategories.forEach(item => {
                const option = document.createElement('option');
                option.text = item.title;
                option.value = item.id;
                this.selectCategory.appendChild(option);
            })
        } else if (this.operation === "expense") {
            this.chargesCategories.forEach(item => {
                const option = document.createElement('option');
                option.text = item.title;
                option.value = item.id;
                this.selectCategory.appendChild(option);
            })
        }


        this.createOperation();

        this.amountInput.onclick = () => {
            this.amountInput.type = 'number';
        }

        this.amountInput.onblur = () => {
            this.amountInput.type = 'text';
            this.amountInput.value = this.amountInput.value + '$';
        }
    }

    createOperation() {
        this.dateInput.onchange = (e) => {
            this.dateInput.type = 'date';

            let date = e.target.value.split('-');
            let modifiedDate = date.reverse();
            modifiedDate = modifiedDate.join('.');

            this.date = e.target.value;
            this.dateInput.type = 'text';
            this.dateInput.value = modifiedDate;
        }

        this.selectCategory.onchange = (e) => {
            this.categoryId = e.target.value;
        }


        this.btnCreate.onclick = async () => {

            const result = await CustomHttp.request(config.host + '/operations', 'POST', {
                "type": this.operation,
                "amount": document.getElementById('amountInput').value,
                "date": this.date,
                "comment": this.commentInput.value,
                "category_id": +(this.selectCategory.value)
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
