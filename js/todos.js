const taskDateFormat = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  weekday: 'long',
};

class Todos {
  constructor () {
    this.elements = {
      $form: document.forms.addTodo,
      $newTodoTitle: document.forms.addTodo.todoTitle,
      $newTodoDate: document.forms.addTodo.todoDate,
      $newTodoDescription: document.forms.addTodo.todoDescription,
      $todoList: todoList,
      $showFormBtn: document.querySelector('.show-form-btn'),
    };

    // Set default date
    this.elements.$newTodoDate.valueAsDate = new Date();
  }

  init(userId) {
    if (typeof(auth) !== 'undefined' && auth.authorized) {
      userId = userId || auth.userId;
      this.list = storage.getTodos(userId);
      this.render();

      setTimeout(() => {
        if (auth.anotherUser) {
          this.elements.$showFormBtn.style.display = 'none';
        } else {
          this.elements.$showFormBtn.style.display = 'block';
        }
      }, 0);

    }
  }

  addTodo() {
    let todo = {
      id: this.generateId(),
      userId: auth.userId,
      title: this.elements.$newTodoTitle.value,
      description: this.elements.$newTodoDescription.value,
      date: Date.parse(this.elements.$newTodoDate.value),
      completed: false,
    };

    this.list.push(todo);
    this.recalculateTodosOrders();
    this.render();
    storage.saveTodos(this.list);

    this.clearInputs();
    this.hideAddingForm();
  }

  editTodo(todoId) {
    let todo = this.getTodoById(todoId);
    let $todoEditForm = document.getElementById(todo.id);

    if (todo.completed || auth.anotherUser) return;

    $todoEditForm.classList.add('todo--editing');
    $todoEditForm.todoDateEdit.valueAsDate = new Date(todo.date);
  }

  toggleCompleteTodo(todoId) {
    if (auth.anotherUser) {
      alert(app.messages.NO_ACCESS);
      return;
    }

    let todo = this.getTodoById(todoId);

    todo.completed = !todo.completed;
    this.render();
    storage.saveTodos(this.list);
  }

  updateTodo(todoId) {
    if (auth.anotherUser) {
      alert(app.messages.NO_ACCESS);
      return;
    }

    let todo = this.getTodoById(todoId);
    let $todo = document.getElementById(todo.id);

    todo.date = Date.parse($todo.todoDateEdit.value);
    todo.title = $todo.todoTitleEdit.value;
    todo.description = $todo.todoDescriptionEdit.value;

    $todo.classList.remove('todo--editing');

    this.render();
    storage.saveTodos(this.list);
  }

  deleteTodo(todoId) {
    if (auth.anotherUser) {
      alert(app.messages.NO_ACCESS);
      return;
    }

    if (confirm(app.messages.DELETE_QUESTION)) {
      let newList = this.list.filter(item => item.id !== todoId);
      this.list = newList;

      this.recalculateTodosOrders();
      this.render();
      storage.saveTodos(this.list);
    }
  }

  sortTodos() {
    this.list.sort((a, b) => a.order - b.order);
  }

  recalculateTodosOrders() {
    this.list.map((item, index) => {
      item.order = index;
    });
  }

  // Render on any todo.list changing
  render() {
    // Clear on re-render
    this.elements.$todoList.innerHTML = '';

    // Sort todos by order
    this.sortTodos();

    let activeTodos = this.list.filter(item => !item.completed);
    let completedTodos = this.list.filter(item => item.completed);
    let todos = [...activeTodos, ...completedTodos];

    for (let todo of todos) {
      let li = document.createElement('li');
      let formattedDate = new Date(todo.date).toLocaleString("ru", taskDateFormat);
      let prettyDate = dates.prettify(todo.date);
      let additionalClass = '';

      if (todo.completed) additionalClass += 'todo--completed ';

      li.innerHTML = `
        <form class="todo ${additionalClass}" ondblclick="todos.editTodo('${todo.id}')" onsubmit="todos.updateTodo('${todo.id}'); return false" id="${todo.id}">
          <button class="todo__complete-btn" type="button" onclick="todos.toggleCompleteTodo('${todo.id}')" title="Завершить задачу"></button>
          <div class="todo__body">
            <div class="todo__create-date">
              <span>${prettyDate} (${formattedDate})</span>
              <input type="date" name="todoDateEdit" required autocomplete="off">
            </div>
            <div class="todo__title">
              <span>${todo.title}</span>
              <input type="text" name="todoTitleEdit" value="${todo.title}" placeholder="Что нужно сделать?" required autocomplete="off">
            </div>
            <div class="todo__description">
              <span>${todo.description}</span>
              <input type="text" name="todoDescriptionEdit" value="${todo.description}" placeholder="Краткое описание задачи" autocomplete="off">
            </div>
          </div>
          <button class="todo__button todo__button--save" type="submit" title="Сохранить изменения"></button>
          <button class="todo__button todo__button--delete" type="button" onclick="todos.deleteTodo('${todo.id}')" title="Удалить таск"></button>
        </form>
      `;

      this.elements.$todoList.appendChild(li);
    }
  }

  // --> Helpers
  clearInputs() {
    this.elements.$newTodoTitle.value = '';
    this.elements.$newTodoDate.valueAsDate = new Date();
    this.elements.$newTodoDescription.value = '';
  }

  getTodoById(todoId) {
    return this.list.filter(item => item.id === todoId)[0];
  }

  generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  showAddingForm() {
    this.elements.$form.style.display = 'flex';
    this.elements.$showFormBtn.style.display = 'none';
    this.elements.$newTodoTitle.focus();
  }

  hideAddingForm() {
    this.elements.$form.style.display = 'none';
    this.elements.$showFormBtn.style.display = 'block';
  }
  // <-- Helpers
};

let todos = new Todos();
