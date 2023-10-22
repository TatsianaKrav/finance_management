import {Common} from "../utils/common.js";
import {Chart} from "chart.js/auto";

export class Main {

    constructor() {
        this.dates = document.getElementsByClassName('date');
        this.result = null;

        this.currentIncomeOperations = [];
        this.currentChargesOperations = [];

        this.currentIncomeCategories = [];
        this.currentChargesCategories = [];

        this.currentIncomeAmounts = [];
        this.currentChargesAmounts = [];

        this.init();
    }


    async init() {
        await this.filterOperations('Неделя');
        this.makePies(this.currentIncomeCategories, this.currentIncomeAmounts, this.currentChargesCategories, this.currentChargesAmounts);

        let buttons = document.getElementsByClassName('chosenPeriod');
        buttons = Array.from(buttons);

        buttons.forEach(btn => {
            btn.onclick = async (e) => {
                buttons.forEach(item => item.classList.remove('active'));
                e.target.classList.add('active');

                Common.changeDateInput('#/main');

                if (e.target.innerText !== "Интервал") {
                    Array.from(this.dates).forEach(date => {
                        date.value = '';
                        date.style.width = '39px';
                    });
                }
                await this.filterOperations(e.target.innerText);

                const diagramIncome = document.getElementById("diagram-income");
                diagramIncome.removeChild(document.getElementById('incomeChart'));
                const incomeCanvas = document.createElement('canvas');
                incomeCanvas.setAttribute('id', 'incomeChart');
                diagramIncome.appendChild(incomeCanvas);

                const diagramCharges = document.getElementById("diagram-charges");
                diagramCharges.removeChild(document.getElementById('chargesChart'));
                const chargesCanvas = document.createElement('canvas');
                chargesCanvas.setAttribute('id', 'chargesChart');
                diagramCharges.appendChild(chargesCanvas);

                this.makePies(this.currentIncomeCategories, this.currentIncomeAmounts, this.currentChargesCategories, this.currentChargesAmounts);
            }
        });
    }

    async filterOperations(period) {
        this.result = await Common.getOperations(period);

        this.currentIncomeCategories = [];
        this.currentIncomeAmounts = [];
        this.currentChargesCategories = [];
        this.currentChargesAmounts = [];
        this.currentChargesOperations = [];
        this.currentIncomeOperations = [];


        this.result.forEach(item => {
            if (item.type === 'income') {
                const existingCategory = this.currentIncomeOperations.find(operation => item.category === operation.category);

                if (existingCategory) {
                    existingCategory.amount += item.amount;
                } else {
                    this.currentIncomeOperations.push({
                        category: item.category,
                        amount: item.amount
                    });
                }

            } else if (item.type === 'expense') {
                const existingCategory = this.currentChargesOperations.find(operation => item.category === operation.category);

                if (existingCategory) {
                    existingCategory.amount += item.amount;
                } else {
                    this.currentChargesOperations.push({
                        category: item.category,
                        amount: item.amount
                    });
                }
            }
        })

        this.currentIncomeOperations.forEach(item => {
            this.currentIncomeCategories.push(item.category);
            this.currentIncomeAmounts.push(item.amount);
        })

        this.currentChargesOperations.forEach(item => {
            this.currentChargesCategories.push(item.category);
            this.currentChargesAmounts.push(item.amount);
        })
    }

    makePies(incomeCategories, incomeAmounts, chargesCategories, chargesAmounts) {

        var ctxP = document.getElementById("incomeChart").getContext('2d');
        this.chartIncome = new Chart(ctxP, {
            type: 'pie',
            data: {
                labels: incomeCategories,
                datasets: [{
                    data: incomeAmounts,
                    backgroundColor: ["#DC3545", "#FD7E14", "#FFC107", "#20C997", "#0D6EFD"],
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'start',
                        labels: {
                            boxWidth: 35,
                            boxHeight: 10,
                            padding: 10,
                            color: '#000000',
                            font: 'Roboto-Medium'
                        },
                        title: {
                            padding: 10,
                            color: '#000000',
                            font: 'Roboto-Medium'
                        }
                    }
                },
                responsive: true,
                rotation: -45,
                aspectRatio: 1 | 1,
                animation: {
                    animateRotate: false
                }
            },
        });

        var ctxP2 = document.getElementById("chargesChart").getContext('2d');
        this.cartCharges = new Chart(ctxP2, {
            type: 'pie',
            data: {
                labels: chargesCategories,
                datasets: [{
                    data: chargesAmounts,
                    backgroundColor: ["#DC3545", "#FD7E14", "#FFC107", "#20C997", "#0D6EFD"]
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'start',
                        labels: {
                            boxWidth: 35,
                            boxHeight: 10,
                            padding: 10,
                            font: {
                                family: 'Roboto-Medium',
                                color: '#000000'
                            }
                        },
                        paddingBottom: 40
                    }
                },
                responsive: true,
                rotation: 190,
                aspectRatio: 1 | 1,
                animation: {
                    animateRotate: false
                }
            },

        });

// myPieChart2.onresize('360px');
    }
}
