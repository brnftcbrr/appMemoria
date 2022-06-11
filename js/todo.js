// Trata a submissão do formulário de autenticação
todoForm.onsubmit = function (event) {
  event.preventDefault() // Evita o redirecionamento da página
  if (todoForm.name.value != '') {
    var data = {
      name: todoForm.name.value,
      nameLowerCase: todoForm.name.value.toLowerCase()
    }

    dbRefUsers.child(firebase.auth().currentUser.uid).push(data).then(function () {
      console.log('Disciplina "' + data.name + '" adicionada com sucesso')
    }).catch(function (error) {
      showError('Falha ao adicionar tarefa (use no máximo 30 caracteres): ', error)
    })

    todoForm.name.value = ''
  } else {
    alert('O nome da disciplina não pode ser em branco!')
  }
}

// Exibe a lista de disciplinas do usuário
function fillTodoList(dataSnapshot) {
  ulTodoList.innerHTML = ''
  var num = dataSnapshot.numChildren()
  todoCount.innerHTML = num + (num > 1 ? ' tarefas' : ' tarefa') + ':' // Exibe na interface o número de disciplinas
  dataSnapshot.forEach(function (item) { // Percorre todos os elementos
    var value = item.val()
    var li = document.createElement('li') // Cria um elemento do tipo li
    var spanLi = document.createElement('span') // Cria um elemento do tipo span
    spanLi.appendChild(document.createTextNode(value.name)) // Adiciona o elemento de texto dentro da nossa span
    spanLi.id = item.key // Define o id do spanLi como a chave da tarefa
    li.appendChild(spanLi) // Adiciona o span dentro do li

    var liRemoveBtn = document.createElement('button') // Cria um botão para a remoção da tarefa
    liRemoveBtn.appendChild(document.createTextNode('Excluir')) // Define o texto do botão como 'Excluir'
    liRemoveBtn.setAttribute('onclick', 'removeTodo(\"' + item.key + '\")') // Configura o onclick do botão de remoção 
    liRemoveBtn.setAttribute('class', 'danger todoBtn') // Define classes de estilização para o nosso botão de remoção
    li.appendChild(liRemoveBtn) // Adiciona o botão de remoção no li

    var liUpdateBtn = document.createElement('button') // Cria um botão para a atualização 
    liUpdateBtn.appendChild(document.createTextNode('Editar')) // Define o texto do botão como 'Editar'
    liUpdateBtn.setAttribute('onclick', 'updateTodo(\"' + item.key + '\")') // Configura o onclick do botão de atualização de tarefas
    liUpdateBtn.setAttribute('class', 'alternative todoBtn') // Define classes de estilização para o nosso botão de atualização
    li.appendChild(liUpdateBtn) // Adiciona o botão de atualização no li

    ulTodoList.appendChild(li) // Adiciona o li dentro da lista de tarefas
  })
}

// Remove tarefas 
function removeTodo(key) {
  var selectedItem = document.getElementById(key)
  var confimation = confirm('Realmente deseja remover a tarefa \"' + selectedItem.innerHTML + '\"?')
  if (confimation) {
    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove().then(function () {
      console.log('Disciplina "' + selectedItem.innerHTML + '" removida com sucesso')
    }).catch(function (error) {
      showError('Falha ao remover disciplina: ', error)
    })
  }
}

// Atualiza tarefas
function updateTodo(key) {
  var selectedItem = document.getElementById(key)
  var newTodoName = prompt('Escolha um novo nome para a disciplina \"' + selectedItem.innerHTML + '\".', selectedItem.innerHTML)
  if (newTodoName != '') {
    var data = {
      name: newTodoName,
      nameLowerCase: newTodoName.toLowerCase()
    }

    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).update(data).then(function () {
      console.log('Disciplina "' + data.name + '" atualizada com sucesso')
    }).catch(function (error) {
      showError('Falha ao atualizar disciplina: ', error)
    })
  } else {
    alert('O nome da disciplina não pode ser em branco')
  }
}