//passando os elementos como objetos
const formAddReminder = document.getElementById('formAddReminder')
const formEditReminder = document.getElementById('formEditReminder')

//botoes
const btnCreateReminder = document.getElementById('btnCreateReminder')
const btnEditReminder = document.getElementById('btnEditReminder')
const btnDeleteReminder = document.getElementById('btnDeleteReminder')

//campos form adicionar
const titleInput = document.getElementById('title')
const contentInput = document.getElementById('content')

//campos form editar
const idEditInput = document.getElementById('inputEditId')
const titleEditInput = document.getElementById('inputEditTitle')
const contentEditInput = document.getElementById('inputEditContent')

//campo form deletar
const deleteId = document.getElementById('inputDeleteId')

//chamar funcao de criar lembrete ao clicar no botao
btnCreateReminder.addEventListener('click', event => {

    event.preventDefault()

    if (!formAddReminder.checkValidity()) {

        checkInputValid(titleInput)
        checkInputValid(contentInput)

        return
    }

    let reminder = {
        id: 0,
        title: returnValeuById('title'),
        content: returnValeuById('content').replace(/(\r\n|\n|\r)/gm,"")
    }

    createReminder(reminder)

    formAddReminder.reset()
    $('#modalAddReminder').modal('toggle')

    //rolar até o fim da página para mostrar o novo lemrete adicionado
    setTimeout(() => { 
        readReminders()
        window.scrollTo(0, document.body.scrollHeight)
    }, 2000)

})

//chamar funcao de atualizar lembrete ao clicar no botao
btnEditReminder.addEventListener("click", (event) => {

    event.preventDefault()

    if (!formEditReminder.checkValidity()) {

        checkInputValid(titleEditInput)
        checkInputValid(contentEditInput)

        return
    }

    let reminder = {
        title: returnValeuById('inputEditTitle'),
        content: returnValeuById('inputEditContent').replace(/(\r\n|\n|\r)/gm,""),
    }

    let id = parseInt(returnValeuById('inputEditId'))

    updateReminder(id, reminder)

    formEditReminder.reset()
    $('#modalEditReminder').modal('toggle')

    //atualizar a tabela da dados
    setTimeout(() => { 
        readReminders()
    }, 2000)

})

//chamar funcao de deletar lembrete ao clicar no botao
btnDeleteReminder.addEventListener('click', () => {

    let id = parseInt(returnValeuById('inputDeleteId'))

    deleteReminder(id)

    $('#modalDeleteReminder').modal('toggle')

    //atualizar a tabela da dados
    setTimeout(() => { 
        readReminders()
    }, 2000)
})

//retornar o valor de um elemento pelo id
const returnValeuById = id => document.getElementById(id).value

//adicionar ou remover classe invalida
function checkInputValid(input) {

    if (input.value == '')
        input.classList.add('is-invalid')
    else
        input.classList.remove('is-invalid')
}

//funcoes para exibir mensagens na tela
function displaySuccsMessage(mensagem) {
    msg = document.getElementById('msg');
    msg.innerHTML =
        `<div class="alert alert-success alert-dismissible fade show" role="alert">
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

function displayErrMessage(mensagem) {
    msg = document.getElementById('msg');
    msg.innerHTML =
        `<div class="alert alert-danger alert-dismissible fade show" role="alert">
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

//funcoes para exibir dados e modais na tela
function showReminders(reminders) {

    const table = document.getElementById('remindersTable');
    let content = '';

    reminders.forEach(reminder => {

    content +=
    `<tr>
        <td>${reminder.title}</td> 
        <td>${reminder.content}</td> 
        <td class="text-center"><i class="bi bi-pencil" title="Editar" 
            onclick="showReminder(${reminder.id}, '${reminder.title}', '${reminder.content}')">
        </i></td> 

        <td class="text-center"><i class="bi bi-trash" title="Excluir"
            onclick="deleteConfirm(${reminder.id})"></i>
        </td> 
    </tr>`

    })

    table.innerHTML = content
}

function showReminder(id, title, content) {

    inputEditId.value = id
    titleEditInput.value = title
    contentEditInput.value = content
    $('#modalEditReminder').modal('toggle')
}

function deleteConfirm(id) {

    deleteId.value = id;
    $('#modalDeleteReminder').modal('toggle')
}

//CRUD lembrete no json server
const apiUrl = 'https://replit.com/@MateusADM/Json-Server-Web-API#data.json'

function createReminder(reminder) {
    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder)

    })
    .then(res => { 
        if(res.status == 201) displaySuccsMessage('Lembrete adicionado com sucesso!') 
        else displayErrMessage('O lembrete não foi adicionado!') 
    })
    .catch(error => {
        console.error(error)
    })
}

function readReminders() {
    fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => showReminders(data))
    .catch(error => {
        console.error(error)
    })
}

function readReminder(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {showReminder(data)})
    .catch(error => {
        console.error(error)
    })
}

function updateReminder(id, reminder) {
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder)

    })
    .then(res => { 
        if(res.status == 200) displaySuccsMessage('Lembrete atualizado com sucesso!') 
        else displayErrMessage('O lembrete não foi atualizado!') 
    })
    .catch(error => {
        console.error(error)
    })
}

function deleteReminder(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    })
    .then(res => { 
        if(res.status == 200) displaySuccsMessage('Lembrete excluído com sucesso!') 
        else displayErrMessage('Não foi possível excluir o lembrete') 
    })
    .catch(error => {
        console.error(error)
    })
}
