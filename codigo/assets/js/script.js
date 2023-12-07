// Declaração de uma array vazia para armazenar as tarefas
let tarefas = [];

// Fetching dos dados da API usando a URL fornecida 
const apiURL = 'https://json-server-web-api-tarefas.gustavoalvaren3.repl.co/tarefas';
const todo = document.getElementById('to-do');
const doing = document.getElementById('doing');
const done = document.getElementById('done');


function formatDate(dateValue) {

  let date = new Date(dateValue) 

  if (date.getMonth() + 1 < 10) {
    var month = `0${date.getMonth() + 1}`;
  } else {
    var month = `${date.getMonth() + 1}`;
  }
  
  if (date.getDate() < 10) {
    var day = `0${date.getDate()}`;
  } else {
    var day = `${date.getDate()}`;
  }

  return `${day}/${month}/${date.getFullYear()}`;
}

function formatPriority(priority) {
  if (priority == 'high') return 'ALTA';
  else if (priority == 'mid') return 'MÉDIA';
  else if (priority == 'low') return 'BAIXA';
}


function updateStatus(taskId, updatedStatus) {
  fetch(`https://json-server-web-api-tarefas.gustavoalvaren3.repl.co/tarefas/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: updatedStatus }),
  })
    .then(response => response.json())
    .catch(error => {
      console.error('Erro ao atualizar o status da tarefa:', error);
    });
}

function addButtonListener(btn, status) {
  btn.addEventListener("click", () => {
    const taskContainer = btn.closest('.task');
    const taskId = taskContainer.querySelector('.id').innerText;

    if (status === 1) {
      btn.innerHTML = '<i class="bi bi-check"></i>';
      btn.classList.add("check");
      btn.classList.remove("start");
      var elementoIrmaoAnterior = btn.previousElementSibling;
      while (elementoIrmaoAnterior && !elementoIrmaoAnterior.classList.contains('btn-editar')) {
        elementoIrmaoAnterior = elementoIrmaoAnterior.previousElementSibling;
      }
      var eClick = elementoIrmaoAnterior.onclick.toString().match(/showTask\([^)]*\)/)[0];
      let taskArray = eClick.split(',');
      taskArray[taskArray.length - 2] = ` ${status}`;
      let modifiedOnclick = taskArray.join(',');
      elementoIrmaoAnterior.setAttribute('onclick', modifiedOnclick);
      taskContainer.remove();
      doing.insertBefore(taskContainer, doing.firstChild);
      addCheckButtonListener();
    } else if (status === 2) {
      const taskBody = taskContainer.querySelector('.task-body');
      taskBody.classList.remove('border-danger-subtle', 'border-warning-subtle', 'border-success-subtle', 'border-start', 'rounded-start-2', 'border-5');
      taskBody.classList.add("border-5", "border-start", "border-success", "rounded-start-2");
      var elementoIrmaoAnterior = btn.previousElementSibling;
      while (elementoIrmaoAnterior && !elementoIrmaoAnterior.classList.contains('btn-editar')) {
        elementoIrmaoAnterior = elementoIrmaoAnterior.previousElementSibling;
      }
      var eClick = elementoIrmaoAnterior.onclick.toString().match(/showTask\([^)]*\)/)[0];
      let taskArray = eClick.split(',');
      taskArray[taskArray.length - 2] = ` ${status}`;
      let modifiedOnclick = taskArray.join(',');
      elementoIrmaoAnterior.setAttribute('onclick', modifiedOnclick);
      elementoIrmaoAnterior = btn.previousElementSibling;
      while (elementoIrmaoAnterior && !elementoIrmaoAnterior.classList.contains('deadline')) {
        elementoIrmaoAnterior = elementoIrmaoAnterior.previousElementSibling;
      }
      elementoIrmaoAnterior.classList.remove('text-danger');
      btn.remove();
      taskBody.innerHTML += '<p class="float-end m-0 text-success task-status-completed">Tarefa completa!</p>';
      taskContainer.remove();
      done.insertBefore(taskContainer, done.firstChild);
    }

    updateStatus(taskId, status);
    addButtonListener(btn, status);
  });
}

function addStartButtonListener() {
  const btnsStart = document.querySelectorAll(".start");
  btnsStart.forEach((btnStart) => {
    addButtonListener(btnStart, 1);
  });
}

function addCheckButtonListener() {
  const btnsCheck = document.querySelectorAll(".check");
  btnsCheck.forEach((btnCheck) => {
    addButtonListener(btnCheck, 2);
  });
}

function showtasks(tasks) {
  const table = document.getElementById('tasksTable');
  let contentTodo = '';
  let contentDoing = '';
  let contentDone = '';

  tasks.forEach(task => {

    let priorityClass = '';

    if (task.priority === 'high') {
      priorityClass = 'border-start rounded-start-2 border-5 border-danger-subtle';
    } else if (task.priority === 'mid') {
      priorityClass = 'border-start rounded-start-2 border-5 border-warning-subtle';
    } else if (task.priority === 'low') {
      priorityClass = 'border-start rounded-start-2 border-5 border-success-subtle';
    }

    let lateClass = '';

    if (task.late) {
      lateClass = 'text-danger';
    }

    if (task.status == 0) {
      contentTodo = `<div class="card task">
        <div class="card-body task-body ${priorityClass}">
        <button type="button" class="btn btn-sm float-end m-1 rounded-circle" onclick="deleteConfirm(${task.id})"><i class="bi bi-trash" title="Excluir"></i></button>
        <button type="button" class="btn btn-sm float-end m-1 rounded-circle btn-editar" onclick="showTask(${task.id}, '${task.title}', '${task.description}','${task.start}','${task.priority}', ${task.status}, '${task.late}')"><i class="bi bi-pencil" title="Editar"></i></button>
        <span class="id d-none" id="task${task.id}">${task.id}</span>
        <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <p class="card-text deadline ${lateClass}">Prazo: ${formatDate(task.start)}</p>
          <p class="card-text priority">Prioridade: ${formatPriority(task.priority)}</p>
          <button type="button" class="btn btn-sm float-end start"><i class="bi bi-play"></i></button>
        </div>
      </div>` + contentTodo;
    }

    if (task.status == 1) {
      contentDoing = `<div class="card task">
        <div class="card-body task-body ${priorityClass}">
        <button type="button" class="btn btn-sm float-end m-1 rounded-circle" onclick="deleteConfirm(${task.id})"><i class="bi bi-trash" title="Excluir"></i></button>
        <button type="button" class="btn btn-sm float-end m-1 rounded-circle btn-editar" onclick="showTask(${task.id}, '${task.title}', '${task.description}','${task.start}','${task.priority}', ${task.status}, '${task.late}')"><i class="bi bi-pencil" title="Editar"></i></button>
        <span class="id d-none" id="task${task.id}">${task.id}</span>
        <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <p class="card-text deadline ${lateClass}">Prazo: ${formatDate(task.start)}</p>
          <p class="card-text priority">Prioridade: ${formatPriority(task.priority)}</p>
          <button type="button" class="btn btn-sm float-end check"><i class="bi bi-check"></i></button>
        </div>
      </div>` + contentDoing;
    }

    if (task.status == 2) {
      contentDone = `<div class="card task">
          <div class="card-body task-body border-5 border-start border-success rounded-start-2">
            <button type="button" class="btn btn-sm float-end m-1 rounded-circle" onclick="deleteConfirm(${task.id})"><i class="bi bi-trash" title="Excluir"></i></button>
            <button type="button" class="btn btn-sm float-end m-1 rounded-circle btn-editar" onclick="showTask(${task.id}, '${task.title}', '${task.description}','${task.start}','${task.priority}', ${task.status}, '${task.late}')"><i class="bi bi-pencil" title="Editar"></i></button>
            <span class="id d-none" id="task${task.id}">${task.id}</span>
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">${task.description}</p>
            <p class="card-text deadline">Prazo: ${formatDate(task.start)}</p>
            <p class="card-text priority">Prioridade: ${formatPriority(task.priority)}</p>
            <p class="float-end m-0 text-success task-status-completed">Tarefa completa!</p>
          </div>
        </div>` + contentDone;
    }

  })
  if (todo !== null) {
    todo.innerHTML = contentTodo + todo.innerHTML;
    doing.innerHTML = contentDoing + doing.innerHTML;
    done.innerHTML = contentDone + done.innerHTML;
  }

  addStartButtonListener();
  addCheckButtonListener();

}

function readtasks() {
  fetch(apiURL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/JSON' }
  })
    .then(res => res.json())
    .then(data => showtasks(data))
    .catch(error => {
      console.error(error)
    });
}

readtasks();

if (document.querySelector('.linha-kanban') !== null)
  new Sortable(document.querySelector('.linha-kanban'), {
    animation: 250,
    draggable: '.coluna-kanban',
    delayOnTouchOnly: true,
    handle: '.colummn-header'
  })

if (todo !== null)
  new Sortable(todo, {
    group: 'shared',
    animation: 300,
    delayOnTouchOnly: true,
    delay: 100,
    dragClass: "sortable-drag",
    ghostClass: "sortable-ghost",
    onStart: function (evt) {
      const draggedTask = evt.item;
      const btnStart = draggedTask.querySelector('.start');
      btnStart.remove();
    },
    onEnd: function (evt) {
      if (evt.to === todo) {
        const droppedTask = evt.item;
        const taskId = droppedTask.querySelector('.id').innerText;
        const taskBody = droppedTask.querySelector('.task-body');
        taskBody.innerHTML += `<button type="button" class="btn btn-light btn-sm float-end start"><i class="bi bi-play"></i></button>`;
        addStartButtonListener();
        var btnEditar = droppedTask.querySelector('.btn-editar');
        var eClick = btnEditar.onclick.toString().match(/showTask\([^)]*\)/)[0];
        let taskArray = eClick.split(',');
        taskArray[taskArray.length - 2] = ` 0`;
        let modifiedOnclick = taskArray.join(',');
        btnEditar.setAttribute('onclick', modifiedOnclick);
        updateStatus(taskId, 0);
      }
      if (evt.to === doing) {
        const droppedTask = evt.item;
        const taskId = droppedTask.querySelector('.id').innerText;
        const taskBody = droppedTask.querySelector('.task-body');
        taskBody.innerHTML += `<button type="button" class="btn btn-light btn-sm float-end check"><i class="bi bi-check"></i></button>`;
        addCheckButtonListener();
        var btnEditar = droppedTask.querySelector('.btn-editar');
        var eClick = btnEditar.onclick.toString().match(/showTask\([^)]*\)/)[0];
        let taskArray = eClick.split(',');
        taskArray[taskArray.length - 2] = ` 1`;
        let modifiedOnclick = taskArray.join(',');
        btnEditar.setAttribute('onclick', modifiedOnclick);
        updateStatus(taskId, 1);
      }
      if (evt.to === done) {
        const droppedTask = evt.item;
        const taskId = droppedTask.querySelector('.id').innerText;
        const taskBody = droppedTask.querySelector('.task-body');
        taskBody.classList.remove('border-danger-subtle', 'border-warning-subtle', 'border-success-subtle', 'border-start', 'rounded-start-2', 'border-5');
        taskBody.classList.add("border-5", "border-start", "border-success", "rounded-start-2");
        taskBody.innerHTML += `<p class="float-end m-0 text-success task-status-completed">Tarefa completa!</p>`;
        var btnEditar = droppedTask.querySelector('.btn-editar');
        var eClick = btnEditar.onclick.toString().match(/showTask\([^)]*\)/)[0];
        let taskArray = eClick.split(',');
        taskArray[taskArray.length - 2] = ` 2`;
        let modifiedOnclick = taskArray.join(',');
        btnEditar.setAttribute('onclick', modifiedOnclick);
        let prazo = droppedTask.querySelector('.deadline');
        prazo.classList.remove('text-danger');
        updateStatus(taskId, 2);
      }
    }
  });

if (doing !== null)
  new Sortable(doing, {
    group: 'shared',
    animation: 300,
    delayOnTouchOnly: true,
    delay: 100,
    dragClass: "sortable-drag",
    ghostClass: "sortable-ghost",
    onStart: function (evt) {
      const draggedTask = evt.item;
      const btnCheck = draggedTask.querySelector('.check');
      btnCheck.remove();
    },
    onEnd: function (evt) {
      if (evt.to === todo) {
        const droppedTask = evt.item;
        const taskId = droppedTask.querySelector('.id').innerText;
        const taskBody = droppedTask.querySelector('.task-body');
        taskBody.innerHTML += `<button type="button" class="btn btn-light btn-sm float-end start"><i class="bi bi-play"></i></button>`;
        addStartButtonListener();
        var btnEditar = droppedTask.querySelector('.btn-editar');
        var eClick = btnEditar.onclick.toString().match(/showTask\([^)]*\)/)[0];
        let taskArray = eClick.split(',');
        taskArray[taskArray.length - 2] = ` 0`;
        let modifiedOnclick = taskArray.join(',');
        btnEditar.setAttribute('onclick', modifiedOnclick);
        updateStatus(taskId, 0);
      }
      if (evt.to === doing) {
        const droppedTask = evt.item;
        const taskId = droppedTask.querySelector('.id').innerText;
        const taskBody = droppedTask.querySelector('.task-body');
        taskBody.innerHTML += `<button type="button" class="btn btn-light btn-sm float-end check"><i class="bi bi-check"></i></button>`;
        addCheckButtonListener();
        var btnEditar = droppedTask.querySelector('.btn-editar');
        var eClick = btnEditar.onclick.toString().match(/showTask\([^)]*\)/)[0];
        let taskArray = eClick.split(',');
        taskArray[taskArray.length - 2] = ` 1`;
        let modifiedOnclick = taskArray.join(',');
        btnEditar.setAttribute('onclick', modifiedOnclick);
        updateStatus(taskId, 1);
      }
      if (evt.to === done) {
        const droppedTask = evt.item;
        const taskId = droppedTask.querySelector('.id').innerText;
        const taskBody = droppedTask.querySelector('.task-body');
        taskBody.classList.remove('border-danger-subtle', 'border-warning-subtle', 'border-success-subtle', 'border-start', 'rounded-start-2', 'border-5');
        taskBody.classList.add("border-5", "border-start", "border-success", "rounded-start-2");
        taskBody.innerHTML += `<p class="float-end m-0 text-success task-status-completed">Tarefa completa!</p>`;
        var btnEditar = droppedTask.querySelector('.btn-editar');
        var eClick = btnEditar.onclick.toString().match(/showTask\([^)]*\)/)[0];
        let taskArray = eClick.split(',');
        taskArray[taskArray.length - 2] = ` 2`;
        let modifiedOnclick = taskArray.join(',');
        btnEditar.setAttribute('onclick', modifiedOnclick);
        let prazo = droppedTask.querySelector('.deadline');
        prazo.classList.remove('text-danger');
        updateStatus(taskId, 2);
      }
    }
  });

if (done !== null)
  new Sortable(done, {
    group: 'shared',
    animation: 300,
    delayOnTouchOnly: true,
    delay: 100,
    dragClass: "sortable-drag",
    ghostClass: "sortable-ghost",
    onStart: function (evt) {
      const draggedTask = evt.item;
      const textCheck = draggedTask.querySelector('.task-status-completed');
      textCheck.remove();
      const taskBody = draggedTask.querySelector('.task-body');
      taskBody.classList.remove("border-5", "border-start", "border-success", "rounded-start-2");
    },
    onEnd: function (evt) {
      if (evt.to === todo) {
        const droppedTask = evt.item;
        const taskId = droppedTask.querySelector('.id').innerText;
        const taskBody = droppedTask.querySelector('.task-body');
        const priority = droppedTask.querySelector('.priority').innerHTML;
        if (priority === "Prioridade: BAIXA") {
          taskBody.classList.add("border-start", "rounded-start-2", "border-5", "border-success-subtle");
        }
        else if (priority === "Prioridade: MÉDIA") {
          taskBody.classList.add("border-start", "rounded-start-2", "border-5", "border-warning-subtle");
        }
        else if (priority === "Prioridade: ALTA") {
          taskBody.classList.add("border-start", "rounded-start-2", "border-5", "border-danger-subtle");
        }
        taskBody.innerHTML += `<button type="button" class="btn btn-light btn-sm float-end start"><i class="bi bi-play"></i></button>`;
        addStartButtonListener();
        var btnEditar = droppedTask.querySelector('.btn-editar');
        var eClick = btnEditar.onclick.toString().match(/showTask\([^)]*\)/)[0];
        let taskArray = eClick.split(',');
        taskArray[taskArray.length - 2] = ` 0`;
        let modifiedOnclick = taskArray.join(',');
        btnEditar.setAttribute('onclick', modifiedOnclick);
        updateStatus(taskId, 0);
      }
      if (evt.to === doing) {
        const droppedTask = evt.item;
        const taskId = droppedTask.querySelector('.id').innerText;
        const taskBody = droppedTask.querySelector('.task-body');
        const priority = droppedTask.querySelector('.priority').innerHTML;
        if (priority === "Prioridade: BAIXA") {
          taskBody.classList.add("border-start", "rounded-start-2", "border-5", "border-success-subtle");
        }
        else if (priority === "Prioridade: MÉDIA") {
          taskBody.classList.add("border-start", "rounded-start-2", "border-5", "border-warning-subtle");
        }
        else if (priority === "Prioridade: ALTA") {
          taskBody.classList.add("border-start", "rounded-start-2", "border-5", "border-danger-subtle");
        }
        taskBody.innerHTML += `<button type="button" class="btn btn-light btn-sm float-end check"><i class="bi bi-check"></i></button>`;
        addCheckButtonListener();
        var btnEditar = droppedTask.querySelector('.btn-editar');
        var eClick = btnEditar.onclick.toString().match(/showTask\([^)]*\)/)[0];
        let taskArray = eClick.split(',');
        taskArray[taskArray.length - 2] = ` 1`;
        let modifiedOnclick = taskArray.join(',');
        btnEditar.setAttribute('onclick', modifiedOnclick);
        updateStatus(taskId, 1);
      }
      if (evt.to === done) {
        const droppedTask = evt.item;
        const taskId = droppedTask.querySelector('.id').innerText;
        const taskBody = droppedTask.querySelector('.task-body');
        taskBody.classList.remove('border-danger-subtle', 'border-warning-subtle', 'border-success-subtle', 'border-start', 'rounded-start-2', 'border-5');
        taskBody.classList.add("border-5", "border-start", "border-success", "rounded-start-2");
        taskBody.innerHTML += `<p class="float-end m-0 text-success task-status-completed">Tarefa completa!</p>`;
        var btnEditar = droppedTask.querySelector('.btn-editar');
        var eClick = btnEditar.onclick.toString().match(/showTask\([^)]*\)/)[0];
        let taskArray = eClick.split(',');
        taskArray[taskArray.length - 2] = ` 2`;
        let modifiedOnclick = taskArray.join(',');
        btnEditar.setAttribute('onclick', modifiedOnclick);
        let prazo = droppedTask.querySelector('.deadline');
        prazo.classList.remove('text-danger');
        updateStatus(taskId, 2);
      }
    }
  });

const startButton = document.getElementById('startButton');
const popup = document.getElementById('popup');
const tempoAtividadeInput = document.getElementById('tempoAtividade');
const tempoIntervaloInput = document.getElementById('tempoIntervalo');
let numRepeticoesInput = document.getElementById('numRepeticoes');
const submitButton = document.getElementById('submitButton');
const cronometroDisplay = document.getElementById('cronometro');
const configure = document.getElementById('configure');
const notifications = document.getElementById('notifications');
const notifpopup = document.getElementById('popupNot');
const submitButtonnot = document.getElementById('submitButtonnot');
const toggleNotifications = document.getElementById('toggleNotifications');
const notifinit = document.getElementById('notifinit');
const notifinter = document.getElementById('notifinter');
const notifativ = document.getElementById('notifativ');


const apiUrlLembrete = 'https://json-server-web-api-tarefas.gustavoalvaren3.repl.co/lembretes';


const toggleState = localStorage.getItem('toggleState');

document.addEventListener('DOMContentLoaded', function () {

  function salvarEstadoToggle(id, checked) {
    localStorage.setItem(id, checked ? 'ativado' : 'desativado');
  }


  if (document.getElementById('notifinit') != null)
    document.getElementById('notifinit').addEventListener('change', function () {
      salvarEstadoToggle('notifinit', this.checked);
    });

  if (document.getElementById('notifinter') != null)
    document.getElementById('notifinter').addEventListener('change', function () {
      salvarEstadoToggle('notifinter', this.checked);
    });

  if (document.getElementById('notifativ') != null)
    document.getElementById('notifativ').addEventListener('change', function () {
      salvarEstadoToggle('notifativ', this.checked);
    });


  if (localStorage.getItem('notifinit') != null) {
    const estadosIniciais = {
      'notifinit': localStorage.getItem('notifinit') === 'ativado',
      'notifinter': localStorage.getItem('notifinter') === 'ativado',
      'notifativ': localStorage.getItem('notifativ') === 'ativado',
    };
  }


  if (document.getElementById('notifinit') != null) {
    document.getElementById('notifinit').checked = estadosIniciais['notifinit'];
    document.getElementById('notifinter').checked = estadosIniciais['notifinter'];
    document.getElementById('notifativ').checked = estadosIniciais['notifativ'];
  }
});


document.addEventListener('DOMContentLoaded', function () {


  if (toggleState === 'ativado' && toggleNotifications !== null) {
    toggleNotifications.checked = true;
  }


  if (toggleNotifications !== null)
    toggleNotifications.addEventListener('change', function () {
      const permitirNotificacoes = toggleNotifications.checked;


      localStorage.setItem('toggleState', permitirNotificacoes ? 'ativado' : 'desativado');


      if (permitirNotificacoes) {

      }
    });








  if ('Notification' in window) {

    Notification.requestPermission().then(function (permission) {
      if (permission === 'granted') {

        const notification = new Notification('Título da Notificação', {
          body: 'Corpo da Notificação',

        });


        notification.addEventListener('click', function () {
          console.log('Notificação clicada');
        });
      } else {
        console.warn('Permissão para notificações negada pelo usuário');
      }
    });
  } else {
    console.error('Este navegador não suporta a API de Notificações');
  }


  function enviarNotificacao() {

    if ('Notification' in window) {

      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {

          const notification = new Notification('Título da Notificação', {
            body: 'Corpo da Notificação',

          });


          notification.addEventListener('click', function () {
            console.log('Notificação clicada');
          });
        } else {
          console.warn('Permissão para notificações negada pelo usuário');
        }
      });
    } else {
      console.error('Este navegador não suporta a API de Notificações');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {

    if ('Notification' in window) {

      if (Notification.permission === 'granted') {
        console.log('Notificações permitidas');
      } else if (Notification.permission !== 'denied') {

        document.getElementById('configurarNotificacoes');
      }
    }


    document.getElementById('configurarNotificacoes').addEventListener('click', function () {
      const toggleNotifications = document.getElementById('toggleNotifications');


      if (toggleNotifications.checked) {

        Notification.requestPermission().then(function (permission) {
          if (permission === 'granted') {
            console.log('Notificações permitidas');
          }
        });
      } else {

        Notification.requestPermission().then(function (permission) {
          if (permission === 'granted') {

            let notifications = window.open('', '_self', '');
            notifications.close();


            console.log('Notificações desativadas');
          }
        });
      }
    });
  });

  let segundos = 0;
  let clique = false;
  let ativ = true;

  if (configure !== null)
    configure.addEventListener('click', () => {

      popup.style.display = 'block';
      {
        clearInterval(cronometro);
        if (clique = true) {
          clique = false
        }
      }


    });

  if (notifications !== null) {
    notifications.addEventListener('click', () => {

      notifpopup.style.display = 'block';
    })
    submitButtonnot.addEventListener('click', () => {
      notifpopup.style.display = 'none';
    })




    submitButton.addEventListener('click', () => {

      const dados = {
        tempoAtividade: tempoAtividadeInput.value,
        tempoIntervalo: tempoIntervaloInput.value,
        numRepeticoes: numRepeticoesInput.value,
      };

      if (!tempoAtividadeInput.value || !tempoIntervaloInput.value || !numRepeticoesInput.value) {

        popup.style.display = 'none';
      }
      else {

        if ((tempoAtividadeInput.value) < 0 || (tempoIntervaloInput.value) < 0 || (numRepeticoesInput.value) < 0) {
          alert('Certifique-se que os valores são maiores que 0 e o tempo de atividade maior que o intervalo')
        }
        else {
          if (clique = true) {
            clique = false
            clearInterval(cronometro);
            segundos = 0;
            cronometroDisplay.innerHTML = "00" + ":" + 0 + 0;
          }
          localStorage.setItem('dados', JSON.stringify(dados));

          popup.style.display = 'none';
        }
      }
    });


    startButton.addEventListener('click', () => {
      if (!clique) {
        cronometro = setInterval(() => {
          segundos++;
          atualizarCronometro(cronometroDisplay);
        }, 1000);

        if (notifinit.checked && (toggleNotifications.checked)) {
          ativarNotificacoes();
        }


        clique = true
      }

    });

    function atualizarCronometro(display) {


      let minutos = Math.floor(segundos / 60);
      let segundosExibicao = segundos % 60;

      const minutosFormatados = minutos < 10 ? '0' + minutos : minutos;
      const segundosFormatados = segundosExibicao < 10 ? '0' + segundosExibicao : segundosExibicao;


      display.innerHTML = minutosFormatados + ':' + segundosFormatados;

      const atv = true
      const Caudio = new Audio('Beautiful-Music.mp3')

      if (numRepeticoesInput.value == 0) {
        clearInterval(cronometro);
        segundos = 0;
        cronometroDisplay.innerHTML = "00" + ":" + 0 + 0;
      }

      else {

        if (minutos >= tempoIntervaloInput.value && ativ == false) {
          clearInterval(cronometro);
          segundos = 0;
          cronometroDisplay.innerHTML = "00" + ":" + 0 + 0;
          if (tempoAtividadeInput.value > 0 || tempoIntervaloInput.value > 0 || numRepeticoesInput.value > 0) {
            Caudio.play();
            numRepeticoesInput.value--;
          }
          cronometro = setInterval(() => {
            segundos++;
            atualizarCronometro(cronometroDisplay);
          }, 1000)

          if (notifinter.checked && (toggleNotifications.checked)) {
            ativarNotificacoes();
          }



          ativ = true;
        }

        else {

          if (minutos >= tempoAtividadeInput.value && atv === true) {
            clearInterval(cronometro);
            segundos = 0;
            cronometroDisplay.innerHTML = "00" + ":" + 0 + 0;
            if (tempoAtividadeInput.value > 0 || tempoIntervaloInput.value > 0 || numRepeticoesInput.value > 0) {
              Caudio.play();
            }
            cronometro = setInterval(() => {
              segundos++;
              atualizarCronometro(cronometroDisplay);
            }, 1000)

            if (notifativ.checked && (toggleNotifications.checked)) {
              ativarNotificacoes();
            }

            ativ = false;
          }
        }
      }
    }
  }

  function ativarNotificacoes() {
    fetch(apiUrlLembrete)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro na solicitação: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {

        if (data && (Array.isArray(data) || typeof data === 'string')) {
          const lembretes = typeof data === 'string' ? JSON.parse(data) : data;


          if (Array.isArray(lembretes)) {

            lembretes.forEach(lembrete => {
              if (lembrete.content) {
                alert(lembrete.title + ':' + lembrete.content);

              }
            });
          } else {
            console.error('Estrutura de dados inválida: "lembretes" não é um array.');
          }
        } else {
          console.error('Estrutura de dados inválida ou ausência de lembretes.');
        }
      })
      .catch(error => {
        console.error('Erro ao fazer a solicitação:', error);
      });
  }
});



const formAddTask = document.getElementById('formAddTask')
const formEditTask = document.getElementById('formEditTask')


const btnCreateTask = document.getElementById('btnCreateTask')
const btnEditTask = document.getElementById('btnEditTask')
const btnDeleteTask = document.getElementById('btnDeleteTask')


const titleInput = document.getElementById('title')
const descriptionInput = document.getElementById('description')
const dateInput = document.getElementById('end-date')
const priorityInput = document.getElementById('priority')


const idEditInput = document.getElementById('idEditInput')
const titleEditInput = document.getElementById('titleEditInput')
const descriptionEditInput = document.getElementById('descriptionEditInput')
const dateEditInput = document.getElementById('dateEditInput')
const priorityEditInput = document.getElementById('priorityEditInput')
const statusEditInput = document.getElementById('statusEditInput')
const lateEditInput = document.getElementById('lateEditInput')


const deleteId = document.getElementById('inputDeleteId')


let date = new Date()
let formatedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

if (dateInput != null) {
  dateInput.value = `${formatedDate}T23:59`
}


if (btnCreateTask != null)
  btnCreateTask.addEventListener('click', event => {

    event.preventDefault()

    if (!formAddTask.checkValidity()) {

      checkInputValid(titleInput)
      checkInputValid(descriptionInput)
      checkInputValid(dateInput)

      return
    }

    let status = statusEditInput.value !== '' ? returnValueById('statusEditInput') : 0;

    let task = {
      id: 0,
      title: returnValueById('title'),
      description: returnValueById('description').replace(/(\r\n|\n|\r)/gm, ""),
      start: returnValueById('end-date'),
      priority: returnValueById('priority'),
      status: status,
      late: false
    }

    createTask(task)

    formAddTask.reset()
    $('#modalAddTask').modal('toggle')


    if (document.getElementById('lista') != null)
      setTimeout(() => {
        readTasks()
        window.scrollTo(0, document.body.scrollHeight)
      }, 2000)

  })


if (btnEditTask != null)
  btnEditTask.addEventListener('click', event => {

    event.preventDefault()

    if (!formEditTask.checkValidity()) {

      checkInputValid(titleEditInput)
      checkInputValid(descriptionEditInput)
      checkInputValid(dateEditInput)

      return
    }

    let task = {
      title: returnValueById('titleEditInput'),
      description: returnValueById('descriptionEditInput').replace(/(\r\n|\n|\r)/gm, ""),
      start: returnValueById('dateEditInput'),
      priority: returnValueById('priorityEditInput'),
      status: returnValueById('statusEditInput'),
      late: returnValueById('lateEditInput')
    }

    let id = parseInt(returnValueById('idEditInput'))

    updateTask(id, task)

    formAddTask.reset()
    $('#modalEditTask').modal('toggle')


    if (document.getElementById('lista') != null) {
      setTimeout(() => {
        readTasks()
      }, 2000)
    }

    if (document.getElementById('kanban') != null) {
      $(`#task${id}`).closest('.task').remove();
      task.id = id;
      showtasks([task]);
    }

  })


