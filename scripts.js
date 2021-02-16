const Modal = {
    open() {
        //Abrir modal - PESQUISAR FUNÇÃO TOGGLE
        //Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close() {
        //fechar modal
        // remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')

    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        Transaction.all.forEach(trans => {
            if (trans.amount > 0) {
                income += trans.amount;
            }
        })
        return income;
    },

    expenses() {
        let expense = 0;
        Transaction.all.forEach(trans => {
            if (trans.amount < 0) {
                expense += trans.amount;
            }
        })

        return expense;
    },
    total() {
        // let total = 0;
        //transactions.forEach(trans => {
        //    total += trans.amount;
        //})
        //return total;

        return Transaction.incomes() + Transaction.expenses();
    }

}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        `

        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatDate(date) {
        const splitteDate = date.split("-")
        return `${splitteDate[2]}/${splitteDate[1]}/${splitteDate[0]}`
    },

    formatAmount(value) {
        value = value *100
        return Math.round(value)
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()
        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos!!")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    saveTransaction(transaction) {
        Transaction.add(transaction)
        //pode-se colocar direto no "submit" usando a tag Transaction.add(transaction)
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {

            //verificar se todas as informações foram inseridas
            Form.validateFields()

            //formatar os dados para salvar
            const transaction = Form.formatValues()

            //salvar
            Form.saveTransaction(transaction)

            //apagar os dados do formulário
            Form.clearFields()

            //Fechar modal
            Modal.close()

            // atualizar a apliação = já existe um reload no "add"

        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()
        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()

        App.init()
    },
}

//inicializa o App
App.init()





//Eu preciso substituir os dados do HTML pelos dados do JS

//tip! ->escreva tudo o que vc precisar fazer... Algoritmo!
//por etapas, descreva as atividades que o JS precisa realizar.
//pesquisar como fazer cada uma das tarefas do JS


//const transactions = [
//    {
////        id: 1,
//        description: 'Luz',
//        amount: -50000,
//        date: '23/01/2021',
//    },
//    {
//        id: 2,
//        description: 'Website',
//        amount: 500000,
//        date: '23/01/2021',
//    },
//    {
//        id: 3,
//        description: 'Internet',
//        amount: -20000,
//        date: '23/01/2021',
//    }
//]