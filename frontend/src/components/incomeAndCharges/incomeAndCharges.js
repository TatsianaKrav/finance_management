import {Common} from "../../utils/common.js";
import {CustomHttp} from "../../services/custom-http.js";
import config from "../../../config/config.js";

export class IncomeAndCharges {

    constructor() {
        this.buttons = document.getElementsByClassName('chosenPeriod');
        this.dates = document.getElementsByClassName('date');
        this.result = null;
        this.dateFrom = null;
        this.dateTo = null;
        this.tbodyElement = document.getElementById('tbody');
        this.operationId = null;

        this.init();
    }

    init() {
        this.filterOperations('Сегодня');

        const buttons = Array.from(this.buttons);
        buttons.forEach(btn => {
            btn.onclick = (e) => {
                this.tbodyElement.innerHTML = '';

                buttons.forEach(item => item.classList.remove('active'));
                e.target.classList.add('active');

                Common.changeDateInput('#/incomeAndCharges');

                if (e.target.innerText !== "Интервал") {
                    Array.from(this.dates).forEach(date => {
                        date.value = '';
                        date.style.width = '39px';
                    })
                }

                this.filterOperations(e.target.innerText);
            }
        });
        this.deleteOperation();
        this.createOperation();
    }

    async filterOperations(period) {
       this.result = await Common.getOperations(period);

        if (this.result) {
            this.showCategoriesTable(this.result);
        } else {
            console.log('error');
        }
    }

    showCategoriesTable(result) {
        result.forEach((item, index) => {
            const rowCategoryElement = document.createElement('tr');
            rowCategoryElement.className = 'rowOperation';

            const numberElement = document.createElement('td');
            numberElement.className = 'number';
            numberElement.innerText = index + 1;

            const operationElement = document.createElement('td');
            if (item.type === 'income') {
                operationElement.className = 'text-success';
                operationElement.innerText = 'доход';
            } else {
                operationElement.className = 'text-danger';
                operationElement.innerText = 'расход';
            }

            const categoryElement = document.createElement('td');
            categoryElement.innerText = item.category;

            const amountElement = document.createElement('td');
            amountElement.innerText = item.amount + "$";


            const dateElement = document.createElement('td');
            let date = item.date.split('-');
            let modifiedDate = date.reverse();
            modifiedDate = modifiedDate.join('.');

            dateElement.innerText = modifiedDate;

            const commentElement = document.createElement('td');
            commentElement.innerText = item.comment;

            const linksElements = document.createElement('td');
            const deleteElement = document.createElement('a');
            deleteElement.className = 'deleteOperation';
            deleteElement.setAttribute('href', "javascript:void(0)");
            deleteElement.setAttribute('data-bs-toggle', 'modal');
            deleteElement.setAttribute('data-bs-target', '#modal');
            deleteElement.setAttribute('data-id', item.id);

            const deleteImage = document.createElement('img');
            deleteImage.setAttribute('src', "/images/delete.png");
            deleteImage.setAttribute('alt', "delete");

            const editElement = document.createElement('a');
            editElement.className = 'editOperation';
            editElement.setAttribute('href', "#/editIncomeAndCharges");
            editElement.setAttribute('data-id', item.id);

            const editImage = document.createElement('img');
            editImage.setAttribute('src', "/images/edit.png");
            editImage.setAttribute('alt', "edit");

            deleteElement.appendChild(deleteImage);
            editElement.appendChild(editImage);

            linksElements.appendChild(deleteElement);
            linksElements.appendChild(editElement);

            rowCategoryElement.appendChild(numberElement);
            rowCategoryElement.appendChild(operationElement);
            rowCategoryElement.appendChild(categoryElement);
            rowCategoryElement.appendChild(amountElement);
            rowCategoryElement.appendChild(dateElement);
            rowCategoryElement.appendChild(commentElement);
            rowCategoryElement.appendChild(linksElements);

            this.tbodyElement.appendChild(rowCategoryElement);
        })

        this.editOperation();
    }

    editOperation() {
        const editButton = document.getElementsByClassName('editOperation');

        Array.from(editButton).forEach(button => {
            button.onclick = (e) => {
                this.operationId = e.target.parentNode.getAttribute('data-id');

                const operation = this.result.find(operation => operation.id === +(this.operationId));
                localStorage.setItem('editingOperation', JSON.stringify(operation));
            }
        })
    }

    deleteOperation() {
        const modal = document.getElementById('modal');
        const confirmBtn = document.getElementById('confirm');

        modal.addEventListener('show.bs.modal', function (e) {
            const button = e.relatedTarget;
            const element = button.parentNode.parentNode.parentNode;
            confirmBtn.onclick = async () => {
                element.parentNode.removeChild(element);
                try {
                    const result = await CustomHttp.request(config.host + '/operations/' + button.getAttribute('data-id'), 'DELETE');
                    if (result) {
                        if (result.error) {
                            throw new Error(result.error);
                        }
                        console.log("Операция успешно удалена");
                        location.href = '#/incomeAndCharges';
                    }
                } catch (error) {
                    return console.log(error);
                }
            }

        })
    }


    createOperation() {
        let createOperation = document.getElementsByClassName('createOperation');
        createOperation = Array.from(createOperation);

        createOperation.forEach(create => {
            create.onclick = (e) => {
                if (e.target.innerText === 'Создать доход') {
                    localStorage.setItem('operation', 'доход');
                } else if (e.target.innerText === 'Создать расход') {
                    localStorage.setItem('operation', 'расход');
                }
                location.href = '#/createIncomeAndCharges';
            }
        })
    }
}
