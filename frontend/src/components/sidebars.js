/* global bootstrap: false */

// (() => {
//     'use strict'
//     const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
//     tooltipTriggerList.forEach(tooltipTriggerEl => {
//         new bootstrap.Tooltip(tooltipTriggerEl)
//     })
// })()

import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Sidebar {
    constructor() {
        this.init();
    }

    init() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute !== "#/login" && urlRoute !== "#/signup") {
            this.showBalance();
        }
        this.choosePage();
        this.activePage();
    }

    async showBalance() {
        {
            let balance = document.getElementById('balance');

            try {
                const result = await CustomHttp.request(config.host + '/balance')
                if (result) {
                    if (result.error) {
                        throw new Error(result.message);
                    }
                    balance.innerText = result.balance + "$";
                }

            } catch (error) {
                return console.log(error);
            }
        }
    }


    choosePage() {
        let pages = document.getElementsByClassName('nav-item');
        pages = Array.from(pages);

        pages.forEach(page => {

            page.onclick = function () {
                switch (page.innerText) {
                    case 'Главная':
                        location.href = '#/main';
                        break;
                    case 'Доходы & Расходы':
                        location.href = '#/incomeAndCharges';
                        break;
                    case 'Доходы':
                        location.href = '#/income';
                        break;
                    case 'Расходы':
                        location.href = '#/charges';
                        break;
                }
            }
        })
    }

    activePage() {
        const urlRoute = window.location.hash.split('?')[0];
        const links = document.getElementsByClassName('nav-link');
        const linksArr = Array.from(links);
        const categories = document.getElementById('categories');
        const income = document.getElementById('income');
        const charges = document.getElementById('charges');
        const incomeAndCharges = document.getElementById('incomeAndCharges');

        linksArr.forEach(link => {
            link.onclick = function () {
                linksArr.forEach(item => item.classList.remove('active'));
                link.classList.add('active');
            }
        })

        if (urlRoute === '#/createIncome' || urlRoute === '#/editIncome' || urlRoute === '#/createIncomeAndCharges' || urlRoute === '#/editIncomeAndCharges') {
            linksArr.forEach(link => link.classList.remove('active'));
            categories.classList.add('active');
            income.classList.add('active');
        } else if (urlRoute === '#/createCharges' || urlRoute === '#/editCharges') {
            linksArr.forEach(link => link.classList.remove('active'));
            categories.classList.add('active');
            charges.classList.add('active');
        } else if (urlRoute === '#/incomeAndCharges') {
            linksArr.forEach(link => link.classList.remove('active'));
            incomeAndCharges.classList.add('active');
        }
    }
}