if (btnCreateTask != null)
  btnDeleteTask.addEventListener('click', () => {

    let id = parseInt(returnValueById('inputDeleteId'))

    deleteTask(id)

    $(`#task${id}`).closest('.task').remove();

    $('#modalDeleteTask').modal('toggle')


    setTimeout(() => {
      readTasks()
    }, 2000)
  })



const returnValueById = id => document.getElementById(id).value


function checkInputValid(input) {

  if (input.value == '')
    input.classList.add('is-invalid')
  else
    input.classList.remove('is-invalid')
}


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

function formatStatus(status) {
    if (status == 0) return 'To-Do'
    else if (status == 1) return 'Doing'
    else if (status == 2) return 'Done'
}


function showTasks(tasks) {

  const table = document.getElementById('tasksTable');
  let content = '';

  tasks.forEach(task => {

    content +=
      `<tr>
        <td>${task.id}</td> 
        <td>${task.title}</td> 
        <td>${task.description}</td> 
        <td>${formatDate(task.start)}</td> 
        <td>${formatPriority(task.priority)}</td> 
        <td>${formatStatus(task.status)}</td>
        <td class="text-center"><i class="bi bi-pencil" title="Editar" 
        onclick="showTask(${task.id}, '${task.title}', '${task.description}','${task.start}','${task.priority}', ${task.status}, '${task.late}')">
        </i></td> 

        <td class="text-center"><i class="bi bi-trash" title="Excluir"
            onclick="deleteConfirm(${task.id})"></i>
        </td>  
    </tr>`

  })
  if (table != null)
    table.innerHTML = content
}

