import {Income} from "./components/income/income.js";
import {CreateIncome} from "./components/income/createIncome.js";
import {EditIncome} from "./components/income/editIncome.js";
import {Charges} from "./components/charges/charges.js";
import {CreateCharges} from "./components/charges/createCharges.js";
import {EditCharges} from "./components/charges/editCharges.js";
import {IncomeAndCharges} from "./components/incomeAndCharges/incomeAndCharges.js";
import {CreateIncomeAndCharges} from "./components/incomeAndCharges/createIncomeAndCharges.js";
import {EditIncomeAndCharges} from "./components/incomeAndCharges/editIncomeAndCharges.js";
import {Main} from "./components/main.js";
import {Form} from "./components/form.js";
import {Auth} from "./services/auth.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');

        this.routes = [
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/login/signup.html',
                styles: "styles/form.css",
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/login/login.html',
                styles: "styles/form.css",
                load: () => {
                    new Form('login');
                }
            },

            {
                route: '#/main',
                title: 'Главная',
                template: 'templates/main.html',
                styles: "styles/main.css",
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income/income.html',
                styles: "styles/category.css",
                load: () => {
                    new Income();
                }
            },
            {
                route: '#/createIncome',
                title: 'Создание категории доходов',
                template: 'templates/income/createIncome.html',
                styles: "styles/categoryActions.css",
                load: () => {
                    new CreateIncome();
                }
            },
            {
                route: '#/editIncome',
                title: 'Редактирование категории доходов',
                template: 'templates/income/editIncome.html',
                styles: "styles/categoryActions.css",
                load: () => {
                    new EditIncome();
                }
            },
            {
                route: '#/charges',
                title: 'Расходы',
                template: 'templates/charges/charges.html',
                styles: "styles/category.css",
                load: () => {
                    new Charges();
                }
            },
            {
                route: '#/createCharges',
                title: 'Создание категории расходов',
                template: 'templates/charges/createCharges.html',
                styles: "styles/categoryActions.css",
                load: () => {
                    new CreateCharges();
                }
            },
            {
                route: '#/editCharges',
                title: 'Редактирование категории расходов',
                template: 'templates/charges/editCharges.html',
                styles: "styles/categoryActions.css",
                load: () => {
                    new EditCharges();
                }
            },
            {
                route: '#/incomeAndCharges',
                title: 'Доходы и расходы',
                template: 'templates/incomeAndCharges/incomeAndCharges.html',
                styles: "styles/incomeAndCharges.css",
                load: () => {
                    new IncomeAndCharges();
                }
            },
            {
                route: '#/createIncomeAndCharges',
                title: 'Создание дохода/расхода',
                template: 'templates/incomeAndCharges/createIncomeAndCharges.html',
                styles: "styles/incomeAndChargesActions.css",
                load: () => {
                    new CreateIncomeAndCharges();
                }
            },
            {
                route: '#/editIncomeAndCharges',
                title: 'Редактирование дохода/расхода',
                template: 'templates/incomeAndCharges/editIncomeAndCharges.html',
                styles: "styles/incomeAndChargesActions.css",
                load: () => {
                    new EditIncomeAndCharges();
                }
            },

        ]
    }

    async openRoute() {
        const profileElement = document.getElementById('personal-info');
        const profileFullNameElement = document.getElementById('profile-full-name');

        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }


        const newRoute = this.routes.find(item => {
            return item.route === window.location.hash;
        });

        if (!newRoute) {
            window.location.href = '#/signup';
            return;
        }

        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        this.stylesElement.setAttribute('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title;


        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            profileElement.style.display = 'block';
            profileFullNameElement.innerText = userInfo.fullName;
        } else {
            profileElement.style.display = 'none';
        }

        newRoute.load();
        // this.activePage();
    }

    // activePage() {
    //     const urlRoute = window.location.hash.split('?')[0];
    //     const links = document.getElementsByClassName('nav-link');
    //     const linksArr = Array.from(links);
    //     const categories = document.getElementById('categories');
    //     const income = document.getElementById('income');
    //     const charges = document.getElementById('charges');
    //     const incomeAndCharges = document.getElementById('incomeAndCharges');
    //
    //     linksArr.forEach(link => {
    //         link.onclick = function (e) {
    //             linksArr.forEach(item => item.classList.remove('active'));
    //             e.target.classList.add('active');
    //         }
    //     })
    //
    //     if (urlRoute === '#/createIncome' || urlRoute === '#/editIncome') {
    //         linksArr.forEach(link => link.classList.remove('active'));
    //         categories.classList.add('active');
    //         income.classList.add('active');
    //     } else if (urlRoute === '#/createCharges' || urlRoute === '#/editCharges') {
    //         linksArr.forEach(link => link.classList.remove('active'));
    //         categories.classList.add('active');
    //         charges.classList.add('active');
    //     } else if (urlRoute === '#/incomeAndCharges') {
    //         linksArr.forEach(link => link.classList.remove('active'));
    //         incomeAndCharges.classList.add('active');
    //     }
    // }
}