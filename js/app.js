class App {
  constructor() {
    this.elements = {
      $title: appTitle,
    }

    this.messages = {
      UNAUTHORIZED_TITLE: 'Авторизуйтесь в Facebook',
      DEFAULT_TITLE: 'TODOs',
      NO_ACCESS: 'Вы не можете редактировать чужие записи.',
      DELETE_QUESTION: 'Действительно удалить таск?',
    }
  }

  setTitle(text) {
    this.elements.$title.textContent = text;
  }
}

let app = new App();