function showTask(id, title, description, start, priority, status, late) {

  idEditInput.value = id
  titleEditInput.value = title
  descriptionEditInput.value = description
  dateEditInput.value = start
  priorityEditInput.value = priority
  statusEditInput.value = status
  lateEditInput.value = late

  $('#modalEditTask').modal('toggle')
}

function deleteConfirm(id) {

  deleteId.value = id;
  $('#modalDeleteTask').modal('toggle')
}


function createTask(task) {
  fetch(apiURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)

  })
    .then(res => {
      if (res.status == 201) { displaySuccsMessage('Tarefa adicionada com sucesso!'); return res.json(); }
      else { displayErrMessage('A tarefa não foi adicionada!'); throw new Error('Erro ao adicionar a tarefa'); }

    })
    .then(data => showtasks([data]))
    .catch(error => {
      console.error(error)
    })
}

function readTasks() {
  fetch(apiURL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => showTasks(data))
    .catch(error => {
      console.error(error)
    })
}

function readTask(id) {
  fetch(`${apiURL}/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => { showTask(data) })
    .catch(error => {
      console.error(error)
    })
}

function updateTask(id, task) {
  fetch(`${apiURL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)

  })
    .then(res => {
      if (res.status == 200) displaySuccsMessage('Tarefa atualizada com sucesso!')
      else displayErrMessage('A tarefa não foi atualizada!')
    })
    .catch(error => {
      console.error(error)
    })
}

