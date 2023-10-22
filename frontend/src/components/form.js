import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

import * as bootstrap from 'bootstrap'

export class Form {

    constructor(page) {
        this.processElement = null;
        this.agreeElement = null;
        this.page = page;
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            }
        ];

        if (this.page === 'signup') {
            this.fields.unshift({
                    name: 'name',
                    id: 'name',
                    element: null,
                    regex: /(^[А-Я][а-я]+\s+)([А-Я][а-я]+\s+)[А-Я][а-я]+\s*$/,
                    valid: false,
                },

                {
                    name: 'repeatPassword',
                    id: 'repeatPassword',
                    element: null,
                    regex: /^(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false,
                });
        }

        const that = this;
        this.fields.forEach(item => {
            console.log(item);
            item.element = document.getElementById(item.id);
            console.log(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }


        if (this.page === 'login') {
            this.agreeElement = document.getElementById('agree');
            this.agreeElement.onchange = function () {
                that.validateForm()
            }
        }
    }


    validateField(field, element) {
        const that = this;
        if (!element.value || !element.value.match(field.regex)) {
            element.classList.add('incorrect');
            field.valid = false;
        } else {
            element.classList.remove('incorrect');
            field.valid = true;
        }

        if (this.page === 'signup') {
            if (field.id === 'repeatPassword' && !that.validatePasswords()) {
                element.classList.add('incorrect');
                field.valid = false;
            }
        }

        this.validateForm();
    }


    validateForm() {
        const validForm = this.fields.every(item => item.valid);

        const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm && this.validatePasswords();

        if (isValid) {
            this.processElement.classList.remove('disabled');
        } else {
            this.processElement.classList.add('disabled');
        }
        return isValid;
    }


    validatePasswords() {
        const password = document.getElementById('password');
        const repeatPassword = document.getElementById('repeatPassword');
        if (repeatPassword.value && password.value) {
            return repeatPassword.value === password.value;
        }
    }


    async processForm() {

        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'signup') {
                const fullName = document.getElementById('name').value;
                let [lastName, name] = fullName.split(' ');
                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'repeatPassword').element.value,
                    });

                    if (result) {
                        if (!result.user) {
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                    return console.log(error);
                }
            }

            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                })

                if (result) {
                    if (!result.tokens || !result.user) {
                        throw new Error('error');
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        fullName: result.user.name,
                        userId: result.user.id,
                    })
                    localStorage.setItem("userEmail", email);
                    location.href = '#/main';
                } else {
                    location.href = '#/signup';
                }

            } catch (error) {
                console.log(error);
            }
        }
    }
}

