import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Common {
    static changeDateInput(page = '') {
        const dateInputs = document.getElementsByClassName('date');

        Array.from(dateInputs).forEach(date => {
            date.onfocus = (e) => {
                e.target.type = 'date';
                if (page === '#/main' || page === '#/incomeAndCharges') {
                    e.target.style.width = '90px';
                }

            }

            date.onblur = (e) => {
                e.target.type = 'text';
            }

            date.onchange = (e) => {
                let date = e.target.value.split('-');
                let modifiedDate = date.reverse();
                modifiedDate = modifiedDate.join('.');
                date.value = modifiedDate;
            }
        })
    }

    static move(element, url) {
        element.onclick = () => {
            location.href = url;
        }
    }

    static async getOperations(period) {
        let result = null;

        switch (period) {
            case "Сегодня":
                result = await CustomHttp.request(config.host + '/operations');
                return result;
            case "Неделя":
                result = await CustomHttp.request(config.host + '/operations?period=week');
                return result;
            case "Месяц":
                result = await CustomHttp.request(config.host + '/operations?period=month');
                return result;
            case "Год":
                result = await CustomHttp.request(config.host + '/operations?period=year');
                return result;
            case "Все":
                result = await CustomHttp.request(config.host + '/operations?period=all');
                return result;
            case "Интервал":
                document.getElementsByClassName('date')[0].onchange = (e) => {
                    this.dateFrom = e.target.value;
                }

                document.getElementsByClassName('date')[1].onchange = (e) => {
                    this.dateTo = e.target.value;
                }

                result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + this.dateFrom + '&dateTo=' + this.dateTo);
                return result;
        }
    }

    static async deleteCategory(params) {
        this.modal = document.getElementById('modal');
        const confirmBtn = document.getElementById('confirm');
        let allOperations = null;
        const that = this;

        try {
            allOperations = await CustomHttp.request(config.host + '/operations?period=all');
            if (allOperations) {
                if (allOperations.error) {
                    throw new Error(allOperations.error);
                }
            }
        } catch (error) {
            return console.log(error);
        }

        this.modal.addEventListener('show.bs.modal', function (e) {
            const button = e.relatedTarget;
            const element = button.parentNode.parentNode;
            const deletedCategory = button.getAttribute('category-name');
            confirmBtn.onclick = async () => {
                element.parentNode.removeChild(element);
                try {
                    const result = await CustomHttp.request(config.host + params + button.getAttribute('data-id'), 'DELETE');
                    if (result) {
                        if (result.error) {
                            throw new Error(result.error);
                        }
                        console.log("Категория успешно удалена");
                    }
                } catch (error) {
                    return console.log(error);
                }
            }

            allOperations.forEach(operation => {
                if (operation.category === deletedCategory) {
                    that.deleteOperation(operation.id);
                }
            })
        })
    }

    static async deleteOperation(idOperation) {
        try {
            const result = await CustomHttp.request(config.host + '/operations/' + idOperation, 'DELETE');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
            }
        } catch (error) {
            return console.log(error);
        }
    }
}