function deleteTask(id) {
  fetch(`${apiURL}/${id}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (res.status == 200) displaySuccsMessage('Tarefa excluída com sucesso!')
      else displayErrMessage('Não foi possível excluir a tarefa')
    })
    .catch(error => {
      console.error(error)
    })
}


if (document.getElementById('calendar') != null)
  fetch('https://json-server-web-api-tarefas.gustavoalvaren3.repl.co/tarefas')
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
      tarefas = data; // Armazena os dados da resposta na array de tarefas


      jQuery(function () {
        jQuery('#calendar').fullCalendar({

          businessHours: false,
          defaultView: 'month',
          editable: true,
          height: 600,
          header: {
            left: 'title',
            center: 'month,agendaWeek,agendaDay',
            right: 'prev, today, next'
          },
          events: tarefas, // Adiciona as tarefas ao calendário como eventos    
          eventDrop: function (evento, delta, revertFunc) {
            const eventoAtualizado = {
              start: evento.start.format(), // Atualiza a data de início da tarefa
              end: evento.end ? evento.end.format() : null // Atualiza a data de término da tarefa, se existir
            };


            fetch(`https://json-server-web-api-tarefas.gustavoalvaren3.repl.co/tarefas/${evento.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(eventoAtualizado) // Inclui todas as informações necessárias
            })
              .then(response => response.json()) // Converte a resposta para JSON
              .then(updatedEvent => {

                const index = tarefas.findIndex(tarefa => tarefa.id === updatedEvent.id);
                tarefas[index] = updatedEvent;


                jQuery('#calendar').fullCalendar('refetchEvents');
              })
              .catch(error => {
                console.error('Erro ao atualizar a tarefa:', error);
                revertFunc(); // Reverte a mudança se houver um erro na atualização
              });
          },
          eventRender: function (event, element) {

            if (event.end && event.end.isBefore(moment())) {

              element.css('background-color', 'red');
              if (event.late !== true) {
                const eventoAtualizado = {
                  late: true
                };


                fetch(`https://json-server-web-api-tarefas.gustavoalvaren3.repl.co/tarefas/${event.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(eventoAtualizado), // Inclui todas as informações necessárias
                })
              }
            } else if (event.late !== false) {
              const eventoAtualizado = {
                late: false
              };


              fetch(`https://json-server-web-api-tarefas.gustavoalvaren3.repl.co/tarefas/${event.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventoAtualizado), // Inclui todas as informações necessárias
              })
            }
          },
          dayClick: function(date) {
            formAddTask.reset();
            let formattedDate = date.format('YYYY-MM-DD  HH:mm').replace('  ', 'T');
            document.querySelector("#end-date").value = formattedDate;
            $('#modalAddTask').modal('toggle');
          },

          locale: 'pt-br', // Define o idioma para português brasileiro
          buttonText: {
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
          },
          monthNames: [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
          ],
          monthNamesShort: [
            'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
          ],
          dayNames: [
            'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
          ],
          dayNamesShort: [
            'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
          ]
        });
      });
    })
    .catch(error => {
      console.error('Erro:', error);
      window.alert('Erro ao carregar as tarefas\nContate o desenvolvedor!\n\n Espere 5 segundos para o JSON server iniciar e tente recarregar a página...'); // Exibe um alerta em caso de erro
    });