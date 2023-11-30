// Declaração de uma array vazia para armazenar as tarefas
let tarefas = [];

// Fetching dos dados da API usando a URL fornecida
fetch('https://json-server-web-api-tarefas.gustavoalvaren3.repl.co/tarefas')
  .then(response => response.json()) // Converte a resposta para JSON
  .then(data => {
    tarefas = data; // Armazena os dados da resposta na array de tarefas

    // Configuração do calendário após os dados serem carregados
    jQuery(function () {
      jQuery('#calendar').fullCalendar({
        // Configurações do calendário
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

          // Envia uma requisição PATCH para atualizar as informações da tarefa no servidor
          fetch(`https://json-server-web-api-tarefas.gustavoalvaren3.repl.co/tarefas/${evento.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventoAtualizado) // Inclui todas as informações necessárias
          })
            .then(response => response.json()) // Converte a resposta para JSON
            .then(updatedEvent => {
              // Atualiza a tarefa na lista local com os dados atualizados
              const index = tarefas.findIndex(tarefa => tarefa.id === updatedEvent.id);
              tarefas[index] = updatedEvent;

              // Atualiza o calendário com as tarefas atualizadas
              jQuery('#calendar').fullCalendar('refetchEvents');
            })
            .catch(error => {
              console.error('Erro ao atualizar a tarefa:', error);
              revertFunc(); // Reverte a mudança se houver um erro na atualização
            });
        },
        eventRender: function (event, element) {
          // Verifica se a tarefa está em atraso
          if (event.end && event.end.isBefore(moment())) {
            // Aplica um estilo para destacar em vermelho
            element.css('background-color', 'red');
            if (event.late !== true) {
              const eventoAtualizado = {
                late: true
              };

              // Envia uma requisição PATCH para atualizar as informações da tarefa no servidor
              fetch(`https://json-server-web-api-tarefas.gustavoalvaren3.repl.co/tarefas/${event.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventoAtualizado), // Inclui todas as informações necessárias
              })
            }
          } else if (event.late !== false){
            const eventoAtualizado = {
              late: false
            };

            // Envia uma requisição PATCH para atualizar as informações da tarefa no servidor
            fetch(`https://json-server-web-api-tarefas.gustavoalvaren3.repl.co/tarefas/${event.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(eventoAtualizado), // Inclui todas as informações necessárias
            })
          }
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
    window.alert('Erro ao carregar as tarefas\nContate o desenvolvedor!'); // Exibe um alerta em caso de erro
  });


const apiURL = 'https://json-server-web-api-tarefas.gustavoalvaren3.repl.co/tarefas';
const todo = document.getElementById('to-do');
const doing = document.getElementById('doing');
const done = document.getElementById('done');

// Formatar dados do servidor
function formatDate(dateValue) {
  let date = new Date(dateValue);
  date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  return date;
}

function formatPriority(priority) {
  if (priority == 'high') return 'ALTA';
  else if (priority == 'mid') return 'MÉDIA';
  else if (priority == 'low') return 'BAIXA';
}

// Atualizar status da tarefa no servidor
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
      btn.innerHTML = '<img src="imgs/check.png" alt="check" width="20">';
      btn.classList.add("check");
      btn.classList.remove("start");
      taskContainer.remove();
      doing.insertBefore(taskContainer, doing.firstChild);
    } else if (status === 2) {
      const taskBody = taskContainer.querySelector('.task-body');
      taskBody.classList.remove('border-danger-subtle', 'border-warning-subtle', 'border-success-subtle', 'border-start', 'rounded-start-2', 'border-5');
      taskBody.classList.add("border-5", "border-start", "border-success", "rounded-start-2");
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

function showTasks(tasks) {
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

    if (task.status == 0) {
      contentTodo += `<div class="card task">
        <div class="card-body task-body ${priorityClass}">
        <button type="button" class="btn btn-light btn-sm float-end m-1 rounded-circle"><img src="imgs/excluir.png" alt="excluir" width="15"></button>
        <button type="button" class="btn btn-light btn-sm float-end m-1 rounded-circle"><img src="imgs/editar.png" alt="editar" width="15"></button>
        <span class="id d-none">${task.id}</span>
        <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <p class="card-text">Prazo: ${formatDate(task.start)}</p>
          <p class="card-text priority">Prioridade: ${formatPriority(task.priority)}</p>
          <button type="button" class="btn btn-light btn-sm float-end start">➔</button>
        </div>
      </div>`
    }

    if (task.status == 1) {
      contentDoing += `<div class="card task">
        <div class="card-body task-body ${priorityClass}">
        <button type="button" class="btn btn-light btn-sm float-end m-1 rounded-circle"><img src="imgs/excluir.png" alt="excluir" width="15"></button>
        <button type="button" class="btn btn-light btn-sm float-end m-1 rounded-circle"><img src="imgs/editar.png" alt="editar" width="15"></button>
        <span class="id d-none">${task.id}</span>
        <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <p class="card-text">Prazo: ${formatDate(task.start)}</p>
          <p class="card-text priority">Prioridade: ${formatPriority(task.priority)}</p>
          <button type="button" class="btn btn-light btn-sm float-end check"><img src="imgs/check.png" alt="check" width="20"></button>
        </div>
      </div>`
    }

    if (task.status == 2) {
      contentDone += `<div class="card task">
          <div class="card-body task-body border-5 border-start border-success rounded-start-2">
            <button type="button" class="btn btn-light btn-sm float-end m-1 rounded-circle"><img src="imgs/excluir.png" alt="excluir" width="15"></button>
            <button type="button" class="btn btn-light btn-sm float-end m-1 rounded-circle"><img src="imgs/editar.png" alt="editar" width="15"></button>
            <span class="id d-none">${task.id}</span>
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">${task.description}</p>
            <p class="card-text">Prazo: ${formatDate(task.start)}</p>
            <p class="card-text priority">Prioridade: ${formatPriority(task.priority)}</p>
            <p class="float-end m-0 text-success task-status-completed">Tarefa completa!</p>
          </div>
        </div>`
    }

  })

  todo.innerHTML = contentTodo + todo.innerHTML;
  doing.innerHTML = contentDoing + doing.innerHTML;
  done.innerHTML = contentDone + done.innerHTML;

  addStartButtonListener();
  addCheckButtonListener();

}

function readtasks() {
  fetch(apiURL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/JSON' }
  })
    .then(res => res.json())
    .then(data => showTasks(data))
    .catch(error => {
      console.error(error)
    });
}

readtasks();

new Sortable(document.querySelector('.linha-kanban'), {
  animation: 250,
  draggable: '.coluna-kanban',
  delayOnTouchOnly: true,
  handle: '.colummn-header'
})

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
      taskBody.innerHTML += `<button type="button" class="btn btn-light btn-sm float-end start">➔</button>`;
      addStartButtonListener();
      updateStatus(taskId, 0);
    }
    if (evt.to === doing) {
      const droppedTask = evt.item;
      const taskId = droppedTask.querySelector('.id').innerText;
      const taskBody = droppedTask.querySelector('.task-body');
      taskBody.innerHTML += `<button type="button" class="btn btn-light btn-sm float-end check"><img src="imgs/check.png" alt="check" width="20"></button>`;
      addCheckButtonListener();
      updateStatus(taskId, 1);
    }
    if (evt.to === done) {
      const droppedTask = evt.item;
      const taskId = droppedTask.querySelector('.id').innerText;
      const taskBody = droppedTask.querySelector('.task-body');
      taskBody.classList.remove('border-danger-subtle', 'border-warning-subtle', 'border-success-subtle', 'border-start', 'rounded-start-2', 'border-5');
      taskBody.classList.add("border-5", "border-start", "border-success", "rounded-start-2");
      taskBody.innerHTML += `<p class="float-end m-0 text-success task-status-completed">Tarefa completa!</p>`;
      updateStatus(taskId, 2);
    }
  }
});

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
      taskBody.innerHTML += `<button type="button" class="btn btn-light btn-sm float-end start">➔</button>`;
      addStartButtonListener();
      updateStatus(taskId, 0);
    }
    if (evt.to === doing) {
      const droppedTask = evt.item;
      const taskId = droppedTask.querySelector('.id').innerText;
      const taskBody = droppedTask.querySelector('.task-body');
      taskBody.innerHTML += `<button type="button" class="btn btn-light btn-sm float-end check"><img src="imgs/check.png" alt="check" width="20"></button>`;
      addCheckButtonListener();
      updateStatus(taskId, 1);
    }
    if (evt.to === done) {
      const droppedTask = evt.item;
      const taskId = droppedTask.querySelector('.id').innerText;
      const taskBody = droppedTask.querySelector('.task-body');
      taskBody.classList.remove('border-danger-subtle', 'border-warning-subtle', 'border-success-subtle', 'border-start', 'rounded-start-2', 'border-5');
      taskBody.classList.add("border-5", "border-start", "border-success", "rounded-start-2");
      taskBody.innerHTML += `<p class="float-end m-0 text-success task-status-completed">Tarefa completa!</p>`;
      updateStatus(taskId, 2);
    }
  }
});

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
      if (priority === "Prioridade: BAIXA"){
        taskBody.classList.add("border-start", "rounded-start-2", "border-5", "border-success-subtle");
      }
      else if (priority === "Prioridade: MÉDIA") {
        taskBody.classList.add("border-start", "rounded-start-2", "border-5", "border-warning-subtle");
      }
      else if (priority === "Prioridade: ALTA") {
        taskBody.classList.add("border-start", "rounded-start-2", "border-5", "border-danger-subtle");
      }
      taskBody.innerHTML += `<button type="button" class="btn btn-light btn-sm float-end start">➔</button>`;
      addStartButtonListener();
      updateStatus(taskId, 0);
    }
    if (evt.to === doing) {
      const droppedTask = evt.item;
      const taskId = droppedTask.querySelector('.id').innerText;
      const taskBody = droppedTask.querySelector('.task-body');
      const priority = droppedTask.querySelector('.priority').innerHTML;
      if (priority === "Prioridade: BAIXA"){
        taskBody.classList.add("border-start", "rounded-start-2", "border-5", "border-success-subtle");
      }
      else if (priority === "Prioridade: MÉDIA") {
        taskBody.classList.add("border-start", "rounded-start-2", "border-5", "border-warning-subtle");
      }
      else if (priority === "Prioridade: ALTA") {
        taskBody.classList.add("border-start", "rounded-start-2", "border-5", "border-danger-subtle");
      }
      taskBody.innerHTML += `<button type="button" class="btn btn-light btn-sm float-end check"><img src="imgs/check.png" alt="check" width="20"></button>`;
      addCheckButtonListener();
      updateStatus(taskId, 1);
    }
    if (evt.to === done) {
      const droppedTask = evt.item;
      const taskId = droppedTask.querySelector('.id').innerText;
      const taskBody = droppedTask.querySelector('.task-body');
      taskBody.classList.remove('border-danger-subtle', 'border-warning-subtle', 'border-success-subtle', 'border-start', 'rounded-start-2', 'border-5');
      taskBody.classList.add("border-5", "border-start", "border-success", "rounded-start-2");
      taskBody.innerHTML += `<p class="float-end m-0 text-success task-status-completed">Tarefa completa!</p>`;
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

let segundos = 0;
let clique = false;
let ativ = true;

startButton.addEventListener('dblclick', () => {
  // Abrir o pop-up ao clicar duas vezes 
  popup.style.display = 'block';
  if (popup.style.display = 'block') {
    clearInterval(cronometro);
    if (clique = true) {
      clique = false
    }
  }
});

submitButton.addEventListener('click', () => {
  // Salvar as informações no Local Storage como JSON
  const dados = {
    tempoAtividade: tempoAtividadeInput.value,
    tempoIntervalo: tempoIntervaloInput.value,
    numRepeticoes: numRepeticoesInput.value,
  };

  if (!tempoAtividadeInput.value || !tempoIntervaloInput.value || !numRepeticoesInput.value) {
    // Fechar o pop-up
    popup.style.display = 'none';
  }
  else {

    if (tempoAtividadeInput.value < 0 || tempoIntervaloInput.value < 0 || numRepeticoesInput.value < 0 || tempoIntervaloInput.value >= tempoAtividadeInput.value) {
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
      // Fechar o pop-up
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
        ativ = false;
      }
    }
  }
